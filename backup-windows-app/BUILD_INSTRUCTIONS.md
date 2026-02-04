# Build Instructions for Backup Windows App

## Prerequisites

1. **Visual Studio 2022** (Community, Professional, or Enterprise)
   - Download from: https://visualstudio.microsoft.com/downloads/
   - Make sure to install ".NET desktop development" workload

2. **.NET 8.0 SDK** (included with Visual Studio 2022)
   - Or download separately from: https://dotnet.microsoft.com/download/dotnet/8.0

3. **MySQL or MariaDB** installed on your system
   - Ensure `mysqldump` and `mysql` commands are available
   - Or add MySQL/MariaDB bin directory to system PATH

## Building the Application

### Option 1: Using Visual Studio (Recommended)

1. Open `BackupApp.sln` in Visual Studio 2022
2. Right-click the solution → **Restore NuGet Packages**
3. Build → **Build Solution** (or press `Ctrl+Shift+B`)
4. Run → **Start Debugging** (or press `F5`)

### Option 2: Using Command Line

1. Open Command Prompt or PowerShell
2. Navigate to the `BackupApp` directory:
   ```cmd
   cd BackupApp
   ```
3. Restore NuGet packages:
   ```cmd
   dotnet restore
   ```
4. Build the application:
   ```cmd
   dotnet build
   ```
5. Run the application:
   ```cmd
   dotnet run
   ```

### Option 3: Publish for Distribution

To create a standalone executable:

```cmd
cd BackupApp
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
```

The executable will be in: `BackupApp\bin\Release\net8.0-windows\win-x64\publish\`

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

## Troubleshooting

### "mysqldump not found" error
- Install MySQL or MariaDB
- Add the bin directory to your system PATH
- Or manually update paths in `BackupService.cs` and `RestoreService.cs`

### Build errors about missing packages
- Right-click solution → **Restore NuGet Packages**
- Or run: `dotnet restore`

### "Cannot find Quartz" or other package errors
- Ensure you have internet connection
- Try: `dotnet nuget locals all --clear` then `dotnet restore`

## Distribution

To distribute the application:
1. Build in Release mode
2. Publish as self-contained (see Option 3 above)
3. Copy the entire `publish` folder to target machine
4. No installation needed - just run the `.exe` file

