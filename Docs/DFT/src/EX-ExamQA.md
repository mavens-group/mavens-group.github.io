# Examination Questions and Answer Hints

This chapter collects representative examination questions drawn from all parts of the course,
pitched at the M.Sc. level. Each question is followed by a structured **Answer Hint** — not a
model answer, but a map of the concepts, logical steps, and equations an examiner would expect to
see. Working through these before an examination is most effective when you attempt the question
*before* reading the hint.

The questions are grouped by chapter and marked with an estimated difficulty:
**[S]** short answer (5–10 min), **[M]** medium (15–20 min), **[L]** long / proof-based (30+ min).

>[!TIP]
>**Note on prerequisites.**
>Q1.3 (variational He atom) and Q2.1 (HK proof) both rely on the
>Rayleigh–Ritz variational principle. These questions assume familiarity with the variational
>theorem: for any normalised trial state \\(|\tilde\Psi\rangle\\), the expectation value of the
>Hamiltonian satisfies \\(\langle\tilde\Psi|\hat{H}|\tilde\Psi\rangle \geq E_0\\), with equality iff
>\\(|\tilde\Psi\rangle\\) is the true ground state. This result underpins both the justification for
>DFT energy minimisation and the proof of the HK theorems, and is a thread that runs through the
>entire course.

## Part I: Theoretical Foundations

### Chapter 1 — The Many-Body Problem

**Q1.1 [S]** Write down the full many-body Hamiltonian for a system of \\(N\\) electrons and \\(M\\)
nuclei. Identify each term and state which terms are neglected under the Born–Oppenheimer
approximation. Why is this approximation justified?

<div class="remark">
**Answer Hint.** The Hamiltonian has five terms: nuclear kinetic energy \\(\hat{T}_n\\), electronic
kinetic energy \\(\hat{T}_e\\), electron–electron repulsion \\(\hat{V}_{ee}\\), nuclear–nuclear repulsion
\\(\hat{V}_{nn}\\), and electron–nuclear attraction \\(\hat{V}_{en}\\). Under Born–Oppenheimer, \\(\hat{T}_n\\)
is neglected and \\(\hat{V}_{nn}\\) becomes a constant. Justification: nuclei are \\(\sim 10^3\\)–\\(10^5\\)
times heavier than electrons, so they move on a far slower timescale. Electrons adiabatically
follow the nuclear configuration, decoupling the two equations.
</div>

**Q1.2 [S]** Why does the number of variables in \\(\Psi(r_1, r_2, \ldots, r_N)\\) scale as \\(3N\\)
rather than 3? What practical consequence does this have for \\(N = 100\\)?

<div class="remark">
**Answer Hint.** Each electron has three spatial coordinates; the wavefunction lives in \\(3N\\)-dimensional configuration space. For \\(N=100\\), storing \\(\Psi\\) on a grid of even 10 points per dimension requires \\(10^{300}\\) numbers — vastly more than the estimated \\(10^{80}\\) atoms in the observable universe. This exponential wall motivates the move to density-based (DFT) or other reduced descriptions.
</div>

**Q1.3 [M]** Use a hydrogenic trial wavefunction \\(\phi(\mathbf{r}) = (\alpha^3/\pi)^{1/2} e^{-\alpha r}\\)
to estimate the ground-state energy of helium variationally. Find the optimal \\(\alpha_{\rm opt}\\),
compute \\(E(\alpha_{\rm opt})\\), and compare to the Hartree–Fock result (\\(-77.9\\) eV) and experiment
(\\(-79.0\\) eV). What physics is missing from this trial function?

<div class="remark">
**Answer Hint.**

*Setup:* Write the He Hamiltonian as \\(\hat{H} = \hat{h}_1 + \hat{h}_2 + \hat{V}_{ee}\\), where
\\(\hat{h}_i = -\tfrac{1}{2}\nabla_i^2 - Z/r_i\\) (\\(Z=2\\)) and \\(\hat{V}_{ee} = 1/r_{12}\\). Use the product
ansatz \\(\Phi(\mathbf{r}_1, \mathbf{r}_2) = \phi(\mathbf{r}_1)\phi(\mathbf{r}_2)\\) — two electrons
in the same hydrogenic orbital with variational exponent \\(\alpha\\).

*Three expectation values:*

1. Kinetic energy per electron: \\(\langle\phi|-\tfrac{1}{2}\nabla^2|\phi\rangle = \alpha^2/2\\).

2. Electron–nuclear attraction: \\(\langle\phi|-Z/r|\phi\rangle = -Z\alpha\\).

3. Electron–electron repulsion (the key integral): for two hydrogenic densities, the standard
   result is \\(\langle \hat{V}_{ee}\rangle = 5\alpha/8\\).

*Total energy:*

\\[
E(\alpha) = \alpha^2 - 2Z\alpha + \frac{5\alpha}{8} = \alpha^2 - \left(2Z - \frac{5}{8}\right)\alpha.
\\]

*Minimisation:* \\(\partial E/\partial\alpha = 0\\) gives

\\[
\alpha_{\rm opt} = Z - \frac{5}{16} = 2 - \frac{5}{16} = \frac{27}{16} \approx 1.6875.
\\]

The physical interpretation: \\(\alpha_{\rm opt} < Z = 2\\) because each electron partially screens
the nucleus from the other, reducing the effective nuclear charge it feels.

*Optimal energy:*

\\[
E(\alpha_{\rm opt}) = -\left(Z - \frac{5}{16}\right)^2 = -\left(\frac{27}{16}\right)^2 \approx -2.848 \text{ Ha} \approx -77.5 \text{ eV}.
\\]

*Comparison:* This is above the HF limit (\\(-77.9\\) eV) and experiment (\\(-79.0\\) eV), consistent
with the variational principle — no approximation can go below the true ground state. The
remaining \\(\sim 1.1\\) eV gap from experiment is **electron correlation**: the instantaneous
\\(r_{12}\\)-dependence of the wavefunction, absent in any single-product ansatz. This is precisely
the correlation energy \\(E_c\\) that DFT's \\(E_{\rm xc}\\) must capture.
</div>

---

### Chapter 2 — Hohenberg–Kohn Theorems

