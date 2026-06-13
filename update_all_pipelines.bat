@echo off
title InsureBalance - Master Data Pipeline

set WORKSPACE=C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

echo.
echo ======================================================================
echo   InsureBalance Master Data Pipeline Starting...
echo ======================================================================
echo.

cd /d "%WORKSPACE%"

python -u scripts\run_all_uploads.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Pipeline failed. Please check the logs above.
    goto :ERROR
)

echo.
echo ======================================================================
echo   [SUCCESS] All pipelines executed successfully!
echo ======================================================================
echo.
pause
exit /b 0

:ERROR
echo.
echo ======================================================================
echo   [FAILED] Pipeline stopped due to errors.
echo ======================================================================
echo.
pause
exit /b 1
