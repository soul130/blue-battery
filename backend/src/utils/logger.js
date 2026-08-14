# 로깅 유틸리티

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// logs 디렉토리 생성
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage + '\n');
  },

  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message} - ${error.message}`;
    console.error(logMessage);
    fs.appendFileSync(path.join(logsDir, 'error.log'), logMessage + '\n');
  },

  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;
    console.warn(logMessage);
    fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage + '\n');
  }
};

module.exports = logger;
