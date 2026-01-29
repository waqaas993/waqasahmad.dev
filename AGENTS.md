# AGENTS.md

Guidance for Warp / AI agents working in this repository.

## What this repo is
- A **Unity game developer portfolio** implemented as a **static, file-first website**.
- Repo root is plain **HTML/CSS/JS committed directly** with **no build step**.
- `warping/` is an embedded project containing Warping framework docs + the `warping/wrun` Python CLI.

## Core constraints (do not break these)

### This site is static + file-first (not a dynamic web app)
- `file://` is a first-class runtime mode.
- The work grid must work under `file://` via embedded seed data (no fetch attempts, no warnings).

### No runtime fetching of remote assets (especially images)
- Do not introduce runtime behavior that downloads images/content from the web.
- Thumbnails are **local-only** (stored in-repo under `images/work/<slug>/...`).
- Exception: Tailwind is currently loaded via CDN in the HTML; do not add additional remote asset dependencies.

## AI agent behavior rules

### Agents must NOT
- Rewrite or “beautify” existing user-authored HTML pages.
- Regenerate sections that already exist.
- Re-order projects in `assets/data/work.json` unless explicitly asked.
- Refetch or replace thumbnails from the web.

### Agents MAY
- Make **documentation-only** changes freely.
- Make minimal code changes only if required to keep documentation truthful (avoid if possible).

## Thumbnail rules (canonical)
- Aspect ratio: **16:9**
- Size: **1280×720**
- Format: **WebP preferred**
- Path: `images/work/<slug>/thumb.webp`
- The renderer must never fetch remote thumbnails.
- If a thumbnail is missing (or a legacy format is referenced), the UI should gracefully fall back (e.g. neutral placeholder).

## Credit discipline / cost control
- Do not start long-running jobs (bulk fetches, conversions, crawls) without confirmation.
- Ask for required inputs (paths, desired dimensions, target formats) before doing expensive work.

## Common commands

### Preview the site locally
- File-first: open `index.html` directly.
- Optional hosted-like preview:
  ```bash
  python3 -m http.server
  # http://localhost:8000/
  # http://localhost:8000/work/
  ```

### Warping subproject
Warping has its own `Taskfile.yml` in `warping/`:
```bash
cd warping
task --list
task validate
task lint          # requires markdownlint-cli (see task output)
task build
```

### Site generators (optional)
`warping/wrun` is executable and can run generators from repo root:
```bash
./warping/wrun help
./warping/wrun site:work
./warping/wrun site:project <slug>
```
Notes:
- `site:init` refuses to run if `index.html`, `work/`, `assets/`, or `warp.config.json` already exist.
- Generators must never overwrite user-authored HTML; use them for create-missing scaffolding or deterministic append operations.

## High-level architecture

### Pages
- `index.html`: homepage
- `work/index.html`: portfolio grid (hydrated by `assets/js/work.js`)
- `work/<slug>/index.html`: case study pages

### Work data flow
- Canonical data: `assets/data/work.json`
- Renderer: `assets/js/work.js`
  - Always renders `seedItems` immediately (static-first)
  - Under `file://`, does **not** fetch JSON; relies on seed items
  - Under HTTP(S), fetches `assets/data/work.json` and re-renders when available

### Editing projects (rules)
- Update `assets/data/work.json` (2-space indent, newline at EOF).
- Keep `seedItems` in `assets/js/work.js` in sync with `work.json`.
- Add/update the corresponding case study at `work/<slug>/index.html`.

### Routing / links
- Hosted: directory-style URLs (`/work/<slug>/`) with support for GitHub Pages subpaths.
- `file://`: links should use explicit `index.html` paths (e.g. `./work/index.html`) so navigation works from disk.

### Styling + theme
- `assets/css/site.css` contains small global overrides.
- Theme:
  - visually distinct light vs dark
  - persisted in `localStorage` under `theme`
  - initialized before paint to avoid flash
  - toggled via `dark` class on `<html>` (toggle button may be hidden depending on page design)

### Deployment config
- `warp.config.json` is metadata used by generators; live HTML is hand-edited.
- GitHub Pages files: `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`.
