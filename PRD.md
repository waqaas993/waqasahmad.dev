# Product Requirements Document: Warping Framework

**Generated**: 2026-01-27
**Status**: Draft (Ready for AI Interview)

## Initial Input

**Project Description**: Warping is a layered framework + CLI workflow for AI-assisted software development, focused on consistent standards, reproducible automation, and spec-driven development (PRD → interview → SPECIFICATION → implementation).

**I want to build Warping Framework that has the following features:**
1. Layered rule precedence for AI behavior (user.md > project.md > language > tool > main > specification).
2. Lazy-loading guidance so agents only read relevant docs.
3. First-class Spec-Driven Development workflow:
   - Generate PRD.md
   - Conduct an AI interview
   - Generate SPECIFICATION.md (phased plan, dependencies, parallelizable tasks)
   - Implement with TDD + quality gates
4. A cross-platform CLI (`wrun`) to:
   - install warping into a project
   - bootstrap user preferences
   - configure a project
   - generate PRD.md
   - validate configuration
   - reset config artifacts
   - run system checks (doctor)
5. Opinionated, reusable standards for:
   - languages (Python/Go/TypeScript/C++)
   - interfaces (CLI/TUI/REST/Web)
   - tools/workflows (Taskfile, git, GitHub, telemetry)
6. Taskfile-driven automation for validating and packaging the framework.
7. Clear safety conventions (secrets handling, no force-push by default, reversible changes).
8. Documentation and templates that support multi-agent workflows (swarm patterns).
9. Compatibility with multiple AI assistants (Warp AI, Claude Code, etc.), while keeping docs self-contained.

---

# Specification Generation

Agent workflow for creating project specifications via structured interview.

Legend (from RFC2119): !=MUST, ~=SHOULD, ≉=SHOULD NOT, ⊗=MUST NOT, ?=MAY.

## Input Template

```
I want to build Warping Framework that has the following features:
1. Layered rule precedence for AI behavior
2. Lazy-loading guidance
3. SDD workflow (PRD → interview → SPECIFICATION → implement)
...
N. (additional features)
```

## Interview Process

- ~ Use Claude AskInterviewQuestion when available (emulate it if not available)
- ! If Input Template fields are empty: ask overview, then features, then details
- ! Ask one focused, non-trivial question per step
- ~ Provide numbered answer options when appropriate
- ! Include "other" option for custom/unknown responses
- ! make it clear which option you feel is RECOMMENDED
- ! when you are done, append to the end of this file all questions asked and answers given.

**Question Areas:**

- ! Missing decisions (language, framework, deployment)
- ! Edge cases (errors, boundaries, failure modes)
- ! Implementation details (architecture, patterns, libraries)
- ! Requirements (performance, security, scalability)
- ! UX/constraints (users, timeline, compatibility)
- ! Tradeoffs (simplicity vs features, speed vs safety)

**Completion:**

- ! Continue until little ambiguity remains
- ! Ensure spec is comprehensive enough to implement

## Output Generation

- ! Generate as SPECIFICATION.md
- ! follow all relevant warping guidelines
- ! use RFC2119 MUST, SHOULD, MAY, SHOULD NOT, MUST NOT wording
- ! Break into phases, subphases, tasks
- ! end of each phase/subphase must implement and run testing until it passes
- ! Mark all dependencies explicitly: "Phase 2 (depends on: Phase 1)"
- ! Design for parallel work (multiple agents)
- ⊗ Write code (specification only)

## Afterwards

- ! let user know to type "implement SPECIFICATION.md" to start implementation

**Structure:**

```markdown
# Project Name

## Overview

## Requirements

## Architecture

## Implementation Plan

### Phase 1: Foundation

#### Subphase 1.1: Setup

- Task 1.1.1: (description, dependencies, acceptance criteria)

#### Subphase 1.2: Core (depends on: 1.1)

### Phase 2: Features (depends on: Phase 1)

## Testing Strategy

## Deployment
```

## Best Practices

- ! Detailed enough to implement without guesswork
- ! Clear scope boundaries (in vs out)
- ! Include rationale for major decisions
- ~ Size tasks for 1-4 hours
- ! Minimize inter-task dependencies
- ! Define clear component interfaces

## Anti-Patterns

- ⊗ Multiple questions at once
- ⊗ Assumptions without clarifying
- ⊗ Vague requirements
- ⊗ Missing dependencies
- ⊗ Sequential tasks that could be parallel

---

# Interview Transcript (Q&A)

## Q1: Primary target user and usage mode
**Answer**: Primary = small team (2–10) using Warping as “house rules”. Secondary (light) = solo developer. Must be local-first, deterministic, low ceremony (no Python knowledge required). Optimized for static sites (HTML + Tailwind + tiny JS). Not open-source workflow; not swarm/multi-agent.

