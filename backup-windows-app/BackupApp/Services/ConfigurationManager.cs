using System;
using System.IO;
using System.Text.Json;
using BackupApp.Models;

namespace BackupApp.Services
{
    public static class ConfigurationManager
    {
        private static string ConfigPath => Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "BackupWindowsApp",
            "config.json"
        );

        public static Configuration Load()
        {
            try
            {
                if (File.Exists(ConfigPath))
                {
                    var json = File.ReadAllText(ConfigPath);
                    return JsonSerializer.Deserialize<Configuration>(json) ?? new Configuration();
                }
            }
            catch { }

            // Return default configuration
            return new Configuration();
        }

        public static void Save(Configuration config)
        {
            try
            {
                var directory = Path.GetDirectoryName(ConfigPath);
                if (!string.IsNullOrEmpty(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var json = JsonSerializer.Serialize(config, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                });
                File.WriteAllText(ConfigPath, json);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to save configuration: {ex.Message}", ex);
            }
        }
    }
}

