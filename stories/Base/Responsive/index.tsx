import React, { FC, useEffect } from 'react';

import { Responsive } from '@/index';

export const Component: FC = () => {
  useEffect(() => {
    const instance = new Responsive(
      {
        width: 'any',
        height: 'will_not_change',
        count: 1,
        device: 'any',
        orientation: 'any',
      },
      [
        {
          at: 'tablet',
          props: {
            device: 'tablet',
          },
        },
        {
          at: 'phone',
          props: {
            device: 'phone',
          },
        },
        {
          at: 'mobile',
          props: {
            device: 'mobile',
          },
        },
        {
          at: 'non_mobile',
          props: {
            device: 'non_mobile',
          },
        },
        {
          at: '@media (max-width: 767px)',
          props: {
            width: 'sm',
          },
        },
        {
          at: '@media (min-width: 768px)',
          props: {
            width: 'md',
          },
        },
        {
          at: '@media (min-width: 1200px)',
          props: {
            width: 'lg',
          },
        },
        {
          at: 'landscape',
          props: {
            orientation: 'landscape',
          },
        },
        {
          at: 'portrait',
          props: {
            orientation: 'portrait',
          },
        },
      ],
      (props) => {
        console.log(props);
      },
    );

    return () => instance.destroy();
  }, []);

  return <p>Open the console to see the output</p>;
};
