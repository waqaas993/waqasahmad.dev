# waqasahmad.dev

Static site (repo root) intended for GitHub Pages.

## About

This is Waqas Ahmad’s portfolio site (Unity Game Developer). It’s designed to work directly from disk (`file://`) and when hosted.

## Data

Work items are defined in `assets/data/work.json`.

Notes:
- When hosted, the work grid progressively enhances by loading `assets/data/work.json`.
- When opened via `file://`, the work grid uses embedded seed data to avoid browser fetch restrictions.
- Generators never overwrite user-authored HTML.
