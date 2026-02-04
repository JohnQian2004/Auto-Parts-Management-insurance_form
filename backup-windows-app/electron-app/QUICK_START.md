# Quick Start - Electron TypeScript App

## Installation

1. **Navigate to electron-app directory**
   ```bash
   cd electron-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build TypeScript**
   ```bash
   npm run build
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

This will:
- Watch TypeScript files and rebuild automatically
- Start Electron with DevTools open

## Building Windows Executable

### Create Installer
```bash
npm run build:win
```

### Create Portable Version
```bash
npm run build:win:portable
```

The built files will be in the `dist/` directory.

## First Run

1. The application will start with default configuration:
   - Database: `testdbjwt` on `localhost:3306`
   - User: `root`
   - Password: `test`
   - Images: `C:/projects/images`
   - Backups: `C:/backups`

2. Go to the **Configuration** tab
3. Verify or update settings
4. Click **Save Configuration**
5. Enable **Auto Backup** if desired
6. Go to **Backup** tab and test with **Backup All Now**

## Features

- ✅ Modern web-based UI
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Scheduled backups at 4:00 AM (configurable)
- ✅ Manual backup triggers
- ✅ Database and image restore
- ✅ Real-time logging
- ✅ Configuration management

## Troubleshooting

### "mysqldump not found"
- Install MySQL or MariaDB
- Add MySQL/MariaDB bin directory to system PATH
- Or update paths in `src/services/BackupService.ts`

### Build errors
- Run `npm install` to ensure dependencies are installed
- Clear and reinstall: `rm -rf node_modules && npm install`

### Electron not starting
- Make sure TypeScript is built: `npm run build`
- Check that `dist/main.js` exists

