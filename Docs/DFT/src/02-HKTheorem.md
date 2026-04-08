# Hohenberg-Kohn (HK) Theorems

The Hohenberg–Kohn (HK) theorems, proposed in 1964 by Pierre Hohenberg and Walter Kohn, are the
fundamental theoretical pillars of Density Functional Theory (DFT). They establish that the
ground-state properties of a many-electron system are **uniquely determined by its electron
density**, i.e. \\(\rho(r)\\), rather than by the complex many-body wavefunction \\(\Psi\\).

This is a remarkable result: it implies that a function of three spatial variables \\(\rho(r)\\) —
rather than a wavefunction in \\(3N\\) dimensions — contains all the information needed to determine
the ground state of an \\(N\\)-electron system. The HK theorems provide the rigorous justification
for replacing the many-body Schrödinger equation with a variational problem over electron
densities, forming the conceptual basis for all practical implementations of DFT.

### Assumptions

We consider a system of \\(N\\) interacting electrons subject to an external scalar potential
\\(V_{\rm ext}(r)\\), at zero temperature, in its ground state, with no time-dependent fields. The
many-body Hamiltonian is:

\\[
\begin{align}
	\hat{H} =& \hat{T}+\hat{V}\_{ee}+\hat{V}\_{ext}\\\\
  \hat{H}\Psi =& E\Psi
\end{align}
\\]

where
* \\(\hat{T}\\) is the kinetic energy operator of the electrons,
* \\(\hat{V}_{ee}\\) is the Coulomb electron–electron repulsion operator,
* \\(\hat{V}\_{ext} = \sum_{i=1}^N V_{\rm ext}(r_i) \\) is the external potential due to the nuclei or
  any applied field — it is the same for all systems considered in the proofs below.

The **electron density** \\(\rho(r)\\) is defined as the probability of finding any one electron at
position \\(r\\), integrated over all other electron coordinates:

<div>
\begin{equation}
\rho(r)=N\int |\Psi(r_1,r_2\cdots r_N)|^2 \,dr_2\,dr_3\cdots dr_N
\label{eq:charge-wf}
\end{equation}
</div>

\eqref{eq:charge-wf}
Note that \\(\int \rho(r)\,dr = N\\).


### The First Hohenberg–Kohn Theorem

<div class="theorem">
For any system of interacting particles in an external potential \(V_{\rm ext}(r)\),
the external potential is uniquely determined — up to a constant — by the ground-state electron
density \\(\rho_0(r)\\).
</div>

Because \\(V_{\rm ext}(r)\\) uniquely determines \\(\hat{H}\\) (and hence all eigenstates and
eigenvalues), the ground-state density \\(\rho_0(r)\\) alone determines everything about the system.
The wavefunction \\(\Psi_0\\) is therefore a functional of \\(\rho_0\\), written \\(\Psi_0 = \Psi[\rho_0]\\).

#### Proof (by contradiction)

<div class="proof" title="by contradiction">

