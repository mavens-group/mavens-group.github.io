# Eigenvalue Solvers

Part II opens the black box of practical Kohn–Sham DFT by proceeding **from the innermost
computational loop outward** across the three nested numerical stages introduced in Chapter 3
(Section 3.4):

1. **Eigenvalue solver (Inner loop — this chapter)** — at every SCF iteration and every
   \\(\mathbf{k}\\)-point, solves \\(\hat{h}\_{\rm KS}\phi\_i = \epsilon\_i\phi\_i\\) for the
   lowest \\(N\_{\rm bands}\\) eigenpairs at fixed effective potential \\(V\_{\rm eff}(\mathbf{r})\\).
2. **Brillouin zone integration and smearing (Chapter 9)** — integrates over the Brillouin zone
   and assigns partial occupancies \\(f\_{i\mathbf{k}}\\) across the Fermi surface to assemble the
   output density
   \\(\rho\_{\rm out}(\mathbf{r}) = \sum\_{i\mathbf{k}} w\_{\mathbf{k}} f\_{i\mathbf{k}} |\phi\_{i\mathbf{k}}(\mathbf{r})|^2\\).
3. **Density mixing and SCF convergence (Chapter 10)** — updates
   \\(\rho\_{\rm in} \to \rho\_{\rm in}^{(n+1)}\\) via Kerker, Pulay/DIIS, and Broyden schemes to
   converge the outer electronic fixed-point loop \\(\rho^\* = F[\rho^\*]\\).

The Kohn–Sham eigenvalue problem developed in this chapter is called
\\(N\_{\rm SCF} \times N\_{\mathbf{k}}\\) times per total-energy evaluation, so even factor-of-two
improvements in its cost translate into substantial wall-clock savings. Because the Hamiltonian
matrix is far too large to diagonalise directly (\\(N\_{\rm PW} \sim 10^4\\)–\\(10^5\\)) while
only the lowest \\(N\_{\rm bands} \sim 10^2\\)–\\(10^3\\) eigenpairs are needed, practical codes
use **iterative subspace algorithms**: Davidson, RMM-DIIS, and conjugate-gradient minimisation.
These trade off robustness, memory, and convergence rate, and the optimal choice depends on
system size and electronic band structure.

The chapter concludes with a section on **multi-level parallelisation** across
\\(\mathbf{k}\\)-points, bands, and plane waves, which governs the scalability of every
production DFT calculation.


## Iterative Diagonalisation

### The Eigenvalue Problem and Its Cost

At each SCF step, we must solve the Kohn–Sham eigenvalue equation:

<div>
\begin{equation}
    \hat{h}_{\rm KS} |\phi_i\rangle = \epsilon_i |\phi_i\rangle,
    \qquad
    \hat{h}_{\rm KS} = -\frac{1}{2}\nabla^2 + V_{\rm eff}(\mathbf{r}),
    \label{eq:KS-eigen}
\end{equation}
</div>

for the lowest \\(N\_{\rm bands}\\) eigenpairs \\(\\{(\epsilon\_i, |\phi\_i\rangle)\\}\\). In a plane-wave
basis, \\(\hat{h}\_{\rm KS}\\) is represented as a matrix of dimension \\(N\_{\rm PW} \times N\_{\rm PW}\\),
where \\(N\_{\rm PW}\\) is the number of plane waves within the energy cutoff \\(E\_{\rm cut}\\). For a
typical calculation:

A \\(50\\)-atom cell with \\(E\_{\rm cut} = 500\\) eV gives \\(N\_{\rm PW} \sim 30\\,000\\) per
\\(\mathbf{k}\\)-point. A \\(200\\)-atom cell gives \\(N\_{\rm PW} \sim 120\\,000\\). Full diagonalisation
of an \\(N\_{\rm PW} \times N\_{\rm PW}\\) matrix costs \\(\mathcal{O}(N\_{\rm PW}^3)\\) operations. For
\\(N\_{\rm PW} = 30\\,000\\), this is \\(\sim 2.7 \times 10^{13}\\) floating-point operations — already
at the limit of practicality for a *single* diagonalisation at a *single* \\(\mathbf{k}\\)-point.
Since the SCF loop requires \\(\sim 20\\)–\\(50\\) diagonalisations, and the BZ integral requires tens
to hundreds of \\(\mathbf{k}\\)-points, full diagonalisation is completely intractable for any
system of practical interest.

