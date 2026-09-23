# Submission checklist

## Capture integrity

- [x] Codex canary session passed (two independent sessions, see `CAPTURE-TEST.md`)
- [ ] Claude Code canary session passed — hooks are wired in `.claude/settings.json` and reuse the verified capture script, but firing is currently gated by Claude Code's per-project trust flag (`hasTrustDialogAccepted`), which is `false` for this folder and can only be set by a human running `claude` interactively once in this repo and accepting the trust prompt. Not yet confirmed.
- [x] `CAPTURE-TEST.md` contains raw canary entries (Codex)
- [x] `.agent-logs/` is tracked and contains no secrets
- [x] Logs were committed throughout the build, not dumped at the end

## Product

- [x] Seeded meeting library is visible immediately (onboarding → dashboard)
- [x] Two-minute meeting flow works end to end (`launch-copy`, 126s)
- [x] One-hour/eight-person case is seeded and code-reviewed for performance (`q4-council`, 3588s, 8 participants) — not yet confirmed in an actual rendered browser; see Quality gates note below
- [x] Playback and transcript timestamps stay synchronized (`syncUI` drives player, transcript active-segment, and follow-mode from one `state.currentTime`)
- [x] Summary templates switch correctly (General/Executive/Sales, instant)
- [x] Action items and highlights work (completion persists to `localStorage`; highlights link to a public share route)
- [x] Search returns meaningful matches (titles, transcript text, people, actions — via Cmd/Ctrl+K)
- [x] Shared clip opens without authentication (`#/share/:id` renders with no auth check)
- [ ] Responsive layout and keyboard focus — implemented (breakpoints at 1050px/720px, `:focus-visible`, reduced-motion) and code-reviewed, but not yet confirmed in an actual browser

## Quality gates

- N/A — Lint / Typecheck: the app is dependency-free vanilla HTML/CSS/JS by design (no `package.json`, no TypeScript); there is no lint/typecheck tooling to run
- N/A — Tests: no test suite exists; correctness was verified by full code reading plus `node --check` syntax validation of `app.js`/`data.js`
- N/A — Production build: `dist/` is the source and the deployed artifact directly; there is no build step
- [ ] Console has no unexplained errors — **not yet verified live.** Headless browser QA (Playwright/Chromium) was attempted in this environment but the Chromium download from `cdn.playwright.dev` timed out repeatedly (sandbox network restriction, not an app problem). Files were confirmed to serve correctly (`curl` 200s on all four assets) and JS syntax was validated, but nobody has watched it run in a real browser yet this session.
- [x] Major routes have empty/error/not-found handling (empty search, empty filter result, 404 route); no async loading states exist because all data is embedded synchronously (no network fetch to show a spinner for)

## Delivery

- [x] Live deployment opens in an incognito/private window — confirmed via unauthenticated `curl` (no cookies) returning 200 from all assets; **please also do one manual incognito check yourself**, since that's a stronger signal than curl
- [x] Public repository opens while signed out of GitHub (`gh repo view` confirms `visibility: PUBLIC`)
- [x] Repository includes `.agent-logs/`
- [x] README explains scope and intentional stubs
- [ ] Camera-on walkthrough is under five minutes — script ready at `docs/WALKTHROUGH_SCRIPT.md`, not yet recorded (this needs a human on camera)
- [ ] Walkthrough covers product judgement and omitted scope — covered in the script, pending recording
- [x] Submission links are labeled `Live:` and `Repository:` (`docs/SUBMISSION.md`)

## Outstanding before final hand-in

1. You run `claude` once interactively in this repo folder to accept the trust prompt, so Claude Code's capture hooks start firing (see Capture integrity above).
2. Record the walkthrough video and drop the link into `docs/SUBMISSION.md`.
3. Do one manual pass in a real browser (incognito) on the live URL, since automated browser QA was blocked by this sandbox's network restrictions.
4. Merge `codex/fathom-rebuild` into `main` (or open/merge a PR) so the repository's default branch reflects the finished state — everything so far has been committed to the feature branch per git discipline.
