import React, { FC, useState } from 'react';
import { Inner } from './Inner';

interface IProps {
  direction: 'x' | 'y';
}

export const InElement: FC<IProps> = ({ direction }) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  return (
    <div
      ref={setRoot}
      style={{
        display: 'flex',
        flexDirection: direction === 'x' ? 'row' : 'column',
        width: direction === 'x' ? 'calc(var(--unit) * 100)' : '100%',
        height: direction === 'x' ? '100%' : 'calc(var(--unit) * 100)',
        overflow: 'auto',
        margin: '100px auto',
        // @ts-ignore
        '--unit': '3px',
      }}
    >
      <Inner direction={direction} root={root} />
    </div>
  );
};