The key observation is that we do not need *all* \\(N\_{\rm PW}\\) eigenpairs — only the lowest
\\(N\_{\rm bands}\\), which is proportional to the number of electrons and hence to \\(N\_{\rm atom}\\).
For a \\(50\\)-atom cell, \\(N\_{\rm bands} \sim 200\\), which is \\(\ll N\_{\rm PW}\\). **Iterative subspace
methods** exploit this by working in a small subspace of dimension \\(m \sim 2\\)–\\(3 \times N\_{\rm bands}\\),
reducing the cost from \\(\mathcal{O}(N\_{\rm PW}^3)\\) to
\\(\mathcal{O}(N\_{\rm bands}^2 \cdot N\_{\rm PW})\\) per SCF step — a reduction of several orders
of magnitude.

### The Davidson Algorithm

The **Davidson algorithm** (Davidson, 1975; adapted for plane-wave DFT by Wood and Zunger,
1985) is the most widely used iterative eigensolver in electronic structure codes. It belongs
to the family of Krylov subspace methods but uses a preconditioner to accelerate convergence
dramatically compared to the Lanczos algorithm.

**The basic idea.** Start with a set of \\(N\_{\rm bands}\\) trial vectors
\\(\\{|v\_1\rangle, \ldots, |v\_{N\_{\rm bands}}\rangle\\}\\) — typically the eigenvectors from the
previous SCF step, or random vectors for the first step. These span an initial subspace
\\(\mathcal{V}\\). The algorithm proceeds iteratively:

**Step 1 — Project and diagonalise.** Form the projected Hamiltonian and overlap matrices
within the current subspace:

<div>
\begin{equation}
    H_{ij}^{\rm sub} = \langle v_i | \hat{h}_{\rm KS} | v_j \rangle, \qquad
    S_{ij}^{\rm sub} = \langle v_i | v_j \rangle.
    \label{eq:davidson-project}
\end{equation}
</div>

Diagonalise the small \\(m \times m\\) generalised eigenvalue problem
\\(\mathbf{H}^{\rm sub}\mathbf{c} = \epsilon\\, \mathbf{S}^{\rm sub}\mathbf{c}\\) to obtain
approximate eigenvalues \\(\\{\epsilon\_i^{\rm sub}\\}\\) and eigenvectors expressed as linear
combinations of the subspace basis: \\(|\tilde{\phi}\_i\rangle = \sum\_j c\_{ij} |v\_j\rangle\\).
This small diagonalisation costs \\(\mathcal{O}(m^3)\\), which is negligible.

**Step 2 — Compute residuals.** For each approximate eigenpair, compute the residual:

<div>
\begin{equation}
    |r_i\rangle = (\hat{h}_{\rm KS} - \epsilon_i^{\rm sub})|\tilde{\phi}_i\rangle.
    \label{eq:davidson-residual}
\end{equation}
</div>

If \\(\\|r\_i\\| \leq \delta\\) for all desired eigenpairs, the algorithm has converged. The threshold
\\(\delta\\) is typically set to \\(10^{-2}\\)–\\(10^{-3}\\) times the SCF energy convergence criterion,
since the eigenvalues need not be converged more tightly than the density at each SCF step.

**Step 3 — Precondition and expand.** The residual \\(|r\_i\rangle\\) points in the direction of
steepest descent toward the true eigenvector, but its components at different \\(\mathbf{G}\\)
converge at very different rates. High-\\(G\\) components (large kinetic energy) have large
eigenvalue separations and converge quickly; low-\\(G\\) components are nearly degenerate and
converge slowly. The **kinetic energy preconditioner** corrects this disparity by
approximately inverting the dominant part of the Hamiltonian:

<div>
\begin{equation}
    \boxed{|t_i\rangle = \hat{P}\,|r_i\rangle, \qquad
    P(\mathbf{G}) = \frac{1}{\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 - \epsilon_i^{\rm sub}}.}
    \label{eq:preconditioner}