**Q2.1 [L]** State and prove the First Hohenberg–Kohn Theorem. Your proof must clearly identify
where the Rayleigh–Ritz variational principle is used.

<div class="remark">
**Answer Hint.**

*Statement:* The external potential \\(V_{\rm ext}(\mathbf{r})\\) is determined uniquely (up to a
constant) by the ground-state electron density \\(\rho_0(\mathbf{r})\\).

*Proof structure (by contradiction):* Assume two potentials \\(V\\) and \\(V'\\) (differing by more
than a constant) give the same \\(\rho_0\\). They define two Hamiltonians \\(\hat{H}\\), \\(\hat{H}'\\)
with ground states \\(\Psi_0\\), \\(\Psi_0'\\) and energies \\(E_0\\), \\(E_0'\\). Apply the variational
principle using \\(\Psi_0'\\) as a trial state for \\(\hat{H}\\):

\\[
E_0 < \langle \Psi_0' | \hat{H} | \Psi_0' \rangle = E_0' + \int [V - V']\rho_0\, d\mathbf{r}.
\\]

By symmetry (swap primed and unprimed):

\\[
E_0' < E_0 + \int [V' - V]\rho_0\, d\mathbf{r}.
\\]

Adding gives \\(E_0 + E_0' < E_0 + E_0'\\) — a contradiction. Note: the strict inequality requires
the ground states to be non-degenerate; address this subtlety if asked.
</div>

**Q2.2 [M]** State the Second Hohenberg–Kohn Theorem and prove it using the result of the First.
What role does \\(v\\)-representability play?

<div class="remark">
**Answer Hint.**

*Statement:* The true ground-state density \\(\rho_0\\) minimises the total energy functional
\\(E[\rho] = F[\rho] + \int V_{\rm ext}\rho\, d\mathbf{r}\\) among all \\(v\\)-representable densities.

*Proof:* By HK1, every trial density \\(\tilde\rho \neq \rho_0\\) maps to a unique \\(\tilde\Psi \neq \Psi_0\\). Since \\(\Psi_0\\) is the true ground state, the variational principle gives
\\(E_0 = \langle\Psi_0|\hat{H}|\Psi_0\rangle \leq \langle\tilde\Psi|\hat{H}|\tilde\Psi\rangle = E[\tilde\rho]\\), with equality iff \\(\tilde\rho = \rho_0\\).

*\\(v\\)-representability:* The proof requires \\(\tilde\rho\\) to be the ground-state density of *some*
external potential. Not all non-negative, \\(N\\)-normalised densities satisfy this condition — it is
not trivially obvious which densities are physically realisable as ground states. Lieb's
constrained-search (Legendre-transform) formulation defines \\(F[\rho]\\) via

\\[
F[\rho] = \inf_{\Psi \to \rho} \langle\Psi|\hat{T}+\hat{V}_{ee}|\Psi\rangle,
\\]

a minimisation over all antisymmetric \\(\Psi\\) yielding density \\(\rho\\). This is well-defined for any
\\(N\\)-representable \\(\rho\\) (a much larger class), sidestepping the \\(v\\)-representability restriction
entirely. The KS scheme then requires the weaker condition of *non-interacting \\(v\\)-representability*:
the ground-state density of the interacting system must also be achievable as the ground-state
density of some non-interacting system in a local potential. This is assumed throughout KS theory
and is believed to hold for all physical ground-state densities, but remains unproven in general.
</div>

**Q2.3 [S]** What is the universal functional \\(F[\rho]\\)? Why is it called "universal," and why
is computing it accurately the central challenge of DFT?

<div class="remark">
**Answer Hint.** \\(F[\rho] = \langle\Psi[\rho]|\hat{T}+\hat{V}_{ee}|\Psi[\rho]\rangle\\). It is
"universal" because it depends only on the density, not on \\(V_{\rm ext}\\) — it is the same
functional for all systems. Computing it is hard because it encodes all many-body kinetic and
correlation effects. In particular, the kinetic energy \\(T[\rho]\\) as a functional of density alone
(as in Thomas–Fermi theory) is highly inaccurate; this motivates the Kohn–Sham trick of
introducing orbitals.
</div>

**Q2.4 [S]** A student claims: "The HK theorem tells us DFT is exact, so any DFT calculation
gives the exact answer." Identify two reasons why this claim is wrong.

<div class="remark">
**Answer Hint.** (i) The HK theorems guarantee *existence* of a universal functional, not its
explicit form. The exchange-correlation functional \\(E_{\rm xc}[\rho]\\) must be approximated in
every practical calculation; LDA, GGA etc. introduce uncontrolled errors. (ii) The HK theorems
apply only to the *ground state* at zero temperature. Excited states, finite temperature, and
time-dependent processes require extensions (TDDFT, finite-temperature DFT).
</div>

---

### Chapter 3 — Kohn–Sham Equations

**Q3.1 [M]** Derive the Kohn–Sham equations from the variational minimisation of the total
energy functional. Clearly define the Kohn–Sham effective potential \\(V_{\rm eff}\\).

<div class="remark">
**Answer Hint.** Start from

\\[
E[\rho] = T_s[\rho] + E_{\rm H}[\rho] + E_{\rm xc}[\rho] + \int V_{\rm ext}\rho\, d\mathbf{r}.
\\]

Introduce \\(T_s\\) as an explicit orbital functional:
\\(T_s = \sum_i f_i \langle\phi_i|-\tfrac{1}{2}\nabla^2|\phi_i\rangle\\), with
\\(\rho(\mathbf{r}) = \sum_i f_i |\phi_i(\mathbf{r})|^2\\). Impose orthonormality
\\(\langle\phi_i|\phi_j\rangle = \delta_{ij}\\) via Lagrange multipliers \\(\epsilon_{ij}\\). The
stationarity condition \\(\delta\mathcal{L}/\delta\phi_i^* = 0\\) gives

\\[
-\frac{1}{2}\nabla^2\phi_i + \frac{\delta(E_{\rm H}+E_{\rm xc})}{\delta\rho}\,\phi_i + V_{\rm ext}\phi_i = \sum_j \epsilon_{ij}\phi_j.
\\]

