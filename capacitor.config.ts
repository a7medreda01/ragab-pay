import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ragabpay.app',
  appName: 'Ragab Pay',
  webDir: 'dist/ragab-bay/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
