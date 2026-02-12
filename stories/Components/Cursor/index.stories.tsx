import React from 'react';

import { Path as PathComponent } from './Path';
import { Test as TestComponent } from './Test';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Cursor',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Path: StoryFn = () => <PathComponent />;
