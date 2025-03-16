import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.hearit.app',
  appName: 'HearIt',
  webDir: 'dist/public',
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
    backgroundColor: "#ffffff"
  }
};

export default config;
