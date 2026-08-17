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
  X,
  FlaskConical,
  Radio,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Physics constants
// ---------------------------------------------------------------------------
const LAMBDA_NM = 0.15406; // Cu Kalpha1, nm
const SCHERRER_K = 0.9;
const INSTR_FWHM_DEG = 0.09; // fixed instrumental broadening of the virtual goniometer

// ---------------------------------------------------------------------------
// Reference crystallographic data (representative literature-typical values —
// for instructional simulation, not a substitute for an ICDD card)
// ---------------------------------------------------------------------------
const MATERIALS = {
  ZnO: {
    label: "ZnO",
    full: "Zinc oxide",
    system: "hexagonal",
    a: 3.2495,
    c: 5.2069,
    peaks: [
      { hkl: [1, 0, 0], I: 57 },
      { hkl: [0, 0, 2], I: 44 },
      { hkl: [1, 0, 1], I: 100 },
      { hkl: [1, 0, 2], I: 23 },
      { hkl: [1, 1, 0], I: 32 },
      { hkl: [1, 0, 3], I: 29 },
      { hkl: [2, 0, 0], I: 4 },
      { hkl: [1, 1, 2], I: 25 },
      { hkl: [2, 0, 1], I: 14 },
    ],
  },
  CeO2: {
    label: "CeO\u2082",
    full: "Cerium oxide",
    system: "cubic",
    a: 5.4110,
    peaks: [
      { hkl: [1, 1, 1], I: 100 },
      { hkl: [2, 0, 0], I: 30 },
      { hkl: [2, 2, 0], I: 52 },
      { hkl: [3, 1, 1], I: 42 },
      { hkl: [2, 2, 2], I: 8 },
      { hkl: [4, 0, 0], I: 6 },
      { hkl: [3, 3, 1], I: 14 },
      { hkl: [4, 2, 0], I: 12 },
    ],
  },
  TiO2: {
    label: "TiO\u2082",
    full: "Titania (anatase)",
    system: "tetragonal",
    a: 3.7845,
    c: 9.5143,
    peaks: [
      { hkl: [1, 0, 1], I: 100 },
      { hkl: [0, 0, 4], I: 20 },
      { hkl: [2, 0, 0], I: 35 },
      { hkl: [1, 0, 5], I: 20 },
      { hkl: [2, 1, 1], I: 20 },
      { hkl: [2, 0, 4], I: 14 },
      { hkl: [1, 1, 6], I: 6 },
      { hkl: [2, 2, 0], I: 6 },
      { hkl: [2, 1, 5], I: 14 },
    ],
  },
  Fe3O4: {
    label: "Fe\u2083O\u2084",
    full: "Magnetite",
    system: "cubic",
    a: 8.396,
    peaks: [
      { hkl: [2, 2, 0], I: 30 },
      { hkl: [3, 1, 1], I: 100 },
      { hkl: [4, 0, 0], I: 20 },
      { hkl: [4, 2, 2], I: 8 },
      { hkl: [5, 1, 1], I: 20 },
      { hkl: [4, 4, 0], I: 30 },
    ],
  },
};

function dSpacingNm([h, k, l], aA, cA, system) {
  const a = aA / 10;
  const c = cA ? cA / 10 : undefined;
  if (system === "cubic") return a / Math.sqrt(h * h + k * k + l * l);
  if (system === "tetragonal")
    return 1 / Math.sqrt((h * h + k * k) / (a * a) + (l * l) / (c * c));
  if (system === "hexagonal")
    return 1 / Math.sqrt(((4 / 3) * (h * h + h * k + k * k)) / (a * a) + (l * l) / (c * c));
  return null;
}

function twoThetaDeg(dNm) {
  const arg = LAMBDA_NM / (2 * dNm);
  if (arg > 1 || arg < -1) return null;
  return (2 * Math.asin(arg) * 180) / Math.PI;
}

