import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Basic } from './Basic';
import { Nested } from './Nested';

const meta: Meta = {
  title: 'Components/BaseTimeline',
};

export default meta;

export const Default: StoryFn<typeof Basic> = (props) => <Basic {...props} />;

export const WithNested: StoryFn<typeof Nested> = (props) => (
  <Nested {...props} />
);
