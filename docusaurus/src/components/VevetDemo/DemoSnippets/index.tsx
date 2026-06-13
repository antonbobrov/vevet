import type { ReactNode } from 'react';

import CodeSpoiler from '../CodeSpoiler';
import type { TDemoSnippet } from '../types';

import styles from './styles.module.css';

type Props = {
  snippets: TDemoSnippet[];
};

export default function DemoSnippets({ snippets }: Props): ReactNode {
  if (snippets.length === 0) {
    return null;
  }

  return (
    <div className={styles.snippets}>
      {snippets.map((snippet) => (
        <CodeSpoiler
          key={snippet.label}
          label={snippet.label}
          language={snippet.language}
          code={snippet.code}
        />
      ))}
    </div>
  );
}