function referencePeaks(materialKey) {
  const mat = MATERIALS[materialKey];
  return mat.peaks
    .map((p) => {
      const d = dSpacingNm(p.hkl, mat.a, mat.c, mat.system);
      const tt = twoThetaDeg(d);
      return tt == null ? null : { ...p, d, twoTheta: tt };
    })
    .filter((p) => p && p.twoTheta > 20 && p.twoTheta < 80)
    .sort((a, b) => a.twoTheta - b.twoTheta);
}

// small seeded PRNG so an "unknown sample" is reproducible while it's on screen
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generatePattern({ materialKey, D, strainPct, noiseOn, seed, impurityKey }) {
  const rng = makeRng(seed);
  const strain = strainPct / 100;
  const primary = referencePeaks(materialKey).map((p) => {
    const thetaRad = ((p.twoTheta / 2) * Math.PI) / 180;
    const betaSizeRad = (SCHERRER_K * LAMBDA_NM) / (D * Math.cos(thetaRad));
    const betaStrainRad = 4 * strain * Math.tan(thetaRad);
    const betaPhysDeg = ((betaSizeRad + betaStrainRad) * 180) / Math.PI;
    const betaTotalDeg = Math.sqrt(betaPhysDeg ** 2 + INSTR_FWHM_DEG ** 2);
    return { ...p, thetaRad, betaTotalDeg, isImpurity: false };
  });

  let impurity = [];
  if (impurityKey) {
    impurity = referencePeaks(impurityKey).map((p) => {
      const thetaRad = ((p.twoTheta / 2) * Math.PI) / 180;
      const betaSizeRad = (SCHERRER_K * LAMBDA_NM) / (14 * Math.cos(thetaRad));
      const betaPhysDeg = (betaSizeRad * 180) / Math.PI;
      const betaTotalDeg = Math.sqrt(betaPhysDeg ** 2 + INSTR_FWHM_DEG ** 2);
      return { ...p, I: p.I * 0.16, thetaRad, betaTotalDeg, isImpurity: true };
    });
  }

  const allPeaks = [...primary, ...impurity];
  const data = [];
  for (let x = 20; x <= 80; x += 0.04) {
    let y = 42 + 6 * Math.sin(x / 25);
    for (const p of allPeaks) {
      const sigma = p.betaTotalDeg / 2.3548;
      y += p.I * Math.exp(-0.5 * ((x - p.twoTheta) / sigma) ** 2);
    }
    if (noiseOn) y += (rng() - 0.5) * 2 * Math.sqrt(Math.max(y, 1)) * 1.3;
    data.push({ x: +x.toFixed(2), y: Math.max(y, 0) });
  }
  return { data, primary, impurity };
}

function measureAt(data, clickX) {
  const win = data.filter((p) => Math.abs(p.x - clickX) <= 1.4);
  if (!win.length) return null;
  const peak = win.reduce((a, b) => (b.y > a.y ? b : a));
  const wide = data.filter((p) => Math.abs(p.x - peak.x) <= 2.6);
  const baseline = Math.min(...wide.map((p) => p.y));
  const halfH = baseline + (peak.y - baseline) / 2;
  const idx = data.findIndex((p) => p.x === peak.x);
  let leftX = null,
    rightX = null;
  for (let i = idx; i > 0; i--) {
    if (data[i].y < halfH) {
      const p0 = data[i],
        p1 = data[i + 1];
      leftX = p0.x + ((halfH - p0.y) * (p1.x - p0.x)) / (p1.y - p0.y);
      break;
    }
  }
  for (let i = idx; i < data.length - 1; i++) {
    if (data[i].y < halfH) {
      const p0 = data[i - 1],
        p1 = data[i];
      rightX = p0.x + ((halfH - p0.y) * (p1.x - p0.x)) / (p1.y - p0.y);
      break;
    }
  }
  if (leftX == null || rightX == null || rightX <= leftX) return null;
  return { twoTheta: peak.x, intensity: peak.y, fwhmDeg: rightX - leftX, leftX, rightX };
}

