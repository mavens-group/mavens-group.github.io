# Spin-Polarised DFT and Magnetism

The standard Kohn–Sham DFT developed in Chapter 3 treats electrons as spinless particles: the
density \\(\rho(\mathbf{r})\\) carries no spin label, and the KS equations yield doubly degenerate
orbital energies. This is adequate for non-magnetic systems, but fails entirely when the ground
state breaks time-reversal symmetry through a net electron spin polarisation.

To describe magnetic materials — from ferromagnetic iron to the half-metallic Heusler alloys and
antiferromagnetic insulators — we must extend DFT to **spin-polarised DFT (SDFT)**, and, for
materials with strong spin–orbit coupling, to the full non-collinear formalism. This chapter
develops the theoretical framework and connects it to the key observables: magnetic moments,
exchange coupling constants \\(J\\), and magnetic anisotropy energies (MAE).


## The Spin-Density Functional

### Collinear SDFT

In **collinear SDFT**, spins are quantised along a fixed axis (conventionally \\(z\\)). The
fundamental variable is replaced by the **spin-resolved density**:

\begin{equation}
    \rho\_\sigma(\mathbf{r}) = \sum\_{i} f\_{i\sigma}\,|\phi\_{i\sigma}(\mathbf{r})|^2, \qquad \sigma \in \{\uparrow, \downarrow\},
\end{equation}

where \\(f\_{i\sigma}\\) are the orbital occupation numbers and the sum runs over all KS orbitals of
spin \\(\sigma\\). The total and magnetisation densities are:

\begin{equation}
    \rho(\mathbf{r}) = \rho\_\uparrow(\mathbf{r}) + \rho\_\downarrow(\mathbf{r}),
    \qquad
    m(\mathbf{r}) = \rho\_\uparrow(\mathbf{r}) - \rho\_\downarrow(\mathbf{r}).
\end{equation}

The HK theorem is generalised to show that the ground state is uniquely determined by the pair
\\((\rho(\mathbf{r}), m(\mathbf{r}))\\), or equivalently by \\((\rho\_\uparrow, \rho\_\downarrow)\\).
The total energy functional becomes:

\begin{equation}
    E[\rho\_\uparrow, \rho\_\downarrow] = T\_s[\rho\_\uparrow, \rho\_\downarrow] + E\_{\rm H}[\rho] + E\_{\rm xc}[\rho\_\uparrow, \rho\_\downarrow] + \int V\_{\rm ext}(\mathbf{r})\,\rho(\mathbf{r})\,d\mathbf{r}.
\end{equation}

The two sets of spin-channel KS equations decouple:

\begin{equation}
    \left[-\frac{1}{2}\nabla^2 + V\_{\rm eff}^\sigma(\mathbf{r})\right]\phi\_{i\sigma}(\mathbf{r}) = \epsilon\_{i\sigma}\,\phi\_{i\sigma}(\mathbf{r}),
    \label{eq:SDFT-KS}
\end{equation}

with spin-dependent effective potentials:

\begin{equation}
    V\_{\rm eff}^\sigma(\mathbf{r}) = V\_{\rm ext}(\mathbf{r}) + V\_{\rm H}(\mathbf{r}) + V\_{\rm xc}^\sigma(\mathbf{r}),
    \qquad V\_{\rm xc}^\sigma = \frac{\delta E\_{\rm xc}}{\delta \rho\_\sigma(\mathbf{r})}.
\end{equation}

The Hartree potential \\(V\_{\rm H}\\) is spin-independent (it depends on the total \\(\rho\\)), while
\\(V\_{\rm xc}^\sigma\\) differs between spin channels, producing a **spin-splitting** of the
eigenvalues \\(\epsilon\_{i\uparrow} \neq \epsilon\_{i\downarrow}\\). This is the quantum-mechanical
origin of the **exchange splitting** that drives ferromagnetism.

### The Spin-Polarised XC Functional

The XC functional must be generalised to take both \\(\rho\_\uparrow\\) and \\(\rho\_\downarrow\\) as
arguments. For the LDA, the **local spin-density approximation (LSDA)** uses the XC energy of a
spin-polarised uniform electron gas:

