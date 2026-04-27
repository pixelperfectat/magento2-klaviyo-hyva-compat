import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60000,
    retries: 1,
    use: {
        baseURL: process.env.MAGENTO_BASE_URL || 'https://example.test',
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
    },
});
