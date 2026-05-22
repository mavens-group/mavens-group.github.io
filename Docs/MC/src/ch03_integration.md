# Monte Carlo Integration

## 3.1 The Basic Estimator

Given an integral \\(I = \int_\Omega f(\mathbf{x})\, d\mathbf{x}\\) over a domain \\(\Omega \subset \mathbb{R}^d\\) with volume \\(|\Omega|\\), draw \\(\mathbf{x}_i \sim \mathcal{U}(\Omega)\\) and estimate:

$$\hat{I} = \frac{|\Omega|}{N} \sum_{i=1}^N f(\mathbf{x}_i). \tag{3.1}$$

The **standard error** of this estimator is:

$$\sigma_{\hat{I}} = \frac{|\Omega|}{\sqrt{N}} \sqrt{\frac{1}{N-1}\sum_{i=1}^N \left(f(\mathbf{x}_i) - \bar{f}\right)^2}. \tag{3.2}$$

This is the fundamental MC integration formula. The error scales as \\(N^{-1/2}\\) regardless of dimension — the key advantage over deterministic quadrature in high dimensions.

> [!NOTE]
> **Estimating π**
> \\(\pi = 4 \times P(\text{point in unit circle})\\). Draw \\(N\\) points uniform in \\([-1,1]^2\\), accept those with \\(x^2 + y^2 \leq 1\\):
> $$\hat{\pi} = 4 \times \frac{N_{\rm in}}{N}.$$
> For \\(N = 10^6\\): error \\(\approx 4\sigma/\sqrt{N} \approx 0.002\\). This is pedagogically useful but inefficient — better methods exist.

---

## 3.2 Variance Reduction Techniques

### 3.2.1 Antithetic Variates

If \\(f\\) is monotone, the pairs \\((f(u), f(1-u))\\) are negatively correlated. Replace naive estimator with:

$$\hat{I}_{\rm AV} = \frac{1}{N}\sum_{i=1}^{N/2} \frac{f(u_i) + f(1-u_i)}{2}. \tag{3.3}$$

The variance is reduced by a factor \\((1 + \rho)/2\\) where \\(\rho < 0\\) is the correlation between \\(f(u)\\) and \\(f(1-u)\\).

### 3.2.2 Control Variates

Choose a function \\(g(\mathbf{x})\\) with known mean \\(\mu_g = \int g(\mathbf{x})p(\mathbf{x})\,d\mathbf{x}\\) and high correlation with \\(f\\). Define:

$$h(\mathbf{x}) = f(\mathbf{x}) - c(g(\mathbf{x}) - \mu_g). \tag{3.4}$$

Since \\(\langle h \rangle = \langle f \rangle\\), we can estimate \\(\langle f \rangle\\) via \\(\hat{h}\\). The optimal coefficient is:

$$c^* = \frac{\text{Cov}(f, g)}{\text{Var}(g)}, \tag{3.5}$$

giving variance reduction factor \\((1 - \rho_{fg}^2)\\). If \\(|\rho_{fg}| = 0.99\\), variance drops by \\(\sim 10^4\\).

> [!NOTE]
> **Second Virial Coefficient of Hard Spheres**
> For the pair potential \\(\phi(r) = 0\\) for \\(r > \sigma\\) and \\(\infty\\) for \\(r < \sigma\\):
> $$B_2 = -2\pi \int_0^\infty (e^{-\beta\phi(r)} - 1)\, r^2\, dr = \frac{2\pi\sigma^3}{3}.$$
> This is analytically known. When estimating \\(B_2\\) for a soft potential (e.g., Lennard-Jones), use the hard-sphere \\(B_2\\) as a control variate: \\(g(r) = \Theta(\sigma - r)\\). This can reduce variance by a factor of 3–5 near the Boyle temperature.

### 3.2.3 Rao-Blackwellisation

Analytically integrate out some variables and MC-sample only the remainder. If \\(f(\mathbf{x}) = f(x_1, x_2)\\) and \\(\int f(x_1, x_2) p_2(x_2)\,dx_2 = \tilde{f}(x_1)\\) is tractable:

$$\hat{I} = \frac{1}{N}\sum_{i=1}^N \tilde{f}(x_{1,i}), \quad \text{Var}[\tilde{f}(X_1)] \leq \text{Var}[f(X_1, X_2)]. \tag{3.6}$$

---

## 3.3 Multi-Dimensional Integration

### The Curse of Dimensionality

For a \\(d\\)-dimensional integral with regular quadrature using \\(k\\) points per dimension:

| Method | Error | Points needed for \\(\epsilon = 10^{-3}\\), \\(d = 10\\) |
|--------|-------|-------------------------------|
| Trapezoidal | \\(k^{-2}\\) | \\(10^{15}\\) |
| Simpson's | \\(k^{-4}\\) | \\(10^{7.5}\\) |
| Monte Carlo | \\(N^{-1/2}\\) | \\(10^6\\) |

MC requires \\(N = \sigma^2/\epsilon^2\\) samples — **independent of \\(d\\)**.

### Phase Space Integrals in Particle Physics

