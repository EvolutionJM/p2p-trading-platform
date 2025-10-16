@echo off
title Fix MongoDB Connection
color 0E

echo.
echo ========================================================
echo      Fixing MongoDB Connection Issue
echo ========================================================
echo.

cd server

echo Updating .env file...
powershell -Command "(Get-Content .env) -replace 'mongodb://localhost:27017', 'mongodb://127.0.0.1:27017' | Set-Content .env"

echo.
echo [OK] MongoDB URI updated to use 127.0.0.1
echo.
echo Please restart the backend server (run.bat)
echo.
pause
