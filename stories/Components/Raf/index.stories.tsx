import { MUTABLE_PROPS } from '@/components/Raf/props';

import { MUTABLE_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Raf',
  component: Component,
  args: {
    fps: MUTABLE_PROPS.fps,
    enabled: MUTABLE_PROPS.enabled,
    fpsRecalcFrames: MUTABLE_PROPS.fpsRecalcFrames,
  },
  argTypes: {
    fps: {
      control: 'select',
      options: ['auto', 10, 30, 60, 140, 250],
      table: { category: MUTABLE_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    fpsRecalcFrames: {
      control: { type: 'number', min: 1, step: 1 },
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const WithDefinedFPS: StoryObj<TComponent> = {
  args: {
    fps: 10,
  },
};
