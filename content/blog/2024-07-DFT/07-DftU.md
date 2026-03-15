---
title: "DFT+U: Hubbard Correction for Correlated Electrons"
date: '2025-06-01'
type: book
weight: 07
summary: The DFT+U method — motivation, Hubbard model, Dudarev and Liechtenstein formulations, double counting, and practical application
---
<!--more-->

Standard DFT — whether LDA or GGA — describes electrons as moving in an effective single-particle
potential constructed from the average charge density. This mean-field picture works well when
electrons are itinerant, delocalised across the crystal in broad bands. It fails systematically
for materials containing partially filled $d$ or $f$ shells, where electrons are spatially
localised and strongly repel each other on the same atomic site. The canonical failures are
well-known: GGA predicts NiO, CoO, and MnO to be metals; their experimental ground states are
magnetic insulators with gaps of $3$–$4$ eV. Rare-earth oxides, actinide compounds, and many
Heusler alloys with localised Mn or Co $d$ states share the same pathology.

The root cause is the **self-interaction error (SIE)** and the failure of the semi-local XC
functional to reproduce the **Coulomb blockade** — the large energy cost $U$ of placing two
electrons on the same atomic orbital simultaneously. The **DFT+U** method (Anisimov, Zaanen,
Andersen, 1991) corrects this by appending a Hubbard-like penalty term to the DFT energy
functional, adding the cost of double occupation explicitly for a chosen set of localised
orbitals. It is the most widely used method for strongly correlated materials in a
plane-wave or PAW framework.

---

## The Hubbard Model: Physical Motivation

The Hubbard model (Hubbard, 1963) is the minimal lattice model capturing the competition
between kinetic energy (electron hopping, bandwidth $W$) and on-site Coulomb repulsion:
{{< math >}}
\begin{equation}
    \hat{H}_{\rm Hub} = -t\sum_{\langle i,j\rangle,\sigma}\hat{c}_{i\sigma}^\dagger\hat{c}_{j\sigma}
    + U\sum_i \hat{n}_{i\uparrow}\hat{n}_{i\downarrow},
    \label{eq:Hubbard}
\end{equation}
{{< /math >}}
where {{< math >}}$\hat{c}_{i\sigma}^\dagger${{< /math >}} creates an electron of spin $\sigma$ on site $i$, $t$ is the
nearest-neighbour hopping integral, $U$ is the on-site Coulomb repulsion, and
{{< math >}}$\hat{n}_{i\sigma} = \hat{c}_{i\sigma}^\dagger\hat{c}_{i\sigma}${{< /math >}} is the occupation operator.

The two limits are illuminating:

- **$U/W \ll 1$ (itinerant limit):** The bandwidth $W \sim zt$ (where $z$ is the coordination
  number) dominates. Electrons delocalise and form a metallic band. Standard DFT handles this
  regime well.

- **$U/W \gg 1$ (Mott–Hubbard limit):** The on-site repulsion dominates. For a half-filled band
  (one electron per site), double occupancy costs energy $U$, so electrons localise on
  individual sites and the system becomes a **Mott insulator**, even though band theory would
  predict a metal. DFT with semi-local XC functionals fails here because the mean-field
  treatment of electron–electron interaction cannot produce this correlation-driven localisation.

The Mott–Hubbard gap is approximately $U - W$: it opens when the repulsion energy exceeds the
kinetic energy gain from delocalisation. For transition metal oxides, $U \sim 4$–$10$ eV and
$W \sim 1$–$4$ eV, placing them firmly in the correlated regime.

---

## Why Standard DFT Fails for Correlated Systems

The failure of LDA/GGA for Mott insulators can be traced to two related deficiencies:

**1. Self-interaction error (SIE).** As discussed in Chapter 4, approximate XC functionals
do not fully cancel the spurious self-repulsion of an electron with itself. For a localised
$d$ orbital occupied by a single electron, the SIE artificially delocalises the orbital,
lowering its energy and pushing it into the valence band. The tendency of LDA/GGA to
over-delocalise $d$ and $f$ electrons is a direct consequence.

