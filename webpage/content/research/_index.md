---
title: Research
type: research
view: card
banner:
    image: 'group.webp'
sections:
  - block: markdown
    id: header
    content:
      text: 'Check out my recent blog posts below!'
  - block: collection
    id: posts
    content:
      count: 5
      filters:
        folders:
          - post
      offset: 0
      sort_by: 'Date'
      sort_ascending: false
    design:
      view: card
---
At [MAVENs](../), the work is computational, and the recurring question is the same across the systems we choose: which atomic-scale feature carries the macroscopic property, and what additional structure decides whether it does. The behaviour we care about — magnetic order at finite temperature, catalytic activity on a surface, a defect-supported spin state — is collective. The variables a calculation can vary are local. The work lives in that gap.

{{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}}

### The Unified Problem
A local feature is necessary but rarely sufficient. A local moment can produce a paramagnet; a favourable adsorption energy at one site does not make a catalyst; a defect's electronic structure can be ideal while the defect network fails to support transport. What sits between the local feature and the collective response — the statistics of substitutional disorder, the topology of exchange pathways, the geometric connectivity of a defect network, the dimensionality of a magnetic phase — is usually where the physics that matters lives. We choose systems where this second layer can be isolated: substitutional alloys where one element substitutes at one sublattice, defect-bearing semiconductors where a vacancy breaks a specific symmetry, layered phases where the stacking is the variable. Studies are constructed factorially — hole-doping against electron-doping at the same site, isovalent substitution across periods, asymmetric against symmetric stacking — so that the variable changing across a series is the one we set out to vary.

### Unification of Methods
Methods enter the work in response to what a question needs. Ground-state electronic and magnetic structure comes from density functional theory; finite-temperature behaviour from Monte Carlo simulation on effective spin or configurational models built from first-principles exchange interactions; statistical treatment of substitutional disorder from Green's-function methods, with explicit supercells where short-range order matters. Machine learning enters where compositional spaces are too large to enumerate, and is constrained to features a physicist would call physical, so that what the model uses to predict is also what we use to understand. Predictions return to first-principles calculation for validation. No method is loaded as a default.

The systems we work on — Heusler and all-d-metal Heusler alloys, layered transition-metal carbides and nitrides, vacancy-bearing dichalcogenides, van der Waals magnets, defect-host semiconductors for spin-based quantum information — are testbeds. Each was chosen because it isolates a specific instance of the local-to-collective problem cleanly: Fermi-level position against lattice in an itinerant ferromagnet, single-site adsorption against magnetic exchange splitting on a catalytic surface, local moments against network percolation in a defect array, model features against physical descriptors in a learned predictor. Reporting where a local descriptor predicts and where it stops predicting is, for us, part of the result.

### Collaboration
We collaborate with experimental groups at SRM Institute and elsewhere — [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) on polymers and soft materials, [Dr. Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) on quantum materials, [Dr. Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) on 2D systems — both to validate predictions and to keep the choice of problem honest about what synthesis and characterization can probe.

### Three Themes, One goal
The three themes below develop the work in detail.
