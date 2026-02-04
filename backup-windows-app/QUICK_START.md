# Quick Start Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Create Environment File**
   ```bash
   copy env.example .env
   ```

4. **Verify Configuration**
   The `.env` file is already configured with:
   - Database: `testdbjwt` on `localhost:3306`
   - User: `root`
   - Password: `test`
   - Images source: `C:/projects/images`
   - Backup location: `C:/backups`
   - Schedule: 4:00 AM daily

## Running the Application

### Start the Scheduler (Recommended)
This will run the backup service and wait for the scheduled time (4:00 AM):
```bash
npm start
```
Or double-click: `start-backup-service.bat`

### Run Backup Immediately
To test the backup without waiting:
```bash
node dist/index.js backup-now
```
Or double-click: `run-backup-now.bat`

## Restore Operations

### Restore Database
```bash
node dist/index.js restore-db testdbjwt_20260203.sql
```

### Restore Images
```bash
node dist/index.js restore-images images_20260203
```

## Backup Locations

- **Database backups**: `C:/backups/database/`
- **Image backups**: `C:/backups/images/`

## Windows Task Scheduler (Alternative)

If you prefer Windows Task Scheduler:

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Backup Windows App"
4. Trigger: Daily at 4:00 AM
5. Action: Start a program
6. Program: `node`
7. Arguments: `C:\path\to\backup-windows-app\dist\index.js backup-now`
8. Start in: `C:\path\to\backup-windows-app`

## Troubleshooting

### Check if mysqldump is available
```bash
mysqldump --version
```

If not found, add MySQL/MariaDB bin directory to your PATH, or update the paths in:
- `src/services/BackupService.ts` (findMysqldumpPath method)
- `src/services/RestoreService.ts` (findMysqlPath method)

### Check Logs
- All logs: `logs/backup.log`
- Errors only: `logs/error.log`

