import type { ReactNode } from 'react';

import DemoIframe from './DemoIframe';
import DemoMissingNotice from './DemoMissingNotice';
import DemoSnippets from './DemoSnippets';
import type { VevetDemoProps } from './types';
import { getDemoContent, getDemoSnippets } from './utils';

import styles from './styles.module.css';

export default function VevetDemo({
  id,
  height = 500,
}: VevetDemoProps): ReactNode {
  const content = getDemoContent(id);
  const snippets = getDemoSnippets(content);

  return (
    <div className={styles.root}>
      <DemoIframe id={id} height={height} />

      <DemoSnippets snippets={snippets} />

      {!content ? <DemoMissingNotice id={id} /> : null}
    </div>
  );
}
