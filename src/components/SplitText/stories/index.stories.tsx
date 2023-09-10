import type { StoryObj, Meta } from '@storybook/react';
import { Component } from '.';

type TComponent = typeof Component;

const meta: Meta<TComponent> = {
  title: 'Components/SplitText',
  component: Component,
  args: {
    text: 'Lorem‐ipsum-dolor- sit - amet consectetur adipisicing elit. <br>Recusandae totam-<br /> ipsum unde -quaerat magni maiores voluptate quidem laboriosam repellendus libero dolore ut est perferendis dignissimos laborum, quis ad veniam?<br/>Incidunt?',
  },
};

export default meta;

export const Default: StoryObj<TComponent> = {};

export const WithLines: StoryObj<TComponent> = {
  args: {
    hasLines: true,
  },
};

export const WithoutLetter: StoryObj<TComponent> = {
  args: {
    hasLetters: false,
  },
};
