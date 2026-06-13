export type TDemoSnippet = {
  label: string;
  language: 'html' | 'css' | 'javascript';
  code: string;
};

export type VevetDemoProps = {
  id: string;
  height?: number;
};
