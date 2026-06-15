---
# research/post/magnetism
title: Disorder and Magnetism
summary: How does chemical disorder decide whether a magnet orders, at what temperature, and how much magnetisation survives?
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
Magnetism is routinely read off local quantities — the size of a moment, the sign of a single exchange constant, the filling of a band. For an ordered crystal at zero temperature this often suffices. For a real alloy, mixed and substituted and held at finite temperature, it systematically fails: a large local moment can sit in a paramagnet, and a strong nearest-neighbour exchange can be cancelled by competition two shells away. Our position is that **the magnetic transition temperature is never set by the local moment — it is set by the topology of competing exchange pathways, and that is why local descriptors keep mispredicting disordered magnets.** The control variable is not a number attached to a site; it is the structure of the exchange network, and disorder is what reshapes that network.

### Our Approach
This commits us to a method that carries the topology, not just the energetics, from electronic structure all the way to a finite-temperature observable. We treat disorder as the object of study — the Green's-function coherent potential approximation for substitutional randomness, explicit supercells where short-range order matters — and extract exchange interactions through the Lichtenstein formalism precisely because it preserves the competition between ferromagnetic and antiferromagnetic pathways rather than collapsing it into an average. Those interactions then drive classical Monte Carlo to a transition temperature. It is one connected pipeline, composition to exchange to ordering, and its discipline is that whenever we quote a Curie temperature we also quote the exchange-competition parameter that says how much of it survives cancellation. Where a local descriptor predicts order and the network does not deliver it, that discrepancy is the result, not an error to be smoothed.

### Findings
The pipeline has already resolved questions that local-descriptor analyses cannot reach:

- **It separates electronic cause from structural coincidence.** In B2-ordered FeRh under substitutional disorder, contrasting hole- and electron-doping on the magnetic sublattice settles the long-standing chemical-versus-magneto-volume question: the Fermi-level position relative to the minority-spin pseudogap, not the lattice parameter, decides whether the Curie temperature collapses or holds. That isolates d-band filling as a genuine, tunable control variable.
- **It reads exchange topology as a design handle.** In disordered Heusler alloys, site-resolved exchange extraction shows how dopant choice redistributes ferromagnetic and antiferromagnetic pathways — distinguishing substitutions that preserve a usable spin-polarised channel from those that destroy it through competition, and engineering transition temperatures by reorganising pathways through the 3d–4d sublattice rather than by changing any individual moment.
- **It recovers the right collective physics, not just energies.** In vacancy-doped monolayer dichalcogenides, robust local moments form at every defect, yet itinerant half-metallic ferromagnetism emerges only when the defect network percolates — a transition that falls in the two-dimensional percolation universality class and is invisible to any local analysis. Identifying a universality class, not merely an ordering temperature, is the signature that the pipeline is resolving the network and not the site.

Taken together these are not a catalogue of materials; they are evidence that the composition-to-finite-temperature chain runs end to end on genuinely disordered systems, and that it extracts the topological control variable each time.

### Outlook
Most first-principles magnetism is still done on ordered crystals, and most finite-temperature magnetism is done with model Hamiltonians whose parameters are fitted rather than computed. The frontier we are working toward eliminates both compromises at once: predicting the transition temperature and the magnetocaloric response of a *disordered* magnet directly from its composition, before it is synthesised, with every parameter in the spin model coming from first principles. The work above is what makes that target credible rather than aspirational — the pipeline exists, it has been validated against the cases where the answer is already known, and the open problem is to turn it predictively on the alloys where the answer is not.

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
