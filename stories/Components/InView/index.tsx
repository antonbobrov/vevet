import React, { FC, useState } from 'react';

import { MUTABLE_PROPS, STATIC_PROPS } from '@/components/InView/props';
import {
  IInViewCallbacksMap,
  IInViewMutableProps,
  IInViewStaticProps,
  InView,
} from '@/index';

import { useLogEvents } from '../../global/useLogEvents';
import { useOnMutableProps } from '../../global/useOnMutableProps';
import { useOnProps } from '../../global/useOnProps';

import { Item } from './Item';

type TProps = Omit<
  IInViewStaticProps & IInViewMutableProps,
  '__mutableProp' | '__staticProp'
> & {
  isRtl: boolean;
};

const LOG_EVENTS: Record<keyof IInViewCallbacksMap, boolean> = {
  destroy: true,
  props: true,
  in: true,
  out: true,
};

export const Component: FC<TProps> = ({ isRtl, ...props }) => {
  const [instance, setInstance] = useState<InView>();

  useLogEvents(instance, LOG_EVENTS);

  useOnProps(props, STATIC_PROPS, (input: TProps) => {
    if (isRtl) {
      document.documentElement.dir = 'rtl';
    }

    const mod = new InView({
      ...input,
      onIn: ({ element }) => {
        if (element instanceof HTMLElement) {
          element.style.background = '#f00';
        }
      },
      onOut: ({ element }) => {
        if (element instanceof HTMLElement) {
          element.style.background = '#000';
        }
      },
    });

    setInstance(mod);

    const elements = document.querySelectorAll('[data-in-view-item]');
    elements.forEach((element) => mod.addElement(element));

    return () => {
      mod.destroy();
      setInstance(undefined);

      document.documentElement.dir = 'ltr';
    };
  });

  useOnMutableProps(instance, props, MUTABLE_PROPS);

  return (
    <>
      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />

      <Item />
    </>
  );
};
