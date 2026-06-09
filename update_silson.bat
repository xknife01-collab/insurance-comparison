@echo off
title Medical Silson Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

echo.
echo ==================================================
echo   [SILSON] Medical Insurance Pipeline Starting...
echo ==================================================
echo.

cd /d "%WORKSPACE%"

echo [STEP 1] Loading medical silson insurance -> medical_silson_products ^& rates
python scripts\scraper\ingest_silson_v6_api.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED ^& goto :ERROR )
echo [+] STEP 1 OK
echo.

echo [STEP 2] Updating disclosure_dates.json
python scripts\update_disclosure_date.py silson
if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 FAILED ^& goto :ERROR )
echo [+] STEP 2 OK
echo.

echo ==================================================
echo   [DONE] Medical Silson pipeline completed!
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
