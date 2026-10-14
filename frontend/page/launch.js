const { spawn } = require('node:child_process');

const server = spawn('py', ['-m', 'http.server', '8000'], {
  cwd: __dirname,
  stdio: 'inherit',
});

const api = spawn('npm', ['run', 'dev'], {
  cwd: 'C:/Users/mcern/Desktop/Ubuntu/Projects/ProMark/backend',
  stdio: 'inherit',
  shell: true,
});

server.on('error', (error) => {
  console.error(`Could not start the Python HTTP server: ${error.message}`);
  process.exitCode = 1;
});

server.on('exit', (code) => {
  process.exitCode = code ?? 1;
});

api.on('error', (error) => {
  console.error(`Could not start the API server: ${error.message}`);
  process.exitCode = 1;
});

api.on('exit', (code) => {
  process.exitCode = code ?? 1;
});