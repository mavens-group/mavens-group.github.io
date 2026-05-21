# Chapter 9: Applications, Error Analysis & Special Topics

*Class 15*

---

## 9.1 Statistical Error Analysis in MC

Reliable error quantification is as important as the simulation itself. This section collects the essential tools.

### 9.1.1 Blocking Analysis

Divide \\(N\\) correlated MC samples into \\(B\\) blocks of size \\(b = N/B\\). Compute block averages \\(\bar{A}_k\\). The block variance:

$$\sigma_B^2 = \frac{1}{B(B-1)} \sum_{k=1}^B (\bar{A}_k - \bar{A})^2. \tag{9.1}$$

Plot \\(\sigma_B^2\\) vs. block size \\(b\\). When \\(b \gg \tau_{\rm int}\\), the block averages are independent and \\(\sigma_B^2\\) plateaus. This plateau gives the true statistical error.

> [!WARNING]
> **Never trust naive variance**
> If you ignore autocorrelations, your error bars will be underestimated by a factor \\(\sqrt{2\tau_{\rm int}}\\). For Metropolis near \\(T_c\\), this can be a factor of 100.

### 9.1.2 Bootstrap Resampling

Draw \\(N^*\\) bootstrap samples (with replacement) from the \\(N\\) MC data points. Compute the estimator for each bootstrap sample. The bootstrap distribution of the estimator approximates its sampling distribution.

For a function \\(\theta = g(\langle A \rangle, \langle B \rangle)\\) of correlated averages (e.g., \\(\chi = \beta(\langle M^2 \rangle - \langle M \rangle^2)\\)):

$$\hat{\sigma}_\theta = \text{std}[\theta_1^*, \theta_2^*, \ldots, \theta_{N^*}^*]. \tag{9.2}$$

Bootstrap handles nonlinear estimators naturally, unlike error propagation.

### 9.1.3 Jackknife Resampling

Leave out the \\(k\\)-th data point and compute the estimator on the remaining \\(N-1\\) points:

$$\hat{\theta}_k = g(\{A_i\}_{i \neq k}). \tag{9.3}$$

The jackknife variance:

$$\sigma_{\rm JK}^2 = \frac{N-1}{N}\sum_{k=1}^N (\hat{\theta}_k - \bar{\theta})^2. \tag{9.4}$$

Jackknife is \\(\mathcal{O}(N)\\) faster than bootstrap for expensive estimators. It is exact for linear estimators and a good approximation for smooth nonlinear functions.

> [!NOTE]
> **Extracting Critical Exponents**
> The Binder cumulant \\(U_4 = 1 - \langle M^4 \rangle / (3 \langle M^2 \rangle^2)\\) is a nonlinear function of MC data. Jackknife correctly propagates errors through the nonlinearity. For the 2D Ising model with \\(L = 64\\) and \\(N = 10^6\\) sweeps, jackknife gives \\(\sigma_{U_4} \approx 0.002\\), enabling precise location of \\(T_c\\).

---

## 9.2 Bayesian Inference and MCMC

Bayesian inference treats model parameters \\(\theta\\) as random variables with a **posterior** distribution:

$$p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta)\, p(\theta)}{p(\mathcal{D})} \propto \mathcal{L}(\theta)\, \pi(\theta), \tag{9.5}$$

where \\(\mathcal{L}(\theta) = p(\mathcal{D} \mid \theta)\\) is the likelihood and \\(\pi(\theta)\\) is the prior. The posterior is precisely the distribution one wants to sample — and MCMC is the tool.

### Application to Equation of State Fitting

Given MD/MC simulation data \\(\{(T_i, P_i, V_i)\}\\) with uncertainties \\(\sigma_i\\), fit a van der Waals or Redlich-Kwong EOS:

$$p(\mathbf{r}) = \frac{Nk_BT}{V - Nb} - \frac{aN^2}{V^2}. \tag{9.6}$$

The posterior \\(p(a, b \mid \{P_i\})\\) is sampled via Metropolis. The resulting marginal posteriors give \\(a\) and \\(b\\) with full uncertainty quantification — more informative than a least-squares fit.

> [!NOTE]
> **Astrophysical Parameter Estimation**
> The posterior distribution of cosmological parameters (\\(\Omega_m, \Omega_\Lambda, H_0, \ldots\\)) given CMB power spectrum data is sampled by MCMC — specifically, the COSMOMC and Cobaya codes. The 6-parameter \\(\Lambda\\)CDM model posterior lives in a curved, banana-shaped manifold best explored by Hamiltonian Monte Carlo.

> [!NOTE]
> **Neutron Star Equation of State**
> Gravitational wave events (e.g., GW170817) constrain the neutron star EOS via Bayesian inference. MCMC samples the posterior over EOS parameters (nuclear symmetry energy, skewness) given the measured tidal deformabilities. Each likelihood evaluation requires solving the Tolman-Oppenheimer-Volkoff equations — making efficiency critical.

---

## 9.3 Monte Carlo in Particle Physics

### Detector Simulation: Geant4

**Geant4** (CERN) is the standard toolkit for simulating particle interactions with matter. It uses MC to:

- Propagate particles through detector geometry (ionisation energy loss, Bethe-Bloch formula).
- Simulate electromagnetic showers (pair production, bremsstrahlung, Compton scattering).
- Simulate hadronic showers (nuclear interactions).

Each particle track is an independent MC trajectory. The LHC experiments run \\(\\sim 10^9\\) simulated events per year — the dominant computational cost.

