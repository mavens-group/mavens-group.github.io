# Kinetic Monte Carlo

## 8.1 From Equilibrium to Dynamics

Standard MCMC samples the **equilibrium** distribution. It does not provide physical time: the MC "time" (number of sweeps) is not proportional to real time, and the sequence of configurations is not a physical trajectory.

**Kinetic Monte Carlo (KMC)** is different: it is a stochastic simulation of the **master equation**, giving a physically correct time evolution of a system between rare events (hops, reactions, emissions). KMC is the method of choice when:

- Dynamics is governed by **thermally activated processes** with known rates.
- The system dwells for long periods in a state, then transitions **rapidly** to another.
- One wants to access **timescales far beyond MD** (ns to hours or years).

### The Master Equation

Let \\(P_\alpha(t)\\) be the probability of being in state \\(\alpha\\) at time \\(t\\). The master equation is:

$$\frac{dP_\alpha}{dt} = \sum_{\beta \neq \alpha} \left[ k_{\beta \to \alpha} P_\beta - k_{\alpha \to \beta} P_\alpha \right], \tag{8.1}$$

where \\(k_{\alpha \to \beta}\\) is the transition rate from state \\(\alpha\\) to state \\(\beta\\). KMC is an **exact stochastic simulation** of equation (8.1).

> [!NOTE]
> **KMC vs. MD**
> MD integrates Newton's equations and is limited to \\(\sim\\)ns timescales by the MD timestep (\\(\sim\\)1 fs). KMC jumps between metastable states, accessing \\(\mu\\)s–s timescales. The price: rates \\(k_{\alpha\to\beta}\\) must be provided as input.

---

## 8.2 Transition State Theory and Arrhenius Rates

The rate of a thermally activated process is given by Arrhenius theory:

$$k = \nu_0\, e^{-E_a / k_B T}, \tag{8.2}$$

where \\(E_a\\) is the **activation energy** (energy barrier) and \\(\nu_0\\) is an attempt frequency (typically \\(\sim 10^{12}\\)–\\(10^{13}\\) s\\(^{-1}\\) for solids, related to the Debye frequency).

More precisely, **Transition State Theory** (Eyring) gives:

$$k = \frac{k_B T}{h} e^{-\Delta G^\ddagger / k_B T} = \frac{k_B T}{h} e^{\Delta S^\ddagger / k_B} e^{-\Delta H^\ddagger / k_B T}, \tag{8.3}$$

where \\(\Delta G^\ddagger\\), \\(\Delta H^\ddagger\\), \\(\Delta S^\ddagger\\) are the free energy, enthalpy, and entropy of activation.

> [!NOTE]
> **Surface Diffusion: Adatom Hopping on Cu(100)**
> A Cu adatom on a Cu(100) surface hops between four-fold hollow sites. The barrier \\(E_a = 0.49\\) eV (from DFT/NEB) and \\(\nu_0 = 3 \times 10^{12}\\) s\\(^{-1}\\) give a hop rate at 300 K:
> $$k = 3\times10^{12} \times e^{-0.49/0.026} \approx 10^{-6} \text{ hops/s}.$$
> At 700 K: \\(k \approx 3\times10^8\\) hops/s. KMC bridges these 14 decades in rate.

### Computing Barriers: NEB Method

The **Nudged Elastic Band (NEB)** method finds the minimum energy path between two states by relaxing a chain of images connected by spring forces:

$$\mathbf{F}_i = -\nabla E(\mathbf{r}_i) + \mathbf{F}^{\rm spring}_i. \tag{8.4}$$

The saddle point (transition state) gives \\(E_a\\). NEB is implemented in VASP, GPAW, and ASE.

---

## 8.3 The BKL Algorithm (Bortz-Kalos-Lebowitz)

Also called the **residence-time algorithm** or **Gillespie algorithm** (Gillespie 1977 in chemistry), the **n-fold way** (Bortz et al. 1975 in physics).

**Setup:** at each state \\(\alpha\\), there are \\(M\\) possible processes with rates \\(k_1, k_2, \ldots, k_M\\). Define the total rate:

$$K_{\rm tot} = \sum_{j=1}^M k_j. \tag{8.5}$$

