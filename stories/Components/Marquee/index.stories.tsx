import React from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/Marquee/props';
import type { IMarqueeStaticProps } from '@/index';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/Marquee',
  component: Component,
  args: {
    resizeDebounce: STATIC_PROPS.resizeDebounce,
    hasWillChange: STATIC_PROPS.hasWillChange,
    cloneNodes: STATIC_PROPS.cloneNodes,
    direction: STATIC_PROPS.direction,
    speed: MUTABLE_PROPS.speed,
    gap: MUTABLE_PROPS.gap,
    enabled: MUTABLE_PROPS.enabled,
    pauseOnHover: MUTABLE_PROPS.pauseOnHover,
    centered: MUTABLE_PROPS.centered,
    adjustSpeed: MUTABLE_PROPS.adjustSpeed,
    pauseOnOut: MUTABLE_PROPS.pauseOnOut,
  },
  argTypes: {
    resizeDebounce: {
      control: { type: 'number', min: 0, step: 100 },
      table: { category: STATIC_NAME },
    },
    hasWillChange: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    cloneNodes: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    direction: {
      control: 'select',
      options: [
        'horizontal',
        'vertical',
      ] satisfies IMarqueeStaticProps['direction'][],
      table: { category: STATIC_NAME },
    },
    speed: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    gap: {
      control: 'number',
      table: { category: MUTABLE_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    pauseOnHover: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    centered: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    adjustSpeed: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    pauseOnOut: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const Gap: StoryObj<TComponent> = {
  args: {
    gap: 50,
  },
};

export const PauseOnHover: StoryObj<TComponent> = {
  args: {
    pauseOnHover: true,
  },
};

export const ReverseSpeed: StoryObj<TComponent> = {
  args: {
    speed: -1,
  },
};

export const Centered: StoryObj<TComponent> = {
  args: {
    centered: true,
    cloneNodes: false,
  },
};

export const NoClones: StoryObj<TComponent> = {
  args: {
    cloneNodes: false,
  },
};

export const Rtl: StoryObj<TComponent> = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <div dir="rtl">
      <Component {...args} />
    </div>
  ),
};
