@echo off
chcp 65001 >nul
title P2P Crypto Trading - Зупинка
color 0C

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        P2P Crypto Trading Platform - Зупинка              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo Зупиняю всі процеси Node.js...
echo.

:: Знайти та зупинити процеси на портах 3000 та 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Зупиняю процес на порту 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Зупиняю процес на порту 5000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ✅ Всі сервери зупинені!
echo.
timeout /t 2 >nul
