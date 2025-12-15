---
# Leave the homepage title empty to use the site title
title:
date: 2022-10-24
type: landing

sections:
  - block: slider
    content:
      slides:
        - title: <br><br><br><br><br><br>MAVENs
          content: Materials Advancing a Viable ENergy future
          align: center
          background:
            image:
              filename: group.webp
            position: center
            color: '#666'

        - title: Tuning the properties of materials
          content: |
            Doping of 3d material changes the magnetic interaction $\mathsf{J_{ij}}$ considerably in Heusler alloy.
            The change in $\mathsf{J_{ij}}$ affects the Curie temperature of the materials,
            giving high magnetocaloric effect around room temperature.
            doi: [10.1016/j.jpcs.2024.111914](https://doi.org/10.1016/j.jpcs.2024.111914)
            doi: [10.1063/5.0238199](https://doi.org/10.1063/5.0238199)
          align: left
          background:
            image:
              filename: heusler.webp
              filters:
                brightness: 0.5
            position: center
            color: '#555'

        - title: Functionalize MXene for green hydrogen
          content: |
            $\mathsf{Ti_3C_2}$ MXene is a cheap material, easy to synthesize in production scale.
            We have shown that $\mathsf{Ti_3C_2}$ can be used as a catalyst for Hydrogen Evolution Reaction (HER)
            by means of doping Zr to Ti site.
            doi: [10.1016/j.physb.2025.417148](https://doi.org/10.1016/j.physb.2025.417148)
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

        We address a fundamental question in materials science:

        _**"How can we computationally design materials that solve pressing energy and quantum challenges?"**_

        Our approach combines **Density Functional Theory (DFT)**, **Monte Carlo simulations**, and **Machine Learning (ML)** to predict material properties from electronic structure—bridging atomic-scale behavior with macroscopic functionality. By linking fundamental theory with experimentally relevant outcomes, we **predict material behavior before synthesis**, reducing trial-and-error and accelerating discovery.

        {{% cta cta_link="./research/" cta_text="Explore Our Research" %}}

        ### Research Themes

        Our work spans three interconnected areas, each addressing specific scientific challenges:

        1. **[Disordered Alloys](/research/post/hea/)** – Understanding how atomic-scale disorder controls mechanical, magnetic, and electronic functionality in Heusler and high-entropy alloys for spintronic applications.

        2. **[Quantum and Low-Dimensional Materials](/research/post/2d/)** – Engineering MXenes, monolayers, and single molecules systems for quantum technologies, spintronics, and energy conversion.

        3. **[Interpretable Machine Learning](/research/post/ml/)** – Developing physics-informed ML models to predict defect-host systems for spin qubits, catalysts, and other functional materials.

        These themes contribute directly to **global efforts in clean energy, quantum technologies, and advanced manufacturing**.

        ### Collaborative Impact

        We collaborate with experimental groups at SRM Institute and worldwide, partnering with researchers in quantum materials and 2D systems to ensure our computational predictions are validated and translated into real-world applications.

        {{% cta cta_link="./publication/" cta_text="View Our Publications" %}}

        ### Join the Discovery

        We welcome **M.Sc. and graduate students** in physics, chemistry, or materials science interested in computational materials research. Develop expertise in _ab-initio_ [DFT](blog/2024-07-dft) and ML-driven materials screening while contributing to technologies shaping a sustainable, quantum-enabled future.

        {{% cta cta_link="./position/" cta_text="See Open Projects" %}}

    design:
      columns: '1'
---
