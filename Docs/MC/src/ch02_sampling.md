# Sampling Methods

## 2.1 The Sampling Problem

We want to draw samples \\(x_1, \ldots, x_N\\) from a target distribution \\(p(x)\\). If we can do this efficiently, we can estimate any expectation value:

$$\langle f \rangle = \int f(x)\, p(x)\, dx \approx \frac{1}{N} \sum_{i=1}^N f(x_i). \tag{2.1}$$

This chapter treats methods that work when \\(p(x)\\) is known analytically and can be sampled directly. Chapter 4 handles the harder case (MCMC) when only the unnormalised density is available.

---

## 2.2 Inverse Transform Sampling

If \\(F(x) = \int_{-\infty}^x p(x')\, dx'\\) is the CDF and \\(u \sim \mathcal{U}[0,1]\\), then:

$$x = F^{-1}(u) \tag{2.2}$$

is distributed according to \\(p(x)\\). This follows from the probability integral transform: \\(F(X) \sim \mathcal{U}[0,1]\\) for any continuous \\(X\\).

### Derivation

$$P(x \leq x_0) = P(F^{-1}(u) \leq x_0) = P(u \leq F(x_0)) = F(x_0). \tag{2.3}$$

### Examples

**Exponential distribution** (radioactive decay lifetimes):
$$F(t) = 1 - e^{-\lambda t} \implies t = -\frac{1}{\lambda}\ln(1-u) = -\frac{1}{\lambda}\ln u. \tag{2.4}$$

Since \\(1 - u \sim \mathcal{U}[0,1]\\) when \\(u \sim \mathcal{U}[0,1]\\), the last equality holds.

**Cauchy distribution** (resonance lineshapes, Lorentzian profiles):
$$p(x) = \frac{1}{\pi}\frac{\gamma}{(x-x_0)^2 + \gamma^2} \implies x = x_0 + \gamma \tan\!\left(\pi\left(u - \tfrac{1}{2}\right)\right). \tag{2.5}$$

**Planck spectrum** (photon energy sampling in radiative transfer):

The Planck energy density \\(u(\nu) \propto \nu^3/(e^{h\nu/k_BT}-1)\\) has no closed-form CDF inverse, but can be sampled via the method in §2.3 or by a dedicated algorithm (Baluev 2014).

> [!NOTE]
> **Stellar Atmosphere Simulation**
> Monte Carlo codes for stellar atmosphere modelling (e.g., CMFGEN, PHOENIX) sample photon packets from the Planck distribution at each atmospheric layer. The inverse CDF for the Planck spectrum is approximated numerically, then applied millions of times per model.

---

## 2.3 Rejection Sampling (von Neumann Method)

When \\(F^{-1}\\) is unavailable, find a **proposal distribution** \\(q(x)\\) and constant \\(M\\) such that:

$$p(x) \leq M\, q(x) \quad \forall x. \tag{2.6}$$

**Algorithm:**
1. Draw \\(x \sim q(x)\\).
2. Draw \\(u \sim \mathcal{U}[0,1]\\).
3. If \\(u \leq p(x) / (M q(x))\\), **accept** \\(x\\); else **reject** and return to 1.

The acceptance rate is \\(1/M\\), so we want \\(M\\) as small as possible — the tightest envelope.

> [!NOTE]
> **Why This Works**
> The joint distribution of accepted \\((x, u)\\) pairs is uniform under the curve \\(p(x)\\). Marginalising over \\(u\\) gives \\(p(x)\\).

### Example: Maxwell-Boltzmann Speed Distribution

The 3D speed distribution (eq. 1.6) is awkward to invert. With proposal \\(q(v) = \text{Gamma}(3/2, v_p)\\) (where \\(v_p = \sqrt{2k_BT/m}\\)), one can achieve \\(M \approx 1.1\\), giving a 91% acceptance rate.

> [!NOTE]
> **Molecular Dynamics Initialisation**
> MD simulations of noble gases or Lennard-Jones fluids initialise particle speeds by rejection-sampling the Maxwell-Boltzmann distribution. For argon at 300 K, \\(v_p \approx 352\\) m/s and the most probable speed drawn should match this within \\(\sim 1\%\\) for \\(N = 10^4\\) particles.

---

## 2.4 Importance Sampling

The idea: instead of sampling from \\(p(x)\\), sample from a proposal \\(q(x)\\) that concentrates where the integrand \\(f(x)p(x)\\) is large, and reweight:

$$\langle f \rangle = \int f(x)\, p(x)\, dx = \int f(x)\, \frac{p(x)}{q(x)}\, q(x)\, dx \approx \frac{1}{N}\sum_{i=1}^N f(x_i)\, w(x_i), \tag{2.7}$$

where \\(x_i \sim q(x)\\) and the **importance weight** is:

$$w(x) = \frac{p(x)}{q(x)}. \tag{2.8}$$

### Optimal Proposal Distribution

The variance of the estimator (2.7) is minimised when:

$$q^*(x) = \frac{|f(x)|\, p(x)}{\int |f(x')|\, p(x')\, dx'}, \tag{2.9}$$

i.e., \\(q^*(x) \propto |f(x)|\, p(x)\\). This is rarely available in closed form but guides the choice of \\(q\\).

### Variance Reduction

Define the naive variance \\(\sigma_0^2 = \text{Var}_{p}[f]\\) and the importance-sampled variance \\(\sigma_{IS}^2\\). The **variance reduction factor** is \\(\sigma_0^2 / \sigma_{IS}^2\\).

> [!NOTE]
> **Tail Probabilities in Particle Detectors**
> Estimating the probability of a particle depositing energy \\(E > E_{\text{threshold}}\\) in a thin detector requires sampling the far tail of \\(p(E)\\). Naive MC is hopelessly inefficient: if \\(P(E > E_{\text{th}}) = 10^{-6}\\), one needs \\(\sim 10^8\\) events for even 0.1% precision. Importance sampling with a shifted exponential proposal reduces this to \\(\sim 10^4\\) events — a factor \\(10^4\\) speedup.

> [!NOTE]
> **Virial Coefficients of Dense Gases**
> The second virial coefficient of a gas with pair potential \\(\phi(r)\\) is:
> $$B_2(T) = -2\pi \int_0^\infty (e^{-\beta\phi(r)} - 1)\, r^2\, dr.$$
> For a hard-sphere potential, the integrand is concentrated near \\(r = \sigma\\). Using \\(q(r) \propto r^2 e^{-r/\sigma}\\) as proposal reduces variance by a factor \\(\sim 5\\) compared to uniform sampling.

---

## 2.5 Stratified and Quasi-Monte Carlo Sampling

### Stratified Sampling

Divide the integration domain into \\(k\\) strata \\(S_1, \ldots, S_k\\). Draw \\(n_j\\) samples from each stratum and combine:

$$\hat{I} = \sum_{j=1}^k \frac{|S_j|}{n_j} \sum_{i \in S_j} f(x_i). \tag{2.10}$$

Optimal allocation: \\(n_j \propto |S_j| \sigma_j\\) where \\(\sigma_j\\) is the standard deviation of \\(f\\) within stratum \\(j\\). Variance is always less than or equal to naive MC.

### Quasi-Monte Carlo (QMC)

Replace pseudorandom sequences with **low-discrepancy sequences** that fill space more uniformly:

**Halton sequence** (base \\(b\\) van der Corput sequence):
$$h_n^{(b)} = \sum_{k=0}^K d_k b^{-(k+1)}, \tag{2.11}$$
where \\(d_k\\) are the digits of \\(n\\) in base \\(b\\).

**Sobol sequences**: higher-dimensional generalisations with better uniformity.

QMC achieves error \\(\mathcal{O}((\log N)^d / N)\\) for smooth functions, beating MC's \\(1/\sqrt{N}\\) for moderate \\(d\\).

> [!WARNING]
> QMC sequences are deterministic and do not admit straightforward error estimation. Use **randomised QMC** (scrambled Sobol) to recover statistical error bars.

> [!NOTE]
> **Classical Partition Functions**
> The configurational partition function of a \\(d\\)-dimensional harmonic oscillator lattice:
> $$Z = \int e^{-\beta \sum_{i} \frac{1}{2}k x_i^2}\, d^N x$$
> can be evaluated exactly, making it a useful benchmark. QMC (Sobol) converges in \\(N = 10^4\\) evaluations to the same accuracy as plain MC with \\(N = 10^6\\) for \\(d = 20\\).

---

## 2.6 Computational Lab — Class 4

**Objectives:**

1. Sample the Maxwell-Boltzmann speed distribution for N₂ at 300 K using rejection sampling. Plot the histogram and compare to equation (1.6). Compute \\(\langle v \rangle\\), \\(\langle v^2 \rangle^{1/2}\\), and \\(v_{\rm mp}\\) from your samples.

2. Use importance sampling to estimate the integral
$$I = \int_0^\infty x^4 e^{-x}\, dx = 24$$
using the proposal \\(q(x) = e^{-x}\\). Compare the variance to naive uniform-domain MC.

3. Compare stratified MC, Sobol QMC, and plain MC for integrating \\(f(x,y) = \sin(\pi x)\sin(\pi y)\\) over \\([0,1]^2\\). Plot error vs. \\(N\\) on a log-log scale.

> [!NOTE]
> **Skeleton Code**
> Sobol sequences are available in `scipy.stats.qmc.Sobol`. See Appendix A.

---

## Summary

| Method | When to use | Error scaling |
|--------|-------------|---------------|
| Inverse CDF | Closed-form \\(F^{-1}\\) exists | \\(1/\sqrt{N}\\) |
| Rejection sampling | \\(p(x)\\) bounded above by \\(Mq(x)\\) | \\(1/\sqrt{N}\\) |
| Importance sampling | Integrand concentrated in a small region | \\(1/\sqrt{N}\\) (reduced variance) |
| Stratified MC | Smooth integrands, known structure | Better than \\(1/\sqrt{N}\\) |
| Quasi-MC | Smooth, moderate dimension | \\(\sim (\log N)^d / N\\) |
