@echo off
chcp 65001 > nul
python scripts/run_pension_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Annuity savings insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
