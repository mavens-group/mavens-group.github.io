---
title: "Brillouin Zone Integration"
date: '2025-06-01'
type: book
weight: 22
summary: "Smearing methods"
---
<!--more-->

Chapter 8 addressed the outer loop of the SCF cycle: how to update the density from one
iteration to the next so that the fixed-point equation $F[\rho^*] = \rho^*$ is satisfied
efficiently. This chapter addresses the two pieces of numerical machinery that operate *within*
each SCF step: how the KS eigenvalue problem is solved (Section 9.2), and how the resulting
eigenvalues are used to assign occupations and perform Brillouin zone integrals (Section 9.1).
We treat BZ integration first because the choice of smearing scheme affects the effective
smoothness of the energy landscape seen by the eigenvalue solver.

---

## Smearing and Partial Occupancies

### The Problem with Sharp Occupation

The KS total energy involves a sum over occupied states weighted by occupation numbers $f_i$.
For an insulator at zero temperature, every state below the gap has $f_i = 1$ and every state
above has $f_i = 0$. The Brillouin zone (BZ) integral for any smooth quantity — the total
energy, charge density, or density of states — converges exponentially with the density of the
$\mathbf{k}$-point mesh, because the integrand is an analytic function of $\mathbf{k}$
throughout the BZ. A $6 \times 6 \times 6$ Monkhorst–Pack grid is often sufficient for a
well-converged insulator calculation.

For a metal, the situation is qualitatively different. The occupation function is a step
function at the Fermi energy:
{{< math >}}
\begin{equation}
    f_i(\mathbf{k}) = \theta(\epsilon_F - \epsilon_i(\mathbf{k})),
    \label{eq:step-occupation}
\end{equation}
{{< /math >}}

which is discontinuous at the **Fermi surface** — the set of $\mathbf{k}$-points where
$\epsilon_i(\mathbf{k}) = \epsilon_F$. The BZ integral of a function with a discontinuity
converges only as $\mathcal{O}(1/N_k)$ with the number of $\mathbf{k}$-points $N_k$, and
the approach to convergence is oscillatory (the **Gibbs phenomenon**). In practice, this means
that a metallic calculation with sharp occupations requires an extremely dense $\mathbf{k}$-mesh
— often $20 \times 20 \times 20$ or finer — to achieve meV-level convergence, making the
calculation prohibitively expensive.

The physical origin is clear: the Fermi surface is a measure-zero set in the BZ, but the energy
integral samples it through a finite $\mathbf{k}$-mesh. States that are just above or just
below $\epsilon_F$ make discontinuous contributions to the energy as the mesh is refined —
a state that is occupied on one mesh may become unoccupied on a slightly denser mesh, causing
the total energy to jump.

All smearing methods address this by replacing the discontinuous step function with a smooth
approximation, effectively broadening the Fermi surface over an energy window of width $\sigma$.
This converts the BZ integrand from a discontinuous to a smooth (or even analytic) function,
restoring rapid convergence with $\mathbf{k}$-point density — at the cost of introducing a
systematic error that must be controlled or corrected.

### Gaussian Smearing

The simplest approach replaces the step function with a smooth occupation based on the
complementary error function:
{{< math >}}
\begin{equation}
    \boxed{f_i = \frac{1}{2}\,\mathrm{erfc}\!\left(\frac{\epsilon_i - \epsilon_F}{\sigma}\right),}
    \label{eq:gaussian-occ}
\end{equation}
{{< /math >}}

where $\sigma > 0$ is the **smearing width** and $\mathrm{erfc}(x) = 1 - \mathrm{erf}(x) =
\frac{2}{\sqrt{\pi}}\int_x^\infty e^{-t^2}\,dt$. This corresponds to convolving the step
function with a Gaussian of width $\sigma$: states more than $\sim 2\sigma$ below $\epsilon_F$
have $f_i \approx 1$; states more than $\sim 2\sigma$ above have $f_i \approx 0$; and states
within $\sim \sigma$ of $\epsilon_F$ have fractional occupations.

The smearing introduces a systematic error in the total energy. For a system with a slowly
varying density of states near $\epsilon_F$, the error scales as:
{{< math >}}
\begin{equation}
    E[\sigma] - E_0 = \mathcal{O}(\sigma^2),
    \label{eq:gaussian-error}
