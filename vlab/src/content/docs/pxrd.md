# Powder X-ray Diffraction (PXRD)

*Rudra Banerjee — Department of Physics and Nanotechnology, SRM Institute of Science and Technology*

> **Abstract.** Powder X-ray Diffraction (PXRD) is the cornerstone of modern structural characterization. This guide blends foundational quantum and solid-state physics principles with advanced analytical techniques — including line-profile analysis, Rietveld refinement, and machine learning — to provide a comprehensive overview for advanced laboratory study and materials characterization.

**Contents:** Introduction · Historical Development · Physics Behind X-ray Diffraction · Instrumentation and Measurement · Quantitative Line-Profile Analysis · Data Analysis Workflow · Advanced Techniques and Future Directions · Best Practices and Limitations · Common Software Ecosystem

## Introduction

Powder X-ray Diffraction (PXRD) is arguably the most critical structural characterization technique in materials science. It is routinely used across metallurgy, semiconductors, ceramics, quantum materials, and nanomaterials to determine:

*   Crystal structure and symmetry.
*   Phase purity and secondary phase identification.
*   Precision lattice constants.
*   Crystallite size and microstrain.
*   Texture (preferred orientation) and defects.

## Historical Development

The evolution of X-ray diffraction maps directly onto the advancement of modern physics:

*   **1895:** Wilhelm Röntgen discovered X-rays.
*   **1912:** Max von Laue demonstrated X-ray diffraction by crystals.
*   **1913:** W. H. Bragg and W. L. Bragg formulated Bragg's Law.
*   **1916–1930:** Development of the Debye–Scherrer powder method and rotating anode generators.
*   **1969:** Hugo Rietveld introduced whole-pattern profile refinement.
*   **1990–Present:** The era of synchrotron diffraction, Pair Distribution Function (PDF) analysis, operando measurements, and machine-learning-driven crystallography.

## Physics Behind X-ray Diffraction

### Bragg's Law and Peak Position

Diffraction occurs because the typical X-ray wavelength (λ ≈ 0.5–2 Å) matches the interatomic spacing (d ≈ 1–5 Å) in crystals. For a set of lattice planes (hkl) with spacing $d_{hkl}$, constructive interference occurs when:

$$n\lambda = 2d_{hkl}\sin\theta$$

where n is the diffraction order, and θ is the Bragg angle. The spacing $d_{hkl}$ is entirely fixed by the unit cell metric. For common crystal systems:

*   **Cubic:** $$\frac{1}{d^2} = \frac{h^2 + k^2 + l^2}{a^2}$$
*   **Tetragonal:** $$\frac{1}{d^2} = \frac{h^2 + k^2}{a^2} + \frac{l^2}{c^2}$$
*   **Hexagonal:** $$\frac{1}{d^2} = \frac{4}{3}\left(\frac{h^2 + hk + k^2}{a^2}\right) + \frac{l^2}{c^2}$$

Peak *position* is therefore a purely geometric probe of the unit cell. Relative peak *intensity* is governed by the structure factor $F_{hkl}$ — the coherent sum of atomic scattering factors over the basis, phased by the atomic positions, and convolved with multiplicity, Lorentz-polarization, and Debye–Waller factors.

![Bragg diffraction schematic](/diagrams/pxrd-bragg-diagram.svg)

*Figure 1 — Schematic representation of Bragg diffraction illustrating the incident angle θ, the diffraction angle 2θ, and the interplanar spacing $d_{hkl}$.*

### Reciprocal Space and Powder Diffraction

Diffraction occurs in reciprocal space. Every diffraction peak corresponds to one reciprocal lattice vector $\mathbf{G} = h\mathbf{a^*} + k\mathbf{b^*} + l\mathbf{c^*}$. Unlike a single crystal, a powder contains millions of randomly oriented crystallites. For every lattice plane, some crystallites automatically satisfy Bragg's condition, producing Debye–Scherrer diffraction rings. The diffractometer records these rings as a 1D plot of intensity vs. 2θ.

## Instrumentation and Measurement

Modern laboratory diffractometers utilize Bragg–Brentano geometry. Electrons are accelerated (30–60 kV) into a target (usually Cu, yielding Kα₁ = 1.5406 Å). The beam passes through incident slits, a monochromator, strikes the flat, randomly oriented powder sample, and diffracts into a receiving slit and a modern hybrid pixel or silicon strip detector.

