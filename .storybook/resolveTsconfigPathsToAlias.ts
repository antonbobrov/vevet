import path from 'path';
import tsConfig from '../tsconfig.json';

const { paths } = tsConfig.compilerOptions;

export function resolveTsconfigPathsToAlias() {
  const aliases: Record<string, string> = {};

  Object.keys(paths).forEach((keyProp) => {
    const key = keyProp as keyof typeof paths;

    const alias = key.replace('/*', '');
    const tsPaths = paths[key];
    const value = path.resolve(tsPaths[0].replace('/*', '').replace('*', ''));

    aliases[alias] = value;
  });

  return aliases;
}