\end{equation}
{{< /math >}}

where $E_0$ is the true zero-temperature energy. To obtain $E_0$, one must either use a very
small $\sigma$ (which reintroduces the convergence problem) or extrapolate.

**The free energy and the $\sigma \to 0$ extrapolation.** The smeared system can be interpreted
as a fictitious finite-temperature ensemble with an electronic entropy:
{{< math >}}
\begin{equation}
    S = -k_B \sum_{i,\mathbf{k}} w_\mathbf{k}\left[f_i \ln f_i + (1 - f_i)\ln(1 - f_i)\right],
    \label{eq:entropy}
\end{equation}
{{< /math >}}

where $w_\mathbf{k}$ is the $\mathbf{k}$-point weight. The corresponding **free energy** is:
{{< math >}}
\begin{equation}
    F[\sigma] = E[\sigma] - \sigma\, S.
    \label{eq:free-energy}
\end{equation}
{{< /math >}}

For a system with a parabolic density of states near $\epsilon_F$ (a good approximation for
simple metals), the total energy and free energy bracket the true $E_0$:
{{< math >}}
\begin{equation}
    E[\sigma] = E_0 + a\sigma^2 + \mathcal{O}(\sigma^4), \qquad
    F[\sigma] = E_0 - a\sigma^2 + \mathcal{O}(\sigma^4),
    \label{eq:E-F-expansion}
\end{equation}
{{< /math >}}

with the *same* coefficient $a$ but opposite signs. Averaging eliminates the $\sigma^2$ error:
{{< math >}}
\begin{equation}
    \boxed{E_0 \approx \frac{1}{2}\left(E[\sigma] + F[\sigma]\right) + \mathcal{O}(\sigma^4).}
    \label{eq:sigma-extrapolation}
\end{equation}
{{< /math >}}

This is the **$\sigma \to 0$ extrapolation**. Most plane-wave codes report this corrected
energy alongside the raw total energy and the free energy; it is the value that should be used
for comparing total energies, computing energy differences, and extracting formation energies —
*not* the raw $E[\sigma]$ or $F[\sigma]$ individually.

**Limitation:** the extrapolation assumes a smoothly varying density of states. For systems with
sharp features near $\epsilon_F$ (van Hove singularities, narrow $d$-bands), the quadratic
approximation breaks down and larger errors can persist even after extrapolation.

### Fermi–Dirac Smearing

A physically motivated alternative uses the Fermi–Dirac distribution directly:
{{< math >}}
\begin{equation}
    \boxed{f_i = \frac{1}{1 + \exp\!\left(\frac{\epsilon_i - \epsilon_F}{k_B T}\right)},}
    \label{eq:FD-occ}
\end{equation}
{{< /math >}}

where $T$ is interpreted as the electronic temperature and $\sigma = k_BT$ plays the same role
as the Gaussian smearing width. The advantage is physical transparency: Fermi–Dirac smearing
corresponds to the *exact* equilibrium occupation at temperature $T$. The variational quantity
is the **Mermin free energy**:
{{< math >}}
\begin{equation}
    \Omega = E - TS,
    \label{eq:mermin}
\end{equation}
{{< /math >}}

where $S$ is the exact Fermi–Dirac entropy. For genuine finite-temperature calculations — ab
initio molecular dynamics above $\sim 1000\,$K, warm dense matter, or the electronic
contribution to free energies — Fermi–Dirac smearing is the physically correct choice.

For ground-state calculations at $T = 0$, Fermi–Dirac smearing has a disadvantage: the
occupation function has exponential tails extending to $\pm\infty$, meaning that states far
from $\epsilon_F$ acquire small but non-zero fractional occupations. This is physically correct
at finite $T$ but introduces an $\mathcal{O}(\sigma^2)$ error at $T = 0$ that is larger than
the corresponding error from Methfessel–Paxton smearing at the same $\sigma$. The $\sigma \to 0$
extrapolation of equation \eqref{eq:sigma-extrapolation} can still be applied, but with lower
accuracy than Methfessel–Paxton for ground-state energy differences.

### Methfessel–Paxton Smearing

The Gaussian and Fermi–Dirac methods both introduce an $\mathcal{O}(\sigma^2)$ error in the
total energy. **Methfessel–Paxton (MP) smearing** (Methfessel and Paxton, 1989) systematically
reduces this error by expanding the $\delta$-function approximation in a complete set of
Hermite polynomials, achieving $\mathcal{O}(\sigma^{2N+2})$ accuracy at order $N$.

