# Non-linear ODE Lab

This lab contains two simulations: a finite-amplitude pendulum in the **BVP** tab and the Lorenz system in the **IVP** tab. Both use fourth-order Runge–Kutta integration.

## BVP tab: large-angle pendulum

The exact undamped pendulum equation is

$$
\theta''+\frac{g}{L}\sin\theta=0.
$$

It is nonlinear because of the sine term. The tab releases the pendulum from the chosen angle with zero angular velocity and overlays the resulting trajectory with the linear small-angle reference.

For small angles in radians, $\sin\theta\approx\theta$, giving ordinary simple harmonic motion:

$$
\theta''+\frac{g}{L}\theta=0,
\qquad T_0=2\pi\sqrt{\frac{L}{g}}.
$$

At a few degrees, the solid nonlinear trace and dashed SHM trace overlap. As the release angle grows, the nonlinear pendulum takes longer to complete a cycle, so it increasingly lags the linear prediction.

Try $5^\circ$, $45^\circ$, $90^\circ$, and $150^\circ$. Record the period shift and inspect how the phase portrait departs from the SHM ellipse.

## IVP tab: Lorenz attractor

The Lorenz initial-value problem is

$$
\dot x=\sigma(y-x),\qquad
\dot y=x(\rho-z)-y,\qquad
\dot z=xy-\beta z.
$$

The classic setting $\sigma=10$, $\rho=28$, and $\beta=8/3$ produces the two-lobed Lorenz attractor. The lab simultaneously integrates a second trajectory with an initial $x$ value only $10^{-5}$ away. Its separation from the first trajectory demonstrates sensitive dependence on initial conditions.

Keep $\sigma=10$ and $\beta=8/3$, then sweep $\rho$ through 10, 20, 28, and 35. Compare the $x$–$z$ projection with the divergence trace.

## Numerical note

RK4 is accurate for these smooth demonstrations, but timestep refinement is still required for rigorous numerical conclusions.
