# waqasahmad.dev

Static site (repo root) intended for GitHub Pages.

## Local preview

```bash
python3 -m http.server
# then open:
# http://localhost:8000/
# http://localhost:8000/work/
```

## Generators

```bash
./wrun site:init
./wrun site:work
./wrun site:project <slug>
```

Notes:
- The work list renders only when served over HTTP (not file://).
- Generators never overwrite user-authored HTML.
