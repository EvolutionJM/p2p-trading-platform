@echo off
chcp 65001 >nul
title P2P Crypto Trading - Запуск
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        P2P Crypto Trading Platform - Запуск                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Перевірка Node.js
echo [1/5] Перевірка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не встановлено! Завантажте з https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js встановлено

:: Перевірка MongoDB
echo.
echo [2/5] Перевірка MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MongoDB не знайдено. Переконайтесь що він встановлений та запущений
    echo    Завантажити: https://www.mongodb.com/try/download/community
    echo.
    choice /C YN /M "Продовжити без MongoDB"
    if errorlevel 2 exit /b 1
) else (
    echo ✅ MongoDB знайдено
)

:: Встановлення залежностей Backend
echo.
echo [3/5] Встановлення залежностей Backend...
cd server
if not exist "node_modules" (
    echo Встановлення npm пакетів для сервера...
    call npm install
    if errorlevel 1 (
        echo ❌ Помилка встановлення залежностей Backend
        pause
        exit /b 1
    )
) else (
    echo ✅ Залежності Backend вже встановлені
)

:: Перевірка .env файлу Backend
if not exist ".env" (
    echo.
    echo ⚠️  Файл .env не знайдено. Створюю з .env.example...
    copy .env.example .env >nul
    echo ✅ Створено .env файл. Відредагуйте його за потреби!
    echo    Розташування: %CD%\.env
    timeout /t 3 >nul
)

cd ..

:: Встановлення залежностей Frontend
echo.
echo [4/5] Встановлення залежностей Frontend...
cd client
if not exist "node_modules" (
    echo Встановлення npm пакетів для клієнта...
    call npm install
    if errorlevel 1 (
        echo ❌ Помилка встановлення залежностей Frontend
        pause
        exit /b 1
    )
) else (
    echo ✅ Залежності Frontend вже встановлені
)

:: Перевірка .env файлу Frontend
if not exist ".env" (
    echo.
    echo ⚠️  Файл .env не знайдено. Створюю з .env.example...
    copy .env.example .env >nul
    echo ✅ Створено .env файл
)

cd ..

:: Запуск серверів
echo.
echo [5/5] Запуск серверів...
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🚀 Запускаю Backend (порт 5000) та Frontend (порт 3000)   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 Логи зберігаються в папці logs/
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:5000
echo.
echo ⚠️  Для зупинки натисніть Ctrl+C в обох вікнах
echo.

:: Створення папки для логів
if not exist "logs" mkdir logs

:: Запуск Backend в новому вікні
start "P2P Backend Server" cmd /k "cd /d %CD%\server && echo Backend Server запущено... && npm run dev 2>&1 | tee ..\logs\backend-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

:: Затримка перед запуском Frontend
timeout /t 3 >nul

:: Запуск Frontend в новому вікні
start "P2P Frontend Client" cmd /k "cd /d %CD%\client && echo Frontend Client запущено... && npm start 2>&1 | tee ..\logs\frontend-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

echo.
echo ✅ Сервери запущені!
echo.
echo Відкриваю браузер через 5 секунд...
timeout /t 5 >nul

:: Відкрити браузер
start http://localhost:3000

echo.
echo ✅ Готово! Приємної роботи!
echo.
pause
