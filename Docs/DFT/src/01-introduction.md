# Introduction

The density functional theory (DFT) has established itself as the primary tool to calculate the
electronic structure of materials.

At its heart, the method reformulates the many-electron problem as a variational problem over
the **electron density** \\(\rho(\mathbf{r})\\) — a function of three spatial coordinates — rather
than the many-body wavefunction \\(\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_N)\\), which lives in
\\(3N\\) dimensions. This chapter sets up the problem the way a student typically meets it:
starting from the Schrödinger equation, invoking the Born–Oppenheimer approximation, and then
working through the **Hartree** and **Hartree–Fock (HF)** mean-field approximations using the
**variational principle** as the central tool. By the end we will see exactly where these
methods succeed, where they fail, and why DFT — built on a different fundamental variable — is
the natural next step.

> **A note on units.** Sections 1.1–1.3 retain the explicit \\(\hbar^2/2m_e\\) and \\(e^2\\)
> factors familiar from undergraduate quantum mechanics. From Chapter 3 onward we switch to
> **Hartree atomic units** (\\(\hbar = m_e = e = 4\pi\varepsilon_0 = 1\\)), in which
> \\(-\tfrac{\hbar^2}{2m_e}\nabla^2 \to -\tfrac{1}{2}\nabla^2\\) and the Coulomb repulsion is
> simply \\(1/|\mathbf{r}_i - \mathbf{r}_j|\\). Conversions: \\(1\,\mathrm{Ha} = 27.2114\,\mathrm{eV}
> = 2\,\mathrm{Ry}\\); \\(1\,\mathrm{bohr} = 0.52918\,\text{Å}\\).

## Schrödinger's Equation: Revisited for Many-Particle Systems

The Schrödinger equation is the governing equation for quantum mechanical systems:

\\[
\left[-\frac{\hbar^2}{2m_e}\nabla^2+V(\mathbf{r})\right]\Psi(\mathbf{r})=E\Psi(\mathbf{r})
\\]

The problem grows intractable when many particles are present. The many-body Hamiltonian for \\(N\\)
nuclei and \\(n\\) electrons is:

<div>
\begin{align*}
	\hat{H} =&-\frac{\hbar^2}{2m}\sum_{i}^n\nabla^2_i+ \frac{1}{2}\sum_{i\neq j}\frac{e^2}{|\mathbf{r}_i-\mathbf{r}_j|}       &
	\qquad \mbox{Electron} \newline
   & -\frac{\hbar^2}{2M_j}\sum_j^N\nabla^2_j + \frac{1}{2}\sum_{i\neq j}\frac{Z_iZ_j e^2}{|{R_i-R_j}|} & \mbox{Nuclei}\newline
   &  -\sum_{i,j}\frac{Z_j e^2}{|\mathbf{r}_i-\mathbf{R}_j|} & \mbox{Electron-Nucleus}
\end{align*}
</div>

The time-independent Hamiltonian \\(\hat{H}=H(p,q)\\) is a function of the generalised momenta and
coordinates \\((p,q)\\). Solving it becomes increasingly difficult for systems with more than one
electron.

Even for a simple atom like oxygen, with 8 electrons, and taking a coarse grid of just 10 points
in each spatial dimension, we need \\(10^{24}\\) data points. On modern computers, each real number
requires 64 bits of memory. To store the wavefunction of a single oxygen atom we would need
\\(64\times 10^{24}\\) bits \\(\approx 8\times 10^{24}\\) bytes \\(\approx 10^{17}\\) MB. (To appreciate how
large this is, consider that the age of the universe is roughly \\(4\times 10^{17}\\) seconds — the
numbers are comparable!)

So we need systematic approximations to solve the problem.

## Born–Oppenheimer Approximation

Because protons are roughly \\(10^3\\) times heavier than electrons, they move far more slowly under
the same force. This motivates the **Born–Oppenheimer (BO) approximation**: we freeze the
nuclear degrees of freedom and solve only for the electronic structure at fixed nuclear positions.

