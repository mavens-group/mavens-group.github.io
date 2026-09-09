import React, { useMemo, useState } from "react";
import { Activity, ArrowRight, Atom, CheckCircle2, CircleDot, Gauge, GitBranch, Info, Orbit, Play, RotateCcw, Sigma, Sparkles, Waves } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const G = 9.81;
const PENDULUM_DEFAULTS = { angle: 45, length: 1, duration: 12 };
const LORENZ_DEFAULTS = { sigma: 10, rho: 28, beta: 8 / 3, duration: 32 };
const format = (value, digits = 3) => (Number.isFinite(value) ? value.toFixed(digits) : "—");

const BVP_PYTHON = `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_bvp

g, L = 9.81, 1.0
theta0 = np.deg2rad(45.0)
T = 2 * np.pi * np.sqrt(L / g)
t = np.linspace(0, T / 4, 200)

# y[0] = theta and y[1] = dtheta/dt
def pendulum_bvp(t, y):
    return np.vstack((y[1], -(g / L) * np.sin(y[0])))

# Boundary conditions: angle theta0 at t=0 and zero angle at t=T/4.
def boundary(ya, yb):
    return np.array([ya[0] - theta0, yb[0]])

guess = np.vstack((theta0 * (1 - t / t[-1]), -theta0 / t[-1] * np.ones_like(t)))
solution = solve_bvp(pendulum_bvp, boundary, t, guess)
if not solution.success:
    raise RuntimeError(solution.message)

tt = np.linspace(t[0], t[-1], 1000)
theta = solution.sol(tt)[0]
plt.plot(tt, np.rad2deg(theta))
plt.xlabel("time (s)"); plt.ylabel("angle (degree)")
plt.title("Nonlinear pendulum — BVP")
plt.grid(); plt.show()`;

const IVP_PYTHON = `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

sigma, rho, beta = 10.0, 28.0, 8.0 / 3.0

def lorenz(t, state):
    x, y, z = state
    return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z]

time = (0.0, 32.0)
t_eval = np.linspace(*time, 6400)
solution = solve_ivp(lorenz, time, [0.1, 0.0, 0.0], t_eval=t_eval,
                     rtol=1e-8, atol=1e-10)
if not solution.success:
    raise RuntimeError(solution.message)

x, y, z = solution.y
plt.plot(x, z, lw=0.7)
plt.xlabel("x"); plt.ylabel("z")
plt.title("Lorenz attractor — IVP")
plt.grid(); plt.show()`;

