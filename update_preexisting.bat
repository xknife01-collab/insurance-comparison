@echo off
title Preexisting Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

echo.
echo ==================================================
echo   [PREEXISTING] Insurance Pipeline Starting...
echo ==================================================
echo.

cd /d "%WORKSPACE%"

if not exist "scripts\scraper\unified_products_final.json" (
    echo [!] ERROR: unified_products_final.json not found.
    echo     Path: %WORKSPACE%\scripts\scraper\unified_products_final.json
    goto :ERROR
)

echo [STEP 1] Loading preexisting insurance -> insurance_yu_byung_ja
python scripts\ingest_preexisting_xls.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED & goto :ERROR )
echo [+] STEP 1 OK
echo.

if exist "scripts\generate_preexisting_child_rich.py" (
    echo [STEP 2] Generating preexisting child data...
    python scripts\generate_preexisting_child_rich.py
    if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 skipped due to error ) else ( echo [+] STEP 2 OK )
    echo.
)

echo [STEP 3] Updating disclosure_dates.json
python scripts\update_disclosure_date.py preexisting
if %ERRORLEVEL% neq 0 ( echo [!] STEP 3 FAILED & goto :ERROR )
echo [+] STEP 3 OK
echo.

echo ==================================================
echo   [DONE] Preexisting pipeline completed!
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
