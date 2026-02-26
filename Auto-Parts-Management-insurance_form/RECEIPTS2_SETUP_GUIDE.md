# Invoice Tab (receipts2) Setup Guide

## Overview
The Invoice tab has been successfully cloned from the Counter Invoice (receipt-damages) tab. It uses a separate `receipts2` database table to maintain independent data.

## Changes Made

### Frontend (Angular)

#### 1. Service Layer (`receipt2.service.ts`)
Added new methods that use the `/api/receipts2` endpoint:
- `createReceipt2()` - Creates invoice items in receipts2 table
- `updateSequence2()` - Updates sequence numbers
- `deleteReceipt2()` - Deletes invoice items
- `deleteReceiptWithOption2()` - Deletes with related data
- `deleteReceiptWithUserId2()` - Deletes with user tracking
- `deleteReceiptWithOptionWithUserId2()` - Deletes with both options
- `getAllVehicleReceipts2()` - Fetches all invoice items for a vehicle

#### 2. Component (`inshop2.component.ts`)
Updated all Invoice tab methods to use `xxx2` versions:
- `createReceipt2()` - Now calls `receipt2Service.createReceipt2()`
- `onEnterReceipt2()` - Now calls `receipt2Service.createReceipt2()`
- `deleteVehicleReceipt2()` - Now calls `receipt2Service.deleteReceipt2()` methods
- `getAllVehicleReceipts2()` - Fetches from receipts2 table
- All calculation methods: `getTotal2()`, `getTax2()`, `getSubtotal2()`, etc.

#### 3. Template (`inshop2.component.html`)
- Invoice tab binds to `receipts2` array
- All function calls use `xxx2` versions
- UI remains identical to Counter Invoice tab

### Backend (Spring Boot)

#### 1. Model (`Receipt2.java`)
- Entity mapped to `receipts2` table
- All fields match the original Receipt model
- `reason` field is @Transient (not stored in DB, used for logging)

#### 2. Controller (`Receipt2Controller.java`)
- Mapped to `/api/receipts2` endpoint
- All CRUD operations implemented
- Integrates with VehicleHistory for audit logging

#### 3. Repository (`Receipt2Repository.java`)
- Extends JpaRepository
- Custom query methods for vehicle-based retrieval

#### 4. Security (`WebSecurityConfig.java`)
- `/api/receipts2/**` endpoints are permitted
- CORS configured with `@CrossOrigin("*")`

## Database Setup

### Required Action: Create receipts2 Table

The `receipts2` table must be created in the MySQL database before the Invoice tab will work.

#### Option 1: Run the Setup Script (Recommended)
```bash
cd Auto-Parts-Management-insurance_form/Server
setup_receipts2_table.bat
```

#### Option 2: Manual SQL Execution
```bash
mysql -u root -ptest testdbjwt < create_receipts2_table.sql
```

#### Option 3: MySQL Workbench
1. Open MySQL Workbench
2. Connect to localhost:3306
3. Select `testdbjwt` database
4. Open `create_receipts2_table.sql`
5. Execute the script

### Verify Table Creation
```bash
cd Auto-Parts-Management-insurance_form/Server
verify_receipts2_table.bat
```

Or manually:
```sql
USE testdbjwt;
SHOW TABLES LIKE 'receipts2';
DESCRIBE receipts2;
```

## Testing Steps

1. **Create the Database Table**
   - Run one of the setup options above
   - Verify the table exists

2. **Restart Spring Boot Server**
   - Stop the current server
   - Start it again to ensure all connections are fresh

3. **Test Invoice Creation**
   - Open the application in browser
   - Navigate to a vehicle
   - Go to the "Invoice" tab
   - Click "Add Invoice Item"
   - Verify the item appears in the list
   - Check browser console for the response (should show id: 8102 or similar)

4. **Verify Database Storage**
   ```sql
   USE testdbjwt;
   SELECT * FROM receipts2;
   ```
   - Should see the created invoice items

5. **Test Data Separation**
   - Add items to "Counter Invoice" tab (receipts table)
   - Add items to "Invoice" tab (receipts2 table)
   - Verify they remain separate

## Troubleshooting

### Issue: "Table 'testdbjwt.receipts2' doesn't exist"
**Solution**: Run the setup script to create the table

### Issue: CORS errors in browser console
**Solution**: 
- Verify Spring Boot server is running on port 8445
- Check that WebSecurityConfig includes `/api/receipts2/**`
- Restart the server

### Issue: Items appear in wrong tab
**Solution**: 
- Verify the HTML template uses `receipts2` array
- Check that all methods call `xxx2` versions
- Clear browser cache and reload

### Issue: "Ambiguous mapping" error on server startup
**Solution**: 
- Check for duplicate controllers (Receipt2Controller and Receipt22Controller)
- Delete any duplicate controller files
- Restart the server

## API Endpoints

All endpoints are prefixed with `/api/receipts2`

- `POST /api/receipts2/{userId}` - Create or update invoice item
- `GET /api/receipts2/{id}` - Get single invoice item
- `GET /api/receipts2/vehicle/{vehicleId}` - Get all invoice items for vehicle
- `DELETE /api/receipts2/{id}` - Delete invoice item
- `DELETE /api/receipts2/{userId}/{id}` - Delete with user tracking
- `DELETE /api/receipts2/option/{id}` - Delete with related data
- `DELETE /api/receipts2/option/{userId}/{id}` - Delete with all options
- `POST /api/receipts2/sequence/{vehicleId}` - Update sequence numbers

## Data Flow

1. User clicks "Add Invoice Item" in Invoice tab
2. Frontend calls `createReceipt2()` in component
3. Component calls `receipt2Service.createReceipt2(userId, receipt2)`
4. Service sends POST to `/api/receipts2/{userId}`
5. Backend `Receipt2Controller.createAndUpdateReceipt2()` handles request
6. Data saved to `receipts2` table via `Receipt2Repository`
7. Response returned to frontend
8. Component calls `getAllVehicleReceipts2()` to refresh list
9. Service fetches from `/api/receipts2/vehicle/{vehicleId}`
10. UI updates with new data from `receipts2` array

## Files Modified

### Frontend
- `Client/angular-parthub/src/app/_services/receipt2.service.ts`
- `Client/angular-parthub/src/app/inshop2/inshop2.component.ts`
- `Client/angular-parthub/src/app/inshop2/inshop2.component.html`

### Backend
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/controllers/Receipt2Controller.java`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/models/Receipt2.java`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/repository/Receipt2Repository.java`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/security/WebSecurityConfig.java`

### Database
- `Server/create_receipts2_table.sql` (SQL script)
- `Server/setup_receipts2_table.bat` (Setup helper)
- `Server/verify_receipts2_table.bat` (Verification helper)

## Next Steps

1. ✅ Create `receipts2` table in database
2. ✅ Restart Spring Boot server
3. ✅ Test invoice creation through UI
4. ✅ Verify data is saved to `receipts2` table
5. ✅ Confirm Counter Invoice and Invoice tabs maintain separate data
