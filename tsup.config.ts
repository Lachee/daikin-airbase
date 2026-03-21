// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'], // Support both ES modules and CommonJS
    dts: true, // Generate declaration files
    clean: true
});