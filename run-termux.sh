#!/bin/bash

# Run script for Termux environment

# Determine the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if YouTube API key is set
if [ -z "$YOUTUBE_API_KEY" ]; then
  echo "⚠️ Warning: YOUTUBE_API_KEY environment variable is not set."
  echo "The application may not be able to search or play videos."
  echo "Set it using: export YOUTUBE_API_KEY=your_api_key"
  echo ""
  
  # Ask if user wants to continue
  read -p "Continue anyway? (y/n): " continue_choice
  if [ "$continue_choice" != "y" ] && [ "$continue_choice" != "Y" ]; then
    echo "Exiting."
    exit 1
  fi
fi

# Check if dist directory exists, if not run build
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
  echo "Build files not found. Running setup script first..."
  ./setup-termux.sh
fi

# Run the application
NODE_ENV=production node start.js