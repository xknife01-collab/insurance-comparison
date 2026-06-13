@echo off
chcp 65001 > nul
python scripts/run_child_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Child insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
