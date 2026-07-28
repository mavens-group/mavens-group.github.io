# Sample Record Book — UV-Vis Spectroscopy

*This is a worked example of a completed record. Use it as a reference for
the level of detail and layout expected in your own submitted record.*

**Sample ID:** ZnO-sol-unknown-05
**Operator:** J. Rao
**Technique (simulated):** UV-Vis absorbance, 250–800 nm
**Mode:** Unknown sample

## 1. Objective

Determine the band gap and approximate particle size of an unlabelled
ZnO nanoparticle sol from its simulated UV-Vis absorbance spectrum.

## 2. Tauc plot fit

Assumed transition type: **direct** ($n = 2$), consistent with ZnO.

| Quantity | Value |
|---|---|
| Fit region (hν) | 3.55 – 3.90 eV |
| Slope | 1.842 |
| Intercept | −6.781 |
| $R^2$ of fit | 0.994 |
| $E_g$(fit) = −intercept / slope | **3.681 eV** |

## 3. Particle size estimate

Bulk $E_g$(ZnO) = 3.37 eV, so:

$$
\Delta E = E_g(\text{fit}) - E_g^{\text{bulk}} = 3.681 - 3.370 = 0.311 \text{ eV}
$$

Solving the kinetic confinement term for $R$ gives an estimated particle
radius of **≈ 2.4 nm**.

## 4. Conclusion

The unknown sample is consistent with ZnO nanoparticles of radius
≈ 2.4 nm, blue-shifted from the bulk gap by quantum confinement. This is
in reasonable agreement with the revealed ground truth (R = 2.5 nm).

## 5. Reflection

The first fit attempt used a wider hν window that included part of the
flat pre-edge region, which pulled the intercept down and gave an
unphysically small $E_g$. Restricting the fit strictly to the visibly
linear rising portion of the Tauc plot (and checking $R^2$) fixed this —
a reminder that the fit window matters as much as the data itself.
