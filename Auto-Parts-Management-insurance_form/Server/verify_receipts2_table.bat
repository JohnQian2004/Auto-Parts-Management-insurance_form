@echo off
echo ========================================
echo Verifying receipts2 table
echo ========================================
echo.

mysql -u root -ptest testdbjwt -e "SHOW TABLES LIKE 'receipts2';"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Checking table structure...
    mysql -u root -ptest testdbjwt -e "DESCRIBE receipts2;"
    echo.
    echo Checking record count...
    mysql -u root -ptest testdbjwt -e "SELECT COUNT(*) as total_records FROM receipts2;"
) else (
    echo.
    echo ERROR: Could not connect to database
)

echo.
pause
