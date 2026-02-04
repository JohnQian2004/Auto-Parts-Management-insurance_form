using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using BackupApp.Models;
using Quartz;
using Quartz.Impl;

namespace BackupApp.Services
{
    public class BackupService : IDisposable
    {
        private IScheduler? scheduler;
        private Configuration? currentConfig;
        private bool autoBackupEnabled = true;

        public BackupService()
        {
            InitializeScheduler();
        }

        private async void InitializeScheduler()
        {
            var factory = new StdSchedulerFactory();
            scheduler = await factory.GetScheduler();
            await scheduler.Start();
        }

        public void UpdateSchedule(Configuration config)
        {
            currentConfig = config;
            autoBackupEnabled = config.AutoBackupEnabled;
            
            if (scheduler != null)
            {
                Task.Run(async () =>
                {
                    await scheduler.Clear();
                    if (config.AutoBackupEnabled)
                    {
                        var job = JobBuilder.Create<BackupJob>()
                            .WithIdentity("backupJob", "backupGroup")
                            .Build();

                        var trigger = TriggerBuilder.Create()
                            .WithIdentity("backupTrigger", "backupGroup")
                            .WithSchedule(CronScheduleBuilder.DailyAtHourAndMinute(
                                config.ScheduleHour, 
                                config.ScheduleMinute))
                            .Build();

                        await scheduler.ScheduleJob(job, trigger);
                    }
                }).Wait();
            }
        }

        public void SetAutoBackupEnabled(bool enabled)
        {
            autoBackupEnabled = enabled;
            if (currentConfig != null)
            {
                currentConfig.AutoBackupEnabled = enabled;
                UpdateSchedule(currentConfig);
            }
        }

        public DateTime GetNextBackupTime(int hour, int minute)
        {
            var now = DateTime.Now;
            var nextBackup = new DateTime(now.Year, now.Month, now.Day, hour, minute, 0);
            
            if (nextBackup <= now)
            {
                nextBackup = nextBackup.AddDays(1);
            }
            
            return nextBackup;
        }

        public async Task BackupAllAsync(string imagesPath, string backupPath, DatabaseConfig dbConfig)
        {
            await Task.Run(async () =>
            {
                await BackupImagesAsync(imagesPath, backupPath);
                await BackupDatabaseAsync(backupPath, dbConfig);
            });
        }

        public async Task BackupImagesAsync(string imagesPath, string backupPath)
        {
            await Task.Run(() => BackupImages(imagesPath, backupPath));
        }

        public async Task BackupDatabaseAsync(string backupPath, DatabaseConfig dbConfig)
        {
            await Task.Run(() => BackupDatabase(backupPath, dbConfig));
        }

        private void BackupImages(string imagesPath, string backupPath)
        {
            if (!Directory.Exists(imagesPath))
            {
                throw new DirectoryNotFoundException($"Images directory not found: {imagesPath}");
            }

            var dateStamp = DateTime.Now.ToString("yyyyMMdd");
            var backupDirName = $"images_{dateStamp}";
            var fullBackupPath = Path.Combine(backupPath, "images", backupDirName);

            // Remove existing backup for today if it exists
            if (Directory.Exists(fullBackupPath))
            {
                Directory.Delete(fullBackupPath, true);
            }

            // Copy images directory
            CopyDirectory(imagesPath, fullBackupPath);
        }

        private void BackupDatabase(string backupPath, DatabaseConfig dbConfig)
        {
            var dateStamp = DateTime.Now.ToString("yyyyMMdd");
            var backupFileName = $"{dbConfig.Database}_{dateStamp}.sql";
            var fullBackupPath = Path.Combine(backupPath, "database", backupFileName);

            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(fullBackupPath)!);

            // Find mysqldump
            var mysqldumpPath = FindMysqldumpPath();

            // Build command
            var arguments = $"-h {dbConfig.Host} -P {dbConfig.Port} -u {dbConfig.User} " +
                          $"-p{dbConfig.Password} {dbConfig.Database}";

            var processInfo = new ProcessStartInfo
            {
                FileName = mysqldumpPath,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            // Set password via environment variable for security
            processInfo.EnvironmentVariables["MYSQL_PWD"] = dbConfig.Password;

            using (var process = Process.Start(processInfo))
            {
                if (process == null)
                {
                    throw new Exception("Failed to start mysqldump process");
                }

                using (var fileStream = new FileStream(fullBackupPath, FileMode.Create))
                {
                    process.StandardOutput.BaseStream.CopyTo(fileStream);
                }

                var error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (process.ExitCode != 0 && !string.IsNullOrEmpty(error) && !error.Contains("Warning"))
                {
                    throw new Exception($"mysqldump failed: {error}");
                }
            }
        }

        private string FindMysqldumpPath()
        {
            var possiblePaths = new[]
            {
                @"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
                @"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe",
                @"C:\Program Files\MariaDB 10.11\bin\mysqldump.exe",
                @"C:\Program Files\MariaDB 10.10\bin\mysqldump.exe",
                @"C:\xampp\mysql\bin\mysqldump.exe",
                @"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqldump.exe",
                "mysqldump"
            };

            foreach (var path in possiblePaths)
            {
                if (path == "mysqldump")
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "mysqldump",
                            Arguments = "--version",
                            RedirectStandardOutput = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        });
                        process?.WaitForExit();
                        if (process?.ExitCode == 0)
                        {
                            return "mysqldump";
                        }
                    }
                    catch { }
                }
                else if (File.Exists(path))
                {
                    return path;
                }
            }

            throw new Exception("mysqldump not found. Please install MySQL or MariaDB, or add mysqldump to your PATH.");
        }

        private void CopyDirectory(string sourceDir, string destDir)
        {
            Directory.CreateDirectory(destDir);

            foreach (var file in Directory.GetFiles(sourceDir))
            {
                var fileName = Path.GetFileName(file);
                File.Copy(file, Path.Combine(destDir, fileName), true);
            }

            foreach (var directory in Directory.GetDirectories(sourceDir))
            {
                var dirName = Path.GetFileName(directory);
                CopyDirectory(directory, Path.Combine(destDir, dirName));
            }
        }

        public void Dispose()
        {
            scheduler?.Shutdown();
        }
    }

    public class BackupJob : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            // This will be called by the scheduler
            // The actual backup logic is handled by BackupService
            await Task.CompletedTask;
        }
    }
}