Assume the contrary: suppose there exist two **different** external potentials
\\(V_{\rm ext}(\mathbf{r})\\) and \\(V'_{\rm ext}(\mathbf{r})\\), differing by more than a constant,

<div>
\begin{equation}
V_{\rm ext}(\mathbf{r}) \neq V'_{\rm ext}(\mathbf{r}) + \text{const.},
\end{equation}
</div>

that nevertheless yield the **same** ground-state density: \\(\rho(\mathbf{r})=\rho'(\mathbf{r}) \equiv \rho(\mathbf{r})\\).

Let the two Hamiltonians and their ground states be:

\\[
\begin{aligned}
	\hat{H}  & = \hat{T} + \hat{V}\_{\rm ee} + \hat{V}\_{\rm ext},  & \hat{H}|\Psi\rangle = E\_0|\Psi\rangle,   \\\\
	\hat{H}' & = \hat{T} + \hat{V}\_{\rm ee} + \hat{V}'\_{\rm ext}, & \hat{H}'|\Psi'\rangle = E'\_0|\Psi'\rangle.
\end{aligned}
\\]

We apply the **Rayleigh–Ritz variational principle**, which states that the true ground-state
energy minimises the energy expectation value: any trial state \\(|\tilde{\Psi}\rangle \neq |\Psi_0\rangle\\)
satisfies \\(\langle\tilde{\Psi}|\hat{H}|\tilde{\Psi}\rangle > E_0\\).

Using \\(\Psi'\\) as a trial state for \\(\hat{H}\\):

<div>
\begin{align}
    E_0 \leq& \langle \Psi' | \hat{H} | \Psi' \rangle
       = \langle \Psi' | \hat{H}' | \Psi' \rangle + \langle \Psi' | \hat{H} - \hat{H}' | \Psi' \rangle \notag\\\\
    =& \; E'\_0 + \int \left[ V\_{\rm ext}(\mathbf{r}) - V'\_{\rm ext}(\mathbf{r}) \right] \rho(\mathbf{r}) \, d\mathbf{r}. \label{eq:ineq1}
\end{align}
</div>

Symmetrically, using \\(\Psi\\) as a trial state for \\(\hat{H}'\\):

<div>
\begin{equation}
	E'\_0 \leq \langle \Psi | \hat{H}' | \Psi \rangle
    = E\_0 + \int \left[ V'\_{\rm ext}(\mathbf{r}) - V\_{\rm ext}(\mathbf{r}) \right] \rho(\mathbf{r}) \, d\mathbf{r}. \label{eq:ineq2}
\end{equation}
</div>

Adding the two inequalities \eqref{eq:ineq1} and \eqref{eq:ineq2}:

\\[
\begin{align}
	E\_0 + E'\_0 & \leq E'\_0 + E\_0 + \int \underbrace{\left[ V\_{\rm ext} - V'\_{\rm ext} + V\'_{\rm ext} - V\_{\rm ext} \right]}\_{=\,0} \rho(\mathbf{r}) \, d\mathbf{r}, \\\\
	E\_0 + E'\_0 & \leq E\_0 + E'\_0.
\end{align}
\\]

This is a **contradiction**. Our assumption must therefore be false: no two different external
potentials (differing by more than a constant) can share the same ground-state density. The map
\\(\rho_0(r) \mapsto V_{\rm ext}(r)\\) is therefore one-to-one (up to a constant). \\(\blacksquare\\)

</div>

#### Consequence: the universal energy functional

<div class="lemma">
Since \(\rho_0 \to V_{\rm ext} \to \hat{H} \to \Psi_0\), the ground-state energy can be written as
a functional of the density:

\\[
\begin{align*}
  E[\rho] =& F[\rho]+\int V_{\rm ext}(r)\rho(r)\,dr\\\\
   F[\rho] =& \langle\Psi[\rho]|\, \hat{T}+\hat{V}_{ee}\,| \Psi[\rho]\rangle
\end{align*}
\\]

The quantity \\(F[\rho]\\) is called the **universal functional** of the density. It is "universal"
because it depends only on the electron density — not on the specific external potential —
making it, in principle, applicable to any system of interacting electrons.
</div>

---

### The Second Hohenberg–Kohn Theorem

<div class="theorem">
The true ground-state density \(\rho_0(\mathbf{r})\) minimises the total energy functional
\(E[\rho]\).
</div>

That is, for any trial density \\(\tilde{\rho}(\mathbf{r})\\) satisfying

<div>
\begin{equation}
    \tilde{\rho}(\mathbf{r}) \geq 0, \quad \int \tilde{\rho}(\mathbf{r}) \, d\mathbf{r} = N,
\end{equation}
</div>

*we have*

<div>
\begin{equation}
    E_0 \leq E[\tilde{\rho}],
\end{equation}
</div>

*with equality if and only if \\(\tilde{\rho}(\mathbf{r}) = \rho_0(\mathbf{r})\\).*

The functional is:

<div>
\begin{equation}
    E[\rho] = F[\rho] + \int V_{\rm ext}(\mathbf{r}) \rho(\mathbf{r}) \, d\mathbf{r},
\end{equation}
</div>

where \\(F[\rho]\\) is the universal functional defined above.


#### Proof of the 2nd HK Theorem
<div class="proof">

By the First HK Theorem, every *v*-representable density \\(\tilde{\rho}\\) uniquely determines an external potential \\(\tilde{V}_{\rm ext}\\) (up to a constant), and hence a Hamiltonian \\(\tilde{H}\\) and a ground-state wavefunction \\(\tilde{\Psi}\\). The ground-state energy functional is therefore well-defined:

\\[
E[\tilde{\rho}] = \langle \tilde{\Psi}[\tilde{\rho}] | \hat{T} + \hat{V}\_{ee} + \hat{V}\_{\rm ext} | \tilde{\Psi}[\tilde{\rho}] \rangle = F[\tilde{\rho}] + \int V_{\rm ext}(\mathbf{r})\tilde{\rho}(\mathbf{r}) d\mathbf{r}
\\]

Now consider the true ground state \\(|\Psi_0\rangle\\) with density \\(\rho_0\\) and energy \\(E_0\\). For any trial density \\(\tilde{\rho} \neq \rho_0\\), the associated wavefunction \\(\tilde{\Psi}\\) is *different* from \\(\Psi_0\\) (again by the First HK Theorem). Since \\(\Psi_0\\) is the true ground state of \\(\hat{H}\\), the **Rayleigh–Ritz variational principle** gives:

\\[
E_0 = \langle \Psi_0 | \hat{H} | \Psi_0 \rangle \leq \langle \tilde{\Psi} | \hat{H} | \tilde{\Psi} \rangle.
\\]

The right-hand side is precisely \\(E[\tilde{\rho}]\\) as defined above (using \\(\hat{V}_{\rm ext}\\) of the *original* system). Therefore:

\\[
E_0 \leq E[\tilde{\rho}], \quad \forall\, \tilde{\rho} \neq \rho_0,
\\]

with equality if and only if \\(\tilde{\Psi} = \Psi_0\\), i.e. \\(\tilde{\rho} = \rho_0\\). \\(\blacksquare\\)

</div>

The key logical chain is:

1. The First HK Theorem guarantees the map \\(\tilde{\rho} \mapsto \tilde{\Psi}\\) is one-to-one, so \\(\tilde{\rho} \neq \rho_0 \Rightarrow \tilde{\Psi} \neq \Psi_0\\).
2. The Rayleigh–Ritz principle then directly delivers the inequality \\(E[\tilde{\rho}] \geq E_0\\).

The second theorem transforms the problem of solving the many-body Schrödinger equation into a
**variational problem over electron densities** — a function in three dimensions rather than \\(3N\\)
dimensions. This is the promise of DFT.

---

### Outlook

While the HK theorems establish that the ground-state density contains all physical information
and that a universal energy functional \\(E[\rho]\\) exists, they do **not** provide an explicit form
for the universal functional \\(F[\rho]\\). In particular, the kinetic energy \\(T[\rho]\\) and the
electron–electron interaction \\(V_{ee}[\rho]\\) are unknown functionals of \\(\rho\\).

**A note on \\(v\\)-representability.** The HK proof assumes that the trial density \\(\tilde{\rho}\\) is *\\(v\\)-representable* — that it is the ground-state density of *some* external potential \\(\tilde{V}_{\rm ext}\\). Not all non-negative, normalised densities satisfy this condition. Lieb (1983) resolved this by reformulating DFT via a Legendre transform, defining the universal functional as:

\\[
F[\rho] = \sum_{V_{\rm ext}} \left( E[V_{\rm ext}] - \int V_{\rm ext}(\mathbf{r})\,\rho(\mathbf{r})\,d\mathbf{r} \right),
\\]

which is well-defined for all non-negative \\(\rho\\) with \\(\int\rho d\mathbf{r} = N\\) — a larger class called *ensemble \\(v\\)-representable* densities. For the Kohn–Sham scheme specifically, the relevant condition is *non-interacting \\(v\\)-representability*: the ground-state density of the interacting system must also be the ground-state density of some non-interacting system in an effective potential. This is assumed to hold throughout the KS construction (Chapter 3) and is believed to be satisfied for all physically relevant ground-state densities, though a general proof remains an open problem.

Computing \\(F[\rho]\\) accurately is the central challenge of DFT in practice. The **Kohn–Sham
equations**, developed in the next chapter, provide a practical path forward by introducing a
fictitious system of non-interacting electrons designed to reproduce the exact ground-state density
— sidestepping the need to evaluate \\(F[\rho]\\) directly.
