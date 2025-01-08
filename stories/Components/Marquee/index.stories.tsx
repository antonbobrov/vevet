import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Marquee',
  component: Component,
  args: {
    gap: 10,
  },
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

export const WithCentered: StoryObj<TComponent> = {
  args: {
    centered: true,
    cloneNodes: false,
  },
};

export const WithoutClones: StoryObj<TComponent> = {
  args: {
    cloneNodes: false,
  },
};
