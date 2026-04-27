import { test, expect } from '@playwright/test';
import { addProductToCart } from '../fixtures/helpers';

test.describe('Klaviyo Cart Tracking', () => {
    test('fires cart reload request on cart page', async ({ page }) => {
        const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';

        await addProductToCart(page, productUrl);

        const reloadPromise = page.waitForResponse(
            response => response.url().includes('/reclaim/checkout/reload') && response.status() === 200,
            { timeout: 15000 }
        );

        await page.goto('/checkout/cart');

        const response = await reloadPromise;
        expect(response.status()).toBe(200);
    });
});
