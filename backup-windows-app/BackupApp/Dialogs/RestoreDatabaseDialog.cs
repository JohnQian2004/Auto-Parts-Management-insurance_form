using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;

using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace BackupApp
{
    public partial class RestoreDatabaseDialog : Form
    {
        public string SelectedBackupFile { get; private set; } = string.Empty;

        public RestoreDatabaseDialog(string backupBasePath)
        {
            InitializeComponent(backupBasePath);
        }

        private void InitializeComponent(string backupBasePath)
        {
            this.Text = "Restore Database";
            this.Size = new System.Drawing.Size(600, 400);
            this.StartPosition = FormStartPosition.CenterParent;

            var listBox = new ListBox();
            listBox.Dock = DockStyle.Fill;
            listBox.Margin = new Padding(10);

            var databasePath = Path.Combine(backupBasePath, "database");
            if (Directory.Exists(databasePath))
            {
                var files = Directory.GetFiles(databasePath, "*.sql")
                    .OrderByDescending(f => File.GetCreationTime(f))
                    .Select(f => Path.GetFileName(f))
                    .ToArray();
                
                listBox.Items.AddRange(files);
            }

            var btnOK = new Button();
            btnOK.Text = "Restore";
            btnOK.Dock = DockStyle.Bottom;
            btnOK.Height = 40;
            btnOK.DialogResult = DialogResult.OK;
            btnOK.Click += (s, e) =>
            {
                if (listBox.SelectedItem != null)
                {
                    SelectedBackupFile = listBox.SelectedItem.ToString()!;
                }
                else
                {
                    MessageBox.Show("Please select a backup file.", "No Selection", 
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    this.DialogResult = DialogResult.None;
                }
            };

            var btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Dock = DockStyle.Bottom;
            btnCancel.Height = 40;
            btnCancel.DialogResult = DialogResult.Cancel;

            var label = new Label();
            label.Text = "Select a database backup file to restore:";
            label.Dock = DockStyle.Top;
            label.Height = 30;
            label.Padding = new Padding(10, 10, 10, 0);

            this.Controls.Add(listBox);
            this.Controls.Add(btnOK);
            this.Controls.Add(btnCancel);
            this.Controls.Add(label);
        }
    }
}

