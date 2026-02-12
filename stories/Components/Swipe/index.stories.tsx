import React from 'react';

import { Ball as BallComponent } from './Ball';
import { Circle as CircleComponent } from './Circle';
import { Direction as DirectionComponent } from './Direction';
import { Drag as DragComponent } from './Drag';
import { Large as LargeComponent } from './Large';
import { Rotation as RotationComponent } from './Rotation';
import { Test as TestComponent } from './Test';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Swipe',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Direction: StoryFn = () => <DirectionComponent />;

export const Drag: StoryFn = () => <DragComponent />;

export const Ball: StoryFn = () => <BallComponent />;

export const Rotation: StoryFn = () => <RotationComponent />;

export const Circle: StoryFn = () => <CircleComponent />;

export const Large: StoryFn = () => <LargeComponent />;
