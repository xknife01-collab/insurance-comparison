@echo off
chcp 65001 > nul
python scripts/run_variable_pipeline.py
if %errorlevel% neq 0 (
    echo [-] Variable insurance pipeline execution failed!
    pause
    exit /b %errorlevel%
)
pause
