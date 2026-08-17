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
  FlaskConical,
  SunMedium,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Reference data — representative literature-typical values for teaching.
// Fe3O4's "gap" is an apparent optical gap (charge-transfer origin), included
// only for comparative purposes — flagged in the UI.
// ---------------------------------------------------------------------------
const MATERIALS = {
  ZnO: { label: "ZnO", full: "Zinc oxide", EgBulk: 3.37, me: 0.24, mh: 0.45, n: 2, tNm: 310, nOpt: 2.0 },
  TiO2: { label: "TiO₂", full: "Titania (anatase)", EgBulk: 3.20, me: 1.0, mh: 0.8, n: 0.5, tNm: 260, nOpt: 2.4 },
  CeO2: { label: "CeO₂", full: "Cerium oxide", EgBulk: 3.19, me: 0.4, mh: 2.0, n: 2, tNm: 340, nOpt: 2.2 },
  Fe3O4: { label: "Fe₃O₄", full: "Magnetite (apparent gap)", EgBulk: 2.0, me: 0.5, mh: 0.5, n: 2, tNm: 290, nOpt: 2.3 },
};
const MAT_KEYS = Object.keys(MATERIALS);
const H_EV_NM = 1240; // eV·nm, E = 1240/λ

function deltaEgEv(R_nm, me_r, mh_r) {
  const h = 6.626e-34,
    m0 = 9.109e-31,
    R_m = R_nm * 1e-9,
    e = 1.602e-19;
  const num = h * h * (1 / (me_r * m0) + 1 / (mh_r * m0));
  return num / (8 * R_m * R_m) / e;
}
function particleSizeFromDeltaE(deltaE_eV, me_r, mh_r) {
  if (deltaE_eV <= 0) return null;
  const h = 6.626e-34,
    m0 = 9.109e-31,
    e = 1.602e-19;
  const deltaE_J = deltaE_eV * e;
  const num = h * h * (1 / (me_r * m0) + 1 / (mh_r * m0));
  return Math.sqrt(num / (8 * deltaE_J)) * 1e9;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generateSpectrum({ materialKey, R, noiseOn, seed }) {
  const mat = MATERIALS[materialKey];
  const EgR = mat.EgBulk + deltaEgEv(R, mat.me, mat.mh);
  const nTrue = mat.n;
  const hvTop = H_EV_NM / 250;
  const AmaxTarget = 2.2;
  const B = hvTop > EgR ? Math.pow(AmaxTarget * hvTop, nTrue) / (hvTop - EgR) : null;
  const rng = makeRng(seed);
  const data = [];
  for (let lam = 250; lam <= 800; lam += 1) {
    const hv = H_EV_NM / lam;
    // Core Tauc-consistent absorbance-like signal (the "clean" idealized part)
    const Acore = hv > EgR && B ? Math.pow(B * (hv - EgR), 1 / nTrue) / hv : 0.08;
    // Gentle scattering-type background: real films always trend up toward the
    // UV and drift slightly at long wavelength, never a perfectly flat baseline.
    const scatter = 0.06 * (550 / lam) - 0.05;
    // Thin-film interference fringes: real, deterministic optical ripple from
    // internal reflection within the film, not random noise. It fades out once
    // the film is strongly absorbing (little light reaches the back surface to
    // interfere), via the damping factor below.
    const damping = Math.exp(-2.0 * Acore);
    const fringe = 0.035 * damping * Math.sin((2 * Math.PI * 2 * mat.nOpt * mat.tNm) / lam);
    let A = Acore + scatter + fringe;
    if (noiseOn) A += (rng() - 0.5) * 0.035;
    A = Math.max(0, Math.min(3, A));
    data.push({ x: lam, y: +A.toFixed(4), hv });
  }
  return { data, EgR, nTrue };
}

function linReg(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-9) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}
function computeR2(points, slope, intercept) {
  const meanY = points.reduce((s, p) => s + p.y, 0) / points.length;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  return ssTot < 1e-12 ? 0 : 1 - ssRes / ssTot;
}

