# Walkthrough script (target: under 5 minutes)

Camera on. Screen-share the live deployment, not localhost.

## 0:00–0:30 — Framing

"This is Reverb, a rebuild of Fathom's post-meeting workflow for the 8x assignment. I studied Fathom's real product and help docs first — that research and my scope decisions are written up in `docs/PRODUCT_RESEARCH.md` and `docs/SCOPE_DECISION.md`. The bet: the recording bot is a commodity, so I stubbed it and put the time into the part that actually creates value — turning a call into something you can verify and act on afterward."

## 0:30–1:00 — Dashboard

Open the live URL → land on onboarding. Point out the fourth onboarding step, "Voice check" — click "Test call" and let it actually listen for a couple of seconds.

"Everything else in onboarding is explicitly simulated — this one isn't. It's a real microphone check, same idea as Fathom's own test-call step, just done with a live Web Audio meter instead of a static checkmark."

Then click "Open the 60-minute meeting" once, and navigate back to `#/meetings`.

"Meeting library: seeded with a 2-minute internal check-in, a 30-minute customer call, and a dense 60-minute, 8-person product council — that last one is the stress-test case. Filters, per-meeting metadata, and workspace stats are all live against the same data model."

## 1:00–2:15 — Long meeting detail (the core loop)

Open the 60-minute/8-person meeting.

"This is the highest-priority surface. Timeline with topic markers and highlight markers, 8-person stage. I'll hit play, then jump around."

- Click a topic chip on the timeline → note the player time and "now speaking" update.
- Switch to the Transcript tab → click a timestamp on a segment → show the transcript scrolling and highlighting in sync with playback position, then toggle "Resume/Following" after manually scrolling.
- Click a citation button inside the Summary tab → show it seeking playback directly from cited evidence.

"Every AI claim in this product links back to a timestamp. That was the single principle from my research I built the whole detail page around."

## 2:15–3:00 — Summaries, actions, highlights

- Switch the summary template dropdown General → Executive → Sales, instantly.
- Actions tab: check off an item, reload/re-open the meeting to show completion persisted.
- Highlights tab: open a highlight, click "Public clip."

## 3:00–3:40 — Public share page

On the share page (new tab or note it's unauthenticated):

"This is the recipient view — no login, no app chrome. Just the moment, the quote, and the source meeting."

## 3:40–4:20 — Search and Ask

- `Cmd/Ctrl+K` → type "SSO" → show grounded cross-meeting keyword results (meeting, transcript, action hits).
- In the same box, type a full question — "What did we decide about SSO?" → show the "Across 3 meetings" answer card that appears above the results, with citations back to the specific meeting and timestamp. Click one to jump straight there.
- Open Ask on a single meeting's tab too → click a suggested question → show the per-meeting version of the same idea.

"Search and Ask are deterministic for the demo, but every answer — whether it's scoped to one meeting or asking across all of them — still cites a real meeting and timestamp rather than free-floating prose."

## 4:20–4:50 — Architecture and judgment

"Build side: dependency-free static SPA — no framework, no build step — intentional for a 24-hour assignment where reliability during review matters more than a component library. State is hash-routed and localStorage-backed. Everything explicitly stubbed — recording, OAuth, transcription — is labeled 'simulated' persistently in the UI, not hidden in a settings page."

## 4:50–5:00 — Close

"Full scope tradeoffs are in `docs/SCOPE_DECISION.md`, agent-capture logs are in `.agent-logs/` for every turn across both Codex and Claude Code sessions that built this. Thanks."

---

## Explicit stub disclosure (say this out loud, don't skip it)

- No real meeting bot, calendar OAuth, or audio/video capture — the microphone check in onboarding is real (it actually listens), but nothing downstream of it is a real recording.
- No production transcription or LLM inference at request time — summaries, Ask, and search are deterministic against seeded content, cited to real timestamps.
- No billing, team administration, or CRM integrations (Fathom's real `Alerts`/`Deals` tabs and coaching features — confirmed by signing into the real product, not guessed).
- Research was hands-on for navigation, onboarding, and account state (signed into the real free plan), but not for an actual recorded meeting — that specific gap (transcript/summary/highlight fidelity) rests on Fathom's own help-center documentation rather than a first-hand recording. Said plainly here rather than left as a doc footnote.
