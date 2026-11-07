# Record Book — Hall-Effect Measurement

## Experiment details

| Field | Entry |
|---|---|
| Student | ______________________________ |
| Date | ______________________________ |
| Sample / wafer ID | ______________________________ |
| Nominal carrier type (n / p) | ______________________________ |
| Temperature | ____________ K |
| Directions of $I$, $B$ and the $V_H$ leads | ______________________________ |

## 1. Aim

State in one sentence what you will determine ($R_H$, carrier type and density, $\rho$, $\mu_H$) and the uncertainty you aim for.

____________________________________________________________________

## 2. Geometry (with instrument resolution)

| Quantity | Value | Resolution / $u$ | Unit |
|---|---:|---:|---|
| Thickness $t$ | | | mm |
| Width $w$ | | | mm |
| Probe spacing $L$ | | | mm |

## 3. Raw data — field reversal

Record every reading in the units shown. Reverse $B$ without changing the wiring.

| $I$ (mA) | $V_H(+B)$ (µV) | $V_H(-B)$ (µV) | $V_H^{\mathrm{odd}}$ (µV) | $V_H(B{=}0)$ offset (µV) | $V_L(+B)$ (mV) | $V_L(-B)$ (mV) | $V_L^{\mathrm{even}}$ (mV) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

Show the symmetrisation explicitly for one row:

$$V_H^{\mathrm{odd}}=\frac{V_H(+B)-V_H(-B)}{2}=\underline{\hspace{2cm}}\ \mu\mathrm{V}.$$

## 4. Linearity check

Plot $V_H^{\mathrm{odd}}$ against $I$ (at fixed $B$) and, if the magnet allows, against $B$ (at fixed $I$).

| Fit | Slope | $u_{\mathrm{slope}}$ | Intercept | $R^2$ |
|---|---:|---:|---:|---:|
| $V_H^{\mathrm{odd}}$ vs $I$ | | | | |
| $V_H^{\mathrm{odd}}$ vs $B$ | | | | |

An intercept that is not zero within its uncertainty means an offset is still present. Comment:

____________________________________________________________________

## 5. Derived quantities (SI units)

Use the slope of the fit rather than a single reading: $R_H=\dfrac{t}{B}\dfrac{\mathrm d V_H^{\mathrm{odd}}}{\mathrm d I}$.

| Quantity | Value | Standard uncertainty | Unit |
|---|---:|---:|---|
| Hall coefficient $R_H$ | | | m³ C⁻¹ |
| Carrier type (sign of $R_H$) | | — | — |
| Carrier density $N=1/(e\lvert R_H\rvert)$ | | | m⁻³ |
| Resistivity $\rho=\dfrac{V_L^{\mathrm{even}}}{I}\dfrac{wt}{L}$ | | | Ω m |
| Hall mobility $\mu_H=\lvert R_H\rvert/\rho$ | | | m² V⁻¹ s⁻¹ |
| $\mu_H$ in practical units | | | cm² V⁻¹ s⁻¹ |

## 6. Uncertainty budget

Fill in the relative uncertainty of each input and its contribution to $u_{R_H}/\lvert R_H\rvert$. Combine in quadrature.

| Source | Relative uncertainty | Enters $R_H$ as | Contribution |
|---|---:|---|---:|
| $V_H$ (fit slope / voltmeter) | | $+1$ power | |
| Thickness $t$ | | $+1$ power | |
| Current $I$ | | $-1$ power | |
| Field $B$ (calibration) | | $-1$ power | |
| **Combined** $u_{R_H}/\lvert R_H\rvert$ | | | |

Which single term dominates, and what would you change to reduce it?

____________________________________________________________________

## 7. Comparison and discussion

1. Compare $N$ and $\mu_H$ with the manufacturer's or a literature value. Are they consistent within $2u$? If not, give two physical (not instrumental) reasons.

   ____________________________________________________________________

2. Is the measured carrier type the one you expected? What would a *sign change with temperature* imply?

   ____________________________________________________________________

3. Estimate the error if a thermoelectric offset of 2 µV were left in a Hall voltage of 13 µV.

   ____________________________________________________________________

## 8. Result

The wafer is __________ type, with $R_H=$ __________ $\pm$ __________ m³ C⁻¹, $N=$ __________ $\pm$ __________ m⁻³, $\rho=$ __________ $\pm$ __________ Ω m and $\mu_H=$ __________ $\pm$ __________ m² V⁻¹ s⁻¹. State the sign convention used.

## 9. Sources of error not captured by the budget

Contact misalignment (a fraction of $V_L$ appears in $V_H$), non-uniform field, Joule heating, finite sample aspect ratio, and the single-carrier assumption itself. Choose two and say how you tested for or bounded each.

____________________________________________________________________
