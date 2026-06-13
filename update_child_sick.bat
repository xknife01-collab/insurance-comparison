@echo off
chcp 65001 > nul
python scripts/run_child_sick_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Children's Pre-existing insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
