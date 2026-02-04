# Backup Windows App

A Windows application for automated backup of images and MySQL/MariaDB databases with scheduled daily backups and restore capabilities.

## Features

- **Automated Daily Backups**: Scheduled backups at 4:00 AM every morning
- **Image Backup**: Backs up `C:/projects/images` directory with date-stamped folders
- **Database Backup**: Backs up MySQL/MariaDB databases with date-stamped SQL files
- **Restore Functionality**: Restore both database and image backups
- **Logging**: Comprehensive logging to console and log files

## Installation

1. Install Node.js (v18 or higher recommended)

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Configure environment variables:
```bash
copy .env.example .env
```

Edit `.env` file with your configuration:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=testdbjwt

IMAGES_SOURCE_PATH=C:/projects/images
BACKUP_BASE_PATH=C:/backups
SCHEDULE_TIME=0 4 * * *

LOG_LEVEL=info
```

## Usage

### Start the Scheduler

Run the application to start the scheduled backup service:

```bash
npm start
```

The application will:
- Start the scheduler waiting for the scheduled time (default: 4:00 AM)
- Run backups automatically at the scheduled time
- Keep running until stopped (Ctrl+C)

### Run Backup Immediately

To run a backup immediately without waiting for the schedule:

```bash
node dist/index.js backup-now
```

### Restore Database

Restore a database backup to MariaDB/MySQL:

```bash
node dist/index.js restore-db testdbjwt_20260203.sql
```

The backup file should be in `C:/backups/database/` directory.

### Restore Images

Restore images from a backup directory:

```bash
node dist/index.js restore-images images_20260203
```

The backup directory should be in `C:/backups/images/` directory.

## Windows Task Scheduler Setup (Alternative)

If you prefer to use Windows Task Scheduler instead of the built-in scheduler:

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" at 4:00 AM
4. Set action to "Start a program"
5. Program: `node`
6. Arguments: `C:\path\to\backup-windows-app\dist\index.js backup-now`
7. Start in: `C:\path\to\backup-windows-app`

## Backup Structure

### Database Backups
- Location: `C:/backups/database/`
- Format: `{database_name}_{YYYYMMDD}.sql`
- Example: `testdbjwt_20260203.sql`

### Image Backups
- Location: `C:/backups/images/`
- Format: `images_{YYYYMMDD}/`
- Example: `images_20260203/`

## Requirements

- Node.js 18+
- MySQL or MariaDB installed with `mysqldump` and `mysql` commands available
- Windows OS
- Sufficient disk space for backups

## Troubleshooting

### mysqldump not found
- Ensure MySQL/MariaDB is installed
- Add MySQL/MariaDB bin directory to your system PATH
- Or update the paths in `BackupService.ts` and `RestoreService.ts`

### Permission Errors
- Run the application as Administrator if needed
- Ensure backup directories have write permissions
- Check database user has backup/restore permissions

### Database Connection Issues
- Verify database credentials in `.env` file
- Ensure MySQL/MariaDB service is running
- Check firewall settings

## Logs

Logs are stored in:
- `logs/backup.log` - All logs
- `logs/error.log` - Error logs only

## License

MIT

