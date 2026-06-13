import React, { FC, ReactNode } from 'react';

type TProps = {
  children: ReactNode;
};

export const StoryWrapper: FC<TProps> = ({ children }) => (
  <div className="vevet-story">
    <style>
      {`
        body {
          margin: 0 !important;
          padding: 0 !important;
        }

        .vevet-story {
          box-sizing: border-box;
          min-height: 100vh;
          padding: 240px 16px 240px;
          overflow: hidden;
        }

        .vevet-story *,
        .vevet-story *::before,
        .vevet-story *::after {
          box-sizing: border-box;
        }
      `}
    </style>

    {children}
  </div>
);
