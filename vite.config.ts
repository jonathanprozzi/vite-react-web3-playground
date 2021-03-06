import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default {
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      // process and buffer are excluded because already managed
      // by node-globals-polyfill
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      sys: 'util',
      // events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      url: 'rollup-plugin-node-polyfills/polyfills/url',
      // string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      http: 'rollup-plugin-node-polyfills/polyfills/http',
      https: 'rollup-plugin-node-polyfills/polyfills/http',
      os: 'rollup-plugin-node-polyfills/polyfills/os',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      // _stream_duplex:
      //   'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      // _stream_passthrough:
      //   'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      // _stream_readable:
      //   'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      // _stream_writable:
      //   'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      // _stream_transform:
      //   'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      console: 'rollup-plugin-node-polyfills/polyfills/console',
      vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      domain: 'rollup-plugin-node-polyfills/polyfills/domain',
      lib: resolve(__dirname, 'src/lib'),
      routes: resolve(__dirname, 'src/routes'),
      '~~': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
};

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     tsconfigPaths(),
//     NodeModulesPolyfills,
//     GlobalsPolyfills({
//       process: true,
//       buffer: true,
//       define: { 'process.env': 'override' },
//     }),
//   ],

//   define: {
//     'process.env': {},
//     global: 'globalThis',
//   },
//   resolve: {
//     alias: {
//       stream: 'stream-browserify',
//       zlib: 'browserify-zlib',
//       util: 'util',
//       web3: resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
//       process: 'process-es6',
//       url: 'url-polyfill',
//       http: 'http-browserify',
//       https: 'http-browserify',
//       lib: resolve(__dirname, 'src/lib'),
//       routes: resolve(__dirname, 'src/routes'),
//       '~~': resolve(__dirname, 'src'),
//     },
//   },
//   build: {
//     commonjsOptions: {
//       transformMixedEsModules: true,
//     },
//   },
// });
