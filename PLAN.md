# 24-hour execution plan

## Product thesis

Build the smallest believable version of Fathom's post-meeting workflow. The demonstration should make one complete story feel excellent: find a meeting, understand it quickly, verify a moment against playback, extract follow-up work, and share a useful clip.

## Scope priorities

### P0 — must ship

- Responsive app shell and populated meeting library
- Search over titles, participants, transcript text, and summary content
- Meeting detail page with media player, transcript, active-speaker styling, and timestamp navigation
- Summary tabs/templates with realistic generated content
- Action items with owners and completion state
- Highlight creation and navigation
- Public, unauthenticated shared-clip route
- Seeded two-minute meeting plus one-hour/eight-person meeting
- Loading, empty-search, error, and not-found states
- Public deployment and public repository

### P1 — ship if the core is polished

- Keyboard shortcuts and command palette
- Copy/export summary actions
- Participant filters and transcript search
- Share dialog with clip-range controls
- Lightweight onboarding/calendar-connect simulation

### Explicitly stubbed or omitted

- Real meeting bot
- Real calendar OAuth
- Live audio/video capture
- Production transcription and LLM inference
- Billing, teams administration, and CRM integrations

## Suggested technical approach after capture passes

- Next.js with TypeScript
- Tailwind CSS plus accessible headless primitives
- Static typed fixtures for meetings, speakers, transcript segments, summaries, highlights, and clips
- Browser state/local storage for lightweight persistence
- A bundled or openly licensed demo media asset
- Vercel deployment

No backend is required unless reconnaissance reveals a high-value interaction that truly needs one.

## Time budget

1. **0:00–1:30 — Reconnaissance:** use Fathom end to end, take screenshots, map information architecture and interaction states.
2. **1:30–2:00 — Product cut:** lock P0 scope, data model, routes, and visual tokens.
3. **2:00–3:00 — Scaffold:** create the app, quality tooling, fixtures, and deployment baseline.
4. **3:00–8:00 — Core vertical slice:** library → meeting detail → playback/transcript → summary/actions.
5. **8:00–11:00 — Sharing and search:** highlights, clip creation, public clip route, global search.
6. **11:00–14:00 — Large-meeting realism:** eight speakers, one-hour timeline, dense transcript, performance checks.
7. **14:00–17:00 — UX polish:** responsive states, keyboard/focus behavior, animations, empty/error states.
8. **17:00–19:00 — Verification:** lint, typecheck, tests, production build, cross-browser/responsive checks.
9. **19:00–21:00 — Deployment and outsider test:** verify incognito access to the app and shared clip.
10. **21:00–23:00 — Walkthrough:** rehearse and record a camera-on video under five minutes.
11. **23:00–24:00 — Submission buffer:** public-repo check, agent-log audit, final links and contingency time.

## Commit rhythm

Commit agent logs with the related work throughout the build. Suggested milestones:

1. `chore: configure automatic agent capture`
2. `docs: record capture canaries and product reconnaissance`
3. `chore: scaffold application and deployment`
4. `feat: add seeded meeting library and search`
5. `feat: add meeting playback transcript and summaries`
6. `feat: add highlights actions and public clip sharing`
7. `fix: harden responsive states and accessibility`
8. `docs: add walkthrough and submission links`
