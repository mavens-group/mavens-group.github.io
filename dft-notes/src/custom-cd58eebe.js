// src/custom.js
document.addEventListener("DOMContentLoaded", function () {

    var logoUrl         = path_to_root + "images/dz2.svg";
    var homeLink        = path_to_root + "index.html";
    var mainSiteUrl     = "https://mavens-group.github.io/";
    var mainSiteLogoUrl = path_to_root + "images/mavens.svg";

    // =========================================================================
    // COVER PAGE
    // =========================================================================
    if (document.getElementById("cover-page")) {
        var sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.style.display = "none";
        var menuBar = document.querySelector(".menu-bar");
        if (menuBar) menuBar.style.display = "none";
        var content = document.querySelector(".content");
        if (content) { content.style.maxWidth = "100%"; content.style.margin = "0 auto"; }

    // =========================================================================
    // STANDARD PAGE — sidebar logos
    // =========================================================================
    } else {
        var scrollbox = document.querySelector(".sidebar-scrollbox");
        if (scrollbox) {
            if (!scrollbox.querySelector(".sidebar-logo-link")) {
                var link = document.createElement("a");
                link.href = homeLink; link.className = "sidebar-logo-link"; link.title = "Go to Cover";
                var logo = document.createElement("img");
                logo.src = logoUrl; logo.alt = "CView Logo"; logo.className = "sidebar-logo";
                link.appendChild(logo);
                scrollbox.insertBefore(link, scrollbox.firstChild);
            }
            if (!scrollbox.querySelector(".back-to-main-link")) {
                var backLink = document.createElement("a");
                backLink.href = mainSiteUrl; backLink.className = "back-to-main-link";
                backLink.title = "Return to MAVENs Group Main Site";
                var backLogo = document.createElement("img");
                backLogo.src = mainSiteLogoUrl; backLogo.alt = "MAVENs Group";
                backLogo.style.cssText = "display:block;max-width:80%;max-height:60px;margin:0 auto";
                backLink.appendChild(backLogo);
                backLink.style.cssText = "display:block;padding:20px 15px;margin-top:20px;" +
                    "margin-bottom:20px;border-top:1px solid var(--sidebar-spacer);" +
                    "cursor:pointer;opacity:0.7;transition:opacity 0.2s ease-in-out";
                backLink.addEventListener("mouseenter", function () { backLink.style.opacity = "1"; });
                backLink.addEventListener("mouseleave", function () { backLink.style.opacity = "0.7"; });
                scrollbox.appendChild(backLink);
            }
        }
    }

    // =========================================================================
    // MATH ENVIRONMENT BLOCKS
    //
    // Blocks are written as <div class="theorem" data-title="..."> in Markdown.
    // Because mdBook DOES parse Markdown inside plain <div> tags, math and
    // formatting work normally — no delimiter fixing needed here.
    //
    // This code simply injects the .math-env-label as the first child of each
    // matching div, then asks MathJax to retypeset.
    // =========================================================================
    var ENV_LABELS = {
        'theorem':     'Theorem',
        'lemma':       'Lemma',
        'corollary':   'Corollary',
        'proposition': 'Proposition',
        'definition':  'Definition',
        'proof':       'Proof',
        'remark':      'Remark',
        'assumption':  'Assumption',
        'example':     'Example'
    };

    Object.keys(ENV_LABELS).forEach(function (cls) {
        document.querySelectorAll('div.' + cls).forEach(function (el) {
            if (el.querySelector('.math-env-label')) return; // already labelled

            // Build the label element
            var label = document.createElement('div');
            label.className = 'math-env-label';
            label.appendChild(document.createTextNode(ENV_LABELS[cls]));

            // Append optional title from data-title attribute
            var titleText = el.getAttribute('data-title');
            if (titleText) {
                var titleSpan = document.createElement('span');
                titleSpan.className   = 'math-env-title';
                titleSpan.textContent = titleText;
                label.appendChild(titleSpan);
            }

            el.insertBefore(label, el.firstChild);
        });
    });

    // Ask MathJax to retypeset after label injection
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
});
