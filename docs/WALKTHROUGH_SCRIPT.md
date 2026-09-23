# Reverb walkthrough runbook

Target length: **4:30–4:45**. Hard limit: **5:00**.
Required: **camera on**, live deployment on screen, and no localhost footage.

Live app: https://hamzafarooqii.github.io/fathom-rebuild/

## Before you record

Do this once, before pressing Record:

1. Use Chrome or Edge at 100% zoom with a 1440×900 or larger recording area.
2. Close email, chat, password managers, personal tabs, and notifications.
3. Put your camera bubble in the lower-left corner. Do not cover the top-right Share/Ask buttons or the right-side meeting panel.
4. Open the live app at `#/onboarding` and confirm it loads while signed out.
5. Select **Audio & video** in the capture-mode picker so the eight-person stage appears during the demo.
6. Open `#/meeting/q4-council`, go to Actions, and make sure the first action is unchecked. If it is already checked, click it once to reset it.
7. Remove any highlight tagged **Yours** so the highlight you create during the recording is obvious.
8. Return to `#/onboarding` and stop clicking.
9. Test your microphone and camera in the recording tool. Do not run Reverb's microphone test during the final walkthrough; the browser permission prompt can waste time.
10. Start screen recording with your camera visible, wait one second, then begin speaking.

Keep the mouse still while you speak. Click only when the matching instruction below says to click.

## Exact recording workflow

### 0:00–0:25 — Introduce the product

**Show:** Onboarding page, camera visible.

**Say:**

> Hi, I’m Hamza. This is Reverb, my rebuild of Fathom for the 8x assignment. I researched Fathom’s real onboarding, meeting detail, summaries, search, Ask, highlights, and sharing before I wrote the product. I focused the build on the highest-value loop: turning a meeting into decisions and actions that anyone can verify against the exact moment.

### 0:25–0:55 — Explain onboarding and scope

**Do:** Point at the completed onboarding steps, the optional Voice check, and the three capture-mode choices. Do not click **Test call**.

**Say:**

> This onboarding is intentionally lightweight. Calendar connection, recording, and transcription are simulated and clearly labeled. The optional voice check is real, and the capture picker reflects audio-and-video, audio-only, and bot-free transcript-only workflows. I stubbed the capture infrastructure so I could spend the time on the post-meeting product reviewers actually use.

**Do:** Click **Open the 60-minute meeting**.

### 0:55–1:35 — Demonstrate the long-call stress case

**Show:** The eight-person Q4 product council.

**Say:**

> This is the case that matters: a 60-minute meeting with eight participants, realistic transcript density, topic chapters, actions, decisions, and highlights. The same workspace also includes a two-minute check-in and a 30-minute customer call.

**Do:**

1. Click **Play** for one or two seconds, then pause.
2. Click the **SSO** topic chip.
3. Point at the updated player time and current speaker.

**Say:**

> Playback, topic navigation, speaker state, transcript position, citations, and highlights all share one timeline. A user can skip directly to meaning instead of scrubbing through an hour of video.

### 1:35–2:10 — Prove transcript and evidence synchronization

**Do:**

1. Click the **Transcript** tab.
2. Type `SAML` into **Find in transcript**.
3. Click the first matching transcript segment.
4. Clear the transcript search.
5. Click **Summary**, then click the `15:38` citation beside the SSO decision.

**Say:**

> Transcript search finds the exact language, and every important AI-generated claim links back to evidence. Clicking a transcript segment or a summary citation seeks the same player. Grounded verification was the main product principle I took from researching Fathom.

### 2:10–2:45 — Show summaries and accountable actions

**Do:**

1. In the Summary dropdown, switch **General → Executive → Sales**, then return to **General**.
2. Open **Actions 7**.
3. Check the first action.
4. Refresh the browser.
5. Open **Actions 7** again and point at the still-checked item.

**Say:**