export default function UVVisLab() {
  const [materialKey, setMaterialKey] = useState("ZnO");
  const [mode, setMode] = useState("explore");

  const [R, setR] = useState(6);
  const [noiseOn, setNoiseOn] = useState(true);

  const [seed, setSeed] = useState(21);
  const [unknownR, setUnknownR] = useState(4.5);
  const [revealed, setRevealed] = useState(false);
  const [typeGuess, setTypeGuess] = useState(null);

  const [nSel, setNSel] = useState(2);
  const [fitRange, setFitRange] = useState({ start: null, end: null });

  const mat = MATERIALS[materialKey];
  const effR = mode === "explore" ? R : unknownR;

  const { data, EgR, nTrue } = useMemo(
    () =>
      generateSpectrum({
        materialKey,
        R: effR,
        noiseOn: mode === "unknown" ? true : noiseOn,
        seed,
      }),
    [materialKey, effR, noiseOn, mode, seed]
  );

  const taucData = useMemo(
    () => data.map((d) => ({ x: +d.hv.toFixed(4), y: Math.pow(Math.max(d.y * d.hv, 0), nSel) })),
    [data, nSel]
  );

  const fitResult = useMemo(() => {
    if (fitRange.start == null || fitRange.end == null) return null;
    const lo = Math.min(fitRange.start, fitRange.end);
    const hi = Math.max(fitRange.start, fitRange.end);
    const pts = taucData.filter((p) => p.x >= lo && p.x <= hi);
    if (pts.length < 5) return null;
    const reg = linReg(pts);
    if (!reg || reg.slope <= 0) return null;
    const r2 = computeR2(pts, reg.slope, reg.intercept);
    const EgFit = -reg.intercept / reg.slope;
    return { ...reg, r2, EgFit, lo, hi };
  }, [fitRange, taucData]);

  const sizeFit = useMemo(() => {
    if (!fitResult) return null;
    const deltaE = fitResult.EgFit - mat.EgBulk;
    if (deltaE <= 0) return null;
    const Rfit = particleSizeFromDeltaE(deltaE, mat.me, mat.mh);
    return { deltaE, Rfit };
  }, [fitResult, mat]);

  const fitLine = useMemo(() => {
    if (!fitResult) return null;
    const xEnd = fitResult.hi + 0.15;
    return [
      { x: fitResult.EgFit, y: 0 },
      { x: xEnd, y: fitResult.slope * xEnd + fitResult.intercept },
    ];
  }, [fitResult]);

  const fitAudit = useMemo(() => {
    if (!fitResult) return null;
    const width = fitResult.hi - fitResult.lo;
    const linear = fitResult.r2 >= 0.985;
    const sensibleWidth = width >= 0.18 && width <= 0.75;
    const positiveShift = fitResult.EgFit > mat.EgBulk;
    return { width, linear, sensibleWidth, positiveShift, score: [linear, sensibleWidth, positiveShift].filter(Boolean).length };
  }, [fitResult, mat.EgBulk]);

  const handleTaucClick = useCallback((hvClicked) => {
    setFitRange((prev) => {
      if (prev.start == null) return { start: hvClicked, end: null };
      if (prev.end == null) {
        if (Math.abs(hvClicked - prev.start) < 0.06) return { start: hvClicked, end: null };
        return { start: Math.min(prev.start, hvClicked), end: Math.max(prev.start, hvClicked) };
      }
      return { start: hvClicked, end: null };
    });
  }, []);

  function newUnknownSample() {
    const rng = makeRng(Date.now() % 100000);
    setUnknownR(+(2.5 + rng() * 9.5).toFixed(1));
    setSeed(Math.floor(rng() * 1e6));
    setRevealed(false);
    setTypeGuess(null);
    setFitRange({ start: null, end: null });
  }

  function switchMode(m) {
    setMode(m);
    setRevealed(false);
    setTypeGuess(null);
    setFitRange({ start: null, end: null });
    if (m === "unknown") newUnknownSample();
  }

  function switchMaterial(k) {
    setMaterialKey(k);
    setRevealed(false);
    setTypeGuess(null);
    setFitRange({ start: null, end: null });
  }

  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const trueType = mat.n === 2 ? "direct" : "indirect";
  const typeCorrect = revealed && typeGuess === trueType;

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
              <SunMedium size={13} className="animate-pulse" />
              Virtual UV-Vis Bench
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary,#f1f5f9)]">
              UV-Vis — Intensity, Band Gap &amp; Particle Size
            </h1>
            <p className="text-[var(--text-tertiary,#94a3b8)] text-sm mt-1 max-w-xl">
              Hover the spectrum to read wavelength and intensity directly. Click twice on the Tauc
              plot to fit the rising edge and extract the optical band gap.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 font-data text-xs text-[var(--text-quaternary,#64748b)]">
            <span>SAMPLE #{seed.toString().padStart(5, "0")}</span>
            <span className={mode === "unknown" ? "text-[var(--warn,#fbbf24)]" : "text-[var(--accent,#2dd4bf)]"}>
              {mode === "unknown" ? "● UNKNOWN MODE" : "● EXPLORE MODE"}
            </span>
          </div>
        </div>

        {/* Material + mode selectors */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1.5 bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-xl p-1">
            {MAT_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => switchMaterial(k)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  materialKey === k ? "bg-[var(--accent,#2dd4bf)] text-[var(--text-on-accent,#020617)]" : "text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
                }`}
              >
                {MATERIALS[k].label}
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
          <span className="text-xs text-[var(--text-quaternary,#64748b)] font-data">{mat.full}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Intensity spectrum */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2"><div className="flex items-center gap-2 text-[var(--text-secondary,#cbd5e1)] text-sm font-medium"><Crosshair size={15} className="text-[var(--accent,#2dd4bf)]" />Absorbance (au)</div><button onClick={() => downloadText(`${materialKey}_${mode}_spectrum.csv`, `wavelength_nm,photon_energy_ev,absorbance_au\n${data.map((point) => `${point.x},${point.hv.toFixed(5)},${point.y.toFixed(5)}`).join("\n")}\n`)} className="flex items-center gap-1 text-xs text-[var(--text-quaternary,#64748b)] hover:text-[var(--accent,#2dd4bf)]"><Download size={12}/>Export CSV</button></div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -12 }}>
                  <CartesianGrid stroke="var(--border, #1e293b)" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[250, 800]}
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{ value: "wavelength (nm)", position: "insideBottom", offset: -2, fill: "var(--text-quaternary, #64748b)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 2.6]}
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{ value: "Intensity (a.u.)", angle: -90, position: "insideLeft", fill: "var(--text-quaternary, #64748b)", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--accent, #2dd4bf)", strokeDasharray: "3 3" }}
                    contentStyle={{ background: "var(--bg-surface, #0f172a)", border: "1px solid var(--border, #1e293b)", borderRadius: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}
                    labelFormatter={(v) => `λ = ${v} nm`}
                    formatter={(v, name, props) => [`I = ${v.toFixed(3)}  (hν = ${props.payload.hv.toFixed(2)} eV)`, ""]}
                  />
                  <Line type="monotone" dataKey="y" stroke="var(--accent, #2dd4bf)" strokeWidth={1.6} dot={false} isAnimationActive animationDuration={280} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tauc plot */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary,#cbd5e1)] text-sm font-medium">
                  <Crosshair size={15} className="text-[var(--warn,#fbbf24)]" />
                  Tauc plot — (A·hν)<sup>{nSel === 2 ? "2" : "1/2"}</sup> vs hν
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-[var(--bg-surface-2,#1e293b)] rounded-lg p-0.5">
                    <button
                      onClick={() => setNSel(2)}
                      className={`px-2 py-1 rounded-md text-xs font-data ${nSel === 2 ? "bg-[var(--accent,#2dd4bf)] text-[var(--text-on-accent,#020617)]" : "text-[var(--text-tertiary,#94a3b8)]"}`}
                    >
                      n = 2 (direct)
                    </button>
                    <button
                      onClick={() => setNSel(0.5)}
                      className={`px-2 py-1 rounded-md text-xs font-data ${nSel === 0.5 ? "bg-[var(--accent,#2dd4bf)] text-[var(--text-on-accent,#020617)]" : "text-[var(--text-tertiary,#94a3b8)]"}`}
                    >
                      n = 1/2 (indirect)
                    </button>
                  </div>
                  <button
                    onClick={() => setFitRange({ start: null, end: null })}
                    className="flex items-center gap-1 text-xs text-[var(--text-quaternary,#64748b)] hover:text-[var(--text-secondary,#cbd5e1)] transition-colors"
                  >
                    <RotateCcw size={12} /> Clear fit
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={taucData}
                  margin={{ top: 8, right: 16, bottom: 4, left: -6 }}
                  onClick={(e) => {
                    if (e && e.activePayload && e.activePayload.length) handleTaucClick(e.activePayload[0].payload.x);
                  }}
                >
                  <CartesianGrid stroke="var(--border, #1e293b)" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[1.5, 5.0]}
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{ value: "hν (eV)", position: "insideBottom", offset: -2, fill: "var(--text-quaternary, #64748b)", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, "dataMax"]}
                    stroke="var(--text-muted, #475569)"
                    tick={{ fill: "var(--text-quaternary, #64748b)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--warn-strong, #f59e0b)", strokeDasharray: "3 3" }}
                    contentStyle={{ background: "var(--bg-surface, #0f172a)", border: "1px solid var(--border, #1e293b)", borderRadius: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}
                    labelFormatter={(v) => `hν = ${v} eV`}
                  />
                  {fitResult && (
                    <ReferenceArea x1={fitResult.lo} x2={fitResult.hi} fill="var(--warn-strong, #f59e0b)" fillOpacity={0.12} stroke="var(--warn-strong, #f59e0b)" strokeOpacity={0.4} />
                  )}
                  {fitResult && <ReferenceDot x={fitResult.EgFit} y={0} r={4} fill="var(--warn-strong, #f59e0b)" stroke="var(--bg-surface, #0f172a)" strokeWidth={2} />}
                  <Line type="monotone" dataKey="y" stroke="var(--accent, #2dd4bf)" strokeWidth={1.6} dot={false} isAnimationActive animationDuration={280} />
                  {fitLine && (
                    <Line data={fitLine} dataKey="y" stroke="var(--warn-strong, #f59e0b)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-[var(--text-quaternary,#64748b)] mt-2">
                {fitRange.start == null
                  ? "Click the start of the rising edge, then the end, to fit a line."
                  : fitRange.end == null
                  ? "Now click the end of the fit region."
                  : fitResult
                  ? "Fit line extrapolates to the x-axis at the band gap."
                  : "That region isn't linear enough — try again, or toggle n."}
              </p>
            </div>

            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-3">Fit-quality audit</div>
              {fitAudit ? <div className="space-y-2 text-xs"><div className="flex justify-between"><span className="text-[var(--text-tertiary,#94a3b8)]">fit-window width</span><span className={fitAudit.sensibleWidth ? "text-[var(--success,#34d399)] font-data" : "text-[var(--warn,#fbbf24)] font-data"}>{fitAudit.width.toFixed(3)} eV</span></div><div className="flex justify-between"><span className="text-[var(--text-tertiary,#94a3b8)]">linearity</span><span className={fitAudit.linear ? "text-[var(--success,#34d399)]" : "text-[var(--warn,#fbbf24)]"}>{fitAudit.linear ? "R² ≥ 0.985" : "check fit range"}</span></div><div className="flex justify-between"><span className="text-[var(--text-tertiary,#94a3b8)]">confinement check</span><span className={fitAudit.positiveShift ? "text-[var(--success,#34d399)]" : "text-[var(--warn,#fbbf24)]"}>{fitAudit.positiveShift ? "Eg > bulk gap" : "no positive shift"}</span></div><p className="pt-2 border-t border-[var(--border,#1e293b)] text-[var(--text-muted,#475569)]">Quality score: {fitAudit.score}/3. A high R² alone does not validate an unphysical fit window or size estimate.</p></div> : <p className="text-xs text-[var(--text-quaternary,#64748b)]">Choose a Tauc exponent and click two edge points to audit the fit before revealing the sample.</p>}
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
                  <label className="text-xs text-[var(--text-tertiary,#94a3b8)] flex justify-between mb-1">
                    Particle size R <span className="font-data text-[var(--accent-soft,#5eead4)]">{R.toFixed(1)} nm</span>
                  </label>
                  <input type="range" min={2} max={15} step={0.1} value={R} onChange={(e) => setR(+e.target.value)} className="w-full mb-4 accent-[var(--accent,#2dd4bf)]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-tertiary,#94a3b8)]">Detector noise</span>
                    <button
                      onClick={() => setNoiseOn((v) => !v)}
                      className={`text-xs px-2 py-1 rounded-md font-data ${noiseOn ? "bg-[var(--accent,#2dd4bf)]/15 text-[var(--accent-soft,#5eead4)]" : "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-quaternary,#64748b)]"}`}
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
                    A {mat.label} thin film was deposited from an unknown-size nanoparticle sol. Determine
                    its band gap and particle size from the spectrum alone.
                  </p>
                  <button
                    onClick={newUnknownSample}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--warn,#fbbf24)] text-[var(--text-on-warn,#020617)] text-sm font-medium rounded-lg py-2 mb-3 hover:bg-[var(--warn-strong,#f59e0b)] transition-colors"
                  >
                    <RefreshCw size={14} /> Generate new sample
                  </button>
                  <label className="text-xs text-[var(--text-tertiary,#94a3b8)] mb-1.5 block">Transition type</label>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {["direct", "indirect"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeGuess(t)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                          typeGuess === t ? "bg-[var(--surface-inverse,#f1f5f9)] text-[var(--text-on-inverse,#020617)]" : "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-tertiary,#94a3b8)] hover:text-[var(--text-primary,#f1f5f9)]"
                        }`}
                      >
                        {t === "direct" ? "Direct" : "Indirect"}
                        {revealed && t === trueType && <CheckCircle2 size={12} className="text-[var(--success,#34d399)]" />}
                        {revealed && typeGuess === t && t !== trueType && <XCircle size={12} className="text-[var(--danger,#fb7185)]" />}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!fitResult || !typeGuess}
                    onClick={() => setRevealed(true)}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-medium rounded-lg py-2 transition-colors ${
                      !fitResult || !typeGuess ? "bg-[var(--bg-surface-2,#1e293b)] text-[var(--text-muted,#475569)] cursor-not-allowed" : "bg-[var(--surface-inverse,#f1f5f9)] text-[var(--text-on-inverse,#020617)] hover:bg-[var(--surface-inverse-hover,#ffffff)]"
                    }`}
                  >
                    <Eye size={14} /> Reveal ground truth
                  </button>
                  {(!fitResult || !typeGuess) && (
                    <p className="text-[11px] text-[var(--text-muted,#475569)] mt-2">Fit the Tauc edge and pick a transition type to reveal.</p>
                  )}
                </>
              )}
            </div>

            {/* Fit results */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-3">Band gap fit</div>
              {fitResult ? (
                <div className="space-y-1.5 font-data text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary,#64748b)]">Eg (fit)</span>
                    <span className="text-[var(--text-primary,#f1f5f9)]">{fitResult.EgFit.toFixed(3)} eV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary,#64748b)]">R²</span>
                    <span className={fitResult.r2 > 0.98 ? "text-[var(--success,#34d399)]" : fitResult.r2 > 0.9 ? "text-[var(--warn,#fbbf24)]" : "text-[var(--danger,#fb7185)]"}>
                      {fitResult.r2.toFixed(4)}
                    </span>
                  </div>
                  {(mode === "explore" || revealed) && (
                    <div className="pt-2 mt-2 border-t border-[var(--border,#1e293b)] text-xs text-[var(--text-quaternary,#64748b)]">
                      <div className="flex justify-between">
                        <span>ground truth Eg(R)</span>
                        <span className="text-[var(--success,#34d399)]">{EgR.toFixed(3)} eV</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted,#475569)] pt-1">
                    A low R² usually means the wrong n was chosen for this material's transition type.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--text-quaternary,#64748b)]">Click two points on the Tauc plot's rising edge.</p>
              )}
            </div>

            {/* Particle size */}
            <div className="bg-[var(--bg-surface,#0f172a)] border border-[var(--border,#1e293b)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary,#cbd5e1)] text-sm font-medium mb-3">Particle size (EMA)</div>
              {sizeFit ? (
                <div className="space-y-1.5 font-data text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary,#64748b)]">blue shift ΔE</span>
                    <span className="text-[var(--text-primary,#f1f5f9)]">{sizeFit.deltaE.toFixed(3)} eV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary,#64748b)]">R (from ΔE)</span>
                    <span className="text-[var(--text-primary,#f1f5f9)]">{sizeFit.Rfit.toFixed(1)} nm</span>
                  </div>
                  {(mode === "explore" || revealed) && (
                    <div className="pt-2 mt-2 border-t border-[var(--border,#1e293b)] text-xs text-[var(--text-quaternary,#64748b)]">
                      <div className="flex justify-between">
                        <span>ground truth R</span>
                        <span className="text-[var(--success,#34d399)]">{effR.toFixed(1)} nm</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-quaternary,#64748b)]">
                  Needs a valid band-gap fit with Eg(fit) above the bulk value ({mat.EgBulk.toFixed(2)} eV).
                </p>
              )}
            </div>

            {mode === "unknown" && revealed && (
              <div className={`bg-[var(--bg-surface,#0f172a)] border rounded-2xl p-4 ${typeCorrect ? "border-[var(--success-border,rgba(6,95,70,0.5))]" : "border-[var(--danger-border,rgba(159,18,57,0.5))]"}`}>
                <div className={`flex items-center gap-2 text-sm font-medium mb-1 ${typeCorrect ? "text-[var(--success,#34d399)]" : "text-[var(--danger,#fb7185)]"}`}>
                  <Info size={14} /> {typeCorrect ? "Correct transition type" : "Not quite"} — {mat.label} is {trueType}
                </div>
                <p className="text-xs text-[var(--text-tertiary,#94a3b8)]">n (true) = {nTrue}; selected n = {nSel}. {nSel === nTrue ? "The transform agrees with the transition assignment." : "Compare both transforms before accepting the fit."}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted,#475569)] mt-6 max-w-3xl">
          The underlying signal is generated from the Tauc relation (I·hν)ⁿ = B(hν − Eg), plus a gentle
          scattering-type background and a damped thin-film interference ripple (real, deterministic
          optical effects — not noise), so even with detector noise off the trace won't be perfectly
          smooth, and a fit's R² typically lands just under 1.0 rather than exactly at it. Particle size
          uses the simplified effective-mass (quantum-confinement) approximation, ΔEg = (h²/8R²)(1/mₑ* +
          1/m_h*), which omits the Coulomb correction term of the full Brus equation for clarity. Fe₃O₄'s
          "gap" reflects charge-transfer transitions rather than a conventional band-to-band semiconductor
          gap and is included for comparison only.
        </p>
      </div>
    </div>
  );
}
