import React from 'react';

import { Basic } from '.';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Timeline',
};

export default meta;

export const Default: StoryFn<typeof Basic> = (props) => <Basic {...props} />;