The \\(n\\)-body phase space integral for a decay \\(A \to 1 + 2 + \cdots + n\\) involves a \\(3n - 4\\) dimensional integral. For \\(n = 5\\) (11-dimensional), MC is the only practical approach. Tools like RAMBO or VEGAS are standard.

**VEGAS algorithm** (Lepage 1978): adaptive importance sampling that iteratively refines a grid to concentrate points where \\(|f|\\) is large. Widely used in particle physics for cross-section calculations.

> [!NOTE]
> **Atomic Form Factors**
> The electron density form factor for atomic hydrogen:
> $$f(\mathbf{q}) = \int |\psi_{1s}(\mathbf{r})|^2 e^{i\mathbf{q}\cdot\mathbf{r}}\, d^3r = \frac{1}{(1 + q^2 a_0^2/4)^2}$$
> is analytically known. For multi-electron atoms, the 3\\(Z\\)-dimensional integral \\(\int |\Psi(\mathbf{r}_1,\ldots,\mathbf{r}_Z)|^2 e^{i\mathbf{q}\cdot\mathbf{r}_1}\, d^{3Z}r\\) requires MC. For iron (\\(Z=26\\)), this is a 78-dimensional integral.

---

## 3.4 Estimating Partition Functions

The canonical partition function:
$$Z = \int e^{-\beta H(\mathbf{q},\mathbf{p})}\, d\mathbf{q}\, d\mathbf{p} \tag{3.7}$$

is a \\(6N\\)-dimensional integral for \\(N\\) particles. Direct MC evaluation is only possible for small systems. In practice, we compute **ratios** and **differences** of free energies (see Ch. 7).

### Thermodynamic Averages

Any observable \\(A\\) in the canonical ensemble:

$$\langle A \rangle = \frac{\int A(\mathbf{x})\, e^{-\beta H(\mathbf{x})}\, d\mathbf{x}}{\int e^{-\beta H(\mathbf{x})}\, d\mathbf{x}}. \tag{3.8}$$

Naive MC estimates numerator and denominator separately — both are exponentially small in \\(N\\) and heavily dominated by rare configurations. **Importance sampling with \\(p(\mathbf{x}) \propto e^{-\beta H(\mathbf{x})}\\)** is the solution — this is the Metropolis algorithm (Ch. 4).

> [!NOTE]
> **Configurational Energy of Argon**
> For 108 argon atoms in a cubic box at 85 K (near the triple point), the configurational partition function is a \\(324\\)-dimensional integral. Naive MC requires \\(\sim 10^{100}\\) samples to find the relevant configuration space. Metropolis sampling (Ch. 4) visits configurations according to their Boltzmann weight and makes the problem tractable with \\(\sim 10^6\\) steps.

---

## 3.5 Error Analysis for MC Integrals

### Standard Error and Confidence Intervals

Given \\(N\\) samples \\(\{f_i\}\\):

$$\hat{I} = \frac{1}{N}\sum_i f_i, \qquad s^2 = \frac{1}{N-1}\sum_i (f_i - \hat{I})^2, \qquad \sigma_{\hat{I}} = \frac{s}{\sqrt{N}}. \tag{3.9}$$

A 95% confidence interval: \\(\hat{I} \pm 1.96\,\sigma_{\hat{I}}\\).

### Multiple Independent Runs

Run \\(M\\) independent simulations, each giving \\(\hat{I}_k\\). The grand estimate and its error:

$$\bar{I} = \frac{1}{M}\sum_{k=1}^M \hat{I}_k, \qquad \sigma_{\bar{I}} = \frac{s_M}{\sqrt{M}}. \tag{3.10}$$

This is the most robust approach when \\(M \geq 5\\).

> [!WARNING]
> **Do not underestimate your error**
> Publishing MC results without statistical errors is unacceptable. Always report \\(\hat{I} \pm \sigma_{\hat{I}}\\) and state \\(N\\). The error should decrease as \\(N^{-1/2}\\) — if it does not, check for bugs or autocorrelation (relevant in MCMC, Ch. 4).

---

## 3.6 Computational Lab — Class 6

**Objectives:**

1. Compute \\(B_2(T)\\) for a Lennard-Jones gas with \\(\epsilon/k_B = 120\\) K and \\(\sigma = 3.4\\) Å (argon parameters) at \\(T = 300\\) K using plain MC, antithetic variates, and importance sampling. Compare the variance of the three estimators.

2. Estimate the configurational energy \\(\langle U \rangle\\) of 4 hard spheres in a 2D box using uniform MC sampling. How many samples are needed before a single configuration with no overlaps is found? This motivates the Metropolis algorithm.

3. Use VEGAS (via `scipy.integrate.quad` or `vegas` package) to compute a 4D integral of your choice. Compare to Sobol QMC.

---

## Summary

- The MC estimator has error \\(\sigma/\sqrt{N}\\), dimension-independent.
- Antithetic variates, control variates, and importance sampling all reduce variance without changing the estimator's mean.
- Multi-dimensional integrals arising in statistical mechanics and particle physics are the natural domain of MC.
- Always quote statistical errors.
