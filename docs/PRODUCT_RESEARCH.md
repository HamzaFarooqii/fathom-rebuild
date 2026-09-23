# Product research

Research was completed in two passes. The first, on 23 September 2026, combined direct inspection of Fathom's public pages with Fathom's own help documentation, before application code was started. The second, later the same day, was a hands-on authenticated pass through the real free-plan product — see "Hands-on findings" below. No private meeting data was used in either pass.

## What was directly observed

- The public marketing site leads with a dark, high-contrast visual system and a prominent cyan call to action.
- Sign-up is intentionally narrow: a centered card offers Google or Microsoft identity providers rather than a long form.
- The public product information architecture emphasizes a meeting library and post-meeting intelligence: calls, folders/playlists, trackers, deals, and coaching.
- Fathom's help material consistently treats the recorded moment as the atomic unit. Summary bullets, transcript matches, search answers, and highlights link back to timestamps.
- The meeting detail experience is organized around playback plus Summary, Transcript, and Ask surfaces.

Screenshots captured during research:

- `recon/screenshots/fathom-homepage.png`
- `recon/screenshots/fathom-signup.png`
- `recon/screenshots/fathom-ask-help.png`

## Documented workflows

### Onboarding and capture

Fathom's quick-start flow covers account creation, Google or Microsoft calendar connection, personalization, desktop setup, and a test call. The product is currently in a transition between its legacy meeting-bot experience and a newer bot-free recording flow, so public documentation does not describe one universally available capture path.

### Meeting detail

The core post-call loop is: scan a generated summary, inspect an action or decision, jump to the cited moment, and review the transcript against playback. Long calls benefit from topic structure, speaker labels, transcript search, and timestamp navigation rather than a single undifferentiated transcript.

### Summaries and actions

Fathom supports several summary templates and custom summary instructions. Summaries can be copied with or without links. Action items may be generated or added manually, assigned to owners, and sent to external systems through integrations.

### Highlights and sharing

Highlights can be created from transcript ranges after a call and shared as links. The documented legacy in-call highlighting behavior differs from the newer capture rollout, but both models preserve the same product concept: a named, shareable moment with precise timing.

### Search and Ask

Search spans meeting titles, attendees, summaries, transcripts, and related metadata. Ask produces answers grounded in meeting content and cites the moments that support the answer. Citation-first answers are especially important because they let a user verify an AI claim immediately.

## Hands-on findings (authenticated pass)

Signed into the real free-plan product and captured the authenticated home screen, the team-onboarding path, and the Playlists feature. Did not join a live Zoom/Meet/Teams call — the "Start Test Call" step is a microphone/connectivity check, not something that produces a different transcript or summary than what the help-center research already documented, so running it wouldn't have added evidence about the summary/transcript/highlight/search/share experience. The rebuild instead implements its own real version of that same check (see below) rather than a screenshot of Fathom's.

- **Real navigation is `My Calls / Team Calls / Playlists / Alerts / Deals`**, not a simple meetings/highlights split. `Alerts` and `Deals` are clearly CRM/sales-tracker surfaces — this confirms the earlier decision to leave coaching, trackers, and deal intelligence out of scope, rather than revealing something that should have been included.
- **"Ask Fathom" is a persistent right-side panel present on every screen**, not a modal opened on demand, with an account-level usage promo and clickable suggested prompts ("Surprise me with an insight," "Summarize my meetings from this week"). The rebuild uses a keyboard-triggered (⌘/Ctrl+K) modal instead — a deliberate difference, not an oversight: a modal keeps the layout simpler for a 24-hour build while preserving the same grounded-answer, cite-your-source behavior.
- **Playlists are shareable collections of highlights spanning multiple meetings** (e.g. "CRM Updates — 2 Highlights," "Q3 Upcoming Sprints — 4 Highlights"), one layer above a single meeting's highlights. The rebuild's Highlights page is a flat cross-meeting list rather than named collections — a scope simplification, documented here rather than silently diverging from the real product.
- Onboarding surfaces a **tooltip/checklist overlay** ("Start your onboarding here!") over the home screen plus a dedicated **"Start Test Call"** card, rather than a dedicated full-screen onboarding flow. The rebuild uses a full-screen onboarding step instead, which better suits a first-time demo visitor who has no prior context (a returning Fathom user already knows the product; a grader opening this rebuild cold does not).
- The empty state for a fresh account is a simple centered `⊘ No call recordings` — validates the plain, low-ornament empty states already used throughout the rebuild.
- Sign-in offers Google, Microsoft, and SSO, styled as a narrow card with a rotating customer-quote panel beside it — matches what the first research pass already found from the marketing site.
- Visiting a team-scoped onboarding URL surfaced a **"Fathom Team Edition"** upsell (CRM auto-logging, conversational analytics, a 14-day trial) rather than a personal calendar-connection step — team and individual onboarding are evidently different flows; only the individual, free-plan side is in scope here.

Screenshots from this pass: `recon/screenshots/fathom-signin-real.png`, `fathom-home-authenticated.png`, `fathom-team-onboarding-upsell.png`, `fathom-playlists.png`.

