param(
    [string]$Tool = "codex-desktop"
)

$ErrorActionPreference = "Stop"

function Write-HookResult {
    param([string]$SystemMessage)

    if ($SystemMessage) {
        @{
            continue = $true
            systemMessage = $SystemMessage
        } | ConvertTo-Json -Compress | Write-Output
    }
    else {
        @{ continue = $true } | ConvertTo-Json -Compress | Write-Output
    }
}

function Get-UtcTimestamp {
    return (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
}

# Windows PowerShell 5.1 (powershell.exe, used by the Claude Code hook) does not
# recognize the "utf8NoBOM" encoding name that PowerShell 7+ (pwsh, used by the
# Codex hook) supports -- Set-Content/Add-Content -Encoding utf8NoBOM throws a
# parameter-binding error on 5.1 before anything is written. Writing via .NET
# directly sidesteps the enum entirely and behaves identically on both editions.
function Write-Utf8NoBom {
    param([string]$Path, [string]$Value)
    [System.IO.File]::WriteAllText($Path, "$Value`r`n", [System.Text.UTF8Encoding]::new($false))
}

function Add-Utf8NoBom {
    param([string]$Path, [string]$Value)
    [System.IO.File]::AppendAllText($Path, "$Value`r`n", [System.Text.UTF8Encoding]::new($false))
}

# Same root cause as the write side: Get-Content with no -Encoding guesses
# the system codepage on Windows PowerShell 5.1 instead of reading UTF-8,
# which is how "CAPTURE TEST — ..." became "CAPTURE TEST â€” ..." in logged
# entries even after the stdin decode was fixed -- the corruption was
# happening here, on every file read, not on the stdin read.
function Read-Utf8Text {
    param([string]$Path)
    return [System.IO.File]::ReadAllText($Path, [System.Text.UTF8Encoding]::new($false))
}

function Read-Utf8Lines {
    param([string]$Path)
    return [System.IO.File]::ReadAllLines($Path, [System.Text.UTF8Encoding]::new($false))
}

function Get-TranscriptPrompt {
    param([string]$TranscriptPath)

    if ([string]::IsNullOrWhiteSpace($TranscriptPath) -or -not (Test-Path -LiteralPath $TranscriptPath)) {
        return $null
    }

    # -Depth is not a valid ConvertFrom-Json parameter on Windows PowerShell
    # 5.1 (only PowerShell 7+/pwsh accepts it) -- passing it there throws a
    # ParameterBindingException that this try/catch was silently swallowing,
    # so every line failed to parse and the fallback never found anything.
    $items = Read-Utf8Lines -Path $TranscriptPath | ForEach-Object {
        try { $_ | ConvertFrom-Json } catch { $null }
    }

    # Desktop-created tasks carry their user-authored prompt in the delegation
    # envelope rather than as a normal role=user transcript message.
    $delegated = $items |
        Where-Object {
            $_.type -eq "response_item" -and
            $_.payload.type -eq "function_call_output" -and
            [string]$_.payload.output -match "<codex_delegation>"
        } |
        Select-Object -Last 1

    if ($delegated) {
        $match = [regex]::Match([string]$delegated.payload.output, "(?s)<input>(.*?)</input>")
        if ($match.Success) {
            return [pscustomobject]@{
                Text = $match.Groups[1].Value.Trim()
                Timestamp = ([datetime]$delegated.timestamp).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            }
        }
    }

    $userMessage = $items |
        Where-Object {
            $_.type -eq "response_item" -and
            $_.payload.type -eq "message" -and
            $_.payload.role -eq "user"
        } |
        Select-Object -Last 1

    if ($userMessage) {
        $parts = @($userMessage.payload.content |
            Where-Object {
                $_.type -eq "input_text" -and
                $_.text -notmatch "^<(recommended_plugins|environment_context)>"
            } |
            ForEach-Object { [string]$_.text })
        if ($parts.Count -gt 0) {
            return [pscustomobject]@{
                Text = ($parts -join "`n").Trim()
                Timestamp = ([datetime]$userMessage.timestamp).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            }
        }
    }

    return $null
}

function Get-TranscriptModel {
    param([string]$TranscriptPath)

    if ([string]::IsNullOrWhiteSpace($TranscriptPath) -or -not (Test-Path -LiteralPath $TranscriptPath)) {
        return $null
    }

    $lines = Read-Utf8Lines -Path $TranscriptPath
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        if ([string]::IsNullOrWhiteSpace($lines[$i])) { continue }
        try { $item = $lines[$i] | ConvertFrom-Json } catch { continue }
        if ($item.message.model) {
            return [string]$item.message.model
        }
    }
    return $null
}

function Set-FrontmatterValue {
    param(
        [string]$Content,
        [string]$Key,
        [string]$Value
    )

    $pattern = "(?m)^$([regex]::Escape($Key)):.*$"
    return [regex]::Replace($Content, $pattern, "$Key`: $Value", 1)
}

