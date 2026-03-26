---
title: "Eigenvalue Solvers"
date: '2025-06-01'
type: book
weight: 23
summary: "Iterative diagonalisation (Davidson, RMM-DIIS), and convergence diagnostics"
---
<!--more-->
## Iterative Diagonalisation

### The Eigenvalue Problem and Its Cost

At each SCF step, we must solve the Kohn–Sham eigenvalue equation:
{{< math >}}
\begin{equation}
    \hat{h}_{\rm KS} |\phi_i\rangle = \epsilon_i |\phi_i\rangle,
    \qquad
    \hat{h}_{\rm KS} = -\frac{1}{2}\nabla^2 + V_{\rm eff}(\mathbf{r}),
    \label{eq:KS-eigen}
\end{equation}
{{< /math >}}

for the lowest $N_{\rm bands}$ eigenpairs $\{(\epsilon_i, |\phi_i\rangle)\}$. In a plane-wave
basis, $\hat{h}_{\rm KS}$ is represented as a matrix of dimension $N_{\rm PW} \times N_{\rm PW}$,
where $N_{\rm PW}$ is the number of plane waves within the energy cutoff $E_{\rm cut}$. For a
typical calculation:

A $50$-atom cell with $E_{\rm cut} = 500$ eV gives $N_{\rm PW} \sim 30\,000$ per
$\mathbf{k}$-point. A $200$-atom cell gives $N_{\rm PW} \sim 120\,000$. Full diagonalisation
of an $N_{\rm PW} \times N_{\rm PW}$ matrix costs $\mathcal{O}(N_{\rm PW}^3)$ operations. For
$N_{\rm PW} = 30\,000$, this is $\sim 2.7 \times 10^{13}$ floating-point operations — already
at the limit of practicality for a *single* diagonalisation at a *single* $\mathbf{k}$-point.
Since the SCF loop requires $\sim 20$–$50$ diagonalisations, and the BZ integral requires tens
to hundreds of $\mathbf{k}$-points, full diagonalisation is completely intractable for any
system of practical interest.

The key observation is that we do not need *all* $N_{\rm PW}$ eigenpairs — only the lowest
$N_{\rm bands}$, which is proportional to the number of electrons and hence to $N_{\rm atom}$.
For a $50$-atom cell, $N_{\rm bands} \sim 200$, which is $\ll N_{\rm PW}$. **Iterative subspace
methods** exploit this by working in a small subspace of dimension $m \sim 2$–$3 \times N_{\rm bands}$,
reducing the cost from $\mathcal{O}(N_{\rm PW}^3)$ to
$\mathcal{O}(N_{\rm bands}^2 \cdot N_{\rm PW})$ per SCF step — a reduction of several orders
of magnitude.

### The Davidson Algorithm

The **Davidson algorithm** (Davidson, 1975; adapted for plane-wave DFT by Wood and Zunger,
1985) is the most widely used iterative eigensolver in electronic structure codes. It belongs
to the family of Krylov subspace methods but uses a preconditioner to accelerate convergence
dramatically compared to the Lanczos algorithm.

**The basic idea.** Start with a set of $N_{\rm bands}$ trial vectors
$\{|v_1\rangle, \ldots, |v_{N_{\rm bands}}\rangle\}$ — typically the eigenvectors from the
previous SCF step, or random vectors for the first step. These span an initial subspace
$\mathcal{V}$. The algorithm proceeds iteratively:

**Step 1 — Project and diagonalise.** Form the projected Hamiltonian and overlap matrices
within the current subspace:
{{< math >}}
\begin{equation}
    H_{ij}^{\rm sub} = \langle v_i | \hat{h}_{\rm KS} | v_j \rangle, \qquad
    S_{ij}^{\rm sub} = \langle v_i | v_j \rangle.
    \label{eq:davidson-project}
\end{equation}
{{< /math >}}

