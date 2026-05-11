---
# Research
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
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        # The folders to display content from
        folders:
          - post
      offset: 0
      # Field to sort by, such as Date or Title
      sort_by: 'Date'
      sort_ascending: false
    design:
      # Choose a listing view
      view: card
---
At [MAVENs](../), our work spans energy materials, quantum systems, and machine-learning–driven discovery. Computational design across all three reduces to a single methodological move: identifying the electronic-structure control parameters that turn compositional choice from screening into prediction. Fermi-level engineering in magnetocalorics, site-resolved catalysis in Janus MXenes, interpretable ML for qubit-host discovery — different systems, the same underlying commitment.

{{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}}

### A Unifying Commitment

Across our work, a result is interesting when it isolates the variable doing the work — the d-band filling, the percolation threshold, the descriptor whose contribution to a model is physically readable — rather than merely correlating composition with outcome. This commitment shapes how studies are designed: factorially where possible, with one symmetry broken at a time, and with the passage from local descriptor to collective response treated as a question rather than an assumption. A favourable d-band centre is not a catalyst; a large local moment is not a magnet. The route from one to the other is where the substantive physics sits, and where our methods are chosen to match.

### Methods in Service of Questions

We work with DFT, Monte Carlo, and machine learning, but treat them as instruments selected for the problem rather than as a fixed toolkit applied uniformly. The choice between explicit supercells and Green's-function CPA is made by the physics of the disorder; the choice between black-box ML accuracy and interpretable descriptor models is made by what we want the prediction to teach us. Lichtenstein exchange extraction, percolation analysis on tight-binding lattices, and high-throughput screening along controlled compositional axes appear when, and only when, the question demands them.


<!-- - **[Energy Materials by Design](post/energy/)** — Which features of the electronic structure actually decide whether a material solves an energy problem, and which are incidental? -->
<!-- - **[Quantum Materials by Design](post/quantum/)** — When does a useful local feature — a defect state, a single-atom magnetic moment — survive into a macroscopic, device-relevant response? -->
<!-- - **[Interpretable Machine Learning](post/ml/)** — How do we use ML to discover materials without surrendering the physical insight that makes a discovery transferable? -->

<!-- The three are not separate enterprises. Methods cross between Energy and Quantum; the interpretability commitment in ML is the same one that runs through the other two. The cleanest way to see how is to read the themes themselves. -->

### Collaborative Validation

Computational predictions become useful only when they meet synthesis. We work with experimental groups at SRM Institute and beyond — [Dr Payel Bandyopadhyay (SRMIST)](https://sites.google.com/srmist.edu.in/primelab/) on polymers and soft materials, [Dr. Ashutosh Kumar Singh (CeNS)](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) on quantum materials, and [Dr. Pralay K. Santra (CeNS)](https://www.santragroup.in/group/pralay-k-santra) on 2D systems — to test predictions against synthesis, characterization, and device measurement.


### Three Themes, One Programme

The work below organises into three themes. Each opens with a question that the theme page then takes seriously.
