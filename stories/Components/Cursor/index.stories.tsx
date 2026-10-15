import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/Cursor/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Cursor',
  component: Component,
  args: {
    preset: 'default',
    hideNative: STATIC_PROPS.hideNative,
    append: STATIC_PROPS.append,
    behavior: STATIC_PROPS.behavior,
    enabled: MUTABLE_PROPS.enabled,
    width: MUTABLE_PROPS.width,
    height: MUTABLE_PROPS.height,
    lerp: MUTABLE_PROPS.lerp,
    autoStop: MUTABLE_PROPS.autoStop,
  },
  argTypes: {
    preset: {
      control: 'radio',
      options: ['default', 'elastic'],
    },
    hideNative: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    append: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    behavior: {
      control: 'select',
      options: ['default', 'path'],
      table: { category: MUTABLE_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    width: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    height: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    lerp: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    autoStop: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const RTL: StoryObj<TComponent> = {
  render: (arg) => (
    <div dir="rtl">
      <Component {...arg}></Component>
    </div>
  ),
};
