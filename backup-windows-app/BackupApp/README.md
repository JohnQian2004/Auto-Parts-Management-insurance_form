# Backup Windows App - Windows Forms Application

A Windows Forms GUI application for automated backup of images and MySQL/MariaDB databases.

## Features

- **Windows Forms GUI**: User-friendly interface with tabs for Backup, Restore, Configuration, and Logs
- **Automated Daily Backups**: Scheduled backups at configurable time (default: 4:00 AM)
- **Manual Backup**: Trigger backups immediately from the GUI
- **Image Backup**: Backs up `C:/projects/images` directory with date-stamped folders
- **Database Backup**: Backs up MySQL/MariaDB databases with date-stamped SQL files
- **Restore Functionality**: Restore both database and image backups through GUI dialogs
- **Real-time Logging**: View backup operations in real-time
- **Configuration Management**: Save and load settings from GUI

## Requirements

- .NET 8.0 SDK or later
- Visual Studio 2022 (recommended) or Visual Studio Code
- MySQL or MariaDB installed with `mysqldump` and `mysql` commands available

## Building the Application

1. Open `BackupApp.sln` in Visual Studio 2022
2. Restore NuGet packages (right-click solution → Restore NuGet Packages)
3. Build the solution (Build → Build Solution or Ctrl+Shift+B)
4. Run the application (F5 or Debug → Start Debugging)

## Configuration

The application uses the default configuration from your `application.properties`:
- Database: `testdbjwt` on `localhost:3306`
- User: `root`
- Password: `test`
- Images: `C:/projects/images`
- Backups: `C:/backups`

You can modify these settings in the **Configuration** tab and click **Save Configuration**.

## Usage

### Backup Tab
- **Backup All Now**: Backup both images and database immediately
- **Backup Images**: Backup only images
- **Backup Database**: Backup only database
- **Next Backup**: Shows when the next scheduled backup will run

### Restore Tab
- **Restore Database**: Opens a dialog to select and restore a database backup
- **Restore Images**: Opens a dialog to select and restore an image backup

### Configuration Tab
- Configure database connection settings
- Set images source path and backup base path
- Configure schedule time (hour and minute)
- Enable/disable auto backup
- Click **Save Configuration** to apply changes

### Logs Tab
- View real-time backup operation logs
- Logs are also saved to `logs/backup_YYYYMMDD.log` files

## Backup Locations

- **Database backups**: `C:/backups/database/testdbjwt_YYYYMMDD.sql`
- **Image backups**: `C:/backups/images/images_YYYYMMDD/`

## Troubleshooting

### mysqldump not found
- Ensure MySQL/MariaDB is installed
- Add MySQL/MariaDB bin directory to your system PATH
- Or update the paths in `BackupService.cs` (FindMysqldumpPath method)

### Permission Errors
- Run the application as Administrator if needed
- Ensure backup directories have write permissions
- Check database user has backup/restore permissions

### Database Connection Issues
- Verify database credentials in Configuration tab
- Ensure MySQL/MariaDB service is running
- Check firewall settings

## Logs

Logs are stored in:
- Application logs: `logs/backup_YYYYMMDD.log` (in application directory)
- Configuration: `%AppData%\BackupWindowsApp\config.json`

