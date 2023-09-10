import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Preloader',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    hideAnimation: 750,
  },
};

export const WithNoHide: StoryObj<TComponent> = {
  args: {
    hideAnimation: false,
  },
};
