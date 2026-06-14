import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { ReactNode } from 'react';

import styles from './styles.module.css';

type Props = {
  id: string;
};

export default function DemoPenLink({ id }: Props): ReactNode {
  const href = useBaseUrl(`/pens/${id}/`);

  return (
    <div className={styles.footer}>
      <Link className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
        Open live demo ↗
      </Link>
    </div>
  );
}
