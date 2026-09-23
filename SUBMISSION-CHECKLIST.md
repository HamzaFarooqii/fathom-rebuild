# Submission checklist

## Capture integrity

- [x] Codex canary session passed (two independent sessions, see `CAPTURE-TEST.md`)
- [x] Claude Code canary session passed (two independent fresh `claude -p` sessions, see `CAPTURE-TEST.md`) — turned out not to be the trust flag after all; three real Windows PowerShell 5.1 bugs in the shared capture script (an unsupported `-Depth` parameter, an unsupported `-Encoding utf8NoBOM` parameter, and stdin/file reads defaulting to the system codepage instead of UTF-8) were silently breaking every Claude Code hook invocation. All three fixed; verified clean.
- [x] `CAPTURE-TEST.md` contains raw canary entries (both tools)
- [x] `.agent-logs/` is tracked and contains no secrets
- [x] Logs were committed throughout the build, not dumped at the end

## Product

- [x] Seeded meeting library is visible immediately (onboarding → dashboard)
- [x] Two-minute meeting flow works end to end (`launch-copy`, 126s)
- [x] One-hour/eight-person case is seeded and confirmed in a real browser against the live deployment (`q4-council`, 3588s, 8 participants) — screenshot-verified
- [x] Playback and transcript timestamps stay synchronized (`syncUI` drives player, transcript active-segment, and follow-mode from one `state.currentTime`) — screenshot-verified
- [x] Summary templates switch correctly (General/Executive/Sales, instant) — screenshot-verified
- [x] Action items and highlights work (completion persists to `localStorage`; highlights link to a public share route) — screenshot-verified
- [x] Search returns meaningful matches (titles, transcript text, people, actions — via Cmd/Ctrl+K) — screenshot-verified
- [x] Shared clip opens without authentication (`#/share/:id` renders with no auth check) — screenshot-verified
- [x] Responsive layout and keyboard focus — breakpoints at 1050px/720px, `:focus-visible`, reduced-motion — mobile viewport (390×844) screenshot-verified
- [x] Final branch/browser audit completed on `main`; fixes and screenshots are recorded in `qa/QA-REPORT.md`

## Quality gates

- N/A — Lint / Typecheck: the app is dependency-free vanilla HTML/CSS/JS by design (no `package.json`, no TypeScript); there is no lint/typecheck tooling to run
- N/A — Tests: no test suite exists; correctness was verified by full code reading plus `node --check` syntax validation of `app.js`/`data.js`
- N/A — Production build: `dist/` is the source and the deployed artifact directly; there is no build step
- [x] Console has no unexplained errors — verified with Playwright driving the system's installed Chrome against the live deployment (Playwright's own Chromium download was blocked by this sandbox's network, so it was pointed at the local Chrome install instead via `channel: 'chrome'`). Two rounds run: the first surfaced a stray favicon 404 and a route bug (see below); the second, after fixing both, came back clean.
- [x] Major routes have empty/error/not-found handling (empty search, empty filter result, 404 route — confirmed live) — fixed a real bug found during this QA pass: an invalid `#/meeting/:id` was silently rendering the first seeded meeting instead of the not-found state; `render()` now resolves the id first. No async loading states exist because all data is embedded synchronously (no network fetch to show a spinner for)

## Delivery

- [x] Live deployment opens in an incognito/private window — confirmed both via unauthenticated `curl` (no cookies, 200 on all assets) and a fresh, cookie-free Playwright browser context rendering and interacting with every major flow
- [x] Public repository opens while signed out of GitHub (`gh repo view` confirms `visibility: PUBLIC`)
- [x] Repository includes `.agent-logs/`
- [x] README explains scope and intentional stubs
- [ ] Camera-on walkthrough is under five minutes — script ready at `docs/WALKTHROUGH_SCRIPT.md`, not yet recorded (this needs a human on camera)
- [ ] Walkthrough covers product judgement and omitted scope — covered in the script, pending recording
- [x] Submission links are labeled `Live:` and `Repository:` (`docs/SUBMISSION.md`)

## Outstanding before final hand-in

1. Record the walkthrough video (script at `docs/WALKTHROUGH_SCRIPT.md`) and drop the link into `docs/SUBMISSION.md`.
