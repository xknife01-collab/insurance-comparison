@echo off
chcp 65001 > nul
python scripts/run_legal_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Legal insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
