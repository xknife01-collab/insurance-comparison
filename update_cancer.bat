@echo off
title Cancer Insurance Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set DISCLOSURE_SRC=C:\Users\zkfnt\Desktop\insurance-comparison-main\Insurance_disclosure_room_data

echo.
echo ==================================================
echo   [CANCER] Insurance Pipeline Starting...
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

echo [STEP 1] Partitioning XLS -> extracted_data.csv
python scripts\scraper\partition_data.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 1 FAILED & goto :ERROR )
echo [+] STEP 1 OK
echo.

echo [STEP 2] Splitting cancer categories (renewable/non-renewable/targeted)
python scripts\scraper\split_cancer_categories.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 2 FAILED & goto :ERROR )
echo [+] STEP 2 OK
echo.

echo [STEP 3] Uploading to Supabase (insurance_cancer_products / insurance_cancer_rates)
python scripts\scraper\load_pure_cancer_categories_final.py
if %ERRORLEVEL% neq 0 ( echo [!] STEP 3 FAILED & goto :ERROR )
echo [+] STEP 3 OK
echo.

echo [STEP 4] Updating disclosure_dates.json
python scripts\update_disclosure_date.py cancer
if %ERRORLEVEL% neq 0 ( echo [!] STEP 4 FAILED & goto :ERROR )
echo [+] STEP 4 OK
echo.

echo ==================================================
echo   [DONE] Cancer pipeline completed successfully!
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
