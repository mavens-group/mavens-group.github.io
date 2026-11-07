# Non-linear ODE Lab — Record Book

## Experiment details

| Field | Entry |
|---|---|
| Student | ______________________________ |
| Date | ______________________________ |
| Pendulum length $L$ | ____________ m ($g=9.81$ m s⁻²) |
| BVP method | Finite differences + Newton, continuation in $\theta_0$ |
| IVP method | Fourth-order Runge–Kutta, $\Delta t=0.005$ s |

## 1. Aim

State what you will establish in each tab and the reference you will compare against.

____________________________________________________________________

## 2. BVP tab: nonlinear pendulum

### 2.1 Period against release angle ($N=120$)

Reference: $T_{\mathrm{exact}}=2\pi\sqrt{L/g}\,/\,\mathrm{AGM}(1,\cos\tfrac{\theta_0}{2})$.

| $\theta_0$ | $T_0$ (s) | $T_{\mathrm{BVP}}$ (s) | $T_{\mathrm{exact}}$ (s) | $\dfrac{T_{\mathrm{BVP}}}{T_0}-1$ (%) | BVP error (%) | Newton its / stages | max $\lvert\theta_{\mathrm{BVP}}-\theta_{\mathrm{SHM}}\rvert$ (°) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| $5^\circ$ | | | | | | | |
| $45^\circ$ | | | | | | | |
| $90^\circ$ | | | | | | | |
| $150^\circ$ | | | | | | | |

Compare the first period column with the series $T\approx T_0(1+\theta_0^2/16)$ at $45^\circ$ and $90^\circ$. Where does the series fail and why?

____________________________________________________________________

### 2.2 Mesh refinement at $\theta_0=90^\circ$

| $N$ | $h=1/N$ | $T_{\mathrm{BVP}}$ (s) | Error $\varepsilon=\lvert T_{\mathrm{BVP}}-T_{\mathrm{exact}}\rvert$ (s) | $\varepsilon(N/2)/\varepsilon(N)$ | Observed order $p$ |
|---:|---:|---:|---:|---:|---:|
| 30 | | | | — | — |
| 60 | | | | | |
| 120 | | | | | |
| 240 | | | | | |

Is the observed order what you expect for central differences? What would a ratio near 1 indicate?

____________________________________________________________________

### 2.3 Independent check

| $\theta_0$ | BVP vs RK4 IVP max difference (°) | Agree within plotting accuracy? |
|---:|---:|---|
| $45^\circ$ | | |
| $150^\circ$ | | |

### 2.4 Phase portrait

Describe the portrait at $5^\circ$ and at $150^\circ$. How does the shape relate to the energy and to the separatrix at $E=gL$?

____________________________________________________________________

### 2.5 Python companion

Run the `solve_bvp` script for $45^\circ$. Quote its printed BVP period and the exact period, and the difference between them.

____________________________________________________________________

## 3. IVP tab: Lorenz attractor

Keep $\sigma=10$, $\beta=8/3$, duration 32 s and **Skip transient** ticked.

| $\rho$ | Fixed points $C_\pm$ (stable / unstable) | Growth rate $\lambda$ (s⁻¹) or "no growth" | Late separation | Description of the motion |
|---:|---|---:|---:|---|
| 10 | | | | |
| 20 | | | | |
| 28 | | | | |
| 35 | | | | |

Show the calculation of $C_\pm$ at $\rho=28$: $\sqrt{\beta(\rho-1)}=$ ____________, $\rho-1=$ ____________.

### 3.1 Growth-rate estimate and its spread

Repeat $\rho=28$ with durations of 30, 40 and 50 s.

| Run | Duration (s) | $\lambda$ (s⁻¹) |
|---:|---:|---:|
| 1 | 30 | |
| 2 | 40 | |
| 3 | 50 | |
| | **Mean ± standard deviation** | |

Compare with the accepted $\lambda_1\approx0.906$ s⁻¹. Is the difference larger than the scatter? What does that say about estimating $\lambda$ from a single pair of trajectories?

____________________________________________________________________

Predictability horizon with $\delta_0=10^{-5}$ and tolerance $\Delta=1$: $t_{\mathrm{pred}}=\lambda^{-1}\ln(\Delta/\delta_0)=$ ____________ s.

### 3.2 Effect of the transient

| Skip transient | Late separation ($\rho=28$) | Conclusion about sensitivity |
|---|---:|---|
| On | | |
| Off | | |

Explain the difference in terms of the saddle at the origin.

____________________________________________________________________

### 3.3 Locating the onset

By bisection on $\rho$ between 20 and 28, find the smallest $\rho$ for which the long-time motion does **not** settle to a fixed point. Record the interval you narrowed to and compare with $\rho_H=\sigma(\sigma+\beta+3)/(\sigma-\beta-1)=$ ____________.

____________________________________________________________________

## 4. Uncertainty and error analysis

| Quantity | Source of uncertainty | Estimate |
|---|---|---|
| $T_{\mathrm{BVP}}$ | Discretisation, from the refinement table (use the $N=240$ error, or Richardson extrapolation) | |
| Percentage period shift | Propagated from $T_{\mathrm{BVP}}$ and $T_0$ (here $T_0$ is exact, so only $T_{\mathrm{BVP}}$ contributes) | |
| $\lambda$ | Standard deviation from §3.1 | |
| Late separation | Dominated by the start (transient on/off) and the finite run | |

Richardson estimate of the error from two meshes: $T(N)-T_{\mathrm{exact}}\approx\dfrac{T(N/2)-T(N)}{3}$ for a second-order scheme. Compute it for $N=240$ and compare with the true error.

____________________________________________________________________

## 5. Conclusion

Summarise (i) where the linear pendulum is valid and how the error grows with amplitude, (ii) that the BVP and IVP formulations agree and the BVP converges at the expected order, and (iii) how sensitive dependence in the Lorenz system appears as $\rho$ increases, with a quantified, uncertain growth rate.

____________________________________________________________________

____________________________________________________________________