\end{equation}
</div>

In reciprocal space, this simply divides each plane-wave component of the residual by the
difference between its kinetic energy and the current eigenvalue estimate. The effect is to
rotate the residual toward the true eigenspace: components that are far from the eigenvalue
(large \\(|\frac{1}{2}G^2 - \epsilon\_i|\\)) are suppressed, while components near the eigenvalue
are amplified. This reciprocal-space preconditioning philosophy — rescaling Fourier components by
an approximate inverse operator — will reappear in Chapter 10 as Kerker preconditioning for
long-wavelength charge-density mixing.

In practice, a regularisation is applied to prevent the denominator from vanishing when
\\(\frac{1}{2}G^2 \approx \epsilon\_i\\). The standard choice is:

<div>
\begin{equation}
    P(\mathbf{G}) = \frac{1}{\max\!\left(\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 - \epsilon_i^{\rm sub},\; \epsilon_{\rm ref}\right)},
    \label{eq:preconditioner-regularised}
\end{equation}
</div>

where \\(\epsilon\_{\rm ref}\\) is a small positive constant (typically a fraction of the bandwidth).

The preconditioned residuals \\(\\{|t\_i\rangle\\}\\) are orthogonalised against the existing subspace
and added as new basis vectors: \\(\mathcal{V} \leftarrow \mathcal{V} \oplus \mathrm{span}\\{|t\_i\rangle\\}\\).
The subspace dimension grows from \\(m\\) to \\(m + N\_{\rm bands}\\).

**Step 4 — Restart.** When the subspace becomes too large (typically \\(m \gt 3 N\_{\rm bands}\\)),
the oldest basis vectors are discarded, keeping only the current best eigenvector approximations.
This prevents the subspace from growing indefinitely while retaining the most useful information.

**Convergence.** With preconditioning, Davidson converges *quadratically* near the solution —
each iteration roughly doubles the number of correct digits in the eigenvalues. In practice,
\\(3\\)–\\(5\\) Davidson iterations per SCF step suffice to converge the eigenpairs to the required
accuracy.

**Block Davidson.** Rather than processing one eigenpair at a time, the block variant processes
all \\(N\_{\rm bands}\\) eigenpairs simultaneously. The subspace expansion adds \\(N\_{\rm bands}\\)
preconditioned residuals at each step. This is more efficient because the Hamiltonian action
\\(\hat{h}\_{\rm KS}|v\rangle\\) — the most expensive operation, requiring FFTs between real and
reciprocal space — can be batched over all vectors in the block.

### RMM-DIIS

The **Residual Minimisation Method — Direct Inversion in the Iterative Subspace (RMM-DIIS)**
(Pulay, 1980; Wood and Zunger, 1985; Kresse and Furthmüller, 1996) takes a different approach:
instead of expanding a global orthogonal subspace and projecting, it directly minimises the
residual norm \\(\\|(\hat{h}\_{\rm KS} - \epsilon\_i)|\phi\_i\rangle\\|^2\\) for each band
individually using Pulay's DIIS subspace extrapolation.

**The method.** For each band \\(i\\), maintain a history of trial vectors and their residuals from
the last \\(m\\) iterations: \\(\\{|\phi\_i^{(n)}\rangle, |r\_i^{(n)}\rangle\\}\\). Because
\\(\hat{h}\_{\rm KS}\\) acts nearly linearly on small orbital variations near an eigenpair, an
affine combination of the stored iterates

<div>
\begin{equation}
    |\bar{\phi}_i\rangle = \sum_{k=1}^{m} c_k |\phi_i^{(n-m+k)}\rangle,
    \qquad
    \sum_{k=1}^{m} c_k = 1,
    \label{eq:rmm-trial}
\end{equation}
</div>

has residual \\(|\bar{r}\_i\rangle \approx \sum\_{k=1}^m c\_k |r\_i^{(n-m+k)}\rangle\\). Choosing the
weights \\(\\{c\_k\\}\\) to minimise the squared residual norm yields the constrained least-squares
problem:

