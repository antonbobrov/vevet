import React, { FC } from 'react';

export const Item: FC = () => (
  <div
    data-in-view-item
    data-in-view-class="viewed|viewed-reverse"
    style={{
      marginTop: 10,
      width: '100%',
      minWidth: 200,
      height: 200,
      background: '#ccc',
    }}
  />
);
