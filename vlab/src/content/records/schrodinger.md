# Schrödinger–Numerov Virtual Lab Record

## Experiment details

| Field | Entry |
|---|---|
| Student | ______________________________ |
| Date | ______________________________ |
| Problem | Infinite well / Harmonic oscillator |
| State | $n=$ __________ |
| Units | $\hbar=m=1$ |

## Objective

Solve the one-dimensional time-independent Schrödinger equation with Numerov shooting, normalize the eigenfunction, and compare the numerical eigenvalue with the analytic result.

## Parameters and observations

| Quantity | Value |
|---|---:|
| Well width $L$ or oscillator frequency $\omega$ | |
| Number of plotted grid points | |
| Grid spacing $\Delta x$ | |
| Numerical eigenvalue $E_\mathrm{Numerov}$ | |
| Analytic eigenvalue $E_\mathrm{exact}$ | |
| Relative error | |
| Far-boundary residual | |
| Interior node count | |
| Expected parity, if applicable | Even / Odd |

## Numerov method

Write the recurrence relation used in the calculation and identify $q(x)$ for the selected potential.

____________________________________________________________________

____________________________________________________________________

## Plot observations

1. Where is the probability density largest?

   ____________________________________________________________________

2. How many nodes are visible, and does this agree with the selected state?

   ____________________________________________________________________

3. How does the wavefunction behave in the classically forbidden region or at the well walls?

   ____________________________________________________________________

## Parameter study

| Trial | $n$ | $L$ or $\omega$ | $E_\mathrm{Numerov}$ | Predicted scaling verified? |
|---:|---:|---:|---:|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

## Convergence and uncertainty

The lab's solver uses a fixed fine grid, so use the convergence table in the documentation (Section 10) and a manual Numerov run to fill in a refinement study for the well with $L=1$ and $n=3$.

| Intervals $N$ | $h$ | $E_\mathrm{Numerov}$ | Relative error $\epsilon_E$ | $\epsilon_E(N/2)/\epsilon_E(N)$ |
|---:|---:|---:|---:|---:|
| 25 | | | | — |
| 50 | | | | |
| 100 | | | | |
| 200 | | | | |

Expected ratio for a fourth-order method: ____________. Observed: ____________.

Richardson estimate of the converged energy, $E_\mathrm{extrap}=\dfrac{16E(h/2)-E(h)}{15}=$ ____________, and of the error in the finest run, $\dfrac{E(h)-E(h/2)}{15}=$ ____________.

| Other error source | Effect observed or expected |
|---|---|
| Finite boundary (oscillator) | |
| Bisection tolerance | |
| Higher $n$ at fixed $N$ | |

Report your final energy as $E=\ldots\pm\ldots$ with the uncertainty taken from the Richardson estimate. Why is the relative error against the analytic value a *validation* rather than an uncertainty?

____________________________________________________________________

## Conclusion

Summarize the energy scaling, node structure, parity, numerical accuracy, and any finite-domain limitation observed.

____________________________________________________________________

____________________________________________________________________

