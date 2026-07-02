import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jyotishguru.app',
  appName: 'AstroSolution',
  webDir: 'public',
  server: {
    url: 'https://lavish-bucket-vastness.ngrok-free.dev',
    cleartext: true
  }
};

export default config;