<div>
\begin{equation}
    \min_{\{c_k\}} \left\|\sum_{k=1}^m c_k |r_i^{(n-m+k)}\rangle\right\|^2, \qquad \sum_{k=1}^m c_k = 1.
    \label{eq:rmm-minimise}
\end{equation}
</div>

Introducing a Lagrange multiplier \\(\mu\\) for the normalisation constraint \\(\sum\_k c\_k = 1\\)
produces a small \\((m+1) \times (m+1)\\) linear system built from the residual overlap matrix
\\(B\_{jk} = \langle r\_i^{(j)} | r\_i^{(k)} \rangle\\) (the same DIIS subspace machinery that
Chapter 10 will apply to the global charge-density residual in Pulay mixing). The optimal trial
vector is then updated by applying the preconditioned residual:

<div>
\begin{equation}
    |\phi_i^{(n+1)}\rangle = |\bar{\phi}_i\rangle + \hat{P}\,|\bar{r}_i\rangle.
    \label{eq:rmm-update}
\end{equation}
</div>

**Key difference from Davidson:** RMM-DIIS does *not* require the trial vectors to be mutually
orthogonal at every step. Orthogonalisation is the most expensive operation in Davidson
(\\(\mathcal{O}(N\_{\rm bands}^2 \cdot N\_{\rm PW})\\) per step), and RMM-DIIS avoids it almost
entirely. This makes RMM-DIIS faster per iteration — typically \\(30\\)–\\(50\\%\\) cheaper than
Davidson for the same system.

**The risk: subspace collapse.** Without explicit orthogonalisation, two or more bands can
converge to the *same* eigenstate, losing one or more eigenpairs from the solution. This is
the **subspace collapse** problem. It manifests as a sudden jump in the total energy when a
previously tracked eigenstate "disappears" and is replaced by a duplicate. The risk is highest
when eigenvalues are nearly degenerate (e.g., \\(d\\)-bands in transition metals) or when the
initial guess is poor.

**Practical mitigation.** Occasional re-orthogonalisation — typically every \\(5\\)–\\(10\\) RMM-DIIS
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

<div>
\begin{equation}
    E[\{\phi_i\}] = \sum_i f_i \langle\phi_i|\hat{h}_{\rm KS}|\phi_i\rangle - E_{\rm H}[\rho] - \int V_{\rm xc}(\mathbf{r})\rho(\mathbf{r})\,d\mathbf{r} + E_{\rm xc}[\rho],
    \label{eq:CG-functional}
\end{equation}
</div>

subject to the orthonormality constraints \\(\langle\phi\_i|\phi\_j\rangle = \delta\_{ij}\\).

CG is the most **robust** of the three methods: it is guaranteed to decrease the total energy
at every step (it is a true minimisation, not an eigenvalue iteration), and it cannot suffer
from subspace collapse. The price is speed — CG converges more slowly than Davidson or
RMM-DIIS because it does not exploit the eigenvalue structure of the problem. It is typically
\\(2\\)–\\(5 \times\\) slower per SCF step.

CG is the method of choice when:
the other methods fail to converge (e.g., systems with extremely flat potential energy surfaces
or near-degenerate states), when memory is limited (CG requires minimal subspace storage), or
for the first few SCF steps of a difficult system where a reliable initial eigenspace must be
established before switching to faster methods.

### Parallelisation

The eigenvalue solver is also where DFT calculations spend most of their wall-clock time, so
its parallelisation determines the scalability of the whole calculation. Plane-wave DFT codes
exploit four levels of parallelism, listed in roughly the order they should be increased as the
number of cores grows:

**1. \\(\mathbf{k}\\)-point parallelism.** Different \\(\mathbf{k}\\)-points are independent of each
other at fixed potential — they communicate only through the density and total energy. This is
the most efficient parallelisation: nearly perfect scaling, minimal communication. Limited by the
number of irreducible \\(\mathbf{k}\\)-points in the BZ. Controlled by `KPAR` (VASP) or
`-npool` (Quantum ESPRESSO).

