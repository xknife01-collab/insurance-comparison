@echo off
chcp 65001 > nul
python scripts/run_caregiving_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Caregiving pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
