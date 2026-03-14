---
title: Basis Sets and Pseudopotentials
date: '2026-03-14'
type: book
weight: 05
summary: Plane waves, localised orbitals, PAW, and convergence
---
<!--more-->

Solving the Kohn–Sham equations requires representing the single-particle orbitals
$\phi_i(\mathbf{r})$ numerically. There are two complementary choices to be made:

1. **How to expand the orbitals** — the choice of *basis set*.
2. **How to treat the core electrons** — full all-electron treatment, or replace the core with a
   *pseudopotential* (PP) or *projector augmented wave* (PAW) potential.

These choices profoundly affect computational cost, accuracy, and the type of system tractable.
This chapter develops the theory behind the most common approaches and provides practical guidance
on convergence.

---

## Basis Set Expansion

The KS orbital $\phi_i(\mathbf{r})$ is an element of an infinite-dimensional Hilbert space. In
practice, it is expanded in a finite basis $\{f_\mu(\mathbf{r})\}$:
\begin{equation}
    \phi_i(\mathbf{r}) = \sum_\mu c_{i\mu}\, f_\mu(\mathbf{r}),
\end{equation}
where the coefficients $c_{i\mu}$ are determined by diagonalising the KS Hamiltonian in this
basis. The KS eigenvalue problem \eqref{eq:KS-eqn} becomes the generalised matrix eigenvalue
problem:
\begin{equation}
    \mathbf{H}_{\rm KS}\,\mathbf{c}_i = \epsilon_i\,\mathbf{S}\,\mathbf{c}_i,
\end{equation}
where $H_{\rm KS,\mu\nu} = \langle f_\mu | \hat{h}_{\rm KS} | f_\nu\rangle$ and
$S_{\mu\nu} = \langle f_\mu | f_\nu\rangle$ is the overlap matrix. The two dominant choices are
**plane waves** and **localised (atomic-like) basis functions**.

---

## Plane-Wave Basis Sets

For crystalline solids, Bloch's theorem dictates that KS orbitals have the form:
\begin{equation}
    \phi_{i\mathbf{k}}(\mathbf{r}) = e^{i\mathbf{k}\cdot\mathbf{r}}\,u_{i\mathbf{k}}(\mathbf{r}),
\end{equation}
where $u_{i\mathbf{k}}(\mathbf{r})$ is lattice-periodic. The periodic part is naturally expanded
in **plane waves** labelled by reciprocal lattice vectors $\mathbf{G}$:
\begin{equation}
    u_{i\mathbf{k}}(\mathbf{r}) = \frac{1}{\sqrt{\Omega}}\sum_{\mathbf{G}} c_{i,\mathbf{k}+\mathbf{G}}\,e^{i\mathbf{G}\cdot\mathbf{r}},
\end{equation}
where $\Omega$ is the unit cell volume. The basis is truncated at a **kinetic energy cutoff**
$E_{\rm cut}$:
\begin{equation}
    \frac{\hbar^2}{2m}|\mathbf{k}+\mathbf{G}|^2 \leq E_{\rm cut}.
\end{equation}

**Advantages of plane waves:**
- **Systematic completeness**: increasing $E_{\rm cut}$ improves the basis in a controlled,
  unbiased way. Convergence is monitored by a single parameter.
- **No basis set superposition error (BSSE)**: Plane waves are not centred on atoms, so the
  basis does not artificially lower the energy when two atoms approach.
- **Efficient evaluation**: The Hartree potential and charge density are related by Poisson's
  equation, which is diagonal in reciprocal space. Fast Fourier transforms (FFTs) enable
  $\mathcal{O}(N \log N)$ switching between real and reciprocal space.
- **Implemented in major codes**: VASP, Quantum ESPRESSO, ABINIT, CP2K (mixed Gaussian/PW).

**Disadvantages:**
- **All-electron calculations are impractical**: Near the nuclei, KS orbitals oscillate rapidly
  (due to orthogonality to core states), requiring an extremely large $E_{\rm cut}$. This
  motivates the use of pseudopotentials or PAW (see below).
- **Poor for isolated molecules**: A large vacuum supercell is needed to prevent periodic
  images from interacting, wasting computational effort.
- **Not naturally localised**: Analysis (e.g. Bader charges, wannier functions) requires
  post-processing.

### Convergence with Respect to $E_{\rm cut}$

A **convergence test** is mandatory in every plane-wave calculation. The procedure is:
1. Fix all other parameters (cell, $k$-points, functional).
2. Compute the total energy $E_{\rm tot}(E_{\rm cut})$ for a series of cutoff values.
3. Identify the cutoff where $\Delta E_{\rm tot} < \epsilon_{\rm tol}$ (typically $1$–$5$ meV/atom).

