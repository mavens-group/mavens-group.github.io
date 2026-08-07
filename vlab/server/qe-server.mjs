import http from "node:http";
import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { delimiter, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.QE_BRIDGE_PORT || 8787);
const MAX_BODY = 2 * 1024 * 1024;
const MAX_OUTPUT = 8 * 1024 * 1024;
const jobs = new Map();
const manuallyApprovedExecutables = new Set();
const CONFIG_FILE = join(resolve(fileURLToPath(new URL(".", import.meta.url))), "qe-paths.local");

async function loadApprovedExecutables() {
  try {
    const saved = JSON.parse(await readFile(CONFIG_FILE, "utf8"));
    for (const path of saved.executables || []) manuallyApprovedExecutables.add(resolve(path));
  } catch { /* first run or invalid old config */ }
}

async function saveApprovedExecutables() {
  await writeFile(CONFIG_FILE, `${JSON.stringify({ executables: [...manuallyApprovedExecutables] }, null, 2)}\n`, { mode: 0o600 });
}

await loadApprovedExecutables();

async function executable(path) {
  try { await access(path, constants.X_OK); return (await stat(path)).isFile(); } catch { return false; }
}

async function discoverExecutables() {
  const explicit = (process.env.QE_PW_PATHS || "").split(delimiter).filter(Boolean);
  const pathCandidates = (process.env.PATH || "").split(delimiter).flatMap((dir) => [join(dir, "pw.x"), join(dir, "pw.x.bin")]);
  const candidates = [...new Set([...explicit, ...pathCandidates, ...manuallyApprovedExecutables].map((path) => resolve(path)))];
  const valid = [];
  for (const path of candidates) if (await executable(path)) valid.push({ path, label: `pw.x — ${path}` });
  return valid;
}

async function discoverPseudoDirs() {
  const candidates = [process.env.ESPRESSO_PSEUDO, process.env.QE_PSEUDO_DIR, "/usr/share/quantum-espresso/pseudo", "/usr/local/share/quantum-espresso/pseudo"].filter(Boolean);
  const valid = [];
  for (const path of [...new Set(candidates.map((candidate) => resolve(candidate)))]) {
    try { if ((await stat(path)).isDirectory()) valid.push(path); } catch { /* optional location */ }
  }
  return valid;
}

async function matchPseudopotentials(directory, elements) {
  const resolvedDirectory = resolve(String(directory || ""));
  if (!(await stat(resolvedDirectory).catch(() => null))?.isDirectory()) throw new Error("Pseudopotential directory does not exist");
  const files = (await readdir(resolvedDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.upf$/i.test(entry.name))
    .map((entry) => entry.name);
  const matches = {};
  for (const element of elements) {
    const pattern = new RegExp(`^${String(element).replace(/[^A-Za-z]/g, "")}(?:[._-]|$)`, "i");
    const candidates = files.filter((file) => pattern.test(file)).sort((a, b) => {
      const score = (name) => (/\.pbe[-_.]/i.test(name) ? 8 : 0) + (/kjpaw/i.test(name) ? 4 : 0) + (/1\.0\.0/i.test(name) ? 2 : 0) - (/rrkjus/i.test(name) ? 1 : 0);
      return score(b) - score(a) || a.localeCompare(b);
    });
    matches[element] = { selected: candidates[0] || null, candidates };
  }
  return { directory: resolvedDirectory, fileCount: files.length, matches };
}

function json(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify(payload));
}

async function body(req) {
  let value = "";
  for await (const chunk of req) { value += chunk; if (value.length > MAX_BODY) throw new Error("Request body is too large"); }
  return JSON.parse(value || "{}");
}

async function startJob(config) {
  const allowed = await discoverExecutables();
  if (!allowed.some((item) => item.path === config.executable)) throw new Error("Executable is not in the validated discovery list");
  if (typeof config.input !== "string" || !config.input.includes("&CONTROL")) throw new Error("A valid pw.x input is required");
  const timeoutMs = Math.min(Math.max(Number(config.timeoutMs) || 120000, 5000), 900000);
  const id = randomUUID();
  const cwd = await mkdtemp(join(tmpdir(), "vlab-qe-"));
  const job = { id, status: "running", output: "", exitCode: null, signal: null, startedAt: Date.now(), cwd, process: null };
  jobs.set(id, job);
  const child = spawn(config.executable, [], { cwd, stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, OMP_NUM_THREADS: String(Math.min(Math.max(Number(config.threads) || 1, 1), 8)) } });
  job.process = child;
  const append = (chunk) => { job.output = (job.output + chunk.toString()).slice(-MAX_OUTPUT); };
  child.stdout.on("data", append); child.stderr.on("data", append);
  child.on("error", (error) => { append(`\nBridge error: ${error.message}\n`); job.status = "failed"; });
  const timer = setTimeout(() => { job.status = "timed_out"; child.kill("SIGTERM"); setTimeout(() => child.kill("SIGKILL"), 2000).unref(); }, timeoutMs);
  child.on("close", async (code, signal) => {
    clearTimeout(timer); job.exitCode = code; job.signal = signal; job.process = null; job.finishedAt = Date.now();
    if (job.status === "running") job.status = code === 0 ? "completed" : "failed";
    await rm(cwd, { recursive: true, force: true }).catch(() => {});
  });
  child.stdin.end(config.input);
  return id;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/vlab/api/qe/config") return json(res, 200, { executables: await discoverExecutables(), pseudoDirs: await discoverPseudoDirs() });
    if (req.method === "POST" && url.pathname === "/vlab/api/qe/config/executable") {
      const config = await body(req);
      const path = resolve(String(config.path || ""));
      if (!config.path || !(await executable(path))) return json(res, 400, { error: "That path is not an executable file" });
      manuallyApprovedExecutables.add(path);
      await saveApprovedExecutables();
      return json(res, 200, { path, executables: await discoverExecutables() });
    }
    if (req.method === "POST" && url.pathname === "/vlab/api/qe/config/pseudopotentials") {
      const config = await body(req);
      const elements = [...new Set((config.elements || []).map((item) => String(item)).filter((item) => /^[A-Z][a-z]?$/.test(item)))];
      if (!elements.length) return json(res, 400, { error: "At least one valid element is required" });
      return json(res, 200, await matchPseudopotentials(config.directory, elements));
    }
    if (req.method === "POST" && url.pathname === "/vlab/api/qe/run") return json(res, 202, { jobId: await startJob(await body(req)) });
    const match = url.pathname.match(/^\/vlab\/api\/qe\/jobs\/([\w-]+)$/);
    if (match && req.method === "GET") {
      const job = jobs.get(match[1]); if (!job) return json(res, 404, { error: "Job not found" });
      return json(res, 200, { id: job.id, status: job.status, output: job.output, exitCode: job.exitCode, signal: job.signal, startedAt: job.startedAt, finishedAt: job.finishedAt });
    }
    if (match && req.method === "DELETE") {
      const job = jobs.get(match[1]); if (!job) return json(res, 404, { error: "Job not found" });
      if (job.process) { job.status = "cancelled"; job.process.kill("SIGTERM"); }
      return json(res, 200, { status: job.status });
    }
    json(res, 404, { error: "Not found" });
  } catch (error) { json(res, 400, { error: error.message }); }
});

server.listen(PORT, "127.0.0.1", () => console.log(`Quantum ESPRESSO bridge listening on http://127.0.0.1:${PORT}`));