> [!NOTE]
> **Calorimeter Response**
> In the ATLAS electromagnetic calorimeter (liquid argon), an incoming 100 GeV electron produces a shower of \\(\\sim 10^5\\) particles. Geant4 tracks each particle using MC sampling of the cross-sections for bremsstrahlung and pair production. The simulated energy deposit matches the measured 1.5% energy resolution.

### Phase Space Sampling: RAMBO

For \\(n\\)-body final states in particle decays, the phase space measure is:

$$d\Phi_n = \prod_{i=1}^n \frac{d^3 p_i}{(2\pi)^3 2E_i} \cdot (2\pi)^4 \delta^{(4)}\!\left(\sum p_i - P\right). \tag{9.7}$$

RAMBO (Kleiss, Stirling & Ellis 1985) samples this uniformly in \\(3n - 4\\) dimensions. For \\(n = 10\\) (26 dimensions), MC is the only feasible approach.

---

## 9.4 Neutron and Photon Transport

The **radiative transfer equation** for photon specific intensity \\(I_\nu\\):

$$\frac{dI_\nu}{ds} = -\kappa_\nu I_\nu + j_\nu, \tag{9.8}$$

where \\(\kappa_\nu\\) is the absorption coefficient and \\(j_\nu\\) is the emission coefficient, is solved by MC by tracking photon packets:

1. Emit a photon packet with frequency \\(\nu\\) sampled from the source spectrum.
2. Sample the free path \\(\ell = -\ln u / \kappa_\nu\\).
3. At the interaction site: scatter (sample new direction from the phase function) or absorb.
4. Repeat until the packet escapes or is absorbed.

> [!NOTE]
> **Stellar Interior Opacity**
> MC transport codes (e.g., SEDONA, Cloudy) compute radiative opacities in stellar atmospheres by tracking \\(10^6\\)–\\(10^7\\) photon packets through a model atmosphere with thousands of atomic lines. The resulting synthetic spectrum is compared to the observed one to determine stellar parameters (\\(T_{\rm eff}\\), \\(\log g\\), metallicity).

> [!NOTE]
> **Nuclear Reactor Shielding: MCNP**
> MCNP (Los Alamos) uses MC to simulate neutron and photon transport through reactor shielding. Neutrons are tracked through the geometry, with cross-sections sampled from the ENDF library at each interaction point. Variance reduction (importance sampling, splitting) is essential to reach the deep-penetration regime where attenuation is \\(10^{-10}\\) of the source.

---

## 9.5 Computational Best Practices

### Reproducibility

> [!TIP]
> **Always do these**
> 1. **Seed your RNG** and record the seed in your output.
> 2. **Save the full configuration** at intervals for restart.
> 3. **Version-control your code** (git).
> 4. **Record all parameters** (\\(N, T, L, N_{\rm steps}, N_{\rm burn}\\)) in the output file header.
> 5. **Report error bars** on every published number.

### Parallelisation

- **Trivially parallel**: run \\(M\\) independent replicas with different seeds. Combine for better statistics.
- **Domain decomposition**: split the lattice across CPUs; communicate boundary spins (MPI).
- **GPU acceleration**: for Ising/Heisenberg on large lattices, checkerboard updates allow full vectorisation. A modern GPU achieves \\(\\sim 10^{10}\\) spin flips/second.

### Performance Tips for Python

```python
# Use vectorised NumPy, avoid Python loops over spins
# For L=64 Ising, full-lattice checkerboard update:
sublattice_A = spins[::2, ::2]  # even-even sites
local_field = (np.roll(spins, 1, 0) + np.roll(spins, -1, 0) +
               np.roll(spins, 1, 1) + np.roll(spins, -1, 1))[::2, ::2]
delta_E = 2 * J * sublattice_A * local_field
accept = np.random.random(sublattice_A.shape) < np.exp(-beta * delta_E)
spins[::2, ::2] = np.where(accept, -sublattice_A, sublattice_A)
```

For production runs, use Numba JIT or C extensions for 10–100× speedup over pure Python.

---

## 9.6 Final Project Discussion

The course concludes with student project presentations. Suggested project topics:

- 3D Ising model: phase diagram and critical exponents vs. series expansion results.
- Heisenberg model on the Pyrochlore lattice: spin ice signatures.
- KMC of CO₂ → CO + O dissociation on a Ru catalyst surface.
- Parallel tempering for a frustrated spin glass (\\(J_{ij} = \pm J\\) random).
- Bayesian EOS fitting to LJ simulation data.
- Wang-Landau calculation of the Potts model density of states and the order of the transition for \\(q = 4, 5, 6\\).

---

## Summary

This chapter collected tools for:

- **Error analysis**: blocking, bootstrap, jackknife — essential for autocorrelated MC data.
- **Bayesian inference**: MCMC samples posterior distributions; fundamental to modern data analysis in physics.
- **Particle physics**: Geant4 detector simulation; phase space MC.
- **Transport**: photon and neutron MC; the radiative transfer equation.
- **Best practices**: reproducibility, parallelisation, GPU acceleration.

> [!NOTE]
> **The Road Ahead**
> The methods in this course underlie essentially all quantitative computational physics. The natural extensions are: Hamiltonian Monte Carlo (Ch. 5 of Betancourt's review), normalising flows for enhanced sampling, and machine-learning-accelerated MC (using neural network potentials as fast surrogates for DFT). The foundation you have built is directly applicable to all of these.
