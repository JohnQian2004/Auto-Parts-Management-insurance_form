# Backup Windows App - Electron/TypeScript

A modern cross-platform desktop application built with Electron and TypeScript for automated backup of images and MySQL/MariaDB databases.

## Features

- **Modern UI**: Beautiful, responsive web-based interface
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Automated Daily Backups**: Scheduled backups at configurable time (default: 4:00 AM)
- **Manual Backup**: Trigger backups immediately from the GUI
- **Image Backup**: Backs up `C:/projects/images` directory with date-stamped folders
- **Database Backup**: Backs up MySQL/MariaDB databases with date-stamped SQL files
- **Restore Functionality**: Restore both database and image backups through GUI
- **Real-time Logging**: View backup operations in real-time
- **Configuration Management**: Save and load settings from GUI

## Requirements

- Node.js 18+ and npm
- MySQL or MariaDB installed with `mysqldump` and `mysql` commands available

## Installation

1. **Install Dependencies**
   ```bash
   cd electron-app
   npm install
   ```

2. **Build TypeScript**
   ```bash
   npm run build
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

## Development

For development with auto-reload:

```bash
npm run dev
```

This will:
- Watch TypeScript files and rebuild automatically
- Start Electron with DevTools open

## Building for Distribution

### Build Windows Installer

```bash
npm run build:win
```

This creates:
- NSIS installer in `dist/Backup Windows App Setup x.x.x.exe`
- Portable version in `dist/Backup Windows App x.x.x.exe`

### Build Portable Version Only

```bash
npm run build:win:portable
```

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
- **Restore Database**: Select and restore a database backup from the dropdown
- **Restore Images**: Select and restore an image backup from the dropdown

### Configuration Tab
- Configure database connection settings
- Set images source path and backup base path
- Configure schedule time (hour and minute)
- Enable/disable auto backup
- Click **Save Configuration** to apply changes

### Logs Tab
- View real-time backup operation logs
- Logs are also saved to `%AppData%/BackupWindowsApp/logs/backup.log`

## Project Structure

```
electron-app/
├── src/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Preload script for IPC
│   ├── services/
│   │   ├── BackupService.ts
│   │   ├── RestoreService.ts
│   │   └── ConfigurationManager.ts
│   └── utils/
│       └── Logger.ts
├── renderer/
│   ├── index.html           # UI HTML
│   ├── styles.css           # UI Styles
│   └── renderer.js          # UI Logic
└── dist/                    # Compiled output
```

## Troubleshooting

### mysqldump not found
- Ensure MySQL/MariaDB is installed
- Add MySQL/MariaDB bin directory to your system PATH
- Or manually update paths in `BackupService.ts` and `RestoreService.ts`

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Electron not starting
- Make sure you've built TypeScript: `npm run build`
- Check that `dist/main.js` exists

## Distribution

After building, distribute:
- **Installer**: `dist/Backup Windows App Setup x.x.x.exe` (for installation)
- **Portable**: `dist/Backup Windows App x.x.x.exe` (standalone executable)

Both versions are self-contained and don't require Node.js on the target machine.

