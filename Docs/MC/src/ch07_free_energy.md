# Chapter 7: Advanced MCMC & Free Energy Methods

*Class 12*

---

## 7.1 The Free Energy Problem

Most MC methods sample the canonical distribution and give direct access to \\(\langle A \rangle\\) but **not** to the free energy \\(F = -k_B T \ln Z\\). The free energy requires the partition function \\(Z\\), which is not a thermal average. Yet \\(F\\) is central to:

- Phase equilibria (which phase is stable at a given \\(T, P\\)?).
- Chemical reaction rates (via the activation free energy).
- Protein folding (stability of folded vs. unfolded states).
- Alloy phase diagrams.

This chapter presents three families of methods to access \\(F\\).

---

## 7.2 Parallel Tempering (Replica Exchange MC)

### Motivation

At low temperatures, the energy landscape has many local minima separated by high barriers. Ordinary MC takes exponentially long to escape. **Parallel tempering** runs multiple replicas simultaneously at different temperatures and swaps their configurations.

### Algorithm

Run \\(M\\) replicas at temperatures \\(T_1 < T_2 < \cdots < T_M\\). After \\(n_{\rm swap}\\) MC sweeps at each temperature, attempt to swap configurations \\(\mathbf{x}_k \leftrightarrow \mathbf{x}_{k+1}\\) between adjacent replicas with acceptance probability:

$$A_{\rm swap} = \min\!\left(1,\, \exp\!\left[(\beta_{k+1} - \beta_k)(H(\mathbf{x}_k) - H(\mathbf{x}_{k+1}))\right]\right). \tag{7.1}$$

Detailed balance is satisfied. High-temperature replicas explore freely; accepted swaps inject these configurations into the low-temperature replicas.

### Choosing Temperatures

Target a swap acceptance rate of 20–40%. This requires overlapping energy distributions. A rule of thumb for the spacing:

$$\Delta\beta = \beta_{k+1} - \beta_k \approx \sqrt{2 / N_{\rm dof}} \cdot \beta_k, \tag{7.2}$$

where \\(N_{\rm dof}\\) is the number of degrees of freedom.

> [!NOTE]
> **Protein Folding Free Energy Landscapes**
> Parallel tempering (also called Replica Exchange MD or REMD in the MD context) is the standard method for sampling biomolecular free energy landscapes. For a 50-residue peptide, 32–64 replicas spanning 280–600 K allow exploration of the folded, partially folded, and unfolded states. The free energy profile \\(F(\text{RMSD from native})\\) reveals the folding funnel and barriers.

> [!NOTE]
> **Nucleation in First-Order Transitions**
> For a supersaturated Lennard-Jones liquid below \\(T_c\\), parallel tempering can cross the nucleation barrier (\\(\sim 10^2 k_B T\\)) that traps ordinary MC in the metastable phase. The critical nucleus size and nucleation rate are extracted from the sampled free energy surface.

---

## 7.3 Wang-Landau Algorithm

Instead of sampling at fixed \\(T\\), estimate the **density of states** \\(g(E)\\) defined by:

$$Z(T) = \int g(E)\, e^{-\beta E}\, dE. \tag{7.3}$$

Once \\(g(E)\\) is known, the partition function and free energy are available at **all temperatures** from a single simulation.

### Algorithm

1. Start with \\(g(E) = 1\\) and a flat histogram \\(H(E) = 0\\. Set modification factor \\(f = e^1\\).
2. Perform random walk in energy space. At each step, propose a new state \\(E'\\) and accept with:
$$A = \min\!\left(1, \frac{g(E)}{g(E')}\right). \tag{7.4}$$
3. Update: \\(g(E) \to g(E) \times f\\) and \\(H(E) \to H(E) + 1\\).
4. When \\(H(E)\\) is flat (all energies visited equally), set \\(f \to \sqrt{f}\\) and reset \\(H(E) = 0\\).
5. Stop when \\(f < e^{10^{-8}}\\) (convergence criterion).

> [!NOTE]
> **Extracting Thermodynamics**
> From \\(g(E)\\), compute:
> $$Z(T) = \sum_E g(E) e^{-\beta E}, \quad F(T) = -k_B T \ln Z(T), \quad C_V(T) = \frac{\partial^2 (F/T)}{\partial(1/T)^2}.$$
> This gives the complete thermal behaviour from a single WL run.

> [!NOTE]
> **Ising Model Density of States**
> For the \\(L = 16\\) 2D Ising model (4096 energies), the Wang-Landau algorithm converges to \\(g(E)\\) in \\(\sim 10^8\\) steps. The resulting \\(F(T)\\) matches the Onsager exact result to \\(\sim 0.1\%\\) across the full temperature range, including the peak in \\(C_V\\) at \\(T_c\\).

---

## 7.4 Umbrella Sampling and WHAM

### The Problem

Some physical processes involve a **rare event** between state A and state B separated by a free energy barrier \\(\Delta F^\ddagger \gg k_B T\\). Ordinary MC never crosses the barrier.

### Umbrella Sampling

Introduce a **biasing potential** \\(V_{\rm bias}(\xi)\\) centred on a value of the **reaction coordinate** \\(\xi\\):

$$H_{\rm biased}(\mathbf{x}) = H(\mathbf{x}) + V_{\rm bias}(\xi(\mathbf{x})). \tag{7.5}$$

Common choice: harmonic umbrella \\(V_{\rm bias}(\xi) = \frac{1}{2}K(\xi - \xi_0)^2\\). Run independent simulations at each \\(\xi_0\\) (each "window"), covering the reaction coordinate from A to B.

### WHAM: Weighted Histogram Analysis Method

Combine the biased histograms from all windows into the unbiased free energy profile:

$$F(\xi) = -k_B T \ln P(\xi) + \text{const.} \tag{7.6}$$

WHAM solves a self-consistent set of equations to extract \\(F(\xi)\\) with optimal statistical efficiency.

> [!NOTE]
> **Solvation Free Energy of NaCl in Water**
> The free energy of dissolving NaCl: \\(\Delta F_{\rm solv} = F_{\rm ion pair in water} - F_{\rm ion pair in vacuum}\\). Umbrella sampling along the Na-Cl distance \\(r\\) from 2.4 Å to 10 Å, with 16 windows and \\(K = 40\\) kcal/mol/Å², gives the full potential of mean force. The minimum at \\(r \approx 2.7\\) Å (contact ion pair) and barrier at \\(r \approx 4\\) Å (solvent-separated pair) match experiment.

> [!NOTE]
> **Alloy Phase Diagrams via Free Energy Integration**
> For a Cu-Au alloy, the free energy difference between ordered (L1₀) and disordered (A1) phases as a function of composition is computed by thermodynamic integration (see §7.5). The calculated phase diagram matches the experimental one to within 30 K in \\(T_c\\).

---

## 7.5 Free Energy Perturbation and Thermodynamic Integration

### Free Energy Perturbation (FEP)

Define a parameter \\(\lambda\\) that interpolates between two Hamiltonians: \\(H_0\\) (state A) and \\(H_1\\) (state B).

$$\Delta F = F_B - F_A = -k_B T \ln \left\langle e^{-\beta(H_1 - H_0)} \right\rangle_A. \tag{7.7}$$

Equation (7.7) is **exact** but only converges when the energy distributions of A and B significantly overlap. For large \\(\Delta F\\), one must use intermediate states \\(\lambda = 0, 0.1, 0.2, \ldots, 1.0\\).

### Thermodynamic Integration (TI)

$$\Delta F = \int_0^1 \left\langle \frac{\partial H(\lambda)}{\partial \lambda} \right\rangle_\lambda d\lambda. \tag{7.8}$$

Compute the integrand at discrete \\(\lambda\\) values by MC simulations; integrate numerically. More stable than FEP for large \\(\Delta F\\).

> [!NOTE]
> **Drug Binding Affinity Calculations**
> The relative binding affinity of two drug candidates A and B to a protein target:
> $$\Delta\Delta F_{\rm bind} = \Delta F_{\rm bind}^B - \Delta F_{\rm bind}^A$$
> is computed via a thermodynamic cycle using FEP or TI. This is standard practice in pharmaceutical MC/MD, with GROMACS and NAMD implementing TI natively. Typical accuracy: 1–2 kcal/mol.

---

## 7.6 Computational Lab — Class 12

**Objectives:**

1. Implement Wang-Landau for the 1D Ising model (\\(N = 20\\) spins). Recover \\(g(E)\\) and compute \\(F(T)\\), \\(C_V(T)\\), \\(M(T)\\). Compare to the exact transfer-matrix result.

2. Use umbrella sampling to compute the potential of mean force between two Lennard-Jones particles in 2D. Compare to the pair distribution function \\(g(r)\\) from a direct Metropolis simulation.

3. (Bonus) Implement parallel tempering for the 2D Ising model at \\(L = 16\\) with 4 temperatures bracketing \\(T_c\\). Monitor the swap acceptance rate and the replica diffusion in temperature space.

---

## Summary

- **Parallel tempering**: multiple replicas at different \\(T\\); swap configurations to overcome barriers.
- **Wang-Landau**: iteratively flatten the energy histogram to estimate \\(g(E)\\); gives \\(F(T)\\) at all temperatures.
- **Umbrella sampling + WHAM**: sample rare events with a biasing potential; remove the bias analytically.
- **FEP / TI**: compute free energy differences via perturbation theory or numerical integration over \\(\lambda\\).
- All methods obey detailed balance; errors can be estimated by standard MC techniques.
