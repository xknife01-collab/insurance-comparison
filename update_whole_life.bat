@echo off
chcp 65001 > nul
python scripts/run_whole_life_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Whole Life insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
