# Product reconnaissance checklist

Do not use personal or confidential meeting content. Use a disposable test calendar and a scripted, non-sensitive meeting.

## Capture on every flow

For each step, save a screenshot, note the URL, entry point, primary action, loading state, success state, error/empty state, and anything surprisingly good or frustrating.

## Required flows

- Sign-up and onboarding
- Calendar connection and meeting preference controls
- Two-minute self-call with the notetaker present
- In-call highlight creation
- Post-call processing state
- Playback synchronized with transcript
- AI summary and template switching
- Action-item extraction
- Meeting-library search
- Transcript search and timestamp navigation
- Clip creation and unauthenticated recipient view
- One-hour/eight-person meeting behavior

## Questions to answer before coding

- What is the primary navigation and information hierarchy?
- Which post-meeting action is most prominent?
- How are speakers, timestamps, highlights, and playback synchronized?
- What changes between a short call and a dense one-hour call?
- Which actions persist, and which are only presentational?
- What must work on mobile?
- Which three details make the product feel unmistakably like Fathom?

Store screenshots under `recon/screenshots/` and anonymize any personal information before committing.
