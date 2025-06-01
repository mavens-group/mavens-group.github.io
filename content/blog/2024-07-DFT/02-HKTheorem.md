---
title: Hohenberg-Kohn Theorem
date: '2025-06-01'
type: book
weight: 02
summary:  Hohenberg Kohn Theorem

---
<!--more-->

The Hohenberg–Kohn (HK) theorems, proposed in 1964 by Pierre Hohenberg and Walter Kohn, are the
fundamental theoretical pillars of Density Functional Theory (DFT). They establish that the
ground-state properties of a many-electron system are uniquely determined by its electron density
$\rho(r)$, rather than by the complex many-body wavefunction $\psi$.

These theorems provide the justification for replacing the many-body Schrödinger equation with a
variational problem over electron densities, forming the basis for all practical implementations of
DFT.

### Assumptions
For a system of $𝑁$ interacting electrons subject to an external scalar potential $𝑉_{ext}(r)$.
The many-body Hamiltonian is given by:

{{< math >}}
$$
\begin{align*}
	\hat{H} =& \hat{T}+\hat{V}_{ee}+\hat{V}_{ext}\\
  \hat{H}\psi =& E\psi
\end{align*}
$$
{{< /math >}}
where
* $\hat{T}$ is the kinetic energy operator
* $\hat{V}_{ee}$ is the Coloumb interaction operator between two electrons
* $\hat{V}_{ext} = \sum_1^N V(r_i)$ is the external potential due to nuclei or applied fields.

The _electron density_ $\rho(r)$ is given by
{{< math>}}
$$
\rho(r)=N\int |\Psi(r_1,r_2\cdots r_N)|^2 dr_1dr_2\cdots dr_N
$$
{{< /math>}}

### The First Hohenberg–Kohn Theorem
_For any system of interacting particles in an external potential_ $V_{ext}(r)$_, the potential is
uniquely determined—up to a constant—by the ground-state electron density_ $\rho(r)$.

#### Proof (by contradiction)
Assume the contrary. Suppose there exist two different external potentials
$V_{\text{ext}}(\mathbf{r})$ and $V'_{\text{ext}}(\mathbf{r})$, differing by more than a constant:

\begin{equation}
V_{\text{ext}}(\mathbf{r}) \neq V'_{\text{ext}}(\mathbf{r}) + \text{const.}
\end{equation}
that yield the same ground-state density: $\rho(r)=\rho'(r)$

Let the Hamiltonians corresponding to these potentials be:
{{< math >}}
$$
\begin{align}
	\hat{H}  & = \hat{T} + \hat{V}_{\text{ee}} + \hat{V}_{\text{ext}},  \\
	\hat{H}' & = \hat{T} + \hat{V}_{\text{ee}} + \hat{V}'_{\text{ext}},
\end{align}
$$
{{< /math >}}
and let the ground-state energies be \( E_0 \) and \( E'_0 \), respectively:
{{< math >}}
$$
\begin{align}
	E_0  & = \langle \Psi | \hat{H} | \Psi \rangle,    \\
	E'_0 & = \langle \Psi' | \hat{H}' | \Psi' \rangle.
\end{align}
$$
{{< /math >}}

Using the Rayleigh–Ritz variational principle, we evaluate the energy expectation of $\Psi'$ with respect to $\hat{H}$:

{{< math >}}
$$
\begin{align}
    E_0 <& \langle \Psi' | \hat{H} | \Psi' \rangle = \langle \Psi' | \hat{H}' | \Psi' \rangle + \langle \Psi' | \hat{H} - \hat{H}' | \Psi' \rangle\\
    =& E'_0 + \int \left[ V_{\text{ext}}(\mathbf{r}) - V'_{\text{ext}}(\mathbf{r}) \right] \rho(\mathbf{r}) \, d\mathbf{r}.
\end{align}
$$
{{< /math >}}

Similarly, evaluate $E'_0$ with respect to $\hat{H}'$ using $\Psi$:
{{< math >}}
$$
\begin{equation}
	E'_0 < \langle \Psi | \hat{H}' | \Psi \rangle = E_0 + \int \left[ V'_{\text{ext}}(\mathbf{r}) - V_{\text{ext}}(\mathbf{r}) \right] \rho(\mathbf{r}) \, d\mathbf{r}.
\end{equation}
$$
{{< /math >}}

Adding equations , we obtain:
{{< math >}}
$$
\begin{align}
	E_0 + E'_0 & < E'_0 + E_0 + \int \left[ V_{\text{ext}}(\mathbf{r}) - V'_{\text{ext}}(\mathbf{r}) + V'_{\text{ext}}(\mathbf{r}) - V_{\text{ext}}(\mathbf{r}) \right] \rho(\mathbf{r}) \, d\mathbf{r}, \\
	E_0 + E'_0 & < E_0 + E'_0.
\end{align}
$$
{{< /math >}}

This is a contradiction. Hence, our initial assumption that two different external potentials can
yield the same ground-state density must be false. Therefore, the external potential $V_{\text{ext}}(\mathbf{r})$ is uniquely determined (up to a constant) by the ground-state density
$\rho_0(\mathbf{r})$.


This justifies the existence of a universal ground-state energy functional:
{{< math >}}
$$
\begin{align*}
  E[\rho] =& F[\rho]+\int V_{ext}(r)\rho(r)dr\\
   F[\rho] =& \langle\Psi[\rho]| T+V_{ee}| \Psi[\rho]\rangle
\end{align*}
$$
{{< /math >}}
where $F[\rho]$ is called the _universional functional_ of the density.


### The Second Hohenberg–Kohn Theorem

Let $\tilde{\rho}(\mathbf{r})$ be any trial electron density that satisfies the following conditions:
\begin{equation}
    \tilde{\rho}(\mathbf{r}) \geq 0, \quad \int \tilde{\rho}(\mathbf{r}) \, d\mathbf{r} = N,
\end{equation}
where $N$ is the total number of electrons in the system.

Then, the total ground-state energy functional,
\begin{equation}
    E[\rho] = F[\rho] + \int V_{\text{ext}}(\mathbf{r}) \rho(\mathbf{r}) \, d\mathbf{r},
\end{equation}
satisfies the variational principle:
\begin{equation}
    E_0 \leq E[\tilde{\rho}],
\end{equation}
with equality if and only if $\tilde{\rho}(\mathbf{r}) = \rho_0(\mathbf{r})$, where $\rho_0(\mathbf{r})$ is the true ground-state density corresponding to the external potential $V_{\text{ext}}(\mathbf{r})$.

Here, $E_0$ is the exact ground-state energy of the system, and the universal functional $F[\rho]$ is defined as:

\begin{equation}
    F[\rho] = \langle \Psi[\rho] | \hat{T} + \hat{V}_{\text{ee}} | \Psi[\rho] \rangle,
\end{equation}