The functional derivatives are:
\\(\delta E_{\rm H}/\delta\rho = V_{\rm H}(\mathbf{r}) = \int\rho(\mathbf{r}')/|\mathbf{r}-\mathbf{r}'|\, d\mathbf{r}'\\)
and \\(\delta E_{\rm xc}/\delta\rho = V_{\rm xc}(\mathbf{r})\\). Choosing the unitary transformation
that diagonalises the multiplier matrix \\(\epsilon_{ij} \to \epsilon_i \delta_{ij}\\) (canonical
KS orbitals) yields the KS equations in their standard form:

\\[
\left[-\frac{1}{2}\nabla^2 + V_{\rm eff}(\mathbf{r})\right]\phi_i(\mathbf{r}) = \epsilon_i\,\phi_i(\mathbf{r}),
\qquad V_{\rm eff} = V_{\rm ext} + V_{\rm H} + V_{\rm xc}.
\\]

Note: \\(V_{\rm eff}\\) depends on \\(\rho\\) which depends on the \\(\phi_i\\) — the equations are
nonlinear and must be solved self-consistently.
</div>

**Q3.2 [S]** The KS scheme introduces a fictitious non-interacting system. In what precise sense
is this system "fictitious," and what physical quantity does it share with the true interacting
system?

<div class="remark">
**Answer Hint.** The non-interacting system has no electron–electron interaction; it moves in an
effective one-body potential \\(V_{\rm eff}\\) that is designed so that its ground-state density
equals that of the true interacting system. The *density* \\(\rho(\mathbf{r})\\) is exact (by
construction); the individual KS eigenvalues \\(\epsilon_i\\) and orbitals \\(\phi_i\\) are *not*
observables of the real system (with the notable exception of the highest occupied eigenvalue,
which equals the negative of the ionisation energy under the exact XC functional).
</div>

**Q3.3 [S]** Write out the self-consistent field (SCF) cycle for solving the KS equations. What
quantity is converged, and why is iterative solution necessary?

<div class="remark">
**Answer Hint.** The SCF loop: (1) Start with an initial guess \\(\rho^{(0)}\\). (2) Construct
\\(V_{\rm eff}[\rho]\\). (3) Solve the KS eigenvalue problem to get \\(\{\phi_i, \epsilon_i\}\\). (4)
Compute the output density \\(\rho^{\rm out} = \sum_i f_i |\phi_i|^2\\). (5) Mix \\(\rho^{\rm in}\\) and
\\(\rho^{\rm out}\\) to form the new input. Repeat until \\(|\rho^{\rm out} - \rho^{\rm in}| \lt \epsilon_{\rm tol}\\).
Iteration is necessary because \\(V_{\rm eff}\\) depends on \\(\rho\\), which in turn depends on the
eigenstates of \\(V_{\rm eff}\\) — a nonlinear self-consistency condition.
</div>

---

### Chapter 4 — Exchange-Correlation Functionals

**Q4.1 [S]** Write down the LDA expression for \\(E_{\rm xc}\\) and state the physical system from
which \\(\varepsilon_{\rm xc}^{\rm UEG}(\rho)\\) is derived.

<div class="remark">
**Answer Hint.**

\\[
E_{\rm xc}^{\rm LDA}[\rho] = \int \varepsilon_{\rm xc}^{\rm UEG}(\rho(\mathbf{r}))\,\rho(\mathbf{r})\, d\mathbf{r}.
\\]

\\(\varepsilon_{\rm xc}^{\rm UEG}\\) is the XC energy per particle of the **uniform electron gas** (UEG),
a model of interacting electrons in a uniform positive background. The exchange part is analytic
(Dirac): \\(\varepsilon_{\rm x}^{\rm UEG} = -(3/4)(3/\pi)^{1/3}\rho^{1/3}\\). The correlation part
is obtained from quantum Monte Carlo simulations (Ceperley–Alder data, parameterised by
Perdew–Wang or Vosko–Wilk–Nusair).
</div>

**Q4.2 [M]** Explain why LDA often gives surprisingly good results despite being based on the
uniform electron gas. What is the role of the XC hole sum rule?

<div class="remark">
**Answer Hint.** The XC energy depends on the *spherically averaged* XC hole \\(\bar{n}_{\rm xc}(r)\\),
not its angular details. The LDA hole (borrowed from the UEG) satisfies the exact sum rule
\\(\int n_{\rm xc}(\mathbf{r},\mathbf{r}')\, d\mathbf{r}' = -1\\) by construction, so its spherical
average integrates correctly. Even if the shape of the hole is wrong in detail, this constraint
produces systematic error cancellation. The overbinding tendency of LDA (too negative
\\(E_{\rm xc}\\)) is a known and quantifiable error rather than random noise.
</div>

**Q4.3 [M]** Describe the GGA improvement over LDA. Why does the raw gradient expansion
approximation (GEA) fail, and how does PBE correct for this?

<div class="remark">
**Answer Hint.** GEA adds a correction proportional to \\(|\nabla\rho|^2/\rho^{4/3}\\) (the
dimensionless reduced gradient \\(s^2\\)), but it violates the XC hole sum rule in the density tails
(where \\(s \to \infty\\)) — the hole becomes positive and the \\(-1\\) sum rule is broken.

PBE uses an *enhancement factor* form \\(E_{\rm xc}^{\rm GGA} = \int \varepsilon_{\rm xc}^{\rm UEG}(\rho) F_{\rm xc}(\rho, s)\rho\, d\mathbf{r}\\) and determines \\(F_{\rm xc}\\) by imposing exact constraints: recovery of LDA at \\(s=0\\), correct GEA gradient coefficient near \\(s=0\\), saturation at large \\(s\\) to restore the sum rule, and the Lieb–Oxford bound. PBE has zero empirical parameters.
</div>

**Q4.4 [S]** What is Jacob's Ladder in the context of XC functionals? Name one functional at
each of the first four rungs and the key new ingredient added at each rung.

<div class="remark">
**Answer Hint.**

| Rung | Ingredient added | Example |
|---|---|---|
| LDA | UEG energy density \\(\rho\\) | PW92 |
| GGA | Reduced gradient \\(s = |\nabla\rho|/\rho^{4/3}\\) | PBE |
| meta-GGA | Kinetic energy density \\(\tau\\) or \\(\nabla^2\rho\\) | SCAN |
| Hybrid | Fraction of exact (HF) exchange | PBE0, HSE06 |

Double hybrids add perturbative correlation (GL2). Each rung adds non-locality of a different kind.
</div>

**Q4.5 [S]** What is the self-interaction error (SIE) in DFT, and why does it not appear in
Hartree–Fock theory?

<div class="remark">
**Answer Hint.** In exact theory, the Hartree self-repulsion of each electron
\\(E_{\rm H}[\rho_i]\\) is exactly cancelled by a corresponding exchange term. In DFT with
approximate \\(E_{\rm xc}\\), this cancellation is incomplete, leaving a spurious self-repulsion.
Consequence: delocalisation error, incorrect dissociation of \\(H_2^+\\), underestimated barriers.
In Hartree–Fock, the exact exchange integral \\(\langle ij|ji\rangle\\) cancels the self-interaction
in \\(E_{\rm H}\\) exactly for each orbital, by construction.
</div>

**Q4.6 [S]** A DFT+PBE calculation of a van der Waals bonded molecular crystal (e.g. graphite or
a layered organic solid) predicts a near-zero interlayer binding energy. Explain precisely why
PBE fails here, and describe two physically motivated remedies.

<div class="remark">
**Answer Hint.** London dispersion forces arise from *non-local, correlated density fluctuations*
at large inter-fragment separations \\(R\\), producing a \\(-C_6/R^6\\) attraction. PBE is semi-local:
\\(E_{\rm xc}^{\rm PBE}\\) at point \\(\mathbf{r}\\) depends only on \\(\rho\\) and \\(\nabla\rho\\) at that
same point. It cannot describe the instantaneous dipole–dipole correlations between distant
fragments; the interaction energy decays exponentially rather than as \\(R^{-6}\\). The GEA and its
constrained resummations cannot cure this — it is a fundamental non-locality, not a gradient
correction problem.

*Remedies:*

1. **DFT-D3(BJ)** (Grimme et al., 2010): Add a pairwise atom–atom correction
   \\(-C_6^{AB}/r_{AB}^6 - C_8^{AB}/r_{AB}^8\\) with Becke–Johnson damping. Cheap, widely
   implemented, recommended default for molecular crystals. Invoke in VASP via `IVDW = 12`.

2. **Non-local correlation functional (vdW-DF / VV10):** Replace \\(E_c^{\rm GGA}\\) with a
   functional that includes a double spatial integral coupling densities at different points
   \\(\mathbf{r}\\) and \\(\mathbf{r}'\\). Physically includes the \\(C_6/R^6\\) tail without empirical atom
   parameters. Computationally more expensive but more transferable, especially for heterogeneous
   systems.

The key point for the examiner: the failure is *not* due to missing gradient information (adding
\\(\nabla\rho\\) does not help) but due to missing non-local correlation.
</div>

**Q4.7 [S]** For each of the following materials, state the most appropriate class of XC
functional and justify your choice: (a) bcc iron; (b) a hybrid organic–inorganic perovskite with
a band gap of \\(\sim 1.6\\) eV; (c) a weakly correlated simple metal (Al); (d) a Mott insulator
(VO\\(_2\\)).

<div class="remark">
**Answer Hint.**

(a) **bcc Fe — spin-polarised GGA (PBE or PBEsol):** Fe is a transition metal with itinerant
magnetism; GGA captures the exchange splitting adequately, and the \\(3d\\) states are not as
strongly correlated as in oxides. DFT+U is sometimes added for oxides but is not standard for
pure Fe.

(b) **Hybrid perovskite — range-separated hybrid (HSE06):** Band gap is in the semiconductor
regime where GGA underestimates by \\(\sim 40\%\\). PBE0 is too expensive for large unit cells;
HSE06 provides similar accuracy with tractable cost by limiting exact exchange to short range.
DFT-D3 should also be added for vdW stacking in layered perovskites.

(c) **Al — LDA or GGA:** Al is a nearly-free-electron metal; its electron density is close to
uniform, so LDA's errors cancel well. PBE slightly overbinds but both work. Hybrids add cost
with no accuracy benefit for nearly free-electron metals.

(d) **VO\\(_2\\) — DFT+U or hybrid (HSE06):** V \\(3d\\) states are localised and GGA fails to
reproduce the Mott gap. DFT+U with \\(U_{\rm eff} \sim 3\\)–\\(4\\) eV on V \\(d\\) is the standard
workhorse; HSE06 is an alternative if a parameter-free approach is needed but at higher cost.
</div>

---

### Chapter 5 — Basis Sets and Pseudopotentials

**Q5.1 [S]** What is the kinetic energy cutoff \\(E_{\rm cut}\\) in a plane-wave calculation? Write
the condition that a reciprocal lattice vector \\(\mathbf{G}\\) must satisfy to be included in the
basis.

<div class="remark">
**Answer Hint.** The plane-wave basis includes all \\(\mathbf{G}\\) satisfying

\\[
\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 \leq E_{\rm cut}.
\\]

(atomic units; in SI replace \\(1/2\\) with \\(\hbar^2/2m_e\\)). Increasing \\(E_{\rm cut}\\) adds more
plane waves and systematically improves the basis — a key advantage over atom-centred bases.
VASP quotes \\(E_{\rm cut}\\) in eV; Quantum ESPRESSO in Ry (1 Ry = 13.6 eV).
</div>

**Q5.2 [M]** Compare norm-conserving pseudopotentials (NCPP), ultrasoft pseudopotentials (USPP),
and the PAW method. What physical quantity does norm conservation enforce, and what does
relaxing it require?

<div class="remark">
**Answer Hint.**

- **NCPP:** The pseudo-wavefunction is normalised identically to the all-electron wavefunction
  inside \\(r_c\\): \\(\int_0^{r_c}|\tilde\phi|^2\, dr = \int_0^{r_c}|\phi|^2\, dr\\). This ensures
  correct scattering properties (logarithmic derivatives). Requires \\(E_{\rm cut} \sim 60\\)–\\(100\\) Ry.

- **USPP:** Relaxes norm conservation, allowing smoother pseudo-wavefunctions. Missing charge is
  compensated by **augmentation charges** added to the density. Requires only \\(\sim 25\\)–\\(40\\) Ry.

- **PAW:** Formally equivalent to an all-electron calculation via a linear transformation
  \\(\hat{\mathcal{T}}\\) that maps smooth pseudo-wavefunctions onto full oscillatory all-electron
  wavefunctions inside augmentation spheres. Provides access to the full all-electron density.
  \\(E_{\rm cut} \sim 400\\)–\\(600\\) eV for GGA+PAW. Default in VASP.
</div>

**Q5.3 [S]** A student runs a calculation doubling the plane-wave cutoff but finds no change in
the total energy. What does this confirm, and what should be checked next?

<div class="remark">
**Answer Hint.** It confirms that the total energy is converged with respect to \\(E_{\rm cut}\\) —
the basis is complete enough for this property. Next convergence checks: (1) \\(k\\)-point mesh
density (especially for metals); (2) supercell size if periodic images of a defect or molecule
are a concern; (3) SCF convergence threshold to ensure the self-consistency loop has actually
converged; (4) force convergence for structural relaxation.
</div>

**Q5.4 [S]** What is basis set superposition error (BSSE), and in which type of basis does it
arise? How can it be corrected?

<div class="remark">
**Answer Hint.** BSSE arises in **atom-centred (localised) basis sets**: when two atoms approach,
each atom borrows basis functions from the other's basis, artificially lowering the total energy
and overestimating the binding. It does *not* occur in plane-wave bases because the basis is not
atom-centred. Correction: the **Boys–Bernardi counterpoise correction** — compute the energy of
each fragment using the full dimer basis and subtract the fragment-only energies.
</div>

---

### Chapter 6 — Spin-Polarised DFT

**Q6.1 [S]** Why must the electron density be spin-resolved \\(\rho_\uparrow(\mathbf{r}), \rho_\downarrow(\mathbf{r})\\) for magnetic systems? What goes wrong if spin polarisation is neglected for, say, iron?

<div class="remark">
**Answer Hint.** In a magnetic system, spin-up and spin-down electrons experience different
effective potentials due to exchange splitting. A spin-unpolarised calculation forces
\\(\rho_\uparrow = \rho_\downarrow\\) at every point, preventing the system from lowering its energy
by spin polarisation — it constraints the variational search to a subspace that excludes the
magnetic ground state. For bcc Fe, the spin-unpolarised calculation gives the wrong crystal
structure (predicts fcc, because GGA without magnetism favours the more closely-packed fcc
minimum) and zero magnetic moment; spin-polarised LDA/GGA correctly gives bcc
with \\(\sim 2.2\,\mu_B\\) per atom and the correct cohesive energy.
</div>

**Q6.2 [S]** Define the spin magnetisation density \\(m(\mathbf{r})\\) and the local spin density
approximation (LSDA). How does LSDA reduce to LDA in the non-magnetic limit?

<div class="remark">
**Answer Hint.** \\(m(\mathbf{r}) = \rho_\uparrow(\mathbf{r}) - \rho_\downarrow(\mathbf{r})\\).
LSDA:

\\[
E_{\rm xc}^{\rm LSDA}[\rho_\uparrow,\rho_\downarrow] = \int \varepsilon_{\rm xc}^{\rm UEG}(\rho_\uparrow(\mathbf{r}),\rho_\downarrow(\mathbf{r}))\,\rho(\mathbf{r})\, d\mathbf{r},
\\]

where \\(\varepsilon_{\rm xc}^{\rm UEG}(\rho_\uparrow, \rho_\downarrow)\\) is the XC energy per particle of
the *spin-polarised* UEG, parameterised from quantum Monte Carlo (Ceperley–Alder). The
spin-polarisation enters through the relative spin polarisation \\(\zeta = (\rho_\uparrow - \rho_\downarrow)/\rho\\),
which interpolates between the unpolarised (\\(\zeta=0\\)) and fully polarised (\\(\zeta=1\\)) limits
via a spin-scaling relation due to von Barth and Hedin. When \\(\rho_\uparrow = \rho_\downarrow = \rho/2\\)
(non-magnetic limit), \\(\zeta = 0\\) and \\(\varepsilon_{\rm xc}^{\rm UEG}\\) reduces to the unpolarised
UEG value — recovering LDA exactly.
</div>

**Q6.3 [M]** Derive the spin-dependent Kohn–Sham equations for collinear spin-polarised DFT.
Show explicitly that the exchange splitting of eigenvalues arises from \\(V_{\rm xc}^\uparrow \neq V_{\rm xc}^\downarrow\\), and write down what \\(V_{\rm xc}^\sigma\\) is in LSDA.

<div class="remark">
**Answer Hint.**

*Starting point:* In collinear SDFT, the total energy is a functional of both spin densities:

\\[
E[\rho_\uparrow,\rho_\downarrow] = T_s[\rho_\uparrow,\rho_\downarrow] + E_{\rm H}[\rho] + E_{\rm xc}[\rho_\uparrow,\rho_\downarrow] + \int V_{\rm ext}(\mathbf{r})\,\rho(\mathbf{r})\,d\mathbf{r}.
\\]

*Variational minimisation with respect to \\(\phi_{i\sigma}^*\\)* (subject to orthonormality in each
spin channel) gives two independent sets of KS equations — one per spin channel \\(\sigma \in \{\uparrow,\downarrow\}\\):

\\[
\left[-\frac{1}{2}\nabla^2 + V_{\rm eff}^\sigma(\mathbf{r})\right]\phi_{i\sigma}(\mathbf{r}) = \epsilon_{i\sigma}\,\phi_{i\sigma}(\mathbf{r}),
\\]

with the spin-dependent effective potential

\\[
V_{\rm eff}^\sigma = V_{\rm ext} + V_{\rm H}[\rho] + V_{\rm xc}^\sigma[\rho_\uparrow, \rho_\downarrow],
\\]

where \\(V_{\rm H}\\) depends only on the total density \\(\rho = \rho_\uparrow + \rho_\downarrow\\) (same
for both spins), and

\\[
V_{\rm xc}^\sigma(\mathbf{r}) = \frac{\delta E_{\rm xc}[\rho_\uparrow, \rho_\downarrow]}{\delta \rho_\sigma(\mathbf{r})}.
\\]

*Exchange splitting:* In LSDA, \\(\varepsilon_{\rm xc}^{\rm UEG}\\) is an asymmetric function of
\\((\rho_\uparrow, \rho_\downarrow)\\) whenever \\(\rho_\uparrow \neq \rho_\downarrow\\). Therefore
\\(\delta E_{\rm xc}/\delta\rho_\uparrow \neq \delta E_{\rm xc}/\delta\rho_\downarrow\\), i.e.,
\\(V_{\rm xc}^\uparrow \neq V_{\rm xc}^\downarrow\\). This spin-asymmetric potential shifts the spin-up
eigenvalues \\(\epsilon_{i\uparrow}\\) relative to spin-down \\(\epsilon_{i\downarrow}\\) — the
**exchange splitting** \\(\Delta_{\rm xc} = V_{\rm xc}^\uparrow - V_{\rm xc}^\downarrow\\).
In LSDA explicitly:

\\[
V_{\rm xc}^{\sigma,\rm LSDA}(\mathbf{r}) = \varepsilon_{\rm xc}^{\rm UEG}(\rho_\uparrow,\rho_\downarrow) + \rho\,\frac{\partial \varepsilon_{\rm xc}^{\rm UEG}}{\partial \rho_\sigma}\bigg|_{\mathbf{r}}.
\\]

The two equations are coupled only through the shared \\(V_{\rm H}[\rho]\\) and the LSDA XC
potential — they are solved self-consistently together within the same SCF loop.
</div>

---

### Chapter 7 — DFT+U

**Q7.1 [M]** Explain the self-interaction error in the context of strongly correlated systems.
Why does standard GGA predict NiO to be a metal rather than a Mott insulator?

<div class="remark">
**Answer Hint.** In NiO, the Ni \\(3d\\) states are narrow and strongly localised. Standard GGA
treats the on-site Coulomb repulsion \\(U\\) among \\(d\\) electrons at the mean-field level,
which underestimates the Mott gap. Because the self-interaction error in GGA artificially
delocalises the \\(d\\) electrons, the predicted density of states shows \\(d\\) bands straddling the
Fermi level — i.e., metallic behaviour — even though experiment shows a gap of \\(\sim 4\\) eV.
The DFT+U correction adds an explicit penalty for fractional occupation of the \\(d\\) subspace,
driving the occupations toward integer values and opening the gap.
</div>

**Q7.2 [S]** Write the Dudarev DFT+U energy correction and explain the role of the occupation
matrix \\(\mathbf{n}^{I\sigma}\\). What does the term \\(\mathrm{Tr}[\mathbf{n}(1-\mathbf{n})]\\) penalise?

<div class="remark">
**Answer Hint.**

\\[
E_U^{\rm Dur} = \frac{U_{\rm eff}}{2}\sum_{I,\sigma}\mathrm{Tr}\!\left[\mathbf{n}^{I\sigma}(\mathbf{1}-\mathbf{n}^{I\sigma})\right],
\\]

where \\((n^{I\sigma})_{mm'} = \sum_i f_i \langle\phi_i|\tilde{p}_m^I\rangle\langle\tilde{p}_{m'}^I|\phi_i\rangle\\) is the
occupation of the correlated \\(d\\) (or \\(f\\)) subspace on atom \\(I\\). The trace
\\(\mathrm{Tr}[\mathbf{n}(1-\mathbf{n})]\\) is zero when all eigenvalues of \\(\mathbf{n}\\) are 0 or 1
(integer occupations) and positive otherwise — so the correction penalises fractional occupations,
driving localisation. Only one parameter \\(U_{\rm eff} = U - J\\) is needed, making this
formulation simpler than the Liechtenstein approach.
</div>

**Q7.3 [S]** What is the double-counting correction in DFT+U, and why is it necessary? Name the
two most common schemes.

<div class="remark">
**Answer Hint.** The standard GGA already partially includes Coulomb interactions among the
correlated electrons through \\(E_{\rm H}\\) and \\(E_{\rm xc}\\). Adding \\(E_U\\) directly would count
these interactions twice. The double-counting correction \\(E_{\rm dc}\\) is subtracted to avoid this.
Two common schemes: (1) **Fully localised limit (FLL)**, appropriate for strongly correlated
insulators; (2) **Around mean-field (AMF)**, appropriate for weakly correlated metals.
Unfortunately, the exact form of \\(E_{\rm dc}\\) is not known; this ambiguity is a fundamental
limitation of DFT+U.
</div>

---

## Part II: Numerical Implementation

---

### Chapter 8 — SCF Convergence and Density Mixing

**Q8.1 [S]** What is charge sloshing in a metallic DFT calculation? Identify the physical origin
of the instability and state which mixing scheme was designed to suppress it.

<div class="remark">
<strong>Answer Hint.</strong> In metals, a small perturbation of the density at long wavelength (small
\\(\mathbf{G}\\)) produces a large response (diverging dielectric screening as \\(G \to 0\\)). Simple
linear mixing \\(\rho^{\rm in}\_{n+1} = \rho^{\rm in}\_n + \alpha(\rho^{\rm out}\_n - \rho^{\rm in}\_n)\\)
amplifies these long-wavelength modes: the correction at small \\(G\\) is too large, causing the
density to oscillate between iterations. **Kerker preconditioning** suppresses this by
multiplying the residual by \\(G^2/(G^2 + k\_0^2)\\), damping corrections at \\(G \lt k\_0\\), where
\\(k_0\\) is the Thomas–Fermi screening wavevector.
</div>

**Q8.2 [M]** Describe the Pulay (DIIS) mixing scheme. What quantity is minimised, and how does
it use information from previous iterations?

<div class="remark">
**Answer Hint.** DIIS (Direct Inversion in the Iterative Subspace) stores the last \\(m\\) input
densities \\(\{\rho_n^{\rm in}\}\\) and residuals \\(\{R_n = \rho_n^{\rm out} - \rho_n^{\rm in}\}\\).
The next input is a linear combination

\\[
\rho^{\rm in}_{n+1} = \sum_{i=1}^m \alpha_i \rho_i^{\rm in}
\\]

where the coefficients \\(\{\alpha_i\}\\) minimise \\(\|\sum_i \alpha_i R_i\|^2\\) subject to
\\(\sum_i \alpha_i = 1\\). This is solved by a small linear system. The method is quasi-Newton: it
builds a model of the Jacobian of the residual from the stored history, achieving superlinear
convergence near the fixed point, compared to linear convergence for simple mixing.
</div>

**Q8.3 [S]** A VASP calculation for a metallic slab fails to converge after 200 iterations with
`AMIX = 0.4`. Suggest three modifications to the INCAR and explain the physical reasoning for
each.

<div class="remark">
**Answer Hint.** (1) **Reduce `AMIX`** (e.g. to 0.02–0.1): smaller mixing step damps the
sloshing, at the cost of slower convergence per iteration. (2) **Set `BMIX = 1.0`–`3.0`**:
enables Kerker preconditioning, directly targeting the long-wavelength instability in the metal.
(3) **Increase `MAXMIX`** (e.g. to 40–60): gives Broyden/DIIS a larger history to build a
better Jacobian model, which is important for slabs that have many degrees of freedom in the
charge distribution. Optionally: switch to `ALGO = All` to use subspace rotation.
</div>

---

### Chapter 9 — Brillouin Zone Integration and Smearing

**Q9.1 [S]** Why do metals require special treatment in Brillouin zone integration? Write the
BZ integral for the electron density and explain the origin of the numerical difficulty.

<div class="remark">
**Answer Hint.** Physical observables involve integrals of the form

\\[
\langle A \rangle = \frac{\Omega}{(2\pi)^3}\sum_n \int_{\rm BZ} A_{n\mathbf{k}}\, f_{n\mathbf{k}}\, d\mathbf{k},
\\]

where \\(f_{n\mathbf{k}} = \theta(\mu - \epsilon_{n\mathbf{k}})\\) is the Fermi–Dirac occupation at
\\(T=0\\). The Heaviside function is discontinuous at the Fermi surface. On a discrete \\(k\\)-mesh,
the Fermi surface may pass between grid points, causing the integral to oscillate wildly with
mesh density. This is why insulators converge far faster than metals: there is no Fermi surface
discontinuity.
</div>

**Q9.2 [M]** Compare Gaussian smearing, Methfessel–Paxton smearing, and the linear tetrahedron
method. For which systems and properties is each recommended?

<div class="remark">
**Answer Hint.**

- **Gaussian:** Replaces \\(\theta(\mu-\epsilon)\\) by a Gaussian broadened step. Simple but
  introduces a \\(\sigma\\)-dependent error in the free energy; the \\(\sigma \to 0\\) extrapolation
  can be unreliable. Use: only for quick tests.

- **Methfessel–Paxton (MP):** Expands the step function in a Hermite polynomial series; the
  \\(N=1\\) variant gives a broadened occupation with negative oscillations that cancel the smearing
  error to higher order. The \\(\sigma\to 0\\) energy extrapolation is \\(E(\sigma) = E_0 + \mathcal{O}(\sigma^{2N+2})\\). Use: **structural relaxations and total energies of metals** with moderate \\(\sigma \sim 0.1\\)–\\(0.2\\) eV.

- **Tetrahedron method** (`ISMEAR = -5` in VASP): Linear interpolation of band energies between
  \\(k\\)-points within each tetrahedron. Exact integration in the limit of a fine mesh; no \\(\sigma\\)
  parameter. Use: **DOS, optical spectra, and properties requiring high accuracy in the Fermi
  surface topology**. Do *not* use for structural relaxations (forces are not analytic).
</div>

---

### Chapter 10 — Eigenvalue Solvers

**Q10.1 [S]** Why is the full diagonalisation of the KS Hamiltonian impractical for large
systems? What is the computational scaling of full diagonalisation, and how do iterative methods
improve on this?

<div class="remark">
**Answer Hint.** The KS Hamiltonian has dimension \\(N_{\rm PW} \times N_{\rm PW}\\), where
\\(N_{\rm PW}\\) grows with the system size and \\(E_{\rm cut}\\). Full diagonalisation (e.g., LAPACK)
scales as \\(\mathcal{O}(N_{\rm PW}^3)\\), which becomes prohibitive for \\(N_{\rm PW} \sim 10^5\\)–\\(10^6\\).
Iterative methods (Davidson, RMM-DIIS) exploit the fact that only the \\(N_{\rm occ} \ll N_{\rm PW}\\)
lowest eigenpairs are needed. They build a small Krylov/Rayleigh–Ritz subspace, diagonalise
within it, and refine — achieving \\(\mathcal{O}(N_{\rm PW} \times N_{\rm occ})\\) per iteration.
</div>

**Q10.2 [M]** Describe the Davidson diagonalisation algorithm. What is the subspace expansion
step, and how does it avoid recomputing the full Hamiltonian?

<div class="remark">
**Answer Hint.** Starting from a trial subspace \\(\{|\psi_i\rangle\}\\): (1) Compute the Rayleigh
quotient \\(\epsilon_i = \langle\psi_i|\hat{H}|\psi_i\rangle/\langle\psi_i|\psi_i\rangle\\) — only
matrix-vector products \\(\hat{H}|\psi_i\rangle\\) are needed, not matrix elements. In a plane-wave
code this is done via FFT in \\(\mathcal{O}(N_{\rm PW}\log N_{\rm PW})\\). (2) Compute residuals
\\(|r_i\rangle = (\hat{H} - \epsilon_i)|\psi_i\rangle\\). (3) Apply a **preconditioner**
\\(\hat{D}^{-1}\\) (diagonal in \\(\mathbf{G}\\)-space: \\(D_{\mathbf{G}} = |\mathbf{k}+\mathbf{G}|^2/2 + \epsilon_0\\)) to obtain search directions that are steepest-descent steps in kinetic-energy-weighted
distance. (4) Orthogonalise and add to the subspace; diagonalise the small projected Hamiltonian;
iterate. Convergence is quadratic near the solution.
</div>

---

## Cross-Cutting Conceptual Questions

**Q11.1 [M]** A colleague applies DFT+GGA to a cobalt oxide (CoO) surface and reports a magnetic
moment of 0 \\(\mu_B\\) per Co, which contradicts experiment. Walk through the chain of possible
failures, from theory choice to numerical implementation.

<div class="remark">
**Answer Hint.** Work from first principles outward: (1) *Spin polarisation:* Is
`ISPIN = 2` set? A spin-unpolarised calculation cannot produce a magnetic moment by construction.
(2) *Initial magnetic moments:* Were reasonable initial moments provided (e.g., `MAGMOM`)?
DFT can converge to a local minimum (non-magnetic) if started too close to zero. (3) *GGA
self-interaction error:* For Co \\(3d\\) states, GGA may underestimate localisation. Try DFT+U
with reasonable \\(U_{\rm eff} \sim 3\\)–\\(5\\) eV for Co. (4) *k\\)-mesh:* A coarse mesh for a metallic
oxide surface may smear out the magnetic splitting. (5) *Surface vs. bulk:* Surface CoO may have
quenched moments; compare to bulk CoO first.
</div>

**Q11.2 [S]** Rank the following functionals in increasing computational cost for a periodic
solid with 100 atoms: LDA, PBE, SCAN, PBE0, HSE06. Briefly justify each step.

<div class="remark">
**Answer Hint.**

LDA \\(<\\) PBE \\(\approx\\) SCAN \\(<\\) HSE06 \\(<\\) PBE0.

- LDA and PBE are semi-local: same cost, \\(\mathcal{O}(N^3)\\) dominated by diagonalisation.
- SCAN is meta-GGA; needs \\(\tau(\mathbf{r})\\), slightly more expensive but same scaling.
- HSE06 includes short-range exact exchange only: the Fock operator is localised in real space
  (exponential decay), so its evaluation scales \\(\sim\mathcal{O}(N)\\) for large systems and is
  tractable for 100-atom cells.
- PBE0 includes long-range exact exchange: the Fock operator is non-local, requiring 4-index
  integrals over all reciprocal space. Scales \\(\mathcal{O}(N^3)\\) with a large prefactor,
  impractical for 100-atom periodic cells.
</div>

**Q11.3 [L]** A student is computing the vacancy formation energy in rutile TiO\\(_2\\) using VASP.
List *all* the numerical convergence parameters that must be checked, the order in which to
check them, and a physically motivated reason for each.

<div class="remark">
**Answer Hint.** In order:

1. **\\(E_{\rm cut}\\):** Plane-wave basis completeness. For TiO\\(_2\\) with PAW, converge to
   \\(\sim 1\\) meV/atom; typical value \\(\sim 500\\)–\\(600\\) eV.
2. **\\(k\\)-mesh (bulk and supercell):** BZ sampling. Use a \\(\Gamma\\)-centred mesh; the supercell mesh
   is coarser than bulk but must be tested independently.
3. **Supercell size:** Vacancy–vacancy interaction through periodic images. Converge the formation
   energy with cell size (\\(2\times2\times2\\), \\(3\times3\times2\\), etc.); electrostatic correction
   schemes (Freysoldt–Neugebauer–Van de Walle) may be needed for charged vacancies.
4. **SCF convergence (`EDIFF`):** Set to \\(10^{-6}\\)–\\(10^{-7}\\) eV for energy differences; forces
   need \\(10^{-7}\\) eV or tighter.
5. **Ionic relaxation (`EDIFFG`):** Forces below \\(0.01\\)–\\(0.02\\) eV/Å; the vacancy geometry
   relaxes significantly.
6. **Smearing and \\(\sigma\\):** TiO\\(_2\\) is a semiconductor; use `ISMEAR = 0` (Gaussian) or
   `ISMEAR = -5` (tetrahedron). Check that `EENTRO` \\(< 1\\) meV/atom.
7. **Spin polarisation:** Ti \\(3d^0\\) nominally; but oxygen vacancies can create \\(d^1\\) Ti, which
   is magnetic. Run spin-polarised (`ISPIN = 2`) to be safe.
8. **(Optional) DFT+U:** GGA underestimates the TiO\\(_2\\) band gap (\\(\sim 1.8\\) vs \\(3.0\\) eV
   experimental); a \\(U_{\rm eff}\\) on Ti \\(d\\) states may be needed for reliable defect levels.
</div>

---

## Quick-Reference Formula Sheet

The following identities are cited frequently in examination answers. You should be able to
derive each from first principles.

| Quantity | Expression |
|---|---|
| Electron density from KS orbitals | \\(\rho(\mathbf{r}) = \sum_i f_i \|\phi_i(\mathbf{r})\|^2\\) |
| KS effective potential | \\(V_{\rm eff} = V_{\rm ext} + V_{\rm H} + V_{\rm xc}\\) |
| Spin-dependent \\(V_{\rm eff}\\) | \\(V_{\rm eff}^\sigma = V_{\rm ext} + V_{\rm H}[\rho] + V_{\rm xc}^\sigma[\rho_\uparrow,\rho_\downarrow]\\) |
| Hartree potential | \\(V_{\rm H}(\mathbf{r}) = \int \rho(\mathbf{r}')/|\mathbf{r}-\mathbf{r}'|\, d\mathbf{r}'\\) |
| XC potential | \\(V_{\rm xc}(\mathbf{r}) = \delta E_{\rm xc}[\rho]/\delta\rho(\mathbf{r})\\) |
| Variational He trial energy | \\(E(\alpha) = \alpha^2 - (2Z - 5/8)\alpha\\), minimum at \\(\alpha_{\rm opt} = Z - 5/16\\) |
| LDA exchange (Dirac) | \\(\varepsilon_{\rm x}^{\rm UEG} = -(3/4)(3/\pi)^{1/3}\rho^{1/3}\\) |
| XC hole sum rule | \\(\int n_{\rm xc}(\mathbf{r},\mathbf{r}')\, d\mathbf{r}' = -1\\) |
| Dudarev DFT+U correction | \\(E_U = \frac{U_{\rm eff}}{2}\sum_{I,\sigma}\mathrm{Tr}[\mathbf{n}^{I\sigma}(\mathbf{1}-\mathbf{n}^{I\sigma})]\\) |
| Plane-wave cutoff condition | \\(\frac{1}{2}|\mathbf{k}+\mathbf{G}|^2 \leq E_{\rm cut}\\) |
| Kerker preconditioner | \\(G^2/(G^2 + k_0^2)\\) |
| PAW density | \\(\rho = \tilde{\rho} + \rho^1 - \tilde{\rho}^1\\) |
