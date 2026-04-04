// src/custom.js
document.addEventListener("DOMContentLoaded", function() {

    // 1. Define Links
    // "index.html" is the rendered version of README.md (The Cover)
    var logoUrl = path_to_root + "images/dz2.svg";
    var homeLink = path_to_root + "index.html";

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
        // --- Sidebar Logo Injection ---
        var scrollbox = document.querySelector(".sidebar-scrollbox");

        // Only inject if it doesn't exist yet
        if (scrollbox && !scrollbox.querySelector(".sidebar-logo")) {

            // Create the Link container (Clickable)
            var link = document.createElement("a");
            link.href = homeLink;
            link.className = "sidebar-logo-link";
            link.title = "Go to Cover"; // Tooltip

            // Create the Image
            var logo = document.createElement("img");
            logo.src = logoUrl;
            logo.alt = "CView Logo";
            logo.className = "sidebar-logo";

            link.appendChild(logo);

            // Insert at top of scrollbox (Before the text links)
            scrollbox.insertBefore(link, scrollbox.firstChild);
        }
    }
});
