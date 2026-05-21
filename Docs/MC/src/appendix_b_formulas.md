# Appendix B: Key Statistical Mechanics Formulas

---

## B.1 Ensembles

| Ensemble | Fixed variables | Partition function | Free energy |
|----------|----------------|-------------------|-------------|
| Microcanonical (NVE) | \\(N, V, E\\) | \\(\Omega(E)\\) | \\(S = k_B \ln \Omega\\) |
| Canonical (NVT) | \\(N, V, T\\) | \\(Z = \sum_i e^{-\beta E_i}\\) | \\(F = -k_BT \ln Z\\) |
| Grand canonical (\\(\mu\\)VT) | \\(\mu, V, T\\) | \\(\mathcal{Z} = \sum_{N,i} e^{-\beta(E_i - \mu N)}\\) | \\(\Omega = -k_BT \ln \mathcal{Z}\\) |
| Isothermal-isobaric (NPT) | \\(N, P, T\\) | \\(\Delta = \sum_i e^{-\beta(E_i + PV_i)}\\) | \\(G = -k_BT \ln \Delta\\) |

---

## B.2 Thermodynamic Relations from MC Data

Given canonical MC samples \\(\{E_k, M_k\}\\):

$$\langle E \rangle = \frac{1}{N}\sum_k E_k, \qquad \langle M \rangle = \frac{1}{N}\sum_k M_k$$

$$C_V = \frac{\langle E^2 \rangle - \langle E \rangle^2}{k_B T^2} = \frac{\beta^2}{N_{\rm spins}}\left(\langle H^2 \rangle - \langle H \rangle^2\right)$$

$$\chi = \frac{\langle M^2 \rangle - \langle M \rangle^2}{k_B T} = \frac{\beta}{N_{\rm spins}}\left(\langle (MN)^2 \rangle - \langle MN \rangle^2\right)$$

$$P = \frac{Nk_BT}{V} + \frac{\langle \mathcal{W} \rangle}{3V}, \quad \mathcal{W} = -\sum_{i<j} r_{ij} \frac{\partial \phi}{\partial r_{ij}} \quad (\text{virial})$$

---

## B.3 Ising Model Reference Values

**2D Square Lattice** (Onsager exact solution, \\(h = 0\\)):

$$k_BT_c = \frac{2J}{\ln(1+\sqrt{2})} \approx 2.2692\,J$$

$$M(T) = \left[1 - \sinh^{-4}(2\beta J)\right]^{1/8} \quad (T < T_c)$$

**Critical exponents (2D Ising):**

| Exponent | Symbol | Value |
|----------|--------|-------|
| Correlation length | \\(\nu\\) | 1 |
| Magnetisation | \\(\beta\\) | 1/8 |
| Susceptibility | \\(\gamma\\) | 7/4 |
| Specific heat | \\(\alpha\\) | 0 (log divergence) |
| Anomalous dimension | \\(\eta\\) | 1/4 |
| Dynamic (Metropolis) | \\(z\\) | ≈ 2.17 |
| Dynamic (Wolff) | \\(z\\) | ≈ 0.25 |

**3D Ising critical exponents** (numerical):

| Exponent | Value |
|----------|-------|
| \\(\nu\\) | 0.6301 |
| \\(\beta\\) | 0.3265 |
| \\(\gamma\\) | 1.2372 |
| \\(\eta\\) | 0.0364 |

---

## B.4 Heisenberg and XY Models

**3D Classical Heisenberg** (\\(J > 0\\)):
$$k_B T_c \approx 1.4432\,J \quad (\text{simple cubic, MC})$$

**2D XY model — Kosterlitz-Thouless transition:**
$$k_B T_{\rm KT} = \frac{\pi J}{2} \approx 1.5708\,J$$

Universal helicity modulus jump:
$$\lim_{T \to T_{\rm KT}^-} \Upsilon(T) = \frac{2}{\pi} k_B T_{\rm KT}$$

**Mermin-Wagner theorem:** \\(T_c = 0\\) for \\(n \geq 2\\) in \\(d \leq 2\\).

---

## B.5 Lennard-Jones Fluid Reference

Lennard-Jones potential:
$$\phi(r) = 4\varepsilon\left[\left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6\right]$$

Critical point (reduced units \\(T^* = k_BT/\varepsilon\\), \\(\rho^* = \rho\sigma^3\\)):
$$T_c^* \approx 1.326, \quad \rho_c^* \approx 0.316, \quad P_c^* \approx 0.129$$

Triple point: \\(T_{\rm tp}^* \approx 0.694\\), \\(\rho_{\rm tp,liq}^* \approx 0.845\\).

Argon parameters: \\(\varepsilon/k_B = 119.8\\) K, \\(\sigma = 3.405\\) Å.

---

## B.6 Arrhenius and Transition State Theory

$$k = \nu_0\, e^{-E_a/k_BT} \quad \text{(Arrhenius)}$$

$$k = \frac{k_BT}{h} e^{-\Delta G^\ddagger/k_BT} = \frac{k_BT}{h} e^{\Delta S^\ddagger/k_B} e^{-\Delta H^\ddagger/k_BT} \quad \text{(Eyring TST)}$$

Typical attempt frequency for solids: \\(\nu_0 \sim 10^{12}\text{–}10^{13}\\) s\\(^{-1}\\).

---

## B.7 Statistical Error Formulas

| Quantity | Formula |
|----------|---------|
| Sample mean | \\(\bar{A} = N^{-1}\sum_i A_i\\) |
| Sample variance | \\(s^2 = (N-1)^{-1}\sum_i(A_i - \bar{A})^2\\) |
| Standard error (i.i.d.) | \\(\text{SE} = s/\sqrt{N}\\) |
| Integrated autocorr. time | \\(\tau_{\rm int} = \frac{1}{2} + \sum_{\tau=1}^\infty C(\tau)\\) |
| Effective sample size | \\(N_{\rm eff} = N/(2\tau_{\rm int})\\) |
| True standard error | \\(\text{SE}_{\rm true} = s/\sqrt{N_{\rm eff}}\\) |
| Jackknife variance | \\(\sigma_{\rm JK}^2 = \frac{N-1}{N}\sum_k(\hat{\theta}_k - \bar{\theta})^2\\) |

---

## B.8 Free Energy Methods Reference

**Free energy perturbation:**
$$\Delta F_{A\to B} = -k_BT \ln \langle e^{-\beta(H_B - H_A)} \rangle_A$$

**Thermodynamic integration:**
$$\Delta F_{A\to B} = \int_0^1 \left\langle \frac{\partial H(\lambda)}{\partial\lambda} \right\rangle_\lambda d\lambda$$

**Wang-Landau:** \\(Z(T) = \sum_E g(E) e^{-\beta E}\\) from flat-histogram sampling of \\(g(E)\\).

**Parallel tempering swap acceptance:**
$$A = \min\!\left(1, e^{(\beta_k - \beta_{k+1})(E_k - E_{k+1})}\right)$$
