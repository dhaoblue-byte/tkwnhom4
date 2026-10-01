@echo off
title Son Tung M-TP World - Localhost Launcher
color 0b
echo =======================================================
echo   SON TUNG M-TP WORLD - KHOI DONG MAY CHU LOCALHOST
echo =======================================================
echo.

:: Kiem tra neu co Node.js thi uu tien chay Express Backend
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [*] Phat hien Node.js trong he thong.
    echo [*] Dang khoi dong Node.js Express Server tren cong 5000...
    cd /d "%~dp0backend"
    start http://localhost:5000
    node server.js
    goto end
)

:: Neu chua cai Node.js, tu dong dung PowerShell Localhost Server co san cua Windows
echo [*] Khoi dong may chu Localhost tu nhien cua Windows tren cong 5000...
cd /d "%~dp0"
start http://localhost:5000
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"

:end
pause
