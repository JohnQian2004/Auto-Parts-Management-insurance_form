# Built-in Scheduler Information

## How It Works

The Backup Windows App has a **built-in scheduler** that runs automatically when the application starts. You do **NOT** need to set up Windows Task Scheduler or any external service.

### Key Features

1. **Automatic Startup**: When you launch the app, it automatically:
   - Loads your saved configuration
   - Initializes the scheduler with your settings
   - Starts monitoring for the scheduled backup time

2. **Background Operation**: 
   - The app can run in the background even when the window is closed
   - On Windows, closing the window does NOT quit the app (it keeps running for scheduled backups)
   - To fully quit, use File → Exit or close from Task Manager

3. **Default Schedule**: 
   - Default backup time: **4:00 AM daily**
   - Fully configurable through the Configuration tab

4. **No External Dependencies**:
   - Uses `node-cron` library (built into the app)
   - No Windows Task Scheduler required
   - No Windows Service required
   - Works on all platforms (Windows, macOS, Linux)

## Configuration

### Setting the Schedule

1. Open the app
2. Go to **Configuration** tab
3. Set **Schedule Time**:
   - Hour: 0-23 (default: 4)
   - Minute: 0-59 (default: 0)
4. Check **Enable Auto Backup** checkbox
5. Click **Save Configuration**

### Disabling Auto Backup

1. Go to **Configuration** tab
2. Uncheck **Enable Auto Backup**
3. Click **Save Configuration**

The scheduler will stop, but you can still run manual backups.

## How to Keep the App Running

### Option 1: Keep Window Open
- Simply don't close the window
- The app will run and perform scheduled backups

### Option 2: Minimize to System Tray (Future Enhancement)
- Currently, the app runs in background when window is closed
- Future versions may include system tray icon

### Option 3: Start with Windows
- Add the app to Windows Startup folder:
  1. Press `Win + R`
  2. Type: `shell:startup`
  3. Create a shortcut to the app executable

## Verification

To verify the scheduler is working:

1. Check the **Backup** tab - it shows "Next Backup: [date/time]"
2. Check the **Logs** tab - you'll see scheduler initialization messages
3. After a scheduled backup runs, check logs for backup completion messages

## Troubleshooting

### Scheduler Not Running
- Make sure **Enable Auto Backup** is checked in Configuration
- Check the Logs tab for error messages
- Verify the schedule time is set correctly

### App Quits Unexpectedly
- On Windows, the app should NOT quit when you close the window
- If it does quit, check Task Manager to see if the process is still running
- Make sure you're not using `app.quit()` anywhere in the code

### Backup Not Running at Scheduled Time
- Verify the app is running (check Task Manager)
- Check the Logs tab for scheduler messages
- Verify the schedule time in Configuration tab
- Check system time/timezone settings

## Logs Location

Scheduler and backup logs are saved to:
- Windows: `%AppData%\BackupWindowsApp\logs\backup.log`
- macOS: `~/Library/Application Support/BackupWindowsApp/logs/backup.log`
- Linux: `~/.config/BackupWindowsApp/logs/backup.log`

