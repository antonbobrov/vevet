import { STATIC_PROPS } from '@/components/Preloader/props';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Preloader',
  component: Component,
  args: {
    hide: STATIC_PROPS.hide,
  },
  argTypes: {
    hide: {
      table: { disable: true },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    hide: 1500,
  },
};

export const ManualHide: StoryObj<TComponent> = {
  args: {
    hide: false,
  },
};
