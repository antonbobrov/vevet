import React, { FC, useEffect, useState } from 'react';
import { vevet } from '@/src/vevet';

export const Component: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onLoad = vevet.pageLoad.onLoad(() => {
      setIsLoaded(true);
    });

    return () => onLoad?.remove();
  }, []);

  return <div>isLoaded: {String(isLoaded)}</div>;
};
