import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs-extra';
import { app } from 'electron';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const logsDir = path.join(app.getPath('userData'), 'logs');
    fs.ensureDirSync(logsDir);

    const logFile = path.join(logsDir, 'backup.log');

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'backup-app' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              let msg = `${timestamp} [${level}]: ${message}`;
              if (Object.keys(meta).length > 0) {
                msg += ` ${JSON.stringify(meta)}`;
              }
              return msg;
            })
          )
        }),
        new winston.transports.File({
          filename: logFile,
          format: winston.format.combine(
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              let msg = `${timestamp} [${level}]: ${message}`;
              if (Object.keys(meta).length > 0) {
                msg += ` ${JSON.stringify(meta)}`;
              }
              return msg;
            })
          )
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error'
        })
      ]
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: any): void {
    this.logger.error(message, { error: error?.message, stack: error?.stack });
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

