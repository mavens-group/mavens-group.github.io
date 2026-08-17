import React, { useEffect, useMemo, useState } from "react";
import {
  Atom,
  AlertTriangle,
  BookOpenCheck,
  Check,
  Play,
  RotateCcw,
  Terminal,
  Cpu,
  Copy,
  Download,
  ExternalLink,
  FileUp,
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
import { QE_CONVERGENCE_DATA } from "../data/qeConvergenceData";
import { parseQuantumEspressoOutput } from "../utils/qeParser";
import {
  broadenLevels,
  buildDosInput,
  buildScfInput,
  dosToCsv,
  levelsToCsv,
} from "../utils/qeAnalysis";

const SYSTEMS = {
  benzene: {
    label: "Benzene",
    formula: "C₆H₆",
    electrons: 30,
    prefix: "benzene",
    atoms: [
      "C  1.3960  0.0000  0.0000", "C  0.6980  1.2090  0.0000", "C -0.6980  1.2090  0.0000",
      "C -1.3960  0.0000  0.0000", "C -0.6980 -1.2090  0.0000", "C  0.6980 -1.2090  0.0000",
      "H  2.4790  0.0000  0.0000", "H  1.2400  2.1470  0.0000", "H -1.2400  2.1470  0.0000",
      "H -2.4790  0.0000  0.0000", "H -1.2400 -2.1470  0.0000", "H  1.2400 -2.1470  0.0000",
    ],
  },
  ethylene: { label: "Ethylene", formula: "C₂H₄", electrons: 12, prefix: "ethylene", atoms: ["C -0.6695 0.0000 0.0000", "C  0.6695 0.0000 0.0000", "H -1.2321 0.9289 0.0000", "H -1.2321 -0.9289 0.0000", "H 1.2321 0.9289 0.0000", "H 1.2321 -0.9289 0.0000"] },
  formaldehyde: { label: "Formaldehyde", formula: "CH₂O", electrons: 12, prefix: "formaldehyde", atoms: ["C 0.0000 0.0000 0.0000", "O 1.2080 0.0000 0.0000", "H -0.5950 0.9370 0.0000", "H -0.5950 -0.9370 0.0000"] },
  ammonia: { label: "Ammonia", formula: "NH₃", electrons: 8, prefix: "ammonia", atoms: ["N 0.0000 0.0000 0.1170", "H 0.0000 0.9380 -0.2730", "H 0.8120 -0.4690 -0.2730", "H -0.8120 -0.4690 -0.2730"] },
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

const TAB_CLASS = "px-3 py-1.5 rounded-md text-xs font-medium transition-colors";
const TOOLTIP_STYLE = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "monospace", fontSize: 11 };

function TabButton({ active, children, ...props }) {
  return <button role="tab" aria-selected={active} className={`${TAB_CLASS} ${active ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`} {...props}>{children}</button>;
}

function ConvergenceChart({ sweep, mode, selectedIndex, onSelect }) {
  const parameter = mode === "cutoff" ? "cutoffRy" : "cellAngstrom";
  const finalEnergy = sweep.at(-1).totalEnergyRy;
  const data = sweep.map((point, index) => ({ ...point, index, energyDelta: Math.abs(point.totalEnergyRy - finalEnergy) * 1000 }));
  return (
    <div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-3">
      <ResponsiveContainer width="100%" height={310}>
        <ComposedChart data={data} margin={{ top: 20, right: 26, bottom: 8, left: 0 }} onClick={(event) => event?.activePayload?.[0] && onSelect(event.activePayload[0].payload.index)}>
          <CartesianGrid stroke="var(--border)" vertical={false}/>
          <XAxis dataKey={parameter} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: mode === "cutoff" ? "ecutwfc (Ry)" : "cell length (Å)", position: "insideBottom", offset: -6, fill: "var(--text-quaternary)", fontSize: 11 }}/>
          <YAxis yAxisId="gap" domain={["auto", "auto"]} stroke="var(--accent)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "Gap (eV)", angle: -90, position: "insideLeft", fill: "var(--accent-soft)", fontSize: 10 }}/>
          <YAxis yAxisId="energy" orientation="right" domain={[0, "auto"]} stroke="var(--warn)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "|E − Efinal| (mRy)", angle: 90, position: "insideRight", fill: "var(--warn)", fontSize: 10 }}/>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [Number(value).toFixed(name === "gap" ? 4 : 3), name === "gap" ? "HOMO–LUMO gap (eV)" : "Energy difference (mRy)"]}/>
          <Line yAxisId="gap" dataKey="gap" stroke="var(--accent)" strokeWidth={2.2} dot={({ cx, cy, index }) => <circle cx={cx} cy={cy} r={index === selectedIndex ? 6 : 3.5} fill={index === selectedIndex ? "var(--accent-soft)" : "var(--accent)"} stroke="var(--bg-canvas)" strokeWidth="2"/>} isAnimationActive={false}/>
          <Line yAxisId="energy" dataKey="energyDelta" stroke="var(--warn)" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 3 }} isAnimationActive={false}/>
        </ComposedChart>
      </ResponsiveContainer>
      <p className="px-2 text-[10px] text-[var(--text-quaternary)]">Click a point to load that archived run. Energy differences are measured against the largest parameter shown, while the molecule and all other settings stay fixed.</p>
    </div>
  );
}

