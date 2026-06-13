import type { ReactNode } from 'react';

import styles from './styles.module.css';

type Props = {
  id: string;
  height?: number;
};

export default function DemoIframe({ id, height = 500 }: Props): ReactNode {
  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        height={height}
        scrolling="no"
        title={`Vevet Demo ${id}`}
        src={`https://codepen.io/anton-bobrov/embed/${id}?default-tab=result`}
        loading="lazy"
        allowTransparency
        allowFullScreen
      />
    </div>
  );
}
