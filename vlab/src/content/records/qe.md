# Sample Record Book — Quantum ESPRESSO HOMO–LUMO Gap

**System:** Benzene (C₆H₆)  
**Method:** PBE/PAW, plane-wave DFT  
**Code:** Quantum ESPRESSO 7.5 (`pw.x` and `dos.x`)  
**Boundary condition:** 14 Å cubic supercell, $\Gamma$ point

## 1. Objective

Determine the converged Kohn–Sham HOMO–LUMO gap of neutral, closed-shell benzene.

## 2. Recorded calculation

| $E_\mathrm{cut}^{\mathrm{wfc}}$ (Ry) | Cell (Å) | Gap (eV) |
|---:|---:|---:|
| 30 | 14 | 5.1050 |

This bundled reference is one completed calculation, not by itself a convergence study. Before using the value quantitatively, repeat the calculation at larger cutoffs and cell sizes and document the change in the gap.

## 3. SCF settings

`ecutwfc = 30 Ry`, `ecutrho = 240 Ry`, `conv_thr = 1.0d-6`, fixed occupations, 21 bands, and PBE PAW pseudopotentials for C and H. The SCF calculation converged in 8 iterations to a total energy of −117.63020777 Ry.

## 4. Frontier eigenvalues

| Quantity | Value |
|---|---:|
| Valence electrons | 30 |
| Occupied orbital pairs | 15 |
| HOMO eigenvalue | −6.0902 eV |
| LUMO eigenvalue | −0.9852 eV |
| $\varepsilon_\mathrm{LUMO}-\varepsilon_\mathrm{HOMO}$ | **5.1050 eV** |

## 5. Conclusion

The recorded PBE Kohn–Sham HOMO–LUMO gap is **5.1050 eV** at the stated numerical settings. The `dos.x` result uses 0.02 Ry Gaussian broadening. This value must not be presented as an experimental optical gap: it is a ground-state Kohn–Sham eigenvalue difference and is functional-dependent.

## 6. Precautions

- Use pseudopotentials generated for the same exchange–correlation functional.
- Include enough empty bands to obtain the LUMO.
- Converge cutoff and cell length independently.
- Confirm SCF convergence and `JOB DONE` before reading eigenvalues.
- State whether the calculation is spin-polarized and how occupations are assigned.
