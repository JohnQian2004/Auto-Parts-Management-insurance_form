@echo off
echo ========================================
echo Setting up receipts2 table
echo ========================================
echo.
echo This script will create the receipts2 table in the testdbjwt database
echo.
echo Database: testdbjwt
echo Host: localhost:3306
echo User: root
echo.
echo Press Ctrl+C to cancel, or
pause

mysql -u root -ptest testdbjwt < create_receipts2_table.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS: receipts2 table created!
    echo ========================================
    echo.
    echo Verifying table structure...
    mysql -u root -ptest testdbjwt -e "DESCRIBE receipts2;"
    echo.
    echo Table is ready. You can now restart the Spring Boot server.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to create table
    echo ========================================
    echo.
    echo Please check:
    echo 1. MySQL is running
    echo 2. Database 'testdbjwt' exists
    echo 3. Username and password are correct
)

echo.
pause