\\[
E\_{\rm xc}^{\rm LSDA}[\rho\_\uparrow, \rho\_\downarrow] = \int \varepsilon\_{\rm xc}^{\rm UEG}(\rho\_\uparrow(\mathbf{r}), \rho\_\downarrow(\mathbf{r}))\,\rho(\mathbf{r})\,d\mathbf{r}.
\\]

**Derivation of the spin-scaling relation (von Barth–Hedin).** The key step is to express \\(\varepsilon\_{\rm xc}(\rho\_\uparrow, \rho\_\downarrow)\\) in terms of the unpolarised value \\(\varepsilon\_{\rm xc}(\rho, 0)\\) and the fully polarised value \\(\varepsilon\_{\rm xc}(\rho/2, \rho/2)\\). For exchange, the exact spin-scaling follows from the Dirac formula: a fully spin-up gas of density \\(\rho\\) has exchange energy \\(\varepsilon\_{\rm x}(\rho, 0) = \varepsilon\_{\rm x}^{\rm UEG}(\rho)\\), while a spin-up gas of density \\(\rho\_\uparrow\\) contributes \\(\varepsilon\_{\rm x}(\rho\_\uparrow)\cdot(\rho\_\uparrow/\rho)\\) per unit total density. Adding both spin channels:

\\[
\varepsilon\_{\rm x}(\rho\_\uparrow, \rho\_\downarrow) = \frac{1}{2}\left[\varepsilon\_{\rm x}^{\rm UEG}(2\rho\_\uparrow)\frac{\rho\_\uparrow}{\rho/2} + \varepsilon\_{\rm x}^{\rm UEG}(2\rho\_\downarrow)\frac{\rho\_\downarrow}{\rho/2}\right]\cdot\frac{1}{2}.
\\]

Since \\(\varepsilon\_{\rm x}^{\rm UEG}(\rho) \propto \rho^{1/3}\\), this simplifies to the exact spin-scaling relation \\(\varepsilon\_{\rm x}(\rho\_\uparrow,\rho\_\downarrow) = \frac{1}{2}[(1+\zeta)^{4/3}+(1-\zeta)^{4/3}]\,\varepsilon\_{\rm x}^{\rm UEG}(\rho)\\). For correlation, no exact spin-scaling exists; von Barth and Hedin (1972) proposed interpolating between the paramagnetic (\\(\zeta=0\\)) and ferromagnetic (\\(\zeta=1\\)) limits using a function \\(f(\zeta)\\) that satisfies \\(f(0)=0\\), \\(f(1)=1\\), and \\(f''(0) = 4/9\\) (from the perturbative UEG correlation):

\\[
\varepsilon\_{\rm xc}(\rho\_\uparrow, \rho\_\downarrow) = \varepsilon\_{\rm xc}(\rho, 0) + [\varepsilon\_{\rm xc}(\rho/2, \rho/2) - \varepsilon\_{\rm xc}(\rho, 0)]\,f(\zeta),
\\]

where \\(\zeta = (\rho\_\uparrow - \rho\_\downarrow)/\rho\\) is the spin polarisation and the standard choice is:

\\[
f(\zeta) = \frac{(1+\zeta)^{4/3} + (1-\zeta)^{4/3} - 2}{2(2^{1/3}-1)}.
\\]

This interpolation is exact for exchange and approximate for correlation; it reduces to the correct limits at \\(\zeta = 0\\) (paramagnetic UEG) and \\(\zeta = 1\\) (fully polarised UEG). GGA and meta-GGA functionals are extended analogously using the same spin-scaling for exchange and analogous interpolations for correlation.


## Magnetic Moments

The **local magnetic moment** on site \\(A\\) is:

\begin{equation}
    \mu\_A = \int\_{\Omega\_A} m(\mathbf{r})\,d\mathbf{r} = \int\_{\Omega\_A} [\rho\_\uparrow(\mathbf{r}) - \rho\_\downarrow(\mathbf{r})]\,d\mathbf{r},
\end{equation}

where \\(\Omega\_A\\) is the Wigner–Seitz (or PAW augmentation) sphere of atom \\(A\\). The total
magnetisation is:

