@echo off
echo ========================================
echo Comparing receipts and receipts2 tables
echo ========================================
echo.

echo Checking if tables exist...
echo.
mysql -u root -ptest testdbjwt -e "SHOW TABLES LIKE 'receipts%%';"

echo.
echo ========================================
echo receipts table (Counter Invoice)
echo ========================================
mysql -u root -ptest testdbjwt -e "SELECT COUNT(*) as counter_invoice_count FROM receipts;"
mysql -u root -ptest testdbjwt -e "SELECT id, name, invoice_number, amount, quantity, vehicle_id, created_at FROM receipts ORDER BY created_at DESC LIMIT 5;"

echo.
echo ========================================
echo receipts2 table (Invoice)
echo ========================================
mysql -u root -ptest testdbjwt -e "SELECT COUNT(*) as invoice_count FROM receipts2;"
mysql -u root -ptest testdbjwt -e "SELECT id, name, invoice_number, amount, quantity, vehicle_id, created_at FROM receipts2 ORDER BY created_at DESC LIMIT 5;"

echo.
echo ========================================
echo Summary
echo ========================================
echo Both tables should exist and contain separate data
echo Counter Invoice tab uses: receipts
echo Invoice tab uses: receipts2
echo.
pause
