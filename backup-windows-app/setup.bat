@echo off
echo ========================================
echo Backup Windows App - Setup Script
echo ========================================
echo.

echo Installing dependencies...
call npm install

echo.
echo Building project...
call npm run build

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy env.example to .env
echo 2. Edit .env with your database credentials
echo 3. Run: npm start
echo.
pause

