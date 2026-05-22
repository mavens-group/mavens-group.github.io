# The Ising Model & Statistical Mechanics

## 5.1 The Ising Model

The Ising model is the workhorse of computational statistical mechanics. Despite its simplicity, it captures the physics of ferromagnetic phase transitions, liquid-gas criticality, binary alloys, and lattice gases.

### Hamiltonian

$$H = -J \sum_{\langle i,j \rangle} s_i s_j - h \sum_i s_i, \qquad s_i = \pm 1. \tag{5.1}$$

Here \\(\langle i,j \rangle\\) denotes nearest-neighbour pairs, \\(J > 0\\) is the ferromagnetic coupling, and \\(h\\) is an external field.

**Key observables:**

$$M = \frac{1}{N}\sum_i s_i \quad (\text{magnetisation per spin}), \tag{5.2}$$
$$E = \langle H \rangle / N \quad (\text{energy per spin}), \tag{5.3}$$
$$C_V = \frac{\partial \langle E \rangle}{\partial T} = \frac{\beta^2}{N}(\langle H^2 \rangle - \langle H \rangle^2), \tag{5.4}$$
$$\chi = \frac{\partial \langle M \rangle}{\partial h}\bigg|_{h=0} = \frac{\beta}{N}(\langle M^2 N^2\rangle - \langle MN\rangle^2). \tag{5.5}$$

### Exact Results

**1D Ising** (Ising 1925): no phase transition at finite \\(T\\). Exact free energy per spin:
$$f = -k_B T \ln\left(e^{\beta J} \cosh(\beta h) + \sqrt{e^{2\beta J}\sinh^2(\beta h) + e^{-2\beta J}}\right). \tag{5.6}$$

**2D Ising, zero field** (Onsager 1944): exact solution gives a phase transition at:
$$k_B T_c = \frac{2J}{\ln(1+\sqrt{2})} \approx 2.269\,J. \tag{5.7}$$

The exact free energy, magnetisation, and specific heat are known analytically. This makes the 2D Ising model the ideal benchmark for any MC code.

> [!NOTE]
> **Ferromagnetic Transition in Iron**
> Iron has \\(T_c \approx 1044\\) K. Near \\(T_c\\), the spontaneous magnetisation vanishes as \\(M \sim |T - T_c|^\beta\\) with \\(\beta \approx 0.326\\) (3D Ising universality class). The 3D Ising model belongs to this class; its \\(T_c\\) and critical exponents are accessible via MC.

> [!NOTE]
> **Binary Alloys: Order-Disorder Transitions**
> The Cu-Zn (brass) alloy system undergoes a B2 → A2 order-disorder transition at \\(\sim 470\\)°C. The two sub-lattices in the BCC structure map exactly onto an Ising model with \\(s_i = +1\\) (Cu) or \\(-1\\) (Zn). The MC-computed transition temperature and specific heat anomaly match experiment.

---

## 5.2 Metropolis Algorithm for the Ising Model

**One Monte Carlo sweep** = \\(N\\) attempted single-spin flips (each spin on average visited once).

**Single-spin flip update:**
1. Select spin \\(i\\) uniformly at random.
2. Compute the energy change if \\(s_i \to -s_i\\):
$$\Delta H = 2J s_i \sum_{j \in \partial i} s_j + 2h s_i. \tag{5.8}$$
3. Accept with probability \\(\min(1, e^{-\beta \Delta H})\\).

> [!TIP]
> **Lookup Table Optimisation**
> For the 2D square lattice with no field, \\(\Delta H\\) takes only 5 distinct values: \\(\{-8J, -4J, 0, 4J, 8J\}\\). Pre-compute the acceptance probabilities in a table. This gives a \\(\sim 3\times\\) speedup over computing exponentials on the fly.

### Measuring Physical Quantities

Average over \\(N_{\rm meas}\\) uncorrelated measurements (separated by \\(\sim 2\tau_{\rm int}\\) sweeps):

```
for t in range(N_sweeps):
    for i in range(N_spins):  # one sweep
        flip spin i with Metropolis acceptance
    if t > N_burn and t % delta_t == 0:
        record E, M
compute mean, variance, error
```

### Finite-Size Scaling

For a finite lattice of linear size \\(L\\), the apparent critical temperature \\(T_c(L)\\) shifts as:

$$T_c(L) = T_c(\infty) + a L^{-1/\nu}, \tag{5.9}$$

where \\(\nu\\) is the correlation length exponent (\\(\nu = 1\\) in 2D). The susceptibility and specific heat peak scale as:

$$\chi_{\max}(L) \sim L^{\gamma/\nu}, \qquad C_{V,\max}(L) \sim L^{\alpha/\nu}. \tag{5.10}$$

> [!NOTE]
> **2D Ising Critical Exponents**
> Exact Onsager values: \\(\nu = 1\\), \\(\gamma = 7/4\\), \\(\alpha = 0\\) (log divergence), \\(\beta = 1/8\\).
> These are landmarks to verify your MC code against.

---

## 5.3 Phase Transitions and Critical Slowing Down

