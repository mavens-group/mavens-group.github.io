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

        We focus on the **fundamental challenge of predicting material properties from electronic structure**, using computational approaches to design materials with targeted capabilities for energy, quantum, and functional technologies. Our research integrates theory, computation, and application-oriented insight to enable predictive understanding and guide experimental validation.


        ### Designing Materials with Predictive Insight

        Our work combines **Density Functional Theory (DFT)**, **Monte Carlo simulations**, and **Machine Learning (ML)**. Together, these methods allow us to:

        - **DFT:** Accurately compute electronic, magnetic, and structural properties for alloys, 2D materials, and molecular systems
        - **Monte Carlo simulations:** Explore thermodynamic and configurational landscapes in disordered and multi-component systems
        - **Machine Learning:** Accelerate discovery of functional materials and defects, while maintaining interpretability and scientific insight

        By applying these tools across multiple length scales, we bridge atomic-level structure with macroscopic properties and **predict material behavior before synthesis**.

        {{% cta cta_link="./research/" cta_text="Explore Our Research" %}}


        ### Research Frontiers

        Our research focuses on three interconnected areas:

        1. **Disordered Alloys** – Understanding how atomic-scale disorder controls mechanical, magnetic, and electronic functionality, with applications in high-entropy alloys and spintronic devices.
        2. **Quantum and Low-Dimensional Materials** – Engineering 2D materials and hybrid molecular systems for quantum technologies, spintronics, and energy conversion.
        3. **Interpretable Machine Learning for Materials Discovery** – Developing physics-informed ML models to predict defect-host systems for quantum devices and other functional materials.

        Each frontier links fundamental theory with **experimentally relevant outcomes**, ensuring that predictions are actionable and scientifically robust.

        ### Collaborative Approach

        We actively partner with **experimental groups worldwide** to validate computational predictions and translate insights into practical applications. These collaborations strengthen both the impact and credibility of our research.

        {{% cta cta_link="./publication/" cta_text="View Our Publications" %}}

        ### Join the Discovery

        We welcome **M.Sc. students** in physics, chemistry, or materials science interested in computational materials research.
        Join us to explore **materials design with predictive insight** and contribute to technologies shaping a sustainable and quantum-enabled future.


        {{% cta cta_link="./position/" cta_text="Apply to Join Us" %}}


    design:
      columns: '1'
---
