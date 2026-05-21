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

  # ── About ──────────────────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |

        <blockquote style="text-align:center; font-size: 2rem; font-style: italic; margin: 0; padding: 0;">
          You may say <b>we</b> are dreamers
          <footer style="text-align:center; font-size: 0.9rem; margin-top: 0.2rem;
          margin-bottom:.2rem">
            — <cite>John Lennon</cite>, <em>Imagine</em> (slightly modified)
          </footer>
        </blockquote>

        **MAVENs** (*Materials Advancing a Viable ENergy Future*), led by [Dr. Rudra Banerjee](https://mavens-group.github.io/author/rudra-banerjee/), is based in the [Department of Physics and Nanotechnology](https://www.srmist.edu.in/department/department-of-physics-and-nanotechnology/) at the [SRM Institute of Science and Technology](https://srmist.edu.in).

        We address a central question in computational materials science:
        <div class="callout-question">How do we computationally design materials that solve energy and quantum challenges?</div>

        We combine DFT, Monte Carlo simulations, and machine learning — using each where the physics demands it: DFT for electronic structure, Monte Carlo for finite-temperature collective behaviour, ML where compositional spaces become too large for direct first-principles study.




    design:
      columns: '1'

  # ── Research Themes ────────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Research Themes

        <div class="research-themes-grid">
          <div class="theme-card">
            <a class="theme-title" href="/research/post/energy/">Energy Materials by Design</a>
            <span class="theme-desc">Which electronic-structure variables actually control catalytic, magnetic, and electronic function in itinerant systems?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/quantum/">Quantum Materials by Design</a>
            <span class="theme-desc">How do local electronic features — at a vacancy, a Janus interface, a substitutional site — propagate into collective spin-dependent responses?</span>
          </div>
          <div class="theme-card">
            <a class="theme-title" href="/research/post/ml/">Interpretable Machine Learning</a>
            <span class="theme-desc">Physics-informed ML that discovers materials while preserving the mechanistic insight that makes predictions transferable.</span>
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

        {{% highlight-list %}}

    design:
      columns: '1'

  # ── Join the Discovery ─────────────────────────────────────────────────────
  - block: markdown
    content:
      title:
      text: |
        ### Open Positions

        We welcome M.Sc. and PhD students in physics, chemistry, or materials science. Projects span _ab-initio_ [DFT](blog/2024-07-dft), Monte Carlo, and ML-driven screening.

        {{% cta cta_link="./position/" cta_text="See Open Projects" %}}

    design:
      columns: '1'
---
