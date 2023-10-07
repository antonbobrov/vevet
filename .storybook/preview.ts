import type { Preview } from '@storybook/react';
import { vevet } from '../src/vevet';
import './styles.css';
import '@/styles/index.scss';

// @ts-ignore
window.initVevet = vevet;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
