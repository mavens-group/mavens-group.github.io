# Markov Chain Monte Carlo

## 4.1 The Idea Behind MCMC

In statistical mechanics we want averages of the form:

$$\langle A \rangle = \frac{\sum_{\mathbf{x}} A(\mathbf{x})\, e^{-\beta H(\mathbf{x})}}{\sum_{\mathbf{x}} e^{-\beta H(\mathbf{x})}}. \tag{4.1}$$

We cannot enumerate all microstates \\(\mathbf{x}\\) (there are \\(\sim 2^N\\) for a spin system). We cannot directly draw from \\(p(\mathbf{x}) \propto e^{-\beta H(\mathbf{x})}\\) because \\(Z\\) is unknown.

The solution: construct a **Markov chain** with stationary distribution \\(p(\mathbf{x})\\). After an initial burn-in, the chain samples from \\(p(\mathbf{x})\\) and we can average along its trajectory.

---

## 4.2 Markov Chains

A Markov chain is a sequence \\(\mathbf{x}^{(0)}, \mathbf{x}^{(1)}, \ldots\\) where the transition \\(\mathbf{x}^{(t)} \to \mathbf{x}^{(t+1)}\\) depends only on \\(\mathbf{x}^{(t)}\\). The transition kernel \\(T(\mathbf{x} \to \mathbf{x}')\\) satisfies:

$$\sum_{\mathbf{x}'} T(\mathbf{x} \to \mathbf{x}') = 1. \tag{4.2}$$

### Detailed Balance

A sufficient condition for \\(p(\mathbf{x})\\) to be the stationary distribution is **detailed balance**:

$$p(\mathbf{x})\, T(\mathbf{x} \to \mathbf{x}') = p(\mathbf{x}')\, T(\mathbf{x}' \to \mathbf{x}). \tag{4.3}$$

This is a microscopic reversibility condition: in equilibrium, probability flux from \\(\mathbf{x}\\) to \\(\mathbf{x}'\\) equals the reverse flux.

### Ergodicity

For the chain to converge to \\(p\\) from any initial state, we need **ergodicity**: every state must be reachable from every other state in a finite number of steps. This requires the chain to be:

- **Irreducible**: all states communicate.
- **Aperiodic**: no trapping in cycles.

> [!NOTE]
> For physical systems, ergodicity can fail due to **broken ergodicity** — e.g., below \\(T_c\\) in an Ising ferromagnet, the chain can get trapped in a single magnetisation sector. Cluster algorithms (Ch. 5) partially address this.

---

## 4.3 The Metropolis–Hastings Algorithm

Proposed independently by Metropolis et al. (1953, Los Alamos) and generalised by Hastings (1970).

**Setup:** propose a move \\(\mathbf{x} \to \mathbf{x}'\\) with probability \\(Q(\mathbf{x} \to \mathbf{x}')\\). Accept with probability:

$$A(\mathbf{x} \to \mathbf{x}') = \min\!\left(1,\, \frac{p(\mathbf{x}')\, Q(\mathbf{x}' \to \mathbf{x})}{p(\mathbf{x})\, Q(\mathbf{x} \to \mathbf{x}')}\right). \tag{4.4}$$

If \\(Q\\) is symmetric (\\(Q(\mathbf{x} \to \mathbf{x}') = Q(\mathbf{x}' \to \mathbf{x})\\)), this reduces to the **Metropolis criterion**:

$$A = \min\!\left(1,\, \frac{p(\mathbf{x}')}{p(\mathbf{x})}\right) = \min\!\left(1,\, e^{-\beta \Delta H}\right), \tag{4.5}$$

where \\(\Delta H = H(\mathbf{x}') - H(\mathbf{x})\\).

**Algorithm (Metropolis):**
```
initialise x
for t = 1 to N_steps:
    propose x' from Q(x → x')
    compute ΔH = H(x') - H(x)
    if ΔH < 0: accept x' → x
    else: accept x' with probability exp(-β ΔH)
    record x
```

### Verification of Detailed Balance

$$p(\mathbf{x})\, T(\mathbf{x} \to \mathbf{x}') = p(\mathbf{x})\, Q(\mathbf{x} \to \mathbf{x}')\, \min\!\left(1, \frac{p(\mathbf{x}')}{p(\mathbf{x})}\right) = \min(p(\mathbf{x}'), p(\mathbf{x}))\, Q. \tag{4.6}$$

This is symmetric in \\(\mathbf{x}, \mathbf{x}'\\), confirming detailed balance.

> [!NOTE]
> **Lennard-Jones Fluid**
> For \\(N\\) particles in a box with pair potential \\(\phi(r) = 4\epsilon[(\sigma/r)^{12} - (\sigma/r)^6]\\), a standard MC move displaces one particle by \\(\delta \mathbf{r}\\) drawn from a uniform cube of side \\(2\delta_{\max}\\). The energy change \\(\Delta H\\) only involves the moved particle's neighbours — \\(\mathcal{O}(1)\\) work per step. Tune \\(\delta_{\max}\\) to achieve 40–50% acceptance rate for efficient sampling.

> [!NOTE]
> **Polymer Chain Configurational Sampling**
> A freely jointed chain of \\(n\\) monomers has \\(3(n-1)\\) degrees of freedom. A **pivot move** rotates a random sub-chain about a random bond by a random angle. The Metropolis criterion with the Boltzmann weight for bending energy and excluded volume efficiently samples chain configurations. This is the basis of polymer Monte Carlo in biophysics and materials science.

---

## 4.4 Gibbs Sampling

In Gibbs sampling, update each variable \\(x_i\\) in turn by sampling from the **conditional distribution**:

$$x_i^{(t+1)} \sim p(x_i \mid x_1^{(t+1)}, \ldots, x_{i-1}^{(t+1)}, x_{i+1}^{(t)}, \ldots, x_d^{(t)}). \tag{4.7}$$

No acceptance/rejection step — all proposals are accepted. Requires the conditionals to be tractable.

> [!NOTE]
> **Ising Model via Gibbs Sampling**
> For the Ising model, the conditional distribution of spin \\(s_i\\) given all others is:
> $$P(s_i = +1 \mid \{s_{j \neq i}\}) = \frac{1}{1 + e^{-2\beta J \sum_j s_j}},$$
> where the sum is over nearest neighbours. This is a single Bernoulli draw — \\(\mathcal{O}(1)\\) cost. Gibbs sampling of the Ising model is equivalent to the **heat bath algorithm**.

---

## 4.5 Convergence Diagnostics

The chain must reach equilibrium before measurements begin. Never skip this step.

### Burn-in

Discard the first \\(N_{\rm burn}\\) steps. Plot the running average of an observable vs. step number; burn-in is adequate when the average has stabilised.

### Autocorrelation Time

Consecutive samples are correlated. The **integrated autocorrelation time**:

$$\tau_{\rm int} = \frac{1}{2} + \sum_{\tau=1}^{\infty} C(\tau), \tag{4.8}$$

where \\(C(\tau) = \langle s_t s_{t+\tau} \rangle_c / \langle s_t^2 \rangle_c\\) is the normalised autocorrelation. The effective sample size is:

$$N_{\rm eff} = \frac{N}{2\tau_{\rm int}}. \tag{4.9}$$

The true statistical error is \\(\sigma / \sqrt{N_{\rm eff}}\\), not \\(\sigma / \sqrt{N}\\).

> [!WARNING]
> **Critical Slowing Down**
> Near a continuous phase transition at \\(T_c\\), the autocorrelation time diverges as:
> $$\tau_{\rm int} \sim \xi^z \sim |T - T_c|^{-\nu z},$$
> where \\(\xi\\) is the correlation length and \\(z \approx 2\\) for local algorithms (Metropolis). For a 100×100 Ising lattice at \\(T_c\\), \\(\tau_{\rm int} \sim 10^3\\) MC sweeps. Cluster algorithms (Ch. 5) have \\(z \approx 0.2\\).

### Gelman-Rubin Diagnostic

Run \\(M \geq 4\\) independent chains. The potential scale reduction factor:

$$\hat{R} = \sqrt{\frac{\hat{V}}{W}}, \tag{4.10}$$

where \\(W\\) is the within-chain variance and \\(\hat{V}\\) is the pooled variance estimate. Convergence: \\(\hat{R} < 1.01\\).

---

## 4.6 Computational Lab — Class 8

**Objectives:**

1. Implement the Metropolis algorithm for a 1D double-well potential \\(V(x) = (x^2 - 1)^2\\) at inverse temperature \\(\beta = 2\\). Plot the trajectory, histogram, and autocorrelation function \\(C(\tau)\\). Compute \\(\tau_{\rm int}\\).

2. Implement MC for a Lennard-Jones dimer in 2D. Compare the mean inter-particle separation to the analytic result from the pair distribution function.

3. Run the Metropolis algorithm for the 1D Ising model (\\(N=50\\) spins) and compute the specific heat \\(C_V = \beta^2(\langle E^2 \rangle - \langle E \rangle^2)\\). Compare to the exact result.

> [!NOTE]
> The exact specific heat for the 1D Ising model (no field): \\(C_V / k_B = (\beta J)^2 / \cosh^2(\beta J)\\) per spin.

---

## Summary

- MCMC constructs a Markov chain with the target distribution \\(p(\mathbf{x}) \propto e^{-\beta H}\\) as its stationary distribution.
- Metropolis-Hastings: detailed balance is satisfied by the acceptance criterion \\(A = \min(1, e^{-\beta \Delta H})\\).
- Gibbs sampling: sample each variable from its conditional; always accepted.
- Statistical errors require \\(N_{\rm eff} = N / (2\tau_{\rm int})\\), not \\(N\\).
- Use Gelman-Rubin \\(\hat{R}\\) and autocorrelation plots to verify convergence.
