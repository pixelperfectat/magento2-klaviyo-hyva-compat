import { test, expect } from '@playwright/test';
import { login, assertNoLumaJs, assertNoCspViolations } from '../fixtures/helpers';

test.describe('Klaviyo Customer Identification', () => {
    test('identifies logged-in customer via klaviyo.identify()', async ({ page }) => {
        const testEmail = process.env.TEST_CUSTOMER_EMAIL || 'roni_cost@example.com';
        const testPassword = process.env.TEST_CUSTOMER_PASSWORD || 'roni_cost3@example.com';

        await login(page, testEmail, testPassword);
        await page.goto('/');

        await page.waitForFunction(() => typeof window.klaviyo !== 'undefined', null, { timeout: 15000 });

        const isIdentified = await page.evaluate(async () => {
            return window.klaviyo.isIdentified();
        });

        expect(isIdentified).toBe(true);
        await assertNoLumaJs(page);
        await assertNoCspViolations(page);
    });
});
