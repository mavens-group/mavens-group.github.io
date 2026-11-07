# Quantum ESPRESSO: Molecular HOMO–LUMO Gap

*This virtual lab is an offline workbench built from completed Quantum ESPRESSO 7.5 calculations. It teaches the calculation, convergence, diagnosis, and interpretation workflow without claiming that a static web page can execute `pw.x`.*

> For the full density-functional theory course treatment, use the companion **[DFT Class Notes](https://mavens-group.github.io/dft-notes/)** alongside this virtual lab.

## 1. Objectives

After completing the lab, a student should be able to:

1. construct an isolated-molecule calculation in a periodic supercell;
2. converge the plane-wave cutoff and vacuum size independently;
3. recognize SCF convergence in an iteration trace;
4. obtain the HOMO, LUMO, and Kohn–Sham gap from occupied and empty eigenvalues;
5. explain how Gaussian broadening converts discrete levels into a plotted DOS; and
6. parse a locally produced `pw.x` output and identify common failures.

## 2. Kohn–Sham calculation

Kohn–Sham density-functional theory replaces the interacting-electron problem by one-electron equations

$$
\left[-\frac{1}{2}\nabla^2+V_{\mathrm{ion}}(\mathbf r)+V_H[n](\mathbf r)+V_{\mathrm{xc}}[n](\mathbf r)\right]\psi_i(\mathbf r)
=\varepsilon_i\psi_i(\mathbf r).
$$

The electron density is reconstructed for a closed-shell system as

$$n(\mathbf r)=2\sum_{i=1}^{N_e/2}|\psi_i(\mathbf r)|^2.$$

Because $V_H$ and $V_{\mathrm{xc}}$ depend on $n$, the equations are solved self-consistently:

1. choose an initial density $n^{(0)}$;
2. construct the Kohn–Sham potential;
3. solve for $\psi_i$ and $\varepsilon_i$;
4. form an output density $n_{\mathrm{out}}$;
5. mix input and output densities; and
6. repeat until the residual and energy meet `conv_thr`.

The lab’s **Replay SCF trace** control reveals the total energy from each genuine archived iteration. It replays stored output; it does not simulate an SCF algorithm or execute QE in JavaScript.

## 3. Plane waves, cutoffs, and pseudopotentials

Under periodic boundary conditions, each orbital is expanded in plane waves,

$$\psi_i(\mathbf r)=\sum_{\mathbf G}c_{i\mathbf G}e^{i\mathbf G\cdot\mathbf r},$$

retaining terms whose kinetic energy satisfies

$$\frac{1}{2}|\mathbf G|^2\le E_{\mathrm{cut}}^{\mathrm{wfc}}.$$

Increasing `ecutwfc` enlarges the basis. `ecutrho` controls the charge-density grid; these PAW teaching inputs use $E_{\mathrm{cut}}^{\mathrm{rho}}=8E_{\mathrm{cut}}^{\mathrm{wfc}}$. A cutoff is acceptable only after the target observable—not merely whether the job finishes—has stabilized. Pseudopotentials must match the exchange–correlation functional and their recommended cutoffs must be checked for production work.

## 4. Isolated molecule in a periodic code

Quantum ESPRESSO repeats the unit cell. A molecule is approximated as isolated by centering it in a sufficiently large cubic cell. If the cell is too small, neighboring images interact and shift both total energy and frontier levels.

The cutoff study holds the cell at 14 Å. The vacuum study holds `ecutwfc` at 30 Ry and changes the cell from 10 to 18 Å. This one-variable-at-a-time design makes the cause of each trend interpretable. A practical report should state a tolerance $\tau$ and test the observable against the **best-converged point** $p_\mathrm{ref}$ of the sweep,

$$|E_g(p_j)-E_g(p_\mathrm{ref})|<\tau,\qquad \tau=0.05\ \mathrm{eV},$$

and justify the cheapest parameter value that satisfies it. Section 11 shows with the archived data why comparing only with the *previous* point is not safe. A molecule in a large cell needs only the $\Gamma$ point; crystalline solids require a separately converged $k$-point mesh.

## 5. Reading the input

- `&CONTROL` selects an SCF calculation and defines the prefix and working directories.
- `&SYSTEM` defines the cell, atom and species counts, cutoffs, occupations, and number of bands.
- `&ELECTRONS` sets the SCF threshold and mixing.
- `ATOMIC_SPECIES` maps each species to a pseudopotential.
- `ATOMIC_POSITIONS angstrom` supplies the centered geometry.
- `K_POINTS gamma` samples the isolated supercell at $\Gamma$.

There must be enough `nbnd` values to include unoccupied orbitals. Otherwise the HOMO can be printed but the LUMO cannot be determined.

## 6. HOMO, LUMO, and gap

For a neutral, non-spin-polarized, closed-shell molecule with fixed occupations, each orbital holds two electrons. The occupied orbital count is $N_e/2$. Therefore

$$
\varepsilon_{\mathrm{HOMO}}=\varepsilon_{N_e/2},\qquad
\varepsilon_{\mathrm{LUMO}}=\varepsilon_{N_e/2+1},
$$

and the plotted quantity is

$$E_g^{\mathrm{KS}}=\varepsilon_{\mathrm{LUMO}}-\varepsilon_{\mathrm{HOMO}}.$$

Open-shell, spin-polarized, charged, fractionally occupied, and metallic systems need a more careful occupation analysis. The simple indexing rule used here does not apply unchanged.

## 7. Density of states and broadening

An ideal molecular spectrum is a sum of delta functions. The interactive plot replaces every level by a normalized Gaussian,

$$
D_\sigma(E)=2\sum_i\frac{1}{\sigma\sqrt{2\pi}}
\exp\left[-\frac{(E-\varepsilon_i)^2}{2\sigma^2}\right].
$$

The factor two counts spin degeneracy. Its integral,

$$N(E)=\int_{-\infty}^{E}D_\sigma(E')\,dE',$$

approaches two additional states after crossing each non-degenerate orbital. Moving the broadening slider recomputes this curve in the browser from the archived eigenvalues. Broader peaks improve visual continuity but reduce spectral resolution; their width is not a molecular lifetime.

The generated `dos.x` input expresses broadening as `degauss` in Ry, using $1\ \mathrm{Ry}=13.605693\ \mathrm{eV}$.

## 8. Orbitals

The two colors of an orbital isosurface represent opposite wavefunction phases, not positive and negative charge. Nodes are regions where the wavefunction changes sign. The browser’s orbital panels are intentionally labeled **qualitative**: eigenvalues alone cannot reconstruct a three-dimensional wavefunction.

For quantitative surfaces, run `pp.x` after SCF, select the Kohn–Sham state (wavefunction contribution), export a cube or XSF grid, and inspect that volumetric data in a scientific visualizer.

## 9. Using the workbench

1. Select a molecule.
2. Open **Cutoff study** and compare the gap and total-energy difference. Select an acceptable cutoff.
3. Open **Vacuum study** and repeat for cell length.
4. Inspect or download the generated `pw.x` and `dos.x` inputs.
5. Replay the selected run’s archived SCF trace and verify convergence.
6. Compare the occupied/unoccupied ladder with the interactive DOS.
7. Change $\sigma$ and describe which features change and which do not.
8. If you have a QE output, use **Import .out**. Parsing is local and no file leaves the browser.
9. Use **Troubleshoot** to connect symptoms to input or convergence remedies.

## 10. What the result does—and does not—mean

The result is a ground-state PBE Kohn–Sham eigenvalue difference. It is not automatically the fundamental gap $I-A$, nor an optical excitation energy. Semilocal functionals omit the exact derivative discontinuity and commonly underestimate excitation gaps. Depending on the intended observable, a more defensible calculation may require $\Delta$SCF, a hybrid functional, GW, or time-dependent DFT.

## 11. Convergence criteria: a worked example from the archived data

The cutoff sweep (cell 14 Å) gives the following Kohn–Sham gaps. The last column is the error against the 50 Ry point, which is the most converged value available.

| Molecule | `ecutwfc` (Ry) | $E_g$ (eV) | change from previous (eV) | error vs 50 Ry (eV) |
|---|---:|---:|---:|---:|
| Benzene | 20 | 5.1413 | — | +0.0395 |
| | 25 | 5.1107 | 0.0306 | +0.0089 |
| | 30 | 5.1050 | 0.0057 | +0.0032 |
| | 40 | 5.1021 | 0.0029 | +0.0003 |
| | 50 | 5.1018 | 0.0003 | 0 |
| Formaldehyde | 20 | 3.6647 | — | +0.1100 |
| | 25 | 3.6187 | 0.0460 | +0.0640 |
| | 30 | 3.5737 | 0.0450 | +0.0190 |
| | 40 | 3.5526 | 0.0211 | −0.0021 |
| | 50 | 3.5547 | 0.0021 | 0 |
| Ammonia | 20 | 5.2677 | — | −0.1333 |
| | 25 | 5.2965 | 0.0288 | −0.1045 |
| | 30 | 5.3653 | 0.0688 | −0.0357 |
| | 40 | 5.3922 | 0.0269 | −0.0088 |
| | 50 | 5.4010 | 0.0088 | 0 |

With $\tau=0.05$ eV:

| Molecule | First point with *change from previous* $<\tau$ | Error of that point vs 50 Ry | First point with *error vs 50 Ry* $<\tau$ |
|---|---:|---:|---:|
| Benzene | 25 Ry | 0.009 eV | 20 Ry |
| Formaldehyde | 25 Ry | **0.064 eV** | 30 Ry |
| Ammonia | 25 Ry | **0.105 eV** | 30 Ry |

For formaldehyde and ammonia the "change from previous" rule stops too early: successive differences can be small while the quantity is still drifting, and for ammonia the gap *rises* as the cutoff does, so the steps do not shrink monotonically. Three practical rules follow:

1. compare with the most converged point, not the preceding one;
2. require that the **next** point also lies within $\tau$, to guard against a non-monotonic sweep;
3. the reference point is itself not exactly converged (ammonia is still changing by 9 meV between 40 and 50 Ry), so report the residual as an uncertainty, not as zero.

### 11.1 Total energy converges more slowly than the gap

The total energy depends on every core and valence electron, whereas the gap is a difference of two valence eigenvalues in which most of the basis-set error cancels. For benzene the total energy still changes by 4.4 mRy (0.06 eV) between 40 and 50 Ry although the gap has changed by only 0.3 meV. For formaldehyde the total energy at 20 Ry is about 2.0 Ry (27 eV) above its 50 Ry value, yet the gap is only 0.11 eV off. **The tolerance must be set for the observable you intend to report.** A cutoff that converges the gap says nothing about whether total-energy *differences* (reaction energies, binding energies) are converged.

### 11.2 Vacuum sweep: the gap converges, the eigenvalues do not

In the cell sweep (`ecutwfc` = 30 Ry) benzene gives:

| Cell (Å) | HOMO (eV) | LUMO (eV) | $E_g$ (eV) |
|---:|---:|---:|---:|
| 10 | −5.6891 | −0.5907 | 5.0984 |
| 12 | −5.9541 | −0.8506 | 5.1035 |
| 14 | −6.0902 | −0.9852 | 5.1050 |
| 16 | −6.1672 | −1.0609 | 5.1063 |
| 18 | −6.2137 | −1.1074 | 5.1063 |

Both frontier levels move by about 0.5 eV while their difference moves by 8 meV. In a periodic code the zero of the Kohn–Sham potential is set by the cell-averaged electrostatic potential, not by the vacuum level, so **individual eigenvalues have no absolute meaning**; only differences between levels of the same calculation do. A HOMO from this calculation is not $-I$ unless it is aligned to the vacuum potential (for example by reading the potential in the vacuum region of the cell).

The total energy is noisy at the 0.5 mRy level (for benzene, $E(16\ \text{Å})-E(14\ \text{Å})=-0.2$ mRy but $E(18\ \text{Å})-E(16\ \text{Å})=+0.7$ mRy), which is consistent with the discretisation of the density grid relative to the moving cell. Differences below roughly 1 mRy should not be interpreted.

### 11.3 A system that does not converge as quickly: ammonia

Ammonia's gap changes from 5.214 eV (10 Å) to 5.394 eV (18 Å), still moving by 7.5 meV in the last step. Ammonia has a permanent dipole, and its LUMO is more diffuse than those of the other three molecules. Both properties are expected to make isolated-molecule convergence slower, because periodic images interact through the dipole field and a diffuse orbital sees the cell boundary. This lab did not test the cause, but the standard remedies are a larger cell or a dipole correction, which is outside this lab's scope. Use ammonia as a **warning case**: a tolerance that is satisfied for benzene may not be for another molecule in the same workflow.

## 12. Uncertainty and error analysis

Numerical uncertainty and model uncertainty must be separated.

| Source | Type | Estimate for benzene |
|---|---|---|
| Plane-wave cutoff | numerical | gap at 30 Ry differs from 50 Ry by 0.003 eV |
| Cell size (vacuum) | numerical | gap at 14 Å differs from 18 Å by 0.001 eV |
| SCF threshold `conv_thr` | numerical | the energy error is second order in the density error, but eigenvalues are first order: a `conv_thr` of $10^{-6}$ Ry can leave errors of order $\sqrt{10^{-6}}\,\mathrm{Ry}\approx14$ meV in the worst case; tighten it and repeat to check |
| Fixed geometry | model | a relaxed geometry would change the gap; not studied here |
| Exchange–correlation functional (PBE) | model | the dominant error; see below |

Combining the two numerical convergence errors in quadrature, $\sqrt{0.003^2+0.001^2}\approx0.003$ eV, benzene's gap is $5.105\pm0.003$ eV *as a PBE Kohn–Sham gap at fixed geometry*. That is a statement about the numerical procedure only.

The **model** error is far larger. The PBE Kohn–Sham gap of about 5.1 eV is not the fundamental gap $I-A$; for benzene the measured $I\approx9.2$ eV and $A\approx-1.1$ eV give a fundamental gap near 10 eV, about twice the Kohn–Sham value. It is also not the lowest optical excitation (about 4.9 eV), which happens to be close by coincidence of error cancellation rather than by principle. A result quoted as $5.105\pm0.003$ eV is therefore *precise* but is not *accurate* for any experimental observable.

## 13. Suggested procedure

1. For each molecule, tabulate the gap against cutoff and compute the error against 50 Ry. Select the cheapest cutoff that satisfies $\tau=0.05$ eV *and* whose next point also does.
2. Repeat for the cell sweep. Compute the HOMO and LUMO shifts as well as the gap shift.
3. For one molecule, compare the cutoff chosen by "change from previous" with the one chosen by "error vs 50 Ry". Do they differ?
4. Replay the SCF trace. Plot $\log_{10}$ of the estimated accuracy against iteration and read the convergence rate.
5. Change the Gaussian $\sigma$ and identify which features of the DOS are properties of the molecule and which are properties of $\sigma$.
6. State the numerical uncertainty and the model uncertainty separately.

## 14. Check your understanding

1. A colleague accepts the first cutoff where the gap changes by less than 0.05 eV from the previous point. Use the formaldehyde data to show that this can give an error larger than 0.05 eV.
2. Why does the benzene gap converge to 0.3 meV by 50 Ry while its total energy is still changing by 4.4 mRy?
3. The benzene HOMO moves by 0.5 eV between 10 Å and 18 Å, yet the gap barely changes. Explain, and say why you cannot take the HOMO energy as the ionisation energy.
4. Why is it legitimate to use only the $\Gamma$ point for these molecules but not for a crystal?
5. The SCF trace shows the estimated accuracy falling by roughly a factor of 8 per iteration. What does that say about the mixing, and what would a flat or oscillating trace suggest you change?
6. The benzene Kohn–Sham gap is 5.1 eV; the measured fundamental gap is about 10 eV. Name the missing physics in the semilocal functional that explains the difference.
7. Ammonia's gap is still changing at 18 Å. Give two physical reasons and one way to test each.
8. You are asked for the energy of a reaction using total energies from this lab. Which of the converged tolerances above is relevant, and is it satisfied?

## 15. Reproducibility and limitations

- The bundled sweep points are completed QE 7.5 PBE/PAW, $\Gamma$-point calculations; replay does not invoke a native executable.
- Geometries are fixed rather than relaxed.
- Only neutral, closed-shell, non-spin-polarized molecules are included.
- The sweep is designed for teaching; production values must follow the chosen pseudopotential’s recommendations and a stated tolerance.
- Qualitative orbital drawings are not volumetric QE results.
- Charged-cell corrections, dipole corrections, spin–orbit coupling, and finite-temperature occupations are outside this lab.

## Further reading

- MAVENs Group, **[Density Functional Theory Class Notes](https://mavens-group.github.io/dft-notes/)**.
- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **21**, 395502 (2009).
- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **29**, 465901 (2017).
- Quantum ESPRESSO input documentation for `pw.x`, `dos.x`, and `pp.x`.
