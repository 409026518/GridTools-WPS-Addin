@echo off
rem ============================================================
rem  GridTools WPS Addin Installer (copy files + register)
rem  Run on any computer with WPS Office installed.
rem ============================================================
setlocal
set "DST=%APPDATA%\kingsoft\wps\jsaddons"
set "SRCDIR=%~dp0files\GridTools_1.0.0"
set "SEVENZ=%~dp0files\GridTools.7z"
set "VER=1.0.0"

if not exist "%SRCDIR%" (
  echo [ERROR] Source folder not found: %SRCDIR%
  pause
  exit /b 1
)

echo [1/3] Copying addon files to %DST% ...
if not exist "%DST%" mkdir "%DST%"
xcopy /E /I /Y /Q "%SRCDIR%" "%DST%\GridTools_%VER%\" >nul
copy /Y "%SEVENZ%" "%DST%\GridTools.7z" >nul

echo [2/3] Registering addon in publish.xml ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0register.ps1" -Dst "%DST%"

echo [3/3] Done.
echo.
echo ============================================================
echo  Install OK. Restart WPS (close ALL WPS windows first).
echo  A new tab "GridTools" will appear in the ribbon of WPS ET.
echo ============================================================
pause
