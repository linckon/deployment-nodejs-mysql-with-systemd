# Node.js Application Deployment

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![systemd](https://img.shields.io/badge/systemd-enabled-red.svg)](https://systemd.io/)

Hands-on Project:Deploying a Node.js Application with MySQL using systemd.

## 📋 Features

- Complete Node.js REST API with MySQL database integration
- Systemd service configuration for automatic startup and crash recovery
- Security hardening for production environments
- Comprehensive deployment and testing instructions

## 🚀 Quick Start

1. Clone this repository
2. Follow the installation steps in the [Installation](#installation) section
3. Test the deployment with the provided commands

## 📦 Prerequisites

- Linux server (Ubuntu/Debian recommended)
- Node.js v22.14.0
- MySQL Server
- sudo access for service configuration

## 🔧 Installation

### 1. Application Setup


```bash
### Create and navigate to project directory
mkdir -p ~/practice_app
cd ~/practice_app

### Initialize npm project
npm init -y

### Install dependencies
npm install express mysql2

```

### Create Application Code

Create app.js in the project directory:

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'app_user',
  password: 'app_password',
  database: 'practice_app'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// Users endpoint
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

```

### 2. Database Configuration

```bash

sudo apt update
sudo apt install mysql-server

# Secure the MySQL installation
sudo mysql_secure_installation

```
## Configure Database

### Access MySQL and set up the database:

```sql

-- Login to MySQL
sudo mysql

-- Create database
CREATE DATABASE practice_app;

-- Create application user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON practice_app.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

-- Switch to the application database
USE practice_app;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com');

EXIT;

```

## 3. Systemd Configuration

### Create Dedicated System User
```bash
# Create non-privileged user for running the application
sudo useradd -r -s /bin/false app_user
```

### Deploy Application

```bash
# Create application directory
sudo mkdir -p /opt/practice_app

# Copy application files
sudo cp -r ~/practice_app/* /opt/practice_app/

# Set proper ownership
sudo chown -R app_user:app_user /opt/practice_app
```
### Create Systemd Service file

```bash
sudo vim /etc/systemd/system/practice-app.service

```

```ini
[Unit]
Description=Node.js Practice Application
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=app_user
WorkingDirectory=/opt/practice_app
ExecStart=/usr/local/bin/node22 /opt/practice_app/app.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=practice-app
Environment=NODE_ENV=dev

# Security measures
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true

[Install]
WantedBy=multi-user.target
```


### Enable and start service

``` bash
# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Enable service to start at boot
sudo systemctl enable practice-app.service

# Start the service
sudo systemctl start practice-app.service

```


## 📝 Usage and Testing

### Verify Service Status

```bash
# Check if service is running
sudo systemctl status practice-app.service

```

![running-status](https://github.com/user-attachments/assets/d3497c45-6a47-4c24-9ef6-debbbccd7621)

### Test API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/health
```
![health](https://github.com/user-attachments/assets/9544fb93-0586-497e-b636-70aa36f024a3)


```bash
# Test users endpoint
curl http://localhost:3000/users
```
![user](https://github.com/user-attachments/assets/f76a5455-a4df-40c8-a124-5e25d8547087)

### Test Crash Recovery

```bash
# Force kill the service
sudo systemctl kill -s SIGKILL practice-app.service

# Wait for restart
sleep 10
```

### View Application Logs

```bash
# View service logs
sudo journalctl -u practice-app.service

# Follow logs in real-time
sudo journalctl -u practice-app.service -f
```

```bash
# Verify service recovered
sudo systemctl status practice-app.service
```
![final](https://github.com/user-attachments/assets/e2bd262a-ea23-49ac-8796-852199928f66)

### Test Automatic Startup

```bash
# Reboot system
sudo reboot

# After reboot, verify service is running
sudo systemctl status practice-app.service
```
![after-reboot-status](https://github.com/user-attachments/assets/c8f37eb9-1d9f-4391-bd7d-1db9b930d2be)