function rk4(state, h, f) {
  const sum = (a, b, k = 1) => a.map((v, i) => v + k * b[i]);
  const k1 = f(state), k2 = f(sum(state, k1, h / 2)), k3 = f(sum(state, k2, h / 2)), k4 = f(sum(state, k3, h));
  return state.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

function pendulum({ angle, length, duration }) {
  const h = 0.01, initial = angle * Math.PI / 180;
  let nonlinear = [initial, 0], linear = [initial, 0], previous = initial, quarter = null;
  const data = [];
  for (let step = 0; step <= Math.round(duration / h); step += 1) {
    const time = step * h;
    if (step % 2 === 0) data.push({ time, nonlinear: nonlinear[0] * 180 / Math.PI, linear: linear[0] * 180 / Math.PI, velocity: nonlinear[1] });
    nonlinear = rk4(nonlinear, h, ([theta, omega]) => [omega, -G / length * Math.sin(theta)]);
    linear = rk4(linear, h, ([theta, omega]) => [omega, -G / length * theta]);
    if (quarter === null && previous > 0 && nonlinear[0] <= 0) quarter = time - h + h * previous / (previous - nonlinear[0]);
    previous = nonlinear[0];
  }
  const linearPeriod = 2 * Math.PI * Math.sqrt(length / G);
  return { data, linearPeriod, nonlinearPeriod: quarter && 4 * quarter, mismatch: Math.max(...data.map((p) => Math.abs(p.nonlinear - p.linear))), energy: G * length * (1 - Math.cos(initial)) };
}

function lorenz({ sigma, rho, beta, duration }) {
  const h = 0.005, f = ([x, y, z]) => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
  let state = [0.1, 0, 0], peer = [0.10001, 0, 0];
  const raw = [];
  for (let step = 0; step <= Math.round(duration / h); step += 1) {
    const time = step * h;
    raw.push({ time, x: state[0], y: state[1], z: state[2], separation: Math.hypot(state[0] - peer[0], state[1] - peer[1], state[2] - peer[2]) });
    state = rk4(state, h, f); peer = rk4(peer, h, f);
  }
  const stride = Math.max(1, Math.ceil(raw.length / 1800));
  return { data: raw.filter((_, i) => i % stride === 0 || i === raw.length - 1), final: raw.at(-1), separation: raw[Math.floor(raw.length * .75)].separation, extent: raw.reduce((m, p) => Math.max(m, Math.abs(p.x), Math.abs(p.z)), 1), points: raw.length };
}

function Badge({ children, tone = "accent" }) {
  const colors = { accent: "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-soft)]", success: "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]", warn: "border-[var(--warn)]/30 bg-[var(--warn-soft)] text-[var(--warn)]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-data text-[10px] tracking-wide ${colors[tone]}`}>{children}</span>;
}
function Metric({ label, value, hint, tone = "accent" }) {
  const colors = { accent: "text-[var(--accent-soft)]", success: "text-[var(--success)]", warn: "text-[var(--warn)]" };
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] p-3"><div className="text-[10px] uppercase tracking-wider text-[var(--text-quaternary)]">{label}</div><div className={`mt-1 font-data text-lg font-medium ${colors[tone]}`}>{value}</div><div className="mt-1 text-[10px] leading-relaxed text-[var(--text-quaternary)]">{hint}</div></div>;
}
function Tip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-data text-[11px] shadow-xl"><div className="mb-1 text-[var(--text-quaternary)]">t = {Number(label).toFixed(3)} s</div>{payload.map((p) => <div key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}><span>{p.name}</span><span>{Number(p.value).toFixed(4)}{unit}</span></div>)}</div>;
}
function PythonCode({ title, code }) {
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-2 flex items-center justify-between gap-3"><div className="text-sm font-medium text-[var(--text-secondary)]">{title}</div><span className="font-data text-[10px] uppercase tracking-wider text-[var(--text-quaternary)]">Python · SciPy</span></div><p className="mb-3 text-xs text-[var(--text-quaternary)]">Run this companion script locally with <span className="font-data">numpy scipy matplotlib</span> installed.</p><pre className="max-h-[430px] overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-canvas)] p-4 font-data text-[11px] leading-relaxed text-[var(--text-secondary)]"><code>{code}</code></pre></section>;
}
function Range({ children, value, change, min, max, step, suffix = "" }) { return <label className="block"><span className="mb-2 flex justify-between text-xs text-[var(--text-tertiary)]">{children}<span className="font-data text-[var(--accent-soft)]">{value.toFixed(step < 1 ? 2 : 0)}{suffix}</span></span><input className="ode-range w-full" type="range" min={min} max={max} step={step} value={value} onChange={(e) => change(Number(e.target.value))} /></label>; }