function linReg(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-12) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  const meanY = sy / n;
  const ssTot = points.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const ssRes = points.reduce((sum, point) => sum + (point.y - (slope * point.x + intercept)) ** 2, 0);
  return { slope, intercept, r2: ssTot < 1e-12 ? 0 : 1 - ssRes / ssTot };
}

function meanAndStd(values) {
  if (!values.length) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.length > 1
    ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1)
    : 0;
  return { mean, std: Math.sqrt(variance) };
}

function fitLattice(system, points) {
  // points: {X1, X2, Y}
  if (points.length < 2) return null;
  if (system === "cubic") {
    const sXY = points.reduce((s, p) => s + p.X1 * p.Y, 0);
    const sXX = points.reduce((s, p) => s + p.X1 * p.X1, 0);
    if (sXX < 1e-9) return null;
    const p = sXY / sXX;
    if (p <= 0) return null;
    return { aNm: 1 / Math.sqrt(p) };
  }
  const S11 = points.reduce((s, p) => s + p.X1 * p.X1, 0);
  const S12 = points.reduce((s, p) => s + p.X1 * p.X2, 0);
  const S22 = points.reduce((s, p) => s + p.X2 * p.X2, 0);
  const S1Y = points.reduce((s, p) => s + p.X1 * p.Y, 0);
  const S2Y = points.reduce((s, p) => s + p.X2 * p.Y, 0);
  const det = S11 * S22 - S12 * S12;
  if (Math.abs(det) < 1e-6) return null;
  const p = (S1Y * S22 - S2Y * S12) / det;
  const q = (S11 * S2Y - S12 * S1Y) / det;
  if (p <= 0 || q <= 0) return null;
  return { aNm: 1 / Math.sqrt(p), cNm: 1 / Math.sqrt(q) };
}

const MAT_KEYS = Object.keys(MATERIALS);

