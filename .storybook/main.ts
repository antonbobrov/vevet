import type { StorybookConfig } from '@storybook/react-webpack5';
import { resolveTsconfigPathsToAlias } from './resolveTsconfigPathsToAlias';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          // eslint-disable-next-line import/no-extraneous-dependencies, global-require
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (configProp) => {
    if (configProp.resolve) {
      // eslint-disable-next-line no-param-reassign
      configProp.resolve.alias = {
        ...configProp.resolve.alias,
        ...resolveTsconfigPathsToAlias(),
      };
    }

    return configProp;
  },
};

export default config;
