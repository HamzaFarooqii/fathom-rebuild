# Fathom Rebuild

A focused rebuild of the Fathom AI meeting-notetaker experience for the 8x engineering assignment.

## Current status

**Preparation only. Application development has not started.** The repository-local agent capture hook must pass the required two-session canary test before any product code is added.

## Intended product slice

The build will prioritize the post-meeting workflow where Fathom creates the most value:

- A realistic, seeded meeting library
- Search across meetings
- Meeting detail with synchronized playback and transcript
- AI summary with switchable templates
- Action-item extraction and completion state
- Highlights that jump to exact transcript moments
- A shareable clip page that works without authentication
- A credible one-hour, eight-person meeting dataset

The recording bot and real transcription pipeline are intentionally candidates for stubbing. That tradeoff will be disclosed in the walkthrough so the time can go into the product experience being judged.

## Required sequence

1. Review and trust `.codex/hooks.json` in Codex.
2. Run the two-session capture test described in `SETUP.md`.
3. Complete `CAPTURE-TEST.md` from its template and commit the proof.
4. Perform product reconnaissance and save screenshots/notes under `recon/`.
5. Only then scaffold and build the application.

See `PLAN.md` for the execution plan and `SUBMISSION-CHECKLIST.md` for the final gate.
