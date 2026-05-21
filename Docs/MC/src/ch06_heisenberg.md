# Chapter 6: The Heisenberg Model & Classical Spin Systems

*Class 11*

---

## 6.1 Classical Spin Models

The Ising model restricts spins to two states. Real magnetic materials often have **continuous** spin degrees of freedom. Classical spin models capture this:

| Model | Spin \\(\mathbf{S}_i\\) | Dimensionality | Example system |
|-------|------------------------|----------------|----------------|
| Ising | \\(\pm 1\\) | \\(n=1\\) | Uniaxial magnets |
| XY | \\((\cos\theta_i, \sin\theta_i)\\) | \\(n=2\\) | Planar magnets, superfluids |
| Heisenberg | \\((S_i^x, S_i^y, S_i^z)\\), \\(|\mathbf{S}|=1\\) | \\(n=3\\) | Isotropic magnets |

These are the \\(O(n)\\) models, characterised by the symmetry group of the spin space.

---

## 6.2 The Classical Heisenberg Model

### Hamiltonian

$$H = -J \sum_{\langle i,j \rangle} \mathbf{S}_i \cdot \mathbf{S}_j - \mathbf{h} \cdot \sum_i \mathbf{S}_i, \quad |\mathbf{S}_i| = 1. \tag{6.1}$$

Each spin is a unit vector on \\(S^2\\). For \\(J > 0\\) (ferromagnetic) in 3D, there is a phase transition at finite \\(T_c\\). In 1D and 2D, the **Mermin-Wagner theorem** forbids continuous symmetry breaking at any \\(T > 0\\).

> [!NOTE]
> **Mermin-Wagner Theorem**
> In a 2D system with a continuous symmetry (\\(n \geq 2\\)) and short-range interactions, there is no spontaneous symmetry breaking at any finite temperature. Long-range order is destroyed by spin-wave fluctuations. The 2D Ising model (discrete symmetry) is exempt.

### Physical Examples

> [!NOTE]
> **MnO and FeF₂**
> MnO has a rock-salt structure with Mn²⁺ ions carrying spin \\(S = 5/2\\). Below the Néel temperature \\(T_N = 122\\) K, spins order antiferromagnetically (\\(J < 0\\)) in (111) planes — well described by the classical Heisenberg model. FeF₂ is a nearly ideal Ising antiferromagnet (\\(T_N = 78\\) K) due to strong single-ion anisotropy.

> [!NOTE]
> **Spin-Ice Materials: Dy₂Ti₂O₇**
> In spin-ice, magnetic moments sit on a pyrochlore lattice and are constrained to point along local ⟨111⟩ axes. The ice rule (2-in, 2-out per tetrahedron) maps to the proton disorder in water ice. MC simulations with dipolar interactions reproduce the broad specific heat anomaly, diffuse neutron scattering, and emergent magnetic monopole excitations.

---

## 6.3 MC Updates for Continuous Spins

### Random Rotation on \\(S^2\\)

