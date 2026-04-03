---
_build:
  render: always
  list: always
cascade:
  _build:
    render: always
    list: always
title: Density Functional Theory Course
linkTitle: Density Functional Theory
date: 2024-07-26
summary: Complete course on Density Functional Theory (DFT). Explore Hohenberg-Kohn theorems, Kohn-Sham equations, and practical electronic-structure calculations.
image:
  focal_point: 'top'
type: book
---

{{< figure src="featured.jpg" >}}

{{< toc hide_on="xl" >}}

Density Functional Theory (DFT) is one of the most powerful theoretical frameworks for studying the **electronic structure of atoms, molecules, and solids**. It is widely used in condensed matter physics, quantum chemistry, and materials science to predict structural, electronic, magnetic, and optical properties of materials.

## Course Curriculum

This course bridges the gap between rigorous quantum mechanical theory and state-of-the-art computational materials science, moving from fundamental equations to real-world software applications.

### Part I: Theoretical Foundations of DFT
Starting from the **quantum many-body problem**, we detail the exact mathematical proofs behind the **Hohenberg–Kohn theorems** and the derivation of the effective single-particle **Kohn–Sham equations**. With the exact theory established, you will systematically unpack the approximations required for real-world materials. This includes navigating the hierarchy of **exchange-correlation functionals** (from LDA to hybrids), constructing exact **basis sets and pseudopotentials** (such as PAW methods), and treating magnetic ordering via **Spin-Polarised DFT**. Finally, we address the self-interaction error in strongly correlated $d$ and $f$ electron systems using the **DFT+U (Hubbard)** method.

### Part II: Numerical Implementations & Practical DFT
Theoretical knowledge is only half the battle. The second half of the course opens the black box of industry-standard DFT codes like **VASP** and **Quantum ESPRESSO**. You will learn how to translate continuous mathematics into robust iterative algorithms by mastering **Self-Consistent Field (SCF) Convergence**—including how to diagnose charge sloshing in metals and apply advanced density mixing schemes (Pulay/DIIS, Broyden). We also cover rigorous **Brillouin Zone Integration**, detailing $k$-point sampling and the specific smearing methods (Methfessel-Paxton, tetrahedron) required to stabilise metallic Fermi surfaces.

By the end of this course, you will possess the practical expertise to run, troubleshoot, and analyze high-accuracy simulations for contemporary materials science research.

---

## Meet your instructor

{{< mention "rudra" >}}

<br>
<br>

{{< spoiler text="Prerequisites" >}}
Participants should be familiar with:
- Basic **Quantum Mechanics**
- **Thermodynamics and Statistical Mechanics**
- **Solid State Physics**
- Elementary **linear algebra and differential equations**
{{< /spoiler >}}

{{< spoiler text="Course Objectives" >}}
By the end of this course, participants will:
- Understand the theoretical foundations of **Density Functional Theory**
- Learn the derivation and significance of the **Hohenberg–Kohn theorems**
- Understand the **Kohn–Sham formalism** and its practical implementation
- Become familiar with common **exchange–correlation functionals**
- Learn how to perform and analyze **DFT calculations**
- Explore advanced extensions such as **DFT+U and time-dependent DFT**
{{< /spoiler >}}

{{< spoiler text="Target Audience" >}}
This course is designed for:
- Graduate students in **Physics, Chemistry, and Materials Science**
- Researchers entering the field of **computational materials science**
- Students interested in **electronic structure theory**
{{< /spoiler >}}

{{< cta cta_text="Begin the course" cta_link="01-foundations/02-basics/" >}}
