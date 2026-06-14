---
# research/post/magnetism
title: Disorder and Magnetism
summary: How does chemical disorder decide whether a magnet orders, at what temperature, and how usefully?
show_date: false
profile: false
weight: 1
aliases:
  - /post/HEA/
  - /research/post/energy/
image:
  placement: 1
  caption: "Disordered magnetism animation"
  focal_point: "Center"
  preview_only: true
---
<video autoplay loop muted playsinline style="width: 100%; border-radius: 8px;">
  <source src="magnetism.mp4" type="video/mp4">
</video>

### Scientific Challenge
Magnetism in real alloys is a finite-temperature, disordered phenomenon, but most predictive intuition is built on ordered crystals at zero temperature. When atoms are mixed or substituted, the magnetism can survive, shift, or collapse — and which of these happens is rarely visible in any single local quantity. A large local moment does not guarantee a magnet; a favourable exchange constant does not guarantee useful order. The question that organises our work here is physical: **given the electronic structure of a disordered magnetic alloy, what decides whether it orders, at what temperature, and with how much of its theoretical magnetisation surviving?** The functional target — a transition temperature, a magnetocaloric entropy change — is macroscopic, but the control variables are atomic: which site is substituted, how exchange pathways compete, where the Fermi level sits relative to a spin-resolved pseudogap.

### Our Approach
We treat disorder as the object of study rather than a numerical inconvenience. The method stack is chosen to match that commitment: the Green's-function coherent potential approximation for substitutional disorder, explicit supercells where short-range order matters, Lichtenstein-formalism exchange extraction to recover the topology of competing magnetic pathways, and classical Monte Carlo to carry those exchange interactions to finite temperature. This is one connected pipeline — from electronic structure, through exchange, to ordering — and it is what lets a calculation speak to a measured transition temperature rather than stopping at a ground-state energy.

Studies are designed factorially — hole-doping against electron-doping at the same site, isovalent substitutions at fixed valence electron count — so that the variable doing the work is isolated by construction. And we take seriously the step from local descriptor to collective response: when we report a Curie temperature, we also report the exchange-competition parameter that says how much of it survives the cancellation between ferromagnetic and antiferromagnetic pathways. Where a local descriptor fails to predict the collective outcome, that failure is itself part of what we report.

### Key Insights & Achievements
- **Fermi-level engineering of itinerant magnetism.** In B2-ordered FeRh under substitutional disorder, hole- and electron-doping on the magnetic sublattice resolve the chemical-versus-magneto-volume question: Fermi-level position relative to the minority-spin pseudogap, not the lattice parameter, decides whether the Curie temperature collapses or holds — establishing d-band filling as a predictive control variable for itinerant ferromagnets.
- **Exchange topology shapes finite-temperature order.** In disordered Heusler alloys, site-resolved Lichtenstein exchange extraction shows how dopant choice redistributes ferromagnetic and antiferromagnetic pathways, identifying compositional routes that preserve a useful spin-polarised channel and routes that destroy it through exchange competition.
- **Off-stoichiometry as a Curie-temperature handle.** Targeted substitution in Heusler systems engineers transition temperatures by reorganising the dominant exchange pathways through the 3d–4d sublattice, rather than by changing the magnitude of any individual moment.
- **Exchange topology as a magnetocaloric design handle.** Across all-d-metal and Zn-based Heusler magnetocalorics, mapping the competition between ferromagnetic and antiferromagnetic exchange pathways identifies compositional routes to room-temperature operation and to unconventional critical behaviour.
- **Connectivity gates itinerant transport.** In vacancy-doped monolayer dichalcogenides, crystal-field splitting produces robust local moments at every defect, but itinerant half-metallic ferromagnetism emerges only when the defect network percolates — a transition that falls in the two-dimensional percolation universality class and is invisible to local-descriptor analyses.

These results trace a single argument: in disordered magnets, the route from electronic structure to a usable magnetic property runs through exchange topology and connectivity, not through any local quantity on its own. Identifying the control variable cleanly — a Fermi-level position, a dominant exchange pathway, a percolation threshold — is what makes compositional design predictive, and it is what connects these calculations to the experimental design of magnetocalorics and spintronic materials.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