Typical converged cutoffs: $\sim 400$–$600$ eV for GGA+PAW; $\sim 700$–$1200$ eV for
norm-conserving PPs; transition metal oxides and $f$-electron systems often require higher
values.

---

## $k$-Point Sampling

In a periodic solid, the KS equations must be solved at every $\mathbf{k}$-point in the first
Brillouin zone (BZ). Physical observables involve BZ integrals, e.g.:
\begin{equation}
    \rho(\mathbf{r}) = \frac{\Omega}{(2\pi)^3}\sum_i \int_{\rm BZ} |\phi_{i\mathbf{k}}(\mathbf{r})|^2\,d\mathbf{k}.
\end{equation}

In practice, the integral is replaced by a discrete sum over a finite mesh. The standard choice
is the **Monkhorst–Pack (MP) mesh**: a uniform $N_1 \times N_2 \times N_3$ grid in reciprocal
space, optionally shifted to include or exclude $\Gamma$. The total number of $k$-points is
reduced by the point-group symmetry of the crystal.

**Convergence with $k$-mesh density:**
- Metals require denser meshes (many $k$-points near the Fermi surface): $20\times 20\times 20$
  or more for simple metals.
- Semiconductors and insulators with gaps converge faster: $6\times 6\times 6$ is often
  sufficient.
- A smearing method (Methfessel–Paxton, Fermi–Dirac, or Gaussian) is applied to the
  occupation numbers for metals to accelerate convergence.

The $k$-point density and $E_{\rm cut}$ must be **converged independently and jointly**: the two
parameters interact through the density, so a joint convergence test (varying both) is the most
rigorous approach.

---

## Localised Basis Sets

An alternative to plane waves is to expand orbitals in **atom-centred functions** that mimic the
shape of atomic orbitals. Each basis function $f_\mu(\mathbf{r}) = f_\mu(|\mathbf{r}-\mathbf{R}_A|)$
is centred on atom $A$.

### Gaussian-Type Orbitals (GTOs)

GTOs take the form $f(r) = r^l e^{-\alpha r^2} Y_l^m(\hat{\mathbf{r}})$, where $\alpha$ is the
exponent and $Y_l^m$ is a real spherical harmonic. Multi-Gaussian contractions are used:
\begin{equation}
    f_\mu(r) = \sum_k d_{\mu k}\,g_k(r,\alpha_k).
\end{equation}

GTOs are the standard in quantum chemistry codes (Gaussian, CRYSTAL, FHI-aims). Common basis
set families: **6-31G**, **cc-pVDZ/TZ**, **def2-TZVP**. The acronyms encode the contraction
scheme; "triple-zeta" basis sets use three groups of Gaussians per angular momentum channel and
are typically converged for production calculations. Diffuse functions (denoted by $+$ or
"aug-") are important for anions and excited states.

### Numerical Atomic Orbitals (NAOs)

NAOs use numerically tabulated radial functions, typically derived from atomic DFT calculations.
They are compact (strictly localised beyond a cutoff radius) and efficient for large-scale
calculations. Used in FHI-aims (numeric all-electron), SIESTA, OpenMX.

**Advantages of localised bases:**
- Efficient for molecules and non-periodic systems (no vacuum padding needed).
- Sparse Hamiltonian and overlap matrices enable $\mathcal{O}(N)$ scaling algorithms.
- Natural interface with chemical intuition (orbital populations, Mulliken/Löwdin charges).

**Disadvantages:**
- **Basis set superposition error (BSSE)**: When two fragments approach, each borrows basis
  functions from the other, artificially lowering the energy. The counterpoise correction
  (Boys–Bernardi) partially remedies this.
- **Incompleteness**: The basis is not systematically improvable by a single parameter;
  basis quality depends on the choice of exponents and contraction.
- **Egg-shaped convergence**: Difficult to converge to the complete basis set (CBS) limit.

---

## Core Electrons: Three Strategies

Relativistic and strongly oscillating core orbitals are expensive to represent and barely
participate in chemistry or bonding. Three strategies exist for handling them.

### All-Electron (AE) Calculations

All electrons, including core, are treated explicitly. Mandatory when:
- Core–valence interactions are chemically important (e.g. hyperfine coupling, NMR shifts, X-ray
  spectra).
- High-accuracy benchmarks are required.
- Working with very light elements (H, Li) where "core" electrons don't exist.

Examples: FHI-aims (NAO), WIEN2k (LAPW), FLEUR.

### Norm-Conserving Pseudopotentials (NCPP)

The core electrons are replaced by an **effective potential** $V_{\rm PP}(\mathbf{r})$ that
reproduces the scattering properties of the full ionic potential in the valence region. The
pseudo-wavefunction $\tilde{\phi}_l(r)$ agrees with the true all-electron wavefunction
$\phi_l(r)$ outside a cutoff radius $r_c$:
\begin{equation}
    \tilde{\phi}_l(r) = \phi_l(r), \quad r > r_c.
