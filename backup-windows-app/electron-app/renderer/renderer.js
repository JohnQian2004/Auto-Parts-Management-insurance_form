// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load data for restore tab
        if (tabName === 'restore') {
            loadBackupLists();
        }
    });
});

let config = null;
let isBackupRunning = false;

// Load configuration on startup
async function loadConfig() {
    try {
        config = await window.electronAPI.loadConfig();
        populateConfigForm(config);
        updateNextBackupTime();
    } catch (error) {
        showStatus('Failed to load configuration', 'error');
        addLog(`Error loading config: ${error.message}`, 'error');
    }
}

function populateConfigForm(config) {
    document.getElementById('dbHost').value = config.dbHost || 'localhost';
    document.getElementById('dbPort').value = config.dbPort || 3306;
    document.getElementById('dbUser').value = config.dbUser || 'root';
    document.getElementById('dbPassword').value = config.dbPassword || 'test';
    document.getElementById('dbName').value = config.dbName || 'testdbjwt';
    document.getElementById('imagesPath').value = config.imagesSourcePath || 'C:/projects/images';
    document.getElementById('backupPath').value = config.backupBasePath || 'C:/backups';
    document.getElementById('scheduleHour').value = config.scheduleHour || 4;
    document.getElementById('scheduleMinute').value = config.scheduleMinute || 0;
    document.getElementById('autoBackup').checked = config.autoBackupEnabled !== false;
}

// Save configuration
document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newConfig = {
        dbHost: document.getElementById('dbHost').value,
        dbPort: parseInt(document.getElementById('dbPort').value),
        dbUser: document.getElementById('dbUser').value,
        dbPassword: document.getElementById('dbPassword').value,
        dbName: document.getElementById('dbName').value,
        imagesSourcePath: document.getElementById('imagesPath').value,
        backupBasePath: document.getElementById('backupPath').value,
        scheduleHour: parseInt(document.getElementById('scheduleHour').value),
        scheduleMinute: parseInt(document.getElementById('scheduleMinute').value),
        autoBackupEnabled: document.getElementById('autoBackup').checked
    };
    
    try {
        await window.electronAPI.saveConfig(newConfig);
        config = newConfig;
        showStatus('Configuration saved successfully', 'success');
        addLog('Configuration saved', 'success');
        updateNextBackupTime();
    } catch (error) {
        showStatus(`Failed to save configuration: ${error.message}`, 'error');
        addLog(`Error saving config: ${error.message}`, 'error');
    }
});

// Browse buttons
document.getElementById('btnBrowseImages').addEventListener('click', async () => {
    const path = await window.electronAPI.selectFolder('Select Images Source Directory');
    if (path) {
        document.getElementById('imagesPath').value = path;
    }
});

document.getElementById('btnBrowseBackup').addEventListener('click', async () => {
    const path = await window.electronAPI.selectFolder('Select Backup Base Directory');
    if (path) {
        document.getElementById('backupPath').value = path;
    }
});

// Backup buttons
document.getElementById('btnBackupAll').addEventListener('click', () => runBackup('all'));
document.getElementById('btnBackupImages').addEventListener('click', () => runBackup('images'));
document.getElementById('btnBackupDatabase').addEventListener('click', () => runBackup('database'));

async function runBackup(type) {
    if (isBackupRunning) {
        showStatus('Backup is already running', 'info');
        return;
    }
    
    if (!config) {
        await loadConfig();
    }
    
    isBackupRunning = true;
    setBackupButtonsEnabled(false);
    showStatus(`${type === 'all' ? 'Backup' : type === 'images' ? 'Images backup' : 'Database backup'} in progress...`, 'info');
    setProgressActive(true);
    addLog(`Starting ${type} backup...`, 'info');
    
    try {
        const dbConfig = {
            host: config.dbHost,
            port: config.dbPort,
            user: config.dbUser,
            password: config.dbPassword,
            database: config.dbName
        };
        
        if (type === 'all') {
            await window.electronAPI.backupAll(config.imagesSourcePath, config.backupBasePath, dbConfig);
        } else if (type === 'images') {
            await window.electronAPI.backupImages(config.imagesSourcePath, config.backupBasePath);
        } else {
            await window.electronAPI.backupDatabase(config.backupBasePath, dbConfig);
        }
        
        showStatus(`${type === 'all' ? 'Backup' : type} completed successfully!`, 'success');
        addLog(`${type} backup completed successfully`, 'success');
    } catch (error) {
        showStatus(`${type} backup failed: ${error.message}`, 'error');
        addLog(`${type} backup failed: ${error.message}`, 'error');
    } finally {
        isBackupRunning = false;
        setBackupButtonsEnabled(true);
        setProgressActive(false);
    }
}

