import React, { useMemo, useState } from "react";
import {
  Atom,
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  Cpu,
  Copy,
  Download,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { QE_REFERENCE_DATA } from "../data/qeReferenceData";

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

function EnergyDiagram({ homo, lumo, electronPairs, levels = [] }) {
  const occupied = levels.length
    ? levels.filter((level) => level.occupied && level.energy >= homo - 6).map((level) => level.energy)
    : [homo - 4.3, homo - 2.7, homo - 1.45, homo];
  const empty = levels.length
    ? levels.filter((level) => !level.occupied && level.energy <= lumo + 3).map((level) => level.energy)
    : [lumo, lumo + 1.2, lumo + 2.1];
  const all = [...occupied, ...empty];
  const min = Math.min(...all) - 0.8;
  const max = Math.max(...all) + 0.8;
  const y = (e) => 260 - ((e - min) / (max - min)) * 220;
  return (
    <svg viewBox="0 0 440 290" className="w-full h-[290px]" role="img" aria-label="Molecular orbital energy diagram">
      <line x1="54" y1="22" x2="54" y2="264" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="16" y="20" fill="var(--text-quaternary)" fontSize="10">Energy</text>
      {occupied.map((e, i) => <g key={`o${i}`}><line x1="105" x2="235" y1={y(e)} y2={y(e)} stroke="var(--accent)" strokeWidth={i === occupied.length - 1 ? 4 : 2}/>{i === occupied.length - 1 && <text x="244" y={y(e) + 4} fill="var(--text-tertiary)" fontSize="11">{`HOMO  ${e.toFixed(3)} eV`}</text>}<text x="151" y={y(e)-4} fill="var(--accent-soft)" fontSize="10">↑↓</text></g>)}
      {empty.map((e, i) => <g key={`u${i}`}><line x1="105" x2="235" y1={y(e)} y2={y(e)} stroke={i === 0 ? "var(--warn)" : "var(--text-muted)"} strokeWidth={i === 0 ? 4 : 2}/>{i === 0 && <text x="244" y={y(e) + 4} fill="var(--text-tertiary)" fontSize="11">{`LUMO  ${e.toFixed(3)} eV`}</text>}</g>)}
      <line x1="86" x2="86" y1={y(homo)} y2={y(lumo)} stroke="var(--warn)" strokeDasharray="4 3" />
      <text x="67" y={(y(homo)+y(lumo))/2} fill="var(--warn)" fontSize="11" textAnchor="middle" transform={`rotate(-90 67 ${(y(homo)+y(lumo))/2})`}>ΔE = {(lumo-homo).toFixed(2)} eV</text>
      <text x="105" y="282" fill="var(--text-quaternary)" fontSize="10">{electronPairs} occupied orbital pairs in the complete calculation</text>
    </svg>
  );
}

function DosChart({ reference, system }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Electronic density of states</h3>
            <p className="text-[10px] text-[var(--text-quaternary)]">Gaussian broadening 0.02 Ry · absolute Kohn–Sham energy scale</p>
          </div>
          <div className="flex gap-3 text-[10px] text-[var(--text-quaternary)]">
            <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-[var(--accent)] mr-1"/>DOS</span>
            <span><i className="inline-block w-2.5 h-0.5 bg-[var(--warn)] mr-1 align-middle"/>Integrated DOS</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={reference.dos} margin={{ top: 18, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="energy" type="number" domain={["dataMin", "dataMax"]} tickCount={9} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "Energy (eV)", position: "insideBottom", offset: -7, fill: "var(--text-quaternary)", fontSize: 11 }}/>
            <YAxis yAxisId="dos" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "DOS (states/eV)", angle: -90, position: "insideLeft", fill: "var(--text-quaternary)", fontSize: 10 }}/>
            <YAxis yAxisId="integrated" orientation="right" stroke="var(--warn)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "Integrated states", angle: 90, position: "insideRight", fill: "var(--text-quaternary)", fontSize: 10 }}/>
            <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }} labelFormatter={(value) => `Energy ${Number(value).toFixed(3)} eV`} formatter={(value, name) => [Number(value).toFixed(4), name === "dos" ? "DOS" : "Integrated DOS"]}/>
            <ReferenceLine yAxisId="dos" x={reference.homo} stroke="var(--accent)" strokeDasharray="4 3" label={{ value: "HOMO", fill: "var(--accent-soft)", fontSize: 10, position: "top" }}/>
            <ReferenceLine yAxisId="dos" x={reference.lumo} stroke="var(--warn)" strokeDasharray="4 3" label={{ value: "LUMO", fill: "var(--warn)", fontSize: 10, position: "top" }}/>
            <Area yAxisId="dos" type="monotone" dataKey="dos" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={1.5} dot={false} isAnimationActive={false}/>
            <Line yAxisId="integrated" type="monotone" dataKey="integratedDos" stroke="var(--warn)" strokeWidth={1.25} dot={false} isAnimationActive={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3"><span className="text-[10px] uppercase tracking-wider text-[var(--text-quaternary)]">HOMO</span><div className="font-mono text-sm text-[var(--accent-soft)] mt-1">{reference.homo.toFixed(4)} eV</div></div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3"><span className="text-[10px] uppercase tracking-wider text-[var(--text-quaternary)]">LUMO</span><div className="font-mono text-sm text-[var(--warn)] mt-1">{reference.lumo.toFixed(4)} eV</div></div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3"><span className="text-[10px] uppercase tracking-wider text-[var(--text-quaternary)]">DOS samples</span><div className="font-mono text-sm text-[var(--text-primary)] mt-1">{reference.dos.length.toLocaleString()}</div></div>
      </div>
      <p className="text-[10px] text-[var(--text-quaternary)] leading-relaxed">The finite {system.label} molecule has discrete levels. The continuous-looking DOS is produced by the selected Gaussian broadening; peak width is not a molecular lifetime.</p>
    </div>
  );
}

