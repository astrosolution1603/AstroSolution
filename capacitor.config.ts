import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jyotishguru.app',
  appName: 'AstroSolution',
  webDir: 'public',
  server: {
    url: 'https://astro-solution.vercel.app',
    cleartext: true
  }
};

export default config;
