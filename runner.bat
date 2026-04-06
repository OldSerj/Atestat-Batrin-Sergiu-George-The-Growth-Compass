@echo off
REM Start a simple HTTP server on port 8000
cd /d "%~dp0"
python -m http.server 8000
