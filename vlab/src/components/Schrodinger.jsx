import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Atom,
  Box,
  CheckCircle2,
  Grid3X3,
  RotateCcw,
  Sigma,
  Waves,
} from "lucide-react";
import { solveHarmonicOscillator, solveInfiniteWell } from "../utils/numerov";

const WELL_STATES = [1, 2, 3, 4, 5, 6];
const OSCILLATOR_STATES = [0, 1, 2, 3, 4, 5];

function formatScientific(value) {
  if (!Number.isFinite(value)) return "—";
  return value.toExponential(2);
}

function nearestPsi(points, position) {
  if (position < points[0].x || position > points.at(-1).x) return null;
  const span = points.at(-1).x - points[0].x;
  const ratio = (position - points[0].x) / span;
  const index = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));
  return points[index].psi;
}

function makePotentialPlot(problem, solution, width, omega) {
  if (problem === "well") {
    const halfWidth = width / 2;
    const domainHalfWidth = width * 0.68;
    const energyUnit = Math.PI ** 2 / (2 * width ** 2);
    const scaledEnergy = solution.energy / energyUnit;
    const waveScale = Math.max(0.65, scaledEnergy * 0.035);
    return Array.from({ length: 501 }, (_, index) => {
      const x = -domainHalfWidth + (2 * domainHalfWidth * index) / 500;
      const inside = Math.abs(x) <= halfWidth;
      const psi = inside ? nearestPsi(solution.points, x) : null;
      return {
        x,
        potential: inside ? 0 : 39.5,
        shiftedPsi: psi == null ? null : scaledEnergy + psi * waveScale,
      };
    });
  }

  return solution.points.map((point) => ({
    x: point.x,
    potential: point.potential,
    shiftedPsi: solution.energy + point.psi * omega * 0.38,
  }));
}

function ScientificTooltip({ active, payload, label, potentialView, scaledEnergy }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 font-data text-xs shadow-xl">
      <div className="mb-1 text-[var(--text-quaternary)]">x = {Number(label).toFixed(3)}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === "psi" && `ψ(x) = ${Number(entry.value).toFixed(5)}`}
          {entry.dataKey === "probability" && `|ψ(x)|² = ${Number(entry.value).toFixed(5)}`}
          {entry.dataKey === "potential" && `${scaledEnergy ? "V(x)/E₁" : "V(x)"} = ${Number(entry.value).toFixed(5)}`}
          {entry.dataKey === "shiftedPsi" && `${potentialView ? scaledEnergy ? "E/E₁ + scaled ψ" : "E + scaled ψ" : "ψ"} = ${Number(entry.value).toFixed(5)}`}
        </div>
      ))}
    </div>
  );
}

