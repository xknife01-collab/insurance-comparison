@echo off
title Heart Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

echo.
echo ==================================================
echo   [HEART] Heart Insurance Pipeline Starting...
echo ==================================================
echo.

cd /d "%WORKSPACE%"

echo [STEP 1] Extracting raw heart data...
python scripts\extract_heart_insurance.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED ^& goto :ERROR )
echo [+] STEP 1 OK
echo.

echo [STEP 2] Consolidating and filtering heart data...
python scripts\consolidate_heart_data.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 FAILED ^& goto :ERROR )
echo [+] STEP 2 OK
echo.

echo [STEP 3] Uploading consolidated heart data to Supabase...
python scripts\upload_consolidated_heart.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 3 FAILED ^& goto :ERROR )
echo [+] STEP 3 OK
echo.

echo [STEP 4] Updating disclosure_dates.json
python scripts\update_disclosure_date.py heart
if %ERRORLEVEL% neq 0 ( echo [!] STEP 4 FAILED ^& goto :ERROR )
echo [+] STEP 4 OK
echo.

echo ==================================================
echo   [DONE] Heart insurance pipeline completed!
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
