import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Test as TestComponent } from './Test';
import { WithCanvas as WithCanvasComponent } from './WithCanvas';

const meta: Meta = {
  title: 'Components/Pointers',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const WithCanvas: StoryFn = () => <WithCanvasComponent />;
