@echo off
title P2P Crypto Trading - Stop
color 0C

echo.
echo ========================================================
echo      P2P Crypto Trading Platform - Stopping
echo ========================================================
echo.

echo Stopping all Node.js processes...
echo.

:: Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill processes on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Stopping process on port 5000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] All servers stopped!
echo.
timeout /t 2 >nul
