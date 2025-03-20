import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.hearit.app',
  appName: 'HearIt',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      '*.youtube.com',
      '*.googleapis.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large"
    },
    // Add background mode configuration for Anuradev plugin
    BackgroundMode: {
      enable: true,
      title: "HearIt",
      text: "Playing music in background",
      icon: "notification_icon",
      color: "#ffffff",
      resume: true,
      hidden: false,
      showWhen: true
    }
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
