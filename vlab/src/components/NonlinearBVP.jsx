import React, { useMemo, useState } from "react";
import { Activity, ArrowRight, Atom, CheckCircle2, CircleDot, Gauge, GitBranch, Info, Orbit, Play, RotateCcw, Sigma, Sparkles, Waves } from "lucide-react";
import { bvpTrace, exactPeriod, solvePendulumBVP } from "../utils/pendulumBVP";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const G = 9.81;
const PENDULUM_DEFAULTS = { angle: 45, length: 1, duration: 12, mesh: 120 };
const LORENZ_DEFAULTS = { sigma: 10, rho: 28, beta: 8 / 3, duration: 32, skip: true };
const format = (value, digits = 3) => (Number.isFinite(value) ? value.toFixed(digits) : "—");

const BVP_PYTHON = `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_bvp
from scipy.special import ellipk

g, L = 9.81, 1.0
theta0 = np.deg2rad(45.0)

# Unknown quarter period tau is a PARAMETER of the problem. Rescale s = t/tau
# so the interval is fixed at [0, 1]:  d(theta)/ds = tau*omega, d(omega)/ds = -tau*(g/L)*sin(theta)
def rhs(s, y, p):
    tau = p[0]
    return np.vstack((tau * y[1], -tau * (g / L) * np.sin(y[0])))

# Three conditions = 2 ODEs + 1 unknown parameter:
#   theta(0) = theta0,  omega(0) = 0 (released from rest),  theta(1) = 0 (reaches the bottom at t = tau)
def bc(ya, yb, p):
    return np.array([ya[0] - theta0, ya[1], yb[0]])

s = np.linspace(0, 1, 200)
T0 = 2 * np.pi * np.sqrt(L / g)
guess = np.vstack((theta0 * np.cos(np.pi * s / 2), -theta0 * (np.pi / 2) * np.sin(np.pi * s / 2)))
sol = solve_bvp(rhs, bc, s, guess, p=[T0 / 4], tol=1e-8)
if not sol.success:
    raise RuntimeError(sol.message)

tau = sol.p[0]
T_exact = 4 * np.sqrt(L / g) * ellipk(np.sin(theta0 / 2) ** 2)
print(f"BVP period  = {4 * tau:.6f} s")
print(f"exact       = {T_exact:.6f} s   (4*sqrt(L/g)*K(sin^2(theta0/2)))")
print(f"small-angle = {T0:.6f} s")

ss = np.linspace(0, 1, 1000)
plt.plot(tau * ss, np.rad2deg(sol.sol(ss)[0]))
plt.xlabel("time (s)"); plt.ylabel("angle (degree)")
plt.title("Nonlinear pendulum - first quarter period from solve_bvp")
plt.grid(); plt.show()`;

const IVP_PYTHON = `import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

sigma, rho, beta = 10.0, 28.0, 8.0 / 3.0

def lorenz(t, state):
    x, y, z = state
    return [sigma * (y - x), x * (rho - z) - y, x * y - beta * z]

def run(y0, t_end, n):
    t_eval = np.linspace(0.0, t_end, n)
    sol = solve_ivp(lorenz, (0.0, t_end), y0, t_eval=t_eval, rtol=1e-10, atol=1e-12)
    if not sol.success:
        raise RuntimeError(sol.message)
    return sol

# 1. Discard a 30 s transient. Starting at (0.1, 0, 0) the orbit lingers near the
#    saddle at the origin and only separates from a twin after ~30 s.
y0 = run([0.1, 0.0, 0.0], 30.0, 2).y[:, -1]

# 2. Integrate a reference orbit and a twin displaced by 1e-5 in x.
main = run(y0, 32.0, 6400)
twin = run(y0 + np.array([1e-5, 0.0, 0.0]), 32.0, 6400)
sep = np.linalg.norm(main.y - twin.y, axis=0)

# 3. Growth rate from the part of ln(separation) that is neither noise nor saturated.
mask = (sep > 1e-4) & (sep < 1e-1)
lam = np.polyfit(main.t[mask], np.log(sep[mask]), 1)[0]
print(f"estimated growth rate = {lam:.3f} 1/s   (accepted lambda_1 = 0.906)")

x, y, z = main.y
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].plot(x, z, lw=0.7); ax[0].set(xlabel="x", ylabel="z", title="Lorenz attractor")
ax[1].semilogy(main.t, sep); ax[1].set(xlabel="time (s)", ylabel="separation", title="Sensitivity")
for a in ax: a.grid()
plt.show()`;

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