Diagonalise the small $m \times m$ generalised eigenvalue problem
$\mathbf{H}^{\rm sub}\mathbf{c} = \epsilon\, \mathbf{S}^{\rm sub}\mathbf{c}$ to obtain
approximate eigenvalues $\{\epsilon_i^{\rm sub}\}$ and eigenvectors expressed as linear
combinations of the subspace basis: $|\tilde{\phi}_i\rangle = \sum_j c_{ij} |v_j\rangle$.
This small diagonalisation costs $\mathcal{O}(m^3)$, which is negligible.

**Step 2 — Compute residuals.** For each approximate eigenpair, compute the residual:
{{< math >}}
\begin{equation}
    |r_i\rangle = (\hat{h}_{\rm KS} - \epsilon_i^{\rm sub})|\tilde{\phi}_i\rangle.
    \label{eq:davidson-residual}
\end{equation}
{{< /math >}}

If $\|r_i\| \leq \delta$ for all desired eigenpairs, the algorithm has converged. The threshold
$\delta$ is typically set to $10^{-2}$–$10^{-3}$ times the SCF energy convergence criterion,
since the eigenvalues need not be converged more tightly than the density at each SCF step.

**Step 3 — Precondition and expand.** The residual $|r_i\rangle$ points in the direction of
steepest descent toward the true eigenvector, but its components at different $\mathbf{G}$
converge at very different rates. High-$G$ components (large kinetic energy) have large
eigenvalue separations and converge quickly; low-$G$ components are nearly degenerate and
converge slowly. The **kinetic energy preconditioner** corrects this disparity by
approximately inverting the dominant part of the Hamiltonian:
{{< math >}}
\begin{equation}
    \boxed{|t_i\rangle = \hat{P}\,|r_i\rangle, \qquad
    P(\mathbf{G}) = \frac{1}{\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 - \epsilon_i^{\rm sub}}.}
    \label{eq:preconditioner}
\end{equation}
{{< /math >}}

In reciprocal space, this simply divides each plane-wave component of the residual by the
difference between its kinetic energy and the current eigenvalue estimate. The effect is to
rotate the residual toward the true eigenspace: components that are far from the eigenvalue
(large $|\frac{1}{2}G^2 - \epsilon_i|$) are suppressed, while components near the eigenvalue
are amplified. This is the same principle as Kerker preconditioning for density mixing
(Chapter 8, Section 8.2), applied here to the eigenvalue problem rather than the fixed-point
problem.

In practice, a regularisation is applied to prevent the denominator from vanishing when
$\frac{1}{2}G^2 \approx \epsilon_i$. The standard choice is:
{{< math >}}
\begin{equation}
    P(\mathbf{G}) = \frac{1}{\max\!\left(\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 - \epsilon_i^{\rm sub},\; \epsilon_{\rm ref}\right)},
    \label{eq:preconditioner-regularised}
\end{equation}
{{< /math >}}

where $\epsilon_{\rm ref}$ is a small positive constant (typically a fraction of the bandwidth).

The preconditioned residuals $\{|t_i\rangle\}$ are orthogonalised against the existing subspace
and added as new basis vectors: $\mathcal{V} \leftarrow \mathcal{V} \oplus \mathrm{span}\{|t_i\rangle\}$.
The subspace dimension grows from $m$ to $m + N_{\rm bands}$.

**Step 4 — Restart.** When the subspace becomes too large (typically $m > 3 N_{\rm bands}$),
the oldest basis vectors are discarded, keeping only the current best eigenvector approximations.
This prevents the subspace from growing indefinitely while retaining the most useful information.

**Convergence.** With preconditioning, Davidson converges *quadratically* near the solution —
each iteration roughly doubles the number of correct digits in the eigenvalues. In practice,
$3$–$5$ Davidson iterations per SCF step suffice to converge the eigenpairs to the required
accuracy.

