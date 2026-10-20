import { MUTABLE_PROPS } from '@/components/Timeline/props';
import { EaseInOutCubic, EaseOutBack } from '@/index';
import type { ITimelineMutableProps } from '@/index';

import { MUTABLE_NAME } from '../../global/constants';

import { Component } from '.';

import type { Meta, StoryObj } from '@storybook/react';

type TComponent = typeof Component;

const easingOptions = [
  'default',
  'linear',
  'easeInOutCubic',
  'easeOutBack',
  'spring',
] as const;

const meta: Meta<TComponent> = {
  title: 'Components/Timeline',
  component: Component,
  args: {
    duration: MUTABLE_PROPS.duration,
    ease: MUTABLE_PROPS.easing,
  },
  argTypes: {
    duration: {
      control: { type: 'number', min: 0, step: 100 },
      table: { category: MUTABLE_NAME },
    },
    ease: {
      control: 'select',
      options: easingOptions,
      mapping: {
        default: MUTABLE_PROPS.easing,
        linear: false,
        easeInOutCubic: EaseInOutCubic,
        easeOutBack: EaseOutBack,
        spring: { stiffness: 100, damping: 10 },
      } satisfies Record<
        (typeof easingOptions)[number],
        ITimelineMutableProps['ease']
      >,
      table: { category: MUTABLE_NAME },
    },
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};
