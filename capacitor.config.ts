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
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    backgroundColor: "#ffffff",
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: "APK"
    },
    androidXEnabled: true,
    minSdkVersion: 22,
    targetSdkVersion: 33
  }
};

export default config;
