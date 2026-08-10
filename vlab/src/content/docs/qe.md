# Quantum ESPRESSO: HOMO–LUMO Gap of an Isolated Molecule

*This virtual lab teaches the workflow used to obtain frontier-orbital energies and a density of states from a plane-wave DFT calculation using completed Quantum ESPRESSO 7.5 runs.*

The lab bundles real `pw.x` eigenvalues and `dos.x` output for benzene, ethylene, formaldehyde, and ammonia, so it works on static hosting. The SCF and DOS tabs show the corresponding inputs with portable paths. Clicking **Run calculation** does not execute Quantum ESPRESSO in the browser; it loads and plots the matching completed dataset immediately.

## 1. Objective

Prepare a finite molecule in a periodic supercell, converge the plane-wave basis and cell size, run a self-consistent field (SCF) calculation with `pw.x`, and calculate

$$E_{\mathrm{gap}}^{\mathrm{KS}} = \varepsilon_{\mathrm{LUMO}} - \varepsilon_{\mathrm{HOMO}}.$$

## 2. Why a supercell is needed

Quantum ESPRESSO uses periodic boundary conditions. An isolated molecule is therefore represented by one molecule in a large cubic cell. Vacuum separates its periodic images. Too little vacuum produces artificial electrostatic and orbital interactions; increasing the cell until frontier eigenvalues stop changing is essential.

Only the $\Gamma$ point is needed for a sufficiently isolated molecule. A crystalline solid is different: its band gap must be found across a converged $k$-point mesh, and the valence-band maximum and conduction-band minimum may occur at different $k$ points.

## 3. Plane-wave and density cutoffs

`ecutwfc` truncates the plane-wave basis. A low cutoff makes the total energy and eigenvalues basis-dependent. `ecutrho` controls the charge-density basis and depends on pseudopotential type; the lab uses $8\,E_\mathrm{cut}^{\mathrm{wfc}}$ as a conservative teaching value for PAW data.

Convergence must be demonstrated, not assumed: repeat calculations while increasing one parameter at a time and require the HOMO–LUMO gap to change by less than a chosen tolerance (for example, 0.05 eV).

## 4. Input sections

- `&CONTROL` selects an SCF calculation and file locations.
- `&SYSTEM` specifies the cell, atom count, cutoffs, occupations, and number of bands.
- `&ELECTRONS` controls electronic convergence.
- `ATOMIC_SPECIES` maps elements to consistent PBE pseudopotentials.
- `ATOMIC_POSITIONS angstrom` supplies molecular geometry.
- `K_POINTS gamma` performs the isolated-supercell calculation at $\Gamma$.

There must be at least one unoccupied band in `nbnd`; otherwise no LUMO is calculated.

## 5. Identifying HOMO and LUMO

For a non-spin-polarized, closed-shell system with fixed occupations, every occupied Kohn–Sham orbital contains two electrons. With $N_e$ valence electrons, orbital $N_e/2$ is the HOMO and the next orbital is the LUMO. In actual output, inspect the bands listed after `End of self-consistent calculation` or use `bands.x`/post-processing tools.

Metals, open-shell molecules, fractional occupations, charged systems, and spin-polarized calculations require separate treatment. For spin-polarized systems, inspect both spin channels and define frontier levels using their occupations.

### Density of states

After SCF, `dos.x` reads the saved eigenvalues and writes the total electronic density of states. The reference calculations use a 0.02 Ry Gaussian broadening. For a finite molecule the underlying spectrum is discrete, so the apparent peak widths are controlled by that numerical broadening and should not be interpreted as molecular lifetimes. The integrated DOS counts the states accumulated up to a given energy.

### Visualizing the orbitals

An orbital isosurface is a surface of constant Kohn–Sham wavefunction amplitude. The two colors conventionally show opposite mathematical phases ($+$ and $-$), not positive and negative electric charge. Nodes occur where the wavefunction changes sign. In a real Quantum ESPRESSO workflow, run `pp.x` after the SCF calculation, select the desired Kohn–Sham state, export a three-dimensional grid (for example in cube or XSF format), and inspect it in a scientific visualizer. The browser lab uses qualitative, symmetry-inspired shapes; it does not reconstruct wavefunctions from the teaching eigenvalues.

## 6. What the result means

The result is a **Kohn–Sham eigenvalue gap**. It is not automatically equal to either:

- the fundamental gap $I-A$ (ionization potential minus electron affinity), or
- the optical excitation energy, which also includes electron–hole interaction and selection rules.

Semilocal functionals such as PBE commonly underestimate excitation gaps because of self-interaction and the missing derivative discontinuity. More defensible comparisons may require $\Delta$SCF, hybrid functionals, GW, or time-dependent DFT, depending on the target observable.

## 7. Procedure

1. Select a molecule and inspect its valence-electron count.
2. Inspect the prepared SCF and DOS inputs.
3. Click **Run calculation** to load the completed result for the selected molecule.
4. Compare the HOMO–LUMO ladder with the broadened DOS and integrated DOS.
5. Download the level and DOS CSV files if numerical analysis is required.
6. Locate the highest occupied and first unoccupied eigenvalues, subtract them, and report the recorded settings, pseudopotentials, and functional.

## 8. Limitations

- Values are fixed results of completed 30 Ry, 14 Å PBE/PAW calculations; clicking Run loads the stored result and no native executable runs in the browser.
- Molecular geometries are fixed and are not relaxed.
- Only neutral, closed-shell, non-spin-polarized molecules are included.
- PBE/PAW and $\Gamma$-point sampling are used.
- Charged-cell corrections, dipole corrections, spin–orbit coupling, and symmetry effects are omitted.

## Further reading

- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **21**, 395502 (2009).
- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **29**, 465901 (2017).
- Quantum ESPRESSO documentation for `pw.x`, `bands.x`, and pseudopotential selection.
