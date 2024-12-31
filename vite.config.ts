import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tsconfigPaths()],
    esbuild: {
        jsx: 'transform',
        jsxInject: `import { h } from '@/lib/jsx/jsx-runtime'`,
        jsxFactory: 'h',
    },
});
