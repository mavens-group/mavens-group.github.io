# UV-Vis Absorption Spectroscopy: Band Gap and Particle Size

*Graduate-level reference notes. This lab simulates a thin-film
intensity scan (250–800 nm) from a virtual spectrophotometer, referenced
against a blank substrate, and is meant to build quantitative
Tauc-analysis and confinement-sizing skills, not to replace a full
optical spectroscopy or semiconductor-physics course.*

## 1. The absorption edge and the Tauc relation

For a semiconducting thin film measured against a matched blank
substrate, the recorded intensity signal $I(\lambda)$ falls away sharply
once the photon energy $h\nu = 1240/\lambda\,(\text{nm, eV})$ exceeds the
material's optical band gap $E_g$. Near the edge, the absorption
coefficient follows a power law in excess energy — the **Tauc
relation**:

$$
(I h\nu)^n = B (h\nu - E_g)
$$

$n$ depends on the joint density of states / momentum-conservation
requirements of the transition: $n = 2$ for an allowed **direct**
transition, $n = 1/2$ for an allowed **indirect** (phonon-assisted)
transition. (Forbidden transitions give $n = 2/3$ or $n = 1/3$, and are
not modeled here.)

![Direct vs indirect band-gap transition](/diagrams/uvvis-transition-diagram.svg)

*Figure 1 — A direct transition (left) conserves crystal momentum,
$\Delta k = 0$, so only a photon is needed. An indirect transition
(right) requires a phonon to bridge the momentum mismatch between the
valence-band maximum and conduction-band minimum, which is why its
absorption onset is weaker and more gradual — reflected in the smaller
exponent, $n = 1/2$.*

Plotting $(Ih\nu)^n$ against $h\nu$ and extrapolating the linear region
to $(Ih\nu)^n = 0$ gives $E_g$ directly. The intensity signal used here
is a stand-in for the absorption coefficient $\alpha$; the two are only
strictly proportional if film thickness and reflection losses are held
constant across the series being compared — formally $\alpha =
2.303\,A/t$ for a film of thickness $t$ and absorbance $A$, and it is
$\alpha$ (not the raw instrument signal) that the Tauc relation is
derived for.

## 2. Choosing n — a diagnostic, not an assumption

Whether a given oxide is "direct" or "indirect" is not always settled in
the literature — anatase TiO₂ is a well-known case where both
assignments have been argued, depending on sample quality and
measurement technique. The defensible approach is to plot $(Ih\nu)^n$
for **both** candidate values of $n$ over the same fit window and keep
whichever gives the more linear result (higher $R^2$); reporting a band
gap without stating the $n$ used, and without justifying it via
linearity, is one of the most common mistakes in the
applied-photocatalysis literature (Makuła, Pacia & Macyk, 2018).

The fit window itself is a second, often under-reported, source of
subjectivity: including points too close to $E_g$ (where noise dominates
the small $(Ih\nu)^n$ values) or too far above it (where the power-law
approximation breaks down) both bias the extrapolated intercept. A fit
window of roughly 0.2–0.6 eV above the apparent edge is a reasonable
default; wider windows should be checked for curvature before trusting
the result.

Real spectra also show a sub-gap **Urbach tail** — an exponential
absorption edge below $E_g$ caused by structural disorder, phonon
broadening, and defect/trap states — which is not modeled in this
simulation. A real material's Tauc plot therefore departs from perfect
linearity even for the correct $n$, particularly close to the edge.

## 3. Real spectra aren't perfectly smooth

Two further, very common effects are layered onto the ideal Tauc curve
in this simulation, both of which show up in essentially every
published thin-film UV-Vis spectrum:

**A gentle scattering-type background.** Real films scatter more
strongly toward shorter wavelengths, so the baseline is never perfectly
flat — it drifts upward toward the UV even where the film isn't
absorbing at all.

**Thin-film interference fringes.** Below the band gap, where the film
is largely transparent, light reflects off *both* the top surface and
the film–substrate interface. These two reflected components travel
slightly different path lengths and interfere.

![Thin-film interference schematic](/diagrams/uvvis-interference-diagram.svg)

*Figure 2 — Ray 1 reflects immediately at the top surface; ray 2 makes a
round trip through the film before exiting. Their path-length difference
is approximately $2nt$ (index $n$, thickness $t$), so constructive
interference occurs at $2nt = m\lambda$ for integer $m$ — a ripple whose
spacing shrinks toward shorter wavelength. This is a real, deterministic
optical effect, not measurement noise, and in this simulation it is
damped out once the film becomes strongly absorbing (there's little
light left to reflect off the back interface and interfere).*

This is why, even with detector noise switched off, the simulated
spectrum will never look like a perfectly smooth textbook curve — and
why a real Tauc fit's $R^2$ typically lands just under 1.0 rather than
exactly at it.

## 4. Quantum confinement and particle size

As crystallite size approaches the exciton Bohr radius, quantum
confinement raises the effective gap above the bulk value (Efros &
Efros, 1982; Brus, 1984). The full effective-mass (Brus) treatment is:

$$
\Delta E_g(R) = \frac{\hbar^2 \pi^2}{2R^2}\left(\frac{1}{m_e^*} +
\frac{1}{m_h^*}\right) \;-\; \frac{1.8\,e^2}{4\pi\varepsilon_0
\varepsilon_r R}
$$

— a confinement term ($\propto 1/R^2$) and a Coulomb correlation term
($\propto 1/R$) that partly offsets it. **This simulation retains only
the confinement term:**

$$
\Delta E_g(R) = \frac{h^2}{8R^2}\left(\frac{1}{m_e^*} +
\frac{1}{m_h^*}\right), \qquad K_0 = \frac{h^2}{8m_0} \approx
0.377\ \text{eV·nm}^2
$$

a deliberate simplification. It keeps the size ↔ $\Delta E_g$ relation
single-valued and monotonic (no quadratic root selection to
disambiguate), at the cost of somewhat overestimating $R$ relative to
the full Brus equation — particularly at small $R$ and/or low dielectric
constant, where the Coulomb term is proportionally larger.

The effective masses used are **isotropic, bulk, single-band** values;
real oxide band structures are anisotropic and often multi-valley, and
the parabolic-band approximation underlying the effective-mass method
itself breaks down for $R$ below roughly 1–2 nm, where a nanocrystal is
closer to a molecular cluster than a confined bulk band structure.
Tight-binding, $k\cdot p$, or empirical pseudopotential calculations are
the appropriate tools in that regime.

A further, unmodeled, real-world complication: an actual nanoparticle
ensemble has a **size distribution**, not a single $R$. The measured
absorption edge is an ensemble average, inhomogeneously broadened by
that distribution — a further reason real Tauc edges are less sharp
than the ones generated here.

## 5. Using this lab

![UV-Vis analysis workflow](/diagrams/uvvis-workflow-diagram.svg)

*Figure 3 — The full analysis pipeline this lab walks you through: from
raw spectrum, to a diagnostic Tauc fit, to a band gap, to a particle
size via the confinement shift.*

1. **Explore mode** — set a known particle size, toggle counting noise,
   and watch the spectrum and both Tauc transforms update live.
2. **Unknown mode** — read the spectrum, fit the Tauc edge under both
   candidate $n$, keep whichever is more linear, extract $E_g$ and $R$,
   guess the transition type, then reveal the ground truth.
3. Cross-check the particle size against an independent PXRD
   crystallite-size measurement on the same nominal sample. The two
   techniques probe different things — an optical/electronic length
   scale vs. a coherently-diffracting domain size — and needn't agree
   exactly even for a real, well-behaved sample.

### Fit-quality gate

Before accepting a Tauc intercept, use the displayed audit rather than $R^2$ alone:

1. choose the transform ($n=2$ or $n=1/2$) with physically defensible linear behavior;
2. use a finite rising-edge window, typically around 0.2–0.6 eV wide rather than the entire curve;
3. check that the extrapolated gap and inferred blue shift are physically compatible with the simplified confinement model; and
4. export the raw spectrum and state the selected transform, fit interval, $R^2$, $E_g$, and size estimate in the record book.

A numerical line can be fitted to many parts of a spectrum. The audit makes the modelling assumptions visible before an answer is revealed.

## 6. Limitations of this simulation (state these in any report)

- The core signal is generated directly from the ideal Tauc power law,
  so a perfectly linear region exists for the correct $n$ by
  construction — real spectra are never this clean even after
  accounting for the fringes and scattering background above.
- No Urbach tail or sub-gap defect/trap absorption is modeled.
- The Coulomb correlation term of the full Brus equation is omitted;
  effective masses are treated as isotropic bulk constants.
- A single, monodisperse particle size is assumed — no size
  distribution or inhomogeneous broadening.
- The interference fringes use one representative refractive index and
  thickness per material rather than measured dispersion data — real
  fringe spacing and contrast will differ from film to film.
- No substrate absorption is modeled; the trace is treated as already
  background/blank-referenced.
- Fe₃O₄'s tabulated "gap" is an apparent optical gap of charge-transfer
  origin, not a conventional band-to-band semiconductor gap; included
  for comparison only.
- Bulk $E_g$ and effective-mass values are literature-typical constants
  used for teaching, not tied to a specific reference per material —
  verify against a primary source for any reported result.

## Further reading

- J. Tauc, R. Grigorovici, A. Vancu, *Phys. Status Solidi* 15 (1966)
  627–637.
- Al. L. Efros & A. L. Efros, *Sov. Phys. Semicond.* 16 (1982) 772–775.
- L. E. Brus, *J. Chem. Phys.* 80 (1984) 4403–4409.
- L. E. Brus, *J. Phys. Chem.* 90 (1986) 2555–2560.
- P. Makuła, M. Pacia, W. Macyk, *J. Phys. Chem. Lett.* 9 (2018)
  6814–6817 (on correctly reading a Tauc plot).
- P. Kubelka & F. Munk, *Z. Tech. Phys.* 12 (1931) 593–601
  (diffuse-reflectance alternative to transmission Tauc analysis).
- P. Y. Yu & M. Cardona, *Fundamentals of Semiconductors*, 4th ed.,
  Springer.
