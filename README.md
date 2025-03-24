# Node.js Application Deployment

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![systemd](https://img.shields.io/badge/systemd-enabled-red.svg)](https://systemd.io/)

A production-ready deployment solution for Node.js REST APIs with MySQL integration using systemd for service management.

## 📋 Features

- Complete Node.js REST API with MySQL database integration
- Systemd service configuration for automatic startup and crash recovery
- Security hardening for production environments
- Comprehensive deployment and testing instructions

## 🚀 Quick Start

1. Clone this repository
2. Follow the installation steps in the [Installation](#installation) section
3. Test your deployment with the provided commands

## 📦 Prerequisites

- Linux server (Ubuntu/Debian recommended)
- Node.js v14 or higher
- MySQL Server 8.0+
- sudo access for service configuration

## 🔧 Installation

### 1. Application Setup

bash
# Create and navigate to project directory
mkdir -p ~/practice_app
cd ~/practice_app

# Initialize npm project
npm init -y

# Install dependencies
npm install express mysql2


### 2. Database Configuration

bash
# Install MySQL (if not already installed)
sudo apt update
sudo apt install mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user (see detailed instructions in guide)


### 3. Systemd Service Setup

bash
# Create service file
sudo nano /etc/systemd/system/practice-app.service

# Enable and start service
sudo systemctl enable practice-app.service
sudo systemctl start practice-app.service


## 📝 Usage

### API Endpoints

- `GET /health` - Check application and database health
- `GET /users` - Retrieve list of users from database

### Service Management

bash
# Check service status
sudo systemctl status practice-app.service

# Restart service
sudo systemctl restart practice-app.service

# View logs
sudo journalctl -u practice-app.service


## 🔍 Troubleshooting

Common issues and solutions:

- **Database Connection Errors**: Verify MySQL is running and credentials are correct
- **Service Won't Start**: Check logs for errors and verify file permissions
- **API Not Accessible**: Confirm port availability and firewall settings

## 🔒 Security Considerations

- Runs as dedicated non-privileged user
- Implements systemd security features (ProtectSystem, PrivateTmp, etc.)
- Uses connection pooling for database access

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [systemd Documentation](https://systemd.io/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.