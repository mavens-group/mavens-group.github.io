# Sample Record Book — Quantum ESPRESSO Molecular Gap

**System:** Benzene (C₆H₆)  
**Method:** PBE/PAW plane-wave DFT  
**Code:** Quantum ESPRESSO 7.5 (`pw.x`)  
**Sampling:** $\Gamma$ point; fixed occupations; 21 bands

## 1. Aim

Converge the plane-wave cutoff and cubic supercell, then determine the Kohn–Sham HOMO–LUMO gap of neutral, closed-shell benzene.

## 2. Numerical setup

PBE PAW pseudopotentials were used for C and H. `ecutrho` was maintained at eight times `ecutwfc`, `conv_thr = 1.0d-6`, and `mixing_beta = 0.4`. The molecular geometry was held fixed and centered as the cell changed.

## 3. Cutoff convergence

Hold the cell at 14 Å and transcribe the five points from the workbench.

| `ecutwfc` (Ry) | `ecutrho` (Ry) | Total energy (Ry) | Gap (eV) | $\lvert\Delta E_g\rvert$ from previous (eV) | $\lvert E_g-E_g(50)\rvert$ (eV) |
|---:|---:|---:|---:|---:|---:|
| 20 | 160 |  |  | — |  |
| 25 | 200 |  |  |  |  |
| 30 | 240 |  |  |  |  |
| 40 | 320 |  |  |  |  |
| 50 | 400 |  |  | | 0 |

**Tolerance $\tau$:** ____________ eV. Select the cheapest cutoff for which the error against 50 Ry is below $\tau$ *and* the next point also is.

**Chosen cutoff:** ____________ Ry. Would the "change from previous" rule have chosen the same value? ____________

## 4. Vacuum convergence

Hold `ecutwfc = 30 Ry` and transcribe the five points.

| Cell length (Å) | Total energy (Ry) | HOMO (eV) | LUMO (eV) | Gap (eV) |
|---:|---:|---:|---:|---:|
| 10 |  |  |  |  |
| 12 |  |  |  |  |
| 14 |  |  |  |  |
| 16 |  |  |  |  |
| 18 |  |  |  |  |

By how much did the HOMO move between 10 and 18 Å? ____________ eV. By how much did the gap? ____________ eV. Why are these so different, and which of them is a physically meaningful quantity?

____________________________________________________________________

**Chosen cell and tolerance:** ____________________________________________

## 5. SCF convergence

For the selected archived run, record the total energy after each displayed SCF iteration and explain how the estimated accuracy changes.

| Iteration | Total energy (Ry) | Estimated accuracy (Ry) |
|---:|---:|---:|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| … |  |  |

The run is accepted only if the output reports convergence and terminates with `JOB DONE`.

## 6. Frontier levels

| Quantity | Recorded value |
|---|---:|
| Valence electrons | 30 |
| Occupied orbital pairs | 15 |
| HOMO, $\varepsilon_{15}$ |  |
| LUMO, $\varepsilon_{16}$ |  |
| $E_g^{\mathrm{KS}}=\varepsilon_{16}-\varepsilon_{15}$ |  |

Show the subtraction explicitly:

$$E_g^{\mathrm{KS}}=\underline{\hspace{2cm}}-\left(\underline{\hspace{2cm}}\right)=\underline{\hspace{2cm}}\ \mathrm{eV}.$$

## 7. DOS exercise

Record what happens when Gaussian $\sigma$ is changed from 0.10 to 0.50 eV.

| Observation | Changes? | Reason |
|---|---|---|
| Peak width and height |  |  |
| Peak position |  |  |
| HOMO–LUMO gap |  |  |
| Final integrated state count |  |  |

## 8. Uncertainty and error analysis

Numerical uncertainty (this lab can quantify it):

| Source | Estimate (eV) | How obtained |
|---|---:|---|
| Cutoff | | $\lvert E_g(\text{chosen})-E_g(50)\rvert$ |
| Cell size | | $\lvert E_g(\text{chosen cell})-E_g(18\ \text{Å})\rvert$ |
| SCF threshold | | State `conv_thr` and the estimated accuracy of the last iteration |
| **Combined (quadrature)** | | |

Model uncertainty (this lab cannot quantify it; name each and say in which direction it acts):

| Source | Direction / size |
|---|---|
| Functional (PBE, semilocal) | |
| Fixed geometry | |
| Isolated-molecule approximation | |

Which is larger, numerical or model uncertainty? What does that imply about how many digits of the gap are worth reporting?

____________________________________________________________________

## 9. Conclusion

Report the selected cutoff, cell length, SCF cycles, total energy, HOMO, LUMO, Kohn–Sham gap, and the numerical uncertainty with the model uncertainty stated separately. State explicitly that the value is a PBE Kohn–Sham eigenvalue gap rather than an experimental optical or fundamental gap.

## 10. Precautions

- Match pseudopotentials to the exchange–correlation functional.
- Include enough empty bands to obtain the LUMO.
- Converge cutoff and cell size independently.
- Confirm both SCF convergence and `JOB DONE` before reading eigenvalues.
- Do not interpret artificial DOS broadening as a physical lifetime.
- State the spin and occupation assumptions with every reported gap.