**2. Band parallelism.** Different bands (eigenpairs) within a single \\(\mathbf{k}\\)-point are
distributed across cores. Requires communication for orthogonalisation
(\\(\mathcal{O}(N\_{\rm bands}^2 \cdot N\_{\rm PW})\\)) and for subspace diagonalisation. Scales well
up to a few dozen cores per \\(\mathbf{k}\\)-point, then orthogonalisation overhead becomes
limiting. Controlled by `NCORE` and `NPAR` (VASP) or `-nband` (QE).

**3. Plane-wave (\\(\mathbf{G}\\)-vector) parallelism.** The plane-wave coefficients of each band
are distributed across cores. Required for very large unit cells where bands cannot fit in
single-node memory. Requires FFT communication at every Hamiltonian application, which is the
dominant cost; the FFT slabs are distributed and 3D transposes are performed at each step.
Typically used in combination with band parallelism: cores are arranged in a 2D grid, with
\\(P\_{\rm band} \times P\_{\mathbf{G}}\\) processes per \\(\mathbf{k}\\)-point. In QE this is `-ntg`
(task groups for FFT).

**4. Subspace-diagonalisation parallelism.** The dense \\(N\_{\rm bands} \times N\_{\rm bands}\\)
subspace matrix is diagonalised at each iteration. For \\(N\_{\rm bands} > 1000\\), this becomes a
bottleneck and is parallelised via ScaLAPACK or ELPA. Controlled by `LSCALAPACK` and `LSCAAWARE`
(VASP) or `-ndiag` (QE).

**Choosing the decomposition.** A practical rule of thumb for \\(N\_{\rm cores}\\) total cores:

- Set \\(P\_{\mathbf{k}} = N\_{\rm irr.\\,k}\\) or a divisor thereof (one pool per \\(\mathbf{k}\\)).
- Set \\(P\_{\rm band} \cdot P\_{\mathbf{G}} = N\_{\rm cores} / P\_{\mathbf{k}}\\) per pool, with
  \\(P\_{\rm band}\\) chosen so that each rank holds \\(\sim 5\\)–\\(20\\) bands.
- Use `-ndiag` (QE) or the `LSCALAPACK` route (VASP) only when the subspace diagonalisation
  shows up significantly in profiling.

For example, a 200-atom magnetic supercell with 8 irreducible \\(\mathbf{k}\\)-points and
\\(N\_{\rm bands} = 600\\), running on 256 cores, might use \\(P\_{\mathbf{k}} = 8\\),
\\(P\_{\rm band} = 8\\), \\(P\_{\mathbf{G}} = 4\\), giving \\(\sim 75\\) bands per band-group and
\\(\sim 15\\,000\\) \\(\mathbf{G}\\)-vectors per FFT-group — a balanced point.

**Concrete code settings:**

| Parallelism level | VASP | Quantum ESPRESSO |
|---|---|---|
| \\(\mathbf{k}\\)-points | `KPAR = P_k` | `-npool P_k` |
| Bands | `NCORE = P_b / NPAR` (NCORE = cores per band group) | `-nband P_b` |
| Plane waves / FFT | Coupled to `NCORE` | `-ntg P_g` |
| Subspace diag. | `LSCALAPACK = .TRUE.` | `-ndiag P_d` (must be a perfect square) |

For hybrid-functional or DFT+U calculations, the exact-exchange and Hubbard contributions add
additional MPI/OpenMP communication patterns; `LHFCALC = .TRUE.` calculations in VASP often
benefit from larger `NCORE` (more cores per band group) to overlap communication with FFT work.

### Computational Scaling

The dominant costs at each SCF step are:

| Operation | Scaling | Bottleneck for |
|---|---|---|
| Hamiltonian action \\(\hat{h}\_{\rm KS}\|\phi\rangle\\) (FFTs) | \\(\mathcal{O}(N\_{\rm PW} \log N\_{\rm PW})\\) per band | Small systems |
| Orthogonalisation (Davidson) | \\(\mathcal{O}(N\_{\rm bands}^2 \cdot N\_{\rm PW})\\) | Medium systems (\\(100\\)–\\(500\\) atoms) |
| Subspace diagonalisation | \\(\mathcal{O}(N\_{\rm bands}^3)\\) | Large systems (\\(\gt 500\\) atoms) |

