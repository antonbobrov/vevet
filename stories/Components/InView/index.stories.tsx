import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Vertical as VerticalComponent } from './Vertical';
import { Horizontal as HorizontalComponent } from './Horizontal';

const meta: Meta = {
  title: 'Components/InView',
};

export default meta;

export const Vertical: StoryFn = () => <VerticalComponent />;

export const Horizontal: StoryFn = () => <HorizontalComponent />;
