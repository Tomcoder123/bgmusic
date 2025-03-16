# HearIt Music Player

A premium-style music player web app that plays YouTube songs with background playback capability and audio quality selection. Built with React, TypeScript, and Tailwind CSS, with a clean, modern Apple Music-inspired interface.

## Features

- 🎵 YouTube music playback
- 🔊 Audio quality control (low, medium, high)
- 🎧 Background playback capability
- 📱 Mobile-responsive design
- 📋 Recently played tracks history
- 🔍 Search functionality
- 📱 Android app via Capacitor

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- For Android build: Android Studio with SDK installed

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/hearit-player.git
   cd hearit-player
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your YouTube API key:
   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5000`

## Deployment Options

### GitHub Pages Deployment

1. Fork this repository
2. In your GitHub repository settings, add a secret named `YOUTUBE_API_KEY` with your YouTube API key
3. Enable GitHub Pages in the repository settings
4. The GitHub workflow will automatically deploy your app to GitHub Pages when you push to the main branch

### Replit Deployment

1. Import this repository to Replit
2. Add your YouTube API key as a secret in Replit
3. Click the Run button

## Building Android APK

To build an Android APK:

1. Ensure Android Studio is installed with the Android SDK
2. Run the build script:
   ```bash
   ./build-android.sh
   ```
3. The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`

### Manual Android Build Steps

If you prefer to build the APK manually:

1. Build the web application:
   ```bash
   npm run build
   ```

2. Initialize Capacitor Android project (first time only):
   ```bash
   npx cap add android
   ```

3. Update the Android project with the latest web build:
   ```bash
   npx cap sync android
   ```

4. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

5. In Android Studio, select Build > Build Bundle(s) / APK(s) > Build APK(s)

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/context` - React Context providers
  - `/src/hooks` - Custom React hooks
  - `/src/pages` - Application pages/routes
- `/server` - Backend Express server
- `/shared` - Shared TypeScript types and schemas
- `/android` - Generated Android project (after running Capacitor)

## YouTube API Usage

This application uses the YouTube Data API v3 to search for music and retrieve video details. You'll need a YouTube API key from the Google Cloud Console to use this functionality.

## License

MIT