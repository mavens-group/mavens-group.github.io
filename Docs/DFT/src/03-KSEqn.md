The Hohenberg–Kohn theorems establish that the ground-state density \\(\rho_0(\mathbf{r})\\)
uniquely determines all ground-state properties, and that the total energy \\(E[\rho]\\) is minimised
by \\(\rho_0\\). However, they say nothing about *how* to compute the universal functional \\(F[\rho]\\),
and in particular how to evaluate the kinetic energy \\(T[\rho]\\) as a functional of the density
alone. Attempts to write \\(T\\) purely in terms of \\(\rho\\) (as in the Thomas–Fermi model) lead to
poor accuracy.

The **Kohn–Sham (KS) formalism**, introduced by Walter Kohn and Lu Jeu Sham in 1965, provides
an elegant and highly accurate solution: introduce a fictitious system of **non-interacting
electrons** that, by construction, reproduces the exact ground-state density of the true
interacting system. This maps the intractable many-body problem onto a set of effective
single-particle equations — the Kohn–Sham equations — which are computationally feasible while
remaining formally exact.


## Decomposition of the Energy Functional

The key idea is to split the unknown universal functional \\(F[\rho]\\) into parts that can be
handled accurately and a remainder that must be approximated:

<div>
\begin{equation}
    E[\rho] = T_s[\rho] + E_{\mathrm{H}}[\rho] + E_{\mathrm{xc}}[\rho] + \int V_{\mathrm{ext}}(\mathbf{r})\, \rho(\mathbf{r}) \, d\mathbf{r},
    \label{eq:KS-energy}
\end{equation}
</div>

where each term has a specific physical meaning:

- \\(T_s[\rho]\\) is the **kinetic energy of a fictitious non-interacting system** with the same
  density \\(\rho(\mathbf{r})\\) as the real interacting system. Unlike the full kinetic energy
  \\(T[\rho]\\), this quantity can be computed exactly from the single-particle orbitals
  (see below).

- \\(E_{\mathrm{H}}[\rho]\\) is the **classical Hartree energy** — the electrostatic self-energy of
  the electron charge distribution, treating it as a classical continuous fluid:

