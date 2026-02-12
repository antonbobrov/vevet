import React from 'react';

import { Horizontal as HorizontalComponent } from './Horizontal';
import { Vertical as VerticalComponent } from './Vertical';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/InView',
};

export default meta;

export const Vertical: StoryFn = () => <VerticalComponent />;

export const Horizontal: StoryFn = () => <HorizontalComponent />;
