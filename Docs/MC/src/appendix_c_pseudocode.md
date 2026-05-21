# Appendix C: Algorithm Pseudocode

Clean, language-agnostic pseudocode for all major algorithms in this course.

---

## C.1 Metropolis–Hastings

```
INPUT: target p(x), proposal Q(x→x'), initial x, N_steps, β
OUTPUT: trajectory {x^(t)}

x ← x_0
for t = 1 to N_steps:
    propose x' ~ Q(x → x')
    α ← p(x') Q(x'→x) / [p(x) Q(x→x')]
    u ~ Uniform(0, 1)
    if u < min(1, α):
        x ← x'            # accept
    record x^(t) ← x
```

For symmetric proposals (\\(Q\\) symmetric): \\(\alpha = p(x')/p(x) = e^{-\beta \Delta H}\\).

---

## C.2 Gibbs Sampler

```
INPUT: conditional distributions p(x_i | x_{-i}), initial x, N_steps
OUTPUT: trajectory {x^(t)}

for t = 1 to N_steps:
    for i = 1 to d:
        x_i ← sample from p(x_i | x_1,...,x_{i-1}, x_{i+1},...,x_d)
    record x^(t) ← x
```

---

## C.3 Ising Metropolis (Single-Spin Flip)

```
INPUT: L × L spin lattice, β, J, N_sweeps
OUTPUT: time series of E, M

initialise spins randomly ±1
precompute: acc[ΔE] = min(1, exp(-β ΔE)) for ΔE in {-8J,-4J,0,4J,8J}

for sweep = 1 to N_sweeps:
    for k = 1 to L²:
        pick spin (i,j) at random
        ΔE ← 2J · s[i,j] · (s[i+1,j] + s[i-1,j] + s[i,j+1] + s[i,j-1])
        u ~ Uniform(0,1)
        if u < acc[ΔE]:
            s[i,j] ← -s[i,j]
    record E ← Σ_<ij> (-J s_i s_j), M ← Σ_i s_i / L²
```

---

## C.4 Wolff Cluster Algorithm

```
INPUT: L × L spin lattice, β, J
OUTPUT: updated spins, cluster size

pick random seed (i₀, j₀)
cluster_spin ← s[i₀, j₀]
p_add ← 1 - exp(-2βJ)
cluster ← {(i₀, j₀)}
queue ← {(i₀, j₀)}

while queue not empty:
    (i, j) ← pop from queue
    for each neighbour (i', j') of (i, j):
        if s[i',j'] == cluster_spin and (i',j') not in cluster:
            u ~ Uniform(0,1)
            if u < p_add:
                add (i',j') to cluster and queue

for each (i,j) in cluster:
    s[i,j] ← -s[i,j]

return |cluster|
```

---

## C.5 Wang-Landau Algorithm

```
INPUT: system, energy range [E_min, E_max], bin width ΔE
OUTPUT: density of states g(E)

initialise: g(E) ← 1 for all E bins
            H(E) ← 0 (histogram)
            f ← exp(1) ≈ 2.718
            flatness_criterion ← 0.8

x ← random initial configuration
E ← energy(x)

while f > exp(1e-8):
    propose x' (random spin flip or move)
    E' ← energy(x')
    u ~ Uniform(0,1)
    if u < g(E) / g(E'):
        x ← x'
        E ← E'
    g(E) ← g(E) · f
    H(E) ← H(E) + 1

    if histogram is flat (min(H) > flatness_criterion · mean(H)):
        f ← sqrt(f)
        H(E) ← 0 for all E

return g(E)
```

Flatness check: \\(\min_E H(E) > 0.8 \times \langle H \rangle\\).

---

## C.6 BKL / Gillespie KMC

```
INPUT: initial state α, rate catalog {k_j(α)}, T_max
OUTPUT: trajectory of states and times

t ← 0
state ← α

while t < T_max:
    # 1. Compute all rates from current state
    rates ← [k_1(state), k_2(state), ..., k_M(state)]
    K_tot ← sum(rates)

    # 2. Draw time increment
    u1 ~ Uniform(0,1)
    dt ← -ln(u1) / K_tot
    t ← t + dt

    # 3. Select event
    u2 ~ Uniform(0,1)
    cumulative ← 0
    for j = 1 to M:
        cumulative ← cumulative + rates[j]
        if u2 · K_tot ≤ cumulative:
            execute event j
            break

    # 4. Update state and rate catalog
    state ← new_state_after_event_j
    record (t, state)
```

Event selection can be done in \\(\mathcal{O}(\log M)\\) using binary search on the cumulative rate array.

---

## C.7 Parallel Tempering

```
INPUT: M replicas at temperatures T_1 < T_2 < ... < T_M
       N_swap steps between swap attempts
OUTPUT: sampled configurations at each temperature

initialise: x_k ~ random, for k = 1...M

for step = 1 to N_total:
    # Standard MC/MD at each temperature (in parallel)
    for k = 1 to M (parallel):
        perform N_swap sweeps of x_k at β_k

    # Attempt swaps between adjacent replicas
    for k = 1 to M-1 (sequential or checkerboard):
        Δ ← (β_{k+1} - β_k) · (H(x_k) - H(x_{k+1}))
        u ~ Uniform(0,1)
        if u < min(1, exp(Δ)):
            swap x_k ↔ x_{k+1}

    record x_k for all k
```

---

## C.8 Umbrella Sampling + WHAM

```
INPUT: M windows with centres {ξ₀^(m)}, spring constants {K^(m)}
       N_steps per window
OUTPUT: free energy profile F(ξ)

# Step 1: Run biased simulations
for m = 1 to M:
    H_biased(x) ← H(x) + ½ K^(m) (ξ(x) - ξ₀^(m))²
    run N_steps Metropolis with H_biased
    record histogram n_m(ξ)

# Step 2: WHAM self-consistent equations
initialise F_m ← 0 for m = 1...M

repeat until convergence:
    # Unbiased density
    ρ(ξ) ← Σ_m n_m(ξ) / Σ_m N_m exp(β F_m - β V_m(ξ))

    # Update free energy offsets
    F_m ← -k_BT ln Σ_ξ ρ(ξ) exp(-β V_m(ξ))

F(ξ) ← -k_BT ln ρ(ξ)
```

---

## C.9 Blocking Analysis

```
INPUT: time series {A_t}, t = 1...N
OUTPUT: standard error as function of block size b

for b = 1, 2, 4, 8, ..., N/4:
    n_blocks ← floor(N / b)
    block_means ← [mean(A[k*b : (k+1)*b]) for k in 0..n_blocks-1]
    SE(b) ← std(block_means) / sqrt(n_blocks)

True error ← plateau value of SE(b) for large b
τ_int ← SE(b_plateau)² · N / (2 · SE(b=1)²)
```
