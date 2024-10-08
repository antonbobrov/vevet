import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { DefaultComponent } from './Default';
import { WithInnerLerpComponent } from './WithInnerLerp';
import { WithHorizontalComponent } from './WithHorizontal';

const meta: Meta = {
  title: 'Components/CustomScroll',
};

export default meta;

export const Default: StoryFn<typeof DefaultComponent> = (props) => (
  <DefaultComponent {...props} />
);

export const WithInnerLerp: StoryFn<typeof WithInnerLerpComponent> = (
  props,
) => <WithInnerLerpComponent {...props} />;

export const WithHorizontal: StoryFn<typeof WithHorizontalComponent> = (
  props,
) => <WithHorizontalComponent {...props} />;
