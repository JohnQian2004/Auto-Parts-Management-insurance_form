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
    public partial class RestoreImagesDialog : Form
    {
        public string SelectedBackupDirectory { get; private set; } = string.Empty;

        public RestoreImagesDialog(string backupBasePath)
        {
            InitializeComponent(backupBasePath);
        }

        private void InitializeComponent(string backupBasePath)
        {
            this.Text = "Restore Images";
            this.Size = new System.Drawing.Size(600, 400);
            this.StartPosition = FormStartPosition.CenterParent;

            var listBox = new ListBox();
            listBox.Dock = DockStyle.Fill;
            listBox.Margin = new Padding(10);

            var imagesPath = Path.Combine(backupBasePath, "images");
            if (Directory.Exists(imagesPath))
            {
                var directories = Directory.GetDirectories(imagesPath)
                    .Where(d => Path.GetFileName(d).StartsWith("images_"))
                    .OrderByDescending(d => Directory.GetCreationTime(d))
                    .Select(d => Path.GetFileName(d))
                    .ToArray();
                
                listBox.Items.AddRange(directories);
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
                    SelectedBackupDirectory = listBox.SelectedItem.ToString()!;
                }
                else
                {
                    MessageBox.Show("Please select a backup directory.", "No Selection", 
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
            label.Text = "Select an images backup directory to restore:";
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

