param(
    [Parameter(Mandatory=$true)][string]$Dst,
    [string]$Uninstall = "0"
)
# Registers (or unregisters) the GridTools offline addon in WPS jsaddons publish.xml
# Pure text processing - does not use the XML object model (avoids PS adapter quirks).

$p = Join-Path $Dst 'publish.xml'
$sevenZUrl = 'file:///' + ($Dst -replace '\\','/') + '/GridTools.7z'
$ourLine = '    <jsplugin name="GridTools" type="et" url="' + $sevenZUrl + '" version="1.0.0"/>'

$t = ''
if (Test-Path $p) { $t = [IO.File]::ReadAllText($p) }

# strip any previous GridTools entries (both jsplugin and jspluginonline variants)
$t = [regex]::Replace($t, '\s*<jsplugin[^>]*name="GridTools"[^>]*/>', '')

# keep other addons' entries if the file has a valid jsplugins root
$kept = @()
$m = [regex]::Match($t, '<jsplugins[^>]*>([\s\S]*?)</jsplugins>')
if ($m.Success) {
    $kept = ($m.Groups[1].Value -split "`r?`n") |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -match '^<jsplugin' }
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.AppendLine('<jsplugins>')
foreach ($l in $kept) { [void]$sb.AppendLine('    ' + $l) }
if ($Uninstall -ne '1') { [void]$sb.AppendLine($ourLine) }
[void]$sb.AppendLine('</jsplugins>')
[IO.File]::WriteAllText($p, $sb.ToString())

Write-Host '  publish.xml now:'
Get-Content $p | ForEach-Object { Write-Host "    $_" }