export default function QuantumEspressoLab() {
  const [systemKey, setSystemKey] = useState("benzene");
  const [status, setStatus] = useState("ready");
  const [copied, setCopied] = useState(false);
  const [inputTab, setInputTab] = useState("scf");
  const [analysisTab, setAnalysisTab] = useState("frontier");
  const system = SYSTEMS[systemKey];
  const reference = QE_REFERENCE_DATA[systemKey];
  const displayedInput = inputTab === "scf" ? reference.scfInput : reference.dosInput;
  const finished = status === "done";

  function runScf() {
    setStatus("done");
  }
  function selectSystem(key) { setSystemKey(key); setStatus("ready"); setCopied(false); }
  function reset() { setStatus("ready"); setCopied(false); setAnalysisTab("frontier"); }
  async function copyInput() {
    try { await navigator.clipboard.writeText(displayedInput); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } catch { setCopied(false); }
  }
  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-mono tracking-widest uppercase mb-1"><Atom size={14}/> Plane-wave DFT workbench</div>
            <h1 className="text-2xl md:text-3xl font-semibold">Quantum ESPRESSO — HOMO–LUMO Gap</h1>
            <p className="text-[var(--text-tertiary)] text-sm mt-1 max-w-2xl">Select a molecule, inspect the prepared inputs, and click Run to reveal its stored Quantum ESPRESSO results.</p>
          </div>
          <div className="font-mono text-xs text-right text-[var(--text-quaternary)]"><div>PWscf + DOS / PBE</div><div className={finished ? "text-[var(--success)]" : "text-[var(--accent)]"}>● {finished ? "RESULTS LOADED" : "INPUT READY"}</div></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(SYSTEMS).map(([key, item]) => <button key={key} onClick={() => selectSystem(key)} className={`px-3 py-2 rounded-lg border text-sm transition-colors ${systemKey === key ? "bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]" : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border)] hover:text-[var(--text-primary)]"}`}>{item.label} <span className="opacity-70">{item.formula}</span></button>)}
        </div>

        <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4"><div><h2 className="font-semibold">Molecular structure &amp; periodic supercell</h2><p className="text-xs text-[var(--text-tertiary)] mt-1">The prepared geometry is centered in the 14 Å cubic cell used for the stored calculation.</p></div><span className="font-mono text-xs text-[var(--accent)]">CELL 14 × 14 × 14 Å³</span></div>
          <StructureViewer system={system} cellLength={14}/>
        </section>

        <div className="grid lg:grid-cols-3 gap-5">
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5"><Cpu size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">1. Calculation setup</h2></div>
            <div className="space-y-3 text-sm">
              {[["Wavefunction cutoff", `${reference.ecutwfc} Ry`], ["Density cutoff", `${reference.ecutrho} Ry`], ["Cubic cell", `${reference.cellAngstrom} Å`], ["Sampling", "Γ point"]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-[var(--border)] pb-2"><span className="text-[var(--text-tertiary)]">{label}</span><span className="font-mono text-[var(--text-primary)]">{value}</span></div>)}
            </div>
            <div className="mt-5 rounded-xl border border-[var(--success-border)] bg-[var(--accent-glow)] p-3 text-xs"><div className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[var(--success)] shrink-0"/><div><strong className="text-[var(--text-primary)]">Inputs prepared</strong><p className="text-[var(--text-tertiary)] mt-1">The demonstration loads the stored output instead of executing Quantum ESPRESSO in the browser.</p></div></div></div>
            <div className="flex gap-2 mt-5"><button onClick={runScf} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] py-2 text-sm font-semibold"><Play size={15}/>{finished ? "Run again" : "Run calculation"}</button><button onClick={reset} aria-label="Reset demonstration" className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><RotateCcw size={16}/></button></div>
          </section>

          <section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3"><div className="flex items-center gap-2"><Terminal size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">2. Quantum ESPRESSO inputs</h2></div><div className="flex items-center gap-3"><button onClick={() => downloadText(`${system.prefix}.${inputTab}.in`, displayedInput)} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)]"><Download size={13}/>Download</button><button onClick={copyInput} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)]"><Copy size={13}/>{copied ? "Copied" : "Copy"}</button></div></div>
            <div className="flex items-center gap-1 mb-3 p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)] w-fit" role="tablist" aria-label="Quantum ESPRESSO input files">
              <button role="tab" aria-selected={inputTab === "scf"} onClick={() => { setInputTab("scf"); setCopied(false); }} className={`px-3 py-1.5 rounded-md text-xs font-medium ${inputTab === "scf" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>SCF · pw.x</button>
              <button role="tab" aria-selected={inputTab === "dos"} onClick={() => { setInputTab("dos"); setCopied(false); }} className={`px-3 py-1.5 rounded-md text-xs font-medium ${inputTab === "dos" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>DOS · dos.x</button>
            </div>
            <pre className="h-[330px] overflow-auto rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-4 text-[11px] leading-relaxed text-[var(--text-secondary)] font-mono whitespace-pre">{displayedInput}</pre>
            <p className="mt-2 text-[10px] text-[var(--text-quaternary)]">{inputTab === "scf" ? "Run with: pw.x -in scf.in" : "Run after SCF with: dos.x -in dos.in. It reads the saved charge density and eigenvalues from ./tmp."}</p>
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4"><div><h2 className="font-semibold mb-1">3. Electronic structure analysis</h2><p className="text-xs text-[var(--text-tertiary)]">Compare frontier levels with the complete broadened density of states.</p></div><div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)]" role="tablist" aria-label="Electronic structure analysis"><button role="tab" aria-selected={analysisTab === "frontier"} onClick={() => setAnalysisTab("frontier")} className={`px-3 py-1.5 rounded-md text-xs font-medium ${analysisTab === "frontier" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>HOMO–LUMO</button><button role="tab" aria-selected={analysisTab === "dos"} onClick={() => setAnalysisTab("dos")} className={`px-3 py-1.5 rounded-md text-xs font-medium ${analysisTab === "dos" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>Density of states</button></div></div>
            {!finished ? <div className="h-[420px] flex flex-col items-center justify-center text-center text-[var(--text-quaternary)]"><Atom size={38} className="mb-3"/><p className="text-sm mt-3">Click Run calculation to reveal the stored HOMO–LUMO and DOS data.</p></div> : analysisTab === "dos" ? <DosChart reference={reference} system={system}/> : <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><OrbitalView system={system} kind="homo"/><OrbitalView system={system} kind="lumo"/></div><div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)]"><div className="px-3 py-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)]">Kohn–Sham energy ladder · stored pw.x eigenvalues</div><EnergyDiagram homo={reference.homo} lumo={reference.lumo} electronPairs={system.electrons / 2} levels={reference.levels}/></div><p className="text-[10px] text-[var(--text-quaternary)] leading-relaxed">Orbital isosurfaces remain qualitative, symmetry-inspired teaching graphics. Quantitative surfaces require a subsequent <code className="text-[var(--accent-soft)]">pp.x</code> volumetric export.</p></div>}
          </section>
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Results</h2>
            <div className="space-y-3">
              {[["HOMO", finished ? `${reference.homo.toFixed(4)} eV` : "—"], ["LUMO", finished ? `${reference.lumo.toFixed(4)} eV` : "—"], ["Gap, Eₗ − Eₕ", finished ? `${reference.gap.toFixed(4)} eV` : "—"], ["SCF cycles", finished ? reference.iterations : "—"], ["Total energy", finished ? `${reference.totalEnergyRy.toFixed(6)} Ry` : "—"]].map(([a,b]) => <div key={a} className="flex justify-between gap-4 border-b border-[var(--border)] pb-2 text-sm"><span className="text-[var(--text-tertiary)]">{a}</span><span className="font-mono text-[var(--text-primary)]">{b}</span></div>)}
            </div>
            {finished && <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3"><div className="text-[10px] uppercase tracking-wider text-[var(--text-quaternary)] mb-2">Calculation record</div><div className="space-y-1 text-[11px] text-[var(--text-tertiary)]"><div>{reference.program}</div><div>{reference.method}</div><div><span className="font-mono">conv_thr = {reference.convThr}</span></div></div><div className="grid grid-cols-2 gap-2 mt-3"><button onClick={() => downloadText(`${system.prefix}_levels.csv`, reference.levelsCsv)} className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2 py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent)]"><Download size={12}/>Levels CSV</button><button onClick={() => downloadText(`${system.prefix}_dos.csv`, reference.dosCsv)} className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2 py-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent)]"><Download size={12}/>DOS CSV</button></div></div>}
            {finished && <div className="mt-5 rounded-xl bg-[var(--warn-soft)] border border-[var(--warn)]/30 p-3 text-xs text-[var(--text-tertiary)]"><strong className="text-[var(--warn)]">Interpret carefully.</strong> This is a PBE Kohn–Sham eigenvalue gap, not the experimental fundamental or optical gap. Semilocal DFT usually underestimates excitation gaps.</div>}
            <div className="mt-5 text-xs text-[var(--text-quaternary)] leading-relaxed">For a closed-shell molecule with fixed occupations, the HOMO is the highest occupied eigenvalue and the LUMO is the next unoccupied state at Γ.</div>
          </section>
        </div>
      </div>
    </div>
  );
}
