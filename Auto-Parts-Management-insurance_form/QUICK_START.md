# Quick Start - Invoice Tab Setup

## What Was Done
✅ Cloned Counter Invoice tab to create Invoice tab  
✅ All UI bindings changed from `receipts` to `receipts2`  
✅ All functions updated to use `xxx2` versions  
✅ Backend API created at `/api/receipts2`  
✅ Service methods created for receipts2 operations  
✅ Spring Security configured for receipts2 endpoints  
✅ Auto-reload receipts2 when vehicle is selected (following receipts pattern)

## Auto-Reload Implementation
The Invoice tab now automatically reloads `receipts2` data whenever:
- A vehicle is selected via `getVehicle()`
- Vehicle data is refreshed
- Autoparts are updated
- Claims are created/updated
- Markup or discount percentages change

This follows the same pattern as the Counter Invoice tab to ensure data consistency.

## What You Need to Do

### Step 1: Create Database Table
Run this command in the Server directory:
```bash
cd Auto-Parts-Management-insurance_form/Server
setup_receipts2_table.bat
```

Or manually execute:
```bash
mysql -u root -ptest testdbjwt < create_receipts2_table.sql
```

### Step 2: Restart Spring Boot Server
Stop and restart your Spring Boot application to ensure clean connections.

### Step 3: Test
1. Open the application in browser
2. Navigate to any vehicle
3. Go to "Invoice" tab
4. Click "Add Invoice Item"
5. Verify item is created and appears in the list
6. Switch to another vehicle and back - verify Invoice tab reloads automatically

### Step 4: Verify Database
Run this to check both tables:
```bash
cd Auto-Parts-Management-insurance_form/Server
check_receipts_tables.bat
```

## Expected Result
- Counter Invoice tab saves to `receipts` table
- Invoice tab saves to `receipts2` table
- Both tabs maintain completely separate data
- All CRUD operations work independently
- Both tabs auto-reload when vehicle is selected

## Files to Review
- `RECEIPTS2_SETUP_GUIDE.md` - Complete documentation
- `Server/create_receipts2_table.sql` - Database schema
- `Client/angular-parthub/src/app/_services/receipt2.service.ts` - Service methods
- `Client/angular-parthub/src/app/inshop2/inshop2.component.ts` - Component methods

## Troubleshooting
If you see errors, check:
1. ✅ Database table `receipts2` exists
2. ✅ Spring Boot server restarted after table creation
3. ✅ No CORS errors in browser console
4. ✅ API endpoint is `/api/receipts2` not `/api/receipts22`
5. ✅ Invoice tab reloads when switching vehicles
