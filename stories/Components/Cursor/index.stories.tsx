import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/Cursor/props';
import type { ICursorMutableProps } from '@/index';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const SPRING = { stiffness: 100, damping: 10 } as const;

const EASE_OPTIONS = ['0.05', '0.1', '0.2', '0.3', '0.5', 'spring'] as const;

const EASE_MAPPING = {
  '0.05': 0.05,
  '0.1': 0.1,
  '0.2': 0.2,
  '0.3': 0.3,
  '0.5': 0.5,
  spring: SPRING,
} satisfies Record<(typeof EASE_OPTIONS)[number], ICursorMutableProps['ease']>;

const EASE_CHANNEL_OPTIONS = [
  'auto',
  '0.05',
  '0.1',
  '0.2',
  '0.3',
  '0.5',
  'spring',
] as const;

const EASE_CHANNEL_MAPPING = {
  auto: 'auto',
  '0.05': 0.05,
  '0.1': 0.1,
  '0.2': 0.2,
  '0.3': 0.3,
  '0.5': 0.5,
  spring: SPRING,
} satisfies Record<
  (typeof EASE_CHANNEL_OPTIONS)[number],
  ICursorMutableProps['easeCoords']
>;

const easeChannelArgType = {
  control: 'select' as const,
  options: [...EASE_CHANNEL_OPTIONS],
  mapping: EASE_CHANNEL_MAPPING,
  table: { category: MUTABLE_NAME },
};

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
    ease: 0.2,
    lerp: MUTABLE_PROPS.lerp,
    easeCoords: MUTABLE_PROPS.easeCoords,
    easeSize: MUTABLE_PROPS.easeSize,
    easeAngle: MUTABLE_PROPS.easeAngle,
    easeVelocity: MUTABLE_PROPS.easeVelocity,
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
      table: { category: STATIC_NAME },
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
    ease: {
      control: 'select',
      options: [...EASE_OPTIONS],
      mapping: EASE_MAPPING,
      table: { category: MUTABLE_NAME },
    },
    lerp: {
      name: 'lerp (deprecated)',
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    easeCoords: easeChannelArgType,
    easeSize: easeChannelArgType,
    easeAngle: easeChannelArgType,
    easeVelocity: easeChannelArgType,
    autoStop: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const Elastic: StoryObj<TComponent> = {
  args: {
    preset: 'elastic',
    ease: 0.25,
  },
};

export const Spring: StoryObj<TComponent> = {
  args: {
    ease: SPRING,
  },
};

export const SpringElastic: StoryObj<TComponent> = {
  args: {
    preset: 'elastic',
    ease: SPRING,
    easeAngle: SPRING,
    easeVelocity: SPRING,
  },
};

export const SpringChannels: StoryObj<TComponent> = {
  args: {
    ease: 0.2,
    easeCoords: SPRING,
    easeSize: SPRING,
    easeAngle: SPRING,
    easeVelocity: SPRING,
  },
};

export const Path: StoryObj<TComponent> = {
  args: {
    behavior: 'path',
    easeCoords: 0.2,
  },
};

export const RTL: StoryObj<TComponent> = {
  render: (arg) => (
    <div dir="rtl">
      <Component {...arg}></Component>
    </div>
  ),
};
