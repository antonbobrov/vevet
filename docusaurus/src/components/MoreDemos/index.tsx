import Link from '@docusaurus/Link';
import type { ReactNode } from 'react';

import styles from './styles.module.css';

type MoreDemosLink = {
  label: string;
  to: string;
};

type MoreDemosProps = {
  /** Single demos page. Defaults to `./demos`. Ignored when `links` is set. */
  to?: string;
  /** Multiple demo pages (e.g. Snap basic / advanced / parallax). */
  links?: MoreDemosLink[];
};

export default function MoreDemos({
  to = './demos',
  links,
}: MoreDemosProps): ReactNode {
  if (links?.length) {
    return (
      <nav className={styles.nav} aria-label="More demos">
        <p className={styles.eyebrow}>More demos</p>
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.to}>
              <Link className={styles.card} to={link.to}>
                <span className={styles.label}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <Link className={styles.card} to={to}>
      <span className={styles.copy}>
        <span className={styles.eyebrow}>More demos</span>
        <span className={styles.label}>Explore all examples</span>
      </span>
    </Link>
  );
}
