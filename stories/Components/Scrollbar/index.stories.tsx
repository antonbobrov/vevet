import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/Scrollbar/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { InsideComponent } from './Inside';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Scrollbar',
  component: Component,
  args: {
    class: 'test-class-name',
    axis: STATIC_PROPS.axis,
    draggable: STATIC_PROPS.draggable,
    autoHide: STATIC_PROPS.autoHide,
    resizeDebounce: STATIC_PROPS.resizeDebounce,
    minSize: MUTABLE_PROPS.minSize,
    autoSize: MUTABLE_PROPS.autoSize,
  },
  argTypes: {
    class: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    axis: {
      control: 'select',
      options: ['x', 'y'],
      table: { category: STATIC_NAME },
    },
    draggable: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    autoHide: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    resizeDebounce: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    autoSize: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    minSize: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {},
};

export const NoHide: StoryObj<TComponent> = {
  args: { autoHide: false },
};

export const Horizontal: StoryObj<TComponent> = {
  args: { axis: 'x' },
};

export const Size: StoryObj<TComponent> = {
  args: { minSize: 50, autoSize: false },
};

export const Inside: StoryObj<TComponent> = {
  args: {},
  render: (arg) => <InsideComponent {...arg}></InsideComponent>,
};

export const InsideHorizontal: StoryObj<TComponent> = {
  args: { axis: 'x' },
  render: (arg) => <InsideComponent {...arg}></InsideComponent>,
};

export const InsideRtl: StoryObj<TComponent> = {
  args: { axis: 'x' },
  render: (arg) => (
    <div dir="rtl">
      <InsideComponent {...arg}></InsideComponent>
    </div>
  ),
};
