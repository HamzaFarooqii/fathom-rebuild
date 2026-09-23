# Product research

Research was completed on 23 September 2026 before application code was started. It combines direct inspection of Fathom's public pages with Fathom's own help documentation. No private meeting data was used.

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

An authenticated end-to-end recording test could not be completed without creating or using an external Google or Microsoft account and granting calendar/meeting permissions. That would require user credentials and an account-level authorization step. The rebuild therefore uses a clearly disclosed simulated capture/onboarding layer and invests the build time in the post-meeting experience that can be evaluated safely and repeatedly.

## Product principles extracted from the research

1. Every generated claim should be easy to verify against a timestamped source.
2. The useful unit is not merely a meeting; it is a decision, action, question, or shareable moment inside it.
3. Dense, hour-long calls need navigation aids that short demos can hide.
4. Search and Ask should reduce time-to-evidence, not produce opaque prose.
5. The public share experience must be understandable without the sender's account context.
