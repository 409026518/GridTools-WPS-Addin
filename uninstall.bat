@echo off
rem ============================================================
rem  GridTools WPS Addin Uninstaller
rem ============================================================
setlocal
set "DST=%APPDATA%\kingsoft\wps\jsaddons"

echo [1/2] Removing addon files ...
if exist "%DST%\GridTools_1.0.0" rmdir /S /Q "%DST%\GridTools_1.0.0"
if exist "%DST%\GridTools.7z" del /Q "%DST%\GridTools.7z"

echo [2/2] Removing registry entry from publish.xml ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0register.ps1" -Dst "%DST%" -Uninstall 1

echo Done. Restart WPS to take effect.
pause
