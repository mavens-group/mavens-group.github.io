---
title: Energy Materials by design
summary: Which features of the electronic structure actually decide whether a material solves an energy problem?
show_date: false
profile: false
weight: 1
aliases:
  - /post/HEA/
image:
  placement: 1
  caption: "Energy materials animation"
  focal_point: "Center"
  preview_only: true
---
<!-- {{< video src="output.mp4" controls="no" autoplay="yes" loop="yes" muted="yes" >}} -->
<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;">
  <source src="energy.mp4" type="video/mp4">
</video>

### Scientific Challenge
The energy transition is, at its heart, a materials problem. Catalysts that split water without platinum, magnetocalorics that refrigerate without hydrofluorocarbons, and electrodes that store charge reversibly all depend on placing a material at a narrow operating point in a high-dimensional compositional space. The scientific question is physical: **which features of the electronic structure actually decide whether a material sits at that operating point, and which are incidental?** A catalyst is active when the hydrogen adsorption free energy falls inside a thermoneutral window; a magnetocaloric is useful when its Curie temperature sits near room temperature with a large entropy change. The functional target is macroscopic, but the control variable — Fermi-level position relative to a pseudogap, d-band filling, site-resolved d-band centre — is electronic and atomic.

### Our Approach
We take problems where a clean electronic-structure control parameter exists, so that a trend across composition or site substitution can be read as a causal mechanism rather than a statistical pattern. Studies are designed factorially — hole-doping against electron-doping at the same site, isovalent metal pairs across groups, anion substitution at fixed valence electron count — so that the variable doing the work is isolated by construction.

Disorder is treated as the object of study rather than a numerical inconvenience, and methods are chosen to match the physics: Green's-function coherent potential approximation for substitutional alloys, explicit supercells where short-range order matters, high-throughput screening along controlled compositional axes, and Lichtenstein-formalism exchange extraction where the question is about exchange topology. No single method is a house method; the question decides the tool.

We also take seriously the step from a local descriptor to a collective response. A favourable d-band centre is not a catalyst, and a large local moment is not a magnet. When we report a Curie temperature, we also report the exchange competition parameter that says how much of it survives the cancellation between ferromagnetic and antiferromagnetic pathways.

### Key Insights & Achievements
- In substitutionally disordered B2-ordered FeRh, hole- and electron-doping on the Fe sublattice resolve the chemical-versus-magneto-volume question: Fermi-level position relative to the minority-spin pseudogap dictates whether the Curie temperature collapses (≈450 K suppression under Mn) or holds above 800 K (under Co)
- In Zr-doped Ti₃C₂ and Ti₃CN MXenes, electronic-structure engineering brings the hydrogen adsorption free energy within 0.1 eV of thermoneutrality, establishing a noble-metal-free route to HER catalysis
- In bimetallic Janus MXenes, a factorial screen across metal pairs and anions identifies a group-5 V/Nb combination where site-resolved d-band asymmetry places both carbide and nitride inside the thermoneutral window, and locates the failure mode (exchange splitting in a group-6 analogue) that breaks the descriptor
- In all-d-metal and Zn-based Heusler magnetocalorics, exchange-topology analysis identifies compositional routes to room-temperature operation and unconventional critical behaviour

Collectively, these results establish that macroscopic function in energy-relevant itinerant systems can be traced to a small number of electronic-structure control parameters, and that identifying those parameters cleanly is what makes compositional design predictive rather than exploratory.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