**Measurement Parameters:** A typical scan ranges from 10° to 90° 2θ, with a step size of ~0.01° and counting times of 1–3 hours.

## Quantitative Line-Profile Analysis (LPA)

A real diffraction peak is a convolution of several physical and instrumental contributions:

$$h(x) = f(x) \circledast g(x) \circledast \dots$$

where $f(x)$ is the instrument response, and the sample-dependent terms are **crystallite size** and **microstrain**. In simplified models, these terms are treated as Gaussians combined in quadrature:

$$\beta_{\text{total}} = \sqrt{\beta_{\text{phys}}^2 + \beta_{\text{instr}}^2}$$

Real profile fitting uses pseudo-Voigt or Voigt functions to deconvolve the Lorentzian-leaning size broadening and Gaussian-leaning strain broadening.

### Crystallite Size: The Scherrer Equation

Small coherently diffracting domains broaden diffraction peaks:

$$D = \frac{K\lambda}{\beta \cos\theta}$$

*   **D:** A *volume-weighted, apparent* crystallite size. Note that this is strictly a lower bound on the true domain size and is distinct from grain size seen in electron microscopy.
*   **K:** The Scherrer shape constant. It is not a universal 0.9; it depends on crystallite shape, the specific hkl, and ranges roughly from 0.62 to 2.08.
*   **Limitation:** The Scherrer equation assumes strain is negligible. If not, D will be systematically underestimated.

### Microstrain: Williamson–Hall Analysis

Lattice imperfections and strain broaden peaks proportionally to $\tan\theta$, while size broadening scales as $1/\cos\theta$. Rearranging gives the Uniform Deformation Model (UDM):

$$\beta \cos\theta = \frac{K\lambda}{D} + 4\varepsilon \sin\theta$$

Plotting $\beta \cos\theta$ vs. $4\sin\theta$ yields a line where the intercept is size (1/D) and the slope is microstrain (ε).

*Advanced Variants:* To account for anisotropic elasticity, models like the Uniform Stress Deformation Model (USDM) or the Uniform Deformation Energy Density Model (UDEDM) are used. The Halder–Wagner method is an alternative that circumvents some Gaussian/Cauchy assumptions.

### Lattice Parameter Refinement

Extracting high-precision lattice parameters is confounded by angle-dependent systematic errors (sample displacement, transparency). The standard correction is the **Nelson–Riley extrapolation**, plotting apparent parameters against $\frac{1}{2}(\cos^2\theta/\sin\theta + \cos^2\theta/\theta)$ and extrapolating to $\theta \to 90^\circ$.

## Data Analysis Workflow

![PXRD data analysis workflow](/diagrams/pxrd-workflow-diagram.svg)

*Figure 2 — Standard data analysis workflow for PXRD.*

### Evidence-first workflow in this lab

1. Measure at least three well-separated primary reflections and export the peak table.
2. Check the individual Scherrer sizes before fitting: a large peak-to-peak spread warns that a single-size model is inadequate.
3. Use the Williamson–Hall intercept for size and slope for microstrain; record the displayed $R^2$ rather than treating any two-point line as proof.
4. Exclude assigned secondary-phase peaks from the Williamson–Hall and lattice fits.
5. In an unknown, state a **phase-pure** or **secondary-phase present** hypothesis before revealing the result. Support it using unmatched/reflection evidence, not only peak broadening.
6. Report the Cu K$\alpha_1$ wavelength, instrumental FWHM correction, measured peaks, fit quality, and limitations with every result.

The CSV export is intended as the raw-data attachment for the record book. A plausible numerical answer without the measurement trail is not a defensible diffraction result.

## Indexing and Peak Positions

### Worked example: indexing ZnO

ZnO (wurtzite) is hexagonal with $a=3.2495$ Å and $c=5.2069$ Å. For a hexagonal lattice the plane spacing is

$$
\frac{1}{d_{hkl}^2}=\frac43\,\frac{h^2+hk+k^2}{a^2}+\frac{l^2}{c^2},
$$

and Bragg's law $\lambda=2d\sin\theta$ with $\lambda=1.5406$ Å gives the peak position:

| $hkl$ | $d$ (Å) | $2\theta$ (°) |
|---|---:|---:|
| (100) | 2.8141 | 31.77 |
| (002) | 2.6035 | 34.42 |
| (101) | 2.4757 | 36.26 |
| (102) | 1.9111 | 47.54 |
| (110) | 1.6247 | 56.60 |

