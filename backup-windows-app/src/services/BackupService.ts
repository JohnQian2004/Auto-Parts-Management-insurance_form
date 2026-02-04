import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/Logger';

const execAsync = promisify(exec);
const logger = Logger.getInstance();

export class BackupService {
  private imagesSourcePath: string;
  private backupBasePath: string;
  private dbHost: string;
  private dbPort: number;
  private dbUser: string;
  private dbPassword: string;
  private dbName: string;

  constructor() {
    this.imagesSourcePath = process.env.IMAGES_SOURCE_PATH || 'C:/projects/images';
    this.backupBasePath = process.env.BACKUP_BASE_PATH || 'C:/backups';
    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = parseInt(process.env.DB_PORT || '3306');
    this.dbUser = process.env.DB_USER || 'root';
    this.dbPassword = process.env.DB_PASSWORD || '';
    this.dbName = process.env.DB_NAME || 'testdbjwt';

    // Ensure backup directories exist
    this.ensureBackupDirectories();
  }

  private ensureBackupDirectories() {
    const dbBackupPath = path.join(this.backupBasePath, 'database');
    const imagesBackupPath = path.join(this.backupBasePath, 'images');
    
    fs.ensureDirSync(dbBackupPath);
    fs.ensureDirSync(imagesBackupPath);
    
    logger.info(`Backup directories ensured: ${this.backupBasePath}`);
  }

  private getDateStamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  async backupImages(): Promise<void> {
    try {
      logger.info(`Starting images backup from: ${this.imagesSourcePath}`);

      // Check if source directory exists
      if (!await fs.pathExists(this.imagesSourcePath)) {
        throw new Error(`Source images directory does not exist: ${this.imagesSourcePath}`);
      }

      const dateStamp = this.getDateStamp();
      const backupDirName = `images_${dateStamp}`;
      const backupPath = path.join(this.backupBasePath, 'images', backupDirName);

      // Remove existing backup for today if it exists
      if (await fs.pathExists(backupPath)) {
        logger.info(`Removing existing backup: ${backupDirName}`);
        await fs.remove(backupPath);
      }

      // Copy images directory
      logger.info(`Copying images to: ${backupPath}`);
      await fs.copy(this.imagesSourcePath, backupPath);

      logger.info(`Images backup completed: ${backupDirName}`);
    } catch (error: any) {
      logger.error(`Images backup failed: ${error.message}`, error);
      throw error;
    }
  }

  async backupDatabase(): Promise<void> {
    try {
      logger.info(`Starting database backup: ${this.dbName}`);

      const dateStamp = this.getDateStamp();
      const backupFileName = `${this.dbName}_${dateStamp}.sql`;
      const backupPath = path.join(this.backupBasePath, 'database', backupFileName);

      // Build mysqldump command
      // For MariaDB, mysqldump command is the same
      const mysqldumpPath = this.findMysqldumpPath();
      
      // Use environment variable for password to avoid exposing it in command line
      const env = { ...process.env };
      if (this.dbPassword) {
        env.MYSQL_PWD = this.dbPassword;
      }
      
      const command = `"${mysqldumpPath}" -h ${this.dbHost} -P ${this.dbPort} -u ${this.dbUser} ${this.dbName} > "${backupPath}"`;

      logger.info(`Executing mysqldump command...`);
      
      // Execute mysqldump
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        shell: 'cmd.exe', // Use cmd.exe on Windows
        env: env
      });

      if (stderr && !stderr.includes('Warning')) {
        logger.warn(`mysqldump stderr: ${stderr}`);
      }

      // Verify backup file was created
      if (await fs.pathExists(backupPath)) {
        const stats = await fs.stat(backupPath);
        logger.info(`Database backup completed: ${backupFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        throw new Error('Backup file was not created');
      }
    } catch (error: any) {
      logger.error(`Database backup failed: ${error.message}`, error);
      throw error;
    }
  }

  private findMysqldumpPath(): string {
    // Common MySQL/MariaDB installation paths on Windows
    const possiblePaths = [
      'C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe',
      'C:/Program Files/MySQL/MySQL Server 5.7/bin/mysqldump.exe',
      'C:/Program Files/MariaDB 10.11/bin/mysqldump.exe',
      'C:/Program Files/MariaDB 10.10/bin/mysqldump.exe',
      'C:/Program Files/MariaDB 10.9/bin/mysqldump.exe',
      'C:/xampp/mysql/bin/mysqldump.exe',
      'C:/wamp64/bin/mysql/mysql8.0.31/bin/mysqldump.exe',
      'mysqldump' // If in PATH
    ];

    for (const possiblePath of possiblePaths) {
      if (possiblePath === 'mysqldump') {
        // Check if mysqldump is in PATH
        try {
          require('child_process').execSync('mysqldump --version', { stdio: 'ignore' });
          return 'mysqldump';
        } catch {
          continue;
        }
      }
      
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }

    throw new Error('mysqldump not found. Please install MySQL or MariaDB, or add mysqldump to your PATH.');
  }
}

