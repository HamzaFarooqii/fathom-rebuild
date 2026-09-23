# Reverb — a Fathom rebuild

A focused rebuild of the Fathom AI meeting-notetaker experience for the 8x engineering assignment, shipped as **Reverb**: a post-meeting intelligence workspace.

## Current status

The product is built and deployable. Agent-capture compliance, product research, scope decisions, and the full application (`dist/`) are all in this repository.

- `docs/PRODUCT_RESEARCH.md` — what was observed about Fathom before any code was written
- `docs/SCOPE_DECISION.md` — what was built, stubbed, and omitted, and why
- `dist/` — the application itself (see [Tech approach](#tech-approach))
- `.agent-logs/` — automatic per-turn prompt/response capture (see [Agent capture](#agent-capture))

## Product slice

The build prioritizes the post-meeting workflow where Fathom creates the most value:

- A realistic, seeded meeting library (a 2-minute internal check-in, a ~30-minute customer call, and a dense 60-minute/8-person meeting)
- Meeting detail with a simulated player, timeline, and transcript that stay in sync
- Switchable AI summary templates (General, Executive, Sales) with decisions and next steps
- Action items with owners and persistent completion state
- Highlights that jump to exact transcript moments, plus a public/unauthenticated clip share page
- Global search and a deterministic, citation-grounded Ask experience
- A lightweight onboarding flow that simulates calendar connection

The recording bot, real transcription pipeline, and OAuth/calendar integration are intentionally stubbed — this is disclosed in the product itself (a persistent "simulated" label) and in the walkthrough, so the build time goes into the post-meeting experience that's actually being judged.

## Tech approach

`dist/` is a dependency-free static single-page app: semantic HTML, hand-written CSS (design tokens, responsive breakpoints, reduced-motion support), and vanilla browser JavaScript with hash-based routing. No build step, no framework, no `package.json`. That was a deliberate speed/reliability tradeoff for a 24-hour assignment — it loads instantly, is trivial to audit line-by-line, and has zero dependency/version risk during review. Demo state (action-item completion) persists to `localStorage`; all seed data is deterministic and resettable.

Run it locally with any static file server, e.g.:

```bash
npx serve dist
# or
python -m http.server 8080 --directory dist
```

## Agent capture

Every prompt/response turn in this repository is captured automatically to `.agent-logs/` via lifecycle hooks — no manual copy-paste. The same PowerShell script (`scripts/capture-agent-turn.ps1`) backs hooks for both tools used on this project:

- **Codex** — `.codex/hooks.json` (verified first; see `CAPTURE-TEST.md`)
- **Claude Code** — `.claude/settings.json`, added when the build continued in Claude Code

See `SETUP.md` for the verification procedure.

## Docs

- `docs/PRODUCT_RESEARCH.md` — Fathom research notes
- `docs/SCOPE_DECISION.md` — scope, stubs, and information architecture
- `docs/WALKTHROUGH_SCRIPT.md` — the camera-on walkthrough script
- `docs/SUBMISSION.md` — final submission links
- `qa/QA-REPORT.md` — branch review, browser workflow matrix, fixes, and screenshots
- `SUBMISSION-CHECKLIST.md` — pre-submission gate
- `PLAN.md` — the original 24-hour execution plan
