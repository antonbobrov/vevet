import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Marquee',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {},
};

export const WithPauseOnHover: StoryObj<TComponent> = {
  args: {
    pauseOnHover: true,
  },
};

export const WithReverseSpeed: StoryObj<TComponent> = {
  args: {
    speed: -1,
  },
};
