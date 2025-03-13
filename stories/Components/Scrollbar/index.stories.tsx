import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { InWindow as InWindowComponent } from './InWindow';
import { InElement as InElementComponent } from './InElement';

const meta: Meta = {
  title: 'Components/Scrollbar',
};

export default meta;

export const InWindow: StoryFn = () => <InWindowComponent />;

export const InElement: StoryFn = () => <InElementComponent />;