\begin{equation}
    M = \int m(\mathbf{r})\,d\mathbf{r} = N\_\uparrow - N\_\downarrow,
\end{equation}

where \\(N\_\sigma = \int \rho\_\sigma\,d\mathbf{r}\\) is the total number of electrons of spin
\\(\sigma\\).

For elemental ferromagnets, SDFT recovers the experimental moments well: Fe (\\(2.2\,\mu\_B\\) exp.,
\\(2.1\\)–\\(2.3\,\mu\_B\\) DFT), Co (\\(1.7\,\mu\_B\\)), Ni (\\(0.6\,\mu\_B\\)). Orbital contributions (from
spin–orbit coupling) are not included at the collinear SDFT level.


## Magnetic Ordering: Ferro-, Antiferro-, and Ferrimagnetic States

By setting up different initial spin configurations in the SCF cycle, collinear SDFT can target
different magnetic orderings:

- **Ferromagnetic (FM)**: all local moments aligned parallel, \\(M \neq 0\\).
- **Antiferromagnetic (AFM)**: moments on sublattices aligned antiparallel, \\(M = 0\\) globally.
  Requires a supercell large enough to contain both sublattices.
- **Ferrimagnetic (FiM)**: unequal antiparallel moments on distinct sublattices, \\(M \neq 0\\).
  Common in half-Heusler and spinel compounds.

To determine which ordering is the ground state, compute the total energy for each configuration
and compare: \\(\Delta E = E\_{\rm AFM} - E\_{\rm FM}\\).


## Exchange Coupling: The Heisenberg Model

The energy difference between magnetic configurations can be mapped onto the **Heisenberg spin
Hamiltonian**:

\begin{equation}
    \hat{\mathcal{H}}\_{\rm Heis} = -\sum\_{\langle i,j\rangle} J\_{ij}\,\hat{\mathbf{S}}\_i \cdot \hat{\mathbf{S}}\_j,
\end{equation}

where \\(\hat{\mathbf{S}}\_i\\) is the spin operator on site \\(i\\) and \\(J\_{ij}\\) is the **exchange
coupling constant** between sites \\(i\\) and \\(j\\). The sign convention: \\(J > 0\\) favours FM
alignment; \\(J \lt 0\\) favours AFM.

### Extraction of \\(J\\) from Total Energies

For a two-sublattice system with spin \\(S\\) per site, the energy difference between FM and AFM
configurations (with \\(z\\) equivalent nearest-neighbour pairs per formula unit) is:

\begin{equation}
    \Delta E = E\_{\rm AFM} - E\_{\rm FM} = 2J\,z\,S^2.
    \label{eq:J-extraction}
\end{equation}

Hence:

\begin{equation}
    J = \frac{E\_{\rm AFM} - E\_{\rm FM}}{2\,z\,S^2}.
\end{equation}

For more complex magnetic structures with multiple shells of neighbours, the **four-state
method** (Xiang et al.) or the **spin-spiral approach** (Section below) provides a systematic
way to disentangle \\(J\_1, J\_2, J\_3, \ldots\\)

### Liechtenstein–Katsnelson–Antropov–Gubanov (LKAG) Method

An alternative to total energy differences is the **LKAG (linear response) method**, which
computes \\(J\_{ij}\\) directly from the Green's function:

\begin{equation}
    J\_{ij} = \frac{1}{4\pi}\int\_{-\infty}^{E\_F} {\rm Im}\,{\rm Tr}\_L\left[\Delta\_i G\_{ij}^\uparrow(E)\,\Delta\_j G\_{ji}^\downarrow(E)\right]\,dE,
\end{equation}

where \\(\Delta\_i = V\_{\rm xc,i}^\uparrow - V\_{\rm xc,i}^\downarrow\\) is the local exchange
splitting on site \\(i\\) and \\(G\_{ij}^\sigma\\) are the spin-resolved intersite Green's functions.
This method gives the full \\(J\_{ij}\\) tensor in a single DFT calculation and is available in codes
such as FLEUR, SPR-KKR, and Questaal.

