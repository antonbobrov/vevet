import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/AnimationFrame',
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

export const ExactFPS: StoryObj<TComponent> = {
  args: {
    fps: 20,
  },
};
