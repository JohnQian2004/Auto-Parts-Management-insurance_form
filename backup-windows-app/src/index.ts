import * as cron from 'node-cron';
import * as path from 'path';
import * as fs from 'fs-extra';
import { BackupService } from './services/BackupService';
import { RestoreService } from './services/RestoreService';
import { Logger } from './utils/Logger';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const logger = Logger.getInstance();

class BackupApp {
  private backupService: BackupService;
  private restoreService: RestoreService;
  private scheduleTime: string;

  constructor() {
    this.backupService = new BackupService();
    this.restoreService = new RestoreService();
    this.scheduleTime = process.env.SCHEDULE_TIME || '0 4 * * *'; // Default: 4:00 AM daily
  }

  async start() {
    logger.info('Backup Windows App starting...');
    logger.info(`Scheduled backup time: ${this.scheduleTime}`);

    // Schedule daily backup at 4:00 AM
    cron.schedule(this.scheduleTime, async () => {
      logger.info('Scheduled backup started');
      await this.runBackup();
    });

    logger.info('Backup scheduler initialized. Waiting for scheduled time...');

    // Run backup immediately on startup (optional - comment out if not needed)
    // await this.runBackup();

    // Keep the process running
    process.on('SIGINT', () => {
      logger.info('Shutting down gracefully...');
      process.exit(0);
    });
  }

  private async runBackup() {
    try {
      logger.info('=== Starting backup process ===');
      
      // Backup images
      await this.backupService.backupImages();
      
      // Backup database
      await this.backupService.backupDatabase();
      
      logger.info('=== Backup process completed successfully ===');
    } catch (error: any) {
      logger.error(`Backup process failed: ${error.message}`, error);
    }
  }

  // CLI methods for restore operations
  async restoreDatabase(backupFileName: string) {
    try {
      logger.info(`Restoring database from: ${backupFileName}`);
      await this.restoreService.restoreDatabase(backupFileName);
      logger.info('Database restore completed successfully');
    } catch (error: any) {
      logger.error(`Database restore failed: ${error.message}`, error);
      throw error;
    }
  }

  async restoreImages(backupDirectoryName: string) {
    try {
      logger.info(`Restoring images from: ${backupDirectoryName}`);
      await this.restoreService.restoreImages(backupDirectoryName);
      logger.info('Images restore completed successfully');
    } catch (error: any) {
      logger.error(`Images restore failed: ${error.message}`, error);
      throw error;
    }
  }
}

// CLI interface
const args = process.argv.slice(2);
const app = new BackupApp();

if (args.length === 0) {
  // Start the scheduler
  app.start();
} else if (args[0] === 'restore-db' && args[1]) {
  // Restore database: node dist/index.js restore-db testdbjwt_20260203.sql
  app.restoreDatabase(args[1]).then(() => {
    process.exit(0);
  }).catch((error) => {
    process.exit(1);
  });
} else if (args[0] === 'restore-images' && args[1]) {
  // Restore images: node dist/index.js restore-images images_20260203
  app.restoreImages(args[1]).then(() => {
    process.exit(0);
  }).catch((error) => {
    process.exit(1);
  });
} else if (args[0] === 'backup-now') {
  // Run backup immediately
  app['runBackup']().then(() => {
    process.exit(0);
  }).catch((error) => {
    process.exit(1);
  });
} else {
  console.log('Usage:');
  console.log('  node dist/index.js                    - Start scheduler');
  console.log('  node dist/index.js backup-now          - Run backup immediately');
  console.log('  node dist/index.js restore-db <file>   - Restore database from backup file');
  console.log('  node dist/index.js restore-images <dir> - Restore images from backup directory');
  process.exit(1);
}

