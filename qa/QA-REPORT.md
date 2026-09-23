# Browser QA report

Audit date: 24 September 2026  
Source branch: `main` at `f3b0f1b`, plus the fixes documented below  
Browsers: Codex in-app browser for interaction testing; installed Chrome for saved visual captures

## Branch review

`main` is the current product branch. At the start of this audit it contained seven feature/documentation commits not present on `codex/fathom-rebuild`. `gh-pages` was a deployment mirror of `main`, not an independent source branch.

## Workflow matrix

| Workflow | Result | Evidence |
| --- | --- | --- |
| Onboarding | Pass | Capture modes update their descriptions and persist into the meeting player. The 60-minute CTA opens the correct seeded meeting. |
| Microphone check | Manual permission gate | The optional flow and denial/error handling are implemented. Automated QA did not grant OS/browser microphone permission. |
| Meeting library | Pass | All three seeded meetings render. Product, Customer, and Internal filters return the expected rows. |
| Long-call player | Pass | Play/pause advances time, timeline seeking works, topics and highlight markers are present, and the eight-person layout renders at desktop and mobile sizes. |
| Summary templates | Pass | General, Executive, and Sales switch immediately; citations seek the shared player. |
| Transcript | Pass | Text search filters the transcript and timestamp clicks seek playback. |
| Actions | Pass | Completion updates visually and survives a reload through `localStorage`. |
| Highlights | Pass | A transcript segment can become a highlight; counts update and the clip appears in the library. |
| Meeting Ask | Pass | Suggested and typed questions produce deterministic answers with source timestamps. |
| Global search / Ask | Pass after fix | Search returns meeting, transcript, and action results. Questions now prioritize matching decision text instead of returning unrelated decisions. |
| Public clip | Pass after fix | A valid clip opens without authentication. Invalid clip IDs now show a clear unavailable state. |
| Missing meeting route | Pass | Unknown meeting IDs render the not-found state. |
| Responsive navigation | Pass after fix | The mobile drawer works; the page no longer scrolls horizontally; participant tiles resize instead of being clipped. |
| Accessibility semantics | Pass after fix | Tabs expose selected state, the timeline exposes current value/time, action labels no longer nest buttons, and the search dialog has an accessible name. |
| Console | Pass | No warnings or errors were recorded during the tested workflows. |

## Defects found and corrected

1. The meeting workspace exceeded the viewport at narrow widths because the grid and aspect-ratio player retained desktop minimum sizing.
2. Cross-meeting Ask treated short domain terms such as `SSO` poorly and could return unrelated decisions.
3. Invalid public-share IDs silently fell back to the first meeting.
4. The public clip play label inherited white text on a white button.
5. Tabs and the timeline did not expose complete state to assistive technology, and action rows contained an interactive button inside a checkbox label.

## Captures

- `qa/screenshots/01-onboarding.png`
- `qa/screenshots/02-meeting-library.png`
- `qa/screenshots/03-long-meeting.png`
- `qa/screenshots/04-long-meeting-mobile.png`
- `qa/screenshots/05-public-share.png`

## Remaining human-only step

Record the camera-on walkthrough and add its URL to `docs/SUBMISSION.md`. This is the only submission requirement that cannot be completed autonomously.
