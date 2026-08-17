import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputPath = process.argv[2] || join(tmpdir(), "vlab-qe-convergence.json");
const mirrorPath = process.env.VLAB_QE_MIRROR_PATH || null;
const pseudoDir = process.env.VLAB_QE_PSEUDO_DIR
  || "/home/rudra/Projects/ASE/QE/pslibrary/pslibrary/pbe/PSEUDOPOTENTIALS";
const cutoffValues = [20, 25, 30, 40, 50];
const cellValues = [10, 12, 14, 16, 18];
const systems = ["benzene", "ethylene", "formaldehyde", "ammonia"];
const bohrPerAngstrom = 1.889726125;

let results = {};
try {
  results = JSON.parse(readFileSync(outputPath, "utf8"));
} catch {
  results = {};
}

function prepareInput(source, cutoff, cell) {
  const shift = (cell - 14) / 2;
  const lines = source.split("\n");
  let inPositions = false;
  return lines.map((line) => {
    if (/^ATOMIC_POSITIONS/i.test(line.trim())) {
      inPositions = true;
      return line;
    }
    if (/^(K_POINTS|CELL_PARAMETERS|ATOMIC_SPECIES)/i.test(line.trim())) inPositions = false;
    if (inPositions && /^\s*[A-Z][a-z]?\s+[-+\d.]+\s+[-+\d.]+\s+[-+\d.]+/.test(line)) {
      const [symbol, x, y, z, ...rest] = line.trim().split(/\s+/);
      return `  ${symbol}  ${(Number(x) + shift).toFixed(6)}  ${(Number(y) + shift).toFixed(6)}  ${(Number(z) + shift).toFixed(6)}${rest.length ? `  ${rest.join("  ")}` : ""}`;
    }
    if (/^\s*celldm\(1\)/i.test(line)) return `  celldm(1) = ${(cell * bohrPerAngstrom).toFixed(6)}`;
    if (/^\s*ecutwfc/i.test(line)) return `  ecutwfc = ${cutoff.toFixed(1)}`;
    if (/^\s*ecutrho/i.test(line)) return `  ecutrho = ${(cutoff * 8).toFixed(1)}`;
    if (/^\s*pseudo_dir/i.test(line)) return `  pseudo_dir = '${pseudoDir}'`;
    if (/^\s*outdir/i.test(line)) return "  outdir = './tmp'";
    return line;
  }).join("\n");
}

function parseRun(output, seconds) {
  const frontier = [...output.matchAll(/highest occupied, lowest unoccupied level \(ev\):\s*([-+\d.]+)\s+([-+\d.]+)/gi)].at(-1);
  const total = [...output.matchAll(/^!\s+total energy\s+=\s*([-+\d.]+)\s+Ry/gim)].at(-1);
  const iterationMatches = [...output.matchAll(/iteration #\s*(\d+)/gi)];
  const electronMatch = [...output.matchAll(/number of electrons\s*=\s*([\d.]+)/gi)].at(-1);
  const electrons = electronMatch ? Number(electronMatch[1]) : null;
  const bandHeaders = [...output.matchAll(/bands \(ev\):\s*\n/gi)];
  let eigenvalues = [];
  if (bandHeaders.length) {
    const start = bandHeaders.at(-1).index + bandHeaders.at(-1)[0].length;
    const tail = output.slice(start);
    const end = tail.search(/\n\s*(?:occupation numbers|the Fermi energy|highest occupied|Writing output data|End of self-consistent)/i);
    eigenvalues = (end < 0 ? tail.slice(0, 4000) : tail.slice(0, end))
      .match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[EeDd][-+]?\d+)?/g)
      ?.map((value) => Number(value.replace(/[dD]/, "E")))
      .filter(Number.isFinite) || [];
  }
  const occupiedCount = electrons == null ? 0 : Math.ceil(electrons / 2);
  const trace = iterationMatches.map((match, index) => {
    const start = match.index;
    const end = iterationMatches[index + 1]?.index ?? output.length;
    const block = output.slice(start, end);
    const energy = block.match(/total energy\s+=\s*([-+\d.]+)\s+Ry/i);
    const accuracy = block.match(/estimated scf accuracy\s+<\s*([-+\d.Ee]+)\s+Ry/i);
    return {
      iteration: Number(match[1]),
      energyRy: energy ? Number(energy[1]) : null,
      accuracyRy: accuracy ? Number(accuracy[1]) : null,
    };
  }).filter((point) => point.energyRy != null);
  const homo = frontier ? Number(frontier[1]) : null;
  const lumo = frontier ? Number(frontier[2]) : null;
  return {
    totalEnergyRy: total ? Number(total[1]) : null,
    homo,
    lumo,
    gap: homo != null && lumo != null ? lumo - homo : null,
    electrons,
    levels: eigenvalues.map((energy, index) => ({ index: index + 1, energy, occupied: index < occupiedCount })),
    iterations: iterationMatches.length,
    seconds: Number(seconds.toFixed(2)),
    converged: /convergence has been achieved/i.test(output),
    jobDone: /JOB DONE\./i.test(output),
    trace,
  };
}

function run(system, cutoff, cell) {
  const key = `${cutoff}Ry_${cell}A`;
  if (results[system]?.runs?.[key]?.jobDone && results[system].runs[key].levels?.length) return results[system].runs[key];
  const source = readFileSync(join(root, "src/data/qe", system, "scf.in"), "utf8");
  const runDir = mkdtempSync(join(tmpdir(), `vlab-qe-${system}-`));
  writeFileSync(join(runDir, "scf.in"), prepareInput(source, cutoff, cell));
  const started = performance.now();
  const child = spawnSync("pw.x", ["-in", "scf.in"], {
    cwd: runDir,
    encoding: "utf8",
    env: { ...processEnv(), OMP_NUM_THREADS: processEnv().VLAB_QE_THREADS || "6" },
    maxBuffer: 32 * 1024 * 1024,
    timeout: 10 * 60 * 1000,
  });
  const seconds = (performance.now() - started) / 1000;
  const output = `${child.stdout || ""}\n${child.stderr || ""}`;
  const parsed = parseRun(output, seconds);
  if (!parsed.jobDone) {
    console.error(output.slice(-4000));
    throw new Error(`${system} ${key} failed with status ${child.status}`);
  }
  results[system] ||= { runs: {} };
  results[system].runs[key] = { cutoffRy: cutoff, cellAngstrom: cell, ...parsed };
  writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`${system.padEnd(12)} ${key.padEnd(10)} ${seconds.toFixed(1)} s  gap=${parsed.gap.toFixed(4)} eV`);
  rmSync(runDir, { recursive: true, force: true });
  return results[system].runs[key];
}

function processEnv() {
  return globalThis.process.env;
}

for (const system of systems) {
  for (const cutoff of cutoffValues) run(system, cutoff, 14);
  for (const cell of cellValues) run(system, 30, cell);
}

for (const system of systems) {
  const runs = results[system].runs;
  results[system] = {
    cutoffSweep: cutoffValues.map((cutoff) => runs[`${cutoff}Ry_14A`]),
    cellSweep: cellValues.map((cell) => runs[`30Ry_${cell}A`]),
    referenceTrace: runs["30Ry_14A"].trace,
  };
}
writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`);
if (mirrorPath) {
  const stagedPath = `${mirrorPath}.next`;
  writeFileSync(stagedPath, `${JSON.stringify(results, null, 2)}\n`);
  renameSync(stagedPath, mirrorPath);
}
console.log(`Wrote ${outputPath}`);
if (mirrorPath) console.log(`Mirrored ${mirrorPath}`);