function Pendulum() {
  const [angle, setAngle] = useState(45), [length, setLength] = useState(1), [duration, setDuration] = useState(12), [active, setActive] = useState(PENDULUM_DEFAULTS);
  const result = useMemo(() => pendulum(active), [active]);
  const small = active.angle <= 10, dirty = angle !== active.angle || length !== active.length || duration !== active.duration;
  const phase = result.data.map((p) => ({ angle: p.nonlinear, velocity: p.velocity }));
  const shift = result.nonlinearPeriod && 100 * (result.nonlinearPeriod / result.linearPeriod - 1);
  const reset = () => { setAngle(45); setLength(1); setDuration(12); setActive(PENDULUM_DEFAULTS); };
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><main className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Small-angle period" value={`${format(result.linearPeriod, 4)} s`} hint="T₀ = 2π√(L/g)" /><Metric label="Nonlinear period" value={result.nonlinearPeriod ? `${format(result.nonlinearPeriod, 4)} s` : "—"} hint="Measured numerical trace" tone={small ? "success" : "warn"} /><Metric label="Largest mismatch" value={`${format(result.mismatch, 3)}°`} hint="max |θ − θSHM|" tone={small ? "success" : "warn"} /></div><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Orbit size={16} className="text-[var(--accent)]" /> Angular response</div><p className="mt-1 text-xs text-[var(--text-quaternary)]">The exact restoring term is sin θ. The dashed line is the linear small-angle SHM equation.</p></div><Badge tone={small ? "success" : "warn"}>{small ? <CheckCircle2 size={12} /> : <Waves size={12} />}{small ? "SMALL-ANGLE SHM" : "FINITE-ANGLE NONLINEAR"}</Badge></div><ResponsiveContainer width="100%" height={310}><LineChart data={result.data} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="time" type="number" domain={[0, active.duration]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "time (s)", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "angle (°)", angle: -90, position: "insideLeft", offset: 4, fill: "var(--text-quaternary)", fontSize: 11 }} /><ReferenceLine y={0} stroke="var(--text-muted)" /><Tooltip content={<Tip unit="°" />} /><Legend wrapperStyle={{ fontSize: 11 }} /><Line name="Nonlinear pendulum" dataKey="nonlinear" type="monotone" stroke="var(--accent)" strokeWidth={2.8} dot={false} isAnimationActive={false} /><Line name="Linear SHM" dataKey="linear" type="monotone" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="5 4" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Activity size={16} className="text-[var(--warn)]" /> Phase portrait</div><p className="mb-3 text-xs text-[var(--text-quaternary)]">The nonlinear orbit departs from the ellipse of ideal SHM as amplitude grows.</p><ResponsiveContainer width="100%" height={220}><LineChart data={phase} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" /><XAxis dataKey="angle" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "θ (°)", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis dataKey="velocity" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "ω (rad s⁻¹)", angle: -90, position: "insideLeft", offset: 2, fill: "var(--text-quaternary)", fontSize: 11 }} /><Line dataKey="velocity" type="monotone" stroke="var(--accent)" strokeWidth={2.2} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section></main><aside className="space-y-4"><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Gauge size={16} className="text-[var(--accent)]" /> Pendulum controls</div><div className="space-y-5"><Range value={angle} change={setAngle} min="1" max="170" step="1" suffix="°">Release angle θ₀</Range><Range value={length} change={setLength} min="0.25" max="3" step="0.05" suffix=" m">Pendulum length L</Range><Range value={duration} change={setDuration} min="4" max="20" step="1" suffix=" s">Trace duration</Range></div><button onClick={() => setActive({ angle, length, duration })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-on-accent)]"><Play size={15} /> Run pendulum</button><button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-2 text-xs text-[var(--text-tertiary)]"><RotateCcw size={13} /> Restore baseline</button>{dirty && <div className="mt-3 rounded-lg border border-[var(--warn)]/30 bg-[var(--warn-soft)] p-2 text-[11px] text-[var(--warn)]">Parameters changed. Run to update traces.</div>}</section><section className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--accent-soft)]"><Sigma size={15} /> Read the model</div><div className="font-data text-[11px] text-[var(--text-secondary)]">θ″ + (g/L)sin θ = 0</div><div className="mt-2">At small θ, sin θ ≈ θ, so nonlinear pendulum and normal SHM coincide. At large θ, the nonlinear period becomes longer.</div>{shift && <div className="mt-3 border-t border-[var(--accent)]/15 pt-3 font-data text-[var(--accent-soft)]">period shift = {format(shift, 2)}%</div>}</section><Metric label="Release energy / mass" value={`${format(result.energy, 4)} J kg⁻¹`} hint="gL(1 − cos θ₀)" /></aside></div>;
}

