@echo off
cd /d "%~dp0"
node scripts\start-presentation.js
echo.
echo La sesion termino. Pulsa una tecla para cerrar esta ventana.
pause >nul
