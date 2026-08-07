import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Atom,
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Copy,
  Upload,
  Square,
  RefreshCw,
} from "lucide-react";
import { parseQuantumEspressoOutput } from "../utils/qeParser";

const SYSTEMS = {
  benzene: {
    label: "Benzene",
    formula: "C₆H₆",
    electrons: 30,
    homo: -6.18,
    lumo: -1.42,
    gap: 4.76,
    prefix: "benzene",
    atoms: [
      "C  1.3960  0.0000  0.0000", "C  0.6980  1.2090  0.0000", "C -0.6980  1.2090  0.0000",
      "C -1.3960  0.0000  0.0000", "C -0.6980 -1.2090  0.0000", "C  0.6980 -1.2090  0.0000",
      "H  2.4790  0.0000  0.0000", "H  1.2400  2.1470  0.0000", "H -1.2400  2.1470  0.0000",
      "H -2.4790  0.0000  0.0000", "H -1.2400 -2.1470  0.0000", "H  1.2400 -2.1470  0.0000",
    ],
  },
  ethylene: { label: "Ethylene", formula: "C₂H₄", electrons: 12, homo: -7.12, lumo: -1.05, gap: 6.07, prefix: "ethylene", atoms: ["C -0.6695 0.0000 0.0000", "C  0.6695 0.0000 0.0000", "H -1.2321 0.9289 0.0000", "H -1.2321 -0.9289 0.0000", "H 1.2321 0.9289 0.0000", "H 1.2321 -0.9289 0.0000"] },
  formaldehyde: { label: "Formaldehyde", formula: "CH₂O", electrons: 12, homo: -6.74, lumo: -2.91, gap: 3.83, prefix: "formaldehyde", atoms: ["C 0.0000 0.0000 0.0000", "O 1.2080 0.0000 0.0000", "H -0.5950 0.9370 0.0000", "H -0.5950 -0.9370 0.0000"] },
  ammonia: { label: "Ammonia", formula: "NH₃", electrons: 8, homo: -5.96, lumo: 0.63, gap: 6.59, prefix: "ammonia", atoms: ["N 0.0000 0.0000 0.1170", "H 0.0000 0.9380 -0.2730", "H 0.8120 -0.4690 -0.2730", "H -0.8120 -0.4690 -0.2730"] },
};

function pseudoFor(symbol) {
  return `${symbol}.pbe-n-kjpaw_psl.1.0.0.UPF`;
}

function buildInput(system, ecut, vacuum, pseudoDir = "./pseudo", pseudoFiles = {}) {
  const species = [...new Set(system.atoms.map((line) => line.trim()[0]))];
  return `&CONTROL
  calculation = 'scf'
  prefix = '${system.prefix}'
  pseudo_dir = '${pseudoDir}'
  outdir = './tmp'
/
&SYSTEM
  ibrav = 1, celldm(1) = ${(vacuum * 1.889726).toFixed(3)}
  nat = ${system.atoms.length}, ntyp = ${species.length}
  ecutwfc = ${ecut}, ecutrho = ${ecut * 8}
  occupations = 'fixed'
  nbnd = ${Math.ceil(system.electrons / 2) + 4}
/
&ELECTRONS
  conv_thr = 1.0d-8
  mixing_beta = 0.3
/
ATOMIC_SPECIES
${species.map((s) => `${s}  ${s === "H" ? "1.008" : s === "C" ? "12.011" : s === "N" ? "14.007" : "15.999"}  ${pseudoFiles[s] || pseudoFor(s)}`).join("\n")}
ATOMIC_POSITIONS angstrom
${system.atoms.join("\n")}
K_POINTS gamma`;
}

function convergenceError(ecut, vacuum) {
  return 1.1 * Math.exp(-(ecut - 20) / 13) + 1.8 * Math.exp(-(vacuum - 8) / 3.8);
}

function parseAtoms(system) {
  return system.atoms.map((line, id) => {
    const [symbol, x, y, z] = line.trim().split(/\s+/);
    return { id, symbol, x: +x, y: +y, z: +z };
  });
}

function rotatePoint(point, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = point.x * cy - point.z * sy;
  const z1 = point.x * sy + point.z * cy;
  return { x: x1, y: point.y * cp - z1 * sp, z: point.y * sp + z1 * cp };
}

function project(point, yaw, pitch, scale, cx, cy) {
  const p = rotatePoint(point, yaw, pitch);
  const perspective = 1 + p.z * 0.012;
  return { x: cx + p.x * scale * perspective, y: cy - p.y * scale * perspective, z: p.z };
}

