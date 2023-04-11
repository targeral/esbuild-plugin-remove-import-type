import qs from 'querystring';
import fs from 'fs/promises';
import { Plugin } from 'esbuild';
import { Compiler } from '@modern-js/swc-plugins';

export type Query = Record<string, string | boolean>;

interface ResolveResult {
  originalFilePath: string;
  rawQuery?: string;
  query: Query;
}

export const resolvePathAndQuery = (originalPath: string): ResolveResult => {
  const [filePath, queryStr] = originalPath.split('?');
  const query = qs.parse(queryStr ?? '') as Query;

  for (const key of Object.keys(query)) {
    if (query[key] === '') {
      query[key] = true;
    }
  }

  return {
    query,
    rawQuery: queryStr,
    originalFilePath: filePath,
  };
};

export function isTransformExt(path: string) {
  return /\.(m|c)?(j|t)sx?(\?.*)?$/.test(path);
}

export const removeImportType = (): Plugin => ({
  name: 'remove-import-type',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async args => {
      const { originalFilePath } = resolvePathAndQuery(args.path);

      if (isTransformExt(originalFilePath)) {
        const enableTsx = /\.tsx$/i.test(originalFilePath);
        const swcCompiler = new Compiler({
          filename: originalFilePath,
          sourceMaps: Boolean(build.initialOptions.sourcemap),
          inputSourceMap: false,
          swcrc: false,
          configFile: false,
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: enableTsx,
              decorators: true,
            },
            target: 'es2022',
          },
          isModule: 'unknown',
          extensions: {},
          module: {
            type: 'es6',
          },
        });
        const code = await fs.readFile(args.path, 'utf8');
        const result = await swcCompiler.transform(originalFilePath, code);
        return {
          contents: result.code,
        };
      }
      return undefined;
    });
  },
});
