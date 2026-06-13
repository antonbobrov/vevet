import path from 'path';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-highlight',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
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

    config.server = config.server || {};
    config.server.watch = config.server.watch || {};

    config.server.watch.ignored = [
      '**/node_modules/**',
      path.resolve(__dirname, '../docusaurus/**'),
    ];

    return config;
  },
};

export default config;
