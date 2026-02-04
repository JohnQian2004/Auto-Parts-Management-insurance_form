import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/Logger';

const execAsync = promisify(exec);
const logger = Logger.getInstance();

export class RestoreService {
  private backupBasePath: string;
  private imagesSourcePath: string;
  private dbHost: string;
  private dbPort: number;
  private dbUser: string;
  private dbPassword: string;
  private dbName: string;

  constructor() {
    this.backupBasePath = process.env.BACKUP_BASE_PATH || 'C:/backups';
    this.imagesSourcePath = process.env.IMAGES_SOURCE_PATH || 'C:/projects/images';
    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = parseInt(process.env.DB_PORT || '3306');
    this.dbUser = process.env.DB_USER || 'root';
    this.dbPassword = process.env.DB_PASSWORD || '';
    this.dbName = process.env.DB_NAME || 'testdbjwt';
  }

  async restoreDatabase(backupFileName: string): Promise<void> {
    try {
      logger.info(`Starting database restore from: ${backupFileName}`);

      // Construct full backup file path
      const backupFilePath = path.join(this.backupBasePath, 'database', backupFileName);

      // Verify backup file exists
      if (!await fs.pathExists(backupFilePath)) {
        throw new Error(`Backup file not found: ${backupFilePath}`);
      }

      // Extract database name from backup file (e.g., testdbjwt_20260203.sql -> testdbjwt)
      const dbNameMatch = backupFileName.match(/^(.+?)_\d{8}\.sql$/);
      const targetDbName = dbNameMatch ? dbNameMatch[1] : this.dbName;

      logger.info(`Restoring to database: ${targetDbName}`);

      // Find mysql command
      const mysqlPath = this.findMysqlPath();

      // Build mysql restore command
      // For MariaDB, mysql command is the same
      // Use environment variable for password to avoid exposing it in command line
      const env = { ...process.env };
      if (this.dbPassword) {
        env.MYSQL_PWD = this.dbPassword;
      }
      
      const command = `"${mysqlPath}" -h ${this.dbHost} -P ${this.dbPort} -u ${this.dbUser} ${targetDbName} < "${backupFilePath}"`;

      logger.info(`Executing mysql restore command...`);
      
      // Execute mysql restore
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        shell: 'cmd.exe', // Use cmd.exe on Windows
        env: env
      });

      if (stderr && !stderr.includes('Warning')) {
        logger.warn(`mysql stderr: ${stderr}`);
      }

      logger.info(`Database restore completed: ${targetDbName} from ${backupFileName}`);
    } catch (error: any) {
      logger.error(`Database restore failed: ${error.message}`, error);
      throw error;
    }
  }

  async restoreImages(backupDirectoryName: string): Promise<void> {
    try {
      logger.info(`Starting images restore from: ${backupDirectoryName}`);

      // Construct full backup directory path
      const backupDirPath = path.join(this.backupBasePath, 'images', backupDirectoryName);

      // Verify backup directory exists
      if (!await fs.pathExists(backupDirPath)) {
        throw new Error(`Backup directory not found: ${backupDirPath}`);
      }

      // Create backup of current images directory if it exists
      if (await fs.pathExists(this.imagesSourcePath)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const currentBackupPath = `${this.imagesSourcePath}_backup_${timestamp}`;
        logger.info(`Backing up current images to: ${currentBackupPath}`);
        await fs.copy(this.imagesSourcePath, currentBackupPath);
      }

      // Remove current images directory
      if (await fs.pathExists(this.imagesSourcePath)) {
        logger.info(`Removing current images directory: ${this.imagesSourcePath}`);
        await fs.remove(this.imagesSourcePath);
      }

      // Restore images from backup
      logger.info(`Restoring images from: ${backupDirPath} to ${this.imagesSourcePath}`);
      await fs.copy(backupDirPath, this.imagesSourcePath);

      logger.info(`Images restore completed: ${backupDirectoryName} to ${this.imagesSourcePath}`);
    } catch (error: any) {
      logger.error(`Images restore failed: ${error.message}`, error);
      throw error;
    }
  }

  private findMysqlPath(): string {
    // Common MySQL/MariaDB installation paths on Windows
    const possiblePaths = [
      'C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe',
      'C:/Program Files/MySQL/MySQL Server 5.7/bin/mysql.exe',
      'C:/Program Files/MariaDB 10.11/bin/mysql.exe',
      'C:/Program Files/MariaDB 10.10/bin/mysql.exe',
      'C:/Program Files/MariaDB 10.9/bin/mysql.exe',
      'C:/xampp/mysql/bin/mysql.exe',
      'C:/wamp64/bin/mysql/mysql8.0.31/bin/mysql.exe',
      'mysql' // If in PATH
    ];

    for (const possiblePath of possiblePaths) {
      if (possiblePath === 'mysql') {
        // Check if mysql is in PATH
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

