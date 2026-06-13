import {
  findDemoContent,
  hasDemoSnippet,
  type DemoContent,
} from '../../data/demoContents';

import type { TDemoSnippet } from './types';

export function getDemoContent(id: string): DemoContent | undefined {
  return findDemoContent(id);
}

export function getDemoSnippets(content?: DemoContent): TDemoSnippet[] {
  if (!content) {
    return [];
  }

  return [
    hasDemoSnippet(content.body)
      ? { label: 'HTML', language: 'html', code: content.body }
      : null,
    hasDemoSnippet(content.styles)
      ? { label: 'CSS', language: 'css', code: content.styles }
      : null,
    hasDemoSnippet(content.script)
      ? { label: 'JavaScript', language: 'javascript', code: content.script }
      : null,
  ].filter((item): item is TDemoSnippet => item !== null);
}
