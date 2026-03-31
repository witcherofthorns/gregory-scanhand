import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: node({
        mode: 'standalone'
    }),
    env: {
        schema: {
            SKANHAND_OPENAI_API_KEY: envField.string({
                context: 'server',
                access: 'secret',
            }),
        },
    },
});