**2. Missing derivative discontinuity.** The exact XC potential has a finite discontinuity
at integer electron numbers $N$:
\begin{equation}
    \Delta_{\rm xc} = V_{\rm xc}^+(N) - V_{\rm xc}^-(N) > 0,
    \label{eq:disc}
\end{equation}
where $V_{\rm xc}^\pm$ denote the XC potential just above and below integer $N$. This
discontinuity, combined with the KS band gap, gives the true quasiparticle gap:
$E_g^{\rm true} = E_g^{\rm KS} + \Delta_{\rm xc}$. Semi-local functionals give
$\Delta_{\rm xc} = 0$ exactly, so they systematically underestimate gaps. For Mott insulators
the KS gap is zero (they are predicted metallic), and $\Delta_{\rm xc}$ accounts for the entire
physical gap.

DFT+U corrects both deficiencies for the targeted orbitals: the Hubbard $U$ term penalises
fractional occupations and introduces a step-like potential that mimics the derivative
discontinuity.

---

## The DFT+U Energy Functional

### Occupation Matrix

The central object in DFT+U is the **occupation matrix** $n_{mm'}^\sigma$ of the correlated
subspace on each atom $I$:
{{< math >}}
\begin{equation}
    n_{mm'}^{I\sigma} = \sum_{\mathbf{k},\nu} f_{\mathbf{k}\nu\sigma}
    \langle\phi_{\mathbf{k}\nu\sigma}|\hat{P}_{m'}^{I}\rangle
    \langle\hat{P}_m^{I}|\phi_{\mathbf{k}\nu\sigma}\rangle,
    \label{eq:occmat}
\end{equation}
{{< /math >}}
where $f_{\mathbf{k}\nu\sigma}$ are KS orbital occupation numbers, $|\phi_{\mathbf{k}\nu\sigma}\rangle$
are the KS spinor states, and {{< math >}}$\hat{P}_m^I = |\chi_m^I\rangle\langle\chi_m^I|${{< /math >}} is the projector
onto the localised orbital $|\chi_m^I\rangle$ (e.g. the $d_{m}$ orbital on atom $I$, with
$m = -l, \ldots, l$). In PAW, these projectors are the on-site partial waves; in LCAO codes,
they are the basis functions themselves.

The occupation matrix is Hermitian ($n_{mm'}^{I\sigma} = (n_{m'm}^{I\sigma})^*$) and its trace
gives the total occupation of spin channel $\sigma$ on site $I$:
\begin{equation}
    N^{I\sigma} = \sum_m n_{mm}^{I\sigma} = \mathrm{Tr}[\mathbf{n}^{I\sigma}].
\end{equation}

The eigenvalues $\{f_\alpha^{I\sigma}\}$ of $\mathbf{n}^{I\sigma}$ lie in $[0,1]$ and are the
natural orbital occupation numbers of the correlated subspace.

### The Full DFT+U Functional

The total DFT+U energy is:
\begin{equation}
    E_{\rm DFT+U} = E_{\rm DFT}[\rho] + E_U[\{n_{mm'}^{I\sigma}\}] - E_{\rm dc}[\{N^{I\sigma}\}],
    \label{eq:DFTU-total}
\end{equation}
where $E_{\rm DFT}$ is the standard LDA or GGA energy, $E_U$ is the Hubbard correction, and
$E_{\rm dc}$ is the **double-counting correction** — a term that must be subtracted because the
Coulomb interaction among the correlated electrons is already partially included in the DFT XC
energy and must not be counted twice.

---

## Two Formulations

### Liechtenstein Formulation (Full Rotationally Invariant)

The Liechtenstein formulation (Liechtenstein, Anisimov, Zaanen, 1995) uses the full
rotationally invariant Coulomb interaction characterised by two parameters: the average on-site
Coulomb repulsion $U$ and the average exchange interaction $J$:
\begin{equation}
    E_U^{\rm Lich} = \frac{1}{2}\sum_{I,\sigma}\sum_{\{m\}}
    \left[U_{m_1m_3}^{m_2m_4} - \delta_{\sigma\sigma'}J_{m_1m_3}^{m_2m_4}\right]
    n_{m_1m_2}^{I\sigma}\,n_{m_3m_4}^{I\sigma'},
\end{equation}
where $U_{m_1m_3}^{m_2m_4}$ and $J_{m_1m_3}^{m_2m_4}$ are the screened Slater integrals
parametrising the full Coulomb tensor. In practice these are reduced to a small number of
radial integrals $F^0, F^2, F^4$ (for $d$ orbitals) related to $U$ and $J$ by:
\begin{equation}
    U = F^0,
    \qquad
    J = \frac{F^2 + F^4}{14}.
\end{equation}

The double-counting correction in the Liechtenstein scheme uses the **around mean-field (AMF)**
form:
\begin{equation}
    E_{\rm dc}^{\rm AMF} = \frac{U}{2}N(N-1) - \frac{J}{2}\sum_\sigma N^\sigma(N^\sigma - 1),
\end{equation}
where $N = \sum_\sigma N^\sigma$ is the total occupation of the correlated shell.

### Dudarev Formulation (Simplified, $U_{\rm eff}$)

For most practical purposes, the simpler **Dudarev formulation** (Dudarev et al., 1998) is
preferred. It collapses $U$ and $J$ into a single effective parameter $U_{\rm eff} = U - J$ and
writes the correction as a penalty on fractional orbital occupations:
\begin{equation}
    \boxed{E_U^{\rm Dur} = \frac{U_{\rm eff}}{2}\sum_{I,\sigma}
    \mathrm{Tr}\!\left[\mathbf{n}^{I\sigma}\!\left(\mathbf{1} - \mathbf{n}^{I\sigma}\right)\right].}
    \label{eq:Dudarev}
\end{equation}

This elegant form has a transparent physical interpretation: the factor
$n_{mm}^{I\sigma}(1 - n_{mm}^{I\sigma})$ vanishes when orbital $m$ is either fully occupied
($n = 1$) or fully empty ($n = 0$), and is maximised at $n = 1/2$ (half occupation). The
correction thus adds a penalty for *fractional* occupations, driving the occupation matrix
towards integer eigenvalues. This is precisely the correction for the SIE, which tends to
stabilise unphysical non-integer occupations.

The corresponding correction to the KS potential is:
\begin{equation}
    V_{mm'}^{I\sigma,\rm DFT+U} = \frac{U_{\rm eff}}{2}\left(\delta_{mm'} - 2n_{mm'}^{I\sigma}\right),
    \label{eq:Vpot}
\end{equation}
which shifts occupied orbitals (large $n_{mm}$) downward in energy by $-U_{\rm eff}/2$ and
empty orbitals (small $n_{mm}$) upward by $+U_{\rm eff}/2$. The net effect is to open or widen
the gap between occupied and empty states in the correlated subspace by approximately
$U_{\rm eff}$, as intended.

**The double-counting in Dudarev** is implicit: the functional is constructed so that the
$E_U - E_{\rm dc}$ combination reduces exactly to equation \eqref{eq:Dudarev}, with the
double-counting absorbed algebraically. No separate choice of double-counting scheme is needed.

### Comparison of Formulations

| Feature | Liechtenstein | Dudarev |
|---|---|---|
| Parameters | $U$ and $J$ separately | $U_{\rm eff} = U - J$ only |
| Rotational invariance | Full | Approximate |
| Orbital polarisation | Captured | Not captured |
| Double-counting | AMF or FLL, explicit choice | Implicit, absorbed |
| Typical use | $f$-electron systems, full anisotropy | $d$-electron oxides, most practical work |
| Implementation in VASP | `LDAUTYPE = 1` | `LDAUTYPE = 2` (default) |

For most $d$-electron transition metal compounds, the Dudarev formulation with a single
$U_{\rm eff}$ is sufficient and is the default in VASP (`LDAUTYPE = 2`). The Liechtenstein form
is preferred when orbital polarisation within the correlated shell matters — rare-earth $f$
systems, systems near the Mott transition, or when $J$ significantly affects the orbital
ordering.

---

## The Double-Counting Problem

The double-counting term $E_{\rm dc}$ in equation \eqref{eq:DFTU-total} has no unique exact
form because the DFT XC energy does not separate cleanly into contributions from the correlated
subspace and the rest. Two schemes are in common use:

**Fully localised limit (FLL)**, also called the atomic limit:
\begin{equation}
    E_{\rm dc}^{\rm FLL} = \frac{U}{2}N(N-1) - \frac{J}{2}\left[\frac{N}{2}\!\left(\frac{N}{2}-1\right) + \frac{N}{2}\!\left(\frac{N}{2}-1\right)\right],
    \label{eq:FLL}
\end{equation}
valid when the correlated orbital is nearly fully occupied or nearly empty (close to the atomic
limit). This is appropriate for $f$-electron systems and late transition metal oxides.

**Around mean-field (AMF):**
\begin{equation}
    E_{\rm dc}^{\rm AMF} = \frac{U}{2}\bar{n}(N-1) - \frac{J}{2}\sum_\sigma\bar{n}^\sigma(N^\sigma - 1),
\end{equation}
where $\bar{n} = N/(2l+1)$ is the average occupation per orbital. This is appropriate when the
occupations are close to the average (near the itinerant limit).

The FLL correction gives a larger energy shift for occupied orbitals and is the standard choice
in most codes. However, the double-counting error is a fundamental limitation of DFT+U: since
it cannot be derived from first principles, it introduces an uncontrolled approximation that
depends on how much of $U$ is already captured in the DFT functional. This is one motivation
for methods like DFT+DMFT, which treat the correlated subspace exactly.

---

## Determining $U$

The Hubbard $U$ parameter is not a unique material property — it depends on the DFT functional,
the choice of localised basis, and the degree of screening in the material. Three approaches
are used in practice.

### Empirical Fitting

The simplest approach is to choose $U_{\rm eff}$ to reproduce an experimentally known
quantity — typically the band gap, lattice constant, or magnetic moment. For NiO, $U_{\rm eff}
\approx 5$–$6$ eV reproduces the experimental gap of $\sim 4$ eV; for FeO, $U_{\rm eff} \approx
4$ eV. Empirical $U$ values are system-specific and should not be transferred between materials
without validation.

A compilation of commonly used values:

| Material / Ion | Orbital | $U_{\rm eff}$ (eV) | Fitted property |
|---|---|---|---|
| Fe$^{2+/3+}$ in oxides | $3d$ | $3.5$–$5.0$ | Gap, moment |
| Co$^{2+/3+}$ | $3d$ | $3.0$–$5.5$ | Gap |
| Ni$^{2+}$ | $3d$ | $5.0$–$6.5$ | Gap |
| Mn$^{2+/3+/4+}$ | $3d$ | $3.0$–$4.5$ | Gap, structure |
| Cu$^{2+}$ | $3d$ | $6.0$–$9.0$ | Gap |
| Ce$^{3+/4+}$ | $4f$ | $5.0$–$7.0$ | $f$ occupancy |
| U$^{4+/5+}$ | $5f$ | $2.0$–$4.5$ | Structure, gap |

### Linear Response (Cococcioni–de Gironcoli)

A first-principles approach computes $U$ from the linear response of the occupation matrix to a
localised perturbation potential $\alpha^I$ applied to site $I$ (Cococcioni and de Gironcoli,
2005):
\begin{equation}
    U^I = \left(\chi_0^{-1} - \chi^{-1}\right)^{II},
    \label{eq:LR-U}
\end{equation}
where {{< math >}}$\chi_0^{II} = \partial N^I/\partial\alpha^I|_{\rm bare}${{< /math >}} is the bare (non-self-consistent)
response and {{< math >}}$\chi^{II} = \partial N^I/\partial\alpha^I|_{\rm SCF}${{< /math >}} is the fully self-consistent
response. The difference captures the screening of the bare Coulomb interaction by all other
electrons. The parameter $U$ computed this way is self-consistent with the chosen DFT functional
and projector, requiring no experimental input.

The procedure is: (1) apply a small perturbation $\pm\alpha$ to the Hubbard projector of
site $I$; (2) compute the SCF and non-SCF changes in $N^I$; (3) extract $U$ from
equation \eqref{eq:LR-U}. This is available as a post-processing step in Quantum ESPRESSO
(`hp.x`) and can be scripted in VASP.

**Limitations:** Linear response $U$ values tend to be smaller than empirically fitted values
because they include screening by itinerant valence electrons. The result also depends on the
choice of projectors and may differ between PAW and LCAO implementations.

### Constrained Random Phase Approximation (cRPA)

The most rigorous approach is the **constrained RPA** (Aryasetiawan et al., 2004), which computes
the partially screened Coulomb interaction $W(\omega)$ by excluding the screening from the
correlated subspace itself (to avoid double counting):
\begin{equation}
    U(\omega) = \langle\chi_m\chi_{m'}|W_r(\omega)|\chi_m\chi_{m'}\rangle,
\end{equation}
where $W_r$ is the RPA-screened interaction with the polarisation of the correlated $d/f$
subspace removed. cRPA gives frequency-dependent $U(\omega)$; the static limit $U(0)$ is
used in DFT+U, while the full frequency dependence feeds into DFT+DMFT. cRPA requires a
GW-like calculation and is available in VASP (`ALGO = CRPA`) and the WIEN2k+DMFT interface.

---

## Effect of $U$ on the Electronic Structure

The potential correction \eqref{eq:Vpot} produces several characteristic changes to the
electronic structure that can be verified against experiment:

**Band gap opening.** Occupied $d/f$ states are shifted down by $\sim U_{\rm eff}/2$ and empty
states up by $\sim U_{\rm eff}/2$, opening a gap of approximately $U_{\rm eff}$ in the
correlated subspace. For a Mott insulator like NiO, DFT gives a metallic state while
DFT+U with $U_{\rm eff} \approx 5$ eV correctly gives an insulating gap $\sim 3$–$4$ eV.

![DFT+U effect on band gap opening](fig-dftu-levels_dft.png)
**Orbital polarisation.** The integer-driving nature of DFT+U can lift orbital degeneracy via
**orbital ordering** — a spontaneous symmetry breaking in which one particular $d$ orbital
(e.g. $d_{z^2}$ vs. $d_{x^2-y^2}$) becomes preferentially occupied. This is relevant for
manganites and other Jahn–Teller active systems.

**Magnetic moments.** By localising the $d/f$ electrons, DFT+U increases the local spin moment
towards the ionic limit. For Fe$^{3+}$ in an oxide (half-filled $3d$, $S = 5/2$), GGA gives
moments of $\sim 3.5\,\mu_B$; DFT+U with appropriate $U$ gives $\sim 4.2\,\mu_B$, closer to
the ionic value of $5.0\,\mu_B$.

**Exchange coupling $J$.** The exchange coupling constants extracted from DFT+U are generally
more reliable than from GGA for Mott insulators, because the localised occupations improve the
description of the superexchange mechanism. For half-metallic Heusler alloys, DFT+U may be
needed when one or more magnetic sublattice contains strongly correlated $d$ states.

**Lattice parameters and forces.** The occupation-dependent potential modifies the forces on
ions, generally increasing bond lengths for correlated oxides by $\sim 0.5$–$2\%$ towards
experiment.

---

## Multiple Correlated Sites and Inter-Site $U$

When a material contains more than one type of correlated atom (e.g. both Fe and Co in a double
perovskite, or both $3d$ transition metal and $4f$ rare earth), separate $U$ values must be
applied to each:

```
LDAUU = 0 0 5.0 6.5    # e.g. O p, La f, Fe d, Co d
LDAUJ = 0 0 1.0 0.7
LDAUL = -1 -1 2 2      # l quantum number: -1=off, 2=d
```

**Inter-site Coulomb repulsion $V$** between neighbouring correlated sites (the extended Hubbard
model: $\hat{H} = \ldots + V\sum_{\langle i,j\rangle}\hat{n}_i\hat{n}_j$) is not included in
standard DFT+U but becomes important for charge-ordered states and certain multiferroics. The
**DFT+U+V** method (Campo and Cococcioni, 2010) extends the Dudarev functional to include
inter-site occupations and is available in Quantum ESPRESSO.

---

## Practical Checklist for DFT+U Calculations

1. **Choose the correlated subspace**: Apply $U$ to the $d$ or $f$ orbitals of the magnetic or
   strongly correlated atoms. Do not apply $U$ to $s$ or $p$ orbitals unless specifically
   justified.

2. **Determine $U_{\rm eff}$**: Use the linear response method for a first-principles estimate,
   or empirically fit to the experimental band gap or magnetic moment. Report the value used and
   validate against at least one observable.

3. **Use Dudarev (`LDAUTYPE = 2`) for $d$ electrons by default**. Switch to Liechtenstein
   (`LDAUTYPE = 1`) with explicit $J$ only for $f$-electron systems or when orbital polarisation
   is physically important.

4. **Check for metastable solutions**: The occupation matrix can converge to local energy
   minima corresponding to different orbital orderings. Always try multiple initial occupation
   matrices (e.g. initialise with identity, with the fully spin-polarised matrix, and with a
   broken-symmetry matrix) and compare final energies.

5. **Initialise the occupation matrix explicitly** in VASP using `LDAUPRINT = 2` to print the
   matrices and `MAGMOM` tags to set the initial spin. In Quantum ESPRESSO, use `starting_ns_eigenvalue`
   to initialise specific orbital occupations.

6. **Converge $U$-dependent properties**: Band gaps, magnetic moments, and lattice constants
   all depend on $U_{\rm eff}$. Perform a sensitivity analysis over a range
   $U_{\rm eff} \pm 1$–$2$ eV to assess the robustness of your conclusions.

7. **Validate against hybrid functionals**: For a subset of configurations, compare DFT+U
   results against HSE06 or PBE0. Reasonable agreement lends confidence to the $U$ choice;
   large discrepancies signal that the double-counting or projector choice may be inadequate.

---

## Limitations of DFT+U

DFT+U is a practical and computationally cheap correction, but it has fundamental limitations
that must be kept in mind:

**Ambiguity in $U$ and double counting.** Neither $U$ nor $E_{\rm dc}$ is uniquely defined.
Different codes, projectors, and double-counting schemes give different results for the same
nominal $U$, making comparison between studies non-trivial.

**Static mean-field treatment.** DFT+U replaces the dynamic on-site correlations of the Hubbard
model with a static mean-field correction. It cannot describe the Kondo effect, orbital
fluctuations, or the incoherent spectral weight (Hubbard bands) that are hallmarks of strongly
correlated metals near the Mott transition. These require DFT+DMFT.

**Orbital dependence and symmetry breaking.** The occupation matrix $n_{mm'}^{I\sigma}$ is
basis-dependent and can break the rotational symmetry of the system if not handled carefully.
Unphysical orbital orderings can appear as metastable SCF solutions.

**Not a systematic improvement.** Unlike the Jacob's Ladder hierarchy of Chapter 4, there is no
guarantee that DFT+U improves all properties simultaneously. It often improves the gap while
worsening structural parameters or vice versa, depending on the choice of $U$.

---

## Outlook

DFT+U addresses the most severe failure of semi-local DFT for correlated materials at minimal
computational cost — a single SCF calculation with modified on-site potentials. It is the
standard first step for any system containing transition metal or rare-earth ions. For systems
where the full dynamical correlations matter (Kondo systems, strongly correlated metals,
spectral functions), the natural extension is **DFT+DMFT** (Dynamical Mean-Field Theory), which
treats the correlated subspace exactly within an effective impurity model while embedding it in
the DFT electronic structure of the surrounding crystal. This is beyond the scope of the present
course, but the DFT+U occupation matrix and Hubbard projectors developed here form the direct
input to any DFT+DMFT implementation.
