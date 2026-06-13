@echo off
chcp 65001 > nul
python scripts/run_dementia_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Dementia pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
