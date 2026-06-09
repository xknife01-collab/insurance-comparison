@echo off
title Comprehensive Health Insurance Pipeline
set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

cd /d "%WORKSPACE%"

echo ==================================================
echo   [COMPREHENSIVE] Health General Insurance Pipeline Starting...
echo ==================================================
echo.

echo [STEP 1] Extracting health general data from raw XLS...
python scripts\extract_health_general_data.py
if errorlevel 1 goto :FAIL_EXTRACT
echo [+] STEP 1 OK.
echo.

echo [STEP 2] Uploading health general data to Supabase...
python scripts\upload_health_general_rates.py
if errorlevel 1 goto :FAIL_UPLOAD
echo [+] STEP 2 OK.
echo.

echo [STEP 3] Updating disclosure dates json...
python scripts\update_disclosure_date.py health_general
if errorlevel 1 goto :FAIL_DATE
echo [+] STEP 3 OK.
echo.

echo ==================================================
echo   SUCCESS: Comprehensive Health Insurance pipeline completed
echo ==================================================
echo.
pause
exit /b 0

:FAIL_EXTRACT
echo [ERROR] STEP 1 Extraction failed
pause
exit /b 1

:FAIL_UPLOAD
echo [ERROR] STEP 2 Upload failed
pause
exit /b 1

:FAIL_DATE
echo [ERROR] STEP 3 Date Update failed
pause
exit /b 1
