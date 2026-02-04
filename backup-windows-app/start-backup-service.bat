@echo off
echo Starting Backup Windows App Service...
echo.
cd /d %~dp0
node dist/index.js
pause

