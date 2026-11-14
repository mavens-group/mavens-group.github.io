---
# Landing Page
# Leave the homepage title empty to use the site title
title:
date: 2022-10-24
type: landing

sections:
  # ── Hero ───────────────────────────────────────────────────────────────────
  - block: mv-hero
    id: hero
    content:
      title: MAVENs
      tagline: Materials Advancing a Viable ENergy future
      thesis: Disorder decides what a material can do. We explain how.
      text: |
        Led by [Dr. Rudra Banerjee](/author/rudra-banerjee/), [Department of Physics and Nanotechnology](https://www.srmist.edu.in/department/department-of-physics-and-nanotechnology/), [SRM Institute of Science and Technology](https://srmist.edu.in).
      buttons:
        - text: See our research
          url: /research/
          style: primary
        - text: Meet the group
          url: /people/
          style: outline-primary
      # Figure: without `image` the hero shows the built-in lattice. To use a
      # picture instead, put it in assets/media/ and set, e.g.:
      # image: hero-charge-density.webp
      # image_alt: Short description of the figure
      # image_dark: optional-dark-variant.webp
      caption: Host sites, substitutions, vacancies

  # ── Why disorder (bridge between hero and themes) ──────────────────────────
  - block: markdown
    id: intro
    content:
      title:
      text: |
        Every real material is imperfect. Atoms swap places, atoms go missing, two metals share one lattice.

        These imperfections are not noise. They can make a magnet or break it, create a spin centre or silence it, and turn a surface into a source of hydrogen fuel, or leave it idle.

        We start from quantum mechanics: we compute the electronic structure of the disordered material, the magnetic interactions it produces, and the temperature up to which order survives. When there are too many compositions to compute one by one, machine learning narrows the search. And we work with experimental groups, so our predictions meet real samples.
    design:
      columns: '1'

  # ── Research Themes ────────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Research Themes

        <p class="section-lede">Three things disorder decides, and machine learning for when there are too many compositions to compute.</p>

        <div class="research-themes-grid research-themes-grid--two">
          <div class="theme-card">
            <a class="theme-title" href="/research/post/magnetism/">Disorder and Magnetism</a>
            <span class="theme-desc">When does a disordered alloy become a magnet, and at what temperature?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/coherence/">Disorder and Coherence</a>
            <span class="theme-desc">Can a spin made by a missing atom hold quantum information?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/catalysis/">Disorder and Catalysis</a>
            <span class="theme-desc">When no two surface sites are alike, which ones bind hydrogen?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/ml/">Machine Learning Driven Discovery</a>
            <span class="theme-desc">Design rules from data, with the physics left in.</span>
          </div>
        </div>

        {{% cta cta_link="./research/" cta_text="Explore Our Research" %}}
    design:
      columns: '1'


  # ── Research Highlights ────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |

       ### Research Highlights <a href="/news/" class="highlight-cta"><i data-feather="chevron-right"></i></a>

        <p class="section-lede">New papers, recognition and group news.</p>

        {{% highlight-list %}}

    design:
      columns: '1'

  # ── Join the Discovery ─────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Open Positions

        We welcome M.Sc. and PhD students in physics, chemistry, or materials science. Projects span _ab-initio_ [DFT](/lectures/2024-07-dft/), Monte Carlo, and ML-driven screening.

        {{% cta cta_link="./position/" cta_text="See Open Projects" %}}

    design:
      columns: '1'
---
