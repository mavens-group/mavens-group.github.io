---
# Leave the homepage title empty to use the site title
title:
date: 2022-10-24
type: landing

sections:
  - block: slider
    content:
      slides:
      - title: MAVENs
        content: Materials Advancing a Viable ENergy future
        align: center
        background:
          image:
            filename: group.jpg
          position: center
          color: '#666'
      - title: Tuning the properties of materials
        content: 'Doping of 3d material changes the magnetic interaction $J_{ij}$ considerably in
        Heusler alloy. The change in $J_{ij}$ affects the Curie temperature of the materials,
        giving high magnetocalric effect around room temperature.
        [https://doi.org/10.1016/j.jpcs.2024.111914](https://doi.org/10.1016/j.jpcs.2024.111914)'
        align: left
        background:
          image:
            filename: heusler.jpg
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
      title: _You may say **we** are a dreamer_
      text: |
        The MAVENs group, based within the Department of Physics and Nanotechnology at SRM
        Institute of Science and Technology, dreams a cleaner environment to breath for the next
        generations by developing innovative materials solutions for green energy using computational
        modelling.

        With a focus on green energy technologies, the MAVENs team is actively engaged in the design of
        novel catalysts for the hydrogen evolution reaction (HER), the engineering of magnetocaloric
        materials for energy-efficient cooling, and the exploration of qubit materials for quantum
        computing applications.

        Our research methodology combines advanced computational techniques, including density functional
        theory (DFT) and Monte Carlo simulations, with high-throughput computing and machine learning. This
        interdisciplinary approach enables us to accelerate the discovery of promising materials and
        optimize their properties.

        We invite talented MSc students with a passion for physics, chemistry, or materials science to join
        our dynamic research group. By working alongside our experienced researchers, you will have the
        opportunity to contribute to cutting-edge research and develop the skills necessary for a
        successful career in academia or industry.

        To learn more about our research and available positions, continue to our website.
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

# - block: markdown
#   content:
#     title:
#     subtitle:
#     text: |
#       {{% cta cta_link="./people/" cta_text="Meet the team →" %}}
#   design:
#     columns: '1'
---
