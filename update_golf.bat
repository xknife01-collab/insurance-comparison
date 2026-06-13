@echo off
chcp 65001 > nul
python scripts/run_golf_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Golf insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
