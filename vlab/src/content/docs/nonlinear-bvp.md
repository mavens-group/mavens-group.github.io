# Non-linear ODE Lab: Boundary-Value and Initial-Value Problems

*This lab pairs two nonlinear systems with the two basic problem types. The pendulum is solved as a genuine **boundary-value problem** (BVP) with an unknown period. The Lorenz system is an **initial-value problem** (IVP) that shows deterministic chaos. Every browser result has a Python/SciPy companion and an exact or accepted reference value to check against.*

## 1. Aim

After this lab you should be able to:

1. say when an ODE is nonlinear and what superposition failure means physically;
2. distinguish IVPs from BVPs and explain why only one of them is guaranteed a unique solution;
3. formulate an unknown-period BVP and solve it by finite differences and Newton's method;
4. verify a numerical scheme by mesh refinement and by comparison with an exact result;
5. classify the Lorenz fixed points and relate the bifurcation sequence to what you see as $\rho$ is changed;
6. estimate a growth rate (Lyapunov exponent) from data and explain why it has an uncertainty.

## 2. Linear and nonlinear equations

An ordinary differential equation (ODE) is **linear** when the unknown function and its derivatives appear only to the first power and are not inside functions such as $\sin$, $\exp$ or $\log$. For example $\theta''+(g/L)\theta=0$ is linear in $\theta$. A nonlinear ODE does not obey superposition: adding two solutions generally does not give another solution. Frequency, shape and stability can then depend on amplitude and initial conditions.

Newton's second law for a pendulum of length $L$ gives

$$
\theta''=-\frac{g}{L}\sin\theta,
\qquad\text{or}\qquad
\theta''+\frac{g}{L}\sin\theta=0.
$$

The negative sign is essential: gravity accelerates the bob back towards $\theta=0$. The factor is $g/L$, not $\sqrt{g/L}$; $\sqrt{g/L}$ is an angular frequency and appears only in the linear solution.

### 2.1 Why the pendulum is nonlinear

For $\theta$ in radians,

$$
\sin\theta=\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots,
$$

so

$$
\theta''+\frac{g}{L}\left(\theta-\frac{\theta^3}{6}+\frac{\theta^5}{120}-\cdots\right)=0.
$$

The first term gives the small-angle model

$$
\theta''+\frac{g}{L}\theta=0,
\qquad
\omega_0=\sqrt{\frac{g}{L}},
\qquad
T_0=2\pi\sqrt{\frac{L}{g}},
$$

and the cubic and higher terms are the nonlinear corrections. A perturbative (Lindstedt–Poincaré) treatment of the cubic term gives the amplitude-dependent period

$$
T(\theta_0)\approx T_0\left(1+\frac{\theta_0^2}{16}+\frac{11\,\theta_0^4}{3072}+\cdots\right),
$$

so the frequency of a nonlinear oscillator depends on its amplitude. A linear oscillator has the same period at every amplitude (isochronism).

### 2.2 Energy, the phase portrait and the separatrix

Multiplying the equation by $\theta'$ and integrating gives conservation of energy per unit mass:

$$
E=\tfrac12 L^2\theta'^2-gL\cos\theta=\text{const}.
$$