**Algorithm:**
1. Compute \\(K_{\rm tot}\\) and cumulative rates \\(R_j = \sum_{i \leq j} k_i\\).
2. Draw \\(u_1 \sim \mathcal{U}[0,1]\\). Execute event \\(j^*\\) where \\(R_{j^*-1} < u_1 K_{\rm tot} \leq R_{j^*}\\).
3. Advance time by \\(\Delta t = -\ln(u_2) / K_{\rm tot}\\) where \\(u_2 \sim \mathcal{U}[0,1]\\).
4. Update the system state and all affected rates.
5. Repeat.

This is **rejection-free**: every step executes a physical event. There is no wasted computation.

> [!NOTE]
> **Physical Time in KMC**
> The time increment \\(\Delta t = -\ln u / K_{\rm tot}\\) is an exponentially distributed waiting time. Summing these gives physical time in seconds (if rates are in s\\(^{-1}\\)). This is exact — not an approximation.

---

## 8.4 KMC for Surface Processes: Crystal Growth

A paradigmatic KMC application is thin-film deposition and crystal growth. Processes included:

| Process | Rate |
|---------|------|
| Adsorption from gas phase | \\(k_{\rm ads} = F \cdot \exp(-E_{\rm ads}/k_BT) / \nu_0\\) |
| Terrace diffusion | \\(k_{\rm diff} = \nu_0\, e^{-E_{\rm diff}/k_BT}\\) |
| Edge diffusion | \\(k_{\rm edge} = \nu_0\, e^{-E_{\rm edge}/k_BT}\\) |
| Desorption | \\(k_{\rm des} = \nu_0\, e^{-E_{\rm des}/k_BT}\\) |
| Island nucleation | \\(k_{\rm nuc} = \nu_0\, e^{-E_{\rm nuc}/k_BT}\\) |

> [!NOTE]
> **Silicon MBE: Growth Mode Selection**
> KMC simulations of Si(001) molecular beam epitaxy (MBE) with DFT-computed barriers reproduce the experimentally observed crossover from layer-by-layer (Frank-van der Merwe) to island (Volmer-Weber) growth as a function of deposition rate \\(F\\) and temperature \\(T\\). The critical island density \\(N_x \sim (F/\nu_0)^{1/3} e^{E_{\rm diff}/3k_BT}\\) is directly measurable in KMC.

> [!NOTE]
> **Thin-Film Deposition: TiN Coatings**
> KMC models of TiN(001) growth (hard coating for cutting tools) capture the competition between N₂ dissociation, Ti surface diffusion (\\(E_a = 0.3\\) eV), and incorporation at step edges. Simulations over \\(10^{10}\\) events (physical time \\(\sim\\) 1 ms) reproduce the experimentally observed columnar microstructure.

---

## 8.5 KMC in Heterogeneous Catalysis

Catalytic surface reactions are ideally suited to KMC: individual elementary steps have well-defined rates; experiments access steady-state turnover frequencies (TOF); timescales are far beyond MD.

### CO Oxidation on Pt(111)

The Langmuir-Hinshelwood mechanism:

$$\text{CO} + * \xrightarrow{k_{\rm ads}^{\rm CO}} \text{CO}^*, \quad \text{O}_2 + 2* \xrightarrow{k_{\rm ads}^{\rm O_2}} 2\text{O}^*, \quad \text{CO}^* + \text{O}^* \xrightarrow{k_{\rm rxn}} \text{CO}_2 + 2*. \tag{8.6}$$

KMC processes:

- CO adsorption/desorption (\\(E_a^{\rm des} = 1.45\\) eV)
- O₂ dissociative adsorption (\\(E_a = 0\\))
- CO diffusion (\\(E_a = 0.5\\) eV)
- O diffusion (\\(E_a = 0.7\\) eV)
- CO + O reaction (\\(E_a = 1.0\\) eV, Brønsted-Evans-Polanyi)

> [!NOTE]
> **Reproducing the Ertl Oscillations**
> At certain \\(T\\) and \\(P_{\rm CO}/P_{\rm O_2}\\) ratios, the CO oxidation rate on Pt oscillates (discovered by Ertl, Nobel Prize 2007). KMC simulations on a \\(128 \times 128\\) Pt(110) lattice with CO, O, and surface reconstruction reproduce the kinetic oscillations, bistability, and the CO-poisoning transition — purely from elementary rate constants.

---