function Lorenz() {
  const [sigma, setSigma] = useState(10), [rho, setRho] = useState(28), [beta, setBeta] = useState(8 / 3), [duration, setDuration] = useState(32), [active, setActive] = useState(LORENZ_DEFAULTS);
  const result = useMemo(() => lorenz(active), [active]);
  const dirty = sigma !== active.sigma || rho !== active.rho || beta !== active.beta || duration !== active.duration;
  const classic = Math.abs(active.sigma - 10) < .01 && Math.abs(active.rho - 28) < .01 && Math.abs(active.beta - 8 / 3) < .02;
  const traces = result.data.map((p) => ({ ...p, logSeparation: Math.log10(Math.max(p.separation, 1e-12)) }));
  const reset = () => { setSigma(10); setRho(28); setBeta(8 / 3); setDuration(32); setActive(LORENZ_DEFAULTS); };
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><main className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Integration points" value={result.points.toLocaleString()} hint="RK4 states before display decimation" /><Metric label="Late separation" value={format(result.separation, 4)} hint="starts only 10⁻⁵ apart" tone="warn" /><Metric label="Final state" value={`(${format(result.final.x, 1)}, ${format(result.final.y, 1)}, ${format(result.final.z, 1)})`} hint="x, y, z at final time" /></div><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><GitBranch size={16} className="text-[var(--accent)]" /> Lorenz attractor — x/z projection</div><p className="mt-1 text-xs text-[var(--text-quaternary)]">A deterministic IVP can still be practically unpredictable: nearby states separate while the trajectory folds through two lobes.</p></div><Badge tone={classic ? "success" : "accent"}>{classic ? <Sparkles size={12} /> : <CircleDot size={12} />}{classic ? "CLASSIC CHAOTIC REGIME" : "CUSTOM PARAMETERS"}</Badge></div><ResponsiveContainer width="100%" height={330}><LineChart data={result.data} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" /><XAxis dataKey="x" type="number" domain={[-result.extent, result.extent]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "x", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis dataKey="z" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "z", angle: -90, position: "insideLeft", offset: 4, fill: "var(--text-quaternary)", fontSize: 11 }} /><Line dataKey="z" type="monotone" stroke="var(--accent)" strokeWidth={1.35} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Activity size={16} className="text-[var(--warn)]" /> Time trace & sensitivity</div><p className="mb-3 text-xs text-[var(--text-quaternary)]">Amber is log₁₀ distance from a second trajectory beginning only 10⁻⁵ away in x.</p><ResponsiveContainer width="100%" height={230}><LineChart data={traces} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="time" type="number" domain={[0, active.duration]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><YAxis yAxisId="state" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><YAxis yAxisId="separation" orientation="right" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><Legend wrapperStyle={{ fontSize: 11 }} /><Line yAxisId="state" name="x(t)" dataKey="x" type="monotone" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} /><Line yAxisId="state" name="z(t)" dataKey="z" type="monotone" stroke="var(--text-secondary)" strokeWidth={1.5} dot={false} isAnimationActive={false} /><Line yAxisId="separation" name="log₁₀ separation" dataKey="logSeparation" type="monotone" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="4 3" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section></main><aside className="space-y-4"><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Atom size={16} className="text-[var(--accent)]" /> IVP controls</div><div className="space-y-5"><Range value={sigma} change={setSigma} min="1" max="20" step=".5">σ (Prandtl number)</Range><Range value={rho} change={setRho} min="0" max="40" step=".5">ρ (Rayleigh parameter)</Range><Range value={beta} change={setBeta} min=".5" max="5" step=".05">β (geometry)</Range><Range value={duration} change={setDuration} min="10" max="50" step="1" suffix=" s">Integration duration</Range></div><button onClick={() => setActive({ sigma, rho, beta, duration })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-on-accent)]"><Play size={15} /> Run Lorenz IVP</button><button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-2 text-xs text-[var(--text-tertiary)]"><RotateCcw size={13} /> Restore classic case</button>{dirty && <div className="mt-3 rounded-lg border border-[var(--warn)]/30 bg-[var(--warn-soft)] p-2 text-[11px] text-[var(--warn)]">Parameters changed. Run to update attractor.</div>}</section><section className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--accent-soft)]"><Sigma size={15} /> Lorenz system</div><div className="font-data text-[11px] leading-6 text-[var(--text-secondary)]">ẋ = σ(y − x)<br />ẏ = x(ρ − z) − y<br />ż = xy − βz</div><div className="mt-2">Initial state: (0.1, 0, 0). RK4 with Δt = 0.005 s.</div></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--text-secondary)]"><Info size={15} className="text-[var(--warn)]" /> Investigation</div>Keep σ = 10 and β = 8/3. Sweep ρ through 10, 20, 28, and 35. Compare the projection and divergence trace.</section></aside></div>;
}

export default function NonlinearODELab() {
  const [tab, setTab] = useState("bvp");
  return <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body"><style>{`.font-body{font-family:Inter,ui-sans-serif,system-ui,sans-serif}.font-display{font-family:"Space Grotesk",Inter,ui-sans-serif,system-ui,sans-serif}.font-data{font-family:"JetBrains Mono",ui-monospace,monospace}.ode-range{accent-color:var(--accent)}.ode-range::-webkit-slider-runnable-track{height:4px;border-radius:9999px;background:var(--border)}.ode-range::-webkit-slider-thumb{-webkit-appearance:none;margin-top:-5px;width:14px;height:14px;border-radius:9999px;border:2px solid var(--bg-surface);background:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}`}</style><div className="mx-auto max-w-6xl p-4 md:p-7 lg:p-8"><header className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><div className="mb-1 flex items-center gap-2 font-data text-xs uppercase tracking-[.16em] text-[var(--accent)]"><CircleDot size={14} /> Dynamics & nonlinear systems studio</div><h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Non-linear ODE</h1><p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-tertiary)]">Explore nonlinear pendulum motion and its SHM limit, then move to deterministic chaos in a coupled initial-value system.</p></div><Badge><ArrowRight size={12} /> TWO EXPERIMENTS · ONE LAB</Badge></header><div className="mb-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-1"><button onClick={() => setTab("bvp")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === "bvp" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}><Orbit size={15} /> BVP · Pendulum</button><button onClick={() => setTab("ivp")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === "ivp" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}><GitBranch size={15} /> IVP · Lorenz attractor</button></div>{tab === "bvp" ? <><Pendulum /><PythonCode title="Python companion: nonlinear pendulum BVP" code={BVP_PYTHON} /></> : <><Lorenz /><PythonCode title="Python companion: Lorenz IVP" code={IVP_PYTHON} /></>}</div></div>;
}
