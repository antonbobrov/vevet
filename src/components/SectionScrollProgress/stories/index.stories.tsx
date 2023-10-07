import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { WithCustomScrollComponent } from './WithCustomScroll';
import { DefalultComponent } from './Default';

const meta: Meta = {
  title: 'Components/SectionScrollProgress',
};

export default meta;

export const Default: StoryFn<typeof DefalultComponent> = (props) => (
  <DefalultComponent {...props} />
);

export const WithCustomScroll: StoryFn<typeof WithCustomScrollComponent> = (
  props
) => <WithCustomScrollComponent {...props} />;
