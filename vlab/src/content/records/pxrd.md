# Sample Record Book — PXRD

*This is a worked example of a completed record. Use it as a reference for
the level of detail and layout expected in your own submitted record. All
numbers are internally consistent: you can reproduce every derived value
from the raw table.*

**Sample ID:** ZnO-unknown-07
**Operator:** P. Sarvanan
**Instrument (simulated):** Cu Kα₁, λ = 0.15406 nm
**Mode:** Unknown sample

## 1. Objective

Determine the crystallite size, microstrain, and phase purity of an
unlabelled ZnO nanopowder from its simulated diffractogram, and state the
uncertainty of each.

## 2. Raw peak measurements

Instrumental broadening β_inst = 0.09° is removed in quadrature:
β_corr = √(β_meas² − β_inst²). Scherrer constant K = 0.9.

| # | hkl | 2θ (°) | FWHM meas. (°) | FWHM corr. (°) | D (Scherrer, nm) |
|---|-----|--------|----------------|----------------|-------------------|
| 1 | (100) | 31.77 | 0.795 | 0.790 | 10.5 |
| 2 | (002) | 34.42 | 0.809 | 0.804 | 10.3 |
| 3 | (101) | 36.25 | 0.829 | 0.824 | 10.1 |
| 4 | (102) | 47.54 | 0.923 | 0.919 | 9.4 |

Sample calculation, peak 1: β_corr = √(0.795² − 0.09²) = 0.790° = 0.01379 rad;
D = Kλ/(β cosθ) = (0.9 × 0.15406)/(0.01379 × cos 15.885°) = 10.5 nm.

The Scherrer sizes **fall steadily with 2θ** (10.5 → 9.4 nm; mean 10.1 nm,
standard deviation 0.5 nm). A single-size model would give the same D for
every peak, so this trend already signals a second broadening mechanism.

## 3. Williamson–Hall analysis

| # | 4 sin θ | β_corr cos θ (rad) |
|---|---------|--------------------|
| 1 | 1.0948 | 0.01326 |
| 2 | 1.1835 | 0.01340 |
| 3 | 1.2444 | 0.01367 |
| 4 | 1.6123 | 0.01467 |

Ordinary least squares of β cosθ against 4 sinθ (n = 4, 2 degrees of freedom):

| Quantity | Value | Standard error |
|---|---:|---:|
| Slope (= ε) | 0.00279 | 0.00015 |
| Intercept (= Kλ/D) | 0.01017 | 0.00019 |
| R² | 0.995 | — |

- **Size:** D = Kλ/intercept = 0.9 × 0.15406 / 0.01017 = **13.6 nm**
- **Microstrain:** ε = slope = **0.28 %**

## 4. Uncertainty analysis

**Statistical (fit).** The relative error of D equals the relative error of
the intercept: u_D/D = 0.00019/0.01017 = 1.9 %, so u_D = 0.3 nm. With only
2 degrees of freedom the 95 % interval needs Student's *t* = 4.30, not 2:

- D = 13.6 ± 1.1 nm (95 %)
- ε = 0.28 ± 0.06 % (95 %)

**Systematic.** These are *not* in the fit error and are usually larger.

| Source | Effect | Size |
|---|---|---|
| Scherrer constant K | D ∝ K; K lies in 0.62–2.08 depending on shape and hkl | the dominant systematic; the value 0.9 assumes near-spherical crystallites |
| Instrument width | β_inst uncertain by, say, ±0.01° changes β_corr by ≈ 0.001° | negligible here since β ≫ β_inst |
| Peak-position / FWHM reading | ±0.005° FWHM scatter is already reflected in the fit residuals | included in the statistical error |
| Strain model | uniform-deformation (isotropic) model assumed | not tested with 4 peaks |

**Why the two size estimates disagree.** The Scherrer sizes (≈ 10 nm) lie
well below the Williamson–Hall size (13.6 nm). This is expected: Scherrer
assumes all broadening is size broadening, so strain broadening is
mistakenly read as extra size broadening and D is underestimated. The
Williamson–Hall intercept separates the two contributions.

## 5. Phase identification

No secondary reflections were observed above the noise floor across the
scanned range (20–80° 2θ) → sample assessed as **phase-pure ZnO** *within
the detection limit of this scan* (a few per cent for a laboratory
instrument; a lower-level impurity would not be seen).

## 6. Conclusion

The unknown sample is consistent with phase-pure ZnO with crystallite size
D = 13.6 ± 1.1 nm and microstrain ε = 0.28 ± 0.06 % (95 % confidence, fit
only; D carries an additional systematic uncertainty from K). On revealing
the ground truth (D = 14 nm, ε = 0.30 %) both values lie inside the stated
intervals.

## 7. Reflection

Reading the Scherrer sizes alone would have given ≈ 10 nm, about 30 %
too small. The downward trend of D with 2θ was the clue that strain was
present; Williamson–Hall recovered the true size. With only four peaks
the fit has two degrees of freedom, which is why the 95 % interval is
more than four times the standard error — a larger peak set would
tighten it considerably.

## 8. Submission quality check

- Attach the exported peak-table CSV.
- Show one worked Scherrer calculation and the Williamson–Hall regression, with standard errors.
- State the fit's degrees of freedom and use the matching *t* factor for the interval.
- Name the Scherrer constant used and its effect on D.
- Say what the phase-purity statement does and does not exclude.
