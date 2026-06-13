@echo off
chcp 65001 > nul
python scripts/run_driver_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Driver insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
