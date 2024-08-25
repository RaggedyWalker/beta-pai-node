// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nodeExternalsPlugin } = require('esbuild-node-externals');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('esbuild')
  .build({
    entryPoints: ['bin/www.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    platform: 'node',
    plugins: [
      nodeExternalsPlugin({
        dependencies: false
      })
    ],
    external: ['cors', 'kcors']
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
