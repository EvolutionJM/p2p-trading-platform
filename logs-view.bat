@echo off
chcp 65001 >nul
title P2P Crypto Trading - Перегляд Логів
color 0B

:menu
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        P2P Crypto Trading - Перегляд Логів                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

if not exist "logs" (
    echo ⚠️  Папка logs не знайдена. Спочатку запустіть сервери!
    pause
    exit /b
)

echo Доступні логи:
echo.
echo [1] Backend логи (сьогодні)
echo [2] Frontend логи (сьогодні)
echo [3] Всі Backend логи
echo [4] Всі Frontend логи
echo [5] Очистити всі логи
echo [6] Відкрити папку з логами
echo [7] Live перегляд Backend (tail)
echo [8] Live перегляд Frontend (tail)
echo [0] Вихід
echo.

choice /C 123456780 /N /M "Оберіть опцію: "

if errorlevel 9 exit /b
if errorlevel 8 goto live_frontend
if errorlevel 7 goto live_backend
if errorlevel 6 goto open_folder
if errorlevel 5 goto clear_logs
if errorlevel 4 goto all_frontend
if errorlevel 3 goto all_backend
if errorlevel 2 goto today_frontend
if errorlevel 1 goto today_backend

:today_backend
cls
echo ═══════════════ Backend Логи (Сьогодні) ═══════════════
echo.
set today=%date:~-4,4%%date:~-7,2%%date:~-10,2%
if exist "logs\backend-%today%.log" (
    type "logs\backend-%today%.log"
) else (
    echo ⚠️  Логи за сьогодні не знайдені
)
echo.
pause
goto menu

:today_frontend
cls
echo ═══════════════ Frontend Логи (Сьогодні) ═══════════════
echo.
set today=%date:~-4,4%%date:~-7,2%%date:~-10,2%
if exist "logs\frontend-%today%.log" (
    type "logs\frontend-%today%.log"
) else (
    echo ⚠️  Логи за сьогодні не знайдені
)
echo.
pause
goto menu

:all_backend
cls
echo ═══════════════ Всі Backend Логи ═══════════════
echo.
for %%f in (logs\backend-*.log) do (
    echo ────────────── %%f ──────────────
    type "%%f"
    echo.
)
pause
goto menu

:all_frontend
cls
echo ═══════════════ Всі Frontend Логи ═══════════════
echo.
for %%f in (logs\frontend-*.log) do (
    echo ────────────── %%f ──────────────
    type "%%f"
    echo.
)
pause
goto menu

:clear_logs
cls
echo ⚠️  УВАГА: Це видалить всі логи!
choice /C YN /M "Ви впевнені"
if errorlevel 2 goto menu
del /Q logs\*.log 2>nul
echo ✅ Всі логи видалені!
timeout /t 2 >nul
goto menu

:open_folder
start explorer "%CD%\logs"
goto menu

:live_backend
cls
echo ═══════════════ Live Backend Логи ═══════════════
echo Натисніть Ctrl+C для виходу
echo.
set today=%date:~-4,4%%date:~-7,2%%date:~-10,2%
if exist "logs\backend-%today%.log" (
    powershell -Command "Get-Content 'logs\backend-%today%.log' -Wait -Tail 50"
) else (
    echo ⚠️  Логи не знайдені. Запустіть Backend сервер!
    pause
)
goto menu

:live_frontend
cls
echo ═══════════════ Live Frontend Логи ═══════════════
echo Натисніть Ctrl+C для виходу
echo.
set today=%date:~-4,4%%date:~-7,2%%date:~-10,2%
if exist "logs\frontend-%today%.log" (
    powershell -Command "Get-Content 'logs\frontend-%today%.log' -Wait -Tail 50"
) else (
    echo ⚠️  Логи не знайдені. Запустіть Frontend сервер!
    pause
)
goto menu
