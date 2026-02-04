export interface ElectronAPI {
  // Configuration
  loadConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<{ success: boolean }>;

  // Backup
  backupAll: (imagesPath: string, backupPath: string, dbConfig: any) => Promise<{ success: boolean }>;
  backupImages: (imagesPath: string, backupPath: string) => Promise<{ success: boolean }>;
  backupDatabase: (backupPath: string, dbConfig: any) => Promise<{ success: boolean }>;
  getNextBackupTime: (hour: number, minute: number) => Promise<Date>;
  listDatabaseBackups: (backupPath: string) => Promise<Array<{ name: string; path: string; date: Date }>>;
  listImageBackups: (backupPath: string) => Promise<Array<{ name: string; path: string; date: Date }>>;

  // Restore
  restoreDatabase: (backupFilePath: string, dbConfig: any) => Promise<{ success: boolean }>;
  restoreImages: (backupDirPath: string, targetPath: string, backupBasePath: string) => Promise<{ success: boolean }>;

  // Dialogs
  selectFolder: (title: string) => Promise<string | null>;
  selectFile: (title: string, filters: any[]) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

