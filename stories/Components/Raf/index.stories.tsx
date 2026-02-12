import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Raf',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    fps: 'auto',
  },
  argTypes: {
    fps: {
      control: 'text',
    },
  },
};

export const WithDefinedFPS: StoryObj<TComponent> = {
  args: {
    fps: 10,
  },
};
