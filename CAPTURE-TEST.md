# Capture test

Status: VERIFIED

## Tool and model

- Tool: Codex Desktop on Windows
- Planning model: `gpt-5.6-sol`
- Execution model: `gpt-5.6-sol`

## Mechanism

- Lifecycle events: `UserPromptSubmit`, `Stop`
- Configuration: `.codex/hooks.json`
- Script: `scripts/capture-agent-turn.ps1`
- Session log paths:
  - `.agent-logs/2026-09-23_08-52-07_01a0cd6d-aedd-77f2-9010-e8c891024104.md`
  - `.agent-logs/2026-09-23_08-51-30_01a0cd75-ee92-79e1-8a5b-2c70b472727b.md`

## Canary session 1 — raw entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0cd6d-aedd-77f2-9010-e8c891024104]
timestamp: 2026-09-23T08:52:06.733Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Hamza Farooq


[LOG_ENTRY type=RESPONSE num=1 session=01a0cd6d-aedd-77f2-9010-e8c891024104]
timestamp: 2026-09-23T08:52:32.816Z
model: gpt-5.6-sol

Capture test received successfully.
```

## Canary session 2 — raw entries

```text
[LOG_ENTRY type=PROMPT num=1 session=01a0cd75-ee92-79e1-8a5b-2c70b472727b]
timestamp: 2026-09-23T08:51:10.958Z
model: gpt-5.6-sol

CAPTURE TEST — 8x assignment, Hamza Farooq — second session


[LOG_ENTRY type=RESPONSE num=1 session=01a0cd75-ee92-79e1-8a5b-2c70b472727b]
timestamp: 2026-09-23T08:51:30.369Z
model: gpt-5.6-sol

Capture test received: **8x assignment — Hamza Farooq — second session**. Please send the assignment instructions or files.
```

## Attempts that did not work

The first two Desktop tasks ran before the project hooks were trusted, so Codex skipped the hooks and created no usable session logs. After trust was granted, the original 10-second hook deadline produced a header-only log before PowerShell finished. Increasing both hook deadlines to 30 seconds fixed that timeout. A subsequent diagnostic exposed Windows stdin decoding the em dash as mojibake; setting PowerShell's console input encoding to UTF-8 fixed it. Synthetic and incomplete diagnostic logs are retained under `.agent-logs/` but are not counted as either verified canary above.
