using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using BackupApp.Services;
using BackupApp.Models;

namespace BackupApp
{
    public partial class MainForm : Form
    {
        private BackupService backupService;
        private RestoreService restoreService;
        private Timer statusTimer;
        private bool isBackupRunning = false;

        public MainForm()
        {
            InitializeComponent();
            InitializeServices();
            LoadConfiguration();
            SetupStatusTimer();
        }

        private void InitializeServices()
        {
            backupService = new BackupService();
            restoreService = new RestoreService();
        }

        private void LoadConfiguration()
        {
            var config = ConfigurationManager.Load();
            
            txtDbHost.Text = config.DbHost;
            txtDbPort.Text = config.DbPort.ToString();
            txtDbUser.Text = config.DbUser;
            txtDbPassword.Text = config.DbPassword;
            txtDbName.Text = config.DbName;
            txtImagesPath.Text = config.ImagesSourcePath;
            txtBackupPath.Text = config.BackupBasePath;
            numScheduleHour.Value = config.ScheduleHour;
            numScheduleMinute.Value = config.ScheduleMinute;
            chkAutoBackup.Checked = config.AutoBackupEnabled;
        }

        private void SetupStatusTimer()
        {
            statusTimer = new Timer();
            statusTimer.Interval = 1000; // Update every second
            statusTimer.Tick += StatusTimer_Tick;
            statusTimer.Start();
            UpdateNextBackupTime();
        }

        private void StatusTimer_Tick(object sender, EventArgs e)
        {
            UpdateNextBackupTime();
        }

        private void UpdateNextBackupTime()
        {
            if (chkAutoBackup.Checked)
            {
                var nextBackup = backupService.GetNextBackupTime(
                    (int)numScheduleHour.Value, 
                    (int)numScheduleMinute.Value
                );
                lblNextBackup.Text = $"Next Backup: {nextBackup:yyyy-MM-dd HH:mm:ss}";
                lblNextBackup.ForeColor = Color.Green;
            }
            else
            {
                lblNextBackup.Text = "Auto Backup: Disabled";
                lblNextBackup.ForeColor = Color.Gray;
            }
        }

