# waqasahmad.dev

Unity game developer portfolio site.

This repository is a **static, file-first website** (HTML/CSS/JS committed directly) with **no build step**.

## What this repo is
- A Unity Game Developer portfolio (homepage + work grid + case studies)
- Designed to run in two modes:
  - **First-class `file://` usage** (open `index.html` directly from disk)
  - **Hosted usage** (GitHub Pages)

## Runtime modes

### 1) File-first mode (`file://`) — canonical local workflow
- Open `index.html` directly.
- Navigation uses disk-friendly links (e.g. `./work/index.html`).
- The Work grid renders immediately using embedded seed data (no fetch), so it works under `file://` without CORS issues.

### 2) Hosted mode (GitHub Pages)
- Deploy from **`main` only** (no `gh-pages` branch).
- When hosted over HTTP(S), the Work grid **progressively enhances** by fetching `assets/data/work.json` and re-rendering.

## Content structure
- `index.html` — homepage
- `work/index.html` — portfolio listing (grid)
- `work/<slug>/index.html` — project detail pages / case studies

## Where to edit things (canonical)

### Site metadata (generators use this; HTML does not auto-regenerate)
- `warp.config.json`
  - Site metadata (title, base URL, nav, socials)
  - Treated as **locked after init** by the generator tooling

### Work items (order + metadata)
- `assets/data/work.json`
  - Display order is the array order
  - Treat as **append-only** unless you explicitly want to reorder the portfolio

### Work renderer (seed data for `file://`)
- `assets/js/work.js`
  - Contains `seedItems` for the file-first experience
  - Keep `seedItems` in sync with `assets/data/work.json`

### Thumbnails (local-only)
- `images/work/<slug>/thumb.webp`
  - Stored in-repo
  - No runtime downloading of thumbnails
  - (The renderer will display a neutral placeholder if a thumbnail is missing.)

Note: this repo may contain legacy thumbnail formats (e.g. `thumb.svg`) for specific projects; the canonical target is `thumb.webp`.

### Downloads
- `downloads/`
  - `downloads/waqas-ahmad-cv.pdf`
  - `downloads/waqas-ahmad-portfolio.pdf`

## Local preview tips
- File-first: open `index.html` directly.
- Optional HTTP preview (mirrors hosted behavior more closely):
  ```bash
  python3 -m http.server
  ```

## Tooling (Warping)
This repo includes an embedded `warping/` project with a Python CLI (`warping/wrun`).
- The generators are **create-missing / no-overwrite**: they must not rewrite existing user-authored HTML.
- Useful commands:
  ```bash
  ./warping/wrun help
  ./warping/wrun site:work
  ./warping/wrun site:project <slug>
  ```
