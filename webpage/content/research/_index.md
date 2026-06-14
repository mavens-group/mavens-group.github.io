---
title: Research
type: research
view: card
banner:
    image: 'group.webp'
sections:
  - block: collection
    id: posts
    content:
      count: 5
      filters:
        folders:
          - post
      offset: 0
      sort_by: 'Weight'
      sort_ascending: true
    design:
      view: card
---
At [MAVENs](../), we study how local electronic structure evolves into collective material behaviour — and why that transition so often determines whether a material ultimately functions.

A magnetic moment may produce a paramagnet rather than a ferromagnet. A chemically ideal adsorption site may sit in a matrix that suppresses catalytic turnover. A defect with the correct spin state may still fail to support coherent transport if the surrounding defect network does not percolate.

Local electronic features are necessary for functionality, but they are rarely sufficient for it.

What decides whether a local feature survives into a macroscopic response is usually not the feature itself, but the larger physical structure it inhabits — and most often, the disorder within it: the topology of exchange pathways, the statistics of substitution, the geometry of a defect network, the way randomness reshapes a coupling. Disorder is not noise to be averaged away in this picture. It is frequently the variable that decides the outcome.


<div class="callout-question">This intermediate scale — the physical bridge between local structure and collective response — is the central focus of our research.</div>


{{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}}

## Isolating the Intermediate Scale

We choose systems — substitutional magnetic alloys, defect-bearing oxides, disordered catalytic surfaces — where the intermediate scale takes a specific, computationally tractable form, and where one variable at a time can be cleanly isolated. The recurring question across these systems is the same:


<div class="callout-question">When does a local descriptor remain predictive, and when does an intermediate scale become decisive?</div>


## Methods Chosen by the Question

Methods enter only when a question requires them.

We use:

- **Density functional theory** for electronic and magnetic structure, primarily through plane wave and Green's-function coherent potential approximation based methods.
- **First-principles exchange interactions** extracted through the Lichtenstein formalism, preserving the topology of competing magnetic pathways when mapping finite-temperature behaviour onto effective spin models.
- **Classical Monte Carlo simulations** to study ordering temperatures, phase competition, and magnetocaloric response.
- **Spin-dynamics and coherence modelling**, carrying first-principles hyperfine and exchange couplings into cluster-correlation-expansion estimates of coherence times.
- **Machine learning constrained by physically interpretable descriptors** when compositional spaces become too large for direct first-principles exploration.

Part of what we report is where local descriptors succeed — and where they fail. That boundary is often where the intermediate scale becomes physically important.

## Research Software and Computational Infrastructure

We also develop computational tools where existing workflows become restrictive.

[**cview**](https://github.com/mavensgroup/cview) is an open-source crystallographic interface designed to bridge structure visualisation and _ab-initio_ workflow generation across multiple formats.

A kinetic Monte Carlo engine for defect evolution and ordering dynamics is currently under active development.

## Experimental Constraints and Validation

Because collective behaviour is ultimately constrained by synthesis, morphology, and disorder, we work closely with experimental collaborators to ensure that computational predictions remain physically accessible.

Current collaborations include:

- [Dr Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) — quantum materials
- [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) — polymers and soft materials
- [Dr Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) — two-dimensional materials

## Research Themes
