# Sample Record Book — UV-Vis Spectroscopy

*This is a worked example of a completed record. Use it as a reference for
the level of detail and layout expected in your own submitted record. The
derived values follow from the quoted inputs and from the lab's own
confinement model (ZnO: bulk $E_g$ = 3.37 eV, $m_e^*$ = 0.24, $m_h^*$ = 0.45).*

**Sample ID:** ZnO-sol-unknown-05
**Operator:** J. Rao
**Technique (simulated):** UV-Vis absorbance, 250–800 nm
**Mode:** Unknown sample

## 1. Objective

Determine the band gap and approximate particle size of an unlabelled
ZnO nanoparticle sol from its simulated UV-Vis absorbance spectrum, with
uncertainties.

## 2. Tauc plot fit

Both transforms were tried. The direct transform ($n = 2$) was linear over
a clear window; the indirect transform ($n = 1/2$) was visibly curved across
the same window. Selected: **direct** ($n = 2$), consistent with ZnO.

| Quantity | Value |
|---|---|
| Fit region (hν) | 3.65 – 3.95 eV (0.30 eV wide, rising edge only) |
| Slope $m$ | 1.910 |
| Intercept $b$ | −7.147 |
| $R^2$ of fit | 0.994 |
| $E_g$(fit) = −$b/m$ | **3.742 eV** |

## 3. Particle size estimate

Bulk $E_g$(ZnO) = 3.37 eV, so

$$
\Delta E = E_g(\text{fit}) - E_g^{\text{bulk}} = 3.742 - 3.370 = 0.372\ \text{eV}.
$$

The confinement term is $\Delta E = (K_0/R^2)(1/m_e^* + 1/m_h^*)$ with
$K_0 = h^2/8m_0 = 0.377$ eV nm². Solving for $R$:

$$
R=\sqrt{\frac{K_0\,(1/m_e^*+1/m_h^*)}{\Delta E}}
=\sqrt{\frac{0.377\times(4.167+2.222)}{0.372}}
=2.54\ \text{nm}.
$$

## 4. Uncertainty analysis

**Band gap.** Two contributions, combined in quadrature:

| Source | $u(E_g)$ (eV) | How obtained |
|---|---:|---|
| Regression (slope and intercept, including their covariance) | 0.011 | Standard error of the $x$-intercept from the fit |
| Fit-window choice | 0.015 | Spread of $E_g$ when the window was shifted by ±0.1 eV and narrowed to 0.2 eV |
| **Combined** | **0.019** | $\sqrt{0.011^2+0.015^2}$ |

The window term is larger than the regression term: *the fit window is the
real uncertainty*, not the line fit. A high $R^2$ does not remove it.

**Band-gap shift.** The literature bulk gap of ZnO is quoted between about
3.30 and 3.40 eV depending on source and temperature; take $u(E_g^{\text{bulk}})=0.03$ eV.

$$
u(\Delta E)=\sqrt{0.019^2+0.03^2}=0.035\ \text{eV}
\quad(9.5\ \%\ \text{of}\ 0.372\ \text{eV}).
$$

**Radius.** Since $R\propto\Delta E^{-1/2}$, the relative errors are halved:

$$
\frac{u_R}{R}=\frac12\frac{u(\Delta E)}{\Delta E}=4.7\ \%,
\qquad u_R=0.12\ \text{nm}.
$$

**Result:** $E_g = 3.742\pm0.019$ eV and $R = 2.54\pm0.12$ nm.

**Systematic (model) errors, not included above.**

| Source | Direction |
|---|---|
| Coulomb term omitted from the confinement model | $R$ overestimated (largest effect at small $R$) |
| Isotropic bulk effective masses | unknown; $R\propto\sqrt{1/m_e^*+1/m_h^*}$ so a 10 % mass error gives ≈ 5 % in $R$ |
| Single-size assumption | real samples have a size distribution; $R$ is an ensemble-weighted value |

## 5. Conclusion

The unknown sample is consistent with ZnO nanoparticles of radius
$R = 2.54\pm0.12$ nm (statistical and window uncertainty; the simplified
model biases it slightly high), blue-shifted from the bulk gap by quantum
confinement. On revealing the ground truth ($R$ = 2.5 nm) the estimate lies
within its uncertainty.

## 6. Reflection

The first fit attempt used a wider hν window that included part of the
flat pre-edge region, which pulled the intercept down and gave an
unphysically small $E_g$. Restricting the fit strictly to the visibly
linear rising portion of the Tauc plot fixed this. Quantifying how much
$E_g$ moved when the window moved (0.015 eV) was more informative than the
$R^2$ of any single fit: it shows the window matters as much as the data.

## 7. Submission quality check

- Attach the exported wavelength–energy–absorbance CSV.
- State the selected Tauc exponent, fit window, slope, intercept, and $R^2$.
- Explain why the fit window is physically appropriate, not merely linear.
- Give $E_g$ with both a regression and a window-sensitivity uncertainty.
- Propagate to the particle size (remember $R\propto\Delta E^{-1/2}$).
- Report the simplified confinement assumption and why the optical size need not equal PXRD crystallite size.