**Block Davidson.** Rather than processing one eigenpair at a time, the block variant processes
all $N_{\rm bands}$ eigenpairs simultaneously. The subspace expansion adds $N_{\rm bands}$
preconditioned residuals at each step. This is more efficient because the Hamiltonian action
$\hat{h}_{\rm KS}|v\rangle$ — the most expensive operation, requiring FFTs between real and
reciprocal space — can be batched over all vectors in the block.

### RMM-DIIS

The **Residual Minimisation Method — Direct Inversion in the Iterative Subspace (RMM-DIIS)**
(Pulay, 1980; Wood and Zunger, 1985; Kresse and Furthmüller, 1996) takes a different approach:
instead of expanding a subspace and projecting, it directly minimises the residual norm
$\|(\hat{h}_{\rm KS} - \epsilon_i)|\phi_i\rangle\|^2$ for each band individually, using the
DIIS extrapolation from Section 8.2.

**The method.** For each band $i$, maintain a history of trial vectors and their residuals from
the last $m$ iterations: $\{|\phi_i^{(n)}\rangle, |r_i^{(n)}\rangle\}$. Construct the optimal
linear combination:
{{< math >}}
\begin{equation}
    |\bar{\phi}_i\rangle = \sum_{k=1}^{m} c_k |\phi_i^{(n-m+k)}\rangle,
    \label{eq:rmm-trial}
\end{equation}
{{< /math >}}

where the coefficients $\{c_k\}$ minimise the residual norm, exactly as in the density-mixing
DIIS of Chapter 8:
{{< math >}}
\begin{equation}
    \min_{\{c_k\}} \left\|\sum_k c_k |r_i^{(n-m+k)}\rangle\right\|^2, \qquad \sum_k c_k = 1.
    \label{eq:rmm-minimise}
\end{equation}
{{< /math >}}

This leads to the same small linear system with the overlap matrix
$B_{jk} = \langle r_i^{(j)} | r_i^{(k)} \rangle$ as in equation \eqref{eq:DIIS-system}. The
optimal trial vector is then updated by applying the preconditioned residual:
{{< math >}}
\begin{equation}
    |\phi_i^{(n+1)}\rangle = |\bar{\phi}_i\rangle + \hat{P}\,|\bar{r}_i\rangle.
    \label{eq:rmm-update}
\end{equation}
{{< /math >}}

**Key difference from Davidson:** RMM-DIIS does *not* require the trial vectors to be mutually
orthogonal at every step. Orthogonalisation is the most expensive operation in Davidson
($\mathcal{O}(N_{\rm bands}^2 \cdot N_{\rm PW})$ per step), and RMM-DIIS avoids it almost
entirely. This makes RMM-DIIS faster per iteration — typically $30$–$50\%$ cheaper than
Davidson for the same system.

**The risk: subspace collapse.** Without explicit orthogonalisation, two or more bands can
converge to the *same* eigenstate, losing one or more eigenpairs from the solution. This is
the **subspace collapse** problem. It manifests as a sudden jump in the total energy when a
previously tracked eigenstate "disappears" and is replaced by a duplicate. The risk is highest
when eigenvalues are nearly degenerate (e.g., $d$-bands in transition metals) or when the
initial guess is poor.

**Practical mitigation.** Occasional re-orthogonalisation — typically every $5$–$10$ RMM-DIIS
steps — prevents subspace collapse at minimal cost. Most implementations also monitor the
overlap matrix of the trial vectors and trigger re-orthogonalisation when near-linear-dependence
is detected.

**The hybrid strategy.** The most effective approach, used as the default in several major
codes, combines both methods: start with a few Davidson steps to establish a well-separated,
orthogonal initial subspace, then switch to RMM-DIIS for the remaining iterations where the
eigenpairs are already approximately correct and only need refinement. The Davidson phase
provides robustness; the RMM-DIIS phase provides speed.

### Conjugate Gradient Minimisation