function inferBonds(atoms) {
  const radii = { H: 0.31, C: 0.76, N: 0.71, O: 0.66 };
  const bonds = [];
  for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
    const a = atoms[i], b = atoms[j];
    const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    if (d < (radii[a.symbol] + radii[b.symbol]) * 1.25) bonds.push([a, b]);
  }
  return bonds;
}

const ATOM_STYLE = {
  H: { fill: "#e2e8f0", stroke: "#94a3b8", radius: 7 },
  C: { fill: "#475569", stroke: "#cbd5e1", radius: 11 },
  N: { fill: "#3b82f6", stroke: "#bfdbfe", radius: 12 },
  O: { fill: "#ef4444", stroke: "#fecaca", radius: 12 },
};

function StructureViewer({ system, cellLength }) {
  const [yawDeg, setYawDeg] = useState(32);
  const [pitchDeg, setPitchDeg] = useState(22);
  const atoms = useMemo(() => parseAtoms(system), [system]);
  const bonds = useMemo(() => inferBonds(atoms), [atoms]);
  const yaw = yawDeg * Math.PI / 180, pitch = pitchDeg * Math.PI / 180;
  const scale = 9.2, cx = 285, cy = 175;
  const half = cellLength / 2;
  const vertices = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => ({ x: x * half, y: y * half, z: z * half }))));
  const edges = [];
  vertices.forEach((a, i) => vertices.forEach((b, j) => {
    const differences = [a.x !== b.x, a.y !== b.y, a.z !== b.z].filter(Boolean).length;
    if (j > i && differences === 1) edges.push([a, b]);
  }));
  const projectedAtoms = atoms.map((atom) => ({ ...atom, p: project(atom, yaw, pitch, 34, cx, cy) })).sort((a, b) => a.p.z - b.p.z);
  return (
    <div className="grid lg:grid-cols-[1fr_220px] gap-4 items-center">
      <svg viewBox="0 0 570 350" className="w-full h-[300px] md:h-[350px] rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)]" role="img" aria-label={`${system.label} in a ${cellLength} angstrom cubic supercell`}>
        <defs><radialGradient id="atomShine" cx="35%" cy="28%"><stop offset="0" stopColor="white" stopOpacity=".7"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient></defs>
        {edges.map(([a,b], i) => { const p1 = project(a,yaw,pitch,scale,cx,cy), p2 = project(b,yaw,pitch,scale,cx,cy); return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--accent)" strokeOpacity=".48" strokeWidth="1.4"/>; })}
        <text x="18" y="25" fill="var(--accent-soft)" fontSize="11" fontFamily="monospace">a = b = c = {cellLength}.0 Å</text>
        <text x="18" y="42" fill="var(--text-quaternary)" fontSize="10">periodic image boundary</text>
        {bonds.map(([a,b], i) => { const p1=project(a,yaw,pitch,34,cx,cy), p2=project(b,yaw,pitch,34,cx,cy); return <line key={`b${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--text-tertiary)" strokeWidth="5" strokeLinecap="round"/>; })}
        {projectedAtoms.map((atom) => { const s=ATOM_STYLE[atom.symbol]; const r=s.radius*(1+atom.p.z*.015); return <g key={atom.id}><circle cx={atom.p.x} cy={atom.p.y} r={r} fill={s.fill} stroke={s.stroke} strokeWidth="1.5"/><circle cx={atom.p.x} cy={atom.p.y} r={r} fill="url(#atomShine)"/><text x={atom.p.x} y={atom.p.y+3.5} textAnchor="middle" fill="white" fontWeight="700" fontSize="9">{atom.symbol}</text></g>; })}
        <g transform="translate(500 292)"><line x1="0" y1="0" x2="31" y2="8" stroke="#ef4444" strokeWidth="2"/><line x1="0" y1="0" x2="-7" y2="-29" stroke="#22c55e" strokeWidth="2"/><line x1="0" y1="0" x2="-18" y2="12" stroke="#3b82f6" strokeWidth="2"/><text x="35" y="12" fill="#ef4444" fontSize="10">x</text><text x="-10" y="-34" fill="#22c55e" fontSize="10">y</text><text x="-29" y="18" fill="#3b82f6" fontSize="10">z</text></g>
      </svg>
      <div className="space-y-4">
        <div><label className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2"><span>Rotate</span><span className="font-mono">{yawDeg}°</span></label><input className="w-full accent-[var(--accent)]" type="range" min="0" max="360" value={yawDeg} onChange={(e)=>setYawDeg(+e.target.value)}/></div>
        <div><label className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2"><span>Tilt</span><span className="font-mono">{pitchDeg}°</span></label><input className="w-full accent-[var(--accent)]" type="range" min="-55" max="55" value={pitchDeg} onChange={(e)=>setPitchDeg(+e.target.value)}/></div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3 text-xs text-[var(--text-tertiary)] leading-relaxed"><strong className="text-[var(--text-primary)]">{system.label}</strong><br/>{system.atoms.length} atoms centered in a cubic cell. Changing cell length expands or contracts the periodic boundary while molecular coordinates remain fixed.</div>
        <div className="flex flex-wrap gap-3 text-[10px] text-[var(--text-quaternary)]">{["C","N","O","H"].map(s=><span key={s} className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full inline-block" style={{background:ATOM_STYLE[s].fill}}/>{s}</span>)}</div>
      </div>
    </div>
  );
}

function OrbitalView({ system, kind }) {
  const atoms = parseAtoms(system);
  const heavy = atoms.filter((a) => a.symbol !== "H");
  const yaw = 28*Math.PI/180, pitch = 18*Math.PI/180, cx=160, cy=115;
  const phaseFlip = kind === "lumo";
  return (
    <div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 border-b border-[var(--border)]"><span className={`text-xs font-semibold ${kind === "homo" ? "text-[var(--accent-soft)]" : "text-[var(--warn)]"}`}>{kind.toUpperCase()} isosurface</span><span className="text-[10px] text-[var(--text-quaternary)]">qualitative</span></div>
      <svg viewBox="0 0 320 230" className="w-full h-[220px]" role="img" aria-label={`Qualitative ${kind.toUpperCase()} orbital`}>
        <defs><radialGradient id={`${kind}pos`}><stop offset="0" stopColor={kind === "homo" ? "#5eead4" : "#fbbf24"} stopOpacity=".88"/><stop offset="1" stopColor={kind === "homo" ? "#0f766e" : "#b45309"} stopOpacity=".22"/></radialGradient><radialGradient id={`${kind}neg`}><stop offset="0" stopColor="#a78bfa" stopOpacity=".85"/><stop offset="1" stopColor="#5b21b6" stopOpacity=".2"/></radialGradient></defs>
        {inferBonds(atoms).map(([a,b],i)=>{const p1=project(a,yaw,pitch,34,cx,cy),p2=project(b,yaw,pitch,34,cx,cy);return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--text-muted)" strokeWidth="4"/>})}
        {heavy.map((atom,i)=>{const top=project({...atom,z:atom.z+0.72},yaw,pitch,34,cx,cy), bottom=project({...atom,z:atom.z-0.72},yaw,pitch,34,cx,cy);const flip=phaseFlip&&i%2===1;return <g key={atom.id}><ellipse cx={top.x} cy={top.y} rx={kind === "lumo" ? 25:28} ry="17" transform={`rotate(-18 ${top.x} ${top.y})`} fill={`url(#${kind}${flip?'neg':'pos'})`} stroke={flip?"#a78bfa":kind === "homo"?"#5eead4":"#fbbf24"} strokeOpacity=".65"/><ellipse cx={bottom.x} cy={bottom.y} rx={kind === "lumo" ? 25:28} ry="17" transform={`rotate(-18 ${bottom.x} ${bottom.y})`} fill={`url(#${kind}${flip?'pos':'neg'})`} stroke={flip?(kind === "homo"?"#5eead4":"#fbbf24"):"#a78bfa"} strokeOpacity=".65"/></g>})}
        {atoms.map(a=>{const p=project(a,yaw,pitch,34,cx,cy),s=ATOM_STYLE[a.symbol];return <circle key={a.id} cx={p.x} cy={p.y} r={a.symbol==="H"?4:7} fill={s.fill} stroke={s.stroke}/>})}
        <g transform="translate(12 202)"><circle cx="5" cy="5" r="5" fill={kind === "homo"?"#5eead4":"#fbbf24"}/><text x="15" y="9" fill="var(--text-quaternary)" fontSize="9">+ phase</text><circle cx="82" cy="5" r="5" fill="#a78bfa"/><text x="92" y="9" fill="var(--text-quaternary)" fontSize="9">− phase</text></g>
      </svg>
    </div>
  );
}

function EnergyDiagram({ homo, lumo, electronPairs }) {
  const occupied = [homo - 4.3, homo - 2.7, homo - 1.45, homo];
  const empty = [lumo, lumo + 1.2, lumo + 2.1];
  const all = [...occupied, ...empty];
  const min = Math.min(...all) - 0.8;
  const max = Math.max(...all) + 0.8;
  const y = (e) => 260 - ((e - min) / (max - min)) * 220;
  return (
    <svg viewBox="0 0 440 290" className="w-full h-[290px]" role="img" aria-label="Molecular orbital energy diagram">
      <line x1="54" y1="22" x2="54" y2="264" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="16" y="20" fill="var(--text-quaternary)" fontSize="10">Energy</text>
      {occupied.map((e, i) => <g key={`o${i}`}><line x1="105" x2="235" y1={y(e)} y2={y(e)} stroke="var(--accent)" strokeWidth={i === 3 ? 4 : 2}/><text x="244" y={y(e) + 4} fill="var(--text-tertiary)" fontSize="11">{i === 3 ? `HOMO  ${e.toFixed(2)} eV` : `occupied  ${e.toFixed(2)}`}</text><text x="151" y={y(e)-5} fill="var(--accent-soft)" fontSize="12">↑↓</text></g>)}
      {empty.map((e, i) => <g key={`u${i}`}><line x1="105" x2="235" y1={y(e)} y2={y(e)} stroke={i === 0 ? "var(--warn)" : "var(--text-muted)"} strokeWidth={i === 0 ? 4 : 2}/><text x="244" y={y(e) + 4} fill="var(--text-tertiary)" fontSize="11">{i === 0 ? `LUMO  ${e.toFixed(2)} eV` : `empty  ${e.toFixed(2)}`}</text></g>)}
      <line x1="86" x2="86" y1={y(homo)} y2={y(lumo)} stroke="var(--warn)" strokeDasharray="4 3" />
      <text x="67" y={(y(homo)+y(lumo))/2} fill="var(--warn)" fontSize="11" textAnchor="middle" transform={`rotate(-90 67 ${(y(homo)+y(lumo))/2})`}>ΔE = {(lumo-homo).toFixed(2)} eV</text>
      <text x="105" y="282" fill="var(--text-quaternary)" fontSize="10">{electronPairs} occupied orbital pairs in the complete calculation</text>
    </svg>
  );
}

export default function QuantumEspressoLab() {
  const [systemKey, setSystemKey] = useState("benzene");
  const [ecut, setEcut] = useState(50);
  const [vacuum, setVacuum] = useState(18);
  const [status, setStatus] = useState("ready");
  const [copied, setCopied] = useState(false);
  const [executionMode, setExecutionMode] = useState(() => localStorage.getItem("vlab.qe.mode") || "simulation");
  const [bridge, setBridge] = useState({ loading: false, online: false, executables: [], pseudoDirs: [], error: "" });
  const [selectedExecutable, setSelectedExecutable] = useState(() => localStorage.getItem("vlab.qe.executable") || "");
  const [manualExecutable, setManualExecutable] = useState("");
  const [pseudoDir, setPseudoDir] = useState(() => localStorage.getItem("vlab.qe.pseudoDir") || "./pseudo");
  const [pseudoScan, setPseudoScan] = useState({ loading: false, fileCount: null, matches: {}, error: "" });
  const [realOutput, setRealOutput] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [resultSource, setResultSource] = useState("simulation");
  const activeJob = useRef(null);
  const system = SYSTEMS[systemKey];
  const error = convergenceError(ecut, vacuum);
  const converged = ecut >= 45 && vacuum >= 15;
  const shift = error * 0.22;
  const homo = system.homo - shift * 0.45;
  const lumo = system.lumo + shift * 0.55;
  const requiredElements = useMemo(() => [...new Set(parseAtoms(system).map((atom) => atom.symbol))], [system]);
  const pseudoFiles = useMemo(() => Object.fromEntries(Object.entries(pseudoScan.matches).map(([element, match]) => [element, match.selected]).filter(([, file]) => file)), [pseudoScan.matches]);
  const missingPseudos = executionMode === "real" ? requiredElements.filter((element) => !pseudoFiles[element]) : [];
  const input = useMemo(() => buildInput(system, ecut, vacuum, executionMode === "real" ? pseudoDir : "./pseudo", executionMode === "real" ? pseudoFiles : {}), [system, ecut, vacuum, executionMode, pseudoDir, pseudoFiles]);
  const finished = status === "done" || status === "imported";
  const displayHomo = resultSource !== "simulation" && parsedResult?.homo != null ? parsedResult.homo : homo;
  const displayLumo = resultSource !== "simulation" && parsedResult?.lumo != null ? parsedResult.lumo : lumo;

  useEffect(() => () => { if (activeJob.current) fetch(`${import.meta.env.BASE_URL}api/qe/jobs/${activeJob.current}`, { method: "DELETE" }).catch(() => {}); }, []);
  useEffect(() => { localStorage.setItem("vlab.qe.mode", executionMode); }, [executionMode]);
  useEffect(() => { if (selectedExecutable) localStorage.setItem("vlab.qe.executable", selectedExecutable); }, [selectedExecutable]);
  useEffect(() => { if (pseudoDir) localStorage.setItem("vlab.qe.pseudoDir", pseudoDir); }, [pseudoDir]);
  useEffect(() => { if (executionMode === "real") discoverBridge(); }, [executionMode]);
  useEffect(() => {
    if (executionMode !== "real" || !bridge.online || !pseudoDir) return;
    const timer = window.setTimeout(async () => {
      setPseudoScan((old) => ({ ...old, loading: true, error: "" }));
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}api/qe/config/pseudopotentials`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ directory: pseudoDir, elements: requiredElements }) });
        const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to scan directory");
        setPseudoScan({ loading: false, fileCount: data.fileCount, matches: data.matches || {}, error: "" });
      } catch (error) { setPseudoScan({ loading: false, fileCount: null, matches: {}, error: error.message }); }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [executionMode, bridge.online, pseudoDir, requiredElements]);

  async function discoverBridge() {
    setBridge((old) => ({ ...old, loading: true, error: "" }));
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/qe/config`);
      if (!response.ok) throw new Error("Local execution bridge did not respond");
      const data = await response.json();
      setBridge({ loading: false, online: true, executables: data.executables || [], pseudoDirs: data.pseudoDirs || [], error: "" });
      if (data.executables?.length) setSelectedExecutable((old) => data.executables.some((item) => item.path === old) ? old : data.executables[0].path);
      if (data.pseudoDirs?.length) setPseudoDir((old) => old === "./pseudo" ? data.pseudoDirs[0] : old);
    } catch { setBridge({ loading: false, online: false, executables: [], pseudoDirs: [], error: "Local bridge is offline. Stop the old dev server and restart with: npm run dev" }); }
  }

  async function addExecutable() {
    if (!manualExecutable.trim()) return;
    setBridge((old) => ({ ...old, loading: true, error: "" }));
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/qe/config/executable`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: manualExecutable.trim() }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Executable validation failed");
      setBridge((old) => ({ ...old, loading: false, online: true, executables: data.executables || [], error: "" }));
      setSelectedExecutable(data.path); setManualExecutable("");
    } catch (error) { setBridge((old) => ({ ...old, loading: false, error: error.message })); }
  }

  function applyOutput(output, source = "real") {
    const parsed = parseQuantumEspressoOutput(output);
    setRealOutput(output); setParsedResult(parsed); setResultSource(source);
    setStatus(parsed.homo != null && parsed.lumo != null ? (source === "import" ? "imported" : "done") : "failed");
    return parsed;
  }

  function runScf() {
    if (executionMode === "real") { runRealScf(); return; }
    setResultSource("simulation"); setParsedResult(null); setRealOutput("");
    setStatus("running");
    window.setTimeout(() => setStatus("done"), 850);
  }
  async function runRealScf() {
    if (!selectedExecutable || missingPseudos.length || pseudoScan.loading) return;
    setStatus("running"); setRealOutput(""); setParsedResult(null); setResultSource("real");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/qe/run`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ executable: selectedExecutable, input, timeoutMs: 180000, threads: 1 }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to start pw.x");
      setJobId(data.jobId); activeJob.current = data.jobId;
      while (activeJob.current === data.jobId) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        const poll = await fetch(`${import.meta.env.BASE_URL}api/qe/jobs/${data.jobId}`); const job = await poll.json();
        if (!poll.ok) throw new Error(job.error || "Lost contact with pw.x job");
        setRealOutput(job.output || "");
        if (job.status !== "running") { activeJob.current = null; setJobId(null); const parsed = applyOutput(job.output || "", "real"); if (job.status !== "completed" || !parsed.jobDone) setStatus(parsed.homo != null && parsed.lumo != null ? "done" : "failed"); break; }
      }
    } catch (error) { setRealOutput((old) => `${old}\nBridge error: ${error.message}`); setStatus("failed"); activeJob.current = null; setJobId(null); }
  }
  async function cancelJob() { if (!jobId) return; await fetch(`${import.meta.env.BASE_URL}api/qe/jobs/${jobId}`, { method: "DELETE" }).catch(() => {}); activeJob.current = null; setJobId(null); setStatus("cancelled"); }
  async function importOutput(event) { const file = event.target.files?.[0]; if (!file) return; applyOutput(await file.text(), "import"); event.target.value = ""; }
  function selectSystem(key) { setSystemKey(key); setStatus("ready"); setCopied(false); setParsedResult(null); setRealOutput(""); }
  function reset() { setEcut(50); setVacuum(18); setStatus("ready"); setCopied(false); setParsedResult(null); setRealOutput(""); }
  async function copyInput() {
    try { await navigator.clipboard.writeText(input); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } catch { setCopied(false); }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-mono tracking-widest uppercase mb-1"><Atom size={14}/> Plane-wave DFT workbench</div>
            <h1 className="text-2xl md:text-3xl font-semibold">Quantum ESPRESSO — HOMO–LUMO Gap</h1>
            <p className="text-[var(--text-tertiary)] text-sm mt-1 max-w-2xl">Prepare an isolated molecule, converge the basis and supercell, run a simulated PWscf calculation, then identify frontier orbitals from the Kohn–Sham eigenvalues.</p>
          </div>
          <div className="font-mono text-xs text-right text-[var(--text-quaternary)]"><div>PWscf / PBE · {executionMode === "real" ? "REAL EXECUTION" : "SIMULATION"}</div><div className={finished ? "text-[var(--success)]" : status === "running" ? "text-[var(--warn)]" : status === "failed" ? "text-[var(--danger)]" : "text-[var(--accent)]"}>● {status === "done" ? "JOB DONE" : status === "imported" ? "OUTPUT IMPORTED" : status === "running" ? "PW.X RUNNING" : status === "failed" ? "RUN FAILED" : status === "cancelled" ? "CANCELLED" : "INPUT READY"}</div></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(SYSTEMS).map(([key, item]) => <button key={key} onClick={() => selectSystem(key)} className={`px-3 py-2 rounded-lg border text-sm transition-colors ${systemKey === key ? "bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]" : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border)] hover:text-[var(--text-primary)]"}`}>{item.label} <span className="opacity-70">{item.formula}</span></button>)}
        </div>

        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)]">
              <button onClick={() => { setExecutionMode("simulation"); setStatus("ready"); }} className={`px-3 py-1.5 rounded-md text-xs font-medium ${executionMode === "simulation" ? "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "text-[var(--text-tertiary)]"}`}>Simulation</button>
              <button onClick={() => { setExecutionMode("real"); setStatus("ready"); }} className={`px-3 py-1.5 rounded-md text-xs font-medium ${executionMode === "real" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>Real pw.x</button>
            </div>
            {executionMode === "real" && <>
              <select value={selectedExecutable} onChange={(e)=>setSelectedExecutable(e.target.value)} className="min-w-[250px] flex-1 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)]" disabled={!bridge.executables.length}><option value="">{bridge.loading ? "Searching for pw.x…" : bridge.executables.length ? "Select executable" : "No pw.x executable discovered"}</option>{bridge.executables.map((item)=><option key={item.path} value={item.path}>{item.label}</option>)}</select>
              <button onClick={discoverBridge} title="Refresh executable discovery" className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-tertiary)]"><RefreshCw size={15} className={bridge.loading ? "animate-spin" : ""}/></button>
              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"><Upload size={14}/>Import `.out`<input type="file" accept=".out,.txt,.log" className="hidden" onChange={importOutput}/></label>
            </>}
          </div>
          {executionMode === "real" && <div className="mt-3 space-y-3"><div className="grid md:grid-cols-[1fr_auto] gap-2 items-end"><label className="text-xs text-[var(--text-tertiary)]">Executable path, if not found on PATH<input value={manualExecutable} onChange={(e)=>setManualExecutable(e.target.value)} onKeyDown={(e)=>{if(e.key === "Enter") addExecutable();}} placeholder="/usr/bin/pw.x or /opt/qe/bin/pw.x" className="mt-1 w-full bg-[var(--bg-canvas)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-xs text-[var(--text-secondary)]"/></label><button onClick={addExecutable} disabled={!bridge.online || !manualExecutable.trim() || bridge.loading} className="px-3 py-2 rounded-lg border border-[var(--accent)] text-xs text-[var(--accent)] disabled:opacity-40">Validate &amp; add</button></div><div className="grid md:grid-cols-[1fr_auto] gap-3 items-end"><label className="text-xs text-[var(--text-tertiary)]">Pseudopotential directory<input value={pseudoDir} onChange={(e)=>setPseudoDir(e.target.value)} list="qe-pseudo-dirs" className="mt-1 w-full bg-[var(--bg-canvas)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-xs text-[var(--text-secondary)]"/><datalist id="qe-pseudo-dirs">{bridge.pseudoDirs.map((dir)=><option key={dir} value={dir}/>)}</datalist></label><span className={`text-xs pb-2 ${bridge.online ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{bridge.online ? `Bridge online · ${bridge.executables.length} executable(s) found` : bridge.error || "Restart with npm run dev"}</span></div>{bridge.online && <div className={`rounded-lg border p-3 text-xs ${missingPseudos.length ? "border-[var(--danger-border)] bg-[var(--danger-soft)]" : "border-[var(--success-border)] bg-[var(--accent-glow)]"}`}><div className="flex items-center gap-2 mb-2">{pseudoScan.loading ? <RefreshCw size={14} className="animate-spin text-[var(--accent)]"/> : missingPseudos.length ? <AlertTriangle size={14} className="text-[var(--danger)]"/> : <CheckCircle2 size={14} className="text-[var(--success)]"/>}<strong className="text-[var(--text-primary)]">{pseudoScan.loading ? "Scanning .UPF files…" : pseudoScan.error ? pseudoScan.error : missingPseudos.length ? `Missing pseudopotentials: ${missingPseudos.join(", ")}` : `${pseudoScan.fileCount} .UPF files scanned`}</strong></div>{!pseudoScan.loading && Object.entries(pseudoScan.matches).map(([element, match])=><div key={element} className="grid grid-cols-[24px_1fr] gap-2 py-1 font-mono text-[11px]"><span className="text-[var(--accent)]">{element}</span><span className={match.selected ? "text-[var(--text-secondary)]" : "text-[var(--danger)]"}>{match.selected || "No matching .UPF file"}{match.candidates?.length > 1 ? ` · selected from ${match.candidates.length} matches` : ""}</span></div>)}</div>}<p className="text-[10px] text-[var(--text-quaternary)]">The bridge scans the selected directory and writes the best matching real filenames into <code>ATOMIC_SPECIES</code>. It prefers PBE PAW files when several variants exist.</p></div>}
        </section>

        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4"><div><h2 className="font-semibold">Molecular structure &amp; periodic supercell</h2><p className="text-xs text-[var(--text-tertiary)] mt-1">Rotate the model and vary the cubic cell below to inspect the vacuum separating periodic images.</p></div><span className="font-mono text-xs text-[var(--accent)]">CELL {vacuum} × {vacuum} × {vacuum} Å³</span></div>
          <StructureViewer system={system} cellLength={vacuum}/>
        </section>

        <div className="grid lg:grid-cols-3 gap-5">
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5"><Cpu size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">1. Convergence setup</h2></div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-2">Wavefunction cutoff <span className="float-right font-mono text-[var(--text-primary)]">{ecut} Ry</span></label>
            <input className="w-full accent-[var(--accent)]" type="range" min="20" max="80" step="5" value={ecut} onChange={(e) => { setEcut(+e.target.value); setStatus("ready"); }}/>
            <label className="block text-xs text-[var(--text-tertiary)] mt-5 mb-2">Cubic cell length <span className="float-right font-mono text-[var(--text-primary)]">{vacuum} Å</span></label>
            <input className="w-full accent-[var(--accent)]" type="range" min="8" max="25" step="1" value={vacuum} onChange={(e) => { setVacuum(+e.target.value); setStatus("ready"); }}/>
            <div className={`mt-5 rounded-xl border p-3 text-xs ${converged ? "border-[var(--success-border)] bg-[var(--accent-glow)]" : "border-[var(--danger-border)] bg-[var(--danger-soft)]"}`}>
              <div className="flex gap-2 items-start">{converged ? <CheckCircle2 size={16} className="text-[var(--success)] shrink-0"/> : <AlertTriangle size={16} className="text-[var(--danger)] shrink-0"/>}<div><strong className="text-[var(--text-primary)]">{converged ? "Converged settings" : "Convergence risk"}</strong><p className="text-[var(--text-tertiary)] mt-1">Estimated frontier-level error: ±{error.toFixed(2)} eV. {converged ? "Suitable for this teaching calculation." : "Increase cutoff and cell size before trusting the gap."}</p></div></div>
            </div>
            <div className="flex gap-2 mt-5"><button onClick={runScf} title={executionMode === "real" && missingPseudos.length ? `Missing .UPF files for ${missingPseudos.join(", ")}` : ""} disabled={status === "running" || (executionMode === "real" && (!selectedExecutable || missingPseudos.length > 0 || pseudoScan.loading))} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] py-2 text-sm font-semibold disabled:opacity-60"><Play size={15}/>{status === "running" ? "Running pw.x…" : executionMode === "real" ? "Run real SCF" : "Run SCF"}</button>{status === "running" && executionMode === "real" && <button onClick={cancelJob} title="Cancel pw.x" className="p-2 rounded-lg border border-[var(--danger-border)] text-[var(--danger)]"><Square size={15}/></button>}<button onClick={reset} aria-label="Reset settings" className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><RotateCcw size={16}/></button></div>
          </section>

          <section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Terminal size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">2. pw.x input</h2></div><button onClick={copyInput} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)]"><Copy size={13}/>{copied ? "Copied" : "Copy"}</button></div>
            <pre className="h-[330px] overflow-auto rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-4 text-[11px] leading-relaxed text-[var(--text-secondary)] font-mono whitespace-pre">{input}</pre>
            {executionMode === "real" && <><div className="flex items-center justify-between mt-4 mb-2"><h3 className="text-xs font-semibold text-[var(--text-secondary)]">Live pw.x output</h3><span className="font-mono text-[10px] text-[var(--text-quaternary)]">{realOutput.length.toLocaleString()} chars</span></div><pre className="h-[210px] overflow-auto rounded-xl bg-black border border-[var(--border)] p-4 text-[11px] leading-relaxed text-emerald-300 font-mono whitespace-pre-wrap">{realOutput || "Output will appear here after execution, or import an existing .out file."}</pre></>}
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="font-semibold mb-1">3. Frontier orbital analysis</h2>
            <p className="text-xs text-[var(--text-tertiary)] mb-4">The isosurfaces show orbital amplitude and phase; the ladder places the same frontier states in the calculated energy spectrum.</p>
            {!finished ? <div className="h-[420px] flex flex-col items-center justify-center text-center text-[var(--text-quaternary)]"><Atom size={38} className={status === "running" ? "animate-spin text-[var(--accent)]" : "mb-3"}/><p className="text-sm mt-3">{status === "running" ? "Diagonalizing the Kohn–Sham Hamiltonian…" : status === "failed" ? "No complete HOMO/LUMO pair could be parsed. Inspect the output console." : "Run the SCF calculation or import output to reveal orbital shapes and energies."}</p></div> : <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><OrbitalView system={system} kind="homo"/><OrbitalView system={system} kind="lumo"/></div><div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)]"><div className="px-3 py-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)]">Kohn–Sham energy ladder · {resultSource === "simulation" ? "simulated" : resultSource === "import" ? "parsed from imported output" : "parsed from pw.x"}</div><EnergyDiagram homo={displayHomo} lumo={displayLumo} electronPairs={(parsedResult?.electrons || system.electrons) / 2}/></div><p className="text-[10px] text-[var(--text-quaternary)] leading-relaxed">Orbital isosurfaces remain qualitative, symmetry-inspired teaching graphics even in real execution mode. The energies are parsed from the real output; quantitative surfaces require a subsequent <code className="text-[var(--accent-soft)]">pp.x</code> volumetric export.</p></div>}
          </section>
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Results</h2>
            <div className="space-y-3">
              {[['HOMO', finished ? `${displayHomo.toFixed(3)} eV` : '—'], ['LUMO', finished ? `${displayLumo.toFixed(3)} eV` : '—'], ['Gap, Eₗ − Eₕ', finished ? `${(displayLumo-displayHomo).toFixed(3)} eV` : '—'], ['SCF cycles', finished ? (resultSource === "simulation" ? (converged ? '8' : '15') : parsedResult?.scfIterations ?? 'not reported') : '—'], ['Total energy', finished && parsedResult?.totalEnergyRy != null ? `${parsedResult.totalEnergyRy.toFixed(6)} Ry` : '—']].map(([a,b]) => <div key={a} className="flex justify-between gap-4 border-b border-[var(--border)] pb-2 text-sm"><span className="text-[var(--text-tertiary)]">{a}</span><span className="font-mono text-[var(--text-primary)]">{b}</span></div>)}
            </div>
            {finished && <div className="mt-5 rounded-xl bg-[var(--warn-soft)] border border-[var(--warn)]/30 p-3 text-xs text-[var(--text-tertiary)]"><strong className="text-[var(--warn)]">Interpret carefully.</strong> This is a PBE Kohn–Sham eigenvalue gap, not the experimental fundamental or optical gap. Semilocal DFT usually underestimates excitation gaps.</div>}
            <div className="mt-5 text-xs text-[var(--text-quaternary)] leading-relaxed">For a closed-shell molecule with fixed occupations, the HOMO is the highest occupied eigenvalue and the LUMO is the next unoccupied state at Γ.</div>
          </section>
        </div>
      </div>
    </div>
  );
}