**Practical note:** Total energy methods (equation \eqref{eq:J-extraction}) are simpler and
widely used. They require DFT+U or hybrid functionals for correlated \\(d\\)/\\(f\\)-electron systems
where GGA overdelocalises the magnetic orbitals and underestimates \\(J\\).


## Non-Collinear SDFT

In the collinear formalism, the magnetisation is constrained to lie along \\(z\\). This is
insufficient for:
- **Spin spirals** and incommensurate magnetic structures.
- **Spin frustration** in triangular or kagome lattices.
- **Spin–orbit coupling (SOC) effects**: the magnetisation direction matters when SOC is
  present, and it may vary in space.
- **Dzyaloshinskii–Moriya interaction (DMI)** and skyrmions.

In **non-collinear SDFT**, the density variable is replaced by the full \\(2\times 2\\) density
matrix in spin space:

\begin{equation}
    n\_{\alpha\beta}(\mathbf{r}) = \sum\_i f\_i\,\phi\_i^\alpha(\mathbf{r})\left(\phi\_i^\beta(\mathbf{r})\right)^*,
    \qquad \alpha,\beta \in \{\uparrow,\downarrow\},
\end{equation}

which is related to the magnetisation density vector \\(\mathbf{m}(\mathbf{r})\\) via:

\begin{equation}
    n\_{\alpha\beta} = \frac{1}{2}\left[\rho\,\delta\_{\alpha\beta} + \mathbf{m}\cdot\boldsymbol{\sigma}\_{\alpha\beta}\right],
\end{equation}

where \\(\boldsymbol{\sigma} = (\sigma\_x, \sigma\_y, \sigma\_z)\\) are the Pauli matrices.

The KS orbitals become two-component **spinors** \\(\boldsymbol{\phi}\_i = (\phi\_i^\uparrow, \phi\_i^\downarrow)^T\\), and the KS equations take the matrix form:

\begin{equation}
    \left[-\frac{1}{2}\nabla^2\,\mathbf{I} + \mathbf{V}\_{\rm eff}(\mathbf{r})\right]\boldsymbol{\phi}\_i(\mathbf{r}) = \epsilon\_i\,\boldsymbol{\phi}\_i(\mathbf{r}),
\end{equation}

with the \\(2\times 2\\) effective potential:

\begin{equation}
    \mathbf{V}\_{\rm eff}(\mathbf{r}) = \left[V\_{\rm ext} + V\_{\rm H} + V\_{\rm xc}^{(0)}\right]\mathbf{I}
    - \mathbf{B}\_{\rm xc}(\mathbf{r})\cdot\boldsymbol{\sigma},
\end{equation}

where \\(V\_{\rm xc}^{(0)} = \frac{1}{2}(V\_{\rm xc}^\uparrow + V\_{\rm xc}^\downarrow)\\) is the
spin-averaged XC potential and \\(\mathbf{B}\_{\rm xc} = \frac{1}{2}(V\_{\rm xc}^\uparrow - V\_{\rm xc}^\downarrow)\hat{\mathbf{m}}\\) is the XC magnetic field aligned along the local magnetisation
direction \\(\hat{\mathbf{m}}(\mathbf{r})\\).


## Spin–Orbit Coupling (SOC)

Spin–orbit coupling is a relativistic effect arising from the interaction of an electron's spin
magnetic moment with the magnetic field it experiences due to its orbital motion around the
nucleus. In the Pauli approximation it takes the form:

\begin{equation}
    \hat{H}\_{\rm SOC} = \frac{\hbar^2}{4m\_e^2c^2}\frac{1}{r}\frac{dV}{dr}\,\hat{\mathbf{L}}\cdot\hat{\mathbf{S}},
\end{equation}

where \\(\hat{\mathbf{L}}\\) and \\(\hat{\mathbf{S}}\\) are the orbital and spin angular momentum
operators, and \\(dV/dr\\) is the radial derivative of the ionic potential. SOC is strong near heavy
nuclei (scales as \\(Z^4\\)), making it important for \\(4d\\), \\(5d\\), \\(4f\\), and \\(5f\\) elements.

