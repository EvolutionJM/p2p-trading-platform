@echo off
title P2P Crypto Trading - Installation
color 0E

echo.
echo ========================================================
echo      P2P Crypto Trading Platform - Installation
echo ========================================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Recommended version: LTS (18.x or newer)
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
    echo MongoDB is required for the platform to work.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    choice /C YN /M "Continue installation without MongoDB"
    if errorlevel 2 exit /b 1
) else (
    mongosh --version
    echo [OK] MongoDB installed
)

:: Встановлення Backend залежностей
echo.
echo [4/6] Встановлення Backend залежностей...
cd server
if exist "node_modules" (
    echo Папка node_modules вже існує. Видалити та переустановити?
    choice /C YN /M "Переустановити"
    if not errorlevel 2 (
        echo Видалення старих залежностей...
        rmdir /s /q node_modules
    )
)

if not exist "node_modules" (
    echo Встановлення npm пакетів...
    call npm install
    if errorlevel 1 (
        echo ❌ Помилка встановлення Backend залежностей
        pause
        exit /b 1
    )
    echo ✅ Backend залежності встановлені
) else (
    echo ✅ Backend залежності вже встановлені
)

:: Створення .env для Backend
if not exist ".env" (
    echo.
    echo Створення .env файлу для Backend...
    copy .env.example .env >nul
    echo ✅ Створено server\.env
    echo ⚠️  Не забудьте відредагувати його з вашими налаштуваннями!
) else (
    echo ✅ Backend .env вже існує
)

cd ..

:: Встановлення Frontend залежностей
echo.
echo [5/6] Встановлення Frontend залежностей...
cd client
if exist "node_modules" (
    echo Папка node_modules вже існує. Видалити та переустановити?
    choice /C YN /M "Переустановити"
    if not errorlevel 2 (
        echo Видалення старих залежностей...
        rmdir /s /q node_modules
    )
)

if not exist "node_modules" (
    echo Встановлення npm пакетів...
    call npm install
    if errorlevel 1 (
        echo ❌ Помилка встановлення Frontend залежностей
        pause
        exit /b 1
    )
    echo ✅ Frontend залежності встановлені
) else (
    echo ✅ Frontend залежності вже встановлені
)

:: Створення .env для Frontend
if not exist ".env" (
    echo.
    echo Створення .env файлу для Frontend...
    copy .env.example .env >nul
    echo ✅ Створено client\.env
) else (
    echo ✅ Frontend .env вже існує
)

cd ..

:: Створення папок
echo.
echo [6/6] Створення необхідних папок...
if not exist "logs" mkdir logs && echo ✅ Створено папку logs
if not exist "server\uploads" mkdir server\uploads && echo ✅ Створено папку server\uploads
if not exist "server\logs" mkdir server\logs && echo ✅ Створено папку server\logs

:: Фінальне повідомлення
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  ✅ Встановлення завершено!                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 Наступні кроки:
echo.
echo 1. Переконайтесь що MongoDB запущений
echo 2. Відредагуйте файли .env (якщо потрібно):
echo    - server\.env (JWT секрети, Bybit API ключі)
echo    - client\.env (URL серверів)
echo.
echo 3. Запустіть платформу:
echo    - Подвійний клік на start.bat
echo    або
echo    - docker-compose up -d (якщо використовуєте Docker)
echo.
echo 📚 Детальна документація: SETUP.md
echo.
echo Бажаєте запустити зараз?
choice /C YN /M "Запустити платформу"
if not errorlevel 2 (
    call start.bat
)

pause
