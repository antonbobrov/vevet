import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { WithCustomScrollComponent } from './WithCustomScrollComponent';
import { WithInnerScrollComponent } from './WithInnerScroll';
import { WithDefaultComponent } from './Default';

const meta: Meta = {
  title: 'Components/ScrollBar',
};

export default meta;

export const Default: StoryFn<typeof WithDefaultComponent> = (props) => (
  <WithDefaultComponent {...props} />
);

export const WithCustomScroll: StoryFn<typeof WithCustomScrollComponent> = (
  props,
) => <WithCustomScrollComponent {...props} />;

export const WithInnerScroll: StoryFn<typeof WithInnerScrollComponent> = (
  props,
) => <WithInnerScrollComponent {...props} />;