The construction starts from the identity: the step function $\theta(x)$ can be written as
$\frac{1}{2}\,\mathrm{erfc}(x)$ plus a correction expressible as a series in Hermite
polynomials $H_n(x)$. The key mathematical result is that the Hermite polynomials, weighted by
the Gaussian $e^{-x^2}$, form a complete orthogonal set on $(-\infty, \infty)$. Expanding the
difference $\theta(x) - \frac{1}{2}\,\mathrm{erfc}(x)$ in this basis and truncating at order
$N$ gives the MP approximation to the $\delta$-function:
{{< math >}}
\begin{equation}
    \tilde{\delta}_N(x) = \frac{e^{-x^2}}{\sqrt{\pi}} \sum_{n=0}^{N} A_n H_{2n}(x),
    \label{eq:MP-delta}
\end{equation}
{{< /math >}}

where $x = (\epsilon_i - \epsilon_F)/\sigma$ and the coefficients are
$A_n = (-1)^n / (n!\, 4^n\sqrt{\pi})$. The corresponding occupation function is obtained by
integration:
{{< math >}}
\begin{equation}
    f_N(x) = \int_x^\infty \tilde{\delta}_N(t)\,dt.
    \label{eq:MP-occupation-general}
\end{equation}
{{< /math >}}

**The $N = 0$ case** recovers Gaussian smearing: $\tilde{\delta}_0(x) = e^{-x^2}/\sqrt{\pi}$,
$f_0(x) = \frac{1}{2}\,\mathrm{erfc}(x)$, with error $\mathcal{O}(\sigma^2)$.

**The $N = 1$ case** is derived explicitly. The first Hermite polynomial correction adds
$A_1 H_2(x) = -\frac{1}{4\sqrt{\pi}}(4x^2 - 2)$ to the $\delta$-function. Integrating gives:
{{< math >}}
\begin{equation}
    \boxed{f_1(x) = \frac{1}{2}\,\mathrm{erfc}(x) + \frac{1}{\sqrt{\pi}}\,x\,e^{-x^2},
    \qquad x = \frac{\epsilon_i - \epsilon_F}{\sigma}.}
    \label{eq:MP-N1}
\end{equation}
{{< /math >}}

Note that $f_1(x)$ is *not* monotonic and can take values slightly outside $[0,1]$: for
$x \approx -1$, the occupation exceeds $1$ slightly, and for $x \approx 1$, it dips below $0$.
This is not a pathology — the occupation numbers in MP smearing are *not* probabilities but
mathematical weights designed to minimise the BZ integration error. The total electron count
$\sum_i f_i = N$ is still exactly conserved.

The crucial property is that the energy error now scales as $\mathcal{O}(\sigma^4)$ rather than
$\mathcal{O}(\sigma^2)$:
{{< math >}}
\begin{equation}
    E_{N=1}[\sigma] = E_0 + \mathcal{O}(\sigma^4).
    \label{eq:MP-N1-error}
\end{equation}
{{< /math >}}

This means that for $N \geq 1$, the raw energy $E[\sigma]$ is already a good approximation to
$E_0$ without the $\sigma \to 0$ extrapolation. In practice, the extrapolated energy is still
computed and should still be used, but the correction it applies is much smaller than for
Gaussian smearing at the same $\sigma$.

**The $N = 2$ case** adds the next Hermite correction, achieving
$\mathcal{O}(\sigma^6)$ accuracy. For most applications, $N = 1$ is sufficient; $N = 2$
provides a useful cross-check but rarely changes results by more than $\sim 0.1\,$meV/atom at
typical smearing widths.

**Why not $N > 2$?** Higher-order MP approximations produce occupation functions with
increasingly large oscillations outside $[0,1]$, which can cause numerical instabilities in
the SCF cycle (large negative occupations can make the charge density locally negative). The
practical consensus is that $N = 1$ or $N = 2$ gives the optimal balance between accuracy and
numerical stability.

### The Tetrahedron Method