**Validity condition.** The BO approximation is justified when the electronic excitation energy \\(\hbar\omega_{\rm el}\\) greatly exceeds the nuclear vibrational energy \\(\hbar\omega_{\rm nuc}\\):

\\[
\omega_{\rm el} \gg \omega_{\rm nuc}, \qquad \frac{\omega_{\rm nuc}}{\omega_{\rm el}} \sim \left(\frac{m_e}{M}\right)^{1/2} \approx 10^{-2}.
\\]

This ratio is small for all atoms, which is why BO works so broadly. It breaks down near **conical intersections** — geometries where two electronic potential energy surfaces become degenerate — leading to non-adiabatic dynamics that are important in photochemistry and certain charge-transfer processes. These are beyond the scope of ground-state DFT.

Under this approximation:
- The nuclear kinetic energy term vanishes: \\(\frac{\hbar^2}{2M_j}\sum_j^N\nabla^2_j = 0\\).
- The nucleus–nucleus repulsion \\(\frac{1}{2}\sum_{i\neq j}\frac{Z_iZ_j e^2}{|{R_i-R_j}|}\\) becomes a
  constant that shifts the total energy but does not affect the electronic wavefunction.
- The electron–nucleus attraction \\(\sum_{i,j}\frac{Z_j e^2}{|\mathbf{r}_i-\mathbf{R}_j|}\\) depends
  only on the electronic coordinates \\(r\\) (nuclei are fixed parameters).

The resulting electronic Hamiltonian is:

<div>
\begin{align*}
    \hat{H}_e =&-\frac{\hbar^2}{2m_e}\sum_{i=1}^n\nabla^2_i & \mbox{Kinetic energy of electrons}\newline
    &+ \frac{1}{2}\sum_{i\neq j}\frac{e^2}{|\mathbf{r}_i-\mathbf{r}_j|} &\mbox{Electron--electron repulsion}\newline
   & +V_{\rm ext}(\mathbf{r}) & \mbox{Electron--nucleus attraction}
\end{align*}
</div>

The electron–electron repulsion term is still a many-body interaction — handling it requires
further approximation. Before tackling it, we need the central tool that powers every
approximation scheme we will meet: the **variational principle**.

## The Variational Principle

The variational principle is the workhorse of approximate quantum mechanics. Every method in
this chapter (Hartree, Hartree–Fock), the entire Kohn–Sham framework of Chapter 3, and the
proof of the Hohenberg–Kohn theorems in Chapter 2 all rest on it.

<div class="theorem">
For any normalised trial state \(|\tilde{\Psi}\rangle\) in the Hilbert space of the system,
the expectation value of the Hamiltonian is an upper bound on the ground-state energy:

\\[
    E_0 \leq \langle\tilde{\Psi}|\hat{H}|\tilde{\Psi}\rangle,
\\]

with equality if and only if \\(|\tilde{\Psi}\rangle = |\Psi_0\rangle\\), the true ground state.
</div>

#### Proof (by completeness)

<div class="proof">

Expand the trial state in the complete orthonormal set of energy eigenstates
\\(\{|\Psi_n\rangle\}\\) of \\(\hat{H}\\) with eigenvalues \\(E_n\\) (ordered \\(E_0 \leq E_1 \leq E_2 \leq \cdots\\)):

\\[
    |\tilde{\Psi}\rangle = \sum_n c_n |\Psi_n\rangle, \qquad \sum_n |c_n|^2 = 1.
\\]

Then:

\\[
    \langle\tilde{\Psi}|\hat{H}|\tilde{\Psi}\rangle
    = \sum_n |c_n|^2 E_n
    \geq \sum_n |c_n|^2 E_0
    = E_0.
\\]

Equality holds only when \\(c_n = 0\\) for all \\(n\\) with \\(E_n > E_0\\), i.e. when
\\(|\tilde\Psi\rangle\\) is the (possibly degenerate) ground state. \\(\blacksquare\\)

</div>