export default function PXRDLab() {
  const [materialKey, setMaterialKey] = useState("ZnO");
  const [mode, setMode] = useState("explore"); // 'explore' | 'unknown'
  const [D, setD] = useState(30);
  const [strainPct, setStrainPct] = useState(0.15);
  const [noiseOn, setNoiseOn] = useState(true);
  const [showImpurityDemo, setShowImpurityDemo] = useState(false);

  const [seed, setSeed] = useState(7);
  const [unknown, setUnknown] = useState({ D: 18, strainPct: 0.32, impurity: null });
  const [phaseGuess, setPhaseGuess] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [measured, setMeasured] = useState([]);

  const mat = MATERIALS[materialKey];
  const otherKeys = MAT_KEYS.filter((k) => k !== materialKey);

  const effD = mode === "explore" ? D : unknown.D;
  const effStrain = mode === "explore" ? strainPct : unknown.strainPct;
  const effImpurity =
    mode === "explore" ? (showImpurityDemo ? otherKeys[0] : null) : unknown.impurity;

  const { data, primary, impurity } = useMemo(
    () =>
      generatePattern({
        materialKey,
        D: effD,
        strainPct: effStrain,
        noiseOn: mode === "unknown" ? true : noiseOn,
        seed,
        impurityKey: effImpurity,
      }),
    [materialKey, effD, effStrain, noiseOn, mode, seed, effImpurity]
  );

  const refStick = useMemo(() => referencePeaks(materialKey), [materialKey]);
  const maxI = Math.max(...refStick.map((p) => p.I));

  const handleMeasure = useCallback(
    (clickX) => {
      const m = measureAt(data, clickX);
      if (!m) return;
      const corrDeg = Math.sqrt(Math.max(m.fwhmDeg ** 2 - INSTR_FWHM_DEG ** 2, 1e-6));
      const betaRad = (corrDeg * Math.PI) / 180;
      const thetaRad = ((m.twoTheta / 2) * Math.PI) / 180;
      const scherrerD = (SCHERRER_K * LAMBDA_NM) / (betaRad * Math.cos(thetaRad));

      const candidates = [...primary, ...impurity];
      let best = null,
        bestDist = 999;
      for (const c of candidates) {
        const dist = Math.abs(c.twoTheta - m.twoTheta);
        if (dist < bestDist) {
          bestDist = dist;
          best = c;
        }
      }
      const assigned = bestDist < 0.6 ? best : null;

      const entry = {
        ...m,
        corrDeg,
        betaRad,
        thetaRad,
        scherrerD,
        hkl: assigned ? assigned.hkl : null,
        isImpurity: assigned ? assigned.isImpurity : null,
      };

      setMeasured((prev) => {
        const filtered = prev.filter((p) => Math.abs(p.twoTheta - m.twoTheta) > 0.4);
        return [...filtered, entry].sort((a, b) => a.twoTheta - b.twoTheta);
      });
    },
    [data, primary, impurity]
  );

  const whFit = useMemo(() => {
    const primaryMeasurements = measured.filter((measurement) => !measurement.isImpurity);
    if (primaryMeasurements.length < 2) return null;
    const pts = primaryMeasurements.map((m) => ({
      x: 4 * Math.sin(m.thetaRad),
      y: m.betaRad * Math.cos(m.thetaRad),
    }));
    const r = linReg(pts);
    if (!r || r.intercept <= 0) return null;
    return {
      strainPct: r.slope * 100,
      D: (SCHERRER_K * LAMBDA_NM) / r.intercept,
      points: pts,
      slope: r.slope,
      intercept: r.intercept,
      r2: r.r2,
    };
  }, [measured]);

  const scherrerStats = useMemo(
    () => meanAndStd(measured.filter((measurement) => !measurement.isImpurity).map((measurement) => measurement.scherrerD)),
    [measured],
  );

  const latticeFit = useMemo(() => {
    const pts = measured
      .filter((m) => m.hkl && !m.isImpurity)
      .map((m) => {
        const [h, k, l] = m.hkl;
        const dMeas = LAMBDA_NM / (2 * Math.sin(m.thetaRad));
        const Y = 1 / (dMeas * dMeas);
        let X1, X2;
        if (mat.system === "cubic") {
          X1 = h * h + k * k + l * l;
          X2 = 0;
        } else if (mat.system === "tetragonal") {
          X1 = h * h + k * k;
          X2 = l * l;
        } else {
          X1 = (4 / 3) * (h * h + h * k + k * k);
          X2 = l * l;
        }
        return { X1, X2, Y };
      });
    return fitLattice(mat.system, pts);
  }, [measured, mat.system]);

  function newUnknownSample() {
    const rng = makeRng(Date.now() % 100000);
    const hasImpurity = rng() < 0.4;
    const impurityOptions = MAT_KEYS.filter((k) => k !== materialKey);
    setUnknown({
      D: +(8 + rng() * 55).toFixed(1),
      strainPct: +(rng() * 0.55).toFixed(3),
      impurity: hasImpurity
        ? impurityOptions[Math.floor(rng() * impurityOptions.length)]
        : null,
    });
    setSeed(Math.floor(rng() * 1e6));
    setRevealed(false);
    setPhaseGuess(null);
    setMeasured([]);
  }

  function switchMode(m) {
    setMode(m);
    setMeasured([]);
    setRevealed(false);
    setPhaseGuess(null);
    if (m === "unknown") newUnknownSample();
  }

  function switchMaterial(k) {
    setMaterialKey(k);
    setMeasured([]);
    setRevealed(false);
    setPhaseGuess(null);
    setShowImpurityDemo(false);
  }

  function downloadText(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const phaseCorrect = revealed && phaseGuess === (unknown.impurity ? "impure" : "pure");

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-body{font-family:'Inter',ui-sans-serif,sans-serif;}
        .font-display{font-family:'Space Grotesk',ui-sans-serif,sans-serif;}
        .font-data{font-family:'JetBrains Mono',ui-monospace,monospace;}
        input[type=range]{ -webkit-appearance:none; height:4px; border-radius:9999px; background:var(--border); }
        input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:9999px; background:var(--accent); border:2px solid var(--bg-surface); margin-top:-6px; cursor:pointer; box-shadow:0 0 0 3px var(--accent-glow);}
        input[type=range]::-moz-range-thumb{ width:16px; height:16px; border-radius:9999px; background:var(--accent); border:2px solid var(--bg-surface); cursor:pointer; }
      `}</style>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-data tracking-widest uppercase mb-1">
              <Radio size={13} className="animate-pulse" />
              Virtual Diffraction Bench
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
              Powder XRD &mdash; Phase, Size, Strain &amp; Lattice
            </h1>
            <p className="text-[var(--text-tertiary)] text-sm mt-1 max-w-xl">
              Click any peak on the trace to measure it. Cu K&alpha;&#8321;, &lambda; = 1.5406&nbsp;&Aring;.
              Instrument broadening &beta;<sub>inst</sub> = {INSTR_FWHM_DEG}&deg; is applied automatically
              and must be removed during analysis&mdash;the console does this for you once a peak is measured.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 font-data text-xs text-[var(--text-quaternary)]">
            <span>SAMPLE&nbsp;#{seed.toString().padStart(5, "0")}</span>
            <span className={mode === "unknown" ? "text-[var(--warn)]" : "text-[var(--accent)]"}>
              {mode === "unknown" ? "\u25CF UNKNOWN MODE" : "\u25CF EXPLORE MODE"}
            </span>
          </div>
        </div>

        {/* Material + mode selectors */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1">
            {MAT_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => switchMaterial(k)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  materialKey === k
                    ? "bg-[var(--accent)] text-[var(--text-on-accent)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {MATERIALS[k].label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1">
            <button
              onClick={() => switchMode("explore")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === "explore" ? "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => switchMode("unknown")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                mode === "unknown" ? "bg-[var(--warn)] text-[var(--text-on-warn)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Unknown sample
            </button>
          </div>
          <span className="text-xs text-[var(--text-quaternary)] font-data">
            {mat.full} &middot; {mat.system}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column: chart + stick pattern + table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                  <Crosshair size={15} className="text-[var(--accent)]" />
                  Diffractogram
                </div>
                <button
                  onClick={() => setMeasured([])}
                  className="flex items-center gap-1 text-xs text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] transition-colors"
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
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[20, 80]}
                    stroke="var(--text-muted)"
                    tick={{ fill: "var(--text-quaternary)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                    label={{
                      value: "2\u03B8 (\u00B0)",
                      position: "insideBottom",
                      offset: -2,
                      fill: "var(--text-quaternary)",
                      fontSize: 11,
                    }}
                  />
                  <YAxis hide domain={[0, "dataMax + 20"]} />
                  <Tooltip
                    cursor={{ stroke: "var(--accent)", strokeDasharray: "3 3" }}
                    contentStyle={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                    }}
                    labelFormatter={(v) => `2\u03B8 = ${v}\u00B0`}
                    formatter={(v) => [v.toFixed(0), "I"]}
                  />
                  {measured.map((m, i) => (
                    <ReferenceArea
                      key={i}
                      x1={m.leftX}
                      x2={m.rightX}
                      fill="var(--warn-strong)"
                      fillOpacity={0.14}
                      stroke="var(--warn-strong)"
                      strokeOpacity={0.4}
                    />
                  ))}
                  {measured.map((m, i) => (
                    <ReferenceDot
                      key={i}
                      x={m.twoTheta}
                      y={m.intensity}
                      r={4}
                      fill="var(--warn-strong)"
                      stroke="var(--bg-surface)"
                      strokeWidth={2}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="var(--accent)"
                    strokeWidth={1.6}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={280}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* reference stick pattern */}
              <div className="mt-1 pt-3 border-t border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-quaternary)] font-data mb-1.5 uppercase tracking-wide">
                  Reference pattern &mdash; {mat.label}
                  {effImpurity && (revealed || mode === "explore") && (
                    <span className="text-[var(--danger)]"> &nbsp;+ trace {MATERIALS[effImpurity].label}</span>
                  )}
                </div>
                <div className="relative h-10 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border)]">
                  {refStick.map((p, i) => (
                    <div
                      key={i}
                      title={`(${p.hkl.join("")}) ${p.twoTheta.toFixed(2)}\u00B0`}
                      className="absolute bottom-0 w-[2px] bg-[var(--accent)]/70"
                      style={{
                        left: `${((p.twoTheta - 20) / 60) * 100}%`,
                        height: `${10 + (p.I / maxI) * 28}px`,
                      }}
                    />
                  ))}
                  {effImpurity &&
                    (revealed || mode === "explore") &&
                    referencePeaks(effImpurity).map((p, i) => (
                      <div
                        key={`imp-${i}`}
                        title={`impurity (${p.hkl.join("")}) ${p.twoTheta.toFixed(2)}\u00B0`}
                        className="absolute bottom-0 w-[2px] bg-[var(--danger)]/70"
                        style={{
                          left: `${((p.twoTheta - 20) / 60) * 100}%`,
                          height: `${10 + (p.I / maxI) * 22}px`,
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Peak table */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-[var(--text-secondary)] text-sm font-medium">Measured peaks ({measured.length})</div>
                {measured.length > 0 && <button onClick={() => downloadText(`${materialKey}_${mode}_peaks.csv`, `hkl,two_theta_deg,fwhm_measured_deg,fwhm_corrected_deg,scherrer_nm,assignment\n${measured.map((m) => `${m.hkl ? m.hkl.join("") : "unassigned"},${m.twoTheta.toFixed(4)},${m.fwhmDeg.toFixed(5)},${m.corrDeg.toFixed(5)},${m.scherrerD.toFixed(4)},${m.isImpurity ? "secondary" : "primary"}`).join("\n")}\n`)} className="flex items-center gap-1 text-xs text-[var(--text-quaternary)] hover:text-[var(--accent)]"><Download size={12}/>Export CSV</button>}
              </div>
              {measured.length === 0 ? (
                <p className="text-sm text-[var(--text-quaternary)]">
                  No peaks measured yet &mdash; click on a peak in the trace above. The console finds the
                  local maximum and reads the half-maximum width automatically.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-data">
                    <thead>
                      <tr className="text-[var(--text-quaternary)] border-b border-[var(--border)]">
                        <th className="text-left py-1.5 pr-3">hkl</th>
                        <th className="text-right py-1.5 pr-3">2&theta;</th>
                        <th className="text-right py-1.5 pr-3">FWHM(meas)</th>
                        <th className="text-right py-1.5 pr-3">FWHM(corr)</th>
                        <th className="text-right py-1.5 pr-3">D (Scherrer)</th>
                        <th className="py-1.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {measured.map((m, i) => (
                        <tr key={i} className="border-b border-[var(--border-soft)]">
                          <td className={`py-1.5 pr-3 ${m.isImpurity ? "text-[var(--danger)]" : "text-[var(--accent-soft)]"}`}>
                            {m.hkl ? `(${m.hkl.join("")})` : "unassigned"}
                          </td>
                          <td className="text-right py-1.5 pr-3">{m.twoTheta.toFixed(2)}&deg;</td>
                          <td className="text-right py-1.5 pr-3 text-[var(--text-tertiary)]">{m.fwhmDeg.toFixed(3)}&deg;</td>
                          <td className="text-right py-1.5 pr-3 text-[var(--text-tertiary)]">{m.corrDeg.toFixed(3)}&deg;</td>
                          <td className="text-right py-1.5 pr-3 text-[var(--text-primary)]">{m.scherrerD.toFixed(1)} nm</td>
                          <td className="py-1.5 text-right">
                            <button
                              onClick={() =>
                                setMeasured((prev) => prev.filter((_, idx) => idx !== i))
                              }
                              className="text-[var(--text-muted)] hover:text-[var(--danger)]"
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
          </div>

          {/* Right column: controls + analysis */}
          <div className="space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              {mode === "explore" ? (
                <>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium mb-4">
                    <FlaskConical size={15} className="text-[var(--accent)]" />
                    Sample controls
                  </div>
                  <label className="text-xs text-[var(--text-tertiary)] flex justify-between mb-1">
                    Crystallite size D <span className="font-data text-[var(--accent-soft)]">{D} nm</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={1}
                    value={D}
                    onChange={(e) => setD(+e.target.value)}
                    className="w-full mb-4 accent-[var(--accent)]"
                  />
                  <label className="text-xs text-[var(--text-tertiary)] flex justify-between mb-1">
                    Microstrain &epsilon;{" "}
                    <span className="font-data text-[var(--accent-soft)]">{strainPct.toFixed(2)}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={strainPct}
                    onChange={(e) => setStrainPct(+e.target.value)}
                    className="w-full mb-4 accent-[var(--accent)]"
                  />
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[var(--text-tertiary)]">Counting noise</span>
                    <button
                      onClick={() => setNoiseOn((v) => !v)}
                      className={`text-xs px-2 py-1 rounded-md font-data ${
                        noiseOn ? "bg-[var(--accent)]/15 text-[var(--accent-soft)]" : "bg-[var(--bg-surface-2)] text-[var(--text-quaternary)]"
                      }`}
                    >
                      {noiseOn ? "ON" : "OFF"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-tertiary)]">Demo: trace impurity</span>
                    <button
                      onClick={() => setShowImpurityDemo((v) => !v)}
                      className={`text-xs px-2 py-1 rounded-md font-data ${
                        showImpurityDemo ? "bg-[var(--danger)]/15 text-[var(--danger)]" : "bg-[var(--bg-surface-2)] text-[var(--text-quaternary)]"
                      }`}
                    >
                      {showImpurityDemo ? "ON" : "OFF"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium mb-3">
                    <FlaskConical size={15} className="text-[var(--warn)]" />
                    Unknown sample
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mb-4">
                    A batch of {mat.label} nanoparticles has been synthesised. Determine its crystallite
                    size, microstrain, and whether it is phase-pure &mdash; from the diffractogram alone.
                  </p>
                  <button
                    onClick={newUnknownSample}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--warn)] text-[var(--text-on-warn)] text-sm font-medium rounded-lg py-2 mb-2 hover:bg-[var(--warn-strong)] transition-colors"
                  >
                    <RefreshCw size={14} /> Generate new sample
                  </button>
                  <button
                    disabled={measured.length < 3 || !phaseGuess}
                    onClick={() => setRevealed(true)}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-medium rounded-lg py-2 transition-colors ${
                      measured.length < 3 || !phaseGuess
                        ? "bg-[var(--bg-surface-2)] text-[var(--text-muted)] cursor-not-allowed"
                        : "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)] hover:bg-[var(--surface-inverse-hover)]"
                    }`}
                  >
                    <Eye size={14} /> Reveal ground truth
                  </button>
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {["pure", "impure"].map((choice) => <button key={choice} onClick={() => setPhaseGuess(choice)} className={`rounded-lg py-1.5 text-xs font-medium ${phaseGuess === choice ? "bg-[var(--surface-inverse)] text-[var(--text-on-inverse)]" : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]"}`}>{choice === "pure" ? "Phase-pure" : "Secondary phase"}</button>)}
                  </div>
                  {(measured.length < 3 || !phaseGuess) && <p className="text-[11px] text-[var(--text-muted)] mt-2">Measure at least 3 peaks and record a phase-purity hypothesis to reveal.</p>}
                </>
              )}
            </div>

            {/* Williamson-Hall analysis */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary)] text-sm font-medium mb-3">Williamson-Hall fit</div>
              {whFit ? (
                <div className="space-y-2 font-data text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary)]">D (size, W-H)</span>
                    <span className="text-[var(--text-primary)]">{whFit.D.toFixed(1)} nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary)]">&epsilon; (strain, W-H)</span>
                    <span className="text-[var(--text-primary)]">{whFit.strainPct.toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary)]">linearity R²</span>
                    <span className={whFit.r2 >= 0.98 ? "text-[var(--success)]" : "text-[var(--warn)]"}>{whFit.r2.toFixed(4)}</span>
                  </div>
                  {(mode === "explore" || revealed) && (
                    <div className="pt-2 mt-2 border-t border-[var(--border)] text-xs text-[var(--text-quaternary)]">
                      <div className="flex justify-between">
                        <span>ground truth D</span>
                        <span className="text-[var(--success)]">{effD.toFixed(1)} nm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ground truth &epsilon;</span>
                        <span className="text-[var(--success)]">{effStrain.toFixed(3)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-quaternary)]">
                  Measure at least 2 peaks (ideally spanning low and high 2&theta;) to separate size and
                  strain broadening.
                </p>
              )}
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary)] text-sm font-medium mb-3">Measurement consistency</div>
              {scherrerStats ? (
                <div className="space-y-2 font-data text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-quaternary)]">mean Scherrer D</span><span>{scherrerStats.mean.toFixed(1)} nm</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-quaternary)]">peak-to-peak SD</span><span className={scherrerStats.std / scherrerStats.mean < 0.15 ? "text-[var(--success)]" : "text-[var(--warn)]"}>{scherrerStats.std.toFixed(2)} nm</span></div>
                  <p className="text-[11px] font-sans text-[var(--text-muted)]">A large spread flags overlap, anisotropic broadening, poor FWHM picks, or an invalid single-size assumption.</p>
                </div>
              ) : <p className="text-xs text-[var(--text-quaternary)]">Measure two primary peaks to compare their individual Scherrer sizes before trusting the Williamson–Hall fit.</p>}
            </div>

            {/* Lattice parameter */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="text-[var(--text-secondary)] text-sm font-medium mb-3">Lattice parameter</div>
              {latticeFit ? (
                <div className="space-y-1.5 font-data text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-quaternary)]">a</span>
                    <span className="text-[var(--text-primary)]">{(latticeFit.aNm * 10).toFixed(4)} &Aring;</span>
                  </div>
                  {latticeFit.cNm && (
                    <div className="flex justify-between">
                      <span className="text-[var(--text-quaternary)]">c</span>
                      <span className="text-[var(--text-primary)]">{(latticeFit.cNm * 10).toFixed(4)} &Aring;</span>
                    </div>
                  )}
                  <div className="pt-2 mt-1 border-t border-[var(--border)] text-xs text-[var(--text-quaternary)]">
                    literature: a = {mat.a.toFixed(4)} &Aring;{mat.c ? `, c = ${mat.c.toFixed(4)} \u00C5` : ""}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--text-quaternary)]">
                  {mat.system === "cubic"
                    ? "Measure at least 2 indexed peaks."
                    : "Measure at least 2 indexed peaks with different l (e.g. an (00l) and an (hk0))."}
                </p>
              )}
            </div>

            {mode === "unknown" && revealed && (
              <div className={`bg-[var(--bg-surface)] border rounded-2xl p-4 ${phaseCorrect ? "border-[var(--success-border)]" : "border-[var(--danger-border)]"}`}>
                <div className={`flex items-center gap-2 text-sm font-medium mb-2 ${phaseCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                  {phaseCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {phaseCorrect ? "Phase call supported" : "Revisit the phase call"}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] space-y-1 font-data">
                  <div>D = {unknown.D} nm, &epsilon; = {unknown.strainPct}%</div>
                  <div>
                    secondary phase:{" "}
                    {unknown.impurity ? (
                      <span className="text-[var(--danger)]">{MATERIALS[unknown.impurity].label} (present)</span>
                    ) : (
                      <span className="text-[var(--success)]">none &mdash; phase-pure</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mt-6 max-w-3xl">
          Peak positions are computed from standard unit-cell geometry; relative intensities are
          representative literature-typical values for teaching, not a specific ICDD reference card.
          Broadening follows the uniform-strain Williamson&ndash;Hall model, &beta;cos&theta; =
          K&lambda;/D + 4&epsilon;sin&theta;, with instrumental broadening added in quadrature.
        </p>
      </div>
    </div>
  );
}
