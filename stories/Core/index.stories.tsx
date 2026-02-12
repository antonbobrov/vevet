import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Core',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {};
