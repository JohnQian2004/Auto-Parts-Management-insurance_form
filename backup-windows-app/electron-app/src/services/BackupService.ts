import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as cron from 'node-cron';
import { Logger } from '../utils/Logger';

const execAsync = promisify(exec);
const logger = Logger.getInstance();

export class BackupService {
  private scheduleTime: string = '0 4 * * *';
  private cronJob: cron.ScheduledTask | null = null;
  private currentConfig: any = null;

  async backupAll(imagesPath: string, backupPath: string, dbConfig: any): Promise<void> {
    await this.backupImages(imagesPath, backupPath);
    await this.backupDatabase(backupPath, dbConfig);
  }

  async backupImages(imagesPath: string, backupPath: string): Promise<void> {
    try {
      logger.info(`Starting images backup from: ${imagesPath}`);

      if (!await fs.pathExists(imagesPath)) {
        throw new Error(`Source images directory does not exist: ${imagesPath}`);
      }

      const dateStamp = this.getDateStamp();
      const backupDirName = `images_${dateStamp}`;
      const fullBackupPath = path.join(backupPath, 'images', backupDirName);

      if (await fs.pathExists(fullBackupPath)) {
        logger.info(`Removing existing backup: ${backupDirName}`);
        await fs.remove(fullBackupPath);
      }

      logger.info(`Copying images to: ${fullBackupPath}`);
      await fs.copy(imagesPath, fullBackupPath);

      logger.info(`Images backup completed: ${backupDirName}`);
    } catch (error: any) {
      logger.error(`Images backup failed: ${error.message}`, error);
      throw error;
    }
  }

  async backupDatabase(backupPath: string, dbConfig: any): Promise<void> {
    try {
      logger.info(`Starting database backup: ${dbConfig.database}`);

      const dateStamp = this.getDateStamp();
      const backupFileName = `${dbConfig.database}_${dateStamp}.sql`;
      const fullBackupPath = path.join(backupPath, 'database', backupFileName);

      await fs.ensureDir(path.dirname(fullBackupPath));

      const mysqldumpPath = this.findMysqldumpPath();
      const env = { ...process.env };
      if (dbConfig.password) {
        env.MYSQL_PWD = dbConfig.password;
      }

      const command = `"${mysqldumpPath}" -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} ${dbConfig.database} > "${fullBackupPath}"`;

      logger.info(`Executing mysqldump command...`);
      
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024,
        shell: 'cmd.exe',
        env: env
      });

      if (stderr && !stderr.includes('Warning')) {
        logger.warn(`mysqldump stderr: ${stderr}`);
      }

      if (await fs.pathExists(fullBackupPath)) {
        const stats = await fs.stat(fullBackupPath);
        logger.info(`Database backup completed: ${backupFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        throw new Error('Backup file was not created');
      }
    } catch (error: any) {
      logger.error(`Database backup failed: ${error.message}`, error);
      throw error;
    }
  }

  private getDateStamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private findMysqldumpPath(): string {
    const possiblePaths = [
      'C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe',
      'C:/Program Files/MySQL/MySQL Server 5.7/bin/mysqldump.exe',
      'C:/Program Files/MariaDB 10.11/bin/mysqldump.exe',
      'C:/Program Files/MariaDB 10.10/bin/mysqldump.exe',
      'C:/xampp/mysql/bin/mysqldump.exe',
      'C:/wamp64/bin/mysql/mysql8.0.31/bin/mysqldump.exe',
      'mysqldump'
    ];

    for (const possiblePath of possiblePaths) {
      if (possiblePath === 'mysqldump') {
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

  updateSchedule(config: any): void {
    // Store current config for scheduled backups
    this.currentConfig = config;
    
    // Stop existing schedule if any
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }

    if (config.autoBackupEnabled) {
      // Cron format: minute hour day month day-of-week
      // For daily at specific time: minute hour * * *
      const cronExpression = `${config.scheduleMinute} ${config.scheduleHour} * * *`;
      
      this.cronJob = cron.schedule(cronExpression, async () => {
        logger.info('=== Scheduled backup started ===');
        try {
          // Use stored config for scheduled backups
          const dbConfig = {
            host: this.currentConfig.dbHost,
            port: this.currentConfig.dbPort,
            user: this.currentConfig.dbUser,
            password: this.currentConfig.dbPassword,
            database: this.currentConfig.dbName
          };
          
          await this.backupAll(
            this.currentConfig.imagesSourcePath, 
            this.currentConfig.backupBasePath, 
            dbConfig
          );
          logger.info('=== Scheduled backup completed successfully ===');
        } catch (error: any) {
          logger.error(`Scheduled backup failed: ${error.message}`, error);
        }
      }, {
        scheduled: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      
      logger.info(`Schedule updated: Daily at ${String(config.scheduleHour).padStart(2, '0')}:${String(config.scheduleMinute).padStart(2, '0')} (${cronExpression})`);
    } else {
      logger.info('Auto backup is disabled');
    }
  }

  getNextBackupTime(hour: number, minute: number): Date {
    const now = new Date();
    const nextBackup = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    
    if (nextBackup <= now) {
      nextBackup.setDate(nextBackup.getDate() + 1);
    }
    
    return nextBackup;
  }
}

