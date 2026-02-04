namespace BackupApp
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer? components = null;
        private System.Windows.Forms.TabControl tabControl;
        private System.Windows.Forms.TabPage tabBackup;
        private System.Windows.Forms.TabPage tabRestore;
        private System.Windows.Forms.TabPage tabConfig;
        private System.Windows.Forms.TabPage tabLogs;

        // Backup Tab
        private System.Windows.Forms.Button btnBackupNow;
        private System.Windows.Forms.Button btnBackupImages;
        private System.Windows.Forms.Button btnBackupDatabase;
        private System.Windows.Forms.Label lblNextBackup;
        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.Label statusLabel;

        // Restore Tab
        private System.Windows.Forms.Button btnRestoreDatabase;
        private System.Windows.Forms.Button btnRestoreImages;

        // Config Tab
        private System.Windows.Forms.Label lblDbHost;
        private System.Windows.Forms.TextBox txtDbHost;
        private System.Windows.Forms.Label lblDbPort;
        private System.Windows.Forms.TextBox txtDbPort;
        private System.Windows.Forms.Label lblDbUser;
        private System.Windows.Forms.TextBox txtDbUser;
        private System.Windows.Forms.Label lblDbPassword;
        private System.Windows.Forms.TextBox txtDbPassword;
        private System.Windows.Forms.Label lblDbName;
        private System.Windows.Forms.TextBox txtDbName;
        private System.Windows.Forms.Label lblImagesPath;
        private System.Windows.Forms.TextBox txtImagesPath;
        private System.Windows.Forms.Button btnBrowseImages;
        private System.Windows.Forms.Label lblBackupPath;
        private System.Windows.Forms.TextBox txtBackupPath;
        private System.Windows.Forms.Button btnBrowseBackup;
        private System.Windows.Forms.Label lblSchedule;
        private System.Windows.Forms.NumericUpDown numScheduleHour;
        private System.Windows.Forms.NumericUpDown numScheduleMinute;
        private System.Windows.Forms.CheckBox chkAutoBackup;
        private System.Windows.Forms.Button btnSaveConfig;

        // Logs Tab
        private System.Windows.Forms.TextBox txtLog;
        private System.Windows.Forms.Button btnClearLog;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.tabControl = new System.Windows.Forms.TabControl();
            this.tabBackup = new System.Windows.Forms.TabPage();
            this.tabRestore = new System.Windows.Forms.TabPage();
            this.tabConfig = new System.Windows.Forms.TabPage();
            this.tabLogs = new System.Windows.Forms.TabPage();
            
            // Main Form
            this.SuspendLayout();
            this.Text = "Backup Windows App";
            this.Size = new System.Drawing.Size(900, 700);
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.MinimumSize = new System.Drawing.Size(800, 600);

            // Tab Control
            this.tabControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl.TabPages.Add(this.tabBackup);
            this.tabControl.TabPages.Add(this.tabRestore);
            this.tabControl.TabPages.Add(this.tabConfig);
            this.tabControl.TabPages.Add(this.tabLogs);
            this.Controls.Add(this.tabControl);

            InitializeBackupTab();
            InitializeRestoreTab();
            InitializeConfigTab();
            InitializeLogsTab();

            this.ResumeLayout(false);
        }

        private void InitializeBackupTab()
        {
            this.tabBackup.Text = "Backup";
            this.tabBackup.Padding = new System.Windows.Forms.Padding(10);

            // Status Label
            this.statusLabel = new System.Windows.Forms.Label();
            this.statusLabel.Text = "Ready";
            this.statusLabel.Location = new System.Drawing.Point(20, 20);
            this.statusLabel.Size = new System.Drawing.Size(400, 23);
            this.statusLabel.ForeColor = System.Drawing.Color.Green;
            this.tabBackup.Controls.Add(this.statusLabel);

            // Next Backup Label
            this.lblNextBackup = new System.Windows.Forms.Label();
            this.lblNextBackup.Text = "Next Backup: Calculating...";
            this.lblNextBackup.Location = new System.Drawing.Point(20, 50);
            this.lblNextBackup.Size = new System.Drawing.Size(400, 23);
            this.tabBackup.Controls.Add(this.lblNextBackup);

            // Progress Bar
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.progressBar.Location = new System.Drawing.Point(20, 80);
            this.progressBar.Size = new System.Drawing.Size(600, 23);
            this.tabBackup.Controls.Add(this.progressBar);

            // Backup Buttons
            this.btnBackupNow = new System.Windows.Forms.Button();
            this.btnBackupNow.Text = "Backup All Now";
            this.btnBackupNow.Location = new System.Drawing.Point(20, 120);
            this.btnBackupNow.Size = new System.Drawing.Size(150, 40);
            this.btnBackupNow.Click += new System.EventHandler(this.btnBackupNow_Click);
            this.tabBackup.Controls.Add(this.btnBackupNow);

            this.btnBackupImages = new System.Windows.Forms.Button();
            this.btnBackupImages.Text = "Backup Images";
            this.btnBackupImages.Location = new System.Drawing.Point(180, 120);
            this.btnBackupImages.Size = new System.Drawing.Size(150, 40);
            this.btnBackupImages.Click += new System.EventHandler(this.btnBackupImages_Click);
            this.tabBackup.Controls.Add(this.btnBackupImages);

            this.btnBackupDatabase = new System.Windows.Forms.Button();
            this.btnBackupDatabase.Text = "Backup Database";
            this.btnBackupDatabase.Location = new System.Drawing.Point(340, 120);
            this.btnBackupDatabase.Size = new System.Drawing.Size(150, 40);
            this.btnBackupDatabase.Click += new System.EventHandler(this.btnBackupDatabase_Click);
            this.tabBackup.Controls.Add(this.btnBackupDatabase);
        }

        private void InitializeRestoreTab()
        {
            this.tabRestore.Text = "Restore";
            this.tabRestore.Padding = new System.Windows.Forms.Padding(10);

            // Restore Database Button
            this.btnRestoreDatabase = new System.Windows.Forms.Button();
            this.btnRestoreDatabase.Text = "Restore Database";
            this.btnRestoreDatabase.Location = new System.Drawing.Point(20, 20);
            this.btnRestoreDatabase.Size = new System.Drawing.Size(200, 50);
            this.btnRestoreDatabase.Click += new System.EventHandler(this.btnRestoreDatabase_Click);
            this.tabRestore.Controls.Add(this.btnRestoreDatabase);

            // Restore Images Button
            this.btnRestoreImages = new System.Windows.Forms.Button();
            this.btnRestoreImages.Text = "Restore Images";
            this.btnRestoreImages.Location = new System.Drawing.Point(20, 80);
            this.btnRestoreImages.Size = new System.Drawing.Size(200, 50);
            this.btnRestoreImages.Click += new System.EventHandler(this.btnRestoreImages_Click);
            this.tabRestore.Controls.Add(this.btnRestoreImages);
        }

        private void InitializeConfigTab()
        {
            this.tabConfig.Text = "Configuration";
            this.tabConfig.Padding = new System.Windows.Forms.Padding(10);
            this.tabConfig.AutoScroll = true;

            int yPos = 20;
            int labelWidth = 150;
            int textWidth = 300;
            int spacing = 35;

            // Database Configuration
            this.lblDbHost = new System.Windows.Forms.Label();
            this.lblDbHost.Text = "Database Host:";
            this.lblDbHost.Location = new System.Drawing.Point(20, yPos);
            this.lblDbHost.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblDbHost);

            this.txtDbHost = new System.Windows.Forms.TextBox();
            this.txtDbHost.Location = new System.Drawing.Point(180, yPos);
            this.txtDbHost.Size = new System.Drawing.Size(textWidth, 23);
            this.tabConfig.Controls.Add(this.txtDbHost);
            yPos += spacing;

            this.lblDbPort = new System.Windows.Forms.Label();
            this.lblDbPort.Text = "Database Port:";
            this.lblDbPort.Location = new System.Drawing.Point(20, yPos);
            this.lblDbPort.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblDbPort);

            this.txtDbPort = new System.Windows.Forms.TextBox();
            this.txtDbPort.Location = new System.Drawing.Point(180, yPos);
            this.txtDbPort.Size = new System.Drawing.Size(textWidth, 23);
            this.tabConfig.Controls.Add(this.txtDbPort);
            yPos += spacing;

            this.lblDbUser = new System.Windows.Forms.Label();
            this.lblDbUser.Text = "Database User:";
            this.lblDbUser.Location = new System.Drawing.Point(20, yPos);
            this.lblDbUser.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblDbUser);

            this.txtDbUser = new System.Windows.Forms.TextBox();
            this.txtDbUser.Location = new System.Drawing.Point(180, yPos);
            this.txtDbUser.Size = new System.Drawing.Size(textWidth, 23);
            this.tabConfig.Controls.Add(this.txtDbUser);
            yPos += spacing;

            this.lblDbPassword = new System.Windows.Forms.Label();
            this.lblDbPassword.Text = "Database Password:";
            this.lblDbPassword.Location = new System.Drawing.Point(20, yPos);
            this.lblDbPassword.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblDbPassword);

            this.txtDbPassword = new System.Windows.Forms.TextBox();
            this.txtDbPassword.Location = new System.Drawing.Point(180, yPos);
            this.txtDbPassword.Size = new System.Drawing.Size(textWidth, 23);
            this.txtDbPassword.PasswordChar = '*';
            this.tabConfig.Controls.Add(this.txtDbPassword);
            yPos += spacing;

            this.lblDbName = new System.Windows.Forms.Label();
            this.lblDbName.Text = "Database Name:";
            this.lblDbName.Location = new System.Drawing.Point(20, yPos);
            this.lblDbName.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblDbName);

            this.txtDbName = new System.Windows.Forms.TextBox();
            this.txtDbName.Location = new System.Drawing.Point(180, yPos);
            this.txtDbName.Size = new System.Drawing.Size(textWidth, 23);
            this.tabConfig.Controls.Add(this.txtDbName);
            yPos += spacing + 20;

            // Backup Configuration
            this.lblImagesPath = new System.Windows.Forms.Label();
            this.lblImagesPath.Text = "Images Source Path:";
            this.lblImagesPath.Location = new System.Drawing.Point(20, yPos);
            this.lblImagesPath.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblImagesPath);

            this.txtImagesPath = new System.Windows.Forms.TextBox();
            this.txtImagesPath.Location = new System.Drawing.Point(180, yPos);
            this.txtImagesPath.Size = new System.Drawing.Size(textWidth - 80, 23);
            this.tabConfig.Controls.Add(this.txtImagesPath);

            this.btnBrowseImages = new System.Windows.Forms.Button();
            this.btnBrowseImages.Text = "Browse...";
            this.btnBrowseImages.Location = new System.Drawing.Point(400, yPos);
            this.btnBrowseImages.Size = new System.Drawing.Size(80, 23);
            this.btnBrowseImages.Click += new System.EventHandler(this.btnBrowseImages_Click);
            this.tabConfig.Controls.Add(this.btnBrowseImages);
            yPos += spacing;

            this.lblBackupPath = new System.Windows.Forms.Label();
            this.lblBackupPath.Text = "Backup Base Path:";
            this.lblBackupPath.Location = new System.Drawing.Point(20, yPos);
            this.lblBackupPath.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblBackupPath);

            this.txtBackupPath = new System.Windows.Forms.TextBox();
            this.txtBackupPath.Location = new System.Drawing.Point(180, yPos);
            this.txtBackupPath.Size = new System.Drawing.Size(textWidth - 80, 23);
            this.tabConfig.Controls.Add(this.txtBackupPath);

            this.btnBrowseBackup = new System.Windows.Forms.Button();
            this.btnBrowseBackup.Text = "Browse...";
            this.btnBrowseBackup.Location = new System.Drawing.Point(400, yPos);
            this.btnBrowseBackup.Size = new System.Drawing.Size(80, 23);
            this.btnBrowseBackup.Click += new System.EventHandler(this.btnBrowseBackup_Click);
            this.tabConfig.Controls.Add(this.btnBrowseBackup);
            yPos += spacing + 20;

            // Schedule Configuration
            this.lblSchedule = new System.Windows.Forms.Label();
            this.lblSchedule.Text = "Schedule Time:";
            this.lblSchedule.Location = new System.Drawing.Point(20, yPos);
            this.lblSchedule.Size = new System.Drawing.Size(labelWidth, 23);
            this.tabConfig.Controls.Add(this.lblSchedule);

            this.numScheduleHour = new System.Windows.Forms.NumericUpDown();
            this.numScheduleHour.Location = new System.Drawing.Point(180, yPos);
            this.numScheduleHour.Size = new System.Drawing.Size(60, 23);
            this.numScheduleHour.Minimum = 0;
            this.numScheduleHour.Maximum = 23;
            this.numScheduleHour.Value = 4;
            this.tabConfig.Controls.Add(this.numScheduleHour);

            var lblHour = new System.Windows.Forms.Label();
            lblHour.Text = "Hour";
            lblHour.Location = new System.Drawing.Point(250, yPos);
            lblHour.Size = new System.Drawing.Size(50, 23);
            this.tabConfig.Controls.Add(lblHour);

            this.numScheduleMinute = new System.Windows.Forms.NumericUpDown();
            this.numScheduleMinute.Location = new System.Drawing.Point(310, yPos);
            this.numScheduleMinute.Size = new System.Drawing.Size(60, 23);
            this.numScheduleMinute.Minimum = 0;
            this.numScheduleMinute.Maximum = 59;
            this.numScheduleMinute.Value = 0;
            this.tabConfig.Controls.Add(this.numScheduleMinute);

            var lblMinute = new System.Windows.Forms.Label();
            lblMinute.Text = "Minute";
            lblMinute.Location = new System.Drawing.Point(380, yPos);
            lblMinute.Size = new System.Drawing.Size(50, 23);
            this.tabConfig.Controls.Add(lblMinute);
            yPos += spacing;

            this.chkAutoBackup = new System.Windows.Forms.CheckBox();
            this.chkAutoBackup.Text = "Enable Auto Backup";
            this.chkAutoBackup.Location = new System.Drawing.Point(20, yPos);
            this.chkAutoBackup.Size = new System.Drawing.Size(200, 23);
            this.chkAutoBackup.CheckedChanged += new System.EventHandler(this.chkAutoBackup_CheckedChanged);
            this.tabConfig.Controls.Add(this.chkAutoBackup);
            yPos += spacing + 20;

            // Save Button
            this.btnSaveConfig = new System.Windows.Forms.Button();
            this.btnSaveConfig.Text = "Save Configuration";
            this.btnSaveConfig.Location = new System.Drawing.Point(20, yPos);
            this.btnSaveConfig.Size = new System.Drawing.Size(150, 40);
            this.btnSaveConfig.Click += new System.EventHandler(this.btnSaveConfig_Click);
            this.tabConfig.Controls.Add(this.btnSaveConfig);
        }

        private void InitializeLogsTab()
        {
            this.tabLogs.Text = "Logs";
            this.tabLogs.Padding = new System.Windows.Forms.Padding(10);

            this.txtLog = new System.Windows.Forms.TextBox();
            this.txtLog.Multiline = true;
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.ReadOnly = true;
            this.txtLog.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txtLog.Font = new System.Drawing.Font("Consolas", 9F);
            this.tabLogs.Controls.Add(this.txtLog);

            this.btnClearLog = new System.Windows.Forms.Button();
            this.btnClearLog.Text = "Clear Log";
            this.btnClearLog.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.btnClearLog.Height = 30;
            this.btnClearLog.Click += (s, e) => this.txtLog.Clear();
            this.tabLogs.Controls.Add(this.btnClearLog);
        }
    }
}

