# Appendix A: Python Reference for Monte Carlo

This appendix collects skeleton code for the computational labs and a reference for the key libraries.

---

## A.1 Environment Setup

```bash
# Recommended: create a dedicated conda environment
conda create -n mc_course python=3.11
conda activate mc_course
pip install numpy scipy matplotlib numba tqdm
pip install vegas  # for adaptive MC integration
```

---

## A.2 Random Number Generation

```python
import numpy as np

# Modern API: always use default_rng with a seed
rng = np.random.default_rng(seed=42)

# Uniform samples
u = rng.uniform(0, 1, size=10_000)

# Standard normal
z = rng.standard_normal(size=10_000)

# Exponential (radioactive decay lifetimes)
lam = 1.0  # decay constant
t = rng.exponential(scale=1/lam, size=10_000)
# or via inverse CDF:
t_inv = -np.log(rng.uniform(size=10_000)) / lam

# Uniform on S^2 (correct method)
cos_theta = rng.uniform(-1, 1, size=1000)
phi = rng.uniform(0, 2*np.pi, size=1000)
sin_theta = np.sqrt(1 - cos_theta**2)
x = sin_theta * np.cos(phi)
y = sin_theta * np.sin(phi)
z = cos_theta  # unit vectors on sphere
```

---

## A.3 Maxwell-Boltzmann Sampling (Chapter 2 Lab)

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import chi

def sample_maxwell_boltzmann(T, m, N, rng=None):
    """Sample N speeds from Maxwell-Boltzmann at temperature T."""
    if rng is None:
        rng = np.random.default_rng()
    kB = 1.380649e-23
    sigma = np.sqrt(kB * T / m)
    # v = sqrt(vx^2 + vy^2 + vz^2), vx ~ N(0, sigma)
    v = np.sqrt(np.sum(rng.normal(0, sigma, size=(N, 3))**2, axis=1))
    return v

# Argon parameters
T = 300.0          # K
m = 6.634e-26      # kg (Ar mass)
N = 100_000
rng = np.random.default_rng(seed=0)

v = sample_maxwell_boltzmann(T, m, N, rng)

kB = 1.380649e-23
v_p = np.sqrt(2 * kB * T / m)   # most probable speed

print(f"<v>   = {np.mean(v):.1f} m/s  (theory: {np.sqrt(8*kB*T/(np.pi*m)):.1f})")
print(f"v_rms = {np.sqrt(np.mean(v**2)):.1f} m/s  (theory: {np.sqrt(3*kB*T/m):.1f})")
print(f"v_mp  = {v_p:.1f} m/s (bin peak ~ {v[np.argmax(np.histogram(v,100)[0])]:.1f})")
```

---

## A.4 Metropolis for the 1D Double-Well (Chapter 4 Lab)

```python
import numpy as np

def double_well(x):
    return (x**2 - 1)**2

def metropolis_1d(beta, N_steps, delta, x0=0.0, seed=42):
    rng = np.random.default_rng(seed)
    x = x0
    trajectory = np.zeros(N_steps)
    n_accept = 0
    for t in range(N_steps):
        x_new = x + rng.uniform(-delta, delta)
        dE = double_well(x_new) - double_well(x)
        if np.log(rng.uniform()) < -beta * dE:
            x = x_new
            n_accept += 1
        trajectory[t] = x
    return trajectory, n_accept / N_steps

beta = 2.0
traj, acc = metropolis_1d(beta, N_steps=500_000, delta=0.5)
print(f"Acceptance rate: {acc:.2f}")
```

---

## A.5 2D Ising Model (Chapter 5 Lab)

```python
import numpy as np

def ising_energy(spins, J=1.0):
    """Total energy of 2D Ising model with periodic BC."""
    E = -J * np.sum(spins * (
        np.roll(spins, 1, 0) + np.roll(spins, -1, 0) +
        np.roll(spins, 1, 1) + np.roll(spins, -1, 1)
    ))
    return E / 2  # avoid double-counting

def ising_metropolis(L, T, N_sweeps, J=1.0, seed=42):
    rng = np.random.default_rng(seed)
    beta = 1.0 / T
    spins = rng.choice([-1, 1], size=(L, L))
    
    # Pre-compute acceptance probabilities
    dE_vals = np.array([-8, -4, 0, 4, 8]) * J
    acc_prob = {dE: min(1.0, np.exp(-beta * dE)) for dE in dE_vals}
    
    E_list, M_list = [], []
    
    for sweep in range(N_sweeps):
        # N random single-spin flips per sweep
        for _ in range(L * L):
            i, j = rng.integers(0, L, size=2)
            nb_sum = (spins[(i+1)%L, j] + spins[(i-1)%L, j] +
                      spins[i, (j+1)%L] + spins[i, (j-1)%L])
            dE = 2 * J * spins[i, j] * nb_sum
            if rng.uniform() < acc_prob[dE]:
                spins[i, j] *= -1
        
        E_list.append(ising_energy(spins, J) / (L*L))
        M_list.append(np.mean(spins))
    
    return np.array(E_list), np.array(M_list)