// Slope of ln(separation) against t, fitted only while the twin is still close
// (1e-4 < d < 1e-1): before that the signal is noise-dominated, after that it has
// saturated at the size of the attractor. Returns null if separation never grows.
function growthRate(raw) {
  const w = raw.filter((p) => p.separation > 1e-4 && p.separation < 1e-1);
  if (w.length < 40) return null;
  const n = w.length, y = (p) => Math.log(p.separation);
  const sx = w.reduce((a, p) => a + p.time, 0), sy = w.reduce((a, p) => a + y(p), 0);
  const sxx = w.reduce((a, p) => a + p.time * p.time, 0), sxy = w.reduce((a, p) => a + p.time * y(p), 0);
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

function lorenz({ sigma, rho, beta, duration, skip }) {
  const h = 0.005, f = ([x, y, z]) => [sigma * (y - x), x * (rho - z) - y, x * y - beta * z];
  let state = [0.1, 0, 0];
  // Starting at (0.1, 0, 0) leaves the orbit lingering near the origin saddle, so the
  // twin only separates after ~30 s. Discarding a transient puts both on the attractor.
  if (skip) for (let step = 0; step < 6000; step += 1) state = rk4(state, h, f);
  let peer = [state[0] + 1e-5, state[1], state[2]];
  const raw = [];
  for (let step = 0; step <= Math.round(duration / h); step += 1) {
    const time = step * h;
    raw.push({ time, x: state[0], y: state[1], z: state[2], separation: Math.hypot(state[0] - peer[0], state[1] - peer[1], state[2] - peer[2]) });
    state = rk4(state, h, f); peer = rk4(peer, h, f);
  }
  const stride = Math.max(1, Math.ceil(raw.length / 1800));
  return { lambda: growthRate(raw), data: raw.filter((_, i) => i % stride === 0 || i === raw.length - 1), final: raw.at(-1), separation: raw[Math.floor(raw.length * .75)].separation, extent: raw.reduce((m, p) => Math.max(m, Math.abs(p.x), Math.abs(p.z)), 1), points: raw.length };
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
  const [angle, setAngle] = useState(45), [length, setLength] = useState(1), [duration, setDuration] = useState(12), [mesh, setMesh] = useState(120), [active, setActive] = useState(PENDULUM_DEFAULTS);
  const ivp = useMemo(() => pendulum(active), [active]);
  const bvp = useMemo(() => solvePendulumBVP({ angle: active.angle, length: active.length, N: active.mesh }), [active]);
  const exact = useMemo(() => exactPeriod(active.angle, active.length), [active]);
  const refinement = useMemo(() => [30, 60, 120, 240].map((N) => { const sol = solvePendulumBVP({ angle: active.angle, length: active.length, N }); return { N, period: sol.period, error: sol.period / exact - 1, ok: sol.converged }; }), [active, exact]);
  const result = useMemo(() => {
    const trace = bvpTrace(bvp, active.duration, ivp.data.length - 1);
    const data = ivp.data.map((p, i) => ({ ...p, bvp: trace[i].theta }));
    return { ...ivp, data, mismatch: Math.max(...data.map((p) => Math.abs(p.bvp - p.linear))), bvpVsIvp: Math.max(...data.map((p) => Math.abs(p.bvp - p.nonlinear))) };
  }, [ivp, bvp, active.duration]);
  const small = active.angle <= 10, dirty = angle !== active.angle || length !== active.length || duration !== active.duration || mesh !== active.mesh;
  const phase = result.data.map((p) => ({ angle: p.nonlinear, velocity: p.velocity }));
  const shift = 100 * (bvp.period / result.linearPeriod - 1);
  const reset = () => { setAngle(45); setLength(1); setDuration(12); setMesh(120); setActive(PENDULUM_DEFAULTS); };
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><main className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Small-angle period" value={`${format(result.linearPeriod, 4)} s`} hint="T₀ = 2π√(L/g)" /><Metric label="BVP period" value={`${format(bvp.period, 5)} s`} hint={bvp.converged ? `Newton converged · ${bvp.iterations} its · ${bvp.steps} continuation stage${bvp.steps > 1 ? "s" : ""}` : "Newton did NOT converge"} tone={bvp.converged ? (small ? "success" : "warn") : "warn"} /><Metric label="Exact period (AGM)" value={`${format(exact, 5)} s`} hint={`BVP error ${format(100 * (bvp.period / exact - 1), 4)} %`} tone="success" /><Metric label="max |θ_BVP − θ_SHM|" value={`${format(result.mismatch, 3)}°`} hint={`Grows with time as the two drift out of phase · BVP vs RK4 IVP: ${format(result.bvpVsIvp, 3)}°`} tone={small ? "success" : "warn"} /></div><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Orbit size={16} className="text-[var(--accent)]" /> Angular response</div><p className="mt-1 text-xs text-[var(--text-quaternary)]">Solid: BVP solution, found from θ(0)=θ₀, θ′(0)=0, θ(τ)=0 with τ unknown. Dotted: independent RK4 initial-value run. Dashed: linear SHM.</p></div><Badge tone={small ? "success" : "warn"}>{small ? <CheckCircle2 size={12} /> : <Waves size={12} />}{small ? "SMALL-ANGLE SHM" : "FINITE-ANGLE NONLINEAR"}</Badge></div><ResponsiveContainer width="100%" height={310}><LineChart data={result.data} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="time" type="number" domain={[0, active.duration]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "time (s)", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "angle (°)", angle: -90, position: "insideLeft", offset: 4, fill: "var(--text-quaternary)", fontSize: 11 }} /><ReferenceLine y={0} stroke="var(--text-muted)" /><Tooltip content={<Tip unit="°" />} /><Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 11 }} /><Line name="Nonlinear — BVP solution" dataKey="bvp" type="monotone" stroke="var(--accent)" strokeWidth={2.8} dot={false} isAnimationActive={false} /><Line name="Nonlinear — RK4 IVP check" dataKey="nonlinear" type="monotone" stroke="var(--success)" strokeWidth={1.2} strokeDasharray="1 3" dot={false} isAnimationActive={false} /><Line name="Linear SHM" dataKey="linear" type="monotone" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="5 4" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Activity size={16} className="text-[var(--warn)]" /> Phase portrait</div><p className="mb-3 text-xs text-[var(--text-quaternary)]">The nonlinear orbit departs from the ellipse of ideal SHM as amplitude grows.</p><ResponsiveContainer width="100%" height={220}><LineChart data={phase} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" /><XAxis dataKey="angle" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "θ (°)", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis dataKey="velocity" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "ω (rad s⁻¹)", angle: -90, position: "insideLeft", offset: 2, fill: "var(--text-quaternary)", fontSize: 11 }} /><Line dataKey="velocity" type="monotone" stroke="var(--accent)" strokeWidth={2.2} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section></main><aside className="space-y-4"><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Gauge size={16} className="text-[var(--accent)]" /> Pendulum controls</div><div className="space-y-5"><Range value={angle} change={setAngle} min="1" max="170" step="1" suffix="°">Release angle θ₀</Range><Range value={length} change={setLength} min="0.25" max="3" step="0.05" suffix=" m">Pendulum length L</Range><Range value={duration} change={setDuration} min="4" max="20" step="1" suffix=" s">Trace duration</Range><label className="block"><span className="mb-2 flex justify-between text-xs text-[var(--text-tertiary)]">BVP mesh intervals N<span className="font-data text-[var(--accent-soft)]">{mesh}</span></span><select value={mesh} onChange={(e) => setMesh(Number(e.target.value))} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface-2)] px-2 py-1.5 font-data text-xs text-[var(--text-secondary)]">{[30, 60, 120, 240].map((n) => <option key={n} value={n}>{n}</option>)}</select></label></div><button onClick={() => setActive({ angle, length, duration, mesh })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-on-accent)]"><Play size={15} /> Run pendulum</button><button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-2 text-xs text-[var(--text-tertiary)]"><RotateCcw size={13} /> Restore baseline</button>{dirty && <div className="mt-3 rounded-lg border border-[var(--warn)]/30 bg-[var(--warn-soft)] p-2 text-[11px] text-[var(--warn)]">Parameters changed. Run to update traces.</div>}</section><section className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--accent-soft)]"><Sigma size={15} /> Read the model</div><div className="font-data text-[11px] text-[var(--text-secondary)]">θ″ + (g/L)sin θ = 0</div><div className="mt-2">At small θ, sin θ ≈ θ, so nonlinear pendulum and normal SHM coincide. At large θ, the nonlinear period becomes longer.</div>{shift && <div className="mt-3 border-t border-[var(--accent)]/15 pt-3 font-data text-[var(--accent-soft)]">period shift = {format(shift, 2)}%</div>}</section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Gauge size={16} className="text-[var(--success)]" /> Mesh refinement</div><p className="mb-3 text-[11px] leading-relaxed text-[var(--text-quaternary)]">Period error against the exact AGM value. For a second-order scheme the error should fall about 4× each time N doubles.</p><table className="w-full font-data text-[11px] text-[var(--text-secondary)]"><thead><tr className="text-left text-[var(--text-quaternary)]"><th className="pb-1 font-normal">N</th><th className="pb-1 font-normal">T (s)</th><th className="pb-1 text-right font-normal">error %</th></tr></thead><tbody>{refinement.map((r) => <tr key={r.N}><td>{r.N}</td><td>{format(r.period, 5)}</td><td className="text-right">{r.ok ? format(100 * r.error, 4) : "fail"}</td></tr>)}</tbody></table></section><Metric label="Release energy / mass" value={`${format(result.energy, 4)} J kg⁻¹`} hint="gL(1 − cos θ₀)" /></aside></div>;
}

