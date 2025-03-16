#!/bin/bash

# Exit on error
set -e

echo "Building HearIt APK..."
echo "======================="

# Build the web app
echo "Step 1: Building web application..."
npm run build

# Initialize Capacitor if needed
if [ ! -d "android" ]; then
  echo "Step 2: Initializing Capacitor Android project..."
  npx cap add android
else
  echo "Step 2: Android project already exists, updating..."
fi

# Copy web assets to Android project
echo "Step 3: Syncing web assets to Android project..."
npx cap sync android

echo "Step 4: Creating APK..."
cd android

# Check if gradlew exists and is executable
if [ ! -x "./gradlew" ]; then
  echo "Making gradlew executable..."
  chmod +x ./gradlew
fi

# Build debug APK
./gradlew assembleDebug

echo "======================="
echo "APK build complete!"
echo "The APK is located at: android/app/build/outputs/apk/debug/app-debug.apk"