A Metropolis update must propose \\(\mathbf{S}'\\) from the surface of the unit sphere. **Do not** sample angles uniformly — this oversamples the poles.

Correct uniform sampling on \\(S^2\\):
$$\cos\theta \sim \mathcal{U}[-1,1], \quad \phi \sim \mathcal{U}[0, 2\pi]. \tag{6.2}$$

In practice, propose a **small rotation**:

$$\mathbf{S}'_i = \mathbf{S}_i + \delta \mathbf{v}, \quad \text{then normalise}, \tag{6.3}$$

where \\(\delta \mathbf{v}\\) is drawn from a small cube. Tune \\(\delta\\) for 40–50% acceptance.

The energy change:
$$\Delta H = -J (\mathbf{S}'_i - \mathbf{S}_i) \cdot \mathbf{h}_{\rm eff}, \quad \mathbf{h}_{\rm eff} = \sum_{j \in \partial i} \mathbf{S}_j + \mathbf{h}/J. \tag{6.4}$$

### Over-Relaxation

The **over-relaxation** (or microcanonical) step reflects the spin about its local field direction:

$$\mathbf{S}'_i = 2(\hat{\mathbf{h}}_{\rm eff} \cdot \mathbf{S}_i)\hat{\mathbf{h}}_{\rm eff} - \mathbf{S}_i. \tag{6.5}$$

This is always accepted (\\(\Delta H = 0\\)) and moves the spin to the "opposite side" of its local field. Combined with Metropolis steps in ratio \\(\sim 4:1\\) (over-relaxation: Metropolis), it dramatically reduces autocorrelation time while maintaining ergodicity.

---

## 6.4 The XY Model and the Kosterlitz-Thouless Transition

The 2D XY model has spins \\(\mathbf{S}_i = (\cos\theta_i, \sin\theta_i)\\):

$$H = -J \sum_{\langle i,j \rangle} \cos(\theta_i - \theta_j). \tag{6.6}$$

Despite Mermin-Wagner (no long-range order), the 2D XY model has a remarkable **topological phase transition** at \\(T_{\rm KT} = \pi J / 2\\) (Kosterlitz-Thouless 1973, Nobel Prize 2016).

### Vortices

A **vortex** is a topological defect where the spin winds by \\(2\pi\\) around a loop:
$$\oint \nabla \theta \cdot d\mathbf{l} = 2\pi n, \quad n \in \mathbb{Z}. \tag{6.7}$$

Below \\(T_{\rm KT}\\): vortices bound in pairs (vanishing net topological charge). Algebraic long-range order.

Above \\(T_{\rm KT}\\): free vortices proliferate, destroying quasi-long-range order. The transition is driven by vortex unbinding.

> [!NOTE]
> **Superfluid Helium Films**
> The 2D superfluid transition of \\(^4\\)He adsorbed on a substrate (e.g., graphite) belongs to the XY universality class. The superfluid stiffness \\(\rho_s\\) jumps discontinuously at \\(T_{\rm KT}\\) — the "universal jump" predicted by Nelson and Kosterlitz and confirmed by Rudnick (1978). MC simulations of the 2D XY model reproduce this jump.

### Measuring the KT Transition

The helicity modulus (spin-wave stiffness):
$$\Upsilon = J\left[\langle \cos(\theta_i - \theta_j) \rangle - \frac{J}{T} \langle \sin^2(\theta_i - \theta_j) \rangle\right] \tag{6.8}$$

(averaged over horizontal bonds). The universal jump condition: \\(\Upsilon(T_{\rm KT}) = 2T_{\rm KT}/\pi\\). This gives a sharp MC signature of \\(T_{\rm KT}\\).

---

## 6.5 Frustrated Spin Systems

When competing interactions cannot all be simultaneously satisfied, the system is **frustrated**.

### Triangular Antiferromagnet

For \\(J < 0\\) on a triangular lattice, not all pairs of neighbours can be antiparallel. The ground state is the 120° structure; entropy remains finite at \\(T = 0\\). MC reveals a continuous spectrum of degenerate ground states.

### Heisenberg Antiferromagnet on the Kagome Lattice

Extreme frustration — the classical ground-state degeneracy is exponentially large. The system remains disordered (a **classical spin liquid**) down to \\(T = 0\\). MC simulations show no peak in \\(C_V\\), a signature of the absence of order.

> [!NOTE]
> **Spin Ice: Emergent Monopoles**
> In Dy₂Ti₂O₇, the "2-in, 2-out" ice rule is violated at finite \\(T\\) by topological excitations that act as magnetic monopoles (Castelnovo, Moessner & Sondhi 2008). MC simulations with dipolar interactions reproduce the monopole density, their diffusion constant, and the anomalous low-\\(T\\) specific heat.

---

## 6.6 Spin-Spin Correlation Functions

The **spin-spin correlation function**:

$$G(\mathbf{r}) = \langle \mathbf{S}_0 \cdot \mathbf{S}_{\mathbf{r}} \rangle \tag{6.9}$$

characterises spatial ordering. In the ordered phase: \\(G(r) \to M^2\\) as \\(r \to \infty\\). At \\(T_c\\): \\(G(r) \sim r^{-(d-2+\eta)}\\) with anomalous exponent \\(\eta\\).

The correlation length \\(\xi\\) is extracted from the exponential decay in the disordered phase:

$$G(r) \sim e^{-r/\xi} \quad (T > T_c). \tag{6.10}$$

---

## 6.7 Computational Lab — Class 11

**Objectives:**

1. Simulate the 3D classical Heisenberg model on an \\(L = 16\\) cubic lattice. Using Metropolis + over-relaxation, compute \\(\langle |\mathbf{M}| \rangle\\) and \\(\chi\\) as a function of \\(T\\). Compare \\(T_c\\) to the literature value \\(T_c \approx 1.443 J/k_B\\).

2. Simulate the 2D XY model on an \\(L = 64\\) lattice. Compute the helicity modulus \\(\Upsilon(T)\\) and locate \\(T_{\rm KT}\\). Compare to the theoretical prediction \\(T_{\rm KT} = \pi J / 2 \approx 1.571 J/k_B\\).

3. Visualise vortices in the 2D XY model above and below \\(T_{\rm KT}\\) by plotting the local winding number on each plaquette. Count free vortices as a function of \\(T\\).

---

## Summary

- The classical Heisenberg model (continuous spins on \\(S^2\\)) requires correct uniform sampling of \\(S^2\\).
- Over-relaxation dramatically reduces \\(\tau_{\rm int}\\) at low cost.
- The 2D XY model: KT transition at \\(T_{\rm KT} = \pi J/2\\), driven by vortex unbinding.
- Frustration (triangular AF, kagomé, spin ice) leads to macroscopic ground-state degeneracy and exotic physics.
- Spin-spin correlation functions and helicity modulus are key MC observables.
