# Submission

Live: https://hamzafarooqii.github.io/fathom-rebuild/

Repository: https://github.com/HamzaFarooqii/fathom-rebuild

Walkthrough: https://www.loom.com/share/2ff3724d667d45cbb597b9a5f5eb9170

**Status:** `main` is the current product branch. PR #1 has been merged, and `gh-pages` is the deployment mirror.

## Notes for reviewers

- The product is a dependency-free static single-page app in `dist/`, deployed to GitHub Pages from the `gh-pages` branch. No build step is required to run or review it.
- Recording capture, calendar OAuth, and real transcription are intentionally simulated — this is labeled persistently in the product UI (not hidden in settings) and explained in the walkthrough.
- `docs/PRODUCT_RESEARCH.md` and `docs/SCOPE_DECISION.md` document what was researched and why the scope was cut the way it was, before any product code was written.
- `.agent-logs/` contains an automatic, unedited record of every prompt/response turn across both agent tools used to build this (Codex, then Claude Code) — see `SETUP.md` and `CAPTURE-TEST.md` for how that capture works and how it was verified.
- `qa/QA-REPORT.md` records the final branch review, browser workflow audit, responsive checks, defects corrected, and saved screenshots.
