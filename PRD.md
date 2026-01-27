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
