using System;
using System.Diagnostics;
using System.IO;
using BackupApp.Models;

namespace BackupApp.Services
{
    public class RestoreService
    {
        public void RestoreDatabase(string backupFilePath, DatabaseConfig dbConfig)
        {
            if (!File.Exists(backupFilePath))
            {
                throw new FileNotFoundException($"Backup file not found: {backupFilePath}");
            }

            // Extract database name from backup file (e.g., testdbjwt_20260203.sql -> testdbjwt)
            var fileName = Path.GetFileNameWithoutExtension(backupFilePath);
            var dbNameMatch = System.Text.RegularExpressions.Regex.Match(fileName, @"^(.+?)_\d{8}$");
            var targetDbName = dbNameMatch.Success ? dbNameMatch.Groups[1].Value : dbConfig.Database;

            // Find mysql
            var mysqlPath = FindMysqlPath();

            // Build command
            var arguments = $"-h {dbConfig.Host} -P {dbConfig.Port} -u {dbConfig.User} " +
                          $"-p{dbConfig.Password} {targetDbName}";

            var processInfo = new ProcessStartInfo
            {
                FileName = mysqlPath,
                Arguments = arguments,
                RedirectStandardInput = true,
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
                    throw new Exception("Failed to start mysql process");
                }

                // Read backup file and write to mysql stdin
                using (var fileStream = File.OpenRead(backupFilePath))
                using (var stdin = process.StandardInput.BaseStream)
                {
                    fileStream.CopyTo(stdin);
                    stdin.Close();
                }

                var error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (process.ExitCode != 0 && !string.IsNullOrEmpty(error) && !error.Contains("Warning"))
                {
                    throw new Exception($"mysql restore failed: {error}");
                }
            }
        }

        public void RestoreImages(string backupDirectoryPath, string targetImagesPath, string backupBasePath)
        {
            if (!Directory.Exists(backupDirectoryPath))
            {
                throw new DirectoryNotFoundException($"Backup directory not found: {backupDirectoryPath}");
            }

            // Create backup of current images directory if it exists
            if (Directory.Exists(targetImagesPath))
            {
                var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var currentBackupPath = $"{targetImagesPath}_backup_{timestamp}";
                CopyDirectory(targetImagesPath, currentBackupPath);
            }

            // Remove current images directory
            if (Directory.Exists(targetImagesPath))
            {
                Directory.Delete(targetImagesPath, true);
            }

            // Restore images from backup
            CopyDirectory(backupDirectoryPath, targetImagesPath);
        }

        private string FindMysqlPath()
        {
            var possiblePaths = new[]
            {
                @"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
                @"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
                @"C:\Program Files\MariaDB 10.11\bin\mysql.exe",
                @"C:\Program Files\MariaDB 10.10\bin\mysql.exe",
                @"C:\xampp\mysql\bin\mysql.exe",
                @"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe",
                "mysql"
            };

            foreach (var path in possiblePaths)
            {
                if (path == "mysql")
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "mysql",
                            Arguments = "--version",
                            RedirectStandardOutput = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        });
                        process?.WaitForExit();
                        if (process?.ExitCode == 0)
                        {
                            return "mysql";
                        }
                    }
                    catch { }
                }
                else if (File.Exists(path))
                {
                    return path;
                }
            }

            throw new Exception("mysql not found. Please install MySQL or MariaDB, or add mysql to your PATH.");
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
    }
}

