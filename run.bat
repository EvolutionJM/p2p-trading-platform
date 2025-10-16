@echo off
title P2P Crypto Trading - Start
color 0A

echo.
echo ========================================================
echo      P2P Crypto Trading Platform - Starting
echo ========================================================
echo.

:: Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Check MongoDB
echo.
echo [2/5] Checking MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MongoDB not found
    echo Make sure MongoDB is installed and running
    echo.
    choice /C YN /M "Continue anyway (Y/N)"
    if errorlevel 2 exit /b 1
) else (
    echo [OK] MongoDB found
)

:: Check Backend dependencies
echo.
echo [3/5] Checking Backend dependencies...
cd server
if not exist "node_modules" (
    echo [ERROR] Backend dependencies not installed
    echo Run setup.bat first!
    pause
    exit /b 1
)
echo [OK] Backend dependencies ready

:: Check Backend .env
if not exist ".env" (
    echo [WARNING] Backend .env not found. Creating from example...
    copy .env.example .env >nul
    echo [OK] Created .env file. Edit it with your settings!
    timeout /t 3 >nul
)

cd ..

:: Check Frontend dependencies
echo.
echo [4/5] Checking Frontend dependencies...
cd client
if not exist "node_modules" (
    echo [ERROR] Frontend dependencies not installed
    echo Run setup.bat first!
    pause
    exit /b 1
)
echo [OK] Frontend dependencies ready

:: Check Frontend .env
if not exist ".env" (
    echo [WARNING] Frontend .env not found. Creating from example...
    copy .env.example .env >nul
    echo [OK] Created .env file
)

cd ..

:: Start servers
echo.
echo [5/5] Starting servers...
echo.
echo ========================================================
echo   Backend starting on port 5000
echo   Frontend starting on port 3000
echo ========================================================
echo.
echo Logs saved to: logs\
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Press Ctrl+C in both windows to stop
echo.

:: Create logs folder
if not exist "logs" mkdir logs

:: Start Backend
start "P2P Backend Server" cmd /k "cd /d %CD%\server && echo [Backend Server Started] && npm run dev"

:: Wait before starting Frontend
timeout /t 3 >nul

:: Start Frontend
start "P2P Frontend Client" cmd /k "cd /d %CD%\client && echo [Frontend Client Started] && npm start"

echo.
echo [OK] Servers started!
echo.
echo Opening browser in 5 seconds...
timeout /t 5 >nul

:: Open browser
start http://localhost:3000

echo.
echo [OK] Done! Enjoy!
echo.
pause