<div>
\begin{equation}
    E_{\mathrm{H}}[\rho] = \frac{1}{2} \iint \frac{\rho(\mathbf{r})\, \rho(\mathbf{r}')}{|\mathbf{r} - \mathbf{r}'|} \, d\mathbf{r} \, d\mathbf{r}'.
\end{equation}
</div>

  This is the dominant part of the electron–electron repulsion and is treated exactly.

- \\(E_{\mathrm{xc}}[\rho]\\) is the **exchange-correlation (XC) energy**. It collects everything
  that is missing from the above terms:

<div>
\begin{equation}
    E_{\mathrm{xc}}[\rho] = \underbrace{(T[\rho] - T_s[\rho])}_{\text{kinetic correlation}} + \underbrace{(V_{ee}[\rho] - E_{\mathrm{H}}[\rho])}_{\text{exchange + correlation}}.
\end{equation}
</div>

  This includes the quantum exchange energy (from the antisymmetry of the wavefunction, as seen
  in the Hartree–Fock discussion in Chapter 1), all Coulomb correlation effects beyond the
  Hartree level, and the correction to the kinetic energy from the interacting nature of the true
  system. \\(E_{\mathrm{xc}}\\) is the only term that must be approximated; its exact form is
  unknown.

- \\(\int V_{\mathrm{ext}}(\mathbf{r})\,\rho(\mathbf{r})\,d\mathbf{r}\\) is the **interaction with
  the external potential** (the nuclear attraction and any applied fields), treated exactly.

The Kohn–Sham ansatz reduces the DFT problem to finding a good approximation for \\(E_{\mathrm{xc}}[\rho]\\) — a functional of three-dimensional \\(\rho\\) alone — rather than solving the full
\\(3N\\)-dimensional Schrödinger equation.


## The Kohn–Sham Ansatz

The central assumption of the Kohn–Sham approach is:

> *There exists a system of non-interacting electrons — the KS reference system — whose
> ground-state density is identical to that of the true interacting system.*

**Non-interacting \\(v\\)-representability.** This assumption is not trivially guaranteed. It requires that the interacting ground-state density \\(\rho_0(\mathbf{r})\\) can be reproduced as the ground-state density of some non-interacting system moving in a local effective potential \\(V_{\rm eff}(\mathbf{r})\\). Densities for which this holds are called *non-interacting \\(v\\)-representable*. While a general proof is lacking, no physically relevant counterexample has been found, and the assumption is accepted as holding for all practical ground-state densities encountered in electronic structure calculations. The Kohn–Sham equations derived below are exact under this assumption.

The density is represented in terms of **Kohn–Sham orbitals** \\(\{\phi_i(\mathbf{r})\}\\):

<div>
\begin{equation}
    \rho(\mathbf{r}) = \sum_{i=1}^{N} |\phi_i(\mathbf{r})|^2.
    \label{eq:KS-density}
\end{equation}
</div>

The kinetic energy of the non-interacting reference system is then computed exactly from these
orbitals:

<div>
\begin{equation}
    T_s[\rho] = -\frac{1}{2}\sum_{i=1}^{N} \langle \phi_i | \nabla^2 | \phi_i \rangle
              = -\frac{1}{2}\sum_{i=1}^{N} \int \phi_i^*(\mathbf{r})\,\nabla^2\phi_i(\mathbf{r})\,d\mathbf{r}.
\end{equation}
</div>

This is the key advantage over orbital-free approaches like Thomas–Fermi: by working with orbitals we recover the exact non-interacting kinetic energy at the cost of introducing \\(N\\) single-particle functions.


## Derivation of the Kohn–Sham Equations

We seek the set of orbitals \\(\{\phi_i\}\\) that minimises the total KS energy functional
\eqref{eq:KS-energy}, subject to the constraint that the orbitals remain orthonormal:

<div>
\begin{equation}
    \langle \phi_i | \phi_j \rangle = \int \phi_i^*(\mathbf{r})\phi_j(\mathbf{r})\,d\mathbf{r} = \delta_{ij}.
\end{equation}
</div>

This is a constrained minimisation problem, which we solve using the method of Lagrange multipliers.
We construct the Lagrangian:

<div>
\begin{equation}
    \mathcal{L}[\{\phi_i\}] = E[\rho] - \sum_{i,j} \epsilon_{ij} \left( \langle \phi_i | \phi_j \rangle - \delta_{ij} \right),
\end{equation}
</div>

where \\(\epsilon_{ij}\\) are the Lagrange multipliers enforcing orthonormality. Taking the
functional derivative with respect to \\(\phi_i^*(\mathbf{r})\\) and setting it to zero yields:

<div>
\begin{equation}
    \frac{\delta E[\rho]}{\delta \phi_i^*(\mathbf{r})} = \sum_j \epsilon_{ij} \phi_j(\mathbf{r}).
\end{equation}
</div>

Applying the chain rule to the left-hand side:

<div>
\begin{equation}
    \frac{\delta E[\rho]}{\delta \phi_i^*(\mathbf{r})} = \frac{\delta T_s}{\delta \phi_i^*} + \int \frac{\delta (E_{\mathrm{H}} + E_{\mathrm{xc}} + E_{\mathrm{ext}})}{\delta \rho(\mathbf{r}')} \frac{\delta \rho(\mathbf{r}')}{\delta \phi_i^*(\mathbf{r})} \, d\mathbf{r}'.
\end{equation}
</div>

Evaluating the individual derivatives:
1. \\(\frac{\delta T_s}{\delta \phi_i^*(\mathbf{r})} = -\frac{1}{2}\nabla^2 \phi_i(\mathbf{r})\\)
2. \\(\frac{\delta \rho(\mathbf{r}')}{\delta \phi_i^*(\mathbf{r})} = \delta(\mathbf{r} - \mathbf{r}')\phi_i(\mathbf{r}')\\)
3. \\(\frac{\delta E_{\mathrm{ext}}}{\delta \rho(\mathbf{r})} = V_{\mathrm{ext}}(\mathbf{r})\\)
4. \\(\frac{\delta E_{\mathrm{H}}}{\delta \rho(\mathbf{r})} = \int \frac{\rho(\mathbf{r}')}{|\mathbf{r}-\mathbf{r}'|}\,d\mathbf{r}' \equiv V_{\mathrm{H}}(\mathbf{r})\\)
5. \\(\frac{\delta E_{\mathrm{xc}}}{\delta \rho(\mathbf{r})} \equiv V_{\mathrm{xc}}(\mathbf{r})\\)

This defines the **Kohn–Sham effective potential**:

<div>
\begin{equation}
    V_{\mathrm{eff}}(\mathbf{r}) = V_{\mathrm{ext}}(\mathbf{r}) + V_{\mathrm{H}}(\mathbf{r}) + V_{\mathrm{xc}}(\mathbf{r}).
\end{equation}
</div>

The minimisation condition becomes:

<div>
\begin{equation}
    \left[ -\frac{1}{2}\nabla^2 + V_{\mathrm{eff}}(\mathbf{r}) \right] \phi_i(\mathbf{r}) = \sum_j \epsilon_{ij} \phi_j(\mathbf{r}).
\end{equation}
</div>

Because the Hamiltonian \\(\hat{h}_{\mathrm{KS}} = -\frac{1}{2}\nabla^2 + V_{\mathrm{eff}}\\) is Hermitian, the matrix of Lagrange multipliers \\(\epsilon_{ij}\\) is also Hermitian and can be diagonalised by a unitary transformation of the orbitals. This transformation leaves the total density \\(\rho(\mathbf{r})\\) unchanged. In this diagonal representation, we obtain the canonical **Kohn–Sham equations**:

<div>
\begin{equation}
    \boxed{ \left[ -\frac{1}{2}\nabla^2 + V_{\mathrm{eff}}(\mathbf{r}) \right] \phi_i(\mathbf{r}) = \epsilon_i \phi_i(\mathbf{r}) }
    \label{eq:KS-eqn}
\end{equation}
</div>

These are single-particle Schrödinger-like equations. The eigenvalues \\(\epsilon_i\\) are the Kohn–Sham orbital energies.


## The Self-Consistent Field (SCF) Cycle

The Kohn–Sham equations are non-linear: the effective potential \\(V_{\mathrm{eff}}(\mathbf{r})\\)
depends on \\(V_{\mathrm{H}}\\) and \\(V_{\mathrm{xc}}\\), which in turn depend on the density \\(\rho(\mathbf{r})\\), which is computed from the orbitals \\(\phi_i(\mathbf{r})\\) that are the
solutions to the KS equations themselves.

Therefore, they must be solved iteratively using the **Self-Consistent Field (SCF)** method:

1. **Initial guess**: Provide a starting guess for the electron density \\(\rho^{(0)}(\mathbf{r})\\) (often a superposition of atomic densities).
2. **Construct potential**: Calculate \\(V_{\mathrm{H}}[\rho]\\) and \\(V_{\mathrm{xc}}[\rho]\\), and form \\(V_{\mathrm{eff}}(\mathbf{r})\\).
3. **Solve KS equations**: Diagonalise the KS Hamiltonian to find the new orbitals \\(\phi_i^{(1)}(\mathbf{r})\\).
4. **Calculate new density**: Form the new density \\(\rho^{(1)}(\mathbf{r}) = \sum_i |\phi_i^{(1)}|^2\\).
5. **Check convergence**: If \\(|\rho^{(1)} - \rho^{(0)}| < \text{tolerance}\\), stop.
6. **Mixing**: If not converged, generate a new input density by mixing the old and new densities (e.g. using Broyden or Pulay mixing) to prevent numerical oscillations, and return to Step 2.


## Physical Meaning of Kohn–Sham Quantities

It is crucial to understand what the KS framework does and does not claim to represent physically.

### The Total Energy

The total ground-state energy is **not** simply the sum of the KS orbital energies. Summing the
eigenvalues gives:

<div>
\begin{equation}
    \sum_i \epsilon_i = \sum_i \langle \phi_i | -\frac{1}{2}\nabla^2 + V_{\mathrm{eff}} | \phi_i \rangle
    = T_s[\rho] + \int V_{\mathrm{eff}}(\mathbf{r})\rho(\mathbf{r})\,d\mathbf{r}.
\end{equation}
</div>

Substituting the definition of \\(V_{\mathrm{eff}}\\):

<div>
\begin{equation}
    \sum_i \epsilon_i = T_s[\rho] + \int V_{\mathrm{ext}}\rho\,d\mathbf{r} + \int V_{\mathrm{H}}\rho\,d\mathbf{r} + \int V_{\mathrm{xc}}\rho\,d\mathbf{r}.
\end{equation}
</div>

Comparing this to the exact total energy \eqref{eq:KS-energy}, we see that the Hartree and XC
interactions have been double-counted in the eigenvalue sum. The correct total energy must be
reconstructed by subtracting the double-counting terms:

<div>
\begin{equation}
    E[\rho] = \sum_i \epsilon_i - E_{\mathrm{H}}[\rho] - \int V_{\mathrm{xc}}(\mathbf{r})\rho(\mathbf{r})\,d\mathbf{r} + E_{\mathrm{xc}}[\rho].
\end{equation}
</div>

### The KS Orbitals and Eigenvalues

In exact DFT, the fictitious KS orbitals \\(\phi_i\\) and their energies \\(\epsilon_i\\) have **no
strict physical meaning**, with one exception: Janak's theorem and related rigorous results
show that the **highest occupied KS eigenvalue** corresponds exactly to the negative of the
first ionisation energy (or chemical potential) of the exact many-body system:

<div>
\begin{equation}
    \epsilon_{\mathrm{HOMO}}^{\mathrm{exact}} = -I.
\end{equation}
</div>

The other eigenvalues \\(\epsilon_i\\) do not formally correspond to electron removal or addition
energies (quasiparticle excitations). The KS "band gap" (\\(\epsilon_{\mathrm{LUMO}} - \epsilon_{\mathrm{HOMO}}\\)) systematically underestimates the true fundamental gap, even if the
exact XC functional were used. This is due to the **derivative discontinuity** of the exact XC
functional with respect to particle number.

Despite this, KS orbitals and eigenvalues are widely (and somewhat informally) used to
interpret band structures, density of states, and orbital energies, and often agree
qualitatively with experiment, but this agreement is not guaranteed by the theory.

Formally correct excitation spectra require going beyond ground-state DFT, e.g. via
**Time-Dependent DFT (TDDFT)** or many-body perturbation theory (**GW approximation**).


## Summary

The Kohn–Sham scheme reduces the interacting many-body problem to a set of effective
single-particle equations \eqref{eq:KS-eqn} that can be solved efficiently on modern computers.
The key steps and ideas are:

| Concept | Role |
|---|---|
| Non-interacting reference system | Enables exact computation of \\(T_s[\rho]\\) via orbitals |
| \\(V_{\mathrm{H}}\\) | Classical mean-field Coulomb repulsion, computed exactly |
| \\(V_{\mathrm{xc}}\\) | All many-body quantum effects, must be approximated |
| SCF loop | Resolves the self-consistency between density and potential |
| XC approximation (LDA, GGA, …) | The only uncontrolled approximation in the KS framework |

The formal exactness of the KS framework — all errors traceable to a single approximated term —
combined with its single-particle structure makes DFT the workhorse of electronic structure
theory. In the chapters that follow, we will examine how this framework is implemented in
practice: basis sets, pseudopotentials, \\(k\\)-point sampling, and the computational details of
solving the KS equations for real materials.
