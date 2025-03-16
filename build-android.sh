#!/bin/bash

# Exit on error
set -e

echo "🔨 Building HearIt Android application..."

# Check if Android SDK is available
if [ -z "$ANDROID_SDK_ROOT" ]; then
  echo "⚠️ ANDROID_SDK_ROOT not set. Please ensure Android SDK is installed and ANDROID_SDK_ROOT is set."
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

echo "✅ Build completed successfully!"
echo "📱 You can now open the Android project in Android Studio:"
echo "   npx cap open android"
echo ""
echo "   Then build the APK from Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "   Or use this command to build directly (requires properly configured Android SDK):"
echo "   cd android && ./gradlew assembleDebug"
echo ""
echo "   The APK will be available at: android/app/build/outputs/apk/debug/app-debug.apk"