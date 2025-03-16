#!/bin/bash

# Exit on error
set -e

echo "🔨 Building HearIt Android application..."

# Check if ANDROID_HOME or ANDROID_SDK_ROOT is available
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
  echo "⚠️ Neither ANDROID_HOME nor ANDROID_SDK_ROOT is set."
  echo "Please ensure Android SDK is installed and environment variables are set."
  echo ""
  echo "Common locations:"
  echo "  - macOS: ~/Library/Android/sdk"
  echo "  - Linux: ~/Android/sdk"
  echo "  - Windows: %LOCALAPPDATA%\\Android\\sdk"
  echo ""
  echo "Set with: export ANDROID_SDK_ROOT=/path/to/android/sdk"
  exit 1
fi

# Build the web application
echo "📦 Building web application..."
npm run build

# Add Android platform if not already added
if [ ! -d "android" ]; then
  echo "🤖 Adding Android platform..."
  npx cap add android
else
  echo "🤖 Android platform already exists."
fi

# Copy web assets to Android project
echo "🔄 Syncing web assets to Android project..."
npx cap sync android

# Update AndroidManifest.xml to ensure proper permissions
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
  echo "🔒 Ensuring proper permissions are set in AndroidManifest.xml..."
  
  # Check if the INTERNET permission is already there
  if ! grep -q "android.permission.INTERNET" "android/app/src/main/AndroidManifest.xml"; then
    # Try to add it using sed, different syntax for macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' 's/<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/<uses-permission android:name="android.permission.INTERNET"\/>\n    &/' "android/app/src/main/AndroidManifest.xml"
    else
      sed -i 's/<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/<uses-permission android:name="android.permission.INTERNET"\/>\n    &/' "android/app/src/main/AndroidManifest.xml"
    fi
  fi
fi

# Create a properties file for YouTube API key
echo "🔑 Creating properties file for YouTube API key..."
mkdir -p android/app/src/main/assets
echo "# YouTube API Key for HearIt app" > android/app/src/main/assets/app.properties
echo "# Insert your YouTube API key below" >> android/app/src/main/assets/app.properties
echo "youtube.api.key=" >> android/app/src/main/assets/app.properties

echo "✅ Build completed successfully!"
echo ""
echo "📝 Important steps before building APK:"
echo "1. Open android/app/src/main/assets/app.properties and add your YouTube API key"
echo "2. Open the Android project in Android Studio: npx cap open android"
echo "3. Wait for project indexing and Gradle sync to complete"
echo ""
echo "📱 Build options:"
echo "- From Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "- Command line (after setup): cd android && ./gradlew assembleDebug"
echo ""
echo "The APK will be available at: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "🔍 Troubleshooting:"
echo "- If you encounter build errors, try: File > Sync Project with Gradle Files"
echo "- For SDK issues: File > Project Structure > SDK Location"
echo "- For module issues: File > Project Structure > Modules"