function Lorenz() {
  const [sigma, setSigma] = useState(10), [rho, setRho] = useState(28), [beta, setBeta] = useState(8 / 3), [duration, setDuration] = useState(32), [skip, setSkip] = useState(true), [active, setActive] = useState(LORENZ_DEFAULTS);
  const result = useMemo(() => lorenz(active), [active]);
  const dirty = sigma !== active.sigma || rho !== active.rho || beta !== active.beta || duration !== active.duration || skip !== active.skip;
  const classic = Math.abs(active.sigma - 10) < .01 && Math.abs(active.rho - 28) < .01 && Math.abs(active.beta - 8 / 3) < .02;
  const traces = result.data.map((p) => ({ ...p, logSeparation: Math.log10(Math.max(p.separation, 1e-12)) }));
  const reset = () => { setSigma(10); setRho(28); setBeta(8 / 3); setDuration(32); setSkip(true); setActive(LORENZ_DEFAULTS); };
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><main className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Growth rate λ (estimate)" value={result.lambda === null ? "no growth" : `${format(result.lambda, 3)} s⁻¹`} hint={result.lambda === null ? "twin never separates beyond 10⁻⁴: motion is not chaotic here" : "slope of ln(separation); accepted λ₁ ≈ 0.906 for the classic case"} tone={result.lambda === null ? "success" : "warn"} /><Metric label="Late separation" value={format(result.separation, 4)} hint="starts only 10⁻⁵ apart" tone="warn" /><Metric label="Final state" value={`(${format(result.final.x, 1)}, ${format(result.final.y, 1)}, ${format(result.final.z, 1)})`} hint="x, y, z at final time" /></div><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><GitBranch size={16} className="text-[var(--accent)]" /> Lorenz attractor — x/z projection</div><p className="mt-1 text-xs text-[var(--text-quaternary)]">A deterministic IVP can still be practically unpredictable: nearby states separate while the trajectory folds through two lobes.</p></div><Badge tone={classic ? "success" : "accent"}>{classic ? <Sparkles size={12} /> : <CircleDot size={12} />}{classic ? "CLASSIC CHAOTIC REGIME" : "CUSTOM PARAMETERS"}</Badge></div><ResponsiveContainer width="100%" height={330}><LineChart data={result.data} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" /><XAxis dataKey="x" type="number" domain={[-Math.ceil(result.extent), Math.ceil(result.extent)]} tickFormatter={(v) => Number(v).toFixed(0)} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "x", position: "insideBottom", offset: -8, fill: "var(--text-quaternary)", fontSize: 11 }} /><YAxis dataKey="z" type="number" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} label={{ value: "z", angle: -90, position: "insideLeft", offset: 4, fill: "var(--text-quaternary)", fontSize: 11 }} /><Line dataKey="z" type="monotone" stroke="var(--accent)" strokeWidth={1.35} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-5"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Activity size={16} className="text-[var(--warn)]" /> Time trace & sensitivity</div><p className="mb-3 text-xs text-[var(--text-quaternary)]">Amber is log₁₀ distance from a second trajectory beginning only 10⁻⁵ away in x.</p><ResponsiveContainer width="100%" height={230}><LineChart data={traces} margin={{ top: 8, right: 18, bottom: 12, left: -12 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="time" type="number" domain={[0, active.duration]} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><YAxis yAxisId="state" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><YAxis yAxisId="separation" orientation="right" stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10 }} /><Legend wrapperStyle={{ fontSize: 11 }} /><Line yAxisId="state" name="x(t)" dataKey="x" type="monotone" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} /><Line yAxisId="state" name="z(t)" dataKey="z" type="monotone" stroke="var(--text-secondary)" strokeWidth={1.5} dot={false} isAnimationActive={false} /><Line yAxisId="separation" name="log₁₀ separation" dataKey="logSeparation" type="monotone" stroke="var(--warn)" strokeWidth={1.6} strokeDasharray="4 3" dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></section></main><aside className="space-y-4"><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"><Atom size={16} className="text-[var(--accent)]" /> IVP controls</div><div className="space-y-5"><Range value={sigma} change={setSigma} min="1" max="20" step=".5">σ (Prandtl number)</Range><Range value={rho} change={setRho} min="0" max="40" step=".5">ρ (Rayleigh parameter)</Range><Range value={beta} change={setBeta} min=".5" max="5" step=".05">β (geometry)</Range><Range value={duration} change={setDuration} min="10" max="50" step="1" suffix=" s">Integration duration</Range><label className="flex items-start gap-2 text-xs text-[var(--text-tertiary)]"><input type="checkbox" checked={skip} onChange={(e) => setSkip(e.target.checked)} className="mt-0.5 accent-[var(--accent)]" /><span>Skip transient (start on the attractor). Untick to watch the approach from (0.1, 0, 0) — and the slow escape from the origin.</span></label></div><button onClick={() => setActive({ sigma, rho, beta, duration, skip })} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-on-accent)]"><Play size={15} /> Run Lorenz IVP</button><button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-2 text-xs text-[var(--text-tertiary)]"><RotateCcw size={13} /> Restore classic case</button>{dirty && <div className="mt-3 rounded-lg border border-[var(--warn)]/30 bg-[var(--warn-soft)] p-2 text-[11px] text-[var(--warn)]">Parameters changed. Run to update attractor.</div>}</section><section className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--accent-soft)]"><Sigma size={15} /> Lorenz system</div><div className="font-data text-[11px] leading-6 text-[var(--text-secondary)]">ẋ = σ(y − x)<br />ẏ = x(ρ − z) − y<br />ż = xy − βz</div><div className="mt-2">Start: (0.1, 0, 0), optionally after a 30 s burn-in. Twin offset: 10⁻⁵ in x. RK4, Δt = 0.005 s.</div></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-xs leading-relaxed text-[var(--text-tertiary)]"><div className="mb-2 flex items-center gap-2 font-medium text-[var(--text-secondary)]"><Info size={15} className="text-[var(--warn)]" /> Investigation</div>Keep σ = 10 and β = 8/3. Sweep ρ through 10, 20, 28, and 35. Compare the projection and divergence trace.</section></aside></div>;
}