In SDFT, SOC is most commonly included via the **second-variational method**:
1. Solve the scalar-relativistic (collinear) SDFT problem first.
2. Construct the SOC matrix elements in the basis of scalar-relativistic eigenstates.
3. Diagonalise the full Hamiltonian \\(\hat{H}\_{\rm SR} + \hat{H}\_{\rm SOC}\\).

Full self-consistent inclusion of SOC requires the non-collinear spinor formalism.


## Magnetic Anisotropy Energy (MAE)

The **magnetic anisotropy energy** is the difference in total energy between magnetisation
oriented along the easy axis and a hard axis:

\begin{equation}
    {\rm MAE} = E(\hat{\mathbf{n}}\_{\rm hard}) - E(\hat{\mathbf{n}}\_{\rm easy}),
\end{equation}

typically measured in \\(\mu\\)eV/atom for \\(3d\\) metals or meV/atom for heavy-element compounds. MAE
determines the **magnetic hardness** of a material: a large positive MAE (perpendicular easy
axis) is required for permanent magnets and perpendicular magnetic recording media.

MAE arises entirely from **spin–orbit coupling**: without SOC, all directions are degenerate.
It vanishes in spin-orbit-free collinear SDFT and requires either:

- **Self-consistent non-collinear calculation with SOC** for large MAE (e.g. \\(L1\_0\\)-FePt,
  \\(> 1\\) meV/atom).
- **Force theorem (perturbative SOC)**: For small MAE, compute the non-self-consistent energy
  with SOC applied to the converged scalar-relativistic density. Computationally cheaper but
  breaks down when SOC significantly modifies the density.

The MAE is dominated by the **band energy** contribution (summed KS eigenvalue difference):

\begin{equation}
    {\rm MAE} \approx \sum\_i (f\_i^{\rm hard}\,\epsilon\_i^{\rm hard} - f\_i^{\rm easy}\,\epsilon\_i^{\rm easy}),
\end{equation}

which requires very dense \\(k\\)-meshes to converge (fine Brillouin zone features near the Fermi
level). Typical convergence requires \\(40\times 40\times 40\\) or finer grids for transition metal
systems.

### Contribution from Orbital Moments: Bruno Relation

The connection between MAE and orbital moments was derived by Bruno (1989) using second-order
perturbation theory in the SOC strength \\(\xi\\). The SOC Hamiltonian is:

\\[
\hat{H}\_{\rm SOC} = \xi\,\hat{\mathbf{L}}\cdot\hat{\mathbf{S}}.
\\]

For a system with spin quantised along \\(\hat{\mathbf{n}}\\), the second-order energy correction is:

\\[
E^{(2)}(\hat{\mathbf{n}}) = -\xi^2 \sum\_{o,u} \frac{|\langle u|\hat{H}\_{\rm SOC}^{(\hat{\mathbf{n}})}|o\rangle|^2}{\epsilon\_u - \epsilon\_o},
\\]

where \\(o\\) and \\(u\\) label occupied and unoccupied states. Bruno showed that for a system with uniaxial symmetry and spin fixed along \\(\hat{\mathbf{n}}\\), the dominant contribution to this sum is proportional to the expectation value of the orbital angular momentum along \\(\hat{\mathbf{n}}\\):

\\[
E^{(2)}(\hat{\mathbf{n}}) \approx -\frac{\xi}{4\mu\_B}\langle \hat{L}\_{\hat{\mathbf{n}}} \rangle,
\\]

where \\(\langle \hat{L}\_{\hat{\mathbf{n}}} \rangle = \mu\_B^{-1}\langle\hat{m}\_L^{\hat{\mathbf{n}}}\rangle\\) is the orbital moment along \\(\hat{\mathbf{n}}\\) in units of \\(\mu\_B\\). The MAE then follows as the difference between two magnetisation directions:

\\[
{\rm MAE} = E(\hat{\mathbf{n}}\_{\rm hard}) - E(\hat{\mathbf{n}}\_{\rm easy})
\approx -\frac{\xi}{4\mu\_B}\left(\langle L\_z^{\rm hard}\rangle - \langle L\_z^{\rm easy}\rangle\right).
\\]

