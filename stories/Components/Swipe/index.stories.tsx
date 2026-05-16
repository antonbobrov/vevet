import React from 'react';

import { Ball as BallComponent } from './Ball';
import { Bounds as BoundsComponent } from './Bounds';
import { Direction as DirectionComponent } from './Direction';
import { Lever as LeverComponent } from './Lever';
import { Rotation as RotationComponent } from './Rotation';
import { Scroll as ScrollComponent } from './Scroll';
import { Test as TestComponent } from './Test';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Swipe',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Direction: StoryFn = () => <DirectionComponent />;

export const Bounds: StoryFn = () => <BoundsComponent />;

export const Ball: StoryFn = () => <BallComponent />;

export const Rotation: StoryFn = () => <RotationComponent />;

export const Lever: StoryFn = () => <LeverComponent />;

export const Scroll: StoryFn = () => <ScrollComponent />;
