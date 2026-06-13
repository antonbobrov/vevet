import type { ReactNode } from 'react';

import styles from './styles.module.css';

type Props = {
  id: string;
};

export default function DemoMissingNotice({ id }: Props): ReactNode {
  return (
    <p className={styles.notice}>
      Demo content for <code>{id}</code> is not available.
    </p>
  );
}