**Strategy.** Choose a *parametrised* family of trial states \\(|\tilde{\Psi}_\alpha\rangle\\)
depending on one or more parameters \\(\alpha\\), compute
\\(E(\alpha) = \langle\tilde{\Psi}_\alpha|\hat{H}|\tilde{\Psi}_\alpha\rangle\\), and minimise
over \\(\alpha\\). The result is the best estimate of \\(E_0\\) accessible within the chosen family.
The narrower the family, the looser the bound; the richer the family, the closer to \\(E_0\\) — at
greater computational cost.

### Worked Example: Hydrogen Atom with a Gaussian Trial Wavefunction

The hydrogen atom is the natural test case because the exact answer is known
(\\(E_0^{\rm exact} = -\tfrac{1}{2}\,\mathrm{Ha} = -13.606\,\mathrm{eV}\\), with ground state
\\(\psi_0(r) = \pi^{-1/2}e^{-r}\\) in atomic units). The exact ground state is exponential, not
Gaussian, so a Gaussian trial wavefunction cannot reach \\(E_0\\) exactly — making it a clean
example of how the variational principle bounds without saturating.

Take the **normalised Gaussian** trial wavefunction in atomic units:

\\[
    \tilde{\psi}_\alpha(\mathbf{r}) = \left(\frac{2\alpha}{\pi}\right)^{3/4} e^{-\alpha r^2},
    \qquad \alpha > 0,
\\]

with \\(\alpha\\) the width parameter. The hydrogen-atom Hamiltonian (atomic units, \\(Z=1\\)) is
\\(\hat{H} = -\tfrac{1}{2}\nabla^2 - 1/r\\).

**Kinetic energy.** Using \\(\langle\hat{T}\rangle = \tfrac{1}{2}\int|\nabla\tilde\psi|^2\,d\mathbf{r}\\)
and the standard Gaussian integral:

\\[
    \langle\hat{T}\rangle_\alpha = \frac{3\alpha}{2}.
\\]

**Potential energy.** Performing the angular integration and using
\\(\int_0^\infty r\,e^{-2\alpha r^2}\,dr = 1/(4\alpha)\\):

\\[
    \langle\hat{V}\rangle_\alpha = -\left(\frac{2\alpha}{\pi}\right)^{3/2}\!
    \int e^{-2\alpha r^2}\,\frac{1}{r}\,d\mathbf{r}
    = -2\sqrt{\frac{2\alpha}{\pi}}.
\\]

**Total energy.**

\\[
    E(\alpha) = \frac{3\alpha}{2} - 2\sqrt{\frac{2\alpha}{\pi}}.
\\]

**Minimisation.** Setting \\(dE/d\alpha = 0\\):

\\[
    \frac{3}{2} - \sqrt{\frac{2}{\pi}}\cdot\frac{1}{\sqrt{\alpha}} = 0
    \quad\Longrightarrow\quad
    \alpha_{\rm opt} = \frac{8}{9\pi} \approx 0.2829.
\\]

Substituting back:

\\[
    E_{\rm var} = E(\alpha_{\rm opt}) = -\frac{4}{3\pi}\,\mathrm{Ha} \approx -0.4244\,\mathrm{Ha} \approx -11.5\,\mathrm{eV}.
\\]

Compare with the exact \\(E_0 = -0.5\,\mathrm{Ha} = -13.6\,\mathrm{eV}\\): the Gaussian trial gives
a variational bound \\(E_{\rm var} > E_0\\), with an error of \\(\sim 15\%\\). The bound is loose
because the Gaussian lacks the cusp at \\(r=0\\) and the exponential tail of the exact eigenstate
— but the principle worked: minimising the energy expectation value over a parameter family
produces the best estimate within that family.

> This is precisely how every method below works. The Hartree approximation restricts the
> trial wavefunction to a product of single-particle orbitals; Hartree–Fock restricts it to a
> Slater determinant; Kohn–Sham DFT (Chapter 3) restricts the search to densities representable
> by a non-interacting reference system. Each is a variational approximation over a different
> restricted class — and the rigour of the bound \\(E_0 \leq \langle\tilde\Psi|\hat{H}|\tilde\Psi\rangle\\) is what guarantees the methods are systematically improvable.

## Mean-Field Approximations

### Hartree Approximation

