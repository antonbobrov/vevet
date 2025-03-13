import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Test as TestComponent } from './Test';
import { Carousel as CarouselComponent } from './Carousel';
import { Fade as FadeComponent } from './Fade';
import { Cards as CardsComponent } from './Cards';
import { Panorama as PanoramaComponent } from './Panorama';
import { Glide as GlideComponent } from './Glide';
import { CardsStack as CardsStackComponent } from './CardsStack';
import { Spiral as SpiralComponent } from './Spiral';
import { SlickGap as SlickGapComponent } from './SlickGap';
import { Virtual as VirtualComponent } from './Virtual';
import { DynamicWidth as DynamicWidthComponent } from './DynamicWidth';

const meta: Meta = {
  title: 'Components/Snap',
};

export default meta;

export const Test: StoryFn = () => <TestComponent />;

export const Fade: StoryFn = () => <FadeComponent />;

export const Carousel: StoryFn = () => <CarouselComponent />;

export const Cards: StoryFn = () => <CardsComponent />;

export const Panorama: StoryFn = () => <PanoramaComponent />;

export const Glide: StoryFn = () => <GlideComponent />;

export const CardsStack: StoryFn = () => <CardsStackComponent />;

export const Spiral: StoryFn = () => <SpiralComponent />;

export const SlickGap: StoryFn = () => <SlickGapComponent />;

export const DynamicWidth: StoryFn = () => <DynamicWidthComponent />;

export const Virtual: StoryFn = () => <VirtualComponent />;
