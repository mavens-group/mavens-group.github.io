import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createConnection } from "node:net";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function bridgeIsRunning() {
  return new Promise((resolveCheck) => {
    const socket = createConnection({ host: "127.0.0.1", port: Number(process.env.QE_BRIDGE_PORT || 8787) });
    socket.setTimeout(300);
    socket.once("connect", () => { socket.destroy(); resolveCheck(true); });
    socket.once("error", () => resolveCheck(false));
    socket.once("timeout", () => { socket.destroy(); resolveCheck(false); });
  });
}

const children = [];
if (!(await bridgeIsRunning())) children.push(spawn(process.execPath, [join(root, "server/qe-server.mjs")], { cwd: root, stdio: "inherit", env: process.env }));
else console.log("Quantum ESPRESSO bridge already running on 127.0.0.1:8787");
children.push(spawn(process.execPath, [join(root, "node_modules/vite/bin/vite.js")], { cwd: root, stdio: "inherit", env: process.env }));

let stopping = false;
function stop(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill(signal);
}
process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
for (const child of children) child.on("exit", (code) => {
  if (!stopping && code) { stop(); process.exitCode = code; }
});
