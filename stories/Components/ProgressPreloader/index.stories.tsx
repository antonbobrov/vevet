import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/ProgressPreloader',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {};
