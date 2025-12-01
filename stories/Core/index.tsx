import React, { FC, useCallback, useEffect, useState } from 'react';
import { pickObjectProps } from './pickObjectProps';
import { vevet } from '@/index';

export const Component: FC = () => {
  const [features, setFeatures] =
    useState<Record<string, boolean | number | string>>();

  const updateFeatures = useCallback(() => {
    const object = pickObjectProps(vevet, [
      'version',
      'prefix',
      'tablet',
      'phone',
      'mobile',
      'browserName',
      'inAppBrowser',
      'osName',
      'loaded',
      'lg',
      'md',
      'sm',
      'width',
      'height',
      'sHeight',
      'scrollbarWidth',
      'landscape',
      'portrait',
      'dpr',
      'lowerDpr',
      'vh',
      'svh',
      'vw',
      'rem',
    ]);

    setFeatures(object);
  }, []);

  useEffect(() => {
    updateFeatures();

    const viewportCallback = vevet.onResize('trigger', () => updateFeatures());

    return () => viewportCallback();
  }, [updateFeatures]);

  return (
    <div>
      <button type="button" onClick={updateFeatures}>
        Update features
      </button>

      {features &&
        Object.keys(features).map((key) => {
          const value = features[key];
          const stringValue = String(value);

          return (
            <div
              key={key}
              style={{ margin: '1rem 0' }}
            >{`${key}: ${stringValue}`}</div>
          );
        })}
    </div>
  );
};
