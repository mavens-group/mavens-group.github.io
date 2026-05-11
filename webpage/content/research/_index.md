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

At [MAVENs](../), we work on a small set of recurring physics questions: when itinerant ferromagnetism survives compositional disorder, when a local magnetic moment or a defect state in a 2D material propagates into a collective spin-dependent response, and when a machine-learned model identifies a descriptor that is physically readable rather than merely predictive. The systems we use — Heusler alloys, Janus MXenes, vacancy-doped dichalcogenides, and defect-host qubit candidates — are testbeds where one symmetry can be broken at a time, so that the variable doing the work in the physics can be isolated and tuned.

Taken together, these are how we approach the problem of computationally designing materials for energy and quantum applications — not by screening compounds for properties, but by isolating the electronic-structure variables that decide whether a system can sit at its operating point at all.

{{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}}

### A Unifying Commitment

A result is interesting when it isolates the variable that decides the outcome — the d-band filling that controls whether a magnet's Curie temperature collapses under doping, the percolation threshold that decides whether a defect network conducts, the descriptor whose contribution to a model is physically readable — rather than merely correlating composition with property. This commitment shapes how studies are designed: factorially where possible, with one symmetry broken at a time, and with the passage from local descriptor to collective response treated as a question rather than an assumption. A favourable d-band centre is not a catalyst; a large local moment is not a magnet. The route from one to the other is where the substantive physics sits, and where our methods are chosen to match.

### Method Choice as a Physics Question

We work with DFT, Monte Carlo, and machine learning, but treat them as instruments selected for the problem rather than a fixed toolkit applied uniformly. The choice between explicit supercells and Green's-function CPA — a treatment of substitutional disorder that averages over configurations rather than enumerating them — is made by the physics of the disorder. The choice between black-box ML accuracy and interpretable descriptor models is made by what we want the prediction to teach us. Lichtenstein exchange extraction, which gives site-resolved magnetic interactions from a single DFT calculation, and percolation analysis on tight-binding lattices appear when, and only when, the question demands them.

The interpretability commitment in ML is the same commitment that organises the other two themes: a prediction is useful when it isolates the variable doing the work, regardless of whether the method that found it was a functional, a Hamiltonian, or a gradient-boosted tree.

### Validation through Collaboration

Computational predictions become useful only when they meet synthesis. We work with experimental groups at SRM Institute and beyond — [Dr Payel Bandyopadhyay (SRMIST)](https://sites.google.com/srmist.edu.in/primelab/) on polymers and soft materials, [Dr. Ashutosh Kumar Singh (CeNS)](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) on quantum materials, and [Dr. Pralay K. Santra (CeNS)](https://www.santragroup.in/group/pralay-k-santra) on 2D systems — to test predictions against synthesis, characterisation, and device measurement.

### Three Themes, One Programme

The three themes below take up the three questions named above. Each theme page opens with the question, and then takes it seriously.
