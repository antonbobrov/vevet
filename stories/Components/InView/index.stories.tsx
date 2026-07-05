import React from 'react';

import { STATIC_PROPS, MUTABLE_PROPS } from '@/components/InView/props';

import { MUTABLE_NAME, STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/InView',
  component: Component,
  args: {
    hasOut: STATIC_PROPS.hasOut,
    maxInitialDelay: STATIC_PROPS.maxInitialDelay,
    scrollDirection: STATIC_PROPS.scrollDirection,
    enabled: MUTABLE_PROPS.enabled,
    rootMargin: MUTABLE_PROPS.rootMargin,
  },
  argTypes: {
    isRtl: { table: { disable: true } },
    hasOut: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    maxInitialDelay: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    scrollDirection: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      table: { category: STATIC_NAME },
    },
    enabled: {
      control: 'boolean',
      table: { category: MUTABLE_NAME },
    },
    rootMargin: {
      control: 'text',
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const Horizontal: StoryObj<TComponent> = {
  args: {
    scrollDirection: 'horizontal',
    rootMargin: '0% -15% 0% 0%',
  },
  render: (args) => (
    <div
      style={{
        height: 300,
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: 200,
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyItems: 'center',
          width: 'max-content',
          gap: 20,
        }}
      >
        <Component {...args} />
      </div>
    </div>
  ),
};

export const HorizontalRTL: StoryObj<TComponent> = {
  args: {
    scrollDirection: 'horizontal',
    rootMargin: '0% 0% 0% -15%',
    isRtl: true,
  },
  render: (args) => (
    <div
      style={{
        height: 300,
        width: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: 200,
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyItems: 'center',
          width: 'max-content',
          gap: 20,
        }}
      >
        <Component {...args} />
      </div>
    </div>
  ),
};
