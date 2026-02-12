import React from 'react';

import { InElement as InElementComponent } from './InElement';
import { InWindow as InWindowComponent } from './InWindow';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Scrollbar',
};

export default meta;

export const InWindow: StoryFn = () => <InWindowComponent />;

export const InElement: StoryFn = () => <InElementComponent />;
