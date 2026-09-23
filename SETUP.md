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

## Privacy warning

Everything under `.agent-logs/` will be public. Never put passwords, access tokens, private calendar data, personal meeting content, or other secrets in prompts.
