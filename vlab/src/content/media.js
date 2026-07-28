// Videos shown in each lab's "Media" tab.
//
// The actual video files should live in the project's /public/media/
// folder (NOT src/content/media) — Vite serves everything in /public/
// as static files at the site root, unmodified and unbundled, which is
// what you want for video files (no point running them through the JS
// bundler). List filenames here in the order they should play; the
// {lab}_{n} naming convention is just a suggestion for keeping files
// organized — any filename works as long as it's listed below.
//
// Format note: use .mp4 (H.264) or .webm — browsers' native <video>
// element does NOT reliably play raw .mpeg (MPEG-1/2) files. If your
// source videos are .mpeg, re-encode them to .mp4 first.
//
// Example, once you've added public/media/pxrd_1.mp4 and pxrd_2.mp4:
//   pxrd: ['pxrd_1.mp4', 'pxrd_2.mp4'],

export const MEDIA_MANIFEST = {
  pxrd: [
    'pxrd_1.mp4',
    'pxrd_2.mp4',
    'pxrd_3.mp4',
  ],
  ftir: [
    'ftir_1.mp4',
    'ftir_2.mp4',
    'ftir_3.mp4',
  ],
  uvvis: [
    'uvvis_1.mp4',
    'uvvis_2.mp4',
    // 'uvvis_3.mp4',
    'uvvis_4.mp4',
  ],
};