### What this pass did not cover

A real recorded meeting was not produced, so the processed-meeting view (playback against transcript, generated summary, template switching, action-item extraction, and post-call highlight creation on an actual Fathom recording) was not independently re-verified beyond the help-center documentation already cited above. This is a real, disclosed gap in primary research, not something to gloss over — the rebuild's fidelity for that specific surface rests on secondary sources (Fathom's own help articles) rather than a first-hand recording.

## Marketing-site deep dive (unauthenticated, third pass)

Fathom's own `/overview` page turns out to carry real product UI mockups and specifics that the earlier home/help-doc pass didn't surface, fully reachable without an account:

- **Fathom is now part of Superhuman** (a recent acquisition banner on the homepage) — current company context, not a rebuild concern, but worth knowing the product is mid-transition, which explains the mixed legacy/new UI patterns noted in the authenticated pass above.
- **Three capture modes, chosen per-meeting, not just one bot/no-bot toggle**: "Audio & video," "Audio," and "Transcript only" — the last explicitly marketed as bot-free ("No bot. Just a clean transcript, AI summary, and action items. Perfect for sensitive conversations or when a bot isn't welcome."). This is more nuanced than "the bot is stubbed" — it's a real, user-facing choice about *how much* to capture, independent of whether a bot joins visibly.
- **Summaries update live, during the call**, not only after it ends — "Live summaries update as you talk, so when you lose the thread, you can quickly catch up without missing a beat." The rebuild has no in-progress-meeting state at all (everything is post-call), which is a reasonable and disclosed scope cut given the assignment's own emphasis on the *post*-meeting workflow, but it's a real product surface this rebuild doesn't attempt.
- **A private, per-meeting scratchpad** during the call — personal notes by default, or `@mention` a teammate to start a thread on a note before the call even ends.
- **The real meeting-detail tab bar is `Summary / Action Items / Comments / Transcript / Related`** — not the `Summary / Transcript / Ask` structure the earlier help-doc pass inferred. `Comments` (threaded discussion on a meeting) and `Related` (linked meetings) are both features this rebuild does not have; `Ask` and `Highlights`, which this rebuild does have as their own tabs, aren't top-level tabs in the real product at all — Ask lives in the persistent side panel (see the authenticated-pass findings above) and highlights surface elsewhere. The rebuild's tab structure is a deliberate simplification for a 24-hour build, not an attempt to mirror this exactly.
- **Desktop and iOS apps** handle meeting reminders, one-click join, and in-person (non-video-call) capture — entirely out of scope for a web rebuild, noted for completeness.
- Cross-meeting Ask includes an explicit **scope selector** ("All meetings / Team meetings / My meetings") — the rebuild's global Ask (see the Claude Code session that added it) doesn't scope by team/mine since there's only one seeded user, but the underlying idea — pick how wide the question searches — matches what was already built.

None of this changes the scope decision (post-meeting intelligence over live-call features and bot engineering); it makes the disclosed gaps and simplifications more precise. Screenshots: `recon/screenshots/fathom-home-marketing.png`, `fathom-capture-modes.png`, `fathom-transcription-speakers.png`, `fathom-live-summary-scratchpad.png`, `fathom-ask-across-meetings.png`.

## Sources

- [Fathom overview](https://www.fathom.ai/overview)
- [Fathom home](https://www.fathom.ai/)
- [Quick Start Guide](https://help.fathom.video/en/articles/276608)
- [Ask Fathom](https://help.fathom.video/en/articles/3239425)
- [AI Search](https://help.fathom.video/en/articles/7374465)
- [Ask limits](https://help.fathom.video/en/articles/10390017)
- [Custom summaries](https://help.fathom.video/en/articles/3239809)
- [Highlights](https://help.fathom.video/en/articles/295424)
- [Post-meeting highlights](https://help.fathom.video/en/articles/295680)
- [Release notes](https://help.fathom.video/en/articles/6220097)

## Research limitation

The authenticated pass above confirmed navigation, IA, onboarding, and the empty-account state hands-on. What it did not produce is an actual recorded meeting — that requires joining a live Zoom/Meet/Teams call, which is a real-time, one-shot event rather than something that can be redone cheaply if it goes wrong, and the "Start Test Call" step that would start it is a microphone check, not a meeting recording. The processed-meeting view (playback against transcript, generated summary, template switching, action items, post-call highlighting) therefore still rests on Fathom's help-center documentation rather than a first-hand recording. The rebuild uses a clearly disclosed simulated capture/onboarding layer for that reason, and invests the build time in the post-meeting experience that can be evaluated safely and repeatedly — while adding one piece of real functionality of its own where it was cheap to do so: an actual, working microphone check in onboarding (Web Audio API, live volume detection), rather than a static "connected" checkmark.

## Product principles extracted from the research

1. Every generated claim should be easy to verify against a timestamped source.
2. The useful unit is not merely a meeting; it is a decision, action, question, or shareable moment inside it.
3. Dense, hour-long calls need navigation aids that short demos can hide.
4. Search and Ask should reduce time-to-evidence, not produce opaque prose.
5. The public share experience must be understandable without the sender's account context.
