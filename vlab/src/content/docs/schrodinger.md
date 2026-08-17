# One-Dimensional Schrödinger Equation with the Numerov Method

*This lab derives the Numerov recurrence and applies the complete shooting procedure to the infinite square well and the one-dimensional harmonic oscillator. The displayed wavefunctions are generated numerically. Analytic results are retained as validation references and to provide safe eigenvalue brackets.*

## 1. Aim

The numerical task is to find the special energies for which a solution of the time-independent Schrödinger equation satisfies both boundary conditions:

$$
-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2}+V(x)\psi(x)=E\psi(x).
$$

Rearranging gives

$$
\psi''(x)=q(x;E)\psi(x),
\qquad
q(x;E)=\frac{2m}{\hbar^2}[V(x)-E].
$$

The simulation uses dimensionless units

$$
\hbar=1,\qquad m=1,
$$

so the equation solved by the program is

$$
\boxed{\psi''(x)=2[V(x)-E]\psi(x)}
\qquad\text{or}\qquad
\boxed{q(x;E)=2[V(x)-E]}.
$$

An arbitrary trial energy normally produces a solution that misses the far boundary or diverges. An eigenvalue is located when the boundary residual vanishes.

---

## 2. Derivation of the Numerov formula

### 2.1 Uniform spatial grid

Divide the domain into equally spaced points

$$
x_i=x_0+ih,\qquad h=x_{i+1}-x_i,
$$

and write

$$
\psi_i=\psi(x_i),\qquad q_i=q(x_i;E).
$$

Taylor expansion about $x_i$ gives

$$
\psi_{i+1}
=\psi_i+h\psi_i'
+\frac{h^2}{2}\psi_i''
+\frac{h^3}{6}\psi_i'''
+\frac{h^4}{24}\psi_i^{(4)}
+\frac{h^5}{120}\psi_i^{(5)}
+O(h^6),
$$

and

$$
\psi_{i-1}
=\psi_i-h\psi_i'
+\frac{h^2}{2}\psi_i''
-\frac{h^3}{6}\psi_i'''
+\frac{h^4}{24}\psi_i^{(4)}
-\frac{h^5}{120}\psi_i^{(5)}
+O(h^6).
$$

Adding the two expansions removes the odd derivatives:

$$
\psi_{i+1}-2\psi_i+\psi_{i-1}
=h^2\psi_i''
+\frac{h^4}{12}\psi_i^{(4)}
+O(h^6).
$$

### 2.2 Eliminate the fourth derivative

Because $\psi''=q\psi$,

$$
\psi^{(4)}=(q\psi)''.
$$

A centered second difference for $q\psi$ is

$$
(q\psi)_i''
=\frac{q_{i+1}\psi_{i+1}-2q_i\psi_i+q_{i-1}\psi_{i-1}}{h^2}
+O(h^2).
$$

Substituting this into the Taylor result gives

$$
\psi_{i+1}-2\psi_i+\psi_{i-1}
=h^2q_i\psi_i
+\frac{h^2}{12}
\left(q_{i+1}\psi_{i+1}-2q_i\psi_i+q_{i-1}\psi_{i-1}\right)
+O(h^6).
$$

Collecting the terms at $i-1$, $i$, and $i+1$:

$$
\left(1-\frac{h^2q_{i+1}}{12}\right)\psi_{i+1}
-2\left(1+\frac{5h^2q_i}{12}\right)\psi_i
+\left(1-\frac{h^2q_{i-1}}{12}\right)\psi_{i-1}
=O(h^6).
$$

Solving for the next wavefunction value produces the recurrence used in the lab:

$$
\boxed{
\psi_{i+1}
=
\frac{
2\left(1+\frac{5h^2q_i}{12}\right)\psi_i
-\left(1-\frac{h^2q_{i-1}}{12}\right)\psi_{i-1}
}{
1-\frac{h^2q_{i+1}}{12}
}
}.
$$

Numerov is efficient for the Schrödinger equation because there is no first-derivative term. For smooth $q(x)$, the recurrence has sixth-order accuracy in the grid spacing.

### 2.3 Why two starting values are required

