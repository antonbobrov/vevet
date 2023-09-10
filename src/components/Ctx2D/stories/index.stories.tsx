import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Ctx2D',
  component: Component,
};

export default meta;

export const Default: StoryObj<TComponent> = {};