Near \\(T_c\\), spatial correlations grow as \\(\xi \sim |T - T_c|^{-\nu}\\). The autocorrelation time:

$$\tau \sim \xi^z \sim |T - T_c|^{-\nu z}. \tag{5.11}$$

For Metropolis (local updates), \\(z \approx 2.17\\) in 2D. On a \\(256 \times 256\\) lattice at \\(T_c\\), \\(\tau_{\rm int} \sim 10^4\\) sweeps — rendering precision measurements impractical without cluster moves.

> [!NOTE]
> **Liquid-Gas Criticality**
> The critical point of CO₂ (\\(T_c = 304.1\\) K, \\(P_c = 73.8\\) bar) belongs to the 3D Ising universality class. MC simulations of the lattice gas model — where \\(s_i = +1\\) means "occupied" and \\(s_i = -1\\) means "empty" — reproduce the critical density fluctuations and coexistence curve with \\(\beta = 0.326\\), in agreement with experiment.

---

## 5.4 Cluster Algorithms

### Wolff Algorithm

1. Choose a seed spin \\(i\\) at random.
2. Add neighbouring spin \\(j\\) to the cluster if \\(s_j = s_i\\) with probability \\(p = 1 - e^{-2\beta J}\\).
3. Repeat for all cluster boundary spins (breadth-first or depth-first).
4. Flip all spins in the cluster.

The Wolff algorithm satisfies detailed balance and has dynamic exponent \\(z \approx 0.25\\) in 2D — nearly 10× smaller than Metropolis near \\(T_c\\).

### Swendsen-Wang Algorithm

Build all clusters simultaneously using the Fortuin-Kasteleyn mapping; colour each cluster independently. Less efficient per step than Wolff but offers different statistical properties.

> [!TIP]
> **When to use cluster vs. Metropolis**
> - **Below \\(T_c\\)**: Metropolis is efficient (small \\(\tau_{\rm int}\\), small clusters formed in Wolff).
> - **Near \\(T_c\\)**: Wolff dramatically outperforms Metropolis.
> - **With an external field**: Wolff is inefficient (clusters don't flip easily). Use Metropolis.

---

## 5.5 Extensions: Potts Model and Lattice Gas

### q-State Potts Model

Generalise the Ising model to \\(q\\) states:

$$H = -J \sum_{\langle i,j \rangle} \delta_{\sigma_i, \sigma_j}, \qquad \sigma_i \in \{1, 2, \ldots, q\}. \tag{5.12}$$

For \\(q = 2\\) this is the Ising model. For \\(q = 3\\): second-order transition in 2D. For \\(q \geq 5\\) in 2D: first-order transition.

> [!NOTE]
> **Grain Growth in Polycrystalline Materials**
> The \\(q\\)-state Potts model (large \\(q\\)) is a standard model for grain microstructure in metals. Each grain orientation corresponds to a Potts state. MC simulations with \\(q = 48\\) and \\(N \sim 10^6\\) sites reproduce the experimentally observed grain size distribution and von Neumann law for grain growth.

### Lattice Gas

Map \\(s_i = (1 + n_i)/2\\) where \\(n_i \in \{0, 1\}\\) is the occupancy. The Ising Hamiltonian becomes:

$$H_{\rm LG} = -4J \sum_{\langle i,j \rangle} n_i n_j - \mu \sum_i n_i + \text{const.} \tag{5.13}$$

This maps the liquid-gas transition to the ferromagnetic Ising transition.

---

## 5.6 Computational Lab — Class 10

**Objectives:**

1. Implement the 2D Ising model (\\(L = 32, 64\\)) with periodic boundary conditions. Using Metropolis, measure \\(\langle |M| \rangle\\), \\(\chi\\), and \\(C_V\\) as a function of \\(T \in [1.5J, 3.5J]\\). Locate \\(T_c\\) and compare to the Onsager value.

2. Implement the Wolff cluster algorithm. Compare \\(\tau_{\rm int}(M)\\) for Metropolis vs. Wolff at \\(T = T_c\\) for \\(L = 32\\). Plot \\(\tau_{\rm int}\\) as a function of \\(L\\) and extract \\(z\\).

3. Perform a finite-size scaling collapse of \\(\chi(T, L)\\) using the 2D Ising exponents. Do the curves for \\(L = 16, 32, 64\\) collapse onto a single universal curve?

> [!NOTE]
> **Skeleton Code**
> A minimal Ising Metropolis implementation in NumPy runs \\(\sim 10^7\\) steps/second on a modern CPU. For \\(L = 64\\) (4096 spins), this gives \\(\sim 2400\\) sweeps/second — enough for the lab in minutes.

---

## Summary

- The Ising model provides exact benchmarks (Onsager) and connects to diverse physical systems.
- Metropolis single-spin flips satisfy detailed balance; the energy change involves only nearest neighbours.
- Finite-size scaling reveals the universality class and allows extraction of critical exponents.
- Wolff cluster algorithm: dynamic exponent \\(z \approx 0.25\\) vs. \\(z \approx 2.17\\) for Metropolis.
- The same MC framework applies to Potts models, lattice gases, and adsorption problems.