The recurrence calculates $\psi_{i+1}$ from $\psi_i$ and $\psi_{i-1}$, so both $\psi_0$ and $\psi_1$ must be supplied. Only their ratio matters before normalization: multiplying both by a constant multiplies the entire solution by that constant without changing the eigenvalue.

The second starting value is obtained from a Taylor expansion consistent with the selected boundary condition. The exact starting series used for each system is derived below.

---

## 3. Complete eigenvalue-shooting algorithm

For a chosen state and potential, the browser performs the following calculation:

1. Construct a uniform spatial grid and evaluate $V_i=V(x_i)$.
2. Choose a trial energy $E$ and calculate $q_i=2(V_i-E)$.
3. Apply the physical boundary condition to obtain $\psi_0$ and $\psi_1$.
4. Propagate the recurrence across the grid.
5. Define the far-boundary residual

   $$
   R(E)=\psi(x_{\mathrm{far}};E).
   $$

6. Scan the energy interval for two energies $E_a$ and $E_b$ satisfying

   $$
   R(E_a)R(E_b)<0.
   $$

   This sign change brackets one zero of the residual.
7. Bisect the bracket:

   $$
   E_c=\frac{E_a+E_b}{2}.
   $$

   Replace the endpoint having the same residual sign as $E_c$, then repeat. The implementation stops after at most 90 iterations or when the energy bracket is narrower than $10^{-14}$.
8. Propagate once more using the converged energy.
9. Normalize the wavefunction numerically with the trapezoidal rule:

   $$
   I
   \approx
   \sum_{i=1}^{N}
   \frac{h}{2}\left(\psi_{i-1}^2+\psi_i^2\right),
   \qquad
   \psi_i^{(\mathrm{norm})}=\frac{\psi_i}{\sqrt{I}}.
   $$

10. Verify the state using its parity, interior-node count, far-boundary residual, and comparison with the analytic eigenvalue.

The shooting amplitude is arbitrary, so the raw residual has amplitude-dependent units. Its approach to zero—not its absolute scale—is the eigenvalue condition.

---

## 4. Application I: infinite square well

### 4.1 Potential and boundary conditions

For a well of width $L$ centered at the origin,

$$
V(x)=
\begin{cases}
0, & |x|<L/2,\\
\infty, & |x|\ge L/2.
\end{cases}
$$

An infinite potential forces the wavefunction to vanish at both walls:

$$
\boxed{\psi(-L/2)=0,\qquad \psi(L/2)=0}.
$$

The numerical domain contains the interior of the well:

$$
x_i=-\frac{L}{2}+ih,
\qquad
h=\frac{L}{N},
\qquad
N=800.
$$

Inside the well, $V=0$, and therefore

$$
q_i=-2E.
$$

### 4.2 Well-specific Numerov recurrence

Since $q$ is constant, substituting $q=-2E$ into the general formula gives

$$
\boxed{
\psi_{i+1}
=
\frac{
2\left(1-\frac{5Eh^2}{6}\right)\psi_i
-\left(1+\frac{Eh^2}{6}\right)\psi_{i-1}
}{
1+\frac{Eh^2}{6}
}
}.
$$

This is the formula propagated from the left wall to the right wall.

### 4.3 Starting values at the left wall

Set

$$
\psi_0=\psi(-L/2)=0.
$$

The initial slope is arbitrary, so choose $\psi'(-L/2)=1$. Close to the wall, the equation is $\psi''=-2E\psi$. Expanding about the wall gives

$$
\psi(h)
=h-\frac{E}{3}h^3+\frac{E^2}{30}h^5+O(h^7).
$$

Thus the implementation starts with

$$
\boxed{
\psi_0=0,\qquad
\psi_1=h-\frac{E}{3}h^3+\frac{E^2}{30}h^5
}.
$$

### 4.4 Shooting condition and eigenvalues

For every trial energy, Numerov propagation returns the right-wall residual

$$
R_{\mathrm{well}}(E)=\psi(L/2;E).
$$

The eigenvalue condition is

$$
\boxed{R_{\mathrm{well}}(E_n)=0}.
$$

The known neighboring energy levels supply a safe bracket, which is scanned and bisected. The analytic reference is

