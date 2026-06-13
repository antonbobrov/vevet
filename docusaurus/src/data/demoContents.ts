import demoContentsJson from '../../data/demo-contents.json';

export type DemoContent = {
  id: string;
  url?: string;
  status?: number;
  body?: string;
  styles?: string;
  script?: string;
};

const demoContents = demoContentsJson as DemoContent[];

const demoContentsById = new Map(
  demoContents.map((item) => [item.id, item]),
);

export function findDemoContent(id: string): DemoContent | undefined {
  return demoContentsById.get(id);
}

export function hasDemoSnippet(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
