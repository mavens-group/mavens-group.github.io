# DFT+U: Hubbard Correction for Correlated Electrons

Standard DFT — whether LDA or GGA — describes electrons as moving in an effective single-particle
potential constructed from the average charge density. This mean-field picture works well when
electrons are itinerant, delocalised across the crystal in broad bands. It fails systematically
for materials containing partially filled \\(d\\) or \\(f\\) shells, where electrons are spatially
localised and strongly repel each other on the same atomic site. The canonical failures are
well-known: GGA predicts NiO, CoO, and MnO to be metals; their experimental ground states are
magnetic insulators with gaps of \\(3\\)–\\(4\\) eV. Rare-earth oxides, actinide compounds, and many
Heusler alloys with localised Mn or Co \\(d\\) states share the same pathology.

The root cause is the **self-interaction error (SIE)** and the failure of the semi-local XC
functional to reproduce the **Coulomb blockade** — the large energy cost \\(U\\) of placing two
electrons on the same atomic orbital simultaneously. The **DFT+U** method (Anisimov, Zaanen,
Andersen, 1991) corrects this by appending a Hubbard-like penalty term to the DFT energy
functional, adding the cost of double occupation explicitly for a chosen set of localised
orbitals. It is the most widely used method for strongly correlated materials in a
plane-wave or PAW framework.


## The Hubbard Model: Physical Motivation

The Hubbard model (Hubbard, 1963) is the minimal lattice model capturing the competition
between kinetic energy (electron hopping, bandwidth \\(W\\)) and on-site Coulomb repulsion:

<div>
\begin{equation}
    \hat{H}\_{\rm Hub} = -t\sum\_{\langle i,j\rangle,\sigma}\hat{c}\_{i\sigma}^\dagger\hat{c}\_{j\sigma}
    + U\sum\_i \hat{n}\_{i\uparrow}\hat{n}\_{i\downarrow},
    \label{eq:Hubbard}
\end{equation}
</div>

where \\(\hat{c}\_{i\sigma}^\dagger\\) creates an electron of spin \\(\sigma\\) on site \\(i\\), \\(t\\) is the
nearest-neighbour hopping integral, \\(U\\) is the on-site Coulomb repulsion, and
\\(\hat{n}\_{i\sigma} = \hat{c}\_{i\sigma}^\dagger\hat{c}\_{i\sigma}\\) is the occupation operator.

The two limits are illuminating:

- **\\(U/W \ll 1\\) (itinerant limit):** The bandwidth \\(W \sim zt\\) (where \\(z\\) is the coordination
  number) dominates. Electrons delocalise and form a metallic band. Standard DFT handles this
  regime well.

- **\\(U/W \gg 1\\) (Mott–Hubbard limit):** The on-site repulsion dominates. For a half-filled band
  (one electron per site), double occupancy costs energy \\(U\\), so electrons localise on
  individual sites and the system becomes a **Mott insulator**, even though band theory would
  predict a metal. DFT with semi-local XC functionals fails here because the mean-field
  treatment of electron–electron interaction cannot produce this correlation-driven localisation.

The Mott–Hubbard gap is approximately \\(U - W\\): it opens when the repulsion energy exceeds the
kinetic energy gain from delocalisation. For transition metal oxides, \\(U \sim 4\\)–\\(10\\) eV and
\\(W \sim 1\\)–\\(4\\) eV, placing them firmly in the correlated regime.


## Why Standard DFT Fails for Correlated Systems

The failure of LDA/GGA for Mott insulators can be traced to two related deficiencies:

**1. Self-interaction error (SIE).** As discussed in Chapter 4, approximate XC functionals
do not fully cancel the spurious self-repulsion of an electron with itself. For a localised
\\(d\\) orbital occupied by a single electron, the SIE artificially delocalises the orbital,
lowering its energy and pushing it into the valence band. The tendency of LDA/GGA to
over-delocalise \\(d\\) and \\(f\\) electrons is a direct consequence.

**2. Missing derivative discontinuity.** The exact XC potential has a finite discontinuity
at integer electron numbers \\(N\\):

<div>
\begin{equation}
    \Delta\_{\rm xc} = V\_{\rm xc}^+(N) - V\_{\rm xc}^-(N) > 0,
    \label{eq:disc}
\end{equation}
</div>

where \\(V\_{\rm xc}^\pm\\) denote the XC potential just above and below integer \\(N\\). This
discontinuity, combined with the KS band gap, gives the true quasiparticle gap:
\\(E\_g^{\rm true} = E\_g^{\rm KS} + \Delta\_{\rm xc}\\). Semi-local functionals give
\\(\Delta\_{\rm xc} = 0\\) exactly, so they systematically underestimate gaps. For Mott insulators
the KS gap is zero (they are predicted metallic), and \\(\Delta\_{\rm xc}\\) accounts for the entire
physical gap.

