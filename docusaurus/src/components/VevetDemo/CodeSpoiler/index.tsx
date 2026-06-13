import type { ReactNode } from 'react';

import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

type Props = {
  label: string;
  language: 'html' | 'css' | 'javascript';
  code: string;
};

export default function CodeSpoiler({
  label,
  language,
  code,
}: Props): ReactNode {
  return (
    <details className={styles.spoiler}>
      <summary className={styles.summary}>{label}</summary>
      <div className={styles.code}>
        <CodeBlock language={language} className={styles.codeBlock}>
          {code}
        </CodeBlock>
      </div>
    </details>
  );
}
