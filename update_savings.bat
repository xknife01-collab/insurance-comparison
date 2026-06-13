@echo off
chcp 65001 > nul
python scripts/run_savings_pipeline.py
if %errorlevel% neq 0 (
    echo [-] General savings insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
