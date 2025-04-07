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
        content: 'Doping of 3d material changes the magnetic interaction $\mathsf{J_{ij}}$ considerably in
        Heusler alloy. The change in $\mathsf{J_{ij}}$ affects the Curie temperature of the materials,
        giving high magnetocalric effect around room temperature.<br>
        doi: [10.1016/j.jpcs.2024.111914](https://doi.org/10.1016/j.jpcs.2024.111914)<br>
        doi: [10.1063/5.0238199](https://doi.org/10.1063/5.0238199)'
        align: left
        background:
          image:
            filename: heusler.webp
            filters:
              brightness: 0.5
          position: center
          color: '#555'
      - title: Functionalize MXene for green hydrogen
        content: '$\mathsf{Ti_3C_2}$ MXene is a cheap material, easy to synthesis in production scale. We
        have shown that this can be used as a catalyst for Hydrgen Evolution Reaction(HER) by means
        of doping Zr to Ti cite.<br>
        doi: [10.1016/j.physb.2025.417148](https://doi.org/10.1016/j.physb.2025.417148)'
        align: left
        background:
          image:
            filename: mxene.webp
            filters:
              brightness: 0.5
          position: center
          color: '#555'
#     - title: Machine Learning for Materials Discovery
#       content:
#       align: right
#       background:
#         image:
#           filename: slide3.png
#           filters:
#             brightness: 0.5
#         position: center
#         color: '#333'
#       link:
#         icon: graduation-cap
#         icon_pack: fas
#         text: Join Us
#         url: ../contact/
    design:
      # Slide height is automatic unless you force a specific height (e.g. '400px')
      slide_height: ''
      is_fullscreen: true
      # Automatically transition through slides?
      loop: true
      # Duration of transition between slides (in ms)
      interval: 5000

  - block: markdown
    content:
      text: |
        <p style="text-align:center; font-size: 2rem;"><i>You may say <b>we</b> are a dreamer<br>
        <small><small>- John Lennon (Imagine, slightly modified)</i></small></small></p>

        The MAVENs (**M**aterials **A**dvancing a **V**iable **EN**ergy future) group, led by [Dr
        Rudra Banerjee](https://mavens-group.github.io/author/rudra-banerjee/) is based in
        the [Department of Physics and Nanotechnology](https://www.srmist.edu.in/department/department-of-physics-and-nanotechnology/)
        at [SRM Institute of Science and Technology](https://srmist.edu.in). The MAVENs dreams a cleaner
        environment to breath for the next generations by developing innovative materials solutions
        for green energy using computational modelling.

        Focusing on green energy technologies, the MAVENs team is actively designing novel catalysts for
        the hydrogen evolution reaction (HER), engineering magnetocaloric materials for energy-efficient
        cooling, and exploring qubit materials for quantum computing applications.

        The group's research methodology combines advanced computational techniques, including density
        functional theory (DFT) and Monte Carlo simulations, with high-throughput computing and machine
        learning. This interdisciplinary approach enablesthe rapid discovery and optimization of promising materials.

        Furthermore, we actively collaborate with leading experimentalists and theoreticians, fostering a
        synergistic environment that accelerates material discovery and enhances the reliability of our
        computational predictions.

        We invite talented MSc students with a passion for physics, chemistry, or materials science to join
        our dynamic research group.

        To find more about our current research Interests, check:
        {{% cta cta_link="./research/" cta_text="Research Interests" %}} To find about available
        positions in our group, check
        {{% cta cta_link="./position/" cta_text="  Open Positions  " %}}
    design:
      columns: '1'
# - block: collection
#   content:
#     title: Latest Preprints
#     text: ""
#     count: 5
#     filters:
#       folders:
#         - publication
#       publication_type: 'article'
#   design:
#     view: citation
#     columns: '1'
---
