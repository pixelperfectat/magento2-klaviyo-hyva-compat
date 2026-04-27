import { test } from '@playwright/test';
import { assertNoLumaJs, assertNoCspViolations, addProductToCart } from '../fixtures/helpers';

test.describe('No Luma JS Pollution + CSP Compliance', () => {
    test('homepage has no Luma JS from Klaviyo', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(2000);
        await assertNoLumaJs(page);
        await assertNoCspViolations(page);
    });

    test('product page has no Luma JS from Klaviyo', async ({ page }) => {
        const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';
        await page.goto(productUrl);
        await page.waitForTimeout(2000);
        await assertNoLumaJs(page);
        await assertNoCspViolations(page);
    });

    test('cart page has no Luma JS from Klaviyo', async ({ page }) => {
        const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';
        await addProductToCart(page, productUrl);
        await page.goto('/checkout/cart');
        await page.waitForTimeout(2000);
        await assertNoLumaJs(page);
        await assertNoCspViolations(page);
    });
});