All smearing methods introduce a fictitious broadening that must be controlled or corrected.
The **tetrahedron method** (Jepsen and Andersen, 1971; Blöchl, Jepsen, and Andersen, 1994)
takes a fundamentally different approach: it performs the BZ integral *exactly* for a piecewise
linear interpolation of the band energies $\epsilon_i(\mathbf{k})$, without introducing any
broadening parameter.

The BZ is decomposed into tetrahedra (typically by subdividing each parallelepiped of the
$\mathbf{k}$-mesh into six tetrahedra). Within each tetrahedron, $\epsilon_i(\mathbf{k})$ is
interpolated linearly from its values at the four vertices. The integral of the step function
$\theta(\epsilon_F - \epsilon_i(\mathbf{k}))$ over a tetrahedron with a linearly varying
integrand can be evaluated analytically — the result is a known function of $\epsilon_F$ and
the four vertex energies, involving only elementary algebra.

The **Blöchl correction** (Blöchl et al., 1994) adds a quadratic correction term that accounts
for the curvature of $\epsilon_i(\mathbf{k})$ beyond the linear interpolation, improving the
accuracy from $\mathcal{O}(1/N_k^2)$ to $\mathcal{O}(1/N_k^4)$ for the same mesh density.
This corrected tetrahedron method is the gold standard for BZ integration accuracy.

**Advantages:** No smearing parameter to choose or converge. No entropy correction needed. Exact
for any quantity that depends linearly on $\epsilon_i(\mathbf{k})$ within each tetrahedron.
Produces smooth, non-oscillatory convergence with $\mathbf{k}$-mesh density.

**Limitations:** The tetrahedron method requires the BZ integral to be performed over a regular
mesh — it cannot be used with symmetry-reduced or randomly shifted $\mathbf{k}$-sets. More
importantly, the analytic integration assumes a fixed band structure: the Fermi energy and the
tetrahedron weights are computed *after* the eigenvalues are known, so there is no smooth
dependence of the total energy on atomic positions. This means the forces computed from a
tetrahedron-method calculation contain small but non-zero discontinuities when an eigenvalue
crosses $\epsilon_F$ as atoms move, making the tetrahedron method **unsuitable for geometry
optimisation or molecular dynamics** of metallic systems. For these tasks, MP smearing
($N = 1$) is preferred.

The tetrahedron method is, however, the optimal choice for:
fixed-geometry total energy calculations, density of states (DOS) and projected DOS, optical
properties and spectral functions, and any post-processing quantity requiring accurate spectral
weight near the Fermi level.

### Practical Guidance

The choice of smearing method and width depends on both the system type and the type of
calculation:

| Calculation type | System | Recommended method | $\sigma$ |
|---|---|---|---|
| Geometry optimisation | Metal | MP $N=1$ | $0.1$–$0.2$ eV |
| Geometry optimisation | Insulator | Gaussian or tetrahedron | $0.05$–$0.1$ eV (or none) |
| Single-point energy | Metal | Tetrahedron (Blöchl) | — |
| Single-point energy | Insulator | Tetrahedron (Blöchl) | — |
| DOS / optical properties | Any | Tetrahedron (Blöchl) | — |
| AIMD ($T > 1000\,$K) | Metal | Fermi–Dirac | $k_BT$ |
| Phonons (DFPT) | Metal | MP $N=1$ | $0.1$–$0.2$ eV |

**Choosing $\sigma$:** The smearing width must be large enough to smooth the Fermi surface
sufficiently for the given $\mathbf{k}$-mesh, but small enough that the smearing error is
acceptable. A useful diagnostic: if the entropy term $TS$ exceeds $\sim 1\,$meV/atom, the
smearing is too large and either $\sigma$ should be reduced or the $\mathbf{k}$-mesh should be
made denser.

**The interdependence of $\sigma$ and $\mathbf{k}$-mesh:** These two parameters are not
independent. A denser $\mathbf{k}$-mesh resolves the Fermi surface better, allowing a smaller
$\sigma$; conversely, a larger $\sigma$ compensates for a coarser mesh. The product
$\sigma \times N_k^{1/3}$ should remain approximately constant for a given target accuracy.
In practice, one converges both simultaneously: fix $\sigma$, increase the $\mathbf{k}$-mesh
until the energy is stable, then reduce $\sigma$ and repeat until both are converged.

