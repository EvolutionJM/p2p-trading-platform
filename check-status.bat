@echo off
chcp 65001 >nul
title P2P Crypto Trading - Перевірка Статусу
color 0D

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        P2P Crypto Trading - Перевірка Статусу             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Перевірка Node.js
echo [Система]
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js: Не встановлено
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js: %%i
)

:: Перевірка npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm: Не встановлено
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm: v%%i
)

:: Перевірка MongoDB
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB: Не встановлено
) else (
    for /f "tokens=2" %%i in ('mongosh --version ^| findstr /C:"version"') do echo ✅ MongoDB: %%i
)

:: Перевірка портів
echo.
echo [Порти]
netstat -an | findstr :5000 >nul
if errorlevel 1 (
    echo ⚪ Порт 5000 (Backend): Вільний
) else (
    echo 🟢 Порт 5000 (Backend): Зайнятий (сервер працює)
)

netstat -an | findstr :3000 >nul
if errorlevel 1 (
    echo ⚪ Порт 3000 (Frontend): Вільний
) else (
    echo 🟢 Порт 3000 (Frontend): Зайнятий (сервер працює)
)

netstat -an | findstr :27017 >nul
if errorlevel 1 (
    echo ⚪ Порт 27017 (MongoDB): Вільний
) else (
    echo 🟢 Порт 27017 (MongoDB): Зайнятий (база працює)
)

:: Перевірка залежностей
echo.
echo [Залежності]
if exist "server\node_modules" (
    echo ✅ Backend node_modules: Встановлені
) else (
    echo ❌ Backend node_modules: Не встановлені
)

if exist "client\node_modules" (
    echo ✅ Frontend node_modules: Встановлені
) else (
    echo ❌ Frontend node_modules: Не встановлені
)

:: Перевірка конфігурації
echo.
echo [Конфігурація]
if exist "server\.env" (
    echo ✅ Backend .env: Існує
) else (
    echo ⚠️  Backend .env: Не знайдено
)

if exist "client\.env" (
    echo ✅ Frontend .env: Існує
) else (
    echo ⚠️  Frontend .env: Не знайдено
)

:: Перевірка папок
echo.
echo [Папки]
if exist "logs" (
    for /f %%a in ('dir /b logs 2^>nul ^| find /c /v ""') do set count=%%a
    echo ✅ logs: Існує (файлів: !count!)
) else (
    echo ⚠️  logs: Не існує
)

if exist "server\uploads" (
    echo ✅ server\uploads: Існує
) else (
    echo ⚠️  server\uploads: Не існує
)

:: Перевірка підключення до MongoDB
echo.
echo [База даних]
mongosh --eval "db.version()" --quiet >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB: Не підключається
) else (
    echo ✅ MongoDB: Підключення успішне
)

:: Перевірка доступності серверів
echo.
echo [Доступність]
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ⚪ Backend API: Недоступний
) else (
    echo 🟢 Backend API: Доступний (http://localhost:5000)
)

curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ⚪ Frontend: Недоступний
) else (
    echo 🟢 Frontend: Доступний (http://localhost:3000)
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