An alternative to the subspace methods above is **direct minimisation** of the KS total energy
functional with respect to the orbital coefficients, using a conjugate gradient (CG) algorithm.
Rather than solving the eigenvalue equation \eqref{eq:KS-eigen} iteratively, CG treats the
orbitals as variational parameters and minimises:
{{< math >}}
\begin{equation}
    E[\{\phi_i\}] = \sum_i f_i \langle\phi_i|\hat{h}_{\rm KS}|\phi_i\rangle + E_{\rm H}[\rho] + E_{\rm xc}[\rho] - \int V_{\rm H}\rho\,d\mathbf{r},
    \label{eq:CG-functional}
\end{equation}
{{< /math >}}

subject to the orthonormality constraints $\langle\phi_i|\phi_j\rangle = \delta_{ij}$.

CG is the most **robust** of the three methods: it is guaranteed to decrease the total energy
at every step (it is a true minimisation, not an eigenvalue iteration), and it cannot suffer
from subspace collapse. The price is speed — CG converges more slowly than Davidson or
RMM-DIIS because it does not exploit the eigenvalue structure of the problem. It is typically
$2$–$5 \times$ slower per SCF step.

CG is the method of choice when:
the other methods fail to converge (e.g., systems with extremely flat potential energy surfaces
or near-degenerate states), when memory is limited (CG requires minimal subspace storage), or
for the first few SCF steps of a difficult system where a reliable initial eigenspace must be
established before switching to faster methods.

### Computational Scaling

The dominant costs at each SCF step are:

| Operation | Scaling | Bottleneck for |
|---|---|---|
| Hamiltonian action $\hat{h}_{\rm KS}\|\phi\rangle$ (FFTs) | $\mathcal{O}(N_{\rm PW} \log N_{\rm PW})$ per band | Small systems |
| Orthogonalisation (Davidson) | $\mathcal{O}(N_{\rm bands}^2 \cdot N_{\rm PW})$ | Medium systems ($100$–$500$ atoms) |
| Subspace diagonalisation | $\mathcal{O}(N_{\rm bands}^3)$ | Large systems ($>500$ atoms) |

The crossover between regimes depends on the system and the parallelisation strategy. For
most DFT calculations on $50$–$200$ atom cells, the orthogonalisation and subspace
diagonalisation costs dominate, giving an effective scaling of $\mathcal{O}(N^3)$ with system
size $N$. This cubic wall is the fundamental limit of conventional KS-DFT and is the motivation
for linear-scaling ($\mathcal{O}(N)$) methods, which require localised basis sets and are not
yet standard for plane-wave calculations.

**Parallelisation.** The three levels of parallelism available in a plane-wave DFT calculation
are: over $\mathbf{k}$-points (trivially parallel — no communication), over bands
(moderate communication for orthogonalisation), and over plane waves (requires FFT
communication). The optimal decomposition depends on the system: $\mathbf{k}$-point
parallelism is most efficient for small unit cells with dense $\mathbf{k}$-meshes;
band/plane-wave parallelism is needed for large supercells with few $\mathbf{k}$-points.

{{< spoiler text="**Code Notes: VASP and Quantum ESPRESSO Parameters**" >}}

**VASP:**

| Parameter | Controls | Values |
|---|---|---|
| `ALGO` | Diagonalisation algorithm | `Normal`: Davidson; `Fast`: Davidson + RMM-DIIS (default); `All`: Davidson every step; `Conjugate`: CG; `Damped`: damped velocity CG |
| `NBANDS` | Number of bands to compute | Auto (typically $N_{\rm elec}/2 + $ padding); increase for metals or unoccupied-state properties |
| `NELM` | Maximum SCF iterations | $40$–$200$ (default $60$) |
| `NELMIN` | Minimum SCF iterations | $2$–$6$ (default $2$); increase for difficult systems |
| `NELMDL` | Non-self-consistent initial steps | $-5$ to $-12$; negative = auto; builds initial subspace without updating potential |

