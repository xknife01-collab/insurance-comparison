@echo off
chcp 65001 > nul
python scripts/run_credit_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Credit insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
