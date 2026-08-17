# Sample Record Book — PXRD

*This is a worked example of a completed record. Use it as a reference for
the level of detail and layout expected in your own submitted record.*

**Sample ID:** ZnO-unknown-07
**Operator:** P. Sarvanan
**Instrument (simulated):** Cu Kα₁, λ = 1.5406 Å
**Mode:** Unknown sample

## 1. Objective

Determine the crystallite size, microstrain, and phase purity of an
unlabelled ZnO nanopowder from its simulated diffractogram.

## 2. Raw peak measurements

| # | hkl | 2θ (°) | FWHM meas. (°) | FWHM corr. (°) | D (Scherrer, nm) |
|---|-----|--------|----------------|----------------|-------------------|
| 1 | (100) | 31.77 | 0.612 | 0.596 | 14.2 |
| 2 | (002) | 34.42 | 0.598 | 0.581 | 14.8 |
| 3 | (101) | 36.25 | 0.640 | 0.624 | 13.9 |
| 4 | (102) | 47.54 | 0.701 | 0.687 | 13.4 |

*(FWHM corr. = measured FWHM with the instrumental broadening, 0.09°,
removed in quadrature.)*

## 3. Williamson–Hall analysis

Plotting β cosθ (rad) against 4 sinθ for the four peaks above gives:

- **Intercept → D (size) ≈ 13.8 nm**
- **Slope → ε (microstrain) ≈ 0.31 %**

## 4. Phase identification

No secondary reflections were observed above the noise floor across the
scanned range (20–80° 2θ) → sample assessed as **phase-pure ZnO**.

## 5. Conclusion

The unknown sample is consistent with phase-pure ZnO nanoparticles with a
crystallite size of ~14 nm and microstrain of ~0.3%, in reasonable
agreement with the revealed ground truth (D = 14 nm, ε = 0.30%).

## 6. Reflection

The (102) peak gave a slightly larger apparent size than the others —
worth remembering that a single mis-measured peak can skew a Williamson–Hall
fit, which is why measuring several widely-spaced peaks matters more than
measuring many clustered ones.

## 7. Submission quality check

- Attach the exported peak CSV and identify the reflections used in the Williamson–Hall fit.
- State the W–H $R^2$, mean single-peak Scherrer size, and its spread.
- State a phase-purity hypothesis before disclosure and justify it with peak evidence.
- Distinguish crystallite size from particle or grain size.
