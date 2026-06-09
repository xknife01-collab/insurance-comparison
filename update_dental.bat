@echo off
title Dental Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set DISCLOSURE_SRC=C:\Users\zkfnt\Desktop\insurance-comparison-main\Insurance_disclosure_room_data

echo.
echo ==================================================
echo   [DENTAL] Insurance Pipeline Starting...
echo ==================================================
echo.

if exist "%DISCLOSURE_SRC%" (
    echo [*] Disclosure folder found. Copying XLS files...
    for %%f in ("%DISCLOSURE_SRC%\*.xls") do (
        copy /Y "%%f" "C:\Users\zkfnt\Desktop\insurance-comparison-main\" > nul
        echo     Copied: %%~nxf
    )
    echo [+] Copy done.
    echo.
)

cd /d "%WORKSPACE%"

echo [STEP 1] Parsing XLS -> dental_products / dental_rates
python scripts\ingest_dental.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED & goto :ERROR )
echo [+] STEP 1 OK
echo.

echo [STEP 2] Updating disclosure_dates.json
python scripts\update_disclosure_date.py dental
if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 FAILED & goto :ERROR )
echo [+] STEP 2 OK
echo.

echo ==================================================
echo   [DONE] Dental pipeline completed successfully!
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
