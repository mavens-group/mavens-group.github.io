import React, { useState, useMemo, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceDot,
} from "recharts";
import {
  Crosshair,
  RotateCcw,
  Eye,
  RefreshCw,
  Info,
  X,
  FlaskConical,
  Waves,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Reference data — representative literature-typical band positions for
// teaching purposes, not a substitute for a real reference spectrum
// ---------------------------------------------------------------------------
const CAPPING_AGENTS = {
  PVP: {
    label: "PVP",
    full: "Polyvinylpyrrolidone",
    peaks: [
      { center: 3440, width: 220, depth: 22 },
      { center: 2950, width: 40, depth: 18 },
      { center: 1660, width: 30, depth: 55 },
      { center: 1425, width: 35, depth: 20 },
      { center: 1290, width: 40, depth: 14 },
    ],
    clue:
      "A strong carbonyl (amide I) band near 1660 cm⁻¹ with no ether C–O–C band rules out PEG, and the absence of an N–H bend near 1580 cm⁻¹ rules out chitosan.",
  },
  PEG: {
    label: "PEG",
    full: "Polyethylene glycol",
    peaks: [
      { center: 3400, width: 200, depth: 20 },
      { center: 2880, width: 35, depth: 35 },
      { center: 1460, width: 30, depth: 10 },
      { center: 1350, width: 35, depth: 8 },
      { center: 1100, width: 45, depth: 60 },
    ],
    clue:
      "A dominant C–O–C ether stretch near 1100 cm⁻¹ with no carbonyl band anywhere in the spectrum is the giveaway for a simple polyether.",
  },
  OleicAcid: {
    label: "Oleic acid",
    full: "Oleate-capped (oleic acid)",
    peaks: [
      { center: 3006, width: 25, depth: 8 },
      { center: 2924, width: 30, depth: 38 },
      { center: 2854, width: 30, depth: 34 },
      { center: 1550, width: 30, depth: 30 },
      { center: 1440, width: 30, depth: 26 },
    ],
    clue:
      "Paired carboxylate stretches near 1550 and 1440 cm⁻¹, with no free C=O near 1710 cm⁻¹, shows the acid is chemisorbed onto the surface as an oleate rather than free oleic acid.",
  },
  CTAB: {
    label: "CTAB",
    full: "Cetyltrimethylammonium bromide",
    peaks: [
      { center: 2918, width: 28, depth: 40 },
      { center: 2850, width: 28, depth: 36 },
      { center: 1470, width: 30, depth: 16 },
      { center: 950, width: 30, depth: 12 },
    ],
    clue:
      "Strong alkyl C–H stretches with no O–H, N–H, C=O, or ether band anywhere — just a weak C–N⁺ band near 950 cm⁻¹ — points to a quaternary ammonium surfactant.",
  },
  Chitosan: {
    label: "Chitosan",
    full: "Chitosan",
    peaks: [
      { center: 3350, width: 240, depth: 26 },
      { center: 2870, width: 35, depth: 14 },
      { center: 1650, width: 32, depth: 24 },
      { center: 1580, width: 32, depth: 22 },
      { center: 1050, width: 45, depth: 45 },
    ],
    clue:
      "A broad, overlapping O–H/N–H stretch plus a strong C–O ring band near 1050 cm⁻¹ and an amide-II N–H bend near 1580 cm⁻¹ is characteristic of a polysaccharide backbone.",
  },
};

const METAL_OXIDES_IR = {
  ZnO: { label: "ZnO", full: "Zinc oxide", peak: { center: 460, width: 110, depth: 38 } },
  CeO2: { label: "CeO₂", full: "Cerium oxide", peak: { center: 545, width: 90, depth: 30 } },
  TiO2: { label: "TiO₂", full: "Titania (anatase)", peak: { center: 495, width: 140, depth: 42 } },
  Fe3O4: { label: "Fe₃O₄", full: "Magnetite", peak: { center: 575, width: 100, depth: 36 } },
};

const FUNCTIONAL_GROUPS = [
  { range: [3200, 3550], label: "O–H stretch (H-bonded, broad)" },
  { range: [3300, 3500], label: "N–H stretch (amine/amide)" },
  { range: [2990, 3100], label: "=C–H stretch (alkene)" },
  { range: [2840, 2980], label: "C–H stretch (alkyl, sp³)" },
  { range: [1700, 1750], label: "C=O stretch (ester/free acid)" },
  { range: [1630, 1680], label: "C=O stretch (amide I)" },
  { range: [1540, 1580], label: "COO⁻ asym. stretch / amide II (N–H bend)" },
  { range: [1400, 1460], label: "COO⁻ sym. stretch / C–H bend" },
  { range: [1300, 1360], label: "O–H in-plane bend / C–N stretch" },
  { range: [1000, 1150], label: "C–O–C stretch (ether) / C–O (ring)" },
  { range: [900, 980], label: "C–N⁺ stretch (quaternary amine)" },
  { range: [400, 700], label: "M–O lattice stretch (metal oxide)" },
];

const MAT_KEYS = Object.keys(METAL_OXIDES_IR);
const CAP_KEYS = Object.keys(CAPPING_AGENTS);

function matchGroup(center) {
  let best = null,
    bestDist = Infinity;
  for (const g of FUNCTIONAL_GROUPS) {
    const dist =
      center >= g.range[0] && center <= g.range[1]
        ? 0
        : Math.min(Math.abs(center - g.range[0]), Math.abs(center - g.range[1]));
    if (dist < bestDist) {
      bestDist = dist;
      best = g;
    }
  }
  return bestDist <= 40 ? best : null;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generateSpectrum({ metalKey, cappingKey, coverage, noiseOn, seed }) {
  const rng = makeRng(seed);
  const capping = CAPPING_AGENTS[cappingKey];
  const metalPeak = METAL_OXIDES_IR[metalKey].peak;
  const allPeaks = [
    ...capping.peaks.map((p) => ({ ...p, depth: p.depth * coverage, isMetal: false })),
    { ...metalPeak, isMetal: true },
  ];
  const data = [];
  for (let x = 400; x <= 4000; x += 2) {
    let y = 97 - 4 * Math.sin(x / 900);
    for (const p of allPeaks) {
      const sigma = p.width / 2.3548;
      y -= p.depth * Math.exp(-0.5 * ((x - p.center) / sigma) ** 2);
    }
    if (noiseOn) y += (rng() - 0.5) * 1.6;
    data.push({ x, y: Math.min(100, Math.max(y, 0)) });
  }
  return { data, peaks: allPeaks };
}

function measureDipAt(data, clickX) {
  const localWin = data.filter((p) => Math.abs(p.x - clickX) <= 45);
  if (!localWin.length) return null;
  const dip = localWin.reduce((a, b) => (b.y < a.y ? b : a));
  const wideWin = data.filter((p) => Math.abs(p.x - dip.x) <= 260);
  const baseline = Math.max(...wideWin.map((p) => p.y));
  const halfDepth = baseline - (baseline - dip.y) / 2;
  const idx = data.findIndex((p) => p.x === dip.x);
  let leftX = null,
    rightX = null;
  for (let i = idx; i > 0; i--) {
    if (data[i].y > halfDepth) {
      const p0 = data[i],
        p1 = data[i + 1];
      leftX = p0.x + ((halfDepth - p0.y) * (p1.x - p0.x)) / (p1.y - p0.y);
      break;
    }
  }
  for (let i = idx; i < data.length - 1; i++) {
    if (data[i].y > halfDepth) {
      const p0 = data[i - 1],
        p1 = data[i];
      rightX = p0.x + ((halfDepth - p0.y) * (p1.x - p0.x)) / (p1.y - p0.y);
      break;
    }
  }
  if (leftX == null || rightX == null || rightX <= leftX) return null;
  return { center: dip.x, transmittance: dip.y, widthCm: rightX - leftX, leftX, rightX };
}

export default function FTIRLab() {
  const [metalKey, setMetalKey] = useState("ZnO");
  const [mode, setMode] = useState("explore");

  const [cappingKey, setCappingKey] = useState("PVP");
  const [coverage, setCoverage] = useState(1);
  const [noiseOn, setNoiseOn] = useState(true);

  const [seed, setSeed] = useState(11);
  const [unknown, setUnknown] = useState({ metalKey: "ZnO", cappingKey: "OleicAcid", coverage: 1 });
  const [guess, setGuess] = useState(null);
  const [coreGuess, setCoreGuess] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [measured, setMeasured] = useState([]);

  const activeCappingKey = mode === "explore" ? cappingKey : unknown.cappingKey;
  const activeCoverage = mode === "explore" ? coverage : unknown.coverage;
  const activeMetalKey = mode === "explore" ? metalKey : unknown.metalKey;

  const { data } = useMemo(
    () =>
      generateSpectrum({
        metalKey: activeMetalKey,
        cappingKey: activeCappingKey,
        coverage: activeCoverage,
        noiseOn: mode === "unknown" ? true : noiseOn,
        seed,
      }),
    [activeMetalKey, activeCappingKey, activeCoverage, noiseOn, mode, seed]
  );

  const handleMeasure = useCallback(
    (clickX) => {
      const m = measureDipAt(data, clickX);
      if (!m) return;
      const group = matchGroup(m.center);
      const entry = { ...m, group };
      setMeasured((prev) => {
        const filtered = prev.filter((p) => Math.abs(p.center - m.center) > 30);
        return [...filtered, entry].sort((a, b) => a.center - b.center);
      });
    },
    [data]
  );

  function newUnknownSample() {
    const rng = makeRng(Date.now() % 100000);
    const key = CAP_KEYS[Math.floor(rng() * CAP_KEYS.length)];
    const core = MAT_KEYS[Math.floor(rng() * MAT_KEYS.length)];
    setUnknown({ metalKey: core, cappingKey: key, coverage: +(0.7 + rng() * 0.7).toFixed(2) });
    setSeed(Math.floor(rng() * 1e6));
    setGuess(null);
    setCoreGuess(null);
    setRevealed(false);
    setMeasured([]);
  }

  function switchMode(m) {
    setMode(m);
    setMeasured([]);
    setRevealed(false);
    setGuess(null);
    setCoreGuess(null);
    if (m === "unknown") newUnknownSample();
  }

  function switchMetal(k) {
    setMetalKey(k);
    setMeasured([]);
    setRevealed(false);
    setGuess(null);
    setCoreGuess(null);
  }

  const guessCorrect = revealed && guess === unknown.cappingKey && coreGuess === unknown.metalKey;
  const hasLatticeMeasurement = measured.some((measurement) => measurement.center <= 700);

  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas,#020617)] text-[var(--text-primary,#f1f5f9)] font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-body{font-family:'Inter',ui-sans-serif,sans-serif;}
        .font-display{font-family:'Space Grotesk',ui-sans-serif,sans-serif;}
        .font-data{font-family:'JetBrains Mono',ui-monospace,monospace;}
        input[type=range]{ -webkit-appearance:none; height:4px; border-radius:9999px; background:var(--border, #1e293b); }
        input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:var(--accent, #2dd4bf); border:2px solid var(--bg-surface, #0f172a); margin-top:-6px; cursor:pointer; box-shadow:0 0 0 3px var(--accent-glow, rgba(45,212,191,0.15));}
        input[type=range]::-moz-range-thumb{ width:16px; height:16px; border-radius:9999px; background:var(--accent, #2dd4bf); border:2px solid var(--bg-surface, #0f172a); cursor:pointer; }
      `}</style>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent,#2dd4bf)] text-xs font-data tracking-widest uppercase mb-1">
              <Waves size={13} className="animate-pulse" />
              Virtual FTIR Bench
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary,#f1f5f9)]">
              FTIR — Functional Group Identification
            </h1>
            <p className="text-[var(--text-tertiary,#94a3b8)] text-sm mt-1 max-w-xl">
              Click any dip in the spectrum to measure it. The console reads the band center and
              width and matches it against the functional-group reference table.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 font-data text-xs text-[var(--text-quaternary,#64748b)]">
            <span>SAMPLE #{seed.toString().padStart(5, "0")}</span>
            <span className={mode === "unknown" ? "text-[var(--warn,#fbbf24)]" : "text-[var(--accent,#2dd4bf)]"}>
              {mode === "unknown" ? "● UNKNOWN MODE" : "● EXPLORE MODE"}
            </span>
          </div>
        </div>

        {/* Metal oxide + mode selectors */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1.5 bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-xl p-1">
            {MAT_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => mode === "unknown" ? setCoreGuess(k) : switchMetal(k)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  (mode === "unknown" ? coreGuess === k : metalKey === k) ? "bg-[var(--accent,#2dd4bf)] text-[var(--text-on-accent,#020617)]" : "text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
                }`}
              >
                {METAL_OXIDES_IR[k].label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-xl p-1">
            <button
              onClick={() => switchMode("explore")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === "explore" ? "bg-[var(--surface-inverse,#f1f5f9)] text-[var(--text-on-inverse,#020617)]" : "text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => switchMode("unknown")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === "unknown" ? "bg-[var(--warn,#fbbf24)] text-[var(--text-on-warn,#020617)]" : "text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
              }`}
            >
              Unknown sample
            </button>
          </div>
          <span className="text-xs text-[var(--text-quaternary,#64748b)] font-data">
            {mode === "unknown" ? "select a core hypothesis" : `core: ${METAL_OXIDES_IR[metalKey].full}`}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary,#cbd5e1)] text-sm font-medium">
                  <Crosshair size={15} className="text-[var(--accent,#2dd4bf)]" />
                  Transmittance spectrum
                </div>
                <button
                  onClick={() => setMeasured([])}
                  className="flex items-center gap-1 text-xs text-[var(--text-quaternary,#64748b)] hover:text-[var(--text-secondary,#cbd5e1)] transition-colors"
                >
                  <RotateCcw size={12} /> Clear measurements
                </button>
              </div>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart
                  data={data}
                  margin={{ top: 8, right: 16, bottom: 4, left: -12 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      handleMeasure(e.activePayload[0].payload.x);
                    }
                  }}
                >
                  <CartesianGrid stroke="var(--border, #1e293b)" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[400, 4000]}
                    reversed
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{
                      value: "wavenumber (cm⁻¹)",
                      position: "insideBottom",
                      offset: -2,
                      fill: "var(--text-quaternary, #64748b)",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{
                      value: "%T",
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--text-quaternary, #64748b)",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--accent, #2dd4bf)", strokeDasharray: "3 3" }}
                    contentStyle={{
                      background: "var(--bg-surface, #0f172a)",
                      border: "1px solid var(--border, #1e293b)",
                      borderRadius: 8,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                    }}
                    labelFormatter={(v) => `${v} cm⁻¹`}
                    formatter={(v) => [`${v.toFixed(0)}%T`, ""]}
                  />
                  {measured.map((m, i) => (
                    <ReferenceArea
                      key={i}
                      x1={m.leftX}
                      x2={m.rightX}
                      fill="var(--warn-strong, #f59e0b)"
                      fillOpacity={0.14}
                      stroke="var(--warn-strong, #f59e0b)"
                      strokeOpacity={0.4}
                    />
                  ))}
                  {measured.map((m, i) => (
                    <ReferenceDot
                      key={i}
                      x={m.center}
                      y={m.transmittance}
                      r={4}
                      fill="var(--warn-strong, #f59e0b)"
                      stroke="var(--bg-surface, #0f172a)"
                      strokeWidth={2}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="var(--accent, #2dd4bf)"
                    strokeWidth={1.6}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={280}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Peak table */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium">Measured bands ({measured.length})</div>
                {measured.length > 0 && <button onClick={() => downloadText(`ftir_${mode}_bands.csv`, `center_cm-1,transmittance_percent,width_cm-1,assignment\n${measured.map((m) => `${m.center},${m.transmittance.toFixed(3)},${m.widthCm.toFixed(3)},${m.group?.label || "unassigned"}`).join("\n")}\n`)} className="flex items-center gap-1 text-xs text-[var(--text-quaternary,#64748b)] hover:text-[var(--accent,#2dd4bf)]"><Download size={12}/>Export CSV</button>}
              </div>
              {measured.length === 0 ? (
                <p className="text-sm text-[var(--text-quaternary,#64748b)]">
                  No bands measured yet — click on a dip in the spectrum above. The console finds the
                  local minimum and reads the half-depth width automatically.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-data">
                    <thead>
                      <tr className="text-[var(--text-quaternary,#64748b)] border-b border-[var(--border,#1e293b)]">
                        <th className="text-left py-1.5 pr-3">center</th>
                        <th className="text-right py-1.5 pr-3">width</th>
                        <th className="text-left py-1.5 pr-3 font-body">assignment</th>
                        <th className="py-1.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {measured.map((m, i) => (
                        <tr key={i} className="border-b border-[var(--border-soft,rgba(30,41,59,0.6))]">
                          <td className="py-1.5 pr-3 text-[var(--accent-soft,#5eead4)]">{m.center.toFixed(0)} cm⁻¹</td>
                          <td className="text-right py-1.5 pr-3 text-[var(--text-tertiary,#94a3b8)]">
                            {m.widthCm.toFixed(0)} cm⁻¹
                          </td>
                          <td className="py-1.5 pr-3 text-[var(--text-secondary,#cbd5e1)] font-body">
                            {m.group ? m.group.label : (
                              <span className="text-[var(--danger,#fb7185)]">no standard match</span>
                            )}
                          </td>
                          <td className="py-1.5 text-right">
                            <button
                              onClick={() => setMeasured((prev) => prev.filter((_, idx) => idx !== i))}
                              className="text-[var(--text-muted,#475569)] hover:text-[var(--danger,#fb7185)]"
                            >
                              <X size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Functional group reference card */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-3">Functional group reference</div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs font-data">
                {FUNCTIONAL_GROUPS.map((g, i) => (
                  <div key={i} className="flex justify-between gap-3 text-[var(--text-quaternary,#64748b)] py-0.5">
                    <span className="text-[var(--text-tertiary,#94a3b8)] font-body">{g.label}</span>
                    <span className="whitespace-nowrap">
                      {g.range[0]}–{g.range[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              {mode === "explore" ? (
                <>
                  <div className="flex items-center gap-2 text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-4">
                    <FlaskConical size={15} className="text-[var(--accent,#2dd4bf)]" />
                    Sample controls
                  </div>
                  <label className="text-xs text-[var(--text-tertiary,#94a3b8)] mb-1.5 block">Capping agent</label>
                  <div className="grid grid-cols-1 gap-1.5 mb-4">
                    {CAP_KEYS.map((k) => (
                      <button
                        key={k}
                        onClick={() => setCappingKey(k)}
                        className={`px-3 py-1.5 rounded-lg text-sm text-left font-medium transition-colors ${
                          cappingKey === k
                            ? "bg-[var(--accent,#2dd4bf)] text-[var(--text-on-accent,#020617)]"
                            : "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
                        }`}
                      >
                        {CAPPING_AGENTS[k].label}
                      </button>
                    ))}
                  </div>
                  <label className="text-xs text-[var(--text-tertiary,#94a3b8)] flex justify-between mb-1">
                    Coating coverage <span className="font-data text-[var(--accent-soft,#5eead4)]">{coverage.toFixed(2)}×</span>
                  </label>
                  <input
                    type="range"
                    min={0.3}
                    max={1.6}
                    step={0.05}
                    value={coverage}
                    onChange={(e) => setCoverage(+e.target.value)}
                    className="w-full mb-4 accent-[var(--accent,#2dd4bf)]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-tertiary,#94a3b8)]">Detector noise</span>
                    <button
                      onClick={() => setNoiseOn((v) => !v)}
                      className={`text-xs px-2 py-1 rounded-md font-data ${
                        noiseOn ? "bg-[var(--accent,#2dd4bf)]/15 text-[var(--accent-soft,#5eead4)]" : "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-quaternary,#64748b)]"
                      }`}
                    >
                      {noiseOn ? "ON" : "OFF"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-3">
                    <FlaskConical size={15} className="text-[var(--warn,#fbbf24)]" />
                    Unknown sample
                  </div>
                  <p className="text-xs text-[var(--text-tertiary,#94a3b8)] mb-4">
                    An unknown metal-oxide nanoparticle was capped with an unknown stabiliser. Measure
                    organic and lattice bands, then identify both components.
                  </p>
                  <button
                    onClick={newUnknownSample}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--warn,#fbbf24)] text-[var(--text-on-warn,#020617)] text-sm font-medium rounded-lg py-2 mb-3 hover:bg-[var(--warn-strong,#f59e0b)] transition-colors"
                  >
                    <RefreshCw size={14} /> Generate new sample
                  </button>

                  <label className="text-xs text-[var(--text-tertiary,#94a3b8)] mb-1.5 block">Your identification</label>
                  <div className="grid grid-cols-1 gap-1.5 mb-3">
                    {CAP_KEYS.map((k) => (
                      <button
                        key={k}
                        onClick={() => setGuess(k)}
                        className={`px-3 py-1.5 rounded-lg text-sm text-left font-medium transition-colors flex items-center justify-between ${
                          guess === k
                            ? "bg-[var(--surface-inverse,#f1f5f9)] text-[var(--text-on-inverse,#020617)]"
                            : "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
                        }`}
                      >
                        {CAPPING_AGENTS[k].label}
                        {revealed && k === unknown.cappingKey && <CheckCircle2 size={14} className="text-[var(--success,#34d399)]" />}
                        {revealed && guess === k && k !== unknown.cappingKey && (
                          <XCircle size={14} className="text-[var(--danger,#fb7185)]" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={measured.length < 3 || !hasLatticeMeasurement || !guess || !coreGuess}
                    onClick={() => setRevealed(true)}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-medium rounded-lg py-2 transition-colors ${
                      measured.length < 3 || !hasLatticeMeasurement || !guess || !coreGuess
                        ? "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-muted,#475569)] cursor-not-allowed"
                        : "bg-[var(--surface-inverse,#f1f5f9)] text-[var(--text-on-inverse,#020617)] hover:bg-[var(--surface-inverse-hover,#ffffff)]"
                    }`}
                  >
                    <Eye size={14} /> Reveal answer
                  </button>
                  {(measured.length < 3 || !hasLatticeMeasurement || !guess || !coreGuess) && (
                    <p className="text-[11px] text-[var(--text-muted,#475569)] mt-2">
                      Measure at least 3 bands, including an M–O lattice band below 700 cm⁻¹, and record both hypotheses.
                    </p>
                  )}
                </>
              )}
            </div>

            {mode === "unknown" && revealed && (
              <div
                className={`bg-[var(--bg-surface,#0f172a)] border rounded-2xl p-4 ${
                  guessCorrect ? "border-[var(--success-border,rgba(6,95,70,0.5))]" : "border-[var(--danger-border,rgba(159,18,57,0.5))]"
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    guessCorrect ? "text-[var(--success,#34d399)]" : "text-[var(--danger,#fb7185)]"
                  }`}
                >
                  <Info size={14} />
                  {guessCorrect ? "Complete identification correct" : "Revisit the evidence"} — it was {CAPPING_AGENTS[unknown.cappingKey].label}-capped {METAL_OXIDES_IR[unknown.metalKey].label}
                </div>
                <p className="text-xs text-[var(--text-tertiary,#94a3b8)]">{CAPPING_AGENTS[unknown.cappingKey].clue}</p>
              </div>
            )}

            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-2">About this capping agent</div>
              <p className="text-xs text-[var(--text-tertiary,#94a3b8)]">
                {mode === "explore"
                  ? CAPPING_AGENTS[cappingKey].full
                  : revealed
                  ? CAPPING_AGENTS[unknown.cappingKey].full
                  : "Hidden until you reveal the answer."}
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted,#475569)] mt-6 max-w-3xl">
          Band positions are representative literature-typical values for common nanoparticle capping
          agents and metal-oxide lattice modes, for teaching purposes — real spectra shift with degree
          of surface binding, chain conformation, and instrument resolution.
        </p>
      </div>
    </div>
  );
}