Each value of $E$ is a closed curve in the $(\theta,\theta')$ plane. For small $E$ the curve is the ellipse of SHM; as $E$ rises it becomes distorted, and at $E=gL$ it touches the unstable equilibrium at $\theta=\pm\pi$. That curve is the **separatrix**. Inside it the pendulum oscillates (libration); outside it rotates. The period diverges logarithmically as the release angle approaches $180^\circ$, because the bob lingers near the unstable top.

### 2.3 The exact period

Separating variables in the energy integral gives a complete elliptic integral of the first kind,

$$
T(\theta_0)=4\sqrt{\frac{L}{g}}\,K\!\left(k\right),
\qquad k=\sin\frac{\theta_0}{2},
\qquad
K(k)=\int_0^{\pi/2}\frac{d\phi}{\sqrt{1-k^2\sin^2\phi}}.
$$

The arithmetic–geometric mean (AGM) evaluates $K$ in a few iterations:

$$
T(\theta_0)=\frac{2\pi\sqrt{L/g}}{\mathrm{AGM}\!\left(1,\cos\tfrac{\theta_0}{2}\right)}.
$$

The lab uses this as the **reference answer**. For $L=1$ m, $g=9.81$ m s⁻² ($T_0=2.0061$ s):

| $\theta_0$ | $T$ (s) | $T/T_0-1$ |
|---:|---:|---:|
| $5^\circ$ | 2.0070 | $+0.05\,\%$ |
| $45^\circ$ | 2.0863 | $+4.0\,\%$ |
| $90^\circ$ | 2.3678 | $+18.0\,\%$ |
| $150^\circ$ | 3.5351 | $+76.2\,\%$ |

## 3. Initial-value and boundary-value problems

An **IVP** specifies the whole state at one instant, for example $\theta(0)=\theta_0$ and $\theta'(0)=0$. A **BVP** specifies conditions at two different points, for example $\theta(0)=\theta_0$ and $\theta(\tau)=0$.

The difference is not cosmetic. For an IVP with a smooth right-hand side, the Picard–Lindelöf theorem guarantees a unique solution. A BVP can have none, one or infinitely many. For $y''+y=0$:

- $y(0)=0$, $y(\pi)=0$ has infinitely many solutions, $y=c\sin x$;
- $y(0)=0$, $y(\pi)=1$ has none.

A numerical BVP solver therefore needs a **good initial guess**, and may converge to a different solution from the one you intended. Part of this lab is learning to notice when that happens.

## 4. BVP tab: the pendulum as a boundary-value problem

### 4.1 Formulation

We want the pendulum released from rest at $\theta_0$ that first reaches the bottom at the **unknown** time $\tau$ (a quarter period):

$$
\theta(0)=\theta_0,\qquad \theta'(0)=0,\qquad \theta(\tau)=0.
$$

Three conditions on a second-order equation is one too many, and the surplus fixes the unknown parameter $\tau$. Rescale time with $s=t/\tau\in[0,1]$ so that the interval is fixed:

$$
\frac{d^2\theta}{ds^2}=-\tau^2\frac{g}{L}\sin\theta,
\qquad \theta(0)=\theta_0,\quad \theta'(0)=0,\quad \theta(1)=0.
$$

Because the pendulum is symmetric, one quarter period determines the whole motion: $\theta$ is even about $t=0$ and odd about $t=\tau$. The browser reconstructs the full trace from the quarter-period solution by exactly these two symmetries.

> **A common error.** Imposing $\theta(T_0/4)=0$ with the *small-angle* period $T_0$ is not the pendulum BVP: it solves a different problem whose period is wrong at large amplitude. The unknown $\tau$ must be part of the solution.

### 4.2 Finite-difference discretisation

Place $N+1$ nodes $s_i=ih$, $h=1/N$, and replace the second derivative by the central difference,

$$
\frac{\theta_{i-1}-2\theta_i+\theta_{i+1}}{h^2}=-\tau^2\frac{g}{L}\sin\theta_i,\qquad i=1,\dots,N-1.
$$

The boundary conditions supply the remaining equations. The condition $\theta'(0)=0$ uses a second-order one-sided formula so that it does not degrade the accuracy,

$$
\frac{-3\theta_0+4\theta_1-\theta_2}{2h}=0.
$$

This gives $N+2$ nonlinear algebraic equations for the $N+2$ unknowns $(\theta_0,\dots,\theta_N,\tau)$.

### 4.3 Newton's method and continuation

Write the system as $\mathbf F(\mathbf u)=\mathbf 0$ and iterate

$$
J(\mathbf u^{(k)})\,\delta\mathbf u=-\mathbf F(\mathbf u^{(k)}),
\qquad
\mathbf u^{(k+1)}=\mathbf u^{(k)}+\lambda\,\delta\mathbf u,
$$

where $J=\partial\mathbf F/\partial\mathbf u$ is the Jacobian and the damping factor $\lambda\in(0,1]$ is halved until the residual falls. Newton's method converges quadratically **only near a solution**. A far-away guess may diverge or find a different branch.

The lab therefore uses **continuation**: the release angle is raised in stages of at most $15^\circ$, and each stage starts from the converged solution of the previous one. The first stage starts from the SHM shape $\theta_0\cos(\pi s/2)$. The "continuation stages" and "iterations" in the BVP metric show how hard the problem was; a $170^\circ$ release needs many more than a $5^\circ$ one.

### 4.4 Verification: mesh refinement

A numerical result is only trustworthy once you have shown how its error behaves. Central differences are second order, so the error should scale as $h^2$:

$$
\varepsilon(N)\approx C\,h^2\propto N^{-2}.
$$

Halving $h$ (doubling $N$) should therefore reduce the error by about a factor of 4. The **Mesh refinement** panel lists the period error against the exact AGM value for $N=30,60,120,240$. Compute the ratio of successive errors; a ratio near 4 confirms the scheme is working as designed, whereas a ratio near 1 means something other than discretisation (for example the Newton tolerance) is limiting the error. The *observed order of convergence* is

$$
p=\log_2\!\frac{\varepsilon(N)}{\varepsilon(2N)}.
$$

### 4.5 The independent IVP check

The dotted trace is a separate calculation: the same equation integrated forward from $\theta(0)=\theta_0$, $\theta'(0)=0$ with fourth-order Runge–Kutta (RK4). Two methods built on different principles agreeing is much stronger evidence than either alone. The label **BVP vs RK4 IVP** gives the largest disagreement in angle.

RK4 has local error $O(\Delta t^5)$ and global error $O(\Delta t^4)$. For a conservative system such as the pendulum, its weakness is a slow drift in the energy; this is visible as a slight amplitude change over many periods at large $\Delta t$.

### 4.6 Python companion

`scipy.integrate.solve_bvp` takes the unknown parameter through its `p` argument. The embedded script passes the same rescaled system and the same three boundary conditions, then compares with the elliptic-integral period. It uses adaptive meshing, so you set a tolerance (`tol`) rather than $N$.

## 5. IVP tab: the Lorenz system

### 5.1 Origin and equations

The Lorenz model is a three-mode truncation of Rayleigh–Bénard convection in a fluid layer heated from below:

$$
\dot x=\sigma(y-x),\qquad
\dot y=x(\rho-z)-y,\qquad
\dot z=xy-\beta z.
$$

Here $x$ measures the rate of convective overturning, $y$ the horizontal temperature difference, $z$ the distortion of the vertical temperature profile; $\sigma$ is the Prandtl number, $\rho$ the scaled Rayleigh number and $\beta$ a geometric factor. The classic values are $\sigma=10$, $\rho=28$, $\beta=8/3$.

### 5.2 Fixed points and their stability

Setting the right-hand side to zero gives the origin and, for $\rho>1$, two further fixed points

$$
C_\pm=\left(\pm\sqrt{\beta(\rho-1)},\ \pm\sqrt{\beta(\rho-1)},\ \rho-1\right).
$$

Linearising about each point gives the stability:

- **Origin:** stable for $\rho<1$; a saddle for $\rho>1$. It has an unstable direction and a stable plane.
- **$C_\pm$:** stable for $1<\rho<\rho_H$, where

$$
\rho_H=\frac{\sigma(\sigma+\beta+3)}{\sigma-\beta-1}\approx24.74\quad(\sigma=10,\ \beta=8/3).
$$

Beyond $\rho_H$ a **subcritical Hopf bifurcation** removes the stability of $C_\pm$ and the motion becomes a chaotic strange attractor. Between about $24.06$ and $24.74$ the system is bistable: a trajectory may settle at a fixed point or be chaotic depending on the start.

### 5.3 What you see as $\rho$ is swept

| $\rho$ | Behaviour | What to look for |
|---:|---|---|
| 10 | Spirals quickly into $C_+$ or $C_-$ (the linearised eigenvalues are complex for $\rho\gtrsim1.35$) | Short, strongly damped oscillation; the twin converges onto the main orbit |
| 20 | Spirals slowly into $C_\pm$ (weakly damped) | Long oscillatory transient before settling; separation still decays |
| 28 | Chaotic strange attractor | Two-lobed butterfly, twin separation grows to the attractor size |
| 35 | Chaotic, larger attractor | Faster excursions, stronger growth |

### 5.4 Dissipation and the attractor

The divergence of the flow is constant,

$$
\nabla\!\cdot\mathbf F=-(\sigma+1+\beta)\approx-13.67,
$$

so phase-space volume contracts as $e^{-13.67\,t}$. The long-time motion therefore lies on a set of zero volume, which turns out to be a **fractal** of dimension about $2.06$. Trajectories on it never repeat and never cross, yet they remain bounded.

### 5.5 Sensitive dependence and the Lyapunov exponent

Two trajectories starting a distance $\delta_0$ apart separate on average as

$$
\delta(t)\approx\delta_0\,e^{\lambda_1 t},
$$

where $\lambda_1$ is the largest **Lyapunov exponent**. For the classic parameters $\lambda_1\approx0.906\ \mathrm{s^{-1}}$. A positive $\lambda_1$ is the usual definition of chaos. It sets a **predictability horizon**: if the initial error is $\delta_0$ and you tolerate an error $\Delta$,

$$
t_{\text{pred}}\approx\frac{1}{\lambda_1}\ln\frac{\Delta}{\delta_0}.
$$

With $\delta_0=10^{-5}$ and $\Delta=1$ this is about $13$ s. Improving the initial measurement by a factor of 1000 buys only $\ln(10^3)/\lambda_1\approx7.6$ s more.

### 5.6 How the lab estimates $\lambda$ — and why it is uncertain

The lab fits a straight line to $\ln\delta(t)$ versus $t$, but only where $10^{-4}<\delta<10^{-1}$. Both limits matter:

- below $10^{-4}$ the separation is still dominated by the initial transient directions;
- above $10^{-1}$ the separation **saturates**, because it cannot exceed the size of the attractor; including those points flattens the slope.

The result is a **finite-time** estimate from a **single** pair of trajectories. The local stretching rate varies strongly from place to place on the attractor, so a finite-time estimate depends on which part of the orbit the fit window happens to sample. Repeated runs from different burn-in times give values from roughly $0.5$ to $0.9\ \mathrm{s^{-1}}$, compared with the accepted $0.906$. Quote your estimate with a spread from several runs, not as a single number. A proper calculation averages over a long trajectory and renormalises the separation (Benettin's algorithm).

### 5.7 Why the "skip transient" option exists

Starting at $(0.1,0,0)$, the orbit begins very close to the saddle at the origin and lingers along its unstable manifold. The twin begins nearby on the same manifold, so the two separate only slowly until they have both left the origin region, which takes about $30$ s. If you untick **Skip transient** you will see the late separation stay near $10^{-3}$ for most of the run; a student who stopped at $24$ s could wrongly conclude the system is not sensitive. The fix is physical, not cosmetic: discard a transient so that both orbits begin on the attractor.

### 5.8 Is the numerical trajectory "real"?

A numerical orbit of a chaotic system cannot follow the exact orbit from the same initial condition for long, since every rounding and truncation error is amplified at the same rate $e^{\lambda_1 t}$. The orbit is still meaningful for two reasons. First, the **shadowing lemma** says that, for hyperbolic systems, there is an exact orbit that stays close to the numerical one. Second, the statistical properties (the attractor's shape, the Lyapunov exponent) are robust. Test this yourself: halve $\Delta t$ and confirm that the attractor looks the same even though the individual orbit differs after some time.

## 6. Suggested procedure

### BVP tab

1. Run $5^\circ$, $45^\circ$, $90^\circ$ and $150^\circ$ at $N=120$. Record the BVP period, the exact period and the small-angle period.
2. At $90^\circ$, run $N=30,60,120,240$ and use the Mesh refinement panel. Compute the ratios of successive errors and the observed order $p$.
3. Compare the phase portrait at $5^\circ$ and $150^\circ$. Describe the departure from an ellipse.
4. Increase the angle to $170^\circ$ and note the number of continuation stages and iterations. Explain why more were needed.

### IVP tab

1. Keep $\sigma=10$, $\beta=8/3$ and run $\rho=10,20,28,35$ with **Skip transient** ticked. Record the growth rate (or "no growth"), the late separation and a one-line description of the attractor.
2. At $\rho=28$, repeat the run three times with different durations (for example $30$, $40$, $50$ s). The burn-in is the same, so the change in the estimate tells you about finite-time scatter.
3. Untick **Skip transient** and repeat $\rho=28$. Explain the difference.
4. Find, by bisection on $\rho$ between $20$ and $28$, the value at which the long-time motion stops settling to a fixed point. Compare it with $\rho_H$ and comment on why they may differ (hint: bistability and finite run time).

## 7. Numerical limitations and error analysis

- **Discretisation error (BVP):** $O(h^2)$, verified by the refinement table. The remaining error at $N=240$ is of order $10^{-4}$ %.
- **Newton tolerance:** the residual is driven below $10^{-11}$; this is far below the discretisation error and does not limit the result.
- **Branch selection (BVP):** a poor guess can converge to a solution with extra oscillations. The continuation strategy avoids this for the release angles used here.
- **Truncation error (IVP):** RK4 at $\Delta t=0.005$ s is accurate for smooth short runs. In the chaotic regime it limits the time over which an individual orbit is trustworthy, not the statistics.
- **Display decimation:** plotted points are thinned for speed; the metrics use the full integration.
- **Units:** the equations and Python code use radians. The interface displays degrees only.

## 8. Check your understanding

1. Show that $\theta''+\sin\theta=0$ does not obey superposition by taking two solutions and substituting their sum. Where does it fail?
2. The doc states that the period of a pendulum released from $90^\circ$ is $18\,\%$ longer than $T_0$. Use the series $T\approx T_0(1+\theta_0^2/16)$ at $\theta_0=\pi/2$ and say whether it over- or under-estimates this. Why?
3. Give a BVP for $y''+y=0$ that has no solution. Why can an IVP never fail to have a solution in this way?
4. In your mesh refinement data the error ratio is about 4. What would you conclude if it were about 2? About 1?
5. Why does the BVP formulation need *three* conditions for a *second-order* equation? What would go wrong with only two?
6. At $\rho=10$ the twin separation decays but at $\rho=28$ it grows. What does this say about the sign of the largest Lyapunov exponent in each case, and about the fixed points?
7. The late separation at $\rho=28$ is $10^{-3}$ when the transient is not skipped, and order one when it is. Which one is the right measure of chaos in the system, and why?
8. A weather model has $\lambda_1=0.5\ \mathrm{day^{-1}}$ and initial error $10^{-3}$. Estimate the time until the error reaches $1$. What does a ten-fold better observation buy?
9. You estimate $\lambda$ from one twin and get $0.72$. A colleague gets $0.85$ from another. Are these in conflict? What would you do to resolve it?

## Further reading

- S. H. Strogatz, *Nonlinear Dynamics and Chaos* (Westview Press), chapters on the pendulum, Lorenz equations and Lyapunov exponents.
- E. N. Lorenz, "Deterministic nonperiodic flow", *J. Atmos. Sci.* **20**, 130 (1963).
- U. M. Ascher, R. M. M. Mattheij and R. D. Russell, *Numerical Solution of Boundary Value Problems for Ordinary Differential Equations* (SIAM).
- J. C. Sprott, *Chaos and Time-Series Analysis* (Oxford University Press).
- SciPy documentation for `scipy.integrate.solve_bvp` and `solve_ivp`.
