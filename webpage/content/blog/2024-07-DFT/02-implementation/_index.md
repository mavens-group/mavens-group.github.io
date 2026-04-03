---
title: "Part II: Numerical Implementation"
date: '2025-06-01'
type: book
weight: 20
summary: "Overview of the numerical machinery behind a DFT calculation: the SCF loop in detail, common failure modes, and a roadmap for Chapters 8–11"
---
<!--more-->

Part I of this course developed the theoretical framework of density functional theory: the
Hohenberg–Kohn theorems guarantee that the ground-state density determines all observables
(Chapter 2); the Kohn–Sham equations reduce the interacting many-body problem to a set of
effective single-particle equations (Chapter 3); the exchange-correlation functional encodes
all remaining many-body physics (Chapter 4); and the basis set, pseudopotential, and spin
treatment specify how the equations are represented computationally (Chapters 5–7).

What Part I did not address is how those equations are actually solved on a computer. The
self-consistent field (SCF) cycle of Chapter 3 was presented as a clean five-step loop: guess
a density, build the effective potential, solve the eigenvalue problem, construct a new density,
and repeat. In practice, each of those steps conceals substantial numerical machinery — and
when that machinery fails, the calculation fails with it. Part II develops this machinery.

---

## The SCF Cycle in Detail

The schematic SCF loop of Chapter 3 expands, in a real implementation, into the following
sequence of operations. Each numbered step maps to a section in Chapters 8 or 9 where it is
treated rigorously.

**Step 0 — Initialisation.** The calculation begins with an initial guess for the electron
density $\rho^{(0)}(\mathbf{r})$, typically constructed from a superposition of isolated atomic
densities. For spin-polarised calculations, the initial magnetic moments must also be specified.
A poor initial guess can place the SCF iteration far from the basin of convergence, requiring
more iterations or causing convergence to a metastable state.

**Step 1 — Construct the effective potential.** From the current density $\rho^{(n)}$, build
the KS effective potential:

{{< math >}}
\begin{equation}
    V_{\rm eff}^{(n)}(\mathbf{r}) = V_{\rm ext}(\mathbf{r}) + V_{\rm H}[\rho^{(n)}](\mathbf{r}) + V_{\rm xc}[\rho^{(n)}](\mathbf{r}).
\end{equation}
{{< /math >}}

The Hartree potential $V_{\rm H}$ is obtained by solving the Poisson equation, which in a
plane-wave basis reduces to a division by $G^2$ in reciprocal space. The XC potential
$V_{\rm xc} = \delta E_{\rm xc}/\delta\rho$ is evaluated from the chosen functional (Chapter 4).

**Step 2 — Solve the KS eigenvalue problem.** Diagonalise (or approximately diagonalise) the
KS Hamiltonian $\hat{h}_{\rm KS} = -\frac{1}{2}\nabla^2 + V_{\rm eff}^{(n)}$ to obtain
orbitals $\{\phi_i^{(n)}\}$ and eigenvalues $\{\epsilon_i^{(n)}\}$. For a plane-wave basis
with $N_{\rm PW} \sim 50\,000$, full diagonalisation is intractable ($\mathcal{O}(N_{\rm PW}^3)$
operations). Instead, **iterative subspace methods** — the Davidson algorithm or RMM-DIIS — are
used to find only the lowest $N_{\rm bands}$ eigenpairs at a cost of
$\mathcal{O}(N_{\rm bands} \cdot N_{\rm PW}^2)$ per iteration. These methods are the subject of
Chapter 9, Section 9.2.

**Step 3 — Determine occupations.** Assign occupation numbers $f_i$ to each eigenstate. For
insulators with a clear gap, this is trivial: $f_i = 1$ below the gap, $f_i = 0$ above. For
metals, the Fermi surface introduces a discontinuity that must be smoothed by a **smearing
scheme** (Gaussian, Fermi–Dirac, or Methfessel–Paxton) to ensure well-behaved Brillouin zone
integrals. The choice of smearing method and width $\sigma$ directly affects the accuracy of
total energies and forces. This is treated in Chapter 9, Section 9.1.

**Step 4 — Construct the output density.** Build the new density from the occupied orbitals:

{{< math >}}
\begin{equation}
    \rho_{\rm out}^{(n)}(\mathbf{r}) = \sum_{i,\mathbf{k}} w_\mathbf{k}\, f_i\, |\phi_{i\mathbf{k}}^{(n)}(\mathbf{r})|^2.
\end{equation}
{{< /math >}}

**Step 5 — Mix the density.** The output density $\rho_{\rm out}^{(n)}$ is *not* fed directly
back as $\rho^{(n+1)}$. Instead, a **density mixing scheme** combines the input and output
densities (and, in advanced methods, densities from several previous iterations) to produce a
new input density that converges more rapidly toward self-consistency. The choice of mixing
scheme — linear, Kerker-preconditioned, Pulay/DIIS, or Broyden — and its parameters determines
whether the SCF loop converges at all for metallic systems, and how quickly. This is the
subject of Chapter 8.

**Step 6 — Check convergence.** Compare the input and output densities (or, equivalently, the
total energies) between successive iterations. If the change is below a specified threshold
(typically $10^{-6}$ eV for energies), the SCF loop has converged and the ground-state density,
energy, and eigenvalues are available for post-processing. If not, return to Step 1.

---

## Common Failure Modes and Quick Remedies

Before diving into the theory, it is useful to catalogue the most common SCF failures a
practitioner encounters. The table below serves as a quick-reference diagnostic; the
chapters that follow provide the underlying explanations and rigorous solutions.

| Symptom | Likely cause | Quick remedy | Chapter |
|---|---|---|---|
| Total energy oscillates without decreasing | Charge sloshing (metallic systems) | Reduce mixing parameter $\alpha$; enable Kerker preconditioning | Ch. 8 |
| SCF converges for first ~10 steps then stalls | DIIS subspace contaminated by poor early iterations | Increase number of initial non-DIIS (simple mixing) steps | Ch. 8 |
| Spin-up and spin-down channels oscillate out of phase | Wrong initial magnetic moments or antiferromagnetic instability | Fix initial moments; use more robust diagonaliser for first iterations | Ch. 8, 9 |
| Energy converged but forces are noisy | SCF threshold too loose for force accuracy | Tighten energy convergence to $10^{-7}$–$10^{-8}$ eV | Ch. 9 |
| Metallic system gives erratic energies with tetrahedron method | Tetrahedron method produces discontinuous forces for metals | Switch to Methfessel–Paxton $N=1$ smearing for geometry optimisation | Ch. 9 |
| Very slow convergence for a slab or surface | Large vacuum region amplifies charge sloshing | Reduce $\alpha$ further; increase DIIS subspace size | Ch. 8 |
| Band gap severely underestimated | Not a convergence issue — inherent DFT limitation | Use hybrid functional (Ch. 4) or DFT+U (Ch. 7) | — |
| Eigenvalue solver converges to wrong states | RMM-DIIS subspace collapse | Switch to Davidson for initial iterations; re-orthogonalise | Ch. 9 |
| Calculation runs out of memory | Too many plane waves or $\mathbf{k}$-points | Reduce $E_{\rm cut}$ or $\mathbf{k}$-mesh (after convergence tests) | Ch. 5, 10 |