# Example: L=32, T=2.27 (near Tc)
E, M = ising_metropolis(32, T=2.27, N_sweeps=5000)
print(f"<E>/N = {np.mean(E[1000:]):.4f} ± {np.std(E[1000:])/np.sqrt(4000):.4f}")
print(f"<|M|> = {np.mean(np.abs(M[1000:])):.4f}")
```

---

## A.6 Wolff Cluster Algorithm (Chapter 5 Lab)

```python
import numpy as np
from collections import deque

def wolff_sweep(spins, beta, J=1.0, rng=None):
    if rng is None:
        rng = np.random.default_rng()
    L = spins.shape[0]
    p_add = 1 - np.exp(-2 * beta * J)
    
    # Pick random seed spin
    i0, j0 = rng.integers(0, L, size=2)
    cluster_spin = spins[i0, j0]
    in_cluster = np.zeros((L, L), dtype=bool)
    in_cluster[i0, j0] = True
    queue = deque([(i0, j0)])
    
    while queue:
        i, j = queue.popleft()
        for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
            ni, nj = (i+di)%L, (j+dj)%L
            if not in_cluster[ni, nj] and spins[ni, nj] == cluster_spin:
                if rng.uniform() < p_add:
                    in_cluster[ni, nj] = True
                    queue.append((ni, nj))
    
    spins[in_cluster] *= -1
    return np.sum(in_cluster)  # cluster size
```

---

## A.7 BKL / Gillespie KMC (Chapter 8 Lab)

```python
import numpy as np

def kmc_adatom_diffusion(L, T, E_a, nu0, N_events, seed=42):
    """
    KMC for single adatom diffusion on 2D square lattice.
    Returns trajectory (positions) and times.
    """
    rng = np.random.default_rng(seed)
    kB = 8.617e-5  # eV/K
    
    k_hop = nu0 * np.exp(-E_a / (kB * T))
    K_tot = 4 * k_hop   # 4 neighbours
    
    x, y = L // 2, L // 2  # start at centre
    t = 0.0
    times = np.zeros(N_events)
    positions = np.zeros((N_events, 2), dtype=int)
    
    moves = np.array([[1,0],[-1,0],[0,1],[0,-1]])
    
    for n in range(N_events):
        # Time advance
        dt = -np.log(rng.uniform()) / K_tot
        t += dt
        # Choose event (uniform since all rates equal)
        move = moves[rng.integers(4)]
        x = (x + move[0]) % L
        y = (y + move[1]) % L
        times[n] = t
        positions[n] = [x, y]
    
    return times, positions

# Example: Cu adatom, E_a = 0.49 eV, T = 600 K
times, pos = kmc_adatom_diffusion(100, T=600, E_a=0.49,
                                   nu0=3e12, N_events=100_000)
# Compute MSD
origin = pos[0]
msd = np.mean((pos - pos[0])**2, axis=1)
D_fit = np.polyfit(times[100:], msd[100:], 1)[0] / 4  # 2D: MSD = 4Dt
print(f"D = {D_fit:.4e} m^2/s")
```

---

## A.8 Blocking Analysis for Autocorrelated Data

```python
import numpy as np

def blocking_analysis(data, max_block_size=None):
    """
    Compute standard error as a function of block size.
    Returns block_sizes, standard_errors.
    """
    N = len(data)
    if max_block_size is None:
        max_block_size = N // 4
    
    block_sizes = []
    std_errors = []
    
    b = 1
    while b <= max_block_size:
        n_blocks = N // b
        blocks = data[:n_blocks*b].reshape(n_blocks, b).mean(axis=1)
        se = np.std(blocks, ddof=1) / np.sqrt(n_blocks)
        block_sizes.append(b)
        std_errors.append(se)
        b = max(b + 1, int(b * 1.5))
    
    return np.array(block_sizes), np.array(std_errors)

# Usage:
# bs, se = blocking_analysis(magnetisation_timeseries)
# plt.semilogx(bs, se); plt.xlabel('Block size'); plt.ylabel('SE')
# True error = plateau value
```
