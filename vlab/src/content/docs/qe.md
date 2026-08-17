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

The cutoff study holds the cell at 14 Å. The vacuum study holds `ecutwfc` at 30 Ry and changes the cell from 10 to 18 Å. This one-variable-at-a-time design makes the cause of each trend interpretable. A practical report should state a tolerance, for example

$$|E_g(p_j)-E_g(p_{j-1})|<0.05\ \mathrm{eV},$$

and justify the cheapest parameter value satisfying it. A molecule in a large cell needs only the $\Gamma$ point; crystalline solids require a separately converged $k$-point mesh.

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

## 11. Reproducibility and limitations

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
