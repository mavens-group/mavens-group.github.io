# Monte Carlo Methods for Physicists

**MSc Physics — Graduate Course**

---

## About This Course

This course introduces Monte Carlo (MC) methods from first principles, developing both theoretical understanding and practical computational skill. The methods covered are among the most broadly applicable in all of physics and physical chemistry: they are used to study phase transitions in magnetic materials, compute free energies of proteins, simulate particle detector responses, model surface catalysis, and sample posterior distributions in data analysis.

The course assumes familiarity with thermodynamics, statistical mechanics at the undergraduate level, and basic programming in Python. No prior knowledge of stochastic methods is required.

---

## Course Structure

The 15 classes are organised into 9 chapters:

| Chapter | Topic | Classes |
|---------|-------|---------|
| 1 | Foundations of Probability & Randomness | 1–2 |
| 2 | Sampling Methods | 3–4 |
| 3 | Monte Carlo Integration | 5–6 |
| 4 | Markov Chain Monte Carlo (MCMC) | 7–8 |
| 5 | The Ising Model & Statistical Mechanics | 9–10 |
| 6 | The Heisenberg Model & Classical Spin Systems | 11 |
| 7 | Advanced MCMC & Free Energy Methods | 12 |
| 8 | Kinetic Monte Carlo | 13–14 |
| 9 | Applications, Error Analysis & Special Topics | 15 |

---

## How to Use These Notes

> [!NOTE]
> Admonish boxes appear throughout to highlight important results, warn of common pitfalls, and flag computational exercises. Equations are typeset in LaTeX; all displayed equations are numbered within each chapter.

> [!TIP]
> **Computational Labs**
> Each chapter contains one or more computational labs. These are hands-on Python exercises designed to run in under 30 minutes on a modern laptop. Skeleton code is provided in Appendix A.

> [!WARNING]
> Monte Carlo methods are probabilistic. Always check convergence, always quote statistical errors, and always seed your random number generator for reproducibility during development.

---

## Notation

| Symbol | Meaning |
|--------|---------|
| \\(\langle A \rangle\\) | Thermal (ensemble) average of observable \\(A\\) |
| \\(\beta\\) | Inverse temperature \\(1/k_B T\\) |
| \\(Z\\) | Partition function |
| \\(N\\) | Number of MC steps or particles (context-dependent) |
| \\(\sigma^2\\) | Variance |
| \\(\mathcal{U}[0,1]\\) | Uniform distribution on \\([0,1]\\) |
| \\(p(\mathbf{x})\\) | Probability density function of \\(\mathbf{x}\\) |

Throughout, \\(k_B = 1\\) (natural units) unless stated otherwise.
