import type { StorybookConfig } from '@storybook/react-vite';
import path from "path";

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  staticDirs: ['../stories/public/'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.resolve!.alias = {
      '@': path.resolve(__dirname, '../src/'),
    };

    return config;
  },
};

export default config;
