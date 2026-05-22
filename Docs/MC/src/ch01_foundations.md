# Foundations of Probability & Randomness

## 1.1 Probability Spaces and Random Variables

A **probability space** is a triple \\((\Omega, \mathcal{F}, P)\\) where \\(\Omega\\) is the sample space, \\(\mathcal{F}\\) is a \\(\sigma\\)-algebra of events, and \\(P: \mathcal{F} \to [0,1]\\) is a probability measure satisfying \\(P(\Omega) = 1\\).

A **random variable** \\(X: \Omega \to \mathbb{R}\\) maps outcomes to real numbers. For a continuous random variable its **probability density function** (PDF) \\(p(x)\\) satisfies:

$$P(a \leq X \leq b) = \int_a^b p(x)\, dx, \qquad \int_{-\infty}^{\infty} p(x)\, dx = 1. \tag{1.1}$$

The **cumulative distribution function** (CDF) is:

$$F(x) = \int_{-\infty}^{x} p(x')\, dx'. \tag{1.2}$$

### Key Distributions in Physics

**Gaussian (Normal):**
$$p(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right). \tag{1.3}$$
Arises in measurement errors, Brownian motion, and the CLT (see §1.2).

**Poisson:**
$$P(n; \lambda) = \frac{\lambda^n e^{-\lambda}}{n!}, \quad n = 0, 1, 2, \ldots \tag{1.4}$$
Governs photon counts in a detector, nuclear decay events, and cosmic ray arrivals in a given time window.

**Exponential:**
$$p(t) = \lambda e^{-\lambda t}, \quad t \geq 0. \tag{1.5}$$
The waiting time between successive Poisson events — equivalently, the **lifetime** of a radioactive nucleus with decay constant \\(\lambda\\).

**Maxwell-Boltzmann speed distribution** (to be sampled in Ch. 2):
$$p(v) = 4\pi n \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 \exp\!\left(-\frac{mv^2}{2k_B T}\right). \tag{1.6}$$

> [!NOTE]
> **Radioactive Decay**
> A sample of \\(^{14}\\)C has decay constant \\(\lambda = 3.84 \times 10^{-12}\\) s\\(^{-1}\\). The number of decays in a 1-second window follows a Poisson distribution. If the initial activity is \\(A_0 = 10^4\\) Bq, the standard deviation in the count is \\(\sqrt{A_0} \approx 100\\) — illustrating how counting statistics limit detector precision.

### Moments and Cumulants

The **mean** and **variance** of \\(X\\):
$$\mu = \langle X \rangle = \int x\, p(x)\, dx, \qquad \sigma^2 = \langle (X - \mu)^2 \rangle. \tag{1.7}$$

The **moment generating function** \\(M(t) = \langle e^{tX} \rangle\\) and **characteristic function** \\(\phi(k) = \langle e^{ikX} \rangle\\) encode all moments.

---

## 1.2 The Law of Large Numbers and Central Limit Theorem

### Law of Large Numbers

Let \\(X_1, X_2, \ldots, X_N\\) be independent, identically distributed (i.i.d.) random variables with mean \\(\mu\\). Define the sample mean:

$$\bar{X}_N = \frac{1}{N} \sum_{i=1}^N X_i. \tag{1.8}$$

The **strong law of large numbers** states:

$$\bar{X}_N \xrightarrow{a.s.} \mu \quad \text{as } N \to \infty. \tag{1.9}$$

This underpins every Monte Carlo estimator: replace an ensemble average by a sample average.

### Central Limit Theorem

Regardless of the parent distribution \\(p(x)\\) (provided \\(\sigma^2 < \infty\\)), the distribution of \\(\bar{X}_N\\) converges to a Gaussian:

$$\frac{\bar{X}_N - \mu}{\sigma/\sqrt{N}} \xrightarrow{d} \mathcal{N}(0,1) \quad \text{as } N \to \infty. \tag{1.10}$$

**Consequence:** the statistical error of any MC estimator scales as:

$$\epsilon \sim \frac{\sigma}{\sqrt{N}}. \tag{1.11}$$

To halve the error, one must quadruple the number of samples. This \\(1/\sqrt{N}\\) convergence rate is universal — it does not depend on dimensionality, unlike grid-based quadrature.

> [!NOTE]
> **Why MC beats quadrature in high dimensions**
> A regular grid with \\(k\\) points per dimension in \\(d\\) dimensions requires \\(N = k^d\\) points. The error scales as \\(k^{-p}\\) for a \\(p\\)-th order method, i.e. \\(N^{-p/d}\\). For \\(d = 10\\) and \\(p = 4\\), the error goes as \\(N^{-0.4}\\), slower than MC's \\(N^{-1/2}\\). Above \\(d \approx 8\\), MC wins unconditionally.

---

## 1.3 Generating Random Numbers

### True vs. Pseudo-Random Numbers

A true random number generator (TRNG) harvests physical entropy — thermal noise, radioactive decay, atmospheric noise. Pseudo-random number generators (PRNGs) are deterministic algorithms producing sequences that pass statistical tests of randomness. For scientific computing, PRNGs are preferable: they are fast, reproducible (given the seed), and well-characterised.

### Linear Congruential Generators (LCGs)

$$x_{n+1} = (a\, x_n + c) \bmod m. \tag{1.12}$$

The Hull–Dobell theorem gives conditions on \\(a, c, m\\) for full period \\(m\\). A classic choice (ANSI C `rand`): \\(a = 1103515245\\), \\(c = 12345\\), \\(m = 2^{31}\\).

> [!WARNING]
> **LCGs are not suitable for serious MC work**
> LCGs have short periods and strong lattice correlations. RANDU (\\(a=65539\\), \\(m=2^{31}\\)) places all triples \\((x_n, x_{n+1}, x_{n+2})\\) on 15 parallel planes — catastrophic for 3D integration. Never use it.

### Mersenne Twister (MT19937)

The default PRNG in Python (`numpy.random`). Key properties:

- Period: \\(2^{19937} - 1\\) (a Mersenne prime, hence the name)
- Passes all Diehard and TestU01 statistical tests
- 623-dimensional equidistribution
- State: 624 32-bit integers

```python
import numpy as np
rng = np.random.default_rng(seed=42)   # modern API, reproducible
u = rng.uniform(0, 1, size=10_000)     # 10000 uniform samples
```

### PCG and Xoshiro Generators

Modern alternatives to MT for performance-critical code:

- **PCG64**: default in `numpy.random.default_rng`. Better statistical properties than MT, smaller state.
- **Xoshiro256\*\***: extremely fast, suitable for parallel streams.

### Random Numbers on the Unit Sphere

Uniformly distributed points on \\(S^2\\) require:

$$\theta = \arccos(1 - 2u_1), \quad \phi = 2\pi u_2, \tag{1.13}$$

where \\(u_1, u_2 \sim \mathcal{U}[0,1]\\). **Do not** sample \\(\theta\\) uniformly — this clusters points at the poles.

---

## 1.4 Testing Randomness

A sequence \\(\{x_n\}\\) that fails statistical tests may bias MC results. Standard tests:

### Chi-Squared Uniformity Test

Divide \\([0,1]\\) into \\(k\\) equal bins with expected count \\(E = N/k\\) each. The test statistic:

$$\chi^2 = \sum_{i=1}^k \frac{(O_i - E)^2}{E} \tag{1.14}$$

follows a \\(\chi^2\\) distribution with \\(k-1\\) degrees of freedom under \\(H_0\\) (perfect uniformity). Reject if \\(p < 0.05\\).

### Autocorrelation Test

The lag-\\(\tau\\) autocorrelation:

$$C(\tau) = \frac{\langle x_n x_{n+\tau} \rangle - \langle x_n \rangle^2}{\langle x_n^2 \rangle - \langle x_n \rangle^2}. \tag{1.15}$$

For a good PRNG, \\(C(\tau) \approx 0\\) for all \\(\tau > 0\\). In MCMC, non-zero \\(C(\tau)\\) reflects physical correlations and must be accounted for in error estimation (see Ch. 4).

### Spectral Test

In \\(d\\) dimensions, plot \\(d\\)-tuples \\((x_n, x_{n+1}, \ldots, x_{n+d-1})\\). Ideally these fill the unit hypercube uniformly; LCGs reveal planes.

> [!TIP]
> **The TestU01 Library**
> The most comprehensive battery of statistical tests is TestU01 (L'Ecuyer & Simard). It includes BigCrush (over 100 tests). MT19937 passes; many simple generators fail.

---

## 1.5 Computational Lab — Class 2

**Objectives:**

1. Implement a simple LCG and compare its \\(\chi^2\\) and spectral behaviour to MT19937.
2. Generate \\(N = 10^5\\) exponential random variates using the inverse CDF (see Ch. 2) and compare the empirical histogram to equation (1.5).
3. Simulate radioactive decay of \\(^{60}\\)Co (\\(t_{1/2} = 5.27\\) yr) for 1000 atoms over 20 years using the waiting-time method. Plot the activity as a function of time and compare to the analytic result \\(A(t) = A_0 e^{-\lambda t}\\).

> [!NOTE]
> **Skeleton Code**
> See Appendix A for the Python skeleton. You will need `numpy`, `scipy.stats`, and `matplotlib`.

---

## Summary

- A Monte Carlo estimator of \\(\langle f \rangle = \int f(x) p(x)\, dx\\) is \\(\hat{f} = \frac{1}{N}\sum_{i=1}^N f(x_i)\\) with \\(x_i \sim p(x)\\).
- The error is \\(\sigma/\sqrt{N}\\), universal and dimension-independent.
- Use MT19937 or PCG64; never use LCGs or RANDU for scientific work.
- Always test your RNG and seed it for reproducibility.
