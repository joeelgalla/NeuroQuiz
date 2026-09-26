import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.joeelgallad.neuroquiz',
  appName: 'NeuroQuiz',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
};

export default config;