## 8.6 KMC for Vacancy Migration and Diffusion in Solids

### Vacancy Diffusion in FCC Metals

In a pure FCC metal (e.g., Cu, Ni), a vacancy diffuses by hopping between nearest-neighbour sites. The rate for a single hop:

$$k_{\rm hop} = \nu_0\, e^{-E_m / k_B T}, \tag{8.7}$$

where \\(E_m\\) is the migration energy. The diffusion coefficient:

$$D = a^2 k_{\rm hop} / z, \tag{8.8}$$

where \\(a\\) is the lattice constant and \\(z\\) is the coordination number.

> [!NOTE]
> **Alloy Ordering Kinetics**
> In a binary A-B alloy, the vacancy-mediated ordering kinetics (e.g., Ni₃Al) involve dozens of distinct hop rates depending on the local chemical environment. KMC with pair interaction energies from cluster expansion (fitted to DFT) reproduces the experimentally observed ordering time at 700°C to within a factor of 2.

> [!NOTE]
> **Radioactive Transmutation Chains**
> KMC naturally handles decay chains: ²³⁸U → ²³⁴Th → ²³⁴Pa → ²³⁴U → ... → ²⁰⁶Pb. Each decay is a Poisson process with rate \\(\lambda = \ln 2 / t_{1/2}\\). KMC gives the exact time evolution of each isotope's population, including correlations — more informative than the Bateman equations when starting from small atom counts (e.g., a single ²³⁸U nucleus).

---

## 8.7 Advanced KMC: Adaptive and Off-Lattice Methods

### On-Lattice vs. Off-Lattice KMC

Standard KMC uses a fixed lattice. **Off-lattice KMC** (also: adaptive KMC, AKMC) is needed when the transition states are not known a priori (e.g., glasses, amorphous materials).

**AKMC Algorithm:**
1. From current state, use a saddle-point search method (dimer, ART) to find transition states.
2. Compute rates via harmonic TST.
3. Execute one event via BKL.
4. Repeat.

> [!NOTE]
> **Diffusion in Amorphous Silicon**
> In a-Si:H (hydrogenated amorphous silicon), H atoms diffuse through a disordered network of Si-H bonds, Si-Si bonds, and voids. AKMC identifies thousands of distinct hop environments. The simulated diffusion coefficient \\(D(T)\\) agrees with experiment over 10 decades in \\(D\\).

### Parallel KMC

For large systems (\\(10^6\\) sites), divide the lattice into domains and run KMC in each domain in parallel, synchronising at regular intervals (Synchronous Sublattice KMC, Shim & Amar 2005).

---

## 8.8 Computational Lab — Class 14

**Objectives:**

1. Implement lattice KMC for adatom diffusion on a 2D square lattice with 4 degenerate hop rates \\(k = \nu_0 e^{-E_a/k_BT}\\). Compute the mean-square displacement \\(\langle r^2(t) \rangle\\) and extract the diffusion coefficient \\(D(T)\\). Compare to \\(D = k a^2 / 4\\). Plot \\(\ln D\\) vs. \\(1/T\\) (Arrhenius plot).

2. Add deposition from a beam (rate \\(F\\) per site) and desorption. Run KMC for 10⁷ events. Visualise island nucleation and growth. Measure island density \\(N_x\\) as a function of \\(T\\) and \\(F\\).

3. Implement a simple 2-species reaction A + B → C on a lattice with diffusion and adsorption. Measure the steady-state TOF as a function of temperature and compare to the mean-field rate equation.

> [!NOTE]
> **Skeleton Code**
> Use a sorted list or a Fenwick tree for efficient event selection in the BKL algorithm. See Appendix C for pseudocode. NumPy's `np.searchsorted` implements \\(\mathcal{O}(\log M)\\) event selection.

---

## Summary

- KMC solves the master equation exactly for systems with known transition rates.
- BKL (Gillespie) algorithm: rejection-free, physical time, scales as \\(\mathcal{O}(M)\\) or \\(\mathcal{O}(\log M)\\) per event.
- Rates come from Arrhenius/TST theory and DFT/NEB barrier calculations.
- Applications: surface growth (MBE, CVD), heterogeneous catalysis (CO oxidation), vacancy diffusion in alloys, decay chain kinetics.
- Off-lattice / adaptive KMC extends the method to systems with unknown transition states.