$$
\boxed{
E_n^{(\mathrm{exact})}
=\frac{n^2\pi^2}{2L^2},
\qquad n=1,2,3,\ldots
}.
$$

The numerical result is not replaced by this expression: the final plotted wavefunction is propagated at the root found from $R_{\mathrm{well}}(E)$.

### 4.5 Physical checks

The exact normalized solution is

$$
\psi_n(x)
=\sqrt{\frac{2}{L}}
\sin\left[
\frac{n\pi}{L}\left(x+\frac{L}{2}\right)
\right].
$$

It provides three useful checks:

- the $n$th state has $n-1$ interior nodes;
- $E_n/E_1=n^2$;
- changing the width produces $E_n\propto L^{-2}$.

The potential plot therefore uses the fixed scaled axis

$$
\frac{E}{E_1}=0\ \text{to}\ 40,
$$

placing the six displayed states near $1,4,9,16,25,$ and $36$ for every value of $L$.

---

## 5. Application II: one-dimensional harmonic oscillator

### 5.1 Potential and differential equation

The potential is

$$
V(x)=\frac{1}{2}\omega^2x^2.
$$

Consequently,

$$
q(x;E)=2\left(\frac{1}{2}\omega^2x^2-E\right)
=\omega^2x^2-2E,
$$

and the equation propagated by Numerov is

$$
\boxed{
\psi''(x)=\left(\omega^2x^2-2E\right)\psi(x)
}.
$$

Substitution into the general recurrence gives

$$
\boxed{
\psi_{i+1}
=
\frac{
2\left[1+\frac{5h^2}{12}(\omega^2x_i^2-2E)\right]\psi_i
-\left[1-\frac{h^2}{12}(\omega^2x_{i-1}^2-2E)\right]\psi_{i-1}
}{
1-\frac{h^2}{12}(\omega^2x_{i+1}^2-2E)
}
}.
$$

### 5.2 Finite domain and parity

The physical boundary condition is

$$
\psi(x)\rightarrow0\qquad\text{as}\qquad |x|\rightarrow\infty.
$$

A browser calculation must use a finite endpoint. The lab takes

$$
X_{\max}=\frac{7}{\sqrt{\omega}},
$$

and divides $0\le x\le X_{\max}$ into 600 intervals. The $1/\sqrt{\omega}$ scaling keeps the boundary far from the classically important region as the oscillator width changes.

Because $V(x)$ is even, eigenfunctions have definite parity:

$$
\psi_n(-x)=(-1)^n\psi_n(x).
$$

This allows stable half-domain shooting from the origin.

### 5.3 Even-state initialization

For even $n$,

$$
\psi(0)=1,\qquad \psi'(0)=0.
$$

Writing an even series $\psi(x)=a_0+a_2x^2+a_4x^4+\cdots$ and substituting it into

$$
\psi''=(\omega^2x^2-2E)\psi
$$

gives

$$
a_0=1,\qquad
a_2=-E,\qquad
a_4=\frac{\omega^2+2E^2}{12}.
$$

Therefore the two Numerov starting values are

$$
\boxed{
\psi_0=1,\qquad
\psi_1
=1-Eh^2+\frac{\omega^2+2E^2}{12}h^4
}
$$

### 5.4 Odd-state initialization

For odd $n$,

$$
\psi(0)=0,\qquad \psi'(0)=1,
$$

where the slope is again an arbitrary pre-normalization choice. Using the odd series $\psi(x)=x+a_3x^3+a_5x^5+\cdots$ gives

$$
a_3=-\frac{E}{3},
\qquad
a_5=\frac{\omega^2}{20}+\frac{E^2}{30}.
$$

Thus

$$
\boxed{
\psi_0=0,\qquad
\psi_1
=h-\frac{E}{3}h^3
+\left(\frac{\omega^2}{20}+\frac{E^2}{30}\right)h^5
}
$$

### 5.5 Shooting condition and reflection

For each trial energy, the half-domain residual is

$$
R_{\mathrm{HO}}(E)=\psi(X_{\max};E).
$$

The finite-domain approximation to the bound-state condition is

$$
\boxed{R_{\mathrm{HO}}(E_n)=0}.
$$

