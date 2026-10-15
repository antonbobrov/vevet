import { STATIC_PROPS } from '@/components/ProgressPreloader/props';

import { STATIC_NAME } from '../../global/constants';

import { Component } from '.';

import type { StoryObj, Meta } from '@storybook/react';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/ProgressPreloader',
  component: Component,
  args: {
    hide: STATIC_PROPS.hide,
    preloadImages: STATIC_PROPS.preloadImages,
    preloadVideos: STATIC_PROPS.preloadVideos,
    customSelector: STATIC_PROPS.customSelector,
    ignoreClassName: STATIC_PROPS.ignoreClassName,
    lerp: STATIC_PROPS.lerp,
    endDuration: STATIC_PROPS.endDuration,
  },
  argTypes: {
    hide: {
      table: { disable: true },
    },
    preloadImages: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    preloadVideos: {
      control: 'boolean',
      table: { category: STATIC_NAME },
    },
    customSelector: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    ignoreClassName: {
      control: 'text',
      table: { category: STATIC_NAME },
    },
    lerp: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
    endDuration: {
      control: 'number',
      table: { category: STATIC_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {
  args: {
    hide: 1500,
  },
};

export const PreloadVideos: StoryObj<TComponent> = {
  args: {
    preloadVideos: true,
  },
};

export const ManualHide: StoryObj<TComponent> = {
  args: {
    hide: false,
  },
};

export const LongEnd: StoryObj<TComponent> = {
  args: {
    endDuration: 9000,
  },
};

export const Instant: StoryObj<TComponent> = {
  args: {
    lerp: 1,
    endDuration: 0,
  },
};
