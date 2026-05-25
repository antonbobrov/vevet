import React from 'react';

import { Cards as CardsComponent } from './Cards';
import { CardsStack as CardsStackComponent } from './CardsStack';
import { Carousel as CarouselComponent } from './Carousel';
import { Circular as CircularComponent } from './Circular';
import { DynamicWidth as DynamicWidthComponent } from './DynamicWidth';
import { InfluenceParallaxGap as InfluenceParallaxGapComponent } from './InfluenceParallaxGap';
import { InfluenceParallaxSkew as InfluenceParallaxSkewComponent } from './InfluenceParallaxSkew';
import { Panorama as PanoramaComponent } from './Panorama';
import { Rtl as RtlComponent } from './Rtl';
import { Test as TestComponent } from './Test';
import { Virtual as VirtualComponent } from './Virtual';

import type { TTestSnapProps } from './Test';
import type { Meta, StoryFn } from '@storybook/react';

interface ITestStoryArgs {
  centered: boolean;
  loop: boolean;
  snapProps?: Omit<TTestSnapProps, 'centered' | 'loop'>;
}

type TTestStory = StoryFn<ITestStoryArgs>;
type TTestStoryArgTypes = NonNullable<TTestStory['argTypes']>;

const testArgTypes = {
  centered: { control: 'boolean' },
  loop: { control: 'boolean' },
  snapProps: { table: { disable: true } },
} satisfies TTestStoryArgTypes;

const renderTest: TTestStory = ({ centered, loop, snapProps }) => (
  <TestComponent
    snapProps={{
      ...snapProps,
      centered,
      loop,
    }}
  />
);

const meta: Meta = {
  title: 'Components/Snap',
};

export default meta;

export const Default: TTestStory = renderTest.bind({});
Default.args = {
  centered: false,
  loop: false,
  snapProps: {},
} satisfies ITestStoryArgs;
Default.argTypes = testArgTypes;

export const FreemodeWheelNoFollow: TTestStory = renderTest.bind({});
FreemodeWheelNoFollow.args = {
  centered: false,
  loop: false,
  snapProps: {
    freemode: true,
    followWheel: false,
    wheelThrottle: 'auto',
  },
} satisfies ITestStoryArgs;
FreemodeWheelNoFollow.argTypes = testArgTypes;

export const SwipeNoFollow: TTestStory = renderTest.bind({});
SwipeNoFollow.args = {
  centered: false,
  loop: false,
  snapProps: {
    followSwipe: false,
  },
} satisfies ITestStoryArgs;
SwipeNoFollow.argTypes = testArgTypes;

export const Rewind: TTestStory = renderTest.bind({});
Rewind.args = {
  centered: false,
  loop: false,
  snapProps: {
    followSwipe: false,
    rewind: true,
  },
} satisfies ITestStoryArgs;
Rewind.argTypes = testArgTypes;

export const FreemodeSticky: TTestStory = renderTest.bind({});
FreemodeSticky.args = {
  centered: false,
  loop: false,
  snapProps: {
    freemode: 'sticky',
  },
} satisfies ITestStoryArgs;
FreemodeSticky.argTypes = testArgTypes;

export const Vertical: TTestStory = renderTest.bind({});
Vertical.args = {
  centered: false,
  loop: false,
  snapProps: {
    direction: 'vertical',
    followWheel: false,
  },
} satisfies ITestStoryArgs;
Vertical.argTypes = testArgTypes;

export const Rtl: StoryFn = () => <RtlComponent />;

export const Carousel: StoryFn = () => <CarouselComponent />;

export const Cards: StoryFn = () => <CardsComponent />;

export const Panorama: StoryFn = () => <PanoramaComponent />;

export const Circular: StoryFn = () => <CircularComponent />;

export const CardsStack: StoryFn = () => <CardsStackComponent />;

export const DynamicWidth: StoryFn = () => <DynamicWidthComponent />;

export const InfluenceParallaxGap: StoryFn = () => (
  <InfluenceParallaxGapComponent />
);

export const InfluenceParallaxSkew: StoryFn = () => (
  <InfluenceParallaxSkewComponent />
);

export const Virtual: StoryFn = () => <VirtualComponent />;
