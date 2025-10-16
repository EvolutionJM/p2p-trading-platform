@echo off
title P2P Crypto Trading - Setup
color 0E

echo.
echo ========================================================
echo      P2P Crypto Trading Platform - Setup
echo ========================================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Download from: https://nodejs.org/
    echo Recommended: LTS version 18.x or newer
    pause
    exit /b 1
)
node --version
echo [OK] Node.js installed

:: Check npm
echo.
echo [2/6] Checking npm...
npm --version
echo [OK] npm installed

:: Check MongoDB
echo.
echo [3/6] Checking MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MongoDB not found
    echo.
    echo MongoDB is required for the platform.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    choice /C YN /M "Continue without MongoDB (Y/N)"
    if errorlevel 2 exit /b 1
) else (
    mongosh --version
    echo [OK] MongoDB installed
)

:: Install Backend dependencies
echo.
echo [4/6] Installing Backend dependencies...
cd server

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install Backend dependencies
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

:: Create Backend .env
if not exist ".env" (
    echo.
    echo Creating Backend .env file...
    copy .env.example .env >nul
    echo [OK] Created server\.env
    echo [INFO] Edit this file with your settings!
) else (
    echo [OK] Backend .env already exists
)

cd ..

:: Install Frontend dependencies
echo.
echo [5/6] Installing Frontend dependencies...
cd client

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install Frontend dependencies
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

:: Create Frontend .env
if not exist ".env" (
    echo.
    echo Creating Frontend .env file...
    copy .env.example .env >nul
    echo [OK] Created client\.env
) else (
    echo [OK] Frontend .env already exists
)

cd ..

:: Create folders
echo.
echo [6/6] Creating necessary folders...
if not exist "logs" mkdir logs && echo [OK] Created logs folder
if not exist "server\uploads" mkdir server\uploads && echo [OK] Created server\uploads folder
if not exist "server\logs" mkdir server\logs && echo [OK] Created server\logs folder

:: Final message
echo.
echo ========================================================
echo              Installation Complete!
echo ========================================================
echo.
echo Next steps:
echo.
echo 1. Make sure MongoDB is running
echo 2. Edit .env files if needed:
echo    - server\.env (JWT secrets, Bybit API keys)
echo    - client\.env (Server URLs)
echo.
echo 3. Run the platform:
echo    - Double-click run.bat
echo    or
echo    - docker-compose up -d (if using Docker)
echo.
echo Documentation: SETUP.md
echo.

choice /C YN /M "Start the platform now (Y/N)"
if not errorlevel 2 (
    call run.bat
)

pause