DFT+U corrects both deficiencies for the targeted orbitals: the Hubbard \\(U\\) term penalises
fractional occupations and introduces a step-like potential that mimics the derivative
discontinuity.


## The DFT+U Energy Functional

### Occupation Matrix

The central object in DFT+U is the **occupation matrix** \\(n\_{mm'}^\sigma\\) of the correlated
subspace on each atom \\(I\\):

<div>
\begin{equation}
    n\_{mm'}^{I\sigma} = \sum\_{\mathbf{k},\nu} f\_{\mathbf{k}\nu\sigma}
    \langle\phi\_{\mathbf{k}\nu\sigma}|\hat{P}\_{m'}^{I}\rangle
    \langle\hat{P}\_m^{I}|\phi\_{\mathbf{k}\nu\sigma}\rangle,
    \label{eq:occmat}
\end{equation}
</div>

where \\(f\_{\mathbf{k}\nu\sigma}\\) are KS orbital occupation numbers, \\(|\phi\_{\mathbf{k}\nu\sigma}\rangle\\)
are the KS spinor states, and \\(\hat{P}\_m^I = |\chi\_m^I\rangle\langle\chi\_m^I|\\) is the projector
onto the localised orbital \\(|\chi\_m^I\rangle\\) (e.g. the \\(d\_{m}\\) orbital on atom \\(I\\), with
\\(m = -l, \ldots, l\\)). In PAW, these projectors are the on-site partial waves; in LCAO codes,
they are the basis functions themselves.

The occupation matrix is Hermitian (\\(n\_{mm'}^{I\sigma} = (n\_{m'm}^{I\sigma})^*\\)) and its trace
gives the total occupation of spin channel \\(\sigma\\) on site \\(I\\):

<div>
\begin{equation}
    N^{I\sigma} = \sum\_m n\_{mm}^{I\sigma} = \mathrm{Tr}[\mathbf{n}^{I\sigma}].
\end{equation}
</div>

The eigenvalues \\(\{f\_\alpha^{I\sigma}\}\\) of \\(\mathbf{n}^{I\sigma}\\) lie in \\([0,1]\\) and are the
natural orbital occupation numbers of the correlated subspace.

### The Full DFT+U Functional

The total DFT+U energy is:

<div>
\begin{equation}
    E\_{\rm DFT+U} = E\_{\rm DFT}[\rho] + E\_U[\{n\_{mm'}^{I\sigma}\}] - E\_{\rm dc}[\{N^{I\sigma}\}],
    \label{eq:DFTU-total}
\end{equation}
</div>

where \\(E\_{\rm DFT}\\) is the standard LDA or GGA energy, \\(E\_U\\) is the Hubbard correction, and
\\(E\_{\rm dc}\\) is the **double-counting correction** — a term that must be subtracted because the
Coulomb interaction among the correlated electrons is already partially included in the DFT XC
energy and must not be counted twice.


## Two Formulations

### Liechtenstein Formulation (Full Rotationally Invariant)

The Liechtenstein formulation (Liechtenstein, Anisimov, Zaanen, 1995) uses the full
rotationally invariant Coulomb interaction characterised by two parameters: the average on-site
Coulomb repulsion \\(U\\) and the average exchange interaction \\(J\\):

<div>
\begin{equation}
    E\_U^{\rm Lich} = \frac{1}{2}\sum\_{I,\sigma}\sum\_{\{m\}}
    \left[U\_{m\_1m\_3}^{m\_2m\_4} - \delta\_{\sigma\sigma'}J\_{m\_1m\_3}^{m\_2m\_4}\right]
    n\_{m\_1m\_2}^{I\sigma}\,n\_{m\_3m\_4}^{I\sigma'},
\end{equation}
</div>

where \\(U\_{m\_1m\_3}^{m\_2m\_4}\\) and \\(J\_{m\_1m\_3}^{m\_2m\_4}\\) are the screened Slater integrals
parametrising the full Coulomb tensor. In practice these are reduced to a small number of
radial integrals \\(F^0, F^2, F^4\\) (for \\(d\\) orbitals) related to \\(U\\) and \\(J\\) by:

<div>
\begin{equation}
    U = F^0,
    \qquad
    J = \frac{F^2 + F^4}{14}.
\end{equation}
</div>

The double-counting correction in the Liechtenstein scheme uses the **around mean-field (AMF)**
form:

<div>
\begin{equation}
    E\_{\rm dc}^{\rm AMF} = \frac{U}{2}N(N-1) - \frac{J}{2}\sum\_\sigma N^\sigma(N^\sigma - 1),
\end{equation}
</div>

where \\(N = \sum\_\sigma N^\sigma\\) is the total occupation of the correlated shell.

### Dudarev Formulation (Simplified, \\(U\_{\rm eff}\\))

For most practical purposes, the simpler **Dudarev formulation** (Dudarev et al., 1998) is
preferred. It collapses \\(U\\) and \\(J\\) into a single effective parameter \\(U\_{\rm eff} = U - J\\) and
writes the correction as a penalty on fractional orbital occupations:

<div>
\begin{equation}
    \boxed{E\_U^{\rm Dur} = \frac{U\_{\rm eff}}{2}\sum\_{I,\sigma}
    \mathrm{Tr}\!\left[\mathbf{n}^{I\sigma}\!\left(\mathbf{1} - \mathbf{n}^{I\sigma}\right)\right].}
    \label{eq:Dudarev}
\end{equation}
</div>

This elegant form has a transparent physical interpretation: the factor
\\(n\_{mm}^{I\sigma}(1 - n\_{mm}^{I\sigma})\\) vanishes when orbital \\(m\\) is either fully occupied
(\\(n = 1\\)) or fully empty (\\(n = 0\\)), and is maximised at \\(n = 1/2\\) (half occupation). The
correction thus adds a penalty for *fractional* occupations, driving the occupation matrix
towards integer eigenvalues. This is precisely the correction for the SIE, which tends to
stabilise unphysical non-integer occupations.

The corresponding correction to the KS potential is:

<div>
\begin{equation}
    V\_{mm'}^{I\sigma,\rm DFT+U} = \frac{U\_{\rm eff}}{2}\left(\delta\_{mm'} - 2n\_{mm'}^{I\sigma}\right),
    \label{eq:Vpot}
\end{equation}
</div>

which shifts occupied orbitals (large \\(n\_{mm}\\)) downward in energy by \\(-U\_{\rm eff}/2\\) and
empty orbitals (small \\(n\_{mm}\\)) upward by \\(+U\_{\rm eff}/2\\). The net effect is to open or widen
the gap between occupied and empty states in the correlated subspace by approximately
\\(U\_{\rm eff}\\), as intended.

**The double-counting in Dudarev** is implicit: the functional is constructed so that the
\\(E\_U - E\_{\rm dc}\\) combination reduces exactly to equation \eqref{eq:Dudarev}, with the
double-counting absorbed algebraically. No separate choice of double-counting scheme is needed.

### Comparison of Formulations and Equivalence Conditions

| Feature | Liechtenstein | Dudarev |
|---|---|---|
| Parameters | \\(U\\) and \\(J\\) separately | \\(U\_{\rm eff} = U - J\\) only |
| Rotational invariance | Full | Approximate |
| Orbital polarisation | Captured | Not captured |
| Double-counting | AMF or FLL, explicit choice | Implicit, absorbed |
| Typical use | \\(f\\)-electron systems, full anisotropy | \\(d\\)-electron oxides, most practical work |
| Implementation in VASP | `LDAUTYPE = 1` | `LDAUTYPE = 2` (default) |

**Conditions under which Dudarev and Liechtenstein are equivalent.** The Dudarev functional is obtained from the Liechtenstein functional by making two approximations:

1. **Isotropic (spherically averaged) Coulomb interaction**: replace the full Slater integrals \\(U\_{m\_1m\_3}^{m\_2m\_4}\\) by their spherical average \\(U\,\delta\_{m\_1m\_2}\delta\_{m\_3m\_4} - J\,\delta\_{m\_1m\_4}\delta\_{m\_2m\_3}\\).

2. **FLL double-counting with \\(J = 0\\) in the double-counting term**: when the FLL double-counting correction is applied and the exchange term \\(J\\) is absorbed into \\(U\_{\rm eff}\\), the Liechtenstein energy reduces exactly to the Dudarev form.

Concretely, inserting the spherically averaged interaction into the Liechtenstein energy and subtracting the FLL double counting gives:

\\[
E\_U^{\rm Lich,spherical} - E\_{\rm dc}^{\rm FLL} = \frac{U-J}{2}\sum\_{I,\sigma}\mathrm{Tr}\left[\mathbf{n}^{I\sigma}(\mathbf{1}-\mathbf{n}^{I\sigma})\right] \equiv E\_U^{\rm Dur}.
\\]

The two formulations therefore give identical results when: (a) the occupation matrix \\(\mathbf{n}^{I\sigma}\\) is diagonal (no off-diagonal orbital coherences), and (b) the Slater integrals satisfy the spherical approximation \\(F^2/F^4 = 14/9\\) (exact for a hydrogen-like atom, approximately satisfied for \\(3d\\) transition metals). They **differ** when orbital polarisation within the correlated shell is important — i.e. when different \\(m\\) orbitals have different occupations that couple through the full Coulomb tensor. This is the regime where the Liechtenstein formulation is necessary: rare-earth \\(f\\) systems, orbitally ordered manganites, and systems near the Mott transition where the orbital degree of freedom is active.


## The Double-Counting Problem

The double-counting term \\(E\_{\rm dc}\\) in equation \eqref{eq:DFTU-total} has no unique exact
form because the DFT XC energy does not separate cleanly into contributions from the correlated
subspace and the rest. Two schemes are in common use:

**Fully localised limit (FLL)**, also called the atomic limit:

<div>
\begin{equation}
    E\_{\rm dc}^{\rm FLL} = \frac{U}{2}N(N-1) - \frac{J}{2}\left[\frac{N}{2}\!\left(\frac{N}{2}-1\right) + \frac{N}{2}\!\left(\frac{N}{2}-1\right)\right],
    \label{eq:FLL}
\end{equation}
</div>

valid when the correlated orbital is nearly fully occupied or nearly empty (close to the atomic
limit). This is appropriate for \\(f\\)-electron systems and late transition metal oxides.

**Around mean-field (AMF):**

<div>
\begin{equation}
    E\_{\rm dc}^{\rm AMF} = \frac{U}{2}\bar{n}(N-1) - \frac{J}{2}\sum\_\sigma\bar{n}^\sigma(N^\sigma - 1),
\end{equation}
</div>

where \\(\bar{n} = N/(2l+1)\\) is the average occupation per orbital. This is appropriate when the
occupations are close to the average (near the itinerant limit).

The FLL correction gives a larger energy shift for occupied orbitals and is the standard choice
in most codes. However, the double-counting error is a fundamental limitation of DFT+U: since
it cannot be derived from first principles, it introduces an uncontrolled approximation that
depends on how much of \\(U\\) is already captured in the DFT functional. This is one motivation
for methods like DFT+DMFT, which treat the correlated subspace exactly.


## Determining \\(U\\)

The Hubbard \\(U\\) parameter is not a unique material property — it depends on the DFT functional,
the choice of localised basis, and the degree of screening in the material. Three approaches
are used in practice.

### Empirical Fitting

The simplest approach is to choose \\(U\_{\rm eff}\\) to reproduce an experimentally known
quantity — typically the band gap, lattice constant, or magnetic moment. For NiO, \\(U\_{\rm eff}
\approx 5\\)–\\(6\\) eV reproduces the experimental gap of \\(\sim 4\\) eV; for FeO, \\(U\_{\rm eff} \approx
4\\) eV. Empirical \\(U\\) values are system-specific and should not be transferred between materials
without validation.

A compilation of commonly used values:

| Material / Ion | Orbital | \\(U\_{\rm eff}\\) (eV) | Fitted property |
|---|---|---|---|
| Fe\\(^{2+/3+}\\) in oxides | \\(3d\\) | \\(3.5\\)–\\(5.0\\) | Gap, moment |
| Co\\(^{2+/3+}\\) | \\(3d\\) | \\(3.0\\)–\\(5.5\\) | Gap |
| Ni\\(^{2+}\\) | \\(3d\\) | \\(5.0\\)–\\(6.5\\) | Gap |
| Mn\\(^{2+/3+/4+}\\) | \\(3d\\) | \\(3.0\\)–\\(4.5\\) | Gap, structure |
| Cu\\(^{2+}\\) | \\(3d\\) | \\(6.0\\)–\\(9.0\\) | Gap |
| Ce\\(^{3+/4+}\\) | \\(4f\\) | \\(5.0\\)–\\(7.0\\) | \\(f\\) occupancy |
| U\\(^{4+/5+}\\) | \\(5f\\) | \\(2.0\\)–\\(4.5\\) | Structure, gap |

### Linear Response (Cococcioni–de Gironcoli)

A first-principles approach computes \\(U\\) from the linear response of the occupation matrix to a
localised perturbation potential \\(\alpha^I\\) applied to site \\(I\\) (Cococcioni and de Gironcoli,
2005):

<div>
\begin{equation}
    U^I = \left(\chi\_0^{-1} - \chi^{-1}\right)^{II},
    \label{eq:LR-U}
\end{equation}
</div>

where \\(\chi\_0^{II} = \partial N^I/\partial\alpha^I|\_{\rm bare}\\) is the bare (non-self-consistent)
response and \\(\chi^{II} = \partial N^I/\partial\alpha^I|\_{\rm SCF}\\) is the fully self-consistent
response. The difference captures the screening of the bare Coulomb interaction by all other
electrons. The parameter \\(U\\) computed this way is self-consistent with the chosen DFT functional
and projector, requiring no experimental input.

The procedure is: (1) apply a small perturbation \\(\pm\alpha\\) to the Hubbard projector of
site \\(I\\); (2) compute the SCF and non-SCF changes in \\(N^I\\); (3) extract \\(U\\) from
equation \eqref{eq:LR-U}. This is available as a post-processing step in Quantum ESPRESSO
(`hp.x`) and can be scripted in VASP.

**Limitations:** Linear response \\(U\\) values tend to be smaller than empirically fitted values
because they include screening by itinerant valence electrons. The result also depends on the
choice of projectors and may differ between PAW and LCAO implementations.

### Constrained Random Phase Approximation (cRPA)

The most rigorous approach is the **constrained RPA** (Aryasetiawan et al., 2004), which computes
the partially screened Coulomb interaction \\(W(\omega)\\) by excluding the screening from the
correlated subspace itself (to avoid double counting):

<div>
\begin{equation}
    U(\omega) = \langle\chi\_m\chi\_{m'}|W\_r(\omega)|\chi\_m\chi\_{m'}\rangle,
\end{equation}
</div>

where \\(W\_r\\) is the RPA-screened interaction with the polarisation of the correlated \\(d/f\\)
subspace removed. cRPA gives frequency-dependent \\(U(\omega)\\); the static limit \\(U(0)\\) is
used in DFT+U, while the full frequency dependence feeds into DFT+DMFT. cRPA requires a
GW-like calculation and is available in VASP (`ALGO = CRPA`) and the WIEN2k+DMFT interface.


## Effect of \\(U\\) on the Electronic Structure

The potential correction \eqref{eq:Vpot} produces several characteristic changes to the
electronic structure that can be verified against experiment:

**Band gap opening.** Occupied \\(d/f\\) states are shifted down by \\(\sim U\_{\rm eff}/2\\) and empty
states up by \\(\sim U\_{\rm eff}/2\\), opening a gap of approximately \\(U\_{\rm eff}\\) in the
correlated subspace. For a Mott insulator like NiO, DFT gives a metallic state while
DFT+U with \\(U\_{\rm eff} \approx 5\\) eV correctly gives an insulating gap \\(\sim 3\\)–\\(4\\) eV.

**Orbital polarisation.** The integer-driving nature of DFT+U can lift orbital degeneracy via
**orbital ordering** — a spontaneous symmetry breaking in which one particular \\(d\\) orbital
(e.g. \\(d\_{z^2}\\) vs. \\(d\_{x^2-y^2}\\)) becomes preferentially occupied. This is relevant for
manganites and other Jahn–Teller active systems.

**Magnetic moments.** By localising the \\(d/f\\) electrons, DFT+U increases the local spin moment
towards the ionic limit. For Fe\\(^{3+}\\) in an oxide (half-filled \\(3d\\), \\(S = 5/2\\)), GGA gives
moments of \\(\sim 3.5\,\mu\_B\\); DFT+U with appropriate \\(U\\) gives \\(\sim 4.2\,\mu\_B\\), closer to
the ionic value of \\(5.0\,\mu\_B\\).

**Exchange coupling \\(J\\).** The exchange coupling constants extracted from DFT+U are generally
more reliable than from GGA for Mott insulators, because the localised occupations improve the
description of the superexchange mechanism. For half-metallic Heusler alloys, DFT+U may be
needed when one or more magnetic sublattice contains strongly correlated \\(d\\) states.

**Lattice parameters and forces.** The occupation-dependent potential modifies the forces on
ions, generally increasing bond lengths for correlated oxides by \\(\sim 0.5\\)–\\(2\%\\) towards
experiment.


## Multiple Correlated Sites and Inter-Site \\(U\\)

When a material contains more than one type of correlated atom (e.g. both Fe and Co in a double
perovskite, or both \\(3d\\) transition metal and \\(4f\\) rare earth), separate \\(U\\) values must be
applied to each:

<div>
\begin{equation}
    E\_U^{\rm multi} = \sum\_{I \in \{ \rm correlated\}} \frac{U\_{\rm eff}^{(I)}}{2}\sum\_\sigma\mathrm{Tr}\!\left[\mathbf{n}^{I\sigma}(\mathbf{1} - \mathbf{n}^{I\sigma})\right],
    \label{eq:multi-U}
\end{equation}
</div>

with each \\(U\_{\rm eff}^{(I)}\\) chosen from linear-response, cRPA, or empirical fitting on the
corresponding sublattice. In VASP this is done by providing per-element `LDAUL` (target \\(\ell\\))
and `LDAUU`/`LDAUJ` arrays; in Quantum ESPRESSO, by listing `Hubbard_U(itype)` per atomic species.
A worked example is LaMnO\\(_3\\) with both Mn (\\(3d\\), \\(U\_{\rm eff} \approx 4\\) eV) and La (\\(4f\\),
\\(U\_{\rm eff} \approx 7\\) eV) treated explicitly — necessary in the rare-earth manganites where
the \\(4f\\) shell is partially filled and hybridises with the Mn states.

### DFT+U+V: Inter-Site Hubbard Term

The Hubbard \\(U\\) corrects on-site Coulomb repulsion but ignores the residual *inter-site*
electron–electron interaction \\(V\_{IJ}\\) between neighbouring correlated atoms. This nearest-neighbour
\\(V\\) is small (typically \\(0.5\\)–\\(1.5\\) eV) but qualitatively important for systems where covalent
hybridisation competes with on-site localisation — e.g. transition-metal oxides with strong
\\(p\text{--}d\\) covalency such as NiO, MnO, the cuprates, and topological materials at the boundary
between band insulators and Mott insulators.

The **DFT+U+V** extension (Campo and Cococcioni, 2010) adds a Hubbard-like penalty for inter-site
occupation matrices \\(n\_{mm'}^{IJ\sigma} = \sum\_{\mathbf{k}\nu} f\_{\mathbf{k}\nu\sigma}\langle\phi\_{\mathbf{k}\nu\sigma}|\hat{P}\_{m'}^J\rangle\langle\hat{P}\_m^I|\phi\_{\mathbf{k}\nu\sigma}\rangle\\):

<div>
\begin{equation}
    E\_{U+V} = E\_U - \sum\_{\langle I,J\rangle, \sigma} \frac{V\_{IJ}}{2}\,\mathrm{Tr}\!\left[\mathbf{n}^{IJ\sigma}\mathbf{n}^{JI\sigma}\right],
    \label{eq:DFT-U-V}
\end{equation}
</div>

where the sum runs over nearest-neighbour pairs \\(\langle I, J\rangle\\) of correlated sites. The
inter-site \\(V\_{IJ}\\) parameters are computed by the same linear-response procedure as \\(U\\)
(Cococcioni–de Gironcoli 2005, extended), now perturbing site \\(I\\) and reading the response of site
\\(J\\)'s occupation matrix.

**When DFT+U+V matters.** For ionic Mott insulators (NiO, MnO, FeO with strong O–\\(d\\) charge
transfer), DFT+U+V improves the description of the *charge-transfer gap* — the energetic
separation between O \\(2p\\) and \\(d\\) bands — without requiring an artificially large \\(U\\) on the
metal site. For NiO, DFT+U gives the correct \\(3d\\)–\\(3d\\) Mott gap but underestimates the
charge-transfer character; DFT+U+V with \\(V\_{Ni-O} \approx 1\\) eV gives both correctly. DFT+U+V is
available in Quantum ESPRESSO (`Hubbard_V`) and in development for VASP.


## Worked Example: NiO from GGA to DFT+U

NiO is the canonical test case for DFT+U. Its experimental ground state is an antiferromagnetic
(AFM-II ordering) insulator with a charge-transfer gap of \\(\sim 4.0\\) eV and a Ni magnetic
moment of \\(1.6\\)–\\(1.9\,\mu\_B\\). The Ni\\(^{2+}\\) ion has the \\(3d^8\\) configuration with \\(S = 1\\),
in an octahedral O environment that splits the \\(d\\) shell into \\(t\_{2g}\\) (fully occupied,
6 electrons) and \\(e\_g\\) (half occupied, 2 electrons spin-polarised).

**Standard GGA (PBE).** A standard PBE calculation of antiferromagnetic NiO predicts:
- A **metallic** ground state (or, depending on cell setup, a tiny gap of \\(0.2\\)–\\(0.4\\) eV).
- A Ni moment of \\(\sim 1.3\,\mu\_B\\), much smaller than experiment.
- A density of states (DOS) at the Fermi level dominated by Ni \\(e\_g\\) states hybridised with
  O \\(2p\\), with no separation between the upper and lower Hubbard subbands.

Both errors trace back to the same cause: PBE overdelocalises the Ni \\(3d\\) electrons because
the SIE artificially lowers their on-site energy.

**DFT+U with \\(U\_{\rm eff} = 5.0\\) eV.** Applying the Dudarev correction to the Ni \\(3d\\) orbitals
opens a gap of \\(\sim 3.0\\)–\\(3.5\\) eV and increases the Ni moment to \\(\sim 1.7\,\mu\_B\\) — in good
agreement with experiment. Schematically, the projected DOS reorganises as follows:

```
  Energy ↑
  ────────────────────────────────────────
         │     │       ┃     │  ←─ Ni e_g↑ (empty)    } Upper Hubbard
   +2 eV │  Ni │       ┃     │                      } band (Mott gap)
         │  t  │   ━━━━╋━━━━━│  ←─ E_F (in the gap)
   −2 eV │  2g │       ┃ Ni  │  ←─ Ni e_g↓ (filled)   } Lower Hubbard
         │  ↑↓ │       ┃ e_g │                      } band
         │ ──  │       ┃ ↓   │  ←─ O 2p              } Anion p-band
   −5 eV │  O  │ O 2p  ┃     │     (charge-transfer)
         │  2p │       ┃     │
  ────────────────────────────────────────
         GGA (metal)   DFT+U (insulator)
```

The Ni \\(e\_g\\) majority-spin states (filled in the AFM ground state) shift downward by \\(\sim
U\_{\rm eff}/2\\); the empty \\(e\_g\\) minority-spin states shift up by the same amount, opening the
Mott gap. The O \\(2p\\) states are only weakly affected because they are not in the Hubbard
manifold — but the relative position of O \\(2p\\) and Ni \\(3d\\) determines whether NiO is a Mott
or a charge-transfer insulator. The Zaanen–Sawatzky–Allen classification places NiO at the
crossover, which is why both \\(U\\) (for the Ni–Ni gap) and \\(V\_{\rm Ni-O}\\) (for the Ni–O charge
transfer) are needed for full quantitative agreement.

**\\(U\\) dependence.** Varying \\(U\_{\rm eff}\\) from 3 to 8 eV produces:

| \\(U\_{\rm eff}\\) (eV) | Gap (eV) | Moment (\\(\mu\_B\\)) | Character |
|---|---|---|---|
| 0 (PBE) | 0.0 | 1.3 | Metal |
| 3.0 | 1.8 | 1.55 | Insulator, gap too small |
| 5.0 | 3.0 | 1.70 | Best match to experiment |
| 6.5 | 3.7 | 1.80 | Gap slightly too large |
| 8.0 | 4.5 | 1.90 | Over-correction |

The result is sensitive to \\(U\\), confirming that a quantitative DFT+U calculation requires either
careful empirical fitting or a first-principles \\(U\\) from linear response / cRPA. The linear-response
\\(U\\) for NiO from Cococcioni–de Gironcoli is \\(\sim 4.6\\) eV, in good agreement with the empirical
fit.


## Limitations and the Path to DFT+DMFT

DFT+U is a *mean-field* treatment of the on-site Hubbard \\(U\\). It corrects three errors of
semi-local DFT — the SIE on localised orbitals, the missing derivative discontinuity, and the
absence of orbital polarisation — but at the level of a static, Hartree-like decoupling of the
Hubbard term. It cannot describe phenomena that depend on the *dynamical* nature of
correlations:

- **Quasiparticle satellites and Hubbard bands.** The exact spectral function of a Mott insulator
  has two broad Hubbard bands at energies \\(\pm U/2\\) plus, in the metallic phase near the Mott
  transition, a narrow quasiparticle peak at \\(\epsilon\_F\\). DFT+U produces the two Hubbard bands
  but cannot generate the quasiparticle peak — it has no mechanism for fractional spectral weight
  redistribution. Photoemission spectra of vanadates (V\\(_2\\)O\\(_3\\), V\\(_2\\)O\\(_5\\)) and the
  iron pnictides cannot be reproduced.

- **Mass renormalisation.** In a correlated metal near the Mott transition, the effective mass
  is enhanced by \\(m^*/m = 1/Z\\) with \\(Z\\) the quasiparticle weight. DFT+U gives \\(Z = 1\\) by
  construction; this is qualitatively wrong for heavy-fermion compounds and bad metals.

- **Finite-temperature physics.** Mott transitions, paramagnetic insulators, and Kondo screening
  are intrinsically finite-\\(T\\) effects involving entropy. DFT+U is a \\(T = 0\\) method.

- **Dynamical screening.** The frequency dependence of \\(U(\omega)\\) — captured by cRPA but
  collapsed to its static value in DFT+U — is important for plasmon satellites and high-energy
  photoemission features.

The next level of sophistication is **DFT+DMFT** (dynamical mean-field theory; Kotliar et al.,
2006), which treats the local correlated subspace exactly by solving an effective Anderson
impurity problem self-consistently with the DFT band structure. The Hubbard \\(U\\) becomes a
matrix in occupation space rather than a single number, and the resulting self-energy
\\(\Sigma\_{mm'}(\omega)\\) is fully frequency-dependent. DFT+DMFT captures all four phenomena
listed above and is the de-facto standard for compounds like V\\(_2\\)O\\(_3\\), SrVO\\(_3\\), heavy
fermions (CeRu\\(_2\\)Si\\(_2\\), URu\\(_2\\)Si\\(_2\\)), and iron pnictides. The computational cost is
substantial — an impurity solver (continuous-time QMC, NRG, exact diagonalisation) is called
many times per DFT iteration — and the implementations are still less mature than DFT+U
(TRIQS+DFTtools, EDMFT+QSGW, AMULET, DCore are research-grade codes).

| Method | Treatment of \\(U\\) | Self-energy | Captures Hubbard bands | Captures QP peak | Cost |
|---|---|---|---|---|---|
| GGA | Implicit, semi-local | Static, local | No | No | \\(\mathcal{O}(N^3)\\) |
| Hybrid (HSE06) | Partial via exact exchange | Static, non-local | Partially | No | \\(\mathcal{O}(N^3\\)–\\(N^4)\\) |
| DFT+U | Static, on-site | Static, orbital-dependent | Yes | No | \\(\mathcal{O}(N^3)\\) |
| DFT+DMFT | Dynamical, on-site | \\(\Sigma(\omega)\\), local | Yes | Yes | \\(\mathcal{O}(N^3)\times N\_{\rm imp}\\) |
| DFT+GW | Non-local, dynamical | \\(\Sigma(\mathbf{r},\mathbf{r}',\omega)\\) | Yes (qualitatively) | Yes (qualitatively) | \\(\mathcal{O}(N^4)\\) |

**When to escalate from DFT+U to DMFT.** Use DFT+U when (a) the system is a clear Mott or
charge-transfer insulator at \\(T = 0\\), (b) you need ground-state properties (energies, forces,
moments) rather than spectra, and (c) the static-\\(U\\) approximation is justified. Move to DFT+DMFT
when (a) you need photoemission or optical spectra including satellites, (b) the system is near
a Mott transition, (c) it is a heavy fermion or bad metal, or (d) finite-\\(T\\) effects are
essential.


## Practical Recipe and Pitfalls

A practical DFT+U workflow:

1. **Identify the correlated subspace.** For \\(3d\\) transition metals, the \\(3d\\) shell; for
   \\(4f\\)/\\(5f\\), the \\(f\\) shell. Set `LDAUL` (VASP) or `Hubbard_U` per species (QE) accordingly.

2. **Choose \\(U\_{\rm eff}\\).** For exploratory work, use literature values from the table above.
   For publication-quality results, compute \\(U\\) via linear response (Cococcioni–de Gironcoli)
   or cRPA — and report the value alongside results.

3. **Initial occupation matrix matters.** The DFT+U energy landscape has multiple local minima
   corresponding to different occupation patterns (orbital orderings). Default initial
   occupations may converge to a metastable state. Use `LDAUTYPE = 2` with `OCCEXT` (VASP) or
   manually set `starting_ns` in QE to bias toward the expected physical ground state.

4. **Check the converged occupations.** Print the occupation matrix at convergence; physical
   solutions have integer eigenvalues (\\(\sim 0\\) or \\(\sim 1\\)). Eigenvalues near \\(0.5\\) signal
   either a metastable solution or genuinely fractional occupation (mixed-valence systems).

5. **Energy comparison caveat.** DFT+U total energies *cannot* be compared directly to standard
   DFT energies — they reference different functionals. Always compare DFT+U energies of
   different structures or configurations using the *same* \\(U\\) value and projector.

6. **Forces and relaxation.** DFT+U forces include the derivative of the Hubbard term and are
   well-defined, but bond lengths typically increase by \\(0.5\\)–\\(2\%\\). Re-relax structures
   with DFT+U if the geometry depends on the correlated-electron localisation.

**Common pitfalls:**
- Using the same \\(U\\) for the same element in different oxidation states or coordination
  environments: \\(U\_{\rm eff}(\rm Fe^{2+})\\) and \\(U\_{\rm eff}(\rm Fe^{3+})\\) differ by \\(\sim 1\\) eV
  in linear-response calculations.
- Forgetting that \\(U\\) values reported in the literature are projector-dependent: a VASP PAW \\(U\\)
  is not directly transferable to an LCAO code without retabulation.
- Applying DFT+U to weakly correlated states (e.g. \\(d^0\\) configurations like Ti\\(^{4+}\\) in
  TiO\\(_2\\)): the correction is unnecessary and can degrade results for empty \\(d\\) shells with no
  Hubbard physics.


## Outlook

DFT+U is the workhorse correction for strongly correlated electrons in plane-wave DFT, offering
qualitative-to-quantitative improvement at marginal extra cost over standard GGA. It is, however,
a static and atomic-orbital-specific correction; the systematic path to a complete description
of correlation runs through DFT+DMFT and ultimately many-body Green's function methods (GW,
GW+DMFT, vertex corrections).

The chapters that follow turn from the *physics* of the XC functional to the *numerical
methods* needed to solve the Kohn–Sham equations in practice: self-consistent field iteration
and density mixing (Chapter 8), Brillouin zone integration and smearing (Chapter 9), and
iterative diagonalisation of the KS Hamiltonian (Chapter 10).

