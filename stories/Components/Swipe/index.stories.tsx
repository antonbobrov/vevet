import React from 'react';

import { Ball as BallComponent } from './Ball';
import { Bounds as BoundsComponent } from './Bounds';
import { Direction as DirectionComponent } from './Direction';
import { Lever as LeverComponent } from './Lever';
import { Rotation as RotationComponent } from './Rotation';
import { Scroll as ScrollComponent } from './Scroll';
import { Test as TestComponent } from './Test';
import { Viewer as ViewerComponent } from './Viewer';

import type { TViewerInteraction } from './Viewer';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

type TViewerStory = StoryObj<typeof ViewerComponent>;

const viewerArgTypes = {
  interaction: {
    control: 'select',
    options: ['simple', 'pinch'] satisfies TViewerInteraction[],
  },
} satisfies NonNullable<TViewerStory['argTypes']>;

const meta: Meta<typeof ViewerComponent> = {
  title: 'Components/Swipe',
  component: ViewerComponent,
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Direction: StoryFn = () => <DirectionComponent />;

export const Bounds: StoryFn = () => <BoundsComponent />;

export const Ball: StoryFn = () => <BallComponent />;

export const Rotation: StoryFn = () => <RotationComponent />;

export const Lever: StoryFn = () => <LeverComponent />;

export const Scroll: StoryFn = () => <ScrollComponent />;

export const Viewer: TViewerStory = {
  args: {
    interaction: 'simple',
  },
  argTypes: viewerArgTypes,
};