function ScfReplay({ trace, frame, status }) {
  const visible = status === "ready" ? [] : trace.slice(0, frame + 1);
  const current = visible.at(-1);
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-canvas)] p-3">
      <div className="flex justify-between gap-3 mb-2 text-xs"><span className="text-[var(--text-tertiary)]">SCF convergence trace</span><span className="font-mono text-[var(--accent-soft)]">{current ? `iteration ${current.iteration} / ${trace.length}` : "not replayed"}</span></div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={visible} margin={{ top: 10, right: 8, bottom: 5, left: 5 }}>
          <CartesianGrid stroke="var(--border)" vertical={false}/>
          <XAxis dataKey="iteration" allowDecimals={false} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }}/>
          <YAxis domain={["auto", "auto"]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 9, fontFamily: "monospace" }} width={72}/>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${Number(value).toFixed(8)} Ry`, "Total energy"]}/>
          <Line type="monotone" dataKey="energyRy" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false}/>
        </ComposedChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono text-[var(--text-quaternary)]"><span>E = {current ? `${current.energyRy.toFixed(8)} Ry` : "—"}</span><span className="text-right">accuracy &lt; {current?.accuracyRy != null ? `${current.accuracyRy.toExponential(2)} Ry` : "—"}</span></div>
    </div>
  );
}

function DosChart({ result, system, sigmaEv, onSigmaChange, dos }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-3">
        <div className="grid sm:grid-cols-[1fr_230px] gap-4 items-end px-1 mb-2">
          <div><h3 className="text-sm font-semibold">DOS reconstructed from discrete eigenvalues</h3><p className="text-[10px] text-[var(--text-quaternary)]">Each level contributes a normalized Gaussian containing two states.</p></div>
          <label className="text-xs text-[var(--text-tertiary)]"><span className="flex justify-between mb-2"><span>Gaussian σ</span><strong className="font-mono text-[var(--accent-soft)]">{sigmaEv.toFixed(2)} eV</strong></span><input type="range" min="0.05" max="0.80" step="0.01" value={sigmaEv} onChange={(event) => onSigmaChange(Number(event.target.value))} className="w-full accent-[var(--accent)]"/></label>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={dos} margin={{ top: 18, right: 22, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="energy" type="number" domain={["dataMin", "dataMax"]} tickCount={9} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "monospace" }} label={{ value: "Kohn–Sham energy (eV)", position: "insideBottom", offset: -7, fill: "var(--text-quaternary)", fontSize: 11 }}/>
            <YAxis yAxisId="dos" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "DOS (states/eV)", angle: -90, position: "insideLeft", fill: "var(--text-quaternary)", fontSize: 10 }}/><YAxis yAxisId="integrated" orientation="right" stroke="var(--warn)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "Integrated states", angle: 90, position: "insideRight", fill: "var(--warn)", fontSize: 10 }}/>
            <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={(value) => `Energy ${Number(value).toFixed(3)} eV`} formatter={(value, name) => [Number(value).toFixed(4), name === "dos" ? "DOS" : "Integrated DOS"]}/><ReferenceLine yAxisId="dos" x={result.homo} stroke="var(--accent)" strokeDasharray="4 3" label={{ value: "HOMO", fill: "var(--accent-soft)", fontSize: 10 }}/><ReferenceLine yAxisId="dos" x={result.lumo} stroke="var(--warn)" strokeDasharray="4 3" label={{ value: "LUMO", fill: "var(--warn)", fontSize: 10 }}/>
            <Area yAxisId="dos" type="monotone" dataKey="dos" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={1.5} dot={false} isAnimationActive={false}/><Line yAxisId="integrated" type="monotone" dataKey="integratedDos" stroke="var(--warn)" strokeWidth={1.2} dot={false} isAnimationActive={false}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-[var(--text-quaternary)]">For finite {system.label}, the spectrum is discrete. Changing σ changes apparent peak width but never the underlying eigenvalues or HOMO–LUMO gap.</p>
    </div>
  );
}

function ImportOutput({ imported, importName, onFile }) {
  return (
    <div className="space-y-4">
      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--accent)]/60 bg-[var(--accent-glow)] p-5 text-center"><FileUp size={26} className="text-[var(--accent)] mb-2"/><strong className="text-sm">Open a pw.x output file</strong><span className="text-xs text-[var(--text-tertiary)] mt-1">Parsed locally in this browser; the file is not uploaded.</span><input type="file" accept=".out,.txt,.log" className="sr-only" onChange={onFile}/></label>
      {imported && <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-canvas)] p-4"><div className="flex items-center gap-2 mb-4"><span className={`w-2.5 h-2.5 rounded-full ${imported.jobDone && imported.scfConverged ? "bg-[var(--success)]" : "bg-[var(--warn)]"}`}/><strong className="text-sm truncate">{importName}</strong></div><div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">{[["QE version", imported.program || "not found"], ["Converged", imported.scfConverged ? "yes" : "no"], ["JOB DONE", imported.jobDone ? "yes" : "no"], ["SCF cycles", imported.scfIterations ?? "—"], ["HOMO", imported.homo == null ? "—" : `${imported.homo.toFixed(4)} eV`], ["LUMO", imported.lumo == null ? "—" : `${imported.lumo.toFixed(4)} eV`], ["Gap", imported.gap == null ? "—" : `${imported.gap.toFixed(4)} eV`], ["Total energy", imported.totalEnergyRy == null ? "—" : `${imported.totalEnergyRy.toFixed(6)} Ry`]].map(([label,value])=><div key={label} className="flex justify-between border-b border-[var(--border)] pb-2"><span className="text-[var(--text-tertiary)]">{label}</span><span className="font-mono">{value}</span></div>)}</div>{imported.errors.length > 0 && <div className="mt-4 rounded-lg bg-[var(--warn-soft)] p-3 text-xs text-[var(--warn)]"><strong>Detected output problem</strong><pre className="mt-2 whitespace-pre-wrap font-mono">{imported.errors.join("\n")}</pre></div>}</div>}
    </div>
  );
}

const DIAGNOSTICS = [
  ["SCF oscillates", "The total energy alternates instead of settling.", "Reduce mixing_beta, improve the starting density, and check occupations."],
  ["No LUMO printed", "The output contains only occupied levels.", "Increase nbnd so the calculation includes at least one empty state."],
  ["Gap changes with cell", "Periodic molecular images still interact.", "Increase vacuum and compare the gap and total energy at successive cell sizes."],
];

function Diagnostics() {
  const [open, setOpen] = useState(null);
  return <div className="grid md:grid-cols-3 gap-3">{DIAGNOSTICS.map(([title, symptom, remedy], index)=><button key={title} onClick={()=>setOpen(open === index ? null : index)} className="rounded-xl border border-[var(--border)] bg-[var(--bg-canvas)] p-4 text-left"><AlertTriangle size={17} className="text-[var(--warn)] mb-3"/><strong className="text-sm">{title}</strong><p className="text-xs text-[var(--text-tertiary)] mt-2">{symptom}</p><p className={`text-xs text-[var(--accent-soft)] mt-3 ${open === index ? "block" : "hidden"}`}><Check size={13} className="inline mr-1"/>{remedy}</p><span className="block mt-3 text-[10px] text-[var(--text-quaternary)]">{open === index ? "Hide diagnosis" : "Reveal diagnosis"}</span></button>)}</div>;
}

export default function QuantumEspressoLab() {
  const [systemKey, setSystemKey] = useState("benzene");
  const [studyMode, setStudyMode] = useState("cutoff");
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [status, setStatus] = useState("ready");
  const [frame, setFrame] = useState(-1);
  const [inputTab, setInputTab] = useState("scf");
  const [analysisTab, setAnalysisTab] = useState("frontier");
  const [sigmaEv, setSigmaEv] = useState(0.27);
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(null);
  const [importName, setImportName] = useState("");
  const system = SYSTEMS[systemKey];
  const baseReference = QE_REFERENCE_DATA[systemKey];
  const sweep = QE_CONVERGENCE_DATA[systemKey][studyMode === "cutoff" ? "cutoffSweep" : "cellSweep"];
  const result = sweep[selectedIndex];
  const trace = result.trace;
  const dos = useMemo(() => broadenLevels(result.levels, sigmaEv), [result.levels, sigmaEv]);
  const scfInput = useMemo(() => buildScfInput(baseReference.scfInput, result.cutoffRy, result.cellAngstrom), [baseReference.scfInput, result.cutoffRy, result.cellAngstrom]);
  const dosInput = useMemo(() => buildDosInput(baseReference.dosInput, sigmaEv), [baseReference.dosInput, sigmaEv]);
  const displayedInput = inputTab === "scf" ? scfInput : dosInput;
  const finished = status === "done";

  useEffect(() => {
    if (status !== "running") return undefined;
    if (frame >= trace.length - 1) { setStatus("done"); return undefined; }
    const timer = window.setTimeout(() => setFrame((value) => value + 1), 360);
    return () => window.clearTimeout(timer);
  }, [frame, status, trace.length]);

  function chooseStudy(mode) { setStudyMode(mode); setSelectedIndex(2); setStatus("ready"); setFrame(-1); }
  function choosePoint(index) { setSelectedIndex(index); setStatus("ready"); setFrame(-1); }
  function selectSystem(key) { setSystemKey(key); setSelectedIndex(2); setStatus("ready"); setFrame(-1); setImported(null); }
  function replay() { setFrame(0); setStatus("running"); }
  function reset() { setStatus("ready"); setFrame(-1); setSigmaEv(0.27); setAnalysisTab("frontier"); }
  async function copyInput() { try { await navigator.clipboard.writeText(displayedInput); setCopied(true); window.setTimeout(() => setCopied(false), 1200); } catch { setCopied(false); } }
  async function readOutput(event) { const file = event.target.files?.[0]; if (!file) return; setImportName(file.name); setImported(parseQuantumEspressoOutput(await file.text())); }
  function downloadText(filename, text) { const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]"><div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6"><div><div className="flex items-center gap-2 text-[var(--accent)] text-xs font-mono tracking-widest uppercase mb-1"><Atom size={14}/> Plane-wave DFT workbench</div><h1 className="text-2xl md:text-3xl font-semibold">Quantum ESPRESSO — Molecular Gap</h1><p className="text-[var(--text-tertiary)] text-sm mt-1 max-w-2xl">Explore genuine archived QE 7.5 runs, test numerical convergence, replay SCF iterations, and analyze your own output.</p><a href="https://mavens-group.github.io/dft-notes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-soft)]">Read the companion DFT class notes <ExternalLink size={13}/></a></div><div className="font-mono text-xs text-right text-[var(--text-quaternary)]"><div>PBE / PAW · Γ point</div><div className={finished ? "text-[var(--success)]" : status === "running" ? "text-[var(--warn)]" : "text-[var(--accent)]"}>● {finished ? "ARCHIVED RUN LOADED" : status === "running" ? "REPLAYING SCF TRACE" : "READY"}</div></div></header>
      <div className="flex flex-wrap gap-2 mb-6">{Object.entries(SYSTEMS).map(([key,item])=><button key={key} onClick={()=>selectSystem(key)} className={`px-3 py-2 rounded-lg border text-sm ${systemKey === key ? "bg-[var(--accent)] text-[var(--text-on-accent)] border-[var(--accent)]" : "bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border)]"}`}>{item.label} <span className="opacity-70">{item.formula}</span></button>)}</div>

      <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 mb-5"><div className="flex flex-wrap items-start justify-between gap-3 mb-4"><div><h2 className="font-semibold">1. Converge the numerical model</h2><p className="text-xs text-[var(--text-tertiary)] mt-1">Change one parameter at a time. Every point is the result of a completed <code>pw.x</code> calculation.</p></div><div className="flex p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)]" role="tablist"><TabButton active={studyMode === "cutoff"} onClick={()=>chooseStudy("cutoff")}>Cutoff study</TabButton><TabButton active={studyMode === "cell"} onClick={()=>chooseStudy("cell")}>Vacuum study</TabButton></div></div><div className="grid lg:grid-cols-[1.05fr_.95fr] gap-5"><StructureViewer system={system} cellLength={result.cellAngstrom}/><div><ConvergenceChart sweep={sweep} mode={studyMode} selectedIndex={selectedIndex} onSelect={choosePoint}/><div className="grid grid-cols-5 gap-2 mt-3">{sweep.map((point,index)=><button key={index} onClick={()=>choosePoint(index)} className={`rounded-lg border px-1 py-2 text-xs font-mono ${selectedIndex === index ? "border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent-soft)]" : "border-[var(--border)] text-[var(--text-tertiary)]"}`}>{studyMode === "cutoff" ? `${point.cutoffRy} Ry` : `${point.cellAngstrom} Å`}</button>)}</div></div></div></section>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex flex-wrap items-center justify-between gap-3 mb-3"><div className="flex items-center gap-2"><Terminal size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">2. Inspect the generated input</h2></div><div className="flex gap-3"><button onClick={()=>downloadText(`${system.prefix}.${inputTab}.in`,displayedInput)} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)]"><Download size={13}/>Download</button><button onClick={copyInput} className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)]"><Copy size={13}/>{copied ? "Copied" : "Copy"}</button></div></div><div className="flex p-1 mb-3 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)] w-fit" role="tablist"><TabButton active={inputTab === "scf"} onClick={()=>setInputTab("scf")}>SCF · pw.x</TabButton><TabButton active={inputTab === "dos"} onClick={()=>setInputTab("dos")}>DOS · dos.x</TabButton></div><pre className="h-[360px] overflow-auto rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] p-4 text-[11px] leading-relaxed text-[var(--text-secondary)] font-mono whitespace-pre">{displayedInput}</pre><p className="mt-2 text-[10px] text-[var(--text-quaternary)]">{inputTab === "scf" ? "The selected sweep point is applied to ecutwfc, ecutrho, cell size, and centered coordinates." : "The broadening slider is converted from eV to degauss in Ry."}</p></section>
        <aside className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><Cpu size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">3. Replay archived run</h2></div><div className="space-y-3 text-sm">{[["ecutwfc",`${result.cutoffRy} Ry`],["ecutrho",`${result.cutoffRy*8} Ry`],["Cubic cell",`${result.cellAngstrom} Å`],["Sampling","Γ point"]].map(([label,value])=><div key={label} className="flex justify-between border-b border-[var(--border)] pb-2"><span className="text-[var(--text-tertiary)]">{label}</span><span className="font-mono">{value}</span></div>)}</div><div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3 text-xs text-[var(--text-tertiary)]"><strong className="text-[var(--text-primary)]">Static-hosting mode</strong><p className="mt-1">Replay uses stored output from a real QE 7.5 calculation. It does not claim to execute <code>pw.x</code> in the browser.</p></div><div className="flex gap-2 mt-4"><button onClick={replay} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] py-2 text-sm font-semibold"><Play size={15}/>{status === "running" ? "Restart replay" : "Replay SCF trace"}</button><button onClick={reset} aria-label="Reset workbench" className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-tertiary)]"><RotateCcw size={16}/></button></div></aside>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5"><section className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><BookOpenCheck size={17} className="text-[var(--accent)]"/><h2 className="font-semibold">4. SCF convergence</h2></div><ScfReplay trace={trace} frame={frame} status={status}/></section><aside className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><h2 className="font-semibold mb-4">Selected-run results</h2><div className="space-y-3">{[["Converged",finished?(result.converged&&result.jobDone?"yes":"check output"):"—"],["HOMO",finished?`${result.homo.toFixed(4)} eV`:"—"],["LUMO",finished?`${result.lumo.toFixed(4)} eV`:"—"],["Gap, Eₗ − Eₕ",finished?`${result.gap.toFixed(4)} eV`:"—"],["SCF cycles",finished?result.iterations:"—"],["Total energy",finished?`${result.totalEnergyRy.toFixed(6)} Ry`:"—"]].map(([label,value])=><div key={label} className="flex justify-between gap-3 border-b border-[var(--border)] pb-2 text-sm"><span className="text-[var(--text-tertiary)]">{label}</span><span className="font-mono">{value}</span></div>)}</div>{finished&&<><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>downloadText(`${system.prefix}_levels.csv`,levelsToCsv(result.levels))} className="flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] p-2 text-[10px]"><Download size={12}/>Levels CSV</button><button onClick={()=>downloadText(`${system.prefix}_dos.csv`,dosToCsv(dos))} className="flex items-center justify-center gap-1 rounded-lg border border-[var(--border)] p-2 text-[10px]"><Download size={12}/>DOS CSV</button></div><div className="mt-4 rounded-xl bg-[var(--warn-soft)] border border-[var(--warn)]/30 p-3 text-xs text-[var(--text-tertiary)]"><strong className="text-[var(--warn)]">Kohn–Sham gap.</strong> It is not automatically the fundamental or optical gap.</div></>}</aside></div>

      <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 mt-5"><div className="flex flex-wrap items-start justify-between gap-3 mb-4"><div><h2 className="font-semibold">5. Analyze and verify</h2><p className="text-xs text-[var(--text-tertiary)] mt-1">Separate stored numerical data, interactive post-processing, and qualitative teaching graphics.</p></div><div className="flex flex-wrap p-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border)]" role="tablist">{[["frontier","HOMO–LUMO"],["dos","Interactive DOS"],["import","Import .out"],["diagnose","Troubleshoot"]].map(([key,label])=><TabButton key={key} active={analysisTab===key} onClick={()=>setAnalysisTab(key)}>{label}</TabButton>)}</div></div>
        {analysisTab === "dos" ? <DosChart result={result} system={system} sigmaEv={sigmaEv} onSigmaChange={setSigmaEv} dos={dos}/> : analysisTab === "import" ? <ImportOutput imported={imported} importName={importName} onFile={readOutput}/> : analysisTab === "diagnose" ? <Diagnostics/> : <div className="space-y-4"><div className="grid md:grid-cols-2 gap-4"><OrbitalView system={system} kind="homo"/><OrbitalView system={system} kind="lumo"/></div><div className="rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)]"><div className="px-3 py-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)]">Kohn–Sham energy ladder · archived pw.x eigenvalues</div><EnergyDiagram homo={result.homo} lumo={result.lumo} electronPairs={system.electrons/2} levels={result.levels}/></div><p className="text-[10px] text-[var(--text-quaternary)]">The colored orbitals are explicitly qualitative symmetry illustrations. Quantitative isosurfaces require wavefunction grids exported by <code className="text-[var(--accent-soft)]">pp.x</code>.</p></div>}
      </section>
    </div></div>
  );
}
