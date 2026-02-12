import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.mainScreen}>
      <h1 className={styles.title}>vevet.js</h1>

      <p className={styles.subtitle}>{siteConfig.tagline}</p>

      <div className={styles.buttons}>
        <Link className={styles.button} to="/docs/intro">
          Documentation
        </Link>

        <Link
          className={clsx(styles.button, styles.button_outline)}
          to="https://codepen.io/collection/RPNmJz"
        >
          Demos
        </Link>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`JavaScript library for creative development`}
      description="Vevet is a flexible, client-side JavaScript library for creative web development. The primary goal of Vevet is to simplify the creation of interactive components from scratch — be it text animations, carousels, or other interactive elements."
    >
      <HomepageHeader />
    </Layout>
  );
}
