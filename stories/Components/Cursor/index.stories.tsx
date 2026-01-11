import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Test as TestComponent } from './Test';
import { Path as PathComponent } from './Path';

const meta: Meta = {
  title: 'Components/Cursor',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Path: StoryFn = () => <PathComponent />;
