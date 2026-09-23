# Scope decision

## Product bet

This rebuild focuses on the post-meeting intelligence loop: find a meeting, understand it quickly, verify the source, act on the outcome, and share a precise moment. That is the portion of the product with the highest visible UX density and the clearest opportunity to demonstrate product judgment within a 24-hour assignment.

## Included

- A lightweight onboarding flow that explains the demo, simulates calendar connection, and includes one genuinely functional step — a real, working microphone check (Web Audio API), rather than another static checkmark
- A seeded meeting library with realistic short, medium, and one-hour meetings
- A meeting detail workspace with simulated playback, scrubbing, timestamp navigation, and transcript follow mode
- Switchable General, Executive, and Sales summary templates
- Actions and decisions with persistent completion state
- Highlights and clips that jump to exact moments, including creating a new highlight directly from any transcript segment (persisted to this browser, removable, immediately shareable)
- A public, account-free clip view with a shareable URL
- Global search across meetings, people, transcript text, actions, and decisions, plus a workspace-level "Ask across meetings" that answers natural-language questions with citations spanning all seeded meetings, not just one
- A deterministic Ask experience with timestamped citations
- A credible 60-minute, eight-person meeting designed to stress the interface
- Responsive layouts, keyboard access, visible focus states, and reduced-motion support

## Intentionally stubbed

- Live recording bot and media ingestion
- Real audio/video storage and transcription
- OAuth, account creation, and calendar permissions
- Email delivery and external CRM/task integrations
- Multi-user authorization, billing, and team administration

The stubs are explicit in the product and documentation. They preserve the shape of the workflow without implying that sensitive capture or identity infrastructure is production-ready.

## Deliberately omitted

- Coaching scorecards and deal intelligence
- Custom tracker builders
- Full transcript editing and speaker-reassignment workflows
- Native desktop capture
- Production analytics and observability

These are valuable but would dilute the core loop. The chosen slice is complete enough to evaluate as a product rather than a collection of disconnected screens.

## Information architecture

- `#/meetings` — seeded meeting library and filters
- `#/meeting/:id` — player, summary, transcript, actions, highlights, and Ask
- `#/highlights` — reusable moments across meetings
- `#/share/:clipId` — public clip recipient view
- Global command/search panel — cross-meeting retrieval and grounded Ask

## Visual thesis

The interface uses editorial clarity with studio polish: warm light surfaces, deep navy structure, an electric indigo/cyan accent, compact typography, and waveform/timeline graphics that communicate function. It intentionally avoids copying Fathom's proprietary illustrations, logos, or exact page composition.

## Technical decision

The deliverable is a dependency-free static single-page application in `dist/`, deployed with OpenAI Sites. It uses semantic HTML, CSS, and browser JavaScript so the assignment is fast to load, easy to audit, and resilient during review. Demo state is stored in `localStorage`; all source data remains deterministic and resettable.

## Success criteria

- A reviewer can understand the product within 30 seconds of opening it.
- The one-hour meeting remains navigable, not merely populated.
- Every summary or Ask result can lead back to evidence.
- The public clip route works without sign-in.
- The product clearly labels simulated capture behavior.
