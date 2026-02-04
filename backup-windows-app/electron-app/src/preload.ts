import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration
  loadConfig: () => ipcRenderer.invoke('config:load'),
  saveConfig: (config: any) => ipcRenderer.invoke('config:save', config),

  // Backup
  backupAll: (imagesPath: string, backupPath: string, dbConfig: any) =>
    ipcRenderer.invoke('backup:all', imagesPath, backupPath, dbConfig),
  backupImages: (imagesPath: string, backupPath: string) =>
    ipcRenderer.invoke('backup:images', imagesPath, backupPath),
  backupDatabase: (backupPath: string, dbConfig: any) =>
    ipcRenderer.invoke('backup:database', backupPath, dbConfig),
  getNextBackupTime: (hour: number, minute: number) =>
    ipcRenderer.invoke('backup:getNextTime', hour, minute),
  listDatabaseBackups: (backupPath: string) =>
    ipcRenderer.invoke('backup:listDatabase', backupPath),
  listImageBackups: (backupPath: string) =>
    ipcRenderer.invoke('backup:listImages', backupPath),

  // Restore
  restoreDatabase: (backupFilePath: string, dbConfig: any) =>
    ipcRenderer.invoke('restore:database', backupFilePath, dbConfig),
  restoreImages: (backupDirPath: string, targetPath: string, backupBasePath: string) =>
    ipcRenderer.invoke('restore:images', backupDirPath, targetPath, backupBasePath),

  // Dialogs
  selectFolder: (title: string) => ipcRenderer.invoke('dialog:selectFolder', title),
  selectFile: (title: string, filters: any[]) => ipcRenderer.invoke('dialog:selectFile', title, filters),
});

