import * as path from 'path';
import * as fs from 'fs-extra';
import { app } from 'electron';

export interface Configuration {
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  imagesSourcePath: string;
  backupBasePath: string;
  scheduleHour: number;
  scheduleMinute: number;
  autoBackupEnabled: boolean;
}

export class ConfigurationManager {
  private static getConfigPath(): string {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'config.json');
  }

  static load(): Configuration {
    try {
      const configPath = this.getConfigPath();
      if (fs.existsSync(configPath)) {
        const json = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(json);
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }

    // Return default configuration
    return {
      dbHost: 'localhost',
      dbPort: 3306,
      dbUser: 'root',
      dbPassword: 'test',
      dbName: 'testdbjwt',
      imagesSourcePath: 'C:/projects/images',
      backupBasePath: 'C:/backups',
      scheduleHour: 4,
      scheduleMinute: 0,
      autoBackupEnabled: true
    };
  }

  static save(config: Configuration): void {
    try {
      const configPath = this.getConfigPath();
      fs.ensureDirSync(path.dirname(configPath));
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error}`);
    }
  }
}

