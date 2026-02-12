import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Preloader',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    hide: 750,
  },
};

export const WithNoHide: StoryObj<TComponent> = {
  args: {
    hide: false,
  },
};
