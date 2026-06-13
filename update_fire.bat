@echo off
chcp 65001 > nul
python scripts/run_fire_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Home fire insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