**Interpretation:** The easy axis is the direction along which the orbital moment is *largest* (most negative \\(E^{(2)}\\)), since a larger orbital moment means more SOC energy lowering. Materials with large orbital moments — rare-earth \\(4f\\) ions, \\(5d\\) transition metals, or low-symmetry environments that quench the orbital moment less — consequently have large MAE. This is the microscopic basis for the empirical rule that heavier elements with unquenched orbital moments make better permanent magnets.

**Caveats:** Bruno's derivation assumes (i) perturbative SOC (\\(\xi \ll\\) bandwidth), (ii) rigid band approximation (same orbitals for both directions), and (iii) collinear spin. It is quantitatively reliable for \\(3d\\) metals but breaks down for \\(4f\\) systems where SOC is comparable to the crystal field splitting, or for systems near band crossings where the denominator \\(\epsilon\_u - \epsilon\_o\\) becomes small. In those cases the full non-perturbative calculation is required.


## Application to Heusler Alloys

Heusler alloys (\\(X\_2YZ\\) full Heusler or \\(XYZ\\) half-Heusler) are a rich playground for SDFT
because they exhibit a wide range of magnetic phenomena:

**Half-metallic ferromagnetism**: In compounds like Co\\(\_2\\)MnSi, one spin channel (\\(\uparrow\\))
is metallic while the other (\\(\downarrow\\)) has a band gap at \\(E\_F\\), giving a spin polarisation
of 100% in principle. SDFT with GGA predicts this correctly for many Heuslers; a scissor
correction or hybrid functional is needed to accurately reproduce the minority-spin gap.

**Slater–Pauling rule**: The total magnetic moment per formula unit follows
\\(M = N\_v - 24\\) (full Heusler) or \\(M = N\_v - 18\\) (half-Heusler), where \\(N\_v\\) is the total
valence electron count. This rule, reproduced by SDFT, provides a rapid screening criterion for
half-metallicity.

**Exchange coupling and \\(T\_C\\)**: The Curie temperature can be estimated from \\(J\_{ij}\\) values
via mean-field theory (\\(k\_B T\_C^{\rm MF} = \frac{2}{3}J\_0\\)) or random phase approximation
(RPA), with RPA giving more accurate results for itinerant magnets. SDFT+LKAG is the standard
approach.

**MAE in Heuslers**: Most cubic Heuslers have small MAE (\\(\sim \mu\\)eV/atom) due to cubic
symmetry. Tetragonally distorted Heuslers (e.g. Mn\\(\_3\\)Ga) or inverse Heuslers can have
significantly larger MAE, relevant for spin-transfer torque applications.


## Practical Checklist for Magnetic DFT Calculations

1. **Initialise spin correctly**: Supply a non-zero initial magnetic moment to each magnetic
   site; the SCF loop will not spontaneously break spin symmetry from a non-magnetic starting
   point.
2. **Check for multiple magnetic minima**: Try several initial configurations (FM, AFM,
   ferrimagnetic) and compare final energies. Collinear SDFT can get trapped in local minima.
3. **Use appropriate XC**: PBE is standard; consider PBE+U or hybrid functionals for correlated
   \\(d/f\\) systems where GGA under-localises the magnetic orbitals.
4. **For MAE**: Use a non-collinear calculation with SOC; converge the \\(k\\)-mesh carefully
   (MAE is extremely sensitive to \\(k\\)-point density).
5. **For \\(J\\)**: Cross-check total-energy and Green's function methods; the two should agree
   within \\(\sim 10\\)–\\(20\%\\).
6. **Report orbital moments**: When SOC is included, report both spin and orbital magnetic
   moments for comparison with XMCD experiments.


## Outlook

Collinear SDFT provides an accurate and efficient framework for most magnetic materials, with
non-collinear SDFT required for frustrated systems, SOC-driven anisotropy, and DMI. A systematic
limitation shared by all SDFT methods is the treatment of **strongly correlated** \\(d\\) and \\(f\\)
electrons, where the mean-field XC potential fails to capture Mott–Hubbard physics. The
**DFT+U** method, which introduces an on-site Hubbard correction for localised orbitals, is the
subject of the next chapter.