The crossover between regimes depends on the system and the parallelisation strategy. For
most DFT calculations on \\(50\\)–\\(200\\) atom cells, the orthogonalisation and subspace
diagonalisation costs dominate, giving an effective scaling of \\(\mathcal{O}(N^3)\\) with system
size \\(N\\). This cubic wall is the fundamental limit of conventional KS-DFT and is the motivation
for linear-scaling (\\(\mathcal{O}(N)\\)) methods, which require localised basis sets and are not
yet standard for plane-wave calculations.

<details>
<summary><b>Code Notes: VASP and Quantum ESPRESSO Parameters</b></summary>

**VASP:**

| Parameter | Controls | Values |
|---|---|---|
| `ALGO` | Diagonalisation algorithm | `Normal`: Davidson; `Fast`: Davidson + RMM-DIIS (default); `All`: Davidson every step; `Conjugate`: CG; `Damped`: damped velocity CG |
| `NBANDS` | Number of bands to compute | Auto (typically \\(N\_{\rm elec}/2 + \\) padding); increase for metals or unoccupied-state properties |
| `NELM` | Maximum SCF iterations | \\(40\\)–\\(200\\) (default \\(60\\)) |
| `NELMIN` | Minimum SCF iterations | \\(2\\)–\\(6\\) (default \\(2\\)); increase for difficult systems |
| `NELMDL` | Non-self-consistent initial steps | \\(-5\\) to \\(-12\\); negative = auto; builds initial subspace without updating potential |

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
| `diago_david_ndim` | Davidson subspace dimension per band | \\(2\\)–\\(8\\) (default \\(2\\)); increase for difficult convergence |
| `diago_full_acc` | Force full accuracy at every SCF step | `.true.` or `.false.` (default); use `.true.` for phonons and response properties |
| `nbnd` | Number of bands | Auto; increase for metals or when unoccupied states are needed |
| `electron_maxstep` | Maximum SCF iterations | \\(100\\)–\\(200\\) (default \\(100\\)) |

In QE, `diagonalization = 'david'` is the default and works well for most systems. The
`'cg'` option is more robust but slower, and is recommended when Davidson fails to converge.
The `'ppcg'` option (parallel-preconditioned CG) is designed for massively parallel runs where
band parallelism is dominant.

</details>

<details>
<summary><b>Further Reading</b></summary>

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
  Rev. Mod. Phys. **71**, 1085 (1999). Review of \\(\mathcal{O}(N)\\) approaches that circumvent
  the cubic scaling wall.

</details>

---

## Outlook

Iterative subspace diagonalisation (`Davidson`, `RMM-DIIS`, and `CG`) together with multi-level MPI
parallelisation across \\(\mathbf{k}\\)-points, bands, and plane waves form the **innermost engine**
of plane-wave Kohn–Sham DFT: for any trial effective potential \\(V\_{\rm eff}(\mathbf{r})\\), they
deliver the lowest \\(N\_{\rm bands}\\) eigenpairs
\\(\\{(\epsilon\_{i\mathbf{k}}, |\phi\_{i\mathbf{k}}\rangle)\\}\\) at each \\(\mathbf{k}\\)-point
without ever constructing or storing the full \\(N\_{\rm PW} \times N\_{\rm PW}\\) Hamiltonian.

Turning those eigenpairs into a new electron density
\\(\rho\_{\rm out}(\mathbf{r}) = \sum\_{i\mathbf{k}} w\_{\mathbf{k}} f\_{i\mathbf{k}} |\phi\_{i\mathbf{k}}(\mathbf{r})|^2\\)
and total energy, however, requires integrating over the first Brillouin zone and assigning partial
occupancies \\(f\_{i\mathbf{k}}\\) across metallic Fermi surfaces without introducing discontinuous
jumps—the subject of **Chapter 9**. Once one complete evaluation of
\\(\rho\_{\rm out} = F[\rho\_{\rm in}]\\) is defined by combining Chapters 8 and 9, **Chapter 10**
tackles the outer electronic SCF loop itself: how to mix input and output densities using Kerker
preconditioning, Pulay/DIIS, and Broyden schemes to suppress charge sloshing and achieve smooth
self-consistency.
