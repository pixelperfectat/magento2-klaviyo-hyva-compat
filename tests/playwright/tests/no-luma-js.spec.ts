import { test, expect } from '@playwright/test';
import { assertNoKlaviyoLumaJs, collectCspViolations, addProductToCart } from '../fixtures/helpers';

const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';

test.describe('No Klaviyo Luma JS + CSP compliance', () => {
    test('homepage', async ({ page }) => {
        const cspViolations = collectCspViolations(page);
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await assertNoKlaviyoLumaJs(page);
        expect(cspViolations).toHaveLength(0);
    });

    test('product page', async ({ page }) => {
        const cspViolations = collectCspViolations(page);
        await page.goto(productUrl);
        await page.waitForLoadState('networkidle');
        await assertNoKlaviyoLumaJs(page);
        expect(cspViolations).toHaveLength(0);
    });

    test('cart page', async ({ page }) => {
        await addProductToCart(page, productUrl);
        const cspViolations = collectCspViolations(page);
        await page.goto('/checkout/cart');
        await page.waitForLoadState('networkidle');
        await assertNoKlaviyoLumaJs(page);
        expect(cspViolations).toHaveLength(0);
    });
});
