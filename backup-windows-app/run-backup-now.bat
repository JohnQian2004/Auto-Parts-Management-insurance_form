@echo off
echo Running backup immediately...
echo.
cd /d %~dp0
node dist/index.js backup-now
pause

