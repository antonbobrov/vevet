import React from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Pointers/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { CanvasComponent } from './Canvas';
import { Component } from './Component';
import { PinchComponent } from './Pinch';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Pointers',
  component: Component,
  args: {
    relative: STATIC_PROPS.relative,
    buttons: STATIC_PROPS.buttons,
    minPointers: STATIC_PROPS.minPointers,
    maxPointers: STATIC_PROPS.maxPointers,
    disableUserSelect: STATIC_PROPS.disableUserSelect,
    enabled: MUTABLE_PROPS.enabled,
  },
  argTypes: {
    relative: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    buttons: {
      table: { disable: true },
    },
    minPointers: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    maxPointers: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    disableUserSelect: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    relative: true,
    minPointers: 1,
    maxPointers: 1,
  },
};

export const RightClick: StoryObj<TComponent> = {
  args: {
    relative: true,
    buttons: [2],
    minPointers: 1,
    maxPointers: 1,
  },
};

export const TwoPointers: StoryObj<TComponent> = {
  args: {
    relative: true,
    minPointers: 2,
    maxPointers: 5,
  },
};

export const Canvas: StoryObj<TComponent> = {
  args: {
    relative: true,
  },
  render: (props) => <CanvasComponent {...props}></CanvasComponent>,
};

export const PanPinchRotate: StoryObj<TComponent> = {
  args: {
    relative: false,
  },
  render: (props) => <PinchComponent {...props}></PinchComponent>,
};

export const TwoPointersPanPinchRotate: StoryObj<TComponent> = {
  args: {
    relative: false,
    minPointers: 2,
  },
  render: (props) => <PinchComponent {...props}></PinchComponent>,
};
