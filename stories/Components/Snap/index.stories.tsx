import React from 'react';

import { Cards as CardsComponent } from './Cards';
import { CardsStack as CardsStackComponent } from './CardsStack';
import { Carousel as CarouselComponent } from './Carousel';
import { Circular as CircularComponent } from './Circular';
import { DynamicWidth as DynamicWidthComponent } from './DynamicWidth';
import { Fade as FadeComponent } from './Fade';
import { InfluenceParallaxGap as InfluenceParallaxGapComponent } from './InfluenceParallaxGap';
import { InfluenceParallaxSkew as InfluenceParallaxSkewComponent } from './InfluenceParallaxSkew';
import { Panorama as PanoramaComponent } from './Panorama';
import { Rtl as RtlComponent } from './Rtl';
import { Test as TestComponent } from './Test';
import { Virtual as VirtualComponent } from './Virtual';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Snap',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Rtl: StoryFn = () => <RtlComponent />;

export const Fade: StoryFn = () => <FadeComponent />;

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