These are the positions that appear in the virtual diffractogram. Indexing an unknown works in reverse: find the lattice type and the parameters that reproduce *all* the observed positions with small integers, and check that no allowed reflection with appreciable intensity is missing. Systematic absences (for example, no $hkl$ with $h+k+l$ odd in a body-centred cubic lattice) identify the centring and some symmetry elements.

### Peak intensities

Positions depend on the lattice; **intensities** depend on what sits at each lattice point. The integrated intensity of a reflection is

$$
I_{hkl}\propto m_{hkl}\,|F_{hkl}|^{2}\,\mathrm{LP}(\theta)\,T(\theta),
\qquad
F_{hkl}=\sum_j f_j(\sin\theta/\lambda)\,e^{2\pi i(hx_j+ky_j+lz_j)}e^{-B_j\sin^2\theta/\lambda^2},
$$

with $m$ the multiplicity, $f_j$ the atomic scattering factor, $\mathrm{LP}=(1+\cos^22\theta)/(\sin^2\theta\cos\theta)$ the Lorentz–polarisation factor, and $T$ an absorption or Debye–Waller term. Preferred orientation changes the relative intensities without changing the positions, which is why intensity ratios must be treated with caution in a phase identification.

## Uncertainty and Error Analysis

### Peak positions and lattice parameters

Differentiating Bragg's law at fixed $\lambda$ gives

$$
\frac{\delta d}{d}=-\cot\theta\,\delta\theta.
$$

A position uncertainty of $0.02^\circ$ in $2\theta$ ($\delta\theta=0.01^\circ$) gives $\delta d/d=6.1\times10^{-4}$ at $31.77^\circ$ but only $2.1\times10^{-4}$ at $80^\circ$, because $\cot\theta$ falls with angle. **High-angle reflections determine lattice parameters most precisely**, which is the reason for the Nelson–Riley extrapolation to $\theta\to90^\circ$ and for using an internal standard.

### Scherrer size

For one peak, $D=K\lambda/(\beta\cos\theta)$, so

$$
\left(\frac{u_D}{D}\right)^2=\left(\frac{u_K}{K}\right)^2+\left(\frac{u_\beta}{\beta}\right)^2+\left(\tan\theta\,u_\theta\right)^2.
$$

The last term is negligible. The width term is usually small too: $u_\beta=0.01^\circ$ on $\beta=0.79^\circ$ is 1.3 %. The first term dominates: $K$ ranges from about 0.62 to 2.08 depending on crystallite shape and the reflection, so a $\pm$ 10 % statement about $K$ is optimistic. **Quote $D$ with the value of $K$ used.**

### Instrumental correction

The measured width is corrected as $\beta_{\mathrm{corr}}=\sqrt{\beta_{\mathrm{meas}}^2-\beta_{\mathrm{inst}}^2}$. This quadrature rule is exact only if both profiles are Gaussian. Its effect is large for narrow peaks (when $\beta_{\mathrm{meas}}$ is close to $\beta_{\mathrm{inst}}$) and small for broad ones. The size sensitivity to the instrumental width is

$$
\frac{\partial\beta_{\mathrm{corr}}}{\partial\beta_{\mathrm{inst}}}=-\frac{\beta_{\mathrm{inst}}}{\beta_{\mathrm{corr}}},
$$

so an error in $\beta_{\mathrm{inst}}$ matters most when $\beta_{\mathrm{corr}}$ is only a few times larger than it. Above about 0.5° breadth the correction is a few per cent.

### Williamson–Hall regression

The slope and intercept of $\beta\cos\theta$ against $4\sin\theta$ are fitted by least squares. With $n$ points there are $n-2$ degrees of freedom, and the residual variance is $s^2=\mathrm{SS}_{\mathrm{res}}/(n-2)$. The standard errors are

$$
u_{\mathrm{slope}}=\sqrt{\frac{n\,s^2}{n\sum x^2-(\sum x)^2}},
\qquad
u_{\mathrm{intercept}}=\sqrt{\frac{s^2\sum x^2}{n\sum x^2-(\sum x)^2}},
$$

and since $D=K\lambda/\mathrm{intercept}$, $u_D/D=u_{\mathrm{intercept}}/\mathrm{intercept}$. The lab shows these standard errors next to each fitted value.

**Few points mean a wide interval.** A 95 % confidence interval is $\pm t_{0.975,\,n-2}\,u$, where $t$ is Student's factor:

