import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  Download,
  Gauge,
  Magnet,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

const E = 1.602176634e-19;

const DEFAULTS = {
  current: 8.0,
  field: 0.42,
  thickness: 0.50,
  width: 5.0,
  probeSpacing: 10.0,
  hallVoltage: 13.1,
  longitudinalVoltage: 42.0,
};

function Metric({ label, value, unit, tone = "accent", hint }) {
  return (
    <div className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-quaternary)] font-data">{label}</div>
      <div className={`mt-1 text-xl font-semibold font-data text-[var(--${tone})]`}>{value}</div>
      <div className="text-[11px] text-[var(--text-tertiary)]">{unit}</div>
      {hint && <div className="text-[10px] text-[var(--text-quaternary)] mt-1">{hint}</div>}
    </div>
  );
}

function NumberField({ label, value, onChange, unit, step = "any", min = 0 }) {
  return (
    <label className="block">
      <span className="flex justify-between gap-2 text-xs text-[var(--text-secondary)] mb-1">
        <span>{label}</span><span className="text-[var(--text-quaternary)] font-data">{unit}</span>
      </span>
      <input
        type="number" min={min} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-data text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
      />
    </label>
  );
}

export default function HallEffectLab() {
  const [sampleType, setSampleType] = useState("n");
  const [values, setValues] = useState(DEFAULTS);
  const [polarity, setPolarity] = useState("positive");
  const [showFormula, setShowFormula] = useState(false);
  const [sweepVariable, setSweepVariable] = useState("field");

  const result = useMemo(() => {
    const { current: I, field: B, thickness: tMm, width: wMm, probeSpacing: Lmm, hallVoltage: vhUv, longitudinalVoltage: vlMv } = values;
    const t = tMm * 1e-3;
    const width = wMm * 1e-3;
    const length = Lmm * 1e-3;
    const vh = vhUv * 1e-6;
    const vl = vlMv * 1e-3;
    const signedVh = (polarity === "positive" ? 1 : -1) * vh;
    const rh = (signedVh * t) / (I * B);
    const resistivity = (vl / I) * (width * t) / length;
    const density = 1 / (Math.abs(rh) * E);
    const mobility = Math.abs(rh) / resistivity;
    return { rh, resistivity, density, mobility, signedVh };
  }, [values, polarity]);

  const update = (key) => (value) => setValues((prev) => ({ ...prev, [key]: value }));
  const polarityLabel = result.rh < 0 ? "negative Hall sign → n-type" : "positive Hall sign → p-type";
  const hallLevel = Math.min(1, Math.max(0, values.hallVoltage / 35));

  const sweepData = useMemo(() => {
    const sign = polarity === "positive" ? 1 : -1;
    const t = values.thickness * 1e-3;
    const baseHall = Math.abs(result.rh);
    const points = sweepVariable === "field"
      ? Array.from({ length: 25 }, (_, index) => 0.05 + index * 0.05).map((B) => ({ x: B, label: B.toFixed(2), hallVoltage: sign * baseHall * values.current * 1e-3 * B / t * 1e6 }))
      : sweepVariable === "current"
        ? Array.from({ length: 25 }, (_, index) => 1 + index * 0.5).map((I) => ({ x: I, label: I.toFixed(1), hallVoltage: sign * baseHall * I * 1e-3 * values.field / t * 1e6 }))
        : Array.from({ length: 25 }, (_, index) => 0.10 + index * 0.05).map((thickness) => ({ x: thickness, label: thickness.toFixed(2), hallVoltage: sign * baseHall * values.current * 1e-3 * values.field / (thickness * 1e-3) * 1e6 }));
    return points;
  }, [polarity, result.rh, sweepVariable, values]);

  const pythonCode = useMemo(() => `import numpy as np
import matplotlib.pyplot as plt

e = 1.602176634e-19       # C
I = ${values.current / 1000}      # A
B = ${values.field}             # T
t = ${values.thickness / 1000}       # m
w = ${values.width / 1000}       # m
L = ${values.probeSpacing / 1000}      # m
VH = ${values.hallVoltage * 1e-6}    # V
VL = ${values.longitudinalVoltage / 1000}   # V

RH = VH*t/(I*B)
n = 1/(e*abs(RH))
rho = (VL/I)*(w*t/L)
mu = abs(RH)/rho

B_sweep = np.linspace(0.05, 1.25, 100)
VH_sweep = RH*I*B_sweep/t
plt.plot(B_sweep, VH_sweep*1e6)
plt.xlabel("Magnetic field B (T)")
plt.ylabel("Predicted Hall voltage (microV)")
plt.grid(True); plt.show()`, [values]);

  function reset() {
    setValues(DEFAULTS);
    setSampleType("n");
    setPolarity("positive");
  }

  function exportCsv() {
    const csv = [
      "Hall coefficient experiment observation",
      "quantity,value,unit",
      `sample type,${sampleType}-type,—`,
      `current,${values.current},mA`,
      `magnetic field,${values.field},T`,
      `wafer thickness,${values.thickness},mm`,
      `wafer width,${values.width},mm`,
      `probe spacing,${values.probeSpacing},mm`,
      `Hall voltage,${values.hallVoltage},µV`,
      `longitudinal voltage,${values.longitudinalVoltage},mV`,
      `Hall coefficient,${result.rh},m³/C`,
      `carrier density,${result.density},m⁻³`,
      `resistivity,${result.resistivity},Ω·m`,
      `mobility,${result.mobility},m²/V·s`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hall-effect-observation.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body">
      <style>{`input[type=range]{accent-color:var(--accent)} .hall-electron{animation:hall-drift 2.8s linear infinite} @keyframes hall-drift{0%{transform:translateX(-10px);opacity:.2}15%{opacity:1}85%{opacity:1}100%{transform:translateX(190px);opacity:.2}}`}</style>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-data tracking-widest uppercase mb-1"><Magnet size={14} /> Virtual Hall Bench</div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Hall coefficient, carrier density &amp; mobility</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1 max-w-2xl">Measure the transverse Hall voltage of a semiconductor wafer and connect its sign and magnitude to the dominant charge carriers.</p>
          </div>
          <div className="text-right text-xs font-data text-[var(--text-quaternary)]"><div>SAMPLE HW-042</div><div className="text-[var(--accent)] mt-1">● LIVE ANALYSIS</div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><div className="flex items-center gap-2 font-medium"><Activity size={16} className="text-[var(--accent)]" /> Measurement workspace</div><div className="flex gap-1 bg-[var(--bg-surface-2)] rounded-lg p-1">{["n", "p"].map((type) => <button key={type} onClick={() => setSampleType(type)} className={`px-3 py-1 rounded-md text-xs font-data ${sampleType === type ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>{type}-type wafer</button>)}</div></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <NumberField label="Bias current, I" unit="mA" value={values.current} onChange={update("current")} step="0.1" />
                <NumberField label="Magnetic flux density, B" unit="T" value={values.field} onChange={update("field")} step="0.01" />
                <NumberField label="Wafer thickness, t" unit="mm" value={values.thickness} onChange={update("thickness")} step="0.01" />
                <NumberField label="Wafer width, w" unit="mm" value={values.width} onChange={update("width")} step="0.1" />
                <NumberField label="Longitudinal probe spacing, L" unit="mm" value={values.probeSpacing} onChange={update("probeSpacing")} step="0.1" />
                <NumberField label="Longitudinal voltage, Vₗ" unit="mV" value={values.longitudinalVoltage} onChange={update("longitudinalVoltage")} step="0.1" />
              </div>
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3">
                <div className="flex flex-wrap justify-between items-center gap-3"><label className="text-xs text-[var(--text-secondary)]">Hall voltage, V<sub>H</sub> <span className="text-[var(--text-quaternary)]">(reverse field and use half-difference for best practice)</span></label><span className="font-data text-sm text-[var(--accent)]">{values.hallVoltage.toFixed(1)} µV</span></div>
                <input type="range" min="1" max="35" step="0.1" value={values.hallVoltage} onChange={(event) => update("hallVoltage")(Number(event.target.value))} className="w-full mt-3" />
                <div className="flex justify-between text-[10px] text-[var(--text-quaternary)] font-data mt-1"><span>1 µV</span><span>35 µV</span></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4"><div className="text-xs text-[var(--text-tertiary)]">Measured V<sub>H</sub> terminal polarity</div><div className="flex gap-2">{["positive", "negative"].map((p) => <button key={p} onClick={() => setPolarity(p)} className={`px-3 py-1.5 rounded-lg text-xs border ${polarity === p ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] text-[var(--text-tertiary)]"}`}>{p === "positive" ? "+ V_H" : "− V_H"}</button>)}</div></div>
            </section>

            <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 font-medium"><Zap size={16} className="text-[var(--accent)]" /> Four-probe wafer view</div><span className="text-[10px] font-data text-[var(--text-quaternary)]">I → x · B ⊙ z · V<sub>H</sub> → y</span></div>
              <div className="relative h-36 rounded-xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-slate-900 via-cyan-950/60 to-slate-900">
                <div className="absolute inset-x-12 top-1/2 h-14 -translate-y-1/2 rounded-[45%] bg-cyan-500/15 border border-cyan-300/50 transition-all duration-300" style={{ boxShadow: "0 0 " + (18 + hallLevel * 35) + "px rgba(34,211,238," + (0.12 + hallLevel * 0.28) + ")" }} />
                <div className="absolute left-16 right-16 top-1/2 h-12 -translate-y-1/2 rounded-[45%] transition-all duration-300" style={{ opacity: 0.25 + hallLevel * 0.75, background: "linear-gradient(90deg, rgba(251,191,36,.8) 0%, rgba(34,211,238,.08) 50%, rgba(251,113,133,.8) 100%)" }} />
                <div className="absolute left-12 top-1/2 -translate-y-1/2 h-12 w-2 rounded-l-full bg-amber-300 transition-all duration-300" style={{ opacity: 0.25 + hallLevel * 0.75, transform: "translateY(-50%) scaleX(" + (0.7 + hallLevel * 1.8) + ")" }} />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 h-12 w-2 rounded-r-full bg-rose-300 transition-all duration-300" style={{ opacity: 0.25 + hallLevel * 0.75, transform: "translateY(-50%) scaleX(" + (0.7 + hallLevel * 1.8) + ")" }} />
                <div className="absolute inset-x-16 top-1/2 -translate-y-1/2 flex justify-between text-[10px] font-data text-cyan-200"><span>● I+</span><span>● V₊ &nbsp;&nbsp; V₋ ●</span><span>● I−</span></div>
                <div className="absolute left-24 top-[calc(50%-13px)] hall-electron text-amber-300 text-xs" style={{ animationDuration: (3.2 - hallLevel * 1.8) + "s" }}>e⁻</div><div className="absolute left-40 top-[calc(50%+13px)] hall-electron text-amber-300 text-xs" style={{ animationDelay: "-1.2s", animationDuration: (3.2 - hallLevel * 1.8) + "s" }}>e⁻</div>
                <div className="absolute right-3 top-3 text-[10px] text-cyan-200 font-data">B = {values.field.toFixed(2)} T ⊙</div><div className="absolute bottom-3 left-3 text-[10px] text-amber-200 font-data">V_H = {polarity === "positive" ? "+" : "−"}{values.hallVoltage.toFixed(1)} µV · ΔV gradient {Math.round(hallLevel * 100)}%</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4"><Metric label="Hall sign" value={result.rh < 0 ? "−" : "+"} unit={polarityLabel} tone={result.rh < 0 ? "warn" : "accent"} /><Metric label="Dominant carrier" value={result.rh < 0 ? "electrons" : "holes"} unit="from Hall polarity" /><Metric label="Check" value="4 / 4" unit="quantities resolved" tone="good" /></div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5"><div className="flex items-center gap-2 font-medium mb-4"><Gauge size={16} className="text-[var(--accent)]" /> Derived quantities</div><div className="space-y-2"><Metric label="Hall coefficient, R_H" value={result.rh.toExponential(3)} unit="m³ C⁻¹" /><Metric label="Carrier density, n" value={result.density.toExponential(3)} unit="m⁻³" /><Metric label="Resistivity, ρ" value={result.resistivity.toExponential(3)} unit="Ω m" /><Metric label="Mobility, μ" value={result.mobility.toExponential(3)} unit="m² V⁻¹ s⁻¹" /></div><button onClick={() => setShowFormula((prev) => !prev)} className="w-full mt-4 text-xs text-[var(--accent)] hover:text-[var(--accent-soft)]">{showFormula ? "Hide equations" : "Show equations"}</button>{showFormula && <div className="mt-3 p-3 rounded-lg bg-[var(--bg-surface-2)] text-[11px] font-data text-[var(--text-secondary)] leading-7">R_H = V_H t / IB<br />n = 1 / (e |R_H|)<br />ρ = (Vₗ/I) · wt/L<br />μ = |R_H| / ρ</div>}</section>
            <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5"><div className="flex items-center gap-2 font-medium mb-3"><Sparkles size={16} className="text-[var(--accent)]" /> Experimental checklist</div><div className="space-y-3 text-xs text-[var(--text-tertiary)]"><div className="flex gap-2"><CheckCircle2 size={15} className="text-[var(--good)] shrink-0" /> Keep the current low to limit Joule heating.</div><div className="flex gap-2"><CheckCircle2 size={15} className="text-[var(--good)] shrink-0" /> Reverse B and average V<sub>H</sub> to remove offsets.</div><div className="flex gap-2"><CheckCircle2 size={15} className="text-[var(--good)] shrink-0" /> Record units before calculating powers of ten.</div></div></section>
            <div className="flex gap-2"><button onClick={exportCsv} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs text-[var(--text-secondary)] hover:border-[var(--accent)]"><Download size={14} /> Export CSV</button><button onClick={reset} title="Reset" className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 text-[var(--text-secondary)] hover:text-[var(--accent)]"><RotateCcw size={14} /></button></div>
          </aside>
        </div>

        <section className="mt-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div><div className="flex items-center gap-2 font-medium"><Activity size={16} className="text-[var(--accent)]" /> Computational analysis</div><p className="text-xs text-[var(--text-quaternary)] mt-1">Sweep one input while the other measured quantities remain fixed. The chart is generated from the same equations used for the live result.</p></div>
            <div className="flex gap-1 bg-[var(--bg-surface-2)] rounded-lg p-1">{[["field", "B sweep"], ["current", "I sweep"], ["thickness", "t sweep"]].map(([key, label]) => <button key={key} onClick={() => setSweepVariable(key)} className={`px-2.5 py-1 rounded-md text-xs ${sweepVariable === key ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}>{label}</button>)}</div>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-5">
            <div>
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={sweepData} margin={{ top: 8, right: 12, bottom: 22, left: 4 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="x" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: sweepVariable === "field" ? "B (T)" : sweepVariable === "current" ? "I (mA)" : "t (mm)", position: "insideBottom", offset: -12, fill: "var(--text-quaternary)", fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "V_H (µV)", angle: -90, position: "insideLeft", fill: "var(--text-quaternary)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} formatter={(value) => [`${Number(value).toFixed(2)} µV`, "predicted V_H"]} />
                  <Line type="monotone" dataKey="hallVoltage" name="Predicted Hall voltage" stroke="var(--accent)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]"><span className="text-xs font-medium text-[var(--text-secondary)]">Python / NumPy analysis</span><span className="text-[10px] font-data text-[var(--accent)]">REPRODUCIBLE</span></div>
              <pre className="p-3 text-[10px] leading-relaxed font-data text-[var(--text-tertiary)] overflow-x-auto max-h-[290px]">{pythonCode}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