export default function NonlinearODELab() {
  const [tab, setTab] = useState("bvp");
  return <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-body"><style>{`.font-body{font-family:Inter,ui-sans-serif,system-ui,sans-serif}.font-display{font-family:"Space Grotesk",Inter,ui-sans-serif,system-ui,sans-serif}.font-data{font-family:"JetBrains Mono",ui-monospace,monospace}.ode-range{accent-color:var(--accent)}.ode-range::-webkit-slider-runnable-track{height:4px;border-radius:9999px;background:var(--border)}.ode-range::-webkit-slider-thumb{-webkit-appearance:none;margin-top:-5px;width:14px;height:14px;border-radius:9999px;border:2px solid var(--bg-surface);background:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}`}</style><div className="mx-auto max-w-6xl p-4 md:p-7 lg:p-8"><header className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><div className="mb-1 flex items-center gap-2 font-data text-xs uppercase tracking-[.16em] text-[var(--accent)]"><CircleDot size={14} /> Dynamics & nonlinear systems studio</div><h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Non-linear ODE</h1><p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-tertiary)]">Explore nonlinear pendulum motion and its SHM limit, then move to deterministic chaos in a coupled initial-value system.</p></div><Badge><ArrowRight size={12} /> TWO EXPERIMENTS · ONE LAB</Badge></header><div className="mb-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-1"><button onClick={() => setTab("bvp")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === "bvp" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}><Orbit size={15} /> BVP · Pendulum</button><button onClick={() => setTab("ivp")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${tab === "ivp" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}><GitBranch size={15} /> IVP · Lorenz attractor</button></div>{tab === "bvp" ? <><Pendulum /><PythonCode title="Python companion: nonlinear pendulum BVP" code={BVP_PYTHON} /></> : <><Lorenz /><PythonCode title="Python companion: Lorenz IVP" code={IVP_PYTHON} /></>}</div></div>;
}
