import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/Logger';

const execAsync = promisify(exec);
const logger = Logger.getInstance();

export class RestoreService {
  async restoreDatabase(backupFilePath: string, dbConfig: any): Promise<void> {
    try {
      logger.info(`Starting database restore from: ${backupFilePath}`);

      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file not found: ${backupFilePath}`);
      }

      const fileName = path.basename(backupFilePath, '.sql');
      const dbNameMatch = fileName.match(/^(.+?)_\d{8}$/);
      const targetDbName = dbNameMatch ? dbNameMatch[1] : dbConfig.database;

      logger.info(`Restoring to database: ${targetDbName}`);

      const mysqlPath = this.findMysqlPath();
      const env = { ...process.env };
      if (dbConfig.password) {
        env.MYSQL_PWD = dbConfig.password;
      }

      const command = `"${mysqlPath}" -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} ${targetDbName} < "${backupFilePath}"`;

      logger.info(`Executing mysql restore command...`);
      
      await new Promise<void>((resolve, reject) => {
        exec(command, { env, shell: 'cmd.exe', maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
          if (error) {
            logger.error(`mysql restore failed: ${error.message}`, error);
            reject(error);
            return;
          }
          if (stderr && !stderr.includes('Warning')) {
            logger.warn(`mysql stderr: ${stderr}`);
          }
          logger.info(`Database restore completed: ${targetDbName} from ${path.basename(backupFilePath)}`);
          resolve();
        });
      });
    } catch (error: any) {
      logger.error(`Database restore failed: ${error.message}`, error);
      throw error;
    }
  }

  async restoreImages(backupDirPath: string, targetPath: string, backupBasePath: string): Promise<void> {
    try {
      logger.info(`Starting images restore from: ${backupDirPath}`);

      if (!await fs.pathExists(backupDirPath)) {
        throw new Error(`Backup directory not found: ${backupDirPath}`);
      }

      if (await fs.pathExists(targetPath)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const currentBackupPath = `${targetPath}_backup_${timestamp}`;
        logger.info(`Backing up current images to: ${currentBackupPath}`);
        await fs.copy(targetPath, currentBackupPath);
      }

      if (await fs.pathExists(targetPath)) {
        logger.info(`Removing current images directory: ${targetPath}`);
        await fs.remove(targetPath);
      }

      logger.info(`Restoring images from: ${backupDirPath} to ${targetPath}`);
      await fs.copy(backupDirPath, targetPath);

      logger.info(`Images restore completed: ${path.basename(backupDirPath)} to ${targetPath}`);
    } catch (error: any) {
      logger.error(`Images restore failed: ${error.message}`, error);
      throw error;
    }
  }

  private findMysqlPath(): string {
    const possiblePaths = [
      'C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe',
      'C:/Program Files/MySQL/MySQL Server 5.7/bin/mysql.exe',
      'C:/Program Files/MariaDB 10.11/bin/mysql.exe',
      'C:/Program Files/MariaDB 10.10/bin/mysql.exe',
      'C:/xampp/mysql/bin/mysql.exe',
      'C:/wamp64/bin/mysql/mysql8.0.31/bin/mysql.exe',
      'mysql'
    ];

    for (const possiblePath of possiblePaths) {
      if (possiblePath === 'mysql') {
        try {
          require('child_process').execSync('mysql --version', { stdio: 'ignore' });
          return 'mysql';
        } catch {
          continue;
        }
      }
      
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }

    throw new Error('mysql not found. Please install MySQL or MariaDB, or add mysql to your PATH.');
  }
}