try {
    # [Console]::InputEncoding only affects an interactive console, not a
    # redirected/piped stdin (which is what a hook subprocess always gets) --
    # it was silently ignored, so a piped UTF-8 em dash decoded as CP1252
    # mojibake ("â€”"). Wrapping the raw stdin stream in our own UTF-8
    # StreamReader decodes it correctly regardless of redirection.
    $stdin = [Console]::OpenStandardInput()
    $reader = New-Object System.IO.StreamReader($stdin, [System.Text.UTF8Encoding]::new($false))
    $rawInput = $reader.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($rawInput)) {
        throw "Hook received no event payload."
    }

    $event = $rawInput | ConvertFrom-Json
    $repoRoot = (& git -C $event.cwd rev-parse --show-toplevel 2>$null).Trim()
    if (-not $repoRoot) {
        throw "Could not resolve the Git repository root."
    }

    $logsDir = Join-Path $repoRoot ".agent-logs"
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null

    $timestamp = Get-UtcTimestamp
    $sessionId = [string]$event.session_id
    $safeSessionId = $sessionId -replace '[^A-Za-z0-9._-]', '-'
    $shortSessionId = if ($safeSessionId.Length -gt 8) { $safeSessionId.Substring(0, 8) } else { $safeSessionId }
    $model = if ($event.model) { [string]$event.model } else { Get-TranscriptModel -TranscriptPath ([string]$event.transcript_path) }
    if ([string]::IsNullOrWhiteSpace($model)) { $model = "unknown" }
    $logFile = Get-ChildItem -LiteralPath $logsDir -Filter "*_$safeSessionId.md" -File |
        Sort-Object Name |
        Select-Object -First 1

    if (-not $logFile) {
        $fileStamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd_HH-mm-ss")
        $logPath = Join-Path $logsDir "${fileStamp}_${safeSessionId}.md"
        $date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd")
        $header = @"
---
session_id: $sessionId
date: $date
author: HamzaFarooqii
model: $model
tool: $Tool
project: fathom-rebuild
total_exchanges: 0
first_prompt_time: pending
last_prompt_time: pending
---

# Session Log - $date

Session: ``$shortSessionId`` | Project: ``fathom-rebuild`` | Author: ``HamzaFarooqii``

---
"@
        Write-Utf8NoBom -Path $logPath -Value $header
    }
    else {
        $logPath = $logFile.FullName
        if ($model -ne "unknown") {
            # An earlier event in this session (before the transcript had any
            # assistant turns yet) may have written "model: unknown" into the
            # frontmatter. Keep it current once a real model becomes known.
            $existing = Read-Utf8Text -Path $logPath
            $patched = Set-FrontmatterValue -Content $existing -Key "model" -Value $model
            if ($patched -ne $existing) {
                Write-Utf8NoBom -Path $logPath -Value $patched.TrimEnd()
            }
        }
    }

    $content = Read-Utf8Text -Path $logPath
    $promptCount = [regex]::Matches($content, '\[LOG_ENTRY type=PROMPT').Count
    $responseCount = [regex]::Matches($content, '\[LOG_ENTRY type=RESPONSE').Count

    switch ([string]$event.hook_event_name) {
        "UserPromptSubmit" {
            $entryNumber = $promptCount + 1
            if ($promptCount -eq 0) {
                $content = Set-FrontmatterValue -Content $content -Key "first_prompt_time" -Value $timestamp
            }
            $content = Set-FrontmatterValue -Content $content -Key "last_prompt_time" -Value $timestamp
            Write-Utf8NoBom -Path $logPath -Value $content.TrimEnd()

            $entry = @"


[LOG_ENTRY type=PROMPT num=$entryNumber session=$shortSessionId]
timestamp: $timestamp
model: $model

$($event.prompt)
"@
            Add-Utf8NoBom -Path $logPath -Value $entry
        }
        "Stop" {
            if ($promptCount -le $responseCount) {
                $transcriptPrompt = Get-TranscriptPrompt -TranscriptPath ([string]$event.transcript_path)
                if ($transcriptPrompt -and -not [string]::IsNullOrWhiteSpace($transcriptPrompt.Text)) {
                    $entryNumber = $promptCount + 1
                    $content = Read-Utf8Text -Path $logPath
                    if ($promptCount -eq 0) {
                        $content = Set-FrontmatterValue -Content $content -Key "first_prompt_time" -Value $transcriptPrompt.Timestamp
                    }
                    $content = Set-FrontmatterValue -Content $content -Key "last_prompt_time" -Value $transcriptPrompt.Timestamp
                    Write-Utf8NoBom -Path $logPath -Value $content.TrimEnd()

                    $promptEntry = @"


[LOG_ENTRY type=PROMPT num=$entryNumber session=$shortSessionId]
timestamp: $($transcriptPrompt.Timestamp)
model: $model

$($transcriptPrompt.Text)
"@
                    Add-Utf8NoBom -Path $logPath -Value $promptEntry
                    $promptCount = $entryNumber
                }
            }

            if ($promptCount -gt $responseCount -and $null -ne $event.last_assistant_message) {
                $entryNumber = $responseCount + 1
                $entry = @"


[LOG_ENTRY type=RESPONSE num=$entryNumber session=$shortSessionId]
timestamp: $timestamp
model: $model

$($event.last_assistant_message)
"@
                Add-Utf8NoBom -Path $logPath -Value $entry
                $updated = Read-Utf8Text -Path $logPath
                $updated = Set-FrontmatterValue -Content $updated -Key "total_exchanges" -Value ([string]$entryNumber)
                Write-Utf8NoBom -Path $logPath -Value $updated.TrimEnd()
            }
        }
        default {
            throw "Unsupported hook event: $($event.hook_event_name)"
        }
    }

    Write-HookResult
}
catch {
    Write-HookResult -SystemMessage "Agent capture hook failed: $($_.Exception.Message)"
    exit 0
}
