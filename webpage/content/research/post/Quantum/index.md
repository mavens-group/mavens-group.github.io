---
# Research/post/quantum
title: Quantum Materials by Design
summary: When does local electronic structure decide a material's function, and when does something larger take over?
show_date: false
profile: false
weight: 2
aliases:
  - /post/2d/
image:
  placement: 1
  caption: "Quantum materials animation"
  focal_point: "Center"
  preview_only: true
---
<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;">
  <source src="quantum.mp4" type="video/mp4">
</video>

### Scientific Challenge
Spintronic and quantum-information technologies place unusually unforgiving demands on materials. A half-metal is useful only if its spin polarization is complete and its conduction band is connected across the sample; a spin-gapless semiconductor is useful only if its gap and exchange splitting survive the disorder synthesis introduces; a defect-based qubit is useful only if its local environment is both well-defined and thermodynamically stable. The question that organizes our work here is hard: **given that we can form a local magnetic moment, a defect state, or a site-selective electronic environment, what decides whether that local feature survives into a macroscopic spin-dependent response?** A perfectly good local moment can produce a paramagnetic insulator; large site-resolved exchanges can fail to order usefully. The gap between local electronic structure and collective behaviour is where the interesting physics of these systems actually lives.

### Our Approach
We choose systems where broken symmetry—a vacancy, a Janus stacking, a substitutional site, an interfacial dipole—introduces a controlled electronic-structure change we can track from local to collective. The attraction of such systems is that the symmetry breaking is specific enough to isolate one variable at a time, so the design of a study becomes the act of choosing which symmetry to break and which to preserve.

A central commitment is that **a local descriptor is necessary but rarely sufficient**. A bound magnetic polaron, a flat impurity band, a large local moment—none is a prediction of collective function on its own. The passage from local to collective is mediated by something additional: geometric connectivity in a defect network, exchange topology in a disordered alloy, interfacial coupling at a hybrid junction. Taking that second layer seriously often means reaching beyond DFT—to tight-binding models at lattice sizes that expose percolation scaling, to Lichtenstein exchange followed by statistical-mechanical mapping, to coherent potential approximation for random substitution.

### Key Insights & Achievements
- **Connectivity gates itinerant transport.** In vacancy-doped monolayer dichalcogenides, crystal-field splitting produces robust local moments at every defect, but itinerant half-metallic ferromagnetism emerges only when the defect network percolates—a transition that falls in the two-dimensional percolation universality class and is invisible to local-descriptor analyses.
- **Exchange topology shapes finite-temperature order.** In disordered Heusler alloys, site-resolved Lichtenstein exchange extraction shows how dopant choice redistributes ferromagnetic and antiferromagnetic pathways, identifying compositional routes that preserve a useful spin-polarized channel and routes that destroy it through exchange competition.
- **Off-stoichiometry as a Curie-temperature handle.** Targeted substitution in Heusler systems engineers transition temperatures by reorganizing the dominant exchange pathways through the 3d–4d sublattice, rather than by changing the magnitude of any individual moment.
- **Layered platforms for two-dimensional magnetism.** In van der Waals magnetic semiconductors, the interplay of weak interlayer coupling and d-electron exchange provides a controlled setting in which the route from local moment to monolayer order can be tracked directly.

These results support a single claim: in quantum and spintronic materials, useful macroscopic function is a statement about connectivity and exchange topology as much as about local electronic structure, and the route to rational design runs through that second layer. These principles inform synthesis routes for spintronic devices and quantum platforms.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