**Marzari–Vanderbilt cold smearing:** An alternative to MP smearing that ensures the occupation
function remains non-negative while achieving comparable accuracy (Marzari et al., 1999). It
avoids the slight negative occupations of MP $N \geq 1$ that can occasionally cause numerical
difficulties. Available in several codes as an option alongside Gaussian and MP smearing.

{{< spoiler text="**Code Notes: VASP and Quantum ESPRESSO Parameters**" >}}

**VASP:**

| Parameter | Controls | Values |
|---|---|---|
| `ISMEAR` | Smearing method | $-5$: tetrahedron (Blöchl); $-1$: Fermi–Dirac; $0$: Gaussian; $1$: MP $N=1$; $2$: MP $N=2$ |
| `SIGMA` | Smearing width $\sigma$ (eV) | $0.01$–$0.3$; default $0.2$ |

The extrapolated energy `energy(sigma->0)` in the OUTCAR corresponds to equation
\eqref{eq:sigma-extrapolation} for Gaussian smearing and to the raw energy (with negligible
correction) for MP $N \geq 1$. Always use this value for energy comparisons. The entropy
contribution is reported as `EENTRO`.

`ISMEAR = -5` (tetrahedron) must not be used with fewer than $3$ $\mathbf{k}$-points in any
direction, or for calculations where forces are needed (geometry optimisation, MD). VASP will
run but the forces will contain discontinuities that prevent smooth convergence of the ionic
relaxation.

**Quantum ESPRESSO:**

| Parameter | Controls | Values |
|---|---|---|
| `occupations` | Occupation scheme | `'smearing'`, `'tetrahedra'`, `'tetrahedra_opt'` (Blöchl), `'fixed'` |
| `smearing` | Smearing function | `'gaussian'`, `'fermi-dirac'`, `'methfessel-paxton'`, `'marzari-vanderbilt'` |
| `degauss` | Smearing width $\sigma$ (Ry) | Typical: $0.005$–$0.02$ Ry ($0.07$–$0.27$ eV) |

Note that QE uses Rydberg units for `degauss` ($1\,$Ry $= 13.606\,$eV), while VASP uses eV for
`SIGMA`. A common source of error is confusing the two: `degauss = 0.02` Ry $\approx 0.27\,$eV,
which is a reasonable smearing for metals; `SIGMA = 0.02` eV is extremely small and may cause
convergence problems on a coarse $\mathbf{k}$-mesh.

Marzari–Vanderbilt cold smearing is accessed via `smearing = 'marzari-vanderbilt'` or
`smearing = 'cold'`.

{{< /spoiler >}}

{{< spoiler text="**Further Reading**" >}}

- **Methfessel–Paxton smearing:** M. Methfessel and A. T. Paxton, *High-precision sampling for
  Brillouin-zone integration in metals*, Phys. Rev. B **40**, 3616 (1989). The original paper
  deriving the Hermite polynomial expansion and the error scaling $\mathcal{O}(\sigma^{2N+2})$.

- **Tetrahedron method with Blöchl correction:** P. E. Blöchl, O. Jepsen, and O. K. Andersen,
  *Improved tetrahedron method for Brillouin-zone integrations*, Phys. Rev. B **49**, 16223
  (1994). Derives the quadratic correction that improves convergence from
  $\mathcal{O}(1/N_k^2)$ to $\mathcal{O}(1/N_k^4)$.

- **Original tetrahedron method:** O. Jepsen and O. K. Andersen, *The electronic structure of
  h.c.p. ytterbium*, Solid State Commun. **9**, 1763 (1971).

- **Marzari–Vanderbilt cold smearing:** N. Marzari, D. Vanderbilt, A. De Vita, and M. C. Payne,
  *Thermal contraction and disordering of the Al(110) surface*, Phys. Rev. Lett. **82**, 3296
  (1999). Introduces the cold smearing function with improved convergence properties for metals.

- **Mermin finite-temperature DFT:** N. D. Mermin, *Thermal properties of the inhomogeneous
  electron gas*, Phys. Rev. **137**, A1441 (1965). The formal foundation for Fermi–Dirac
  smearing as a finite-temperature variational principle.

- **General discussion:** The interplay between $\mathbf{k}$-mesh density and smearing is
  discussed clearly in G. Kresse and J. Furthmüller, Phys. Rev. B **54**, 11169 (1996),
  Section II.D.

{{< /spoiler >}}