\end{equation}

The **norm-conservation condition** requires:
\begin{equation}
    \int_0^{r_c} |\tilde{\phi}_l(r)|^2 r^2\,dr = \int_0^{r_c} |\phi_l(r)|^2 r^2\,dr,
\end{equation}
ensuring that the charge inside $r_c$ is preserved and that the logarithmic derivatives (which
control scattering) match at $r_c$. The Hamann–Schlüter–Chiang (HSC) and Troullier–Martins (TM)
schemes are standard constructions.

NCPPs typically require $E_{\rm cut} \sim 60$–$100$ Ry and are used in codes such as Quantum
ESPRESSO and ABINIT.

### Ultrasoft Pseudopotentials (USPP) and PAW

The **ultrasoft pseudopotential** (Vanderbilt, 1990) relaxes the norm-conservation condition,
allowing smoother pseudo-wavefunctions with much lower $E_{\rm cut}$ ($\sim 25$–$40$ Ry). The
missing norm is compensated by augmentation charges added to the density.

The **Projector Augmented Wave (PAW) method** (Blöchl, 1994) is the most rigorous and now most
widely used approach. PAW introduces a linear transformation $\hat{\mathcal{T}}$ between the
smooth pseudo-wavefunction $|\tilde{\phi}_i\rangle$ and the true all-electron wavefunction
$|\phi_i\rangle$:
\begin{equation}
    |\phi_i\rangle = \hat{\mathcal{T}}|\tilde{\phi}_i\rangle,
    \qquad
    \hat{\mathcal{T}} = 1 + \sum_a\sum_n\left(|\phi_n^a\rangle - |\tilde{\phi}_n^a\rangle\right)\langle \tilde{p}_n^a|,
\end{equation}
where $|\phi_n^a\rangle$ are partial waves centred on atom $a$ and $\langle\tilde{p}_n^a|$ are
projector functions. Key features:

- **Formally all-electron**: PAW recovers the full all-electron density in the augmentation
  spheres, giving access to core-level properties and accurate hyperfine parameters.
- **Plane-wave efficiency**: The smooth part $|\tilde{\phi}_i\rangle$ has a low $E_{\rm cut}$
  (similar to USPP), while the oscillatory core region is handled analytically.
- **No norm-conservation constraint**: Each angular momentum channel can be optimised
  independently.

PAW is the default in VASP and is available in Quantum ESPRESSO and ABINIT. It is the
recommended approach for most production calculations.

**Comparison:**

| Method | $E_{\rm cut}$ (typical) | Core accuracy | Cost | Default in |
|---|---|---|---|---|
| NCPP | High ($60$–$100$ Ry) | Good (outside $r_c$) | Moderate | QE, ABINIT |
| USPP | Low ($25$–$40$ Ry) | Good (valence) | Low | QE, CASTEP |
| PAW | Low–moderate | Excellent (AE inside sphere) | Low–moderate | VASP, QE |
| All-electron | Very high | Exact | High | FHI-aims, WIEN2k |

---

## Practical Convergence Protocol

A rigorous DFT calculation requires the following checks, performed in order:

1. **$E_{\rm cut}$ convergence**: Increase the plane-wave cutoff until the total energy changes
   by less than $1$–$2$ meV/atom. Use the converged cutoff for all subsequent calculations.

2. **$k$-mesh convergence**: Increase the Monkhorst–Pack grid density until the total energy and
   the quantity of interest (e.g. magnetic moment, band gap) are converged. Report the converged
   grid as $N_1 \times N_2 \times N_3$.

3. **Supercell size** (for defects, surfaces, molecules): Increase the cell size until the
   interaction between periodic images is negligible ($\Delta E < 1$ meV/defect).

4. **SCF convergence criterion**: Tighten the SCF energy tolerance to $\sim 10^{-6}$ eV for
   energy differences; $\sim 10^{-7}$ eV for forces or stress calculations.

5. **Structural convergence**: Relax ionic positions until forces are below $0.01$–$0.02$
   eV/Å; relax the cell until stresses are below $0.1$ kbar.

Failure to converge any one of these can produce errors that dwarf those from the choice of XC
functional. Convergence tests must be performed for each new system class; results from one
system cannot be assumed transferable.

---

## Outlook

With the KS equations specified, the XC functional chosen, and the basis and pseudopotential
converged, we have all the ingredients for a standard spin-unpolarised DFT calculation. The next
chapter extends the framework to **spin-polarised** systems, which are essential for magnetic
materials and the study of exchange coupling in Heusler alloys and related compounds.