        private async void btnBackupNow_Click(object sender, EventArgs e)
        {
            if (isBackupRunning)
            {
                MessageBox.Show("Backup is already running. Please wait.", "Backup in Progress", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            try
            {
                isBackupRunning = true;
                btnBackupNow.Enabled = false;
                btnBackupImages.Enabled = false;
                btnBackupDatabase.Enabled = false;
                statusLabel.Text = "Backup in progress...";
                statusLabel.ForeColor = Color.Blue;
                progressBar.Style = ProgressBarStyle.Marquee;

                await backupService.BackupAllAsync(
                    txtImagesPath.Text,
                    txtBackupPath.Text,
                    GetDbConfig()
                );

                statusLabel.Text = "Backup completed successfully!";
                statusLabel.ForeColor = Color.Green;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 100;

                AddLogEntry("Backup completed successfully");
                MessageBox.Show("Backup completed successfully!", "Success", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = $"Backup failed: {ex.Message}";
                statusLabel.ForeColor = Color.Red;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 0;

                AddLogEntry($"Backup failed: {ex.Message}", true);
                MessageBox.Show($"Backup failed: {ex.Message}", "Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                isBackupRunning = false;
                btnBackupNow.Enabled = true;
                btnBackupImages.Enabled = true;
                btnBackupDatabase.Enabled = true;
            }
        }

        private async void btnBackupImages_Click(object sender, EventArgs e)
        {
            if (isBackupRunning)
            {
                MessageBox.Show("Backup is already running. Please wait.", "Backup in Progress", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            try
            {
                isBackupRunning = true;
                btnBackupNow.Enabled = false;
                btnBackupImages.Enabled = false;
                btnBackupDatabase.Enabled = false;
                statusLabel.Text = "Backing up images...";
                statusLabel.ForeColor = Color.Blue;
                progressBar.Style = ProgressBarStyle.Marquee;

                await backupService.BackupImagesAsync(txtImagesPath.Text, txtBackupPath.Text);

                statusLabel.Text = "Images backup completed!";
                statusLabel.ForeColor = Color.Green;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 100;

                AddLogEntry("Images backup completed successfully");
                MessageBox.Show("Images backup completed successfully!", "Success", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = $"Images backup failed: {ex.Message}";
                statusLabel.ForeColor = Color.Red;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 0;

                AddLogEntry($"Images backup failed: {ex.Message}", true);
                MessageBox.Show($"Images backup failed: {ex.Message}", "Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                isBackupRunning = false;
                btnBackupNow.Enabled = true;
                btnBackupImages.Enabled = true;
                btnBackupDatabase.Enabled = true;
            }
        }

        private async void btnBackupDatabase_Click(object sender, EventArgs e)
        {
            if (isBackupRunning)
            {
                MessageBox.Show("Backup is already running. Please wait.", "Backup in Progress", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            try
            {
                isBackupRunning = true;
                btnBackupNow.Enabled = false;
                btnBackupImages.Enabled = false;
                btnBackupDatabase.Enabled = false;
                statusLabel.Text = "Backing up database...";
                statusLabel.ForeColor = Color.Blue;
                progressBar.Style = ProgressBarStyle.Marquee;

                await backupService.BackupDatabaseAsync(txtBackupPath.Text, GetDbConfig());

                statusLabel.Text = "Database backup completed!";
                statusLabel.ForeColor = Color.Green;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 100;

                AddLogEntry("Database backup completed successfully");
                MessageBox.Show("Database backup completed successfully!", "Success", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                statusLabel.Text = $"Database backup failed: {ex.Message}";
                statusLabel.ForeColor = Color.Red;
                progressBar.Style = ProgressBarStyle.Continuous;
                progressBar.Value = 0;

                AddLogEntry($"Database backup failed: {ex.Message}", true);
                MessageBox.Show($"Database backup failed: {ex.Message}", "Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                isBackupRunning = false;
                btnBackupNow.Enabled = true;
                btnBackupImages.Enabled = true;
                btnBackupDatabase.Enabled = true;
            }
        }

        private void btnRestoreDatabase_Click(object sender, EventArgs e)
        {
            using (var dialog = new RestoreDatabaseDialog(txtBackupPath.Text))
            {
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        statusLabel.Text = "Restoring database...";
                        statusLabel.ForeColor = Color.Blue;
                        progressBar.Style = ProgressBarStyle.Marquee;

                        restoreService.RestoreDatabase(
                            dialog.SelectedBackupFile,
                            GetDbConfig()
                        );

                        statusLabel.Text = "Database restored successfully!";
                        statusLabel.ForeColor = Color.Green;
                        progressBar.Style = ProgressBarStyle.Continuous;
                        progressBar.Value = 100;

                        AddLogEntry($"Database restored from: {dialog.SelectedBackupFile}");
                        MessageBox.Show("Database restored successfully!", "Success", 
                            MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    catch (Exception ex)
                    {
                        statusLabel.Text = $"Database restore failed: {ex.Message}";
                        statusLabel.ForeColor = Color.Red;
                        progressBar.Style = ProgressBarStyle.Continuous;
                        progressBar.Value = 0;

                        AddLogEntry($"Database restore failed: {ex.Message}", true);
                        MessageBox.Show($"Database restore failed: {ex.Message}", "Error", 
                            MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        private void btnRestoreImages_Click(object sender, EventArgs e)
        {
            using (var dialog = new RestoreImagesDialog(txtBackupPath.Text))
            {
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        statusLabel.Text = "Restoring images...";
                        statusLabel.ForeColor = Color.Blue;
                        progressBar.Style = ProgressBarStyle.Marquee;

                        restoreService.RestoreImages(
                            dialog.SelectedBackupDirectory,
                            txtImagesPath.Text,
                            txtBackupPath.Text
                        );

                        statusLabel.Text = "Images restored successfully!";
                        statusLabel.ForeColor = Color.Green;
                        progressBar.Style = ProgressBarStyle.Continuous;
                        progressBar.Value = 100;

                        AddLogEntry($"Images restored from: {dialog.SelectedBackupDirectory}");
                        MessageBox.Show("Images restored successfully!", "Success", 
                            MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    catch (Exception ex)
                    {
                        statusLabel.Text = $"Images restore failed: {ex.Message}";
                        statusLabel.ForeColor = Color.Red;
                        progressBar.Style = ProgressBarStyle.Continuous;
                        progressBar.Value = 0;

                        AddLogEntry($"Images restore failed: {ex.Message}", true);
                        MessageBox.Show($"Images restore failed: {ex.Message}", "Error", 
                            MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        private void btnSaveConfig_Click(object sender, EventArgs e)
        {
            try
            {
                var config = new Configuration
                {
                    DbHost = txtDbHost.Text,
                    DbPort = int.Parse(txtDbPort.Text),
                    DbUser = txtDbUser.Text,
                    DbPassword = txtDbPassword.Text,
                    DbName = txtDbName.Text,
                    ImagesSourcePath = txtImagesPath.Text,
                    BackupBasePath = txtBackupPath.Text,
                    ScheduleHour = (int)numScheduleHour.Value,
                    ScheduleMinute = (int)numScheduleMinute.Value,
                    AutoBackupEnabled = chkAutoBackup.Checked
                };

                ConfigurationManager.Save(config);
                backupService.UpdateSchedule(config);

                MessageBox.Show("Configuration saved successfully!", "Success", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                AddLogEntry("Configuration saved");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to save configuration: {ex.Message}", "Error", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnBrowseImages_Click(object sender, EventArgs e)
        {
            using (var dialog = new FolderBrowserDialog())
            {
                dialog.Description = "Select Images Source Directory";
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    txtImagesPath.Text = dialog.SelectedPath;
                }
            }
        }

        private void btnBrowseBackup_Click(object sender, EventArgs e)
        {
            using (var dialog = new FolderBrowserDialog())
            {
                dialog.Description = "Select Backup Base Directory";
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    txtBackupPath.Text = dialog.SelectedPath;
                }
            }
        }

        private DatabaseConfig GetDbConfig()
        {
            return new DatabaseConfig
            {
                Host = txtDbHost.Text,
                Port = int.Parse(txtDbPort.Text),
                User = txtDbUser.Text,
                Password = txtDbPassword.Text,
                Database = txtDbName.Text
            };
        }

        private void AddLogEntry(string message, bool isError = false)
        {
            if (txtLog.InvokeRequired)
            {
                txtLog.Invoke(new Action(() => AddLogEntry(message, isError)));
                return;
            }

            var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            var logMessage = $"[{timestamp}] {message}\r\n";
            
            txtLog.AppendText(logMessage);
            txtLog.SelectionStart = txtLog.Text.Length;
            txtLog.ScrollToCaret();

            // Save to log file
            try
            {
                var logDir = Path.Combine(Application.StartupPath, "logs");
                Directory.CreateDirectory(logDir);
                var logFile = Path.Combine(logDir, $"backup_{DateTime.Now:yyyyMMdd}.log");
                File.AppendAllText(logFile, logMessage);
            }
            catch { }
        }

        private void chkAutoBackup_CheckedChanged(object sender, EventArgs e)
        {
            backupService.SetAutoBackupEnabled(chkAutoBackup.Checked);
            UpdateNextBackupTime();
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (isBackupRunning)
            {
                var result = MessageBox.Show(
                    "Backup is currently running. Do you want to close the application?",
                    "Backup in Progress",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning
                );

                if (result == DialogResult.No)
                {
                    e.Cancel = true;
                    return;
                }
            }

            backupService?.Dispose();
            statusTimer?.Stop();
            statusTimer?.Dispose();
            base.OnFormClosing(e);
        }
    }
}

