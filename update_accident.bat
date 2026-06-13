@echo off
title Accident Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

echo.
echo ==================================================
echo   [ACCIDENT] Accident Insurance Pipeline Starting...
echo ==================================================
echo.

cd /d "%WORKSPACE%"

echo [STEP 1] Extracting raw accident data...
python scripts\extract_accident_data.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED ^& goto :ERROR )
echo [+] STEP 1 OK
echo.

echo [STEP 2] Rebuilding and normalizing combined accident data...
python scripts\rebuild_combined_accident.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 FAILED ^& goto :ERROR )
echo [+] STEP 2 OK
echo.

echo [STEP 3] Uploading normalized accident rates to Supabase...
python scripts\upload_accident_rates.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 3 FAILED ^& goto :ERROR )
echo [+] STEP 3 OK
echo.

echo [STEP 4] Updating disclosure_dates.json
python scripts\update_disclosure_date.py accident
if %ERRORLEVEL% neq 0 ( echo [!] STEP 4 FAILED ^& goto :ERROR )
echo [+] STEP 4 OK
echo.

echo ==================================================
echo   [DONE] Accident insurance pipeline completed!
echo ==================================================
echo.
pause
exit /b 0

:ERROR
echo.
echo ==================================================
echo   [ERROR] Pipeline stopped. Check output above.
echo ==================================================
echo.
pause
exit /b 1