export default function SchrodingerLab() {
  const [problem, setProblem] = useState("well");
  const [plotTab, setPlotTab] = useState("wavefunction");
  const [wellState, setWellState] = useState(1);
  const [oscillatorState, setOscillatorState] = useState(0);
  const [width, setWidth] = useState(2);
  const [omega, setOmega] = useState(1);

  const quantumNumber = problem === "well" ? wellState : oscillatorState;
  const solution = useMemo(
    () => problem === "well"
      ? solveInfiniteWell({ quantumNumber: wellState, width })
      : solveHarmonicOscillator({ quantumNumber: oscillatorState, omega }),
    [problem, wellState, oscillatorState, width, omega],
  );
  const potentialData = useMemo(
    () => makePotentialPlot(problem, solution, width, omega),
    [problem, solution, width, omega],
  );
  const levelStates = problem === "well" ? WELL_STATES : OSCILLATOR_STATES;
  const exactEnergyFor = (state) => problem === "well"
    ? (state ** 2 * Math.PI ** 2) / (2 * width ** 2)
    : omega * (state + 0.5);
  const wellEnergyUnit = Math.PI ** 2 / (2 * width ** 2);
  const plottedEnergy = problem === "well" ? solution.energy / wellEnergyUnit : solution.energy;
  const potentialCeiling = problem === "well" ? 40 : 6;

  function resetProblem() {
    setPlotTab("wavefunction");
    if (problem === "well") {
      setWellState(1);
      setWidth(2);
    } else {
      setOscillatorState(0);
      setOmega(1);
    }
  }

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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs font-data tracking-widest uppercase mb-1">
              <Atom size={14} className="animate-pulse" />
              Virtual Quantum Mechanics Bench
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold">
              1D Schrödinger Equation — Numerov Solver
            </h1>
            <p className="text-[var(--text-tertiary)] text-sm mt-1 max-w-2xl">
              Find stationary states by shooting across a spatial grid, enforcing the boundary condition,
              and normalizing the Numerov wavefunction. Dimensionless units use ℏ = m = 1.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 font-data text-xs text-[var(--text-quaternary)]">
            <span>GRID {solution.points.length} POINTS</span>
            <span className="text-[var(--accent)]">● NUMEROV CONVERGED</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-1.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1" role="tablist" aria-label="Schrödinger problem">
            <button
              role="tab"
              aria-selected={problem === "well"}
              onClick={() => { setProblem("well"); setPlotTab("wavefunction"); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${problem === "well" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}
            >
              <Box size={14} /> Infinite Potential Well
            </button>
            <button
              role="tab"
              aria-selected={problem === "oscillator"}
              onClick={() => { setProblem("oscillator"); setPlotTab("wavefunction"); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${problem === "oscillator" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}
            >
              <Waves size={14} /> Harmonic Oscillator
            </button>
          </div>
          <button onClick={resetProblem} className="flex items-center gap-1.5 text-xs text-[var(--text-quaternary)] hover:text-[var(--text-primary)] transition-colors">
            <RotateCcw size={13} /> Reset problem
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                    <Activity size={15} className="text-[var(--accent)]" /> Numerical solution
                  </div>
                  <p className="text-xs text-[var(--text-quaternary)] mt-1">
                    {problem === "well" ? "Dirichlet boundaries ψ(−L/2) = ψ(L/2) = 0" : `${quantumNumber % 2 === 0 ? "Even" : "Odd"} parity with ψ(x → ±∞) = 0`}
                  </p>
                </div>
                <div className="flex gap-1 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-lg p-1" role="tablist" aria-label="Solution plot">
                  <button
                    role="tab"
                    aria-selected={plotTab === "wavefunction"}
                    onClick={() => setPlotTab("wavefunction")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${plotTab === "wavefunction" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}
                  >
                    Wavefunction ψ(x)
                  </button>
                  <button
                    role="tab"
                    aria-selected={plotTab === "potential"}
                    onClick={() => setPlotTab("potential")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${plotTab === "potential" ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "text-[var(--text-tertiary)]"}`}
                  >
                    Potential V(x)
                  </button>
                </div>
              </div>

              {plotTab === "wavefunction" ? (
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={solution.points} margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickCount={9} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }} label={{ value: "position x", position: "insideBottom", offset: -10, fill: "var(--text-quaternary)", fontSize: 11 }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }} />
                    <Tooltip content={<ScientificTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-tertiary)" }} />
                    <ReferenceLine y={0} stroke="var(--text-muted)" />
                    <Line name="ψ(x)" type="monotone" dataKey="psi" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line name="|ψ(x)|²" type="monotone" dataKey="probability" stroke="var(--warn)" strokeWidth={1.6} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={460}>
                  <LineChart data={potentialData} margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tickCount={9} stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }} label={{ value: "position x", position: "insideBottom", offset: -10, fill: "var(--text-quaternary)", fontSize: 11 }} />
                    <YAxis domain={[0, potentialCeiling]} allowDataOverflow stroke="var(--text-muted)" tick={{ fill: "var(--text-quaternary)", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }} label={{ value: problem === "well" ? "scaled energy E/E₁" : "energy", angle: -90, position: "insideLeft", fill: "var(--text-quaternary)", fontSize: 11 }} />
                    <Tooltip content={<ScientificTooltip potentialView scaledEnergy={problem === "well"} />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-tertiary)" }} />
                    <ReferenceLine y={plottedEnergy} stroke="var(--warn)" strokeDasharray="5 4" label={{ value: problem === "well" ? `E/E₁ = ${plottedEnergy.toFixed(4)}` : `E = ${plottedEnergy.toFixed(4)}`, fill: "var(--warn)", fontSize: 10, position: "insideTopRight" }} />
                    {problem === "well" && <ReferenceLine x={-width / 2} stroke="var(--danger)" strokeDasharray="3 3" />}
                    {problem === "well" && <ReferenceLine x={width / 2} stroke="var(--danger)" strokeDasharray="3 3" />}
                    <Line name={problem === "well" ? "V(x)/E₁" : "V(x)"} type="linear" dataKey="potential" stroke="var(--danger)" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line name={problem === "well" ? "E/E₁ + scaled ψ(x)" : "E + scaled ψ(x)"} type="monotone" dataKey="shiftedPsi" stroke="var(--accent)" strokeWidth={1.8} dot={false} connectNulls={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {plotTab === "wavefunction"
                  ? "The probability density is |ψ|²; the sign of ψ carries phase information but is not itself a probability."
                  : problem === "well"
                    ? "The well energy axis is fixed at 0–40 in units of E₁, placing the six states near 1, 4, 9, 16, 25, and 36. Infinite walls are drawn at a finite chart height."
                    : "The harmonic-oscillator energy axis is fixed at 0–6 for direct comparison between quantum states. The wavefunction is shifted to its eigenenergy and scaled only for visualization."}
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-4">
                <Grid3X3 size={15} className="text-[var(--accent)]" /> Problem controls
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)] gap-4 items-start">
                <div>
                  <label className="text-xs text-[var(--text-tertiary)] block mb-2">Quantum state</label>
                  <div className="grid grid-cols-6 gap-1.5 mb-5">
                    {levelStates.map((state) => (
                      <button
                        key={state}
                        onClick={() => problem === "well" ? setWellState(state) : setOscillatorState(state)}
                        className={`rounded-lg py-1.5 font-data text-xs transition-colors ${quantumNumber === state ? "bg-[var(--accent)] text-[var(--text-on-accent)]" : "bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>

                  {problem === "well" ? (
                    <>
                      <label className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2">
                        Well width L <span className="font-data text-[var(--accent-soft)]">{width.toFixed(2)}</span>
                      </label>
                      <input type="range" min={1} max={4} step={0.05} value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-full" />
                    </>
                  ) : (
                    <>
                      <label className="flex justify-between text-xs text-[var(--text-tertiary)] mb-2">
                        Angular frequency ω <span className="font-data text-[var(--accent-soft)]">{omega.toFixed(2)}</span>
                      </label>
                      <input type="range" min={0.5} max={2} step={0.05} value={omega} onChange={(event) => setOmega(Number(event.target.value))} className="w-full" />
                    </>
                  )}
                </div>

                {problem === "well" ? (
                  <div className="rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] p-3 text-xs text-[var(--text-tertiary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)]">Infinite square well</strong><br />
                    V(x) = 0 for |x| &lt; L/2 and V(x) → ∞ outside. Allowed energies scale as n²/L².
                  </div>
                ) : (
                  <div className="rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] p-3 text-xs text-[var(--text-tertiary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)]">Harmonic oscillator</strong><br />
                    V(x) = ½ω²x². Even and odd parity states are shot from x = 0 toward a finite approximation to infinity.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-3">
                <Sigma size={15} className="text-[var(--accent)]" /> Eigenvalue result
              </div>
              <div className="space-y-2 font-data text-xs">
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Numerov E</span><span>{solution.energy.toFixed(8)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Analytic E</span><span>{solution.exactEnergy.toFixed(8)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Relative error</span><span className="text-[var(--success)]">{formatScientific(solution.relativeError)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Boundary residual</span><span>{formatScientific(solution.boundaryResidual)}</span></div>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-3">
                <CheckCircle2 size={15} className="text-[var(--success)]" /> State checks
              </div>
              <div className="space-y-2 font-data text-xs">
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">State</span><span>{problem === "well" ? `n = ${quantumNumber}` : `n = ${quantumNumber} (${quantumNumber % 2 === 0 ? "even" : "odd"})`}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Interior nodes</span><span>{solution.nodes}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Grid spacing Δx</span><span>{solution.step.toFixed(5)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-[var(--text-quaternary)]">Normalization</span><span className="text-[var(--success)]">∫|ψ|²dx = 1</span></div>
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-3">Energy spectrum</div>
              <div className="space-y-1.5 font-data text-xs">
                {levelStates.map((state) => (
                  <button
                    key={state}
                    onClick={() => problem === "well" ? setWellState(state) : setOscillatorState(state)}
                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${quantumNumber === state ? "bg-[var(--accent)]/15 text-[var(--accent-soft)]" : "text-[var(--text-quaternary)] hover:bg-[var(--bg-surface-2)]"}`}
                  >
                    <span>n = {state}</span><span>E = {exactEnergyFor(state).toFixed(4)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-1">Numerov algorithm</div>
              <p className="text-[10px] text-[var(--text-muted)] mb-3">
                Input: V(x), state n, domain, grid and energy bracket → Output: Eₙ and normalized ψₙ(x)
              </p>
              <ol className="space-y-2 text-xs text-[var(--text-tertiary)]">
                <li><span className="font-data text-[var(--accent)] mr-2">01</span>Build the uniform grid xᵢ and set h = xᵢ₊₁ − xᵢ.</li>
                <li><span className="font-data text-[var(--accent)] mr-2">02</span>For a trial E, evaluate qᵢ = 2[V(xᵢ) − E].</li>
                <li><span className="font-data text-[var(--accent)] mr-2">03</span>Set ψ₀, ψ₁ from {problem === "well" ? "the left-wall Taylor series" : `the ${quantumNumber % 2 === 0 ? "even" : "odd"}-parity origin series`}.</li>
                <li><span className="font-data text-[var(--accent)] mr-2">04</span>Propagate ψᵢ₊₁ with the Numerov recurrence to the far boundary.</li>
                <li><span className="font-data text-[var(--accent)] mr-2">05</span>Scan E for adjacent residuals R(E) with opposite signs.</li>
                <li><span className="font-data text-[var(--accent)] mr-2">06</span>Bisect that bracket until ΔE &lt; 10⁻¹⁴, then propagate again.</li>
                <li><span className="font-data text-[var(--accent)] mr-2">07</span>{problem === "well" ? "Retain the full-domain solution" : "Reflect the half-domain solution with the required parity"}, normalize by the trapezoidal rule, and verify nodes and residual.</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-[var(--border)] font-data text-[10px] text-[var(--text-muted)]">
                {solution.method}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mt-6 max-w-4xl">
          Teaching model: the oscillator uses a finite numerical domain and both problems use dimensionless units.
          The analytic energies are shown only as validation references; the plotted state is generated by Numerov propagation at the numerically located eigenvalue.
        </p>
      </div>
    </div>
  );
}
