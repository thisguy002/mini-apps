import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// Custom plugin to handle problematic universe-log package
function universeLogFix() {
  return {
    name: 'universe-log-fix',
    resolveId(id) {
      if (id.includes('universe-log')) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id.includes('universe-log')) {
        // Return empty module to avoid the problematic code
        return 'export default {};';
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react({
      jsxRuntime: 'classic'
    }),
    universeLogFix()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'features': path.resolve(__dirname, './src/features'),
      'services': path.resolve(__dirname, './src/services'),
      'helpers': path.resolve(__dirname, './src/helpers'),
      'interfaces': path.resolve(__dirname, './src/interfaces'),
      'assets': path.resolve(__dirname, './src/assets'),
    }
  },
  server: {
    port: 3000,
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  define: {
    'process.env': JSON.stringify(process.env)
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.woff', '**/*.woff2', '**/*.eot', '**/*.ttf', '**/*.otf'],
  optimizeDeps: {
    exclude: ['universe-log'],
    include: ['steem-content-renderer']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      strictRequires: false,
      defaultIsModuleExports: 'auto',
      tryToNameExports: true,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_NOT_DIRECT_DEPENDENCY') return;
        warn(warning);
      },
      output: {
        globals: {}
      }
    }
  }
});
