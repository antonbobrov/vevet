import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Basic } from './Basic';

const meta: Meta = {
  title: 'Components/Timeline',
};

export default meta;

export const Default: StoryFn<typeof Basic> = (props) => <Basic {...props} />;