| Points $n$ | Degrees of freedom | $t_{0.975}$ |
|---:|---:|---:|
| 3 | 1 | 12.71 |
| 4 | 2 | 4.30 |
| 5 | 3 | 3.18 |
| 6 | 4 | 2.78 |
| 8 | 6 | 2.45 |

With two points a line passes through both exactly and there is nothing to estimate: no residual, no uncertainty. With four points the interval is more than four standard errors wide. The statement "$R^2=0.99$" on three or four points is much weaker than it looks.

### Why Scherrer and Williamson–Hall sizes differ

If strain is present, the width of every peak includes a strain term $4\varepsilon\tan\theta$. The Scherrer formula attributes the whole width to size, so it **underestimates** $D$, and it does so progressively more at high angle because $\tan\theta$ grows. A systematic decrease of the Scherrer size with $2\theta$ is the warning sign. Williamson–Hall separates the two terms and recovers the size from the intercept. (See the sample record for a worked case.)

### What the model cannot tell you

The uniform-deformation model assumes strain is isotropic; anisotropic strain, stacking faults and a size distribution all modify the peak shapes in ways that mimic or hide strain. A Williamson–Hall line is a *consistency check* of a simple model, not a measurement of microstructure. A real analysis fits the profile shapes (Rietveld, or single-peak pseudo-Voigt fits) and reports parameter uncertainties from the fit covariance.

## Check Your Understanding

1. Index the first four reflections of ZnO from $a$ and $c$ and show that they fall at the 2$\theta$ values in the table.
2. A peak at $2\theta=31.77^\circ$ is read to $\pm0.02^\circ$. What is the relative uncertainty in $d$? Compare with a peak at $80^\circ$ and explain which you would use to determine $a$.
3. The Scherrer sizes of four peaks fall from 10.5 nm at low angle to 9.4 nm at high angle. What does this suggest, and what analysis would you do next?
4. A student fits Williamson–Hall to three peaks and gets $R^2=0.999$. Why is that not convincing? What is the 95 % interval factor?
5. Why can the Scherrer equation only give a *lower bound* on the crystallite size, and why is it not the same as the grain size from TEM?
6. Two peaks overlap. How would including both in a single Scherrer calculation bias $D$?
7. Why do preferred-orientation effects change peak intensities but not positions? What could you do experimentally to reduce them?
8. A secondary phase gives a peak 3 % of the height of the strongest ZnO peak. In a noisy scan, why might you miss it, and what does "phase-pure" mean when you report it?
9. Why does the instrumental correction matter more for a nanocrystal with $D=80$ nm than for one with $D=10$ nm?

## Advanced Techniques and Future Directions

*   **Rietveld Refinement:** Fits the entire diffraction pattern rather than individual peaks, refining lattice constants, atomic coordinates, thermal factors, and preferred orientation (e.g., using the March–Dollase model).
*   **Synchrotron PXRD:** Offers an extremely bright beam, tunable wavelengths, and high angular resolution, ideal for battery cycling and nanomaterials.
*   **Pair Distribution Function (PDF):** While conventional PXRD probes long-range order, PDF transforms total scattering data into real-space local atomic structure, vital for amorphous solids, glasses, and extremely small nanoparticles.
*   **Operando PXRD:** Real-time measurements during device operation (e.g., lithium-ion batteries, fuel cells).
*   **Machine Learning:** Deep learning models classify diffraction patterns in milliseconds, enabling automated phase ID, crystal system prediction, and high-throughput materials discovery.

## Best Practices and Limitations

Sample preparation is often more critical than instrument settings.

*   Grind gently to avoid introducing artificial microstrain.
*   Minimize preferred orientation by side-loading or back-loading.
*   Always watch for a trace impurity phase; weak reflections are easily misjudged. Complementary techniques (TEM, XPS) set true detection limits.
*   Use an internal standard (like Si) for accurate lattice parameters.

*Limitations:* PXRD struggles with locating light atoms (like hydrogen; better suited for neutron diffraction), very low-concentration impurities, and completely amorphous structures. Severe peak overlap in low-symmetry materials necessitates advanced whole-pattern refinement.

## Common Software Ecosystem

| Software | Primary Purpose |
| :--- | :--- |
| **GSAS-II / FullProf** | Rietveld refinement and magnetic structures |
| **TOPAS** | Commercial whole-pattern profile refinement |
| **HighScore Plus** | Search-match phase identification |
| **MAUD** | Texture, stress, and microstructural analysis |
| **CView** | Crystal structure visualization |
