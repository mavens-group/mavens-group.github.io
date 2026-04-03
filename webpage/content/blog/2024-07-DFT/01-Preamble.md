---
title: Notations Used
date: '2025-06-01'
type: book
weight: 01
summary: Notation, conventions, atomic units, and symbol table
---
<!--more-->

This page establishes the notation, units, and conventions used throughout the course. It is
intended as a standing reference: every symbol defined here retains its meaning in all subsequent
chapters unless explicitly redefined in context.

---

## Atomic Units

All equations in this course are written in **atomic units (a.u.)** from Chapter 3 onward, unless
stated otherwise. The atomic unit system sets:

{{< math >}}
$$
\hbar = m_e = e = 4\pi\varepsilon_0 = 1,
$$
{{< /math >}}

where $\hbar$ is the reduced Planck constant, $m_e$ the electron rest mass, $e$ the elementary
charge, and $\varepsilon_0$ the permittivity of free space. The derived units are:

| Quantity | Atomic unit | SI value |
|---|---|---|
| Length | Bohr $a_0$ | $0.52918$ Å |
| Energy | Hartree $E_h$ | $27.211$ eV $= 2$ Ry |
| Mass | Electron mass $m_e$ | $9.109\times10^{-31}$ kg |
| Charge | Elementary charge $e$ | $1.602\times10^{-19}$ C |
| Time | $\hbar/E_h$ | $24.19$ as |
| Velocity | $a_0 E_h/\hbar$ | $2.187\times10^6$ m/s |

**Practical conversions for common codes:**

- VASP quotes energies in eV and plane-wave cutoffs in eV.
- Quantum ESPRESSO quotes energies in Ry and cutoffs in Ry.
- 1 Hartree = 2 Ry = 27.211 eV; 1 Bohr = 0.52918 Å.

In atomic units the kinetic energy operator is $-\frac{1}{2}\nabla^2$ (not
$-\frac{\hbar^2}{2m_e}\nabla^2$), the Coulomb potential between charges $q_1$ and $q_2$ at
separation $r$ is $q_1 q_2/r$ (not $q_1 q_2/4\pi\varepsilon_0 r$), and the Bohr magneton is
$\mu_B = e\hbar/2m_e = 1/2$ a.u.

Chapter 1 retains $\hbar$ and $m_e$ explicitly in some equations so that connections to standard
quantum mechanics textbooks remain transparent. From Chapter 3 onward the atomic unit form is
used without further comment.

---

## Mathematical Notation

### Operators and Wavefunctions

| Symbol | Meaning |
|---|---|
| $\hat{H}$ | Many-body electronic Hamiltonian |
| $\hat{T}$ | Many-body kinetic energy operator |
| $\hat{T}_s$ | Non-interacting (KS) kinetic energy operator |
| $\hat{V}_{ee}$ | Bare electron–electron Coulomb repulsion operator |
| $\hat{V}_{\rm ext}$ | External potential operator (nuclei + applied fields) |
| $\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_N)$ | Many-body electronic wavefunction |
| $\Psi^\lambda$ | Ground-state wavefunction at coupling strength $\lambda$ |
| $\phi_i(\mathbf{r})$ | $i$-th Kohn–Sham single-particle orbital |
| $\tilde\phi_i(\mathbf{r})$ | PAW pseudo (smooth) orbital |
| $\phi_n^a(\mathbf{r})$ | PAW all-electron partial wave on atom $a$ |
| $\epsilon_i$ | $i$-th Kohn–Sham eigenvalue (Lagrange multiplier) |
| $f_i$ | Occupation number of orbital $i$ ($0 \leq f_i \leq 1$) |

### Densities and Potentials

