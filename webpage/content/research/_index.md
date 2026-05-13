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
At [MAVENs](../), our pursuit of next-generation energy and quantum materials hinges on a single, recurring scientific bottleneck: the gap between local atomic features and collective macroscopic behaviour.

Local features of electronic structure — a magnetic moment, a defect state, an adsorption site — are necessary to produce a useful macroscopic function, but they are rarely sufficient for it. A local moment can produce a paramagnet rather than a ferromagnet; a chemically ideal adsorption site can sit in a matrix that suppresses catalytic turnover; a defect with the right spin state can fail to support coherent transport if the defect network does not percolate.

What decides whether a local feature survives into a collective response is usually not the feature itself but something about the larger structure it sits in — the statistics of how disorder is distributed, the topology of exchange pathways between sites, the geometric connectivity of a defect array, the dimensionality of a magnetic phase. This intermediate scale — the physical bridge between the local and the collective — is what we study.

{{< video src="research.mp4" controls=false autoplay=true loop=true muted=true >}}

### Isolating the Intermediate Scale

We choose systems where this intermediate scale takes a specific, tractable form: how exchange topology reorganises under sublattice doping in Heusler alloys; whether surface adsorption is governed by the metal site, the anion, or their coupling in layered carbides and nitrides; whether local moments at every vacancy site are sufficient for itinerant order, or whether the transition is geometrical, in dichalcogenide monolayers; how the route from local exchange to collective phase changes with dimensionality in van der Waals magnets.

### Methods Chosen by the Question

Methods enter only when a question needs them. We derive ground-state electronic and magnetic structure from density functional theory; finite-temperature and configurational behaviour from Monte Carlo on effective models built from first-principles exchange interactions; and treatment of substitutional disorder from Green's-function methods or explicit supercells depending on whether short-range order matters.

Machine learning is constrained to physically interpretable features where compositional spaces are too large to enumerate, with predictions validated against first-principles calculations. Part of what we report is where a local descriptor predicts correctly and where it stops — that boundary is usually where the intermediate scale becomes decisive.

### Building the Infrastructure

When standard implementations fall short, we build the tools we need. Rather than forcing a physical problem to fit off-the-shelf software, we develop our own computational infrastructure. This includes in-house kinetic Monte Carlo codes to capture exact non-equilibrium dynamics, as well as high-performance, open-source tools like [CView](https://github.com/mavensgroup/cview). Written in Rust and GTK4, CView bridges the gap between structure visualization and *ab-initio* calculation setup (VASP, QE, SPRKKR). Developing our own code ensures that our analysis is limited only by the physics itself. *(See our [Software](/software) page).*

### Experimental Constraints and Validation

We work alongside experimental groups — [Dr Payel Bandyopadhyay, SRMIST](https://sites.google.com/srmist.edu.in/primelab/) on polymers and soft materials, [Dr. Ashutosh Kumar Singh, CeNS](https://sites.google.com/view/ashutoshksingh-cens/team/dr-ashutosh-k-singh) on quantum materials, [Dr. Pralay K. Santra, CeNS](https://www.santragroup.in/group/pralay-k-santra) on 2D systems — both to validate predictions and to keep the choice of system honest about what synthesis can probe.

### Research Themes