The lab scans and bisects an interval around the expected state energy. After convergence, the positive-half solution is reflected:

$$
\psi(-x)=
\begin{cases}
\phantom{-}\psi(x), & n\ \text{even},\\
-\psi(x), & n\ \text{odd}.
\end{cases}
$$

The full wavefunction is then normalized over $[-X_{\max},X_{\max}]$.

The analytic reference spectrum is

$$
\boxed{
E_n^{(\mathrm{exact})}
=\omega\left(n+\frac{1}{2}\right),
\qquad n=0,1,2,\ldots
}.
$$

The ground state has the nonzero zero-point energy $E_0=\omega/2$, adjacent levels are separated by $\omega$, and state $n$ has exactly $n$ nodes.

---

## 6. Interpreting the numerical diagnostics

### Numerical and analytic energy

The relative validation error is

$$
\epsilon_E
=
\left|
\frac{E_{\mathrm{Numerov}}-E_{\mathrm{exact}}}
{E_{\mathrm{exact}}}
\right|.
$$

Agreement checks the grid, recurrence, boundary initialization, and root search simultaneously.

### Boundary residual

The displayed residual is the final unnormalized value at the far boundary. A small residual indicates that the numerical solution satisfies the imposed finite-domain boundary condition. It is not a probability or an energy error.

### Node count

Sturm–Liouville theory orders one-dimensional bound states by their nodes. The well uses the convention $n=1,2,\ldots$ and therefore has $n-1$ nodes. The oscillator uses $n=0,1,\ldots$ and has $n$ nodes. Sign changes in an exponentially tiny numerical tail are ignored.

### Probability density

Only

$$
|\psi(x)|^2
$$

is a probability density. The sign of a real wavefunction describes phase. The probability of finding the particle between $a$ and $b$ is

$$
P(a\le x\le b)=\int_a^b|\psi(x)|^2\,dx.
$$

---

## 7. Reading the two plot tabs

- **Wavefunction $\psi(x)$:** displays the normalized signed wavefunction and $|\psi(x)|^2$ on the same position axis.
- **Potential $V(x)$:** displays the potential, the converged eigenenergy, and a scaled wavefunction shifted vertically to that energy.
- **Oscillator scale:** the energy axis is fixed from 0 to 6 so that different states can be compared without rescaling the graph.
- **Well scale:** energy is divided by $E_1$ and plotted on a fixed 0–40 axis. This makes the $n^2$ spacing visible and prevents changes in $L$ from changing the vertical scale.

The vertical displacement and amplitude of the wavefunction on the potential plot are visualization choices. Read numerical energies from the result panel.

---

## 8. Suggested laboratory procedure

### Infinite well

1. Select $n=1$ and verify both wall boundary conditions.
2. Record $E_{\mathrm{Numerov}}$, $E_{\mathrm{exact}}$, the residual, and the node count.
3. Repeat through $n=6$ and verify $E_n/E_1=n^2$.
4. Change $L$ and verify $E_nL^2$ remains constant for fixed $n$.
5. Inspect the fixed $E/E_1$ potential plot and explain why its level positions do not move when $L$ changes.

### Harmonic oscillator

1. Compare $n=0$ and $n=1$ to verify even and odd parity.
2. Repeat through $n=5$ and verify that the number of nodes equals $n$.
3. Confirm that $E_{n+1}-E_n=\omega$.
4. Change $\omega$ and observe the simultaneous change in energy spacing and spatial localization.
5. Identify the classical turning points from $V(x)=E$ and compare them with the wavefunction tails.

---

## 9. Numerical limitations

- The oscillator boundary is finite, so $\psi(X_{\max})=0$ only approximates decay at infinity.
- Outward shooting can accumulate a small amount of the exponentially growing nonphysical solution in the forbidden region.
- Numerov accuracy decreases if the grid is too coarse to resolve rapid oscillations.
- The infinite walls are displayed at finite height only for plotting.
- The known analytic spectra guide the energy brackets in this teaching lab. A general unknown potential would instead require a wider energy scan combined with node counting.
- The oscillator potential plot intentionally clips energies above its fixed 0–6 teaching scale rather than changing the axis between states.
