@echo off
title Brain Insurance Pipeline
set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

cd /d "%WORKSPACE%"

echo ==================================================
echo   [BRAIN] Brain Insurance Pipeline Starting...
echo ==================================================
echo.

echo [STEP 1] Uploading brain finalized 798 rates to Supabase...
python scripts\scraper\upload_brain_final.py
if errorlevel 1 goto :FAIL_UPLOAD
echo [+] STEP 1 OK.
echo.

echo [STEP 2] Updating disclosure dates json...
python scripts\update_disclosure_date.py brain
if errorlevel 1 goto :FAIL_DATE
echo [+] STEP 2 OK.
echo.

echo ==================================================
echo   SUCCESS: Brain Insurance pipeline completed
echo ==================================================
echo.
pause
exit /b 0

:FAIL_UPLOAD
echo [ERROR] STEP 1 Upload failed
pause
exit /b 1

:FAIL_DATE
echo [ERROR] STEP 2 Date Update failed
pause
exit /b 1