After invoking the Born–Oppenheimer approximation, the remaining challenge is the electron–electron
repulsion \\(\frac{1}{2}\sum_{i\neq j}\frac{e^2}{|\mathbf{r}_i-\mathbf{r}_j|}\\). The simplest
treatment sets this to zero (non-interacting electrons), but this gives grossly incorrect results
for most properties.

A better strategy is to assume that each electron does not interact with individual others, but
instead moves in the **mean (average) field** generated by all the other electrons combined. This
is the **Hartree approximation**, and it is variational: we restrict the trial wavefunction to a
simple product of single-particle orbitals,

\\[
    \tilde\Psi_{\rm H}(\mathbf{r}_1,\ldots,\mathbf{r}_N) = \phi_1(\mathbf{r}_1)\phi_2(\mathbf{r}_2)\cdots\phi_N(\mathbf{r}_N),
\\]

and minimise \\(\langle\tilde\Psi_{\rm H}|\hat{H}|\tilde\Psi_{\rm H}\rangle\\) with respect to each
orbital \\(\phi_i\\) subject to the normalisation constraint \\(\langle\phi_i|\phi_i\rangle = 1\\).

The electron–electron repulsion felt by electron \\(i\\) is replaced by the electrostatic potential
of the continuous charge density \\(\rho(\mathbf{r}')\\) of all other electrons:

<div>
\begin{align*}
\frac{1}{2}\sum_{i\neq j}\frac{e^2}{|\mathbf{r}_i-\mathbf{r}_j|}
&\approx \int \frac{e^2\,\rho(\mathbf{r}')}{|\mathbf{r}_i-\mathbf{r}'|}\,d\mathbf{r}' \equiv V_{\rm H}(\mathbf{r}_i), \\
E_{\rm H}[\rho] &= \frac{1}{2}\iint\frac{e^2\,\rho(\mathbf{r})\rho(\mathbf{r}')}{|\mathbf{r}-\mathbf{r}'|}\,d\mathbf{r}\,d\mathbf{r}'.
\end{align*}
</div>

where \\(\rho(\mathbf{r}') = \sum_j |\phi_j(\mathbf{r}')|^2\\) is the electron number density. The
quantity \\(E_{\rm H}[\rho]\\) is the **Hartree energy** — the classical electrostatic self-energy
of the charge distribution. The corresponding single-electron potential \\(V_{\rm H}(\mathbf{r}_i)\\) enters the effective single-particle Hamiltonian.

The full Hartree Hamiltonian then reads:

<div>
\begin{equation*}
\hat{H}_{\rm Hartree} = -\frac{\hbar^2}{2m_e}\sum_{i=1}^n\nabla^2_i + \sum_i V_{\rm H}(\mathbf{r}_i) + V_{\rm ext}(\mathbf{r}).
\end{equation*}
</div>

The Hartree approximation has two glaring deficiencies. First, the product wavefunction is not
antisymmetric, so it violates the Pauli principle. Second, the Hartree potential includes the
electron's own contribution to \\(\rho\\) — a **self-interaction** error. Both are fixed (the
first exactly, the second only partially) by Hartree–Fock.

### Hartree–Fock Approximation

The Hartree approximation is incomplete because it ignores the fact that electrons are
**fermions**: identical spin-\\(\tfrac{1}{2}\\) particles that obey the **Pauli exclusion
principle**, which requires the many-body wavefunction to be antisymmetric under the exchange
of any two electrons.

Fock incorporated this antisymmetry into the Hartree scheme, yielding the **Hartree–Fock (HF)**
approximation. The variational ansatz is broadened from a product to a **Slater determinant**,
which automatically satisfies antisymmetry:

\\[
\Psi_{\rm HF}(\mathbf{x}_1,\mathbf{x}_2,\ldots,\mathbf{x}_N)= \frac{1}{\sqrt{N!}}\begin{vmatrix}
\psi_1(\mathbf{x}_1) &\cdots &\psi_1(\mathbf{x}_N)\\\\
\vdots & \ddots & \vdots\\\\
\psi_N(\mathbf{x}_1) &\cdots &\psi_N(\mathbf{x}_N)\\\\
\end{vmatrix}
\\]

where \\(\mathbf{x}_i = (\mathbf{r}_i, s_i)\\) combines spatial and spin coordinates and the
\\(\psi_i\\) are orthonormal **spin orbitals**. Swapping any two columns (i.e. exchanging two
electrons) changes the sign of the determinant, ensuring the required antisymmetry.

Evaluating \\(\langle\Psi\_{\rm HF}|\hat{H}_e|\Psi\_{\rm HF}\rangle\\) using the Slater determinant
gives the **Hartree–Fock energy functional**:

<div>
\begin{align}
E_{\rm HF} =&
\sum_i \langle\psi_i|\hat{h}_0|\psi_i\rangle
+ \frac{1}{2}\sum_{i,j}\left[J_{ij} - K_{ij}\right], \\
\hat{h}_0 =& -\frac{\hbar^2}{2m_e}\nabla^2 + V_{\rm ext},
\end{align}
</div>

where \\(\hat{h}_0\\) is the one-electron core Hamiltonian and the two-electron integrals are:

<div>
\begin{align}
J_{ij} =& \iint \frac{e^2\,|\psi_i(\mathbf{x})|^2\,|\psi_j(\mathbf{x}')|^2}{|\mathbf{r}-\mathbf{r}'|}\,d\mathbf{x}\,d\mathbf{x}',
&&\text{Coulomb integral} \\
K_{ij} =& \iint \frac{e^2\,\psi_i^*(\mathbf{x})\psi_j^*(\mathbf{x}')\psi_j(\mathbf{x})\psi_i(\mathbf{x}')}{|\mathbf{r}-\mathbf{r}'|}\,d\mathbf{x}\,d\mathbf{x}'.
&&\text{Exchange integral} \label{eq:Kij}
\end{align}
</div>

The integral \\(K_{ij}\\) — the **exchange integral** — has no classical analogue. It arises from
the antisymmetry of the determinant: when two electrons of the same spin "exchange" their labels,
the resulting cross-term in \\(|\Psi_{\rm HF}|^2\\) lowers the energy by keeping same-spin electrons
spatially separated. \\(K_{ij}\\) vanishes when spin orbitals \\(\psi_i\\) and \\(\psi_j\\) have opposite
spins. We will encounter \\(K_{ij}\\) again in Chapter 4 as the **exact exchange** term that hybrid
DFT functionals add back into the energy.

Applying the variational principle (minimise \\(E_{\rm HF}\\) over the orbitals subject to
orthonormality \\(\langle\psi_i|\psi_j\rangle = \delta_{ij}\\)) yields the **canonical
Hartree–Fock equations**:

<div>
\begin{equation}
    \hat{F}\psi_i(\mathbf{x}) = \epsilon_i\,\psi_i(\mathbf{x}),
\label{eq:HF}
\end{equation}
</div>

where the **Fock operator** is:

\\[
    \hat{F} = \hat{h}_0 + \sum_j\left[\hat{J}_j - \hat{K}_j\right],
\\]

with the Coulomb operator \\(\hat{J}_j\psi_i = \left(\int |\psi_j(\mathbf{x}')|^2/|\mathbf{r}-\mathbf{r}'|\,d\mathbf{x}'\right)\psi_i\\) and the exchange operator
\\(\hat{K}_j\psi_i = \left(\int \psi_j^*(\mathbf{x}')\psi_i(\mathbf{x}')/|\mathbf{r}-\mathbf{r}'|\,d\mathbf{x}'\right)\psi_j\\). The exchange operator is **non-local**: it mixes the values of
\\(\psi_i\\) at different points through \\(\psi_j\\), in contrast to the local multiplicative Coulomb
operator \\(\hat{J}_j\\). This non-locality is what makes evaluating exact exchange computationally
expensive — a recurring issue in Chapter 4.

The HF equations are non-linear (each \\(\hat{F}\\) depends on the \\(\psi_j\\) it produces) and must
be solved self-consistently, anticipating the SCF loop structure we will see for the Kohn–Sham
equations in Chapter 3.

**What HF captures and what it misses.** HF includes exchange exactly (by construction) and
treats kinetic energy exactly within the single-determinant ansatz. It does **not** capture
electron **correlation** — the part of the interaction missed when the wavefunction is restricted
to a single Slater determinant. Correlation energy is defined as:

\\[
    E_{\rm corr} \equiv E_{\rm exact} - E_{\rm HF},
\\]

and \\(E_{\rm corr} < 0\\) (HF is an upper bound by the variational principle). Although small in
absolute terms (\\(\sim 1\\)–\\(2\\) eV for typical molecules), correlation is precisely the scale of
chemical bond energies, so a quantitative theory must include it. Capturing correlation cheaply
is the central motivation for DFT and its exchange-correlation functional \\(E_{\rm xc}\\).

### Worked Example: The Helium Atom

The helium atom (two electrons, nucleus with charge \\(Z = 2\\)) is the simplest system where
electron–electron interaction matters. We work it through in detail because the variational
treatment reveals both the power and the limitation of mean-field methods, and the gap to
experiment is exactly the correlation energy that DFT will need to recover.

In atomic units the Hamiltonian is:

\\[
    \hat{H} = -\frac{1}{2}(\nabla_1^2 + \nabla_2^2) - \frac{Z}{r_1} - \frac{Z}{r_2} + \frac{1}{|\mathbf{r}_1 - \mathbf{r}_2|}.
\\]

**Trial wavefunction.** Take both electrons in a \\(1s\\)-type orbital with effective nuclear charge
\\(\alpha\\) (rather than \\(Z = 2\\)) — the parameter that captures *screening*: each electron sees a
nucleus partially shielded by the other. Spin-singlet, so the spatial part is symmetric:

\\[
    \tilde\Psi(\mathbf{r}_1,\mathbf{r}_2) = \phi_\alpha(r_1)\phi_\alpha(r_2),
    \qquad
    \phi_\alpha(r) = \left(\frac{\alpha^3}{\pi}\right)^{1/2}e^{-\alpha r}.
\\]

This is a product wavefunction (Hartree-style); the singlet spin state makes it equivalent to a
properly antisymmetrised closed-shell Slater determinant for this two-electron system.

**Kinetic energy.** Each electron contributes \\(\langle -\tfrac{1}{2}\nabla^2\rangle_\phi = \alpha^2/2\\)
(standard hydrogenic result), so:

\\[
    \langle T\rangle = \alpha^2.
\\]

**Electron–nucleus attraction.** Each electron contributes \\(\langle -Z/r\rangle_\phi = -Z\alpha\\):

\\[
    \langle V_{en}\rangle = -2Z\alpha.
\\]

**Electron–electron repulsion.** This is the non-trivial integral:

\\[
    \langle V_{ee}\rangle = \iint \frac{|\phi_\alpha(r_1)|^2 |\phi_\alpha(r_2)|^2}{|\mathbf{r}_1-\mathbf{r}_2|}\,d\mathbf{r}_1\,d\mathbf{r}_2.
\\]

Evaluating using the multipole expansion of \\(1/|\mathbf{r}_1-\mathbf{r}_2|\\) (only the \\(\ell = 0\\) term survives for spherical \\(\phi\\)) gives the classical result:

\\[
    \langle V_{ee}\rangle = \frac{5\alpha}{8}.
\\]

This is **the key integral**: it tells us how much energy two electrons in the same hydrogenic
orbital cost each other.

**Total energy.** Summing:

\\[
    E(\alpha) = \alpha^2 - 2Z\alpha + \frac{5\alpha}{8}.
\\]

**Minimisation.** Setting \\(dE/d\alpha = 0\\):

\\[
    2\alpha - 2Z + \frac{5}{8} = 0
    \quad\Longrightarrow\quad
    \boxed{\alpha_{\rm opt} = Z - \frac{5}{16}.}
\\]

For \\(Z = 2\\) (helium), \\(\alpha_{\rm opt} = 27/16 = 1.6875\\) — each electron effectively sees a
nuclear charge reduced from 2 to 1.6875, the **screening** by the other electron quantified.

Substituting back:

\\[
    E_{\rm var}(He) = -\left(Z - \frac{5}{16}\right)^2 = -\left(\frac{27}{16}\right)^2
    \approx -2.848\,\mathrm{Ha} \approx -77.49\,\mathrm{eV}.
\\]

**Comparison with experiment and full HF.**

| Method | Ground-state energy | Comment |
|---|---|---|
| Non-interacting (\\(\alpha = Z\\)) | \\(-2.750\,\mathrm{Ha} = -74.83\,\mathrm{eV}\\) | Ignores \\(V_{ee}\\) entirely |
| Hartree (product, no exchange) | \\(\sim -77.5\,\mathrm{eV}\\) | Mean-field, no Pauli |
| Variational (single-\\(\zeta\\), \\(\alpha\\) optimised) | \\(-77.49\,\mathrm{eV}\\) | The calculation above |
| Full HF (numerically exact orbital) | \\(-77.87\,\mathrm{eV}\\) | Best single-determinant |
| Experiment | \\(-79.01\,\mathrm{eV}\\) | True ground-state energy |

The **correlation energy** for helium is therefore:

\\[
    E_{\rm corr} = E_{\rm exact} - E_{\rm HF} \approx -1.14\,\mathrm{eV}.
\\]

Though small in absolute terms, this gap is the magnitude of typical chemical bond energies —
and it is precisely what was lost when we restricted the wavefunction to a *product* (or
single-determinant) form. The exact two-electron ground state has the electrons *correlated*:
when one is near the nucleus, the other tends to be on the opposite side, an angular correlation
no product wavefunction can capture. Recovering this correlation energy cheaply — without
returning to the full \\(3N\\)-dimensional wavefunction — is the entire motivation for DFT.

## Thomas–Fermi: The First Density Functional

Before Kohn and Sham, a natural question had already been asked: *can we write the entire
energy as a functional of \\(\rho(\mathbf{r})\\) alone, with no reference to orbitals?* The
**Thomas–Fermi (TF) model** (Thomas 1927; Fermi 1928) attempts exactly this, and although it
fails quantitatively, the failure is instructive — it tells us precisely what the Kohn–Sham
construction of Chapter 3 must restore.

The TF idea is to use the **uniform electron gas (UEG)** kinetic energy as a local functional
of the density. For a UEG of density \\(\rho\\), the kinetic energy per unit volume is
(derivation deferred to Chapter 4):

\\[
    t^{\rm UEG}(\rho) = \frac{3}{10}(3\pi^2)^{2/3}\,\rho^{5/3}.
\\]

The TF ansatz applies this *locally*:

<div>
\begin{equation}
    T^{\rm TF}[\rho] = \frac{3}{10}(3\pi^2)^{2/3}\int \rho(\mathbf{r})^{5/3}\,d\mathbf{r}.
\label{eq:TFkin}
\end{equation}
</div>

Combined with the classical Hartree energy and the external potential interaction, the TF total
energy functional is:

\\[
    E^{\rm TF}[\rho] = T^{\rm TF}[\rho] + \int V_{\rm ext}\rho\,d\mathbf{r} + E_{\rm H}[\rho].
\\]

Minimising with respect to \\(\rho\\) subject to \\(\int\rho\,d\mathbf{r} = N\\) yields the
**Thomas–Fermi equation**:

\\[
    \frac{5}{3}\cdot\frac{3}{10}(3\pi^2)^{2/3}\rho^{2/3}(\mathbf{r}) + V_{\rm ext}(\mathbf{r}) + V_{\rm H}(\mathbf{r}) = \mu,
\\]

where \\(\mu\\) is the chemical potential (Lagrange multiplier). This is a *self-consistent
equation for the density alone* — no orbitals, no wavefunctions, no \\(3N\\)-dimensional object.

**Why it fails.** The TF model is qualitatively wrong about several things:

1. **No binding.** Teller (1962) proved that TF theory cannot describe molecular binding: the
   energy of a molecule is always greater than the sum of its atomic constituents. This is a
   theorem, not a numerical artifact.
2. **Wrong asymptotic behaviour.** The TF density decays as \\(r^{-6}\\) at large distances rather
   than exponentially as required for bound states.
3. **No shell structure.** The TF density is smooth and structureless; it does not show the
   atomic shell oscillations seen in Hartree–Fock calculations or experiment.
4. **Kinetic energy errors of \\(\sim 10\%\\).** Even with the Dirac exchange correction added
   (TF+D, also called Thomas–Fermi–Dirac), atomic energies are off by tens of eV.

The root cause is the kinetic energy \eqref{eq:TFkin}. The UEG-based local form is fine for
slowly varying densities, but real atomic and molecular densities vary rapidly — there is no
length scale on which a UEG is a good local approximation. The shell structure, the cusps at
nuclei, and the exponential tails are all features that a *local* kinetic energy functional
cannot reproduce.

**The lesson for DFT.** TF taught us two things:

- *Encoding all the physics in \\(\rho(\mathbf{r})\\) alone is in principle possible* — this is
  what the Hohenberg–Kohn theorems (Chapter 2) will prove rigorously, three decades after TF.
- *Writing the kinetic energy as an explicit functional of \\(\rho\\) is hard.* Any local
  approximation misses essential physics.

The Kohn–Sham scheme of Chapter 3 sidesteps the second problem with a single elegant trick:
*reintroduce orbitals*, but only enough to compute the kinetic energy of a fictitious
non-interacting reference system exactly. Everything else — the corrections that distinguish
the real interacting system from the fictitious one — is packaged into the
exchange-correlation functional \\(E_{\rm xc}[\rho]\\), which is small enough that even crude
approximations work reasonably well.

## The Path to DFT

We can now state the situation precisely. The methods of this chapter have given us a hierarchy
of approximations to the many-electron problem, each anchored by the variational principle:

| Method | Trial wavefunction | Variables | Captures | Misses |
|---|---|---|---|---|
| Hartree | Product \\(\phi_1\cdots\phi_N\\) | \\(N\\) orbitals | Mean field | Exchange, correlation, antisymmetry |
| Hartree–Fock | Single Slater determinant | \\(N\\) orbitals | + Exchange, antisymmetry | Correlation |
| Thomas–Fermi | Density only | \\(\rho(\mathbf{r})\\) | Variational over density | Kinetic energy, shell structure |
| Full CI / exact | All determinants | \\(3N\\)-dim. \\(\Psi\\) | Everything | (Intractable) |

The trade-off is stark. Hartree–Fock scales as \\(\mathcal{O}(N^4)\\) and captures exchange exactly
but misses correlation. The exact many-body wavefunction lives in \\(3N\\) dimensions and is
intractable for any \\(N > 10\\) or so. Thomas–Fermi reduces the problem to a function of three
variables but loses essential physics in the kinetic energy.

What if we could **change the fundamental variable**? Instead of the wavefunction
\\(\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_N)\\) — a function in \\(3N\\) dimensions — what if the
ground-state energy is *exactly* a functional of the **electron density**
\\(\rho(\mathbf{r})\\) alone, a function in only three dimensions?

This is not a vague aspiration. The **Hohenberg–Kohn theorems** of Chapter 2 prove it
rigorously: every ground-state property of an interacting many-electron system in any external
potential is uniquely determined by its ground-state density \\(\rho_0(\mathbf{r})\\). The
many-body wavefunction is a *functional* of the density, \\(\Psi_0 = \Psi[\rho_0]\\), and so is
the energy:

\\[
    E_0 = E[\rho_0] = \min_\rho E[\rho].
\\]

The minimisation is over densities — a function of three variables — not over wavefunctions
in \\(3N\\) dimensions. This is the promise of DFT: combine the rigour of the variational
principle with the computational tractability of the Thomas–Fermi reduction, while avoiding
TF's pitfalls.

The two theorems of Chapter 2 establish this rigorously. The Kohn–Sham construction of Chapter 3
turns the theorems into an actual computational method by reintroducing orbitals just for the
kinetic energy — solving Thomas–Fermi's worst problem — and packaging everything else into a
small correction term \\(E_{\rm xc}[\rho]\\) that we will spend Chapter 4 learning to approximate.
