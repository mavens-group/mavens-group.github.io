import React from "react";
import logoMarkup from "../assets/mavens-inline.svg?raw";

/**
 * Renders the MAVENs logo inline (not via <img>) so its `currentColor`
 * strokes pick up color from *our* CSS (the theme system), rather than
 * the visitor's OS light/dark preference — which is what the raw SVG's
 * own embedded prefers-color-scheme rule would otherwise follow when
 * loaded as an external image.
 */
export default function MavensLogo({ className = "w-full h-full" }) {
  return (
    <div
      className={`${className} overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-[var(--accent)]`}
      dangerouslySetInnerHTML={{ __html: logoMarkup }}
    />
  );
}
