import * as esbuild from 'esbuild';
import { removeImportType } from 'esbuild-plugin-remove-import-type';

await esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './dist/out.js',
  plugins: [removeImportType()],
});