`ALGO = Fast` (the default) runs Davidson for the first few iterations to establish the
eigenspace, then switches to RMM-DIIS. This is the optimal choice for most systems. Use
`ALGO = All` (Davidson every step) for difficult cases where RMM-DIIS causes instabilities
— particularly magnetic metals, systems with nearly degenerate states, or the first calculation
on a new system type where robustness matters more than speed. Use `ALGO = Damped` for
molecular dynamics at elevated temperatures where the eigenspectrum changes significantly
between ionic steps.

**Quantum ESPRESSO:**

| Parameter | Controls | Values |
|---|---|---|
| `diagonalization` | Algorithm | `'david'`: Davidson (default); `'cg'`: conjugate gradient; `'ppcg'`: parallel-preconditioned CG |
| `diago_david_ndim` | Davidson subspace dimension per band | $2$–$8$ (default $2$); increase for difficult convergence |
| `diago_full_acc` | Force full accuracy at every SCF step | `.true.` or `.false.` (default); use `.true.` for phonons and response properties |
| `nbnd` | Number of bands | Auto; increase for metals or when unoccupied states are needed |
| `electron_maxstep` | Maximum SCF iterations | $100$–$200$ (default $100$) |

In QE, `diagonalization = 'david'` is the default and works well for most systems. The
`'cg'` option is more robust but slower, and is recommended when Davidson fails to converge.
The `'ppcg'` option (parallel-preconditioned CG) is designed for massively parallel runs where
band parallelism is dominant.

{{< /spoiler >}}

{{< spoiler text="**Further Reading**" >}}

- **Davidson algorithm (original):** E. R. Davidson, *The iterative calculation of a few of
  the lowest eigenvalues and corresponding eigenvectors of large real-symmetric matrices*,
  J. Comput. Phys. **17**, 87 (1975). The foundational paper for subspace iteration with
  preconditioning.

- **Adaptation to DFT:** D. M. Wood and A. Zunger, *A new method for diagonalising large
  matrices*, J. Phys. A **18**, 1343 (1985). Adapts the Davidson method to the plane-wave
  pseudopotential framework.

- **VASP implementation (Davidson + RMM-DIIS):** G. Kresse and J. Furthmüller, *Efficient
  iterative schemes for ab initio total-energy calculations using a plane-wave basis set*,
  Phys. Rev. B **54**, 11169 (1996). Sections III and IV describe the block Davidson and
  RMM-DIIS implementations in detail, including the hybrid strategy.

- **Conjugate gradient for DFT:** M. C. Payne, M. P. Teter, D. C. Allan, T. A. Arias, and
  J. D. Joannopoulos, *Iterative minimization techniques for ab initio total-energy
  calculations: molecular dynamics and conjugate gradients*, Rev. Mod. Phys. **64**, 1045
  (1992). The standard reference for CG-based total energy minimisation.

- **Linear-scaling methods:** S. Goedecker, *Linear scaling electronic structure methods*,
  Rev. Mod. Phys. **71**, 1085 (1999). Review of $\mathcal{O}(N)$ approaches that circumvent
  the cubic scaling wall.

{{< /spoiler >}}

---

## Convergence Diagnostics and Practical Workflow

### Reading the SCF Output

A converging SCF calculation produces a characteristic pattern in its output: the total energy
decreases monotonically (or nearly so) toward a limiting value, the energy change per iteration
$\Delta E^{(n)} = E^{(n)} - E^{(n-1)}$ decreases geometrically, and the density residual norm
$\|R^{(n)}\|$ decreases in parallel. Understanding what each output quantity means is essential
for diagnosing problems.

**Total energy.** The KS total energy $E^{(n)}$ at iteration $n$ is *not* variational with
respect to the density — it is only variational at self-consistency. During the SCF cycle,
$E^{(n)}$ can increase between iterations (especially in the first few steps when the density
is far from self-consistent). A sustained increase after $\sim 10$ iterations is a sign of
divergence.

