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
{{< inline-svg "figure.svg" >}}

### Scientific Challenge
Magnetism is routinely read off local quantities — the size of a moment, the sign of a single exchange constant, the filling of a band. For an ordered crystal at zero temperature this often suffices. For a real alloy, mixed and substituted and held at finite temperature, it systematically fails: a large local moment can sit in a paramagnet, and a strong nearest-neighbour exchange can be cancelled by competition two shells away. Our position is that **the magnetic transition temperature is never set by the local moment — it is set by the topology of competing exchange pathways, and that is why local descriptors keep mispredicting disordered magnets.** The control variable is not a number attached to a site; it is the structure of the exchange network, and disorder is what reshapes that network.

### Our Approach
This commits us to a method that carries the topology, not just the energetics, from electronic structure all the way to a finite-temperature observable. We treat disorder as the object of study — the Green's-function coherent potential approximation for substitutional randomness, beyond-single-site Green's-function methods (augmented-space recursion, which the group has developed since 2009) to capture local-environment effects beyond the single-site picture, and explicit supercells where short-range order matters — and extract exchange interactions through the Liechtenstein formalism precisely because it preserves the competition between ferromagnetic and antiferromagnetic pathways rather than collapsing it into an average. Those interactions then drive classical Monte Carlo to a transition temperature. It is one connected pipeline, composition to exchange to ordering, and its discipline is that whenever we quote a Curie temperature we also quote the exchange-competition parameter that says how much of it survives cancellation. Where a local descriptor predicts order and the network does not deliver it, that discrepancy is the result, not an error to be smoothed.

### Findings
The pipeline has already resolved questions that local-descriptor analyses cannot reach:

- **It separates electronic cause from structural coincidence.** In B2-ordered FeRh with substitutional disorder on the Fe sublattice, hole doping and electron doping give opposite outcomes. Mn pushes the Fermi level into the minority-spin bonding states and suppresses the Curie temperature by about 450 K; Co pins it within the majority-spin pseudogap and keeps the ferromagnetic exchange stable. d-band filling, not a simple magneto-volume effect, is the control variable.
- **It turns dopant choice into a design handle.** In Heusler alloys, first-principles exchange interactions show which pathways carry the magnetism and how a dopant reshapes them. In Zn₂RuMn, ferromagnetism runs through Mn–Mn, Ru–Mn and dopant–Mn exchange, and Co doping raises the mean-field Curie temperature from about 300 K to 428 K; in Ni₂MnGa, the Curie temperature responds differently to Mn and Co depending on both the concentration and the site the dopant occupies.
- **It recovers the right collective physics, not just energies.** In vacancy-doped monolayer TiS₂, robust local moments form at every defect, yet itinerant half-metallic ferromagnetism emerges only when the defect network percolates — a transition that falls in the two-dimensional percolation universality class and is invisible to any local analysis. Identifying a universality class, not merely an ordering temperature, is the signature that the pipeline is resolving the network and not the site.

Taken together these are not a catalogue of materials; they are evidence that the composition-to-finite-temperature chain runs end to end on genuinely disordered systems, and that it extracts the control variable each time.

### Outlook
Most first-principles magnetism is still done on ordered crystals, and most finite-temperature magnetism is done with model Hamiltonians whose parameters are fitted rather than computed. The frontier we are working toward eliminates both compromises at once: predicting the transition temperature and the magnetocaloric response of a *disordered* magnet directly from its composition, before it is synthesised, with every parameter in the spin model coming from first principles. The work above is what makes that target credible rather than aspirational — the pipeline exists, it has been validated against the cases where the answer is already known, and the open problem is to turn it predictively on the alloys where the answer is not. The same exchange-network picture governs the magnetic excitations themselves, and we are extending it to how chemical disorder broadens those excitations and limits their lifetimes.

### Selected publications

{{< cite page="/publication/greeshma-2026" view="4" >}}

{{< cite page="/publication/karuna-2025" view="4" >}}

{{< cite page="/publication/dutta-2026" view="4" >}}

{{< cite page="/publication/karuna-2024-1" view="4" >}}

{{< cite page="/publication/karuna-2023" view="4" >}}

{{< cite page="/publication/fe-rh" view="4" >}}

{{< cite page="/publication/rb-10" view="4" >}}

{{< cite page="/publication/rb-02" view="4" >}}

{{% cta cta_link="../../" cta_text="← Go back to Research" %}}
