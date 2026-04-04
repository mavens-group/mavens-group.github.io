// src/custom.js
document.addEventListener("DOMContentLoaded", function() {

    // 1. Define Links
    var logoUrl = path_to_root + "images/dz2.svg";
    var homeLink = path_to_root + "index.html";

    // Main Site Return Links
    var mainSiteUrl = "https://mavens-group.github.io/";
    var mainSiteLogoUrl = path_to_root + "images/mavens.svg";

    // 2. COVER PAGE LOGIC (No Sidebar/Menu)
    if (document.getElementById("cover-page")) {
        var sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.style.display = "none";

        var menuBar = document.querySelector(".menu-bar");
        if (menuBar) menuBar.style.display = "none";

        var content = document.querySelector(".content");
        if (content) {
            content.style.maxWidth = "100%";
            content.style.margin = "0 auto";
        }

    // 3. STANDARD PAGE LOGIC
    } else {
        var scrollbox = document.querySelector(".sidebar-scrollbox");

        if (scrollbox) {
            // --- A. Sidebar Logo Injection (Top) ---
            if (!scrollbox.querySelector(".sidebar-logo-link")) {

                var link = document.createElement("a");
                link.href = homeLink;
                link.className = "sidebar-logo-link";
                link.title = "Go to Cover";

                var logo = document.createElement("img");
                logo.src = logoUrl;
                logo.alt = "CView Logo";
                logo.className = "sidebar-logo";

                link.appendChild(logo);
                scrollbox.insertBefore(link, scrollbox.firstChild);
            }

            // --- B. Back to Main Site Injection (Bottom) ---
            if (!scrollbox.querySelector(".back-to-main-link")) {

                var backLink = document.createElement("a");
                backLink.href = mainSiteUrl;
                backLink.className = "back-to-main-link";
                backLink.title = "Return to MAVENs Group Main Site";

                // Create the Image
                var backLogo = document.createElement("img");
                backLogo.src = mainSiteLogoUrl;
                backLogo.alt = "MAVENs Group";

                // Keep the image nicely sized within the sidebar
                backLogo.style.display = "block";
                backLogo.style.maxWidth = "80%";
                backLogo.style.maxHeight = "60px";
                backLogo.style.margin = "0 auto";

                backLink.appendChild(backLogo);

                // Styling for the link container
                backLink.style.display = "block";
                backLink.style.padding = "20px 15px";
                backLink.style.marginTop = "20px";
                backLink.style.marginBottom = "20px";
                backLink.style.borderTop = "1px solid var(--sidebar-spacer)";
                backLink.style.cursor = "pointer";

                // Opacity hover effect for the image
                backLink.style.opacity = "0.7";
                backLink.style.transition = "opacity 0.2s ease-in-out";

                backLink.addEventListener("mouseenter", function() {
                    backLink.style.opacity = "1";
                });
                backLink.addEventListener("mouseleave", function() {
                    backLink.style.opacity = "0.7";
                });

                // Append to the very bottom
                scrollbox.appendChild(backLink);
            }
        }
    }
});
