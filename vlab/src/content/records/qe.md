# Sample Record Book — Quantum ESPRESSO HOMO–LUMO Gap

**System:** Benzene (C₆H₆)  
**Method:** PBE/PAW, plane-wave DFT  
**Code:** Quantum ESPRESSO `pw.x` (simulated)  
**Boundary condition:** 18 Å cubic supercell, $\Gamma$ point

## 1. Objective

Determine the converged Kohn–Sham HOMO–LUMO gap of neutral, closed-shell benzene.

## 2. Convergence study

| $E_\mathrm{cut}^{\mathrm{wfc}}$ (Ry) | Cell (Å) | Gap (eV) | Change (eV) |
|---:|---:|---:|---:|
| 30 | 18 | 4.91 | — |
| 40 | 18 | 4.81 | 0.10 |
| 50 | 18 | 4.77 | 0.04 |
| 60 | 18 | 4.76 | 0.01 |

The wavefunction cutoff was accepted at 50 Ry for a 0.05 eV tolerance. A separate cell-size test gave changes below 0.05 eV from 16 to 18 Å.

## 3. SCF settings

`ecutwfc = 50 Ry`, `ecutrho = 400 Ry`, `conv_thr = 1.0d-8`, fixed occupations, 19 bands, and PBE PAW pseudopotentials for C and H.

## 4. Frontier eigenvalues

| Quantity | Value |
|---|---:|
| Valence electrons | 30 |
| Occupied orbital pairs | 15 |
| HOMO eigenvalue | −6.20 eV |
| LUMO eigenvalue | −1.43 eV |
| $\varepsilon_\mathrm{LUMO}-\varepsilon_\mathrm{HOMO}$ | **4.77 eV** |

## 5. Conclusion

The converged PBE Kohn–Sham HOMO–LUMO gap is **4.77 eV** at the stated numerical settings. This value must not be presented as an experimental optical gap: it is a ground-state Kohn–Sham eigenvalue difference and is functional-dependent.

## 6. Precautions

- Use pseudopotentials generated for the same exchange–correlation functional.
- Include enough empty bands to obtain the LUMO.
- Converge cutoff and cell length independently.
- Confirm SCF convergence and `JOB DONE` before reading eigenvalues.
- State whether the calculation is spin-polarized and how occupations are assigned.
