# Appendix D: Further Reading & References

---

## D.1 Textbooks

### Monte Carlo Methods (General)
- **Newman, M. E. J. & Barkema, G. T.** — *Monte Carlo Methods in Statistical Physics* (Oxford, 1999). The standard graduate text. Covers Ising, Potts, cluster algorithms, and finite-size scaling in depth.
- **Frenkel, D. & Smit, B.** — *Understanding Molecular Simulation* (Academic Press, 3rd ed. 2023). The reference for MC and MD in chemical physics. Comprehensive treatment of free energy methods.
- **Landau, D. P. & Binder, K.** — *A Guide to Monte Carlo Simulations in Statistical Physics* (Cambridge, 4th ed. 2014). Encyclopaedic coverage of algorithms and applications.
- **Krauth, W.** — *Statistical Mechanics: Algorithms and Computations* (Oxford, 2006). Elegant and rigorous; excellent on cluster algorithms and MCMC theory.

### Probability and Statistics
- **Gelman, A. et al.** — *Bayesian Data Analysis* (CRC Press, 3rd ed. 2013). Standard reference for Bayesian inference and MCMC.
- **Robert, C. P. & Casella, G.** — *Monte Carlo Statistical Methods* (Springer, 2nd ed. 2004). Mathematically rigorous treatment of MCMC convergence.

### Kinetic Monte Carlo
- **Voter, A. F.** — "Introduction to the Kinetic Monte Carlo Method", in *Radiation Effects in Solids* (Springer, 2007). The clearest introductory review.
- **Reuter, K.** — "First-Principles Kinetic Monte Carlo Simulations for Heterogeneous Catalysis", in *Modelling and Simulation of Heterogeneous Catalytic Reactions* (Wiley-VCH, 2011).

---

## D.2 Key Papers

### Algorithms
- **Metropolis, N. et al.** — "Equation of State Calculations by Fast Computing Machines", *J. Chem. Phys.* **21**, 1087 (1953). The original Metropolis paper. 
- **Hastings, W. K.** — "Monte Carlo Sampling Methods Using Markov Chains and Their Applications", *Biometrika* **57**, 97 (1970).
- **Swendsen, R. H. & Wang, J.-S.** — "Nonuniversal Critical Dynamics in Monte Carlo Simulations", *Phys. Rev. Lett.* **58**, 86 (1987). Cluster algorithm.
- **Wolff, U.** — "Collective Monte Carlo Updating for Spin Systems", *Phys. Rev. Lett.* **62**, 361 (1989).
- **Wang, F. & Landau, D. P.** — "Efficient, Multiple-Range Random Walk Algorithm to Calculate the Density of States", *Phys. Rev. Lett.* **86**, 2050 (2001).
- **Geyer, C. J.** — "Markov Chain Monte Carlo Maximum Likelihood", *Proc. 23rd Symp. Interface* (1991). Parallel tempering.
- **Bortz, A. B., Kalos, M. H. & Lebowitz, J. L.** — "A New Algorithm for Monte Carlo Simulation of Ising Spin Systems", *J. Comput. Phys.* **17**, 10 (1975). The BKL algorithm.
- **Gillespie, D. T.** — "Exact Stochastic Simulation of Coupled Chemical Reactions", *J. Phys. Chem.* **81**, 2340 (1977).

### Exact Results
- **Onsager, L.** — "Crystal Statistics. I. A Two-Dimensional Model with an Order-Disorder Transition", *Phys. Rev.* **65**, 117 (1944).
- **Kosterlitz, J. M. & Thouless, D. J.** — "Ordering, Metastability and Phase Transitions in Two-Dimensional Systems", *J. Phys. C* **6**, 1181 (1973).
- **Mermin, N. D. & Wagner, H.** — "Absence of Ferromagnetism or Antiferromagnetism in One- or Two-Dimensional Isotropic Heisenberg Models", *Phys. Rev. Lett.* **17**, 1133 (1966).

### Applications
- **Kirkpatrick, S., Gelatt, C. D. & Vecchi, M. P.** — "Optimization by Simulated Annealing", *Science* **220**, 671 (1983).
- **Reuter, K. & Scheffler, M.** — "Composition, Structure, and Stability of RuO₂(110) as a Function of Oxygen Pressure", *Phys. Rev. B* **65**, 035406 (2001). First-principles KMC.
- **Castelnovo, C., Moessner, R. & Sondhi, S. L.** — "Magnetic Monopoles in Spin Ice", *Nature* **451**, 42 (2008).

---

## D.3 Review Articles

- **Binder, K.** — "Monte Carlo Simulations in Statistical Physics", *Am. J. Phys.* **80**, 1099 (2012). Excellent overview for physicists.
- **Betancourt, M.** — "A Conceptual Introduction to Hamiltonian Monte Carlo", *arXiv:1701.02434* (2017). Best pedagogical treatment of HMC.
- **Voter, A. F.** — "Hyperdynamics: Accelerated Molecular Dynamics of Infrequent Events", *Phys. Rev. Lett.* **78**, 3908 (1997). Foundation of accelerated dynamics methods.
- **Rohwedder, T. & Schneider, R.** — "Error Estimates for the Coupled Cluster Method", *ESAIM* (2013). For context on quantum chemistry methods.

---

## D.4 Software Packages

| Package | Purpose | Language |
|---------|---------|----------|
| **LAMMPS** | Molecular dynamics + MC | C++ |
| **GROMACS** | MD with free energy | C++/CUDA |
| **HOOMD-blue** | GPU MC/MD | Python/C++ |
| **PyMC** | Bayesian MCMC | Python |
| **emcee** | Affine-invariant MCMC | Python |
| **MCNP6** | Neutron/photon transport | Fortran |
| **Geant4** | Particle detector simulation | C++ |
| **SPPARKS** | KMC for materials | C++ |
| **KMCLib** | Lattice KMC | Python/C++ |
| **ASE** | Atomic simulation environment | Python |
| **vegas** | Adaptive MC integration | Python |
| **scipy.stats.qmc** | Quasi-MC sequences | Python |

---

## D.5 Online Resources

- Computational Physics course notes, Krauth (ENS Paris): `https://www.lps.ens.fr/~krauth/`
- NIST Digital Library of Mathematical Functions: `https://dlmf.nist.gov`
- TestU01 RNG testing library: `https://simul.iro.umontreal.ca/testu01/`
- OpenKIM: verified interatomic potentials for KMC/MD: `https://openkim.org`
- Materials Project: DFT-computed properties for KMC input: `https://materialsproject.org`
