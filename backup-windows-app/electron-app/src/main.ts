import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import { BackupService } from './services/BackupService';
import { RestoreService } from './services/RestoreService';
import { ConfigurationManager } from './services/ConfigurationManager';
import { Logger } from './utils/Logger';

const logger = Logger.getInstance();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'Backup Windows App',
    show: true // Show window on startup
  });

  // Load the HTML file
  const htmlPath = path.join(__dirname, '../renderer/index.html');
  mainWindow.loadFile(htmlPath);
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  // Don't quit on Windows - keep running in background for scheduled backups
  // User can close from system tray or task manager if needed
  if (process.platform === 'darwin') {
    app.quit();
  }
});

// IPC Handlers
const backupService = new BackupService();
const restoreService = new RestoreService();

// Initialize scheduler on startup
async function initializeScheduler() {
  try {
    const config = ConfigurationManager.load();
    backupService.updateSchedule(config);
    
    if (config.autoBackupEnabled) {
      const nextTime = backupService.getNextBackupTime(config.scheduleHour, config.scheduleMinute);
      logger.info(`Scheduler initialized. Next backup scheduled at: ${nextTime.toLocaleString()}`);
    } else {
      logger.info('Auto backup is disabled');
    }
  } catch (error: any) {
    logger.error('Failed to initialize scheduler', error);
  }
}

// Handle configuration updates
ipcMain.on('config:updated', () => {
  initializeScheduler();
});

// Initialize scheduler when app is ready
app.whenReady().then(() => {
  createWindow();
  initializeScheduler();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Configuration handlers
ipcMain.handle('config:load', async () => {
  try {
    return ConfigurationManager.load();
  } catch (error: any) {
    logger.error('Failed to load configuration', error);
    throw error;
  }
});

ipcMain.handle('config:save', async (event, config) => {
  try {
    ConfigurationManager.save(config);
    backupService.updateSchedule(config);
    
    if (config.autoBackupEnabled) {
      const nextTime = backupService.getNextBackupTime(config.scheduleHour, config.scheduleMinute);
      logger.info(`Configuration saved. Next backup scheduled at: ${nextTime.toLocaleString()}`);
    }
    
    // Notify renderer process
    if (mainWindow) {
      mainWindow.webContents.send('config:saved', { nextBackupTime: backupService.getNextBackupTime(config.scheduleHour, config.scheduleMinute) });
    }
    
    return { success: true };
  } catch (error: any) {
    logger.error('Failed to save configuration', error);
    throw error;
  }
});

// Backup handlers
ipcMain.handle('backup:all', async (event, imagesPath, backupPath, dbConfig) => {
  try {
    await backupService.backupAll(imagesPath, backupPath, dbConfig);
    return { success: true };
  } catch (error: any) {
    logger.error('Backup all failed', error);
    throw error;
  }
});

ipcMain.handle('backup:images', async (event, imagesPath, backupPath) => {
  try {
    await backupService.backupImages(imagesPath, backupPath);
    return { success: true };
  } catch (error: any) {
    logger.error('Backup images failed', error);
    throw error;
  }
});

ipcMain.handle('backup:database', async (event, backupPath, dbConfig) => {
  try {
    await backupService.backupDatabase(backupPath, dbConfig);
    return { success: true };
  } catch (error: any) {
    logger.error('Backup database failed', error);
    throw error;
  }
});

ipcMain.handle('backup:getNextTime', async (event, hour, minute) => {
  return backupService.getNextBackupTime(hour, minute);
});

// Restore handlers
ipcMain.handle('restore:database', async (event, backupFilePath, dbConfig) => {
  try {
    await restoreService.restoreDatabase(backupFilePath, dbConfig);
    return { success: true };
  } catch (error: any) {
    logger.error('Restore database failed', error);
    throw error;
  }
});

ipcMain.handle('restore:images', async (event, backupDirPath, targetPath, backupBasePath) => {
  try {
    await restoreService.restoreImages(backupDirPath, targetPath, backupBasePath);
    return { success: true };
  } catch (error: any) {
    logger.error('Restore images failed', error);
    throw error;
  }
});

// File dialogs
ipcMain.handle('dialog:selectFolder', async (event, title) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: title,
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:selectFile', async (event, title, filters) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: title,
    filters: filters,
    properties: ['openFile']
  });
  return result.canceled ? null : result.filePaths[0];
});

// List backups
ipcMain.handle('backup:listDatabase', async (event, backupPath) => {
  try {
    const dbPath = path.join(backupPath, 'database');
    if (!await fs.pathExists(dbPath)) {
      return [];
    }
    const files = await fs.readdir(dbPath);
    return files
      .filter(f => f.endsWith('.sql'))
      .map(f => ({
        name: f,
        path: path.join(dbPath, f),
        date: fs.statSync(path.join(dbPath, f)).mtime
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error: any) {
    logger.error('Failed to list database backups', error);
    return [];
  }
});

ipcMain.handle('backup:listImages', async (event, backupPath) => {
  try {
    const imagesPath = path.join(backupPath, 'images');
    if (!await fs.pathExists(imagesPath)) {
      return [];
    }
    const dirs = await fs.readdir(imagesPath);
    const results = [];
    for (const dir of dirs) {
      const dirPath = path.join(imagesPath, dir);
      const stat = await fs.stat(dirPath);
      if (stat.isDirectory() && dir.startsWith('images_')) {
        results.push({
          name: dir,
          path: dirPath,
          date: stat.mtime
        });
      }
    }
    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error: any) {
    logger.error('Failed to list image backups', error);
    return [];
  }
});