## Q2: What Warping should produce
**Answer**: Scaffold + ongoing generators.
- Scaffold outputs (repo root): `index.html`, `work/index.html`, `assets/`, `images/`, `CNAME`, `README.md`, `warp.config.json`, optional `robots.txt`, `sitemap.xml`, OG placeholder.
- Tailwind: CDN-based in v1, no build step.
- Generators: `wrun site:work`, `wrun site:project <slug>` create new files only; MUST NOT rewrite user-authored HTML.

## Q3: How `/work/index.html` lists projects without HTML rewrites
**Answer**: Generator-managed data file + tiny JS.
- Data file: `/assets/data/work.json`
- `wrun site:project <slug>` MUST ONLY: create `/work/<slug>/index.html` and append entry to `work.json`.
- JS constraints: vanilla JS, prefer <50 lines, progressive enhancement; no console errors; `file://` shows a hint.

## Q4: Runtime/dependency model for generators
**Answer**: Python runtime allowed (no Python knowledge required). Extend existing `wrun`. Scaffold into current directory (repo root).

## Q5: Shared layout handling
**Answer**: Fully static duplicated markup (no runtime includes). Generators guarantee consistency at creation time only.

## Q6: `warp.config.json` (format + scope)
**Answer**: `warp.config.json` (read-only by default). Scope = practical.
- Required: `site_title`, `site_description`, `base_url`, `author_name`
- Also: `cname`, `nav`, `seo_defaults`
- No design tokens in config for v1. No per-page overrides. No generator auto-editing this file outside explicit init.

## Q7: URL + file-path convention
**Answer**: Directory + `index.html`.
- `/work/<slug>/index.html` → `/work/<slug>/`
- All internal links use trailing slashes.
- `work.json.links.page` stores public URL (e.g. `/work/pack-match-3d/`).

## Q8: `file://` vs HTTP for project list rendering
**Answer**: HTTP required for list rendering.
- Under `file://`, the page loads and shows a hint to run `python3 -m http.server`.

## Q9: `nav` href rule
**Answer**: `nav[*].href` MUST be absolute-from-root (copy verbatim). Anchors must be `/#contact` not `#contact`.

## Q10: Asset path conventions
**Answer**: `/assets/` = generator-managed; `/images/` = human-managed.
- `seo_defaults` includes `og_image` = `/assets/images/og.png` and `favicon` = `/assets/images/favicon.png`.

## Q11: CSS/JS directory layout
**Answer**: Generator-managed code assets live under `/assets/`.
- `/assets/css/site.css` (optional small overrides)
- `/assets/js/work.js` (renderer)

## Q12: CLI command surface + prompting
**Answer**: Add `site:*` commands inside `wrun`.
- `wrun site:init` (scaffold)
- `wrun site:work` (ensure work page + JSON exist)
- `wrun site:project <slug>` (create project page + append JSON)
- `site:init` supports hybrid prompts + `--defaults`.

## Q13: Slug rules
**Answer**: Strict kebab-case only.
- Allowed: `a-z`, `0-9`, `-`
- Must start with letter/number; no trailing `-`; no `--`; length 2–60.
- Invalid slug → hard error; NO files changed.

## Q14: Project metadata collection
**Answer**: Hybrid.
- Default interactive prompts: `title` + `summary` (required), then optional `tags`, `links`, `metrics`.
- `--defaults`: write stub entry with TODO placeholders; non-interactive.
- Flags may prefill/override any field.

## Q15: Collisions + safety rules
**Answer**:
- `--force` supported, but MAY overwrite ONLY `/assets/*`.
- MUST NOT overwrite user-authored HTML (`/index.html`, `/work/index.html`, `/work/<slug>/index.html`).
- Duplicate slug in `work.json` → hard error; no changes.

## Q16: `site:init` default scaffold bundle
**Answer**: Practical bundle.
- Includes `/.nojekyll`, `/robots.txt` (allow all), `/sitemap.xml` (static: only `/` + `/work/`, never project pages).

## Q17: Default behavior on existing files (no `--force`)
**Answer**: Per-command behavior.
- `site:init`: fail if any of: `index.html`, `work/`, `assets/`, `warp.config.json` exist.
- `site:work`: create-missing only.
- `site:project`: fail if `/work/<slug>/` exists OR slug exists in `work.json`.

## Q18: Home page sections
**Answer**: Minimal landing.
- Required sections: `#work`, `#contact` (top is implicit).
- Contact default: `mailto:` + GitHub/LinkedIn links.

## Q19: Where contact info lives
**Answer**: In `warp.config.json`.
- Add `contact_email`.
- Add `socials.github` and `socials.linkedin`.

## Q20: `base_url` formatting rule
**Answer**: Strict; no normalization.
- MUST start with `https://`
- MUST NOT end with `/`
- Invalid → hard error; no files changed.
