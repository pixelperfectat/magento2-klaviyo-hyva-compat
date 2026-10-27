import { test, expect } from '@playwright/test';
import { login, assertNoKlaviyoLumaJs, collectCspViolations } from '../fixtures/helpers';

test.describe('Klaviyo Customer Identification', () => {
    test('identifies logged-in customer via klaviyo.identify()', async ({ page }) => {
        // Defaults are the Luma sample-data customer.
        const testEmail = process.env.TEST_CUSTOMER_EMAIL || 'roni_cost@example.com';
        const testPassword = process.env.TEST_CUSTOMER_PASSWORD || 'roni_cost3@example.com';

        await login(page, testEmail, testPassword);
        const cspViolations = collectCspViolations(page);
        await page.goto('/');

        await page.waitForFunction(() => typeof window.klaviyo?.isIdentified === 'function', null, { timeout: 15000 });

        const isIdentified = await page.evaluate(async () => window.klaviyo.isIdentified());

        expect(isIdentified).toBe(true);
        await assertNoKlaviyoLumaJs(page);
        expect(cspViolations).toHaveLength(0);
    });
});
