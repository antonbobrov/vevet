import React from 'react';

import { Ball as BallComponent } from './Ball';
import { Bounds as BoundsComponent } from './Bounds';
import { Direction as DirectionComponent } from './Direction';
import { Lever as LeverComponent } from './Lever';
import { Rotation as RotationComponent } from './Rotation';
import { Scroll as ScrollComponent } from './Scroll';
import { Test as TestComponent } from './Test';
import { TSwipeStoryProps } from './types';

import type { Meta, StoryFn } from '@storybook/react';

type StoryArgs = TSwipeStoryProps;

const meta: Meta<StoryArgs> = {
  title: 'Components/Swipe',
  argTypes: {
    inertiaType: {
      control: 'radio',
      options: ['exponential', 'timeline'],
      description: 'Inertia mode (stories with `inertia: true` only)',
    },
  },
  args: {
    inertiaType: 'exponential',
  },
};

export default meta;

export const Test: StoryFn<StoryArgs> = () => <TestComponent />;

export const Direction: StoryFn<StoryArgs> = () => <DirectionComponent />;

export const Bounds: StoryFn<StoryArgs> = (args) => (
  <BoundsComponent inertiaType={args.inertiaType} />
);

export const Ball: StoryFn<StoryArgs> = (args) => (
  <BallComponent inertiaType={args.inertiaType} />
);

export const Rotation: StoryFn<StoryArgs> = (args) => (
  <RotationComponent inertiaType={args.inertiaType} />
);

export const Lever: StoryFn<StoryArgs> = (args) => (
  <LeverComponent inertiaType={args.inertiaType} />
);

export const Scroll: StoryFn<StoryArgs> = (args) => (
  <ScrollComponent inertiaType={args.inertiaType} />
);
