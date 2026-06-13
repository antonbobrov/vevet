import React from 'react';

import { StoryWrapper } from './StoryWrapper';

import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