// Restore buttons
document.getElementById('btnRestoreDatabase').addEventListener('click', async () => {
    const select = document.getElementById('dbBackupList');
    const backupFile = select.value;
    if (!backupFile) {
        showStatus('Please select a backup file', 'error');
        return;
    }
    
    if (!config) await loadConfig();
    
    const dbConfig = {
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName
    };
    
    try {
        showStatus('Restoring database...', 'info');
        addLog(`Restoring database from: ${backupFile}`, 'info');
        await window.electronAPI.restoreDatabase(backupFile, dbConfig);
        showStatus('Database restored successfully!', 'success');
        addLog('Database restored successfully', 'success');
    } catch (error) {
        showStatus(`Database restore failed: ${error.message}`, 'error');
        addLog(`Database restore failed: ${error.message}`, 'error');
    }
});

document.getElementById('btnRestoreImages').addEventListener('click', async () => {
    const select = document.getElementById('imagesBackupList');
    const backupDir = select.value;
    if (!backupDir) {
        showStatus('Please select a backup directory', 'error');
        return;
    }
    
    if (!config) await loadConfig();
    
    try {
        showStatus('Restoring images...', 'info');
        addLog(`Restoring images from: ${backupDir}`, 'info');
        await window.electronAPI.restoreImages(backupDir, config.imagesSourcePath, config.backupBasePath);
        showStatus('Images restored successfully!', 'success');
        addLog('Images restored successfully', 'success');
    } catch (error) {
        showStatus(`Images restore failed: ${error.message}`, 'error');
        addLog(`Images restore failed: ${error.message}`, 'error');
    }
});

async function loadBackupLists() {
    if (!config) await loadConfig();
    
    try {
        const dbBackups = await window.electronAPI.listDatabaseBackups(config.backupBasePath);
        const dbSelect = document.getElementById('dbBackupList');
        dbSelect.innerHTML = '<option value="">Select a backup file...</option>';
        dbBackups.forEach(backup => {
            const option = document.createElement('option');
            option.value = backup.path;
            option.textContent = `${backup.name} (${new Date(backup.date).toLocaleString()})`;
            dbSelect.appendChild(option);
        });
        
        const imageBackups = await window.electronAPI.listImageBackups(config.backupBasePath);
        const imgSelect = document.getElementById('imagesBackupList');
        imgSelect.innerHTML = '<option value="">Select a backup directory...</option>';
        imageBackups.forEach(backup => {
            const option = document.createElement('option');
            option.value = backup.path;
            option.textContent = `${backup.name} (${new Date(backup.date).toLocaleString()})`;
            imgSelect.appendChild(option);
        });
    } catch (error) {
        addLog(`Error loading backup lists: ${error.message}`, 'error');
    }
}

// Log functions
function addLog(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    const timestamp = new Date().toLocaleString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

document.getElementById('btnClearLog').addEventListener('click', () => {
    document.getElementById('logContainer').innerHTML = '';
});

// Status functions
function showStatus(message, type = 'info') {
    const statusText = document.getElementById('statusText');
    statusText.textContent = message;
    statusText.className = `status-text ${type}`;
}

function setProgressActive(active) {
    const progressFill = document.getElementById('progressFill');
    if (active) {
        progressFill.style.width = '100%';
        progressFill.classList.add('active');
    } else {
        progressFill.style.width = '0%';
        progressFill.classList.remove('active');
    }
}

function setBackupButtonsEnabled(enabled) {
    document.getElementById('btnBackupAll').disabled = !enabled;
    document.getElementById('btnBackupImages').disabled = !enabled;
    document.getElementById('btnBackupDatabase').disabled = !enabled;
}

async function updateNextBackupTime() {
    if (!config) return;
    
    try {
        const nextTime = await window.electronAPI.getNextBackupTime(config.scheduleHour, config.scheduleMinute);
        const nextBackupEl = document.getElementById('nextBackup');
        if (config.autoBackupEnabled) {
            nextBackupEl.textContent = `Next Backup: ${new Date(nextTime).toLocaleString()}`;
        } else {
            nextBackupEl.textContent = 'Auto Backup: Disabled';
        }
    } catch (error) {
        console.error('Failed to get next backup time:', error);
    }
}

// Update next backup time every minute
setInterval(updateNextBackupTime, 60000);

// Initialize
loadConfig();
updateNextBackupTime();

