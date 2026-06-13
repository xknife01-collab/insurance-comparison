@echo off
chcp 65001 > nul
python scripts/run_pet_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Pet insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
