#!/usr/bin/env node

/**
 * This is a simple launch script that will help run the application
 * in various environments, including Termux.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Possible locations for the compiled server file
const possiblePaths = [
  join(__dirname, 'dist', 'index.js'),
  join(__dirname, 'index.js'),
  join(__dirname, 'server', 'index.js')
];

// Find the first path that exists
let serverPath = null;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    serverPath = path;
    break;
  }
}

if (!serverPath) {
  console.error('❌ Error: Cannot find server file. Did you run "npm run build" first?');
  process.exit(1);
}

console.log(`🚀 Starting server from: ${serverPath}`);

// Set production environment
process.env.NODE_ENV = 'production';

// Import and run the server
import(serverPath)
  .catch(err => {
    console.error('❌ Error loading server:', err);
    process.exit(1);
  });