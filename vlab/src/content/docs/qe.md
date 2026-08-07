# Quantum ESPRESSO: HOMO–LUMO Gap of an Isolated Molecule

*This virtual lab teaches the workflow used to obtain frontier-orbital energies from a plane-wave DFT calculation. Simulation mode uses representative teaching data; Real mode can execute a locally installed Quantum ESPRESSO binary.*

The **Simulation** mode uses representative teaching data. **Real pw.x** mode connects to the local VLab execution bridge, runs a discovered Quantum ESPRESSO executable, and parses its actual standard output. The bridge must be started separately with `npm run qe-server`; the Vite site alone cannot execute a native program. Existing `.out` files can also be imported and parsed without the bridge.

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

### Visualizing the orbitals

An orbital isosurface is a surface of constant Kohn–Sham wavefunction amplitude. The two colors conventionally show opposite mathematical phases ($+$ and $-$), not positive and negative electric charge. Nodes occur where the wavefunction changes sign. In a real Quantum ESPRESSO workflow, run `pp.x` after the SCF calculation, select the desired Kohn–Sham state, export a three-dimensional grid (for example in cube or XSF format), and inspect it in a scientific visualizer. The browser lab uses qualitative, symmetry-inspired shapes; it does not reconstruct wavefunctions from the teaching eigenvalues.

## 6. What the result means

The result is a **Kohn–Sham eigenvalue gap**. It is not automatically equal to either:

- the fundamental gap $I-A$ (ionization potential minus electron affinity), or
- the optical excitation energy, which also includes electron–hole interaction and selection rules.

Semilocal functionals such as PBE commonly underestimate excitation gaps because of self-interaction and the missing derivative discontinuity. More defensible comparisons may require $\Delta$SCF, hybrid functionals, GW, or time-dependent DFT, depending on the target observable.

## 7. Procedure

1. Select a molecule and inspect its valence-electron count.
2. Set `ecutwfc` and the cubic cell length.
3. Increase each independently until the reported gap is stable.
4. Run SCF and confirm `JOB DONE` and electronic convergence.
5. Locate the highest occupied and first unoccupied eigenvalues.
6. Subtract the HOMO energy from the LUMO energy and report settings, pseudopotentials, functional, and convergence tolerance.

## 8. Limitations of this simulation

- Values are generated from representative reference levels with a pedagogical convergence error model; no real Quantum ESPRESSO executable runs in the browser.
- Molecular geometries are fixed and are not relaxed.
- Only neutral, closed-shell, non-spin-polarized molecules are included.
- PBE/PAW and $\Gamma$-point sampling are assumed.
- Charged-cell corrections, dipole corrections, spin–orbit coupling, and symmetry effects are omitted.

## Further reading

- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **21**, 395502 (2009).
- P. Giannozzi *et al.*, *J. Phys.: Condens. Matter* **29**, 465901 (2017).
- Quantum ESPRESSO documentation for `pw.x`, `bands.x`, and pseudopotential selection.
