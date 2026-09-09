# Non-linear ODE Lab

## Introduction to nonlinear differential equations

An ordinary differential equation (ODE) is **linear** when the unknown function and its derivatives appear only to the first power and are not inside functions such as `sin`, `exp`, or `log`. For example, $\theta''+(g/L)\theta=0$ is linear in $\theta$. A nonlinear ODE does not obey superposition: adding two solutions generally does not produce another solution. Its frequency, shape, or stability can depend on amplitude and initial conditions.

The pendulum gives a useful physical example. Newton's second law gives

$$
\theta''=-\frac{g}{L}\sin\theta,
\qquad\text{or}\qquad
\theta''+\frac{g}{L}\sin\theta=0.
$$

The negative sign is essential: gravity accelerates the bob back toward $\theta=0$. The factor is $g/L$, not $\sqrt{g/L}$; $\sqrt{g/L}$ has units of angular frequency and appears in the linear solution. Thus the acceleration is $-(g/L)\sin\theta$, not $\sqrt{g/L}\sin\theta$.

### Why the pendulum is nonlinear

For $\theta$ in radians, Taylor expansion about zero gives

$$
\sin\theta=\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots.
$$

Therefore

$$
\theta''+\frac{g}{L}\left(\theta-\frac{\theta^3}{6}+\frac{\theta^5}{120}-\cdots\right)=0.
$$

The first term gives the small-angle model

$$
\theta''+\frac{g}{L}\theta=0,
\qquad
\omega_0=\sqrt{\frac{g}{L}},
\qquad
T_0=2\pi\sqrt{\frac{L}{g}}.
$$

The cubic and higher powers are the nonlinear corrections. They are negligible when $|\theta|\ll1$ rad, but important at finite amplitude. This is why the nonlinear trace separates from the SHM trace and why its period becomes longer as the release angle increases.

## BVP tab: large-angle pendulum

The browser trace uses fourth-order Runge–Kutta on

$$
\theta(0)=\theta_0,\qquad \theta'(0)=0.
$$

Strictly speaking, these are **initial** conditions, so the browser calculation is an IVP even though the tab is named BVP. The embedded Python companion demonstrates a boundary-value formulation with `scipy.integrate.solve_bvp`, using $\theta(0)=\theta_0$ and $\theta(T/4)=0$. An IVP specifies the state at one time; a BVP specifies conditions at two endpoints.

Try $5^\circ$, $45^\circ$, $90^\circ$, and $150^\circ$. Record the period shift and inspect how the phase portrait departs from the SHM ellipse.

## IVP tab: Lorenz attractor

The Lorenz initial-value problem is

$$
\dot x=\sigma(y-x),\qquad
\dot y=x(\rho-z)-y,\qquad
\dot z=xy-\beta z.
$$

The classic setting $\sigma=10$, $\rho=28$, and $\beta=8/3$ produces the two-lobed Lorenz attractor. The embedded Python companion uses `scipy.integrate.solve_ivp`; the browser version uses the same fourth-order Runge–Kutta idea. A second trajectory begins only $10^{-5}$ away in $x$, demonstrating sensitive dependence on initial conditions.

Keep $\sigma=10$ and $\beta=8/3$, then sweep $\rho$ through 10, 20, 28, and 35. Compare the $x$–$z$ projection with the divergence trace.

## Numerical note

RK4 and SciPy's adaptive solvers are accurate for these smooth demonstrations, but timestep and tolerance refinement are still required for rigorous numerical conclusions. Angles in the equations and Python code are in radians; only the interface displays degrees.
