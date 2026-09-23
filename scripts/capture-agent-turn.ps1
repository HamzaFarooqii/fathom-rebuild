$ErrorActionPreference = "Stop"

[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)

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

function Get-TranscriptPrompt {
    param([string]$TranscriptPath)

    if ([string]::IsNullOrWhiteSpace($TranscriptPath) -or -not (Test-Path -LiteralPath $TranscriptPath)) {
        return $null
    }

    $items = Get-Content -LiteralPath $TranscriptPath | ForEach-Object {
        try { $_ | ConvertFrom-Json -Depth 32 } catch { $null }
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
    $rawInput = [Console]::In.ReadToEnd()
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
    $model = if ($event.model) { [string]$event.model } else { "unknown" }
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
tool: codex-desktop
project: fathom-rebuild
total_exchanges: 0
first_prompt_time: pending
last_prompt_time: pending
---

# Session Log - $date

Session: ``$shortSessionId`` | Project: ``fathom-rebuild`` | Author: ``HamzaFarooqii``

---
"@
        Set-Content -LiteralPath $logPath -Value $header -Encoding utf8NoBOM
    }
    else {
        $logPath = $logFile.FullName
    }

    $content = Get-Content -LiteralPath $logPath -Raw
    $promptCount = [regex]::Matches($content, '\[LOG_ENTRY type=PROMPT').Count
    $responseCount = [regex]::Matches($content, '\[LOG_ENTRY type=RESPONSE').Count

    switch ([string]$event.hook_event_name) {
        "UserPromptSubmit" {
            $entryNumber = $promptCount + 1
            if ($promptCount -eq 0) {
                $content = Set-FrontmatterValue -Content $content -Key "first_prompt_time" -Value $timestamp
            }
            $content = Set-FrontmatterValue -Content $content -Key "last_prompt_time" -Value $timestamp
            Set-Content -LiteralPath $logPath -Value $content.TrimEnd() -Encoding utf8NoBOM

            $entry = @"


[LOG_ENTRY type=PROMPT num=$entryNumber session=$sessionId]
timestamp: $timestamp
model: $model

$($event.prompt)
"@
            Add-Content -LiteralPath $logPath -Value $entry -Encoding utf8NoBOM
        }
        "Stop" {
            if ($promptCount -le $responseCount) {
                $transcriptPrompt = Get-TranscriptPrompt -TranscriptPath ([string]$event.transcript_path)
                if ($transcriptPrompt -and -not [string]::IsNullOrWhiteSpace($transcriptPrompt.Text)) {
                    $entryNumber = $promptCount + 1
                    $content = Get-Content -LiteralPath $logPath -Raw
                    if ($promptCount -eq 0) {
                        $content = Set-FrontmatterValue -Content $content -Key "first_prompt_time" -Value $transcriptPrompt.Timestamp
                    }
                    $content = Set-FrontmatterValue -Content $content -Key "last_prompt_time" -Value $transcriptPrompt.Timestamp
                    Set-Content -LiteralPath $logPath -Value $content.TrimEnd() -Encoding utf8NoBOM

                    $promptEntry = @"


[LOG_ENTRY type=PROMPT num=$entryNumber session=$sessionId]
timestamp: $($transcriptPrompt.Timestamp)
model: $model

$($transcriptPrompt.Text)
"@
                    Add-Content -LiteralPath $logPath -Value $promptEntry -Encoding utf8NoBOM
                    $promptCount = $entryNumber
                }
            }

            if ($promptCount -gt $responseCount -and $null -ne $event.last_assistant_message) {
                $entryNumber = $responseCount + 1
                $entry = @"


[LOG_ENTRY type=RESPONSE num=$entryNumber session=$sessionId]
timestamp: $timestamp
model: $model

$($event.last_assistant_message)
"@
                Add-Content -LiteralPath $logPath -Value $entry -Encoding utf8NoBOM
                $updated = Get-Content -LiteralPath $logPath -Raw
                $updated = Set-FrontmatterValue -Content $updated -Key "total_exchanges" -Value ([string]$entryNumber)
                Set-Content -LiteralPath $logPath -Value $updated.TrimEnd() -Encoding utf8NoBOM
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
