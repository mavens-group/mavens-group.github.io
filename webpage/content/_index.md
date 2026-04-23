---
# Landing Page
# Leave the homepage title empty to use the site title
title:
date: 2022-10-24
type: landing

sections:
  - block: slider
    content:
      slides:
        - title: '<span style="display: inline-block; margin-top: 35vh;">MAVENs</span>'
          content: Materials Advancing a Viable ENergy future
          align: center
          background:
            image:
              filename: group.webp
            position: center
            color: '#666'

        - title: Governing Quantum Materials
          content: |
            When does local electronic structure decide a material's function, and when does something larger take over? We track how symmetry breaking — a vacancy, a Janus stacking, a substitutional site — propagates from local descriptor to collective spin-dependent response.<br><small>doi: [10.1016/j.jssc.2024.124602](https://doi.org/10.1016/j.jssc.2024.124602)<br>doi: [10.1063/5.0238199](https://doi.org/10.1063/5.0238199)<br>doi: [10.1016/j.jpcs.2024.111914](https://doi.org/10.1016/j.jpcs.2024.111914)</small>
          align: left
          background:
            image:
              filename: heusler.webp
              filters:
                brightness: 0.5
            position: center
            color: '#555'

        - title: Energy Materials by Design
          content: |
            Which features of the electronic structure actually decide whether a material solves an energy problem? We isolate electronic-structure control variables — d-band filling, site-resolved d-band centre, Fermi-level position — to make compositional design predictive rather than exploratory.<br><small>doi: [10.1016/j.physb.2025.417148](https://doi.org/10.1016/j.physb.2025.417148)</small>
          align: left
          background:
            image:
              filename: mxene.webp
              filters:
                brightness: 0.5
            position: center
            color: '#555'

    design:
      is_fullscreen: true
      slide_height: ''
      loop: true
      interval: 5000
      css_class: "slider-fade"

  - block: markdown
    content:
      title:
      text: |

        <blockquote style="text-align:center; font-size: 2rem; font-style: italic; margin: 0; padding: 0;">
          You may say <b>we</b> are a dreamer
          <footer style="text-align:center; font-size: 0.9rem; margin-top: 0.2rem;
          margin-bottom:.2rem">
            — <cite>John Lennon</cite>, <em>Imagine</em> (slightly modified)
          </footer>
        </blockquote>

        **MAVENs** (*Materials Advancing a Viable ENergy Future*), led by [Dr. Rudra Banerjee](https://mavens-group.github.io/author/rudra-banerjee/), is based in the [Department of Physics and Nanotechnology](https://www.srmist.edu.in/department/department-of-physics-and-nanotechnology/) at the [SRM Institute of Science and Technology](https://srmist.edu.in).

        We address a central question in computational materials science:

        ```How do we computationally design materials that solve energy and quantum challenges?```

        Our approach combines **[Density Functional Theory (DFT)](blog/2024-07-dft)**, **Monte Carlo simulations**, and **Machine Learning (ML)** to predict material properties from electronic structure—bridging atomic-scale behaviour with macroscopic functionality. By linking fundamental theory with experimentally relevant outcomes, we **predict material behaviour before synthesis**, reducing trial-and-error and accelerating discovery.

        {{% cta cta_link="./research/" cta_text="Explore Our Research" %}}

        ### Research Themes

        Our work spans three interconnected areas, each addressing specific scientific challenges:

        1. **[Energy Materials by Design](/research/post/energy/)** – Identifying electronic-structure control variables that govern catalytic, magnetic, and electronic functionality in itinerant systems.

        2. **[Quantum Materials by Design](/research/post/quantum/)** – Tracking how local electronic features survive into collective spin-dependent responses in defect systems, disordered alloys, and layered materials.

        3. **[Interpretable Machine Learning](/research/post/ml/)** – Developing physics-informed ML models that discover materials while preserving the insight that makes predictions transferable.

        These themes contribute to broader efforts in clean energy, quantum technologies, and advanced manufacturing.

        ### Collaborative Impact

        We collaborate with experimental groups at SRM Institute and worldwide, partnering with researchers in quantum materials and 2D systems to ensure our computational predictions are validated and translated into real-world applications.

        {{% cta cta_link="./publication/" cta_text="View Our Publications" %}}

        ### Join the Discovery

        We welcome **M.Sc. and graduate students** in physics, chemistry, or materials science interested in computational materials research. Develop expertise in _ab-initio_ [DFT](blog/2024-07-dft) and ML-driven materials screening while contributing to technologies shaping a sustainable, quantum-enabled future.

        {{% cta cta_link="./position/" cta_text="See Open Projects" %}}

    design:
      columns: '1'
---
