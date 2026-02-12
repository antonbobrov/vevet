import React from 'react';

import { Cards as CardsComponent } from './Cards';
import { CardsStack as CardsStackComponent } from './CardsStack';
import { Carousel as CarouselComponent } from './Carousel';
import { Circular as CircularComponent } from './Circular';
import { CreativeScale as CreativeScaleComponent } from './CreativeScale';
import { CreativeSine as CreativeSineComponent } from './CreativeSine';
import { DynamicWidth as DynamicWidthComponent } from './DynamicWidth';
import { Fade as FadeComponent } from './Fade';
import { Glide as GlideComponent } from './Glide';
import { InfluenceParallaxGap as InfluenceParallaxGapComponent } from './InfluenceParallaxGap';
import { InfluenceParallaxSkew as InfluenceParallaxSkewComponent } from './InfluenceParallaxSkew';
import { Panorama as PanoramaComponent } from './Panorama';
import { ParallaxStickers as ParallaxStickersComponent } from './ParallaxStickers';
import { Rtl as RtlComponent } from './Rtl';
import { SlickGap as SlickGapComponent } from './SlickGap';
import { Spiral as SpiralComponent } from './Spiral';
import { Stack3D as Stack3DComponent } from './Stack3D';
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

export const Glide: StoryFn = () => <GlideComponent />;

export const CardsStack: StoryFn = () => <CardsStackComponent />;

export const Spiral: StoryFn = () => <SpiralComponent />;

export const SlickGap: StoryFn = () => <SlickGapComponent />;

export const DynamicWidth: StoryFn = () => <DynamicWidthComponent />;

export const CreativeScale: StoryFn = () => <CreativeScaleComponent />;

export const CreativeSine: StoryFn = () => <CreativeSineComponent />;

export const Stack3D: StoryFn = () => <Stack3DComponent />;

export const InfluenceParallaxGap: StoryFn = () => (
  <InfluenceParallaxGapComponent />
);

export const InfluenceParallaxSkew: StoryFn = () => (
  <InfluenceParallaxSkewComponent />
);

export const ParallaxStickers: StoryFn = () => <ParallaxStickersComponent />;

export const Virtual: StoryFn = () => <VirtualComponent />;
