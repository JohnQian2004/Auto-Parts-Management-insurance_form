using System;

namespace BackupApp.Models
{
    public class Configuration
    {
        public string DbHost { get; set; } = "localhost";
        public int DbPort { get; set; } = 3306;
        public string DbUser { get; set; } = "root";
        public string DbPassword { get; set; } = "test";
        public string DbName { get; set; } = "testdbjwt";
        public string ImagesSourcePath { get; set; } = "C:/projects/images";
        public string BackupBasePath { get; set; } = "C:/backups";
        public int ScheduleHour { get; set; } = 4;
        public int ScheduleMinute { get; set; } = 0;
        public bool AutoBackupEnabled { get; set; } = true;
    }

    public class DatabaseConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public string Database { get; set; }
    }
}