| Symbol | Meaning |
|---|---|
| $\rho(\mathbf{r})$ | Electron number density; $\int\rho\,d\mathbf{r} = N$ |
| $\rho_\sigma(\mathbf{r})$ | Spin-resolved density, $\sigma \in \{\uparrow,\downarrow\}$ |
| $m(\mathbf{r})$ | Magnetisation density $= \rho_\uparrow - \rho_\downarrow$ |
| $n_{\rm xc}(\mathbf{r},\mathbf{r}')$ | Exchange-correlation hole |
| $V_{\rm ext}(\mathbf{r})$ | External scalar potential |
| $V_{\rm H}(\mathbf{r})$ | Hartree potential $= \int\rho(\mathbf{r}')/\|\mathbf{r}-\mathbf{r}'\|\,d\mathbf{r}'$ |
| $V_{\rm xc}(\mathbf{r})$ | Exchange-correlation potential $= \delta E_{\rm xc}/\delta\rho$ |
| $V_{\rm eff}(\mathbf{r})$ | KS effective potential $= V_{\rm ext} + V_{\rm H} + V_{\rm xc}$ |
| $\mathbf{B}_{\rm xc}(\mathbf{r})$ | XC magnetic field (non-collinear SDFT) |

**Important distinction:** $\hat{V}_{ee}$ is the bare quantum-mechanical electron–electron
repulsion in the many-body Hamiltonian. The **Hartree energy** $E_{\rm H}[\rho]$ and its
potential $V_{\rm H}(\mathbf{r})$ are the *classical* electrostatic self-energy of the continuous
charge density $\rho(\mathbf{r})$; they approximate but are not equal to $\langle\hat{V}_{ee}\rangle$.
The difference is captured by $E_{\rm xc}$.

### Energy Functionals

| Symbol | Meaning |
|---|---|
| $E[\rho]$ | Total ground-state energy functional |
| $F[\rho]$ | Universal functional $= \langle\Psi[\rho]\|\hat{T}+\hat{V}_{ee}\|\Psi[\rho]\rangle$ |
| $T[\rho]$ | True (interacting) kinetic energy functional |
| $T_s[\rho]$ | Non-interacting KS kinetic energy $= -\frac{1}{2}\sum_i\langle\phi_i\|\nabla^2\|\phi_i\rangle$ |
| $E_{\rm H}[\rho]$ | Hartree energy $= \frac{1}{2}\iint\rho(\mathbf{r})\rho(\mathbf{r}')/\|\mathbf{r}-\mathbf{r}'\|\,d\mathbf{r}\,d\mathbf{r}'$ |
| $E_{\rm xc}[\rho]$ | Exchange-correlation energy (see Chapter 4) |
| $E_{\rm x}^{\rm exact}$ | Exact (Fock) exchange energy $= W_{\rm xc}^{\lambda=0}$ |
| $E_{\rm c}^{\rm GL2}$ | Second-order Görling–Levy correlation energy |
| $W_{\rm xc}^\lambda$ | Adiabatic connection integrand at coupling $\lambda$ |

### XC Functional Ingredients

| Symbol | Meaning |
|---|---|
| $\varepsilon_{\rm xc}(\rho)$ | XC energy per electron of the uniform electron gas |
| $s(\mathbf{r})$ | Reduced density gradient $= \|\nabla\rho\|/(2k_F\rho)$ |
| $k_F(\mathbf{r})$ | Local Fermi wavevector $= (3\pi^2\rho)^{1/3}$ |
| $\tau(\mathbf{r})$ | KS kinetic energy density $= \frac{1}{2}\sum_i f_i\|\nabla\phi_i\|^2$ |
| $\tau^W(\mathbf{r})$ | von Weizsäcker KE density $= \|\nabla\rho\|^2/8\rho$ |
| $\tau^{\rm UEG}(\mathbf{r})$ | Thomas–Fermi KE density $= \frac{3}{10}(3\pi^2)^{2/3}\rho^{5/3}$ |
| $\alpha(\mathbf{r})$ | Iso-orbital indicator $= (\tau-\tau^W)/\tau^{\rm UEG}$ |
| $F_{\rm xc}(\rho,s)$ | GGA enhancement factor |
| $\lambda$ | Adiabatic connection coupling constant $\in [0,1]$ |
| $\omega$ | Range-separation parameter in hybrid functionals (Å$^{-1}$) |
| $a$ | Fraction of exact exchange in hybrid functionals |

### Solid-State and Basis-Set Notation

| Symbol | Meaning |
|---|---|
| $\mathbf{k}$ | Crystal momentum (Bloch wavevector) in the first BZ |
| $\mathbf{G}$ | Reciprocal lattice vector |
| $\Omega$ | Unit cell volume |
| $E_{\rm cut}$ | Plane-wave kinetic energy cutoff |
| $N_1\times N_2\times N_3$ | Monkhorst–Pack $k$-point mesh |
| $r_c^a$ | PAW augmentation sphere radius for atom $a$ |
| $\hat{\mathcal{T}}$ | PAW linear transformation operator |
| $\langle\tilde p_n^a|$ | PAW projector function |

### Spin and Magnetism

| Symbol | Meaning |
|---|---|
| $\sigma$ | Spin index, $\sigma \in \{\uparrow,\downarrow\}$ |
| $\zeta$ | Spin polarisation $= (\rho_\uparrow-\rho_\downarrow)/\rho \in [-1,1]$ |
| $\mu_B$ | Bohr magneton $= e\hbar/2m_e = 1/2$ a.u. |
| $\mathbf{m}(\mathbf{r})$ | Local magnetisation density vector (non-collinear) |
| $J_{ij}$ | Heisenberg exchange coupling constant between sites $i,j$ |
| $\hat{\mathbf{S}}_i$ | Spin operator on site $i$ |
| $\xi$ | Spin–orbit coupling constant |
| $\hat{\mathbf{L}}$, $\hat{\mathbf{S}}$ | Orbital and spin angular momentum operators |
| $\langle L_z\rangle$ | Expectation value of orbital moment along $z$ |
| MAE | Magnetic anisotropy energy $= E(\hat{\mathbf{n}}_{\rm hard}) - E(\hat{\mathbf{n}}_{\rm easy})$ |

### DFT+U Notation

| Symbol | Meaning |
|---|---|
| $n_{mm'}^{I\sigma}$ | Occupation matrix of the correlated subspace on site $I$, spin $\sigma$ |
| $N^{I\sigma}$ | Total occupation $= \mathrm{Tr}[\mathbf{n}^{I\sigma}]$ |
| $U$ | Average on-site Coulomb repulsion |
| $J$ | Average on-site exchange interaction |
| $U_{\rm eff}$ | Dudarev effective parameter $= U - J$ |
| $F^0, F^2, F^4$ | Slater integrals (radial Coulomb matrix elements) |
| $E_{\rm dc}$ | Double-counting correction |

---

## Dirac Notation

We use Dirac (bra-ket) notation throughout:

{{< math >}}
$$
\langle\phi_i|\hat{O}|\phi_j\rangle = \int \phi_i^*(\mathbf{r})\,\hat{O}\,\phi_j(\mathbf{r})\,d\mathbf{r}.
$$
{{< /math >}}

For the many-body wavefunction:

{{< math >}}
$$
\langle\Psi|\hat{H}|\Psi\rangle = \int \Psi^*(\mathbf{r}_1,\ldots,\mathbf{r}_N)\,\hat{H}\,\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_N)\,d\mathbf{r}_1\cdots d\mathbf{r}_N.
$$
{{< /math >}}

---

## Functional Derivatives

A **functional** $F[\rho]$ maps a function $\rho(\mathbf{r})$ to a scalar. Its **functional
derivative** $\delta F/\delta\rho(\mathbf{r})$ is defined by:

{{< math >}}
$$
F[\rho + \delta\rho] - F[\rho] = \int \frac{\delta F}{\delta\rho(\mathbf{r})}\,\delta\rho(\mathbf{r})\,d\mathbf{r} + \mathcal{O}(\delta\rho^2).
$$
{{< /math >}}

This generalises the ordinary derivative to function spaces. Key examples in this course:

{{< math >}}
$$
\frac{\delta E_{\rm H}[\rho]}{\delta\rho(\mathbf{r})} = V_{\rm H}(\mathbf{r}),
\qquad
\frac{\delta E_{\rm xc}[\rho]}{\delta\rho(\mathbf{r})} = V_{\rm xc}(\mathbf{r}).
$$
{{< /math >}}

---

## Index Conventions

- Lowercase Latin $i, j, k, \ldots$: electron or orbital indices.
- Lowercase Latin $a, b$: unoccupied (virtual) orbitals in perturbation theory contexts.
- Uppercase Latin $I, J$: atomic site indices.
- Lowercase Greek $\alpha, \beta$: nuclear site indices (Chapters 1–2); Cartesian tensor indices (Chapter 6 onward); context disambiguates.
- Uppercase Greek $\Omega$: unit cell volume.
- Lowercase Greek $\sigma$: spin index $\in\{\uparrow,\downarrow\}$; also used for stress tensor components — context disambiguates.
- Summation over repeated spin indices is not implied (explicit sums are always written).
- $\sum_i$ without explicit limits runs over all occupied KS orbitals unless otherwise stated.

---

## Abbreviations

| Abbreviation | Full term |
|---|---|
| DFT | Density Functional Theory |
| HK | Hohenberg–Kohn |
| KS | Kohn–Sham |
| SCF | Self-Consistent Field |
| XC | Exchange-Correlation |
| LDA | Local Density Approximation |
| LSDA | Local Spin-Density Approximation |
| GGA | Generalised Gradient Approximation |
| GEA | Gradient Expansion Approximation |
| UEG | Uniform Electron Gas |
| PAW | Projector Augmented Wave |
| PP | Pseudopotential |
| NCPP | Norm-Conserving Pseudopotential |
| USPP | Ultrasoft Pseudopotential |
| BZ | Brillouin Zone |
| MP | Monkhorst–Pack |
| SDFT | Spin-Polarised DFT |
| SOC | Spin–Orbit Coupling |
| MAE | Magnetic Anisotropy Energy |
| AIMD | Ab Initio Molecular Dynamics |
| BOMD | Born–Oppenheimer MD |
| CPMD | Car–Parrinello MD |
| BO | Born–Oppenheimer |
| HF | Hartree–Fock |
| SIE | Self-Interaction Error |
| GL | Görling–Levy |
| FLL | Fully Localised Limit (double-counting) |
| AMF | Around Mean Field (double-counting) |
| cRPA | Constrained Random Phase Approximation |
| DMFT | Dynamical Mean-Field Theory |
| NEB | Nudged Elastic Band |
| BFGS | Broyden–Fletcher–Goldfarb–Shanno |
| DIIS | Direct Inversion in the Iterative Subspace |

---

## A Note on Sign Conventions

Several sign conventions vary between texts and codes; we follow the most common physics convention throughout:

- **Exchange energy** $E_{\rm x} < 0$ always (exchange is stabilising).
- **Correlation energy** $E_{\rm c} < 0$ for the UEG (correlation is stabilising).
- **XC hole** $n_{\rm xc}(\mathbf{r},\mathbf{r}') \leq 0$ (depletion, not accumulation).
- **MAE** defined as $E_{\rm hard} - E_{\rm easy} > 0$: positive MAE means the hard axis costs more energy.
- **Heisenberg exchange** $J > 0$ favours ferromagnetic alignment; $J < 0$ favours antiferromagnetic. (Some texts use the opposite sign; we always state the convention explicitly when quoting numerical values.)
- **Hubbard $U$** is always positive (repulsive on-site interaction).
