# esbuild-plugin-remove-import-type

remove import-type in third party dependencies

## Install

``` bash
## npm
npm i -D esbuild-plugin-remove-import-type

## pnpm
pnpm -i -D esbuild-plugin-remove-import-type

## yarn
yarn add -D esbuild-plugin-remove-import-type
```

## Usage

``` js
const esbuild = require('esbuild')
const { removeImportType } = require('esbuild-plugin-remove-import-type')

esbuild.build({
  entryPoints: ['lib/index.js'],
  outdir: 'dist',
  bundle: true,
  plugins: [removeImportType()]
});
```

## Examples

``` bash
cd examples && pnpm i

pnpm build
```
