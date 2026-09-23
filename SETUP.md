# Setup and capture verification

## Tool declaration

- Tool: Codex Desktop on Windows
- Planning model: the active Codex model reported by the lifecycle hook
- Execution model: the active Codex model reported by the lifecycle hook
- Automatic mechanism: repository-local Codex lifecycle hooks
- Config: `.codex/hooks.json`
- Hook implementation: `scripts/capture-agent-turn.ps1`
- Events: `UserPromptSubmit` and `Stop`

The model slug is intentionally read from each hook event instead of being guessed. Every log entry records it, so model changes remain visible.

## Verification gate

Do not create application code until every item below passes.

1. Open this repository as a Codex project and review/trust the project hook.
2. Start a fresh Codex task in this repository.
3. Send `CAPTURE TEST — 8x assignment, Hamza Farooq`.
4. Wait for the final response, then verify one `.agent-logs/*.md` file contains both the raw prompt and final response.
5. Start a second fresh task in the same repository.
6. Send `CAPTURE TEST — 8x assignment, Hamza Farooq — second session`.
7. Verify a second session log contains both entries.
8. Copy `CAPTURE-TEST.template.md` to `CAPTURE-TEST.md`, paste the two raw canary exchanges, and record any failure/retry honestly.
9. Commit the two logs and `CAPTURE-TEST.md` before scaffolding the app.

## Local hook smoke test

A synthetic smoke test may be run against the PowerShell script to catch syntax errors, but it does **not** replace the two real Codex sessions required by the assessment.

## Claude Code capture (added when the build continued in Claude Code)

The build continued in Claude Code partway through. Claude Code exposes the same `UserPromptSubmit`/`Stop` hook events with the same payload fields (`session_id`, `prompt`, `last_assistant_message`, `transcript_path`, `model`), so it reuses `scripts/capture-agent-turn.ps1` unchanged, invoked with `-Tool 'claude-code'` instead of the Codex default. Configuration lives in `.claude/settings.json` (committed, not the gitignored `.claude/settings.local.json`).

Verification gate, mirroring the Codex procedure:

1. Run `claude` once, interactively, from a real terminal inside this repo folder (not `claude -p`, which skips the trust dialog and — for an as-yet-untrusted folder — silently ignores project hook config rather than prompting). Accept the one-time trust prompt if shown. This sets `hasTrustDialogAccepted: true` for this project in the user-level Claude Code config; it cannot be set by the agent itself, since editing that file is correctly blocked by Claude Code's own self-modification guard.
2. Start a fresh Claude Code session in this repository and send `CAPTURE TEST — 8x assignment, Hamza Farooq — claude code session 1`.
3. Verify a new `.agent-logs/*.md` file appears with `tool: claude-code` in its frontmatter and both the prompt and response entries.
4. Start a second fresh session and repeat with `... — claude code session 2`.
5. Append the two raw canary exchanges to `CAPTURE-TEST.md` under a new "Claude Code" section, alongside the existing Codex canaries.

As of the commit that added this section, steps 2–5 are still outstanding — step 1 requires a human in an interactive terminal, which an agent session cannot simulate.

## Privacy warning

Everything under `.agent-logs/` will be public. Never put passwords, access tokens, private calendar data, personal meeting content, or other secrets in prompts.
