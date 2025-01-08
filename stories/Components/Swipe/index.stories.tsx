import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Test as TestComponent } from './Test';
import { Direction as DirectionComponent } from './Direction';
import { Drag as DragComponent } from './Drag';
import { Rotation as RotationComponent } from './Rotation';
import { Large as LargeComponent } from './Large';

const meta: Meta = {
  title: 'Components/Swipe',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Direction: StoryFn = () => <DirectionComponent />;

export const Drag: StoryFn = () => <DragComponent />;

export const Rotation: StoryFn = () => <RotationComponent />;

export const Large: StoryFn = () => <LargeComponent />;
