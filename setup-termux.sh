#!/bin/bash

# This script helps set up and run the application in Termux environments

# Set up error handling
set -e

echo "===== Termux Setup Script for HearIt Music Player ====="

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "Checking for required tools..."
for cmd in node npm; do
  if ! command_exists $cmd; then
    echo "Error: $cmd is not installed. Please install it first."
    echo "In Termux, run: pkg install $cmd"
    exit 1
  fi
done

# Prepare build directory
echo "Creating build directory..."
mkdir -p dist

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

echo "===== Setup Complete ====="
echo ""
echo "To start the application, run:"
echo "./start.js"
echo ""
echo "Or you can use: NODE_ENV=production node start.js"