**The Harris–Foulkes energy.** An alternative energy estimate that *is* variational at each
step. It uses the input density $\rho_{\rm in}^{(n)}$ rather than the self-consistent density
to evaluate the XC and Hartree contributions, giving an upper bound to the true ground-state
energy. The difference between the Harris–Foulkes energy and the KS energy provides a measure
of how far the current density is from self-consistency. When both agree to within the
convergence threshold, the SCF cycle has converged.

**Energy change $\Delta E$.** This is the primary convergence indicator. A converged calculation
shows $|\Delta E|$ decreasing by roughly one order of magnitude every $2$–$5$ iterations
(for Pulay/Broyden mixing). If $|\Delta E|$ stalls at a plateau or oscillates, see the
diagnostic table in the Part II overview.

**Density residual.** Some codes report the norm of the density residual
$\|R^{(n)}\| = \|\rho_{\rm out}^{(n)} - \rho_{\rm in}^{(n)}\|$ or the RMS change in the
charge density. This should decrease in tandem with $|\Delta E|$. A large residual at
apparent energy convergence indicates that the energy is accidentally stationary (a saddle
point of the SCF map) rather than truly self-consistent — increase the maximum number of
SCF iterations and tighten the convergence threshold.

### Convergence Thresholds

The required SCF convergence depends on the property being computed:

| Target property | Required energy convergence | Rationale |
|---|---|---|
| Qualitative band structure | $10^{-4}$ eV | Band positions change by $\leq 10$ meV |
| Total energy differences | $10^{-6}$ eV | Formation energies accurate to $\sim 1$ meV/atom |
| Magnetic moments | $10^{-6}$ eV | Moment stable to $\leq 0.01\,\mu_B$ |
| Forces (geometry optimisation) | $10^{-7}$ eV | Forces accurate to $\sim 1$ meV/Å |
| Stress tensor / elastic constants | $10^{-8}$ eV | Stress accurate to $\sim 0.1$ kbar |
| Phonons (DFPT / finite differences) | $10^{-8}$ eV | Force constants require tight force convergence |

**Why tighter is not always better.** Beyond a certain point, tightening the SCF threshold does
not improve results because other sources of error dominate: finite $\mathbf{k}$-mesh,
finite $E_{\rm cut}$, pseudopotential transferability, and the XC functional approximation
itself. A calculation converged to $10^{-10}$ eV is not more accurate than one converged to
$10^{-7}$ eV if the $\mathbf{k}$-mesh introduces $1\,$meV/atom errors. Additionally,
round-off errors in double-precision arithmetic set a floor at $\sim 10^{-12}$–$10^{-14}$ eV
for typical system sizes.

### Common Failure Modes and Remedies

The Part II overview provided a quick-reference table. Here we expand the most important
failure modes with their underlying causes and systematic remedies.

**Failure 1: Total energy oscillates without decreasing.**
The density is sloshing between iterations — the mixing parameter $\alpha$ is too large for
the system's dielectric response (Chapter 8, Section 8.1). Reduce $\alpha$ by a factor of
$2$–$5$. If Kerker preconditioning is not active, enable it. If the system is a metal or
small-gap semiconductor, ensure that an appropriate smearing is used (Section 9.1) — sharp
occupations exacerbate charge sloshing by making the density response discontinuous.

**Failure 2: SCF converges slowly then stalls.**
The DIIS/Broyden subspace is contaminated by poor early iterates. Increase the number of
initial non-DIIS steps (simple mixing with small $\alpha$) to bring the density into the basin
of convergence before the subspace extrapolation takes over. Alternatively, increase the
subspace size to allow more history, or clear the subspace and restart the mixing.

**Failure 3: Spin channels oscillate out of phase.**
In spin-polarised calculations, the up and down densities can trade magnitude between
iterations, producing an apparent antiferromagnetic oscillation that prevents convergence.
This usually indicates either an incorrect initial magnetic configuration or a genuine
competition between ferromagnetic and antiferromagnetic solutions. Fix the initial moments
to match the expected ground state. Use a more robust diagonaliser (Davidson rather than
RMM-DIIS) for the first $\sim 10$ SCF steps to prevent subspace collapse from coupling
to the spin oscillation. If both FM and AFM solutions converge, compare their total energies
to determine the ground state.

**Failure 4: Eigenvalue solver converges to wrong states.**
RMM-DIIS has lost track of one or more bands due to subspace collapse. The symptom is a sudden
jump in the total energy mid-SCF, often accompanied by a change in the number of occupied
states or the magnetic moment. Switch to Davidson for the problematic calculation. If the
problem persists, increase the number of bands to provide a larger buffer between occupied and
unoccupied states.

**Failure 5: Energy converged but forces are noisy.**
The SCF threshold is too loose for the force accuracy required. Forces depend on the density
through the Hellmann–Feynman theorem (Chapter 10), and small density errors that do not affect
the total energy can produce significant force errors. Tighten the energy convergence by one
to two orders of magnitude. Also check that the smearing is appropriate — tetrahedron method
forces contain discontinuities for metals (Section 9.1).

### Worked Example: SCF Convergence for bcc Fe

To tie the chapter together, consider the SCF convergence of ferromagnetic bcc Fe — a
system that exercises every piece of machinery developed in Chapters 8 and 9.

**System:** bcc Fe, $a = 2.87\,$Å, $1$-atom primitive cell, ferromagnetic with initial moment
$5.0\,\mu_B$, $E_{\rm cut} = 500\,$eV, $12 \times 12 \times 12$ $\mathbf{k}$-mesh.

**Smearing:** Methfessel–Paxton $N = 1$ with $\sigma = 0.2\,$eV — this is a metal, so the
tetrahedron method would give discontinuous forces, and Gaussian smearing would require the
$\sigma \to 0$ extrapolation.

**Mixing:** Pulay/DIIS with Kerker preconditioning ($\alpha = 0.05$, $k_0 \sim 1.5\,$Å$^{-1}$)
— a small $\alpha$ because Fe is a magnetic metal with both charge-sloshing and spin-oscillation
risks.

**Diagonalisation:** Davidson for the first $5$ steps to establish a clean eigenspace, then
RMM-DIIS for speed.

**Expected convergence behaviour:**

Iterations $1$–$5$: The total energy drops rapidly (by $\sim 1$ eV) as the initial atomic
superposition density relaxes toward the crystalline density. The magnetic moment adjusts from
$5.0\,\mu_B$ toward the converged value of $\sim 2.2\,\mu_B$. Davidson diagonalisation ensures
the correct band ordering is established.

Iterations $5$–$15$: The energy change decreases geometrically, roughly one order of magnitude
every $3$–$4$ iterations. The DIIS extrapolation begins to accelerate convergence. The switch
to RMM-DIIS at iteration $5$ speeds up each step by $\sim 40\%$.

Iterations $15$–$25$: Final convergence to $10^{-7}$ eV. The magnetic moment is stable at
$2.17$–$2.22\,\mu_B$ (depending on the functional). The entropy correction
$TS \approx 0.3\,$meV/atom confirms that $\sigma = 0.2\,$eV is acceptable.

**What would go wrong with poor settings:**
With simple mixing ($\alpha = 0.3$, no Kerker), the same system would oscillate for $> 200$
iterations without converging — the charge-sloshing modes at small $\mathbf{G}$ are barely
damped. With Gaussian smearing (rather than MP $N=1$), the total energy
would converge but the $\sigma \to 0$ extrapolation would introduce an additional $\sim 5\,$meV
error. With RMM-DIIS from the start (no initial Davidson), there is a risk of subspace collapse
in the $d$-bands, which are nearly five-fold degenerate and prone to mixing.

{{< spoiler text="**Code Notes: VASP and Quantum ESPRESSO Parameters — Full Reference**" >}}

**VASP — Complete SCF parameter list:**

| Parameter | Controls | Recommended | Notes |
|---|---|---|---|
| `ALGO` | Diagonalisation | `Fast` (default) | `All` for difficult systems |
| `NELM` | Max SCF iterations | $60$–$200$ | Increase for slabs, defects |
| `NELMIN` | Min SCF iterations | $2$–$6$ | Prevents premature exit |
| `NELMDL` | Initial non-DIIS steps | $-5$ to $-12$ | Negative = auto |
| `EDIFF` | Energy convergence (eV) | $10^{-6}$–$10^{-8}$ | Match to target property |
| `ISMEAR` | Smearing method | $1$ (MP) for metals; $-5$ (tet) for DOS | See Section 9.1 |
| `SIGMA` | Smearing width (eV) | $0.1$–$0.2$ | Check `EENTRO` $< 1$ meV/atom |
| `AMIX` | Charge mixing $\alpha$ | $0.02$–$0.4$ | Small for metals |
| `BMIX` | Kerker $k_0$ | $0.5$–$3.0$ | Enable for metals |
| `AMIX_MAG` | Spin mixing $\alpha$ | $2$–$4 \times$ `AMIX` | Often larger than charge mixing |
| `BMIX_MAG` | Kerker for spin | $\sim$ `BMIX` | |
| `MAXMIX` | Mixing history size | $20$–$60$ | Increase for slabs |
| `IMIX` | Mixing scheme | $4$ (Broyden, default) | |
| `NBANDS` | Number of bands | Auto + padding | Increase for metals |
| `LREAL` | Real-space projection | `.FALSE.` for small cells | `.TRUE.` for $> 20$ atoms |

**Quantum ESPRESSO — Complete SCF parameter list:**

| Parameter | Controls | Recommended | Notes |
|---|---|---|---|
| `diagonalization` | Algorithm | `'david'` (default) | `'cg'` for robustness |
| `electron_maxstep` | Max SCF iterations | $100$–$200$ | |
| `conv_thr` | Energy convergence (Ry) | $10^{-8}$–$10^{-10}$ | Note: Ry units |
| `occupations` | Occupation scheme | `'smearing'` or `'tetrahedra_opt'` | |
| `smearing` | Smearing function | `'methfessel-paxton'` for metals | |
| `degauss` | Smearing width (Ry) | $0.005$–$0.02$ | $1\,$Ry $= 13.6\,$eV |
| `mixing_beta` | Mixing parameter | $0.1$–$0.7$ | Small for metals |
| `mixing_mode` | Preconditioning | `'local-TF'` for metals | |
| `mixing_ndim` | Mixing history | $4$–$12$ | |
| `nbnd` | Number of bands | Auto | Increase for metals |
| `diago_david_ndim` | Davidson subspace | $2$–$8$ | |

{{< /spoiler >}}

---

## Outlook

Chapters 8 and 9 together provide the complete numerical machinery for solving the Kohn–Sham
equations self-consistently: density mixing drives the outer SCF loop to convergence
(Chapter 8), while smearing regularises the BZ integrals and iterative diagonalisation makes
the eigenvalue problem tractable (this chapter). With a converged, self-consistent ground-state
density in hand, the next step is to extract physical observables.

The most immediate observable beyond the total energy is the **force** on each atom — the
negative gradient of the total energy with respect to atomic positions. The Hellmann–Feynman
theorem provides an exact expression for this force, but its practical evaluation requires
careful treatment of the Pulay corrections that arise when the basis set depends on atomic
positions. Forces, in turn, enable **geometry optimisation** (finding the equilibrium structure)
and **ab initio molecular dynamics** (following the time evolution of the nuclei on the DFT
potential energy surface). These topics are the subject of the next chapter.
