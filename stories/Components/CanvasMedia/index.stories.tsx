import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Test as TestComponent } from './Test';
import { Video as VideoComponent } from './Video';

const meta: Meta = {
  title: 'Components/CanvasMedia',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Video: StoryFn = () => <VideoComponent />;