> The same meeting can be reframed instantly for different jobs. Actions include an owner, due date, and source moment. Completion persists in the browser, so this is a working workflow rather than a static mock-up.

### 2:45–3:20 — Create and share a highlight

**Do:**

1. Open **Transcript**.
2. Hover the first visible segment and click its **✦** button.
3. Open **Highlights** and point at the new card tagged **Yours**.
4. On any stable seeded highlight, click **Public clip**.

**Say:**

> A user can turn any transcript moment into a reusable highlight. This public recipient view works without an account and removes the full application chrome, so the recipient gets only the quote, timing, and source meeting.

**Do:** Click the Reverb logo to return to the meeting library.

### 3:20–4:05 — Demonstrate global search and Ask

**Do:**

1. Press **Ctrl+K** on Windows or **Cmd+K** on macOS.
2. Type `SSO` and pause so the meeting, transcript, and action results are visible.
3. Replace it with `What did we decide about SSO?`.
4. Point at the **Across 3 meetings** answer and its timestamp citations.
5. Click the first cited result to jump back to its meeting moment.
6. Open the meeting’s **Ask** tab and click **Who owns the next steps?**

**Say:**

> Global search retrieves exact evidence across titles, people, transcripts, and actions. Ask turns that evidence into a concise answer with meeting and timestamp citations. The demo answers are deterministic, but they never become untraceable free-floating prose. The same grounded pattern also works inside one meeting.

### 4:05–4:35 — Explain engineering judgment and omissions

**Show:** Keep the Ask answer or meeting detail visible. Do not open code or the repository.

**Say:**

> I built Reverb as a dependency-free static application for speed, reliability, and easy review. It is responsive, keyboard accessible, and seeded with realistic data. Recording bots, OAuth, production transcription, billing, team administration, and CRM integrations are intentionally out of scope. Those tradeoffs are documented in the repository alongside the product research, browser QA report, screenshots, and automatic agent logs.

### 4:35–4:45 — Close cleanly

**Say:**

> The live product and public repository are linked in the submission. Thanks for watching.

Stop speaking, hold the final screen for one second, then stop the recording.

## What the finished video must visibly prove

- Your camera stays on for the entire video.
- The browser is on `hamzafarooqii.github.io`, never localhost.
- The long meeting shows 59:48 and eight participants.
- A topic or timestamp changes the shared player position.
- At least two summary templates visibly change the overview.
- An action remains checked after refresh.
- A new highlight appears with the **Yours** badge.
- The public clip opens without a sign-in screen.
- Global Search and Ask show timestamped evidence.
- You say out loud that recording, OAuth, transcription, and runtime AI are simulated or deterministic.

## If something goes wrong while recording

- **A browser permission prompt appears:** dismiss it and continue. Do not troubleshoot permissions on camera.
- **The action is already checked:** uncheck it, then check it again before refreshing.
- **A custom highlight already exists:** use another transcript segment. Do not delete items during the video.
- **Search is still open when you need to navigate:** press Escape once.
- **You miss a click:** continue speaking and make the click. Do not restart unless the wrong page or private information was shown.
- **You reach 4:30 before the final section:** skip the per-meeting Ask example and deliver the engineering judgment and closing lines.

## After recording

1. Confirm the exported video is under five minutes.
2. Watch it once with sound and confirm your camera is visible throughout.
3. Open the video link in a signed-out/incognito window.
4. Paste the public video URL into the `Walkthrough:` line in `docs/SUBMISSION.md`.
5. Commit and push that one documentation change.

## Mandatory disclosure — do not omit

Say these facts during the walkthrough, in your own words if necessary:

- Calendar connection, the recording bot, media capture, and transcription are simulated.
- The onboarding microphone check is real, but it is not a recording pipeline and stores no meeting.
- Summaries, Search, and Ask run deterministically against seeded data rather than calling a production LLM at request time.
- Billing, team administration, coaching, deals, and CRM integrations are outside this build’s scope.
