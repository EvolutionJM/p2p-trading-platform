@echo off
title P2P Crypto Trading - Status Check
color 0D

echo.
echo ========================================================
echo      P2P Crypto Trading - Status Check
echo ========================================================
echo.

:: Check System
echo [System]
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js: Not installed
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js: %%i
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm: Not installed
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm: v%%i
)

mongosh --version >nul 2>&1
if errorlevel 1 (
    echo [X] MongoDB: Not installed
) else (
    for /f "tokens=2" %%i in ('mongosh --version ^| findstr /C:"version"') do echo [OK] MongoDB: %%i
)

:: Check Ports
echo.
echo [Ports]
netstat -an | findstr :5000 >nul
if errorlevel 1 (
    echo [ ] Port 5000 (Backend): Free
) else (
    echo [*] Port 5000 (Backend): In use (server running)
)

netstat -an | findstr :3000 >nul
if errorlevel 1 (
    echo [ ] Port 3000 (Frontend): Free
) else (
    echo [*] Port 3000 (Frontend): In use (server running)
)

netstat -an | findstr :27017 >nul
if errorlevel 1 (
    echo [ ] Port 27017 (MongoDB): Free
) else (
    echo [*] Port 27017 (MongoDB): In use (database running)
)

:: Check Dependencies
echo.
echo [Dependencies]
if exist "server\node_modules" (
    echo [OK] Backend node_modules: Installed
) else (
    echo [X] Backend node_modules: Not installed
)

if exist "client\node_modules" (
    echo [OK] Frontend node_modules: Installed
) else (
    echo [X] Frontend node_modules: Not installed
)

:: Check Configuration
echo.
echo [Configuration]
if exist "server\.env" (
    echo [OK] Backend .env: Exists
) else (
    echo [!] Backend .env: Not found
)

if exist "client\.env" (
    echo [OK] Frontend .env: Exists
) else (
    echo [!] Frontend .env: Not found
)

:: Check Folders
echo.
echo [Folders]
if exist "logs" (
    echo [OK] logs: Exists
) else (
    echo [!] logs: Not found
)

if exist "server\uploads" (
    echo [OK] server\uploads: Exists
) else (
    echo [!] server\uploads: Not found
)

:: Check Database Connection
echo.
echo [Database]
mongosh --eval "db.version()" --quiet >nul 2>&1
if errorlevel 1 (
    echo [X] MongoDB: Cannot connect
) else (
    echo [OK] MongoDB: Connected
)

:: Check Server Availability
echo.
echo [Availability]
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo [ ] Backend API: Not available
) else (
    echo [*] Backend API: Available (http://localhost:5000)
)

curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo [ ] Frontend: Not available
) else (
    echo [*] Frontend: Available (http://localhost:3000)
)

echo.
echo ========================================================
echo.
pause
