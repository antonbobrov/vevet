import React from 'react';

import { InElement } from './InElement';
import { InWindow } from './InWindow';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/ScrollProgress',
};

export default meta;

export const InWindowY: StoryFn = () => <InWindow direction="y" />;

export const InWindowX: StoryFn = () => <InWindow direction="x" />;

export const InElementY: StoryFn = () => <InElement direction="y" />;

export const InElementX: StoryFn = () => <InElement direction="x" />;
