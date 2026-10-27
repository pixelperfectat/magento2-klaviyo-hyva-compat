import { test, expect } from '@playwright/test';
import { assertNoKlaviyoLumaJs, collectCspViolations } from '../fixtures/helpers';

test.describe('Klaviyo Product View Tracking', () => {
    test('pushes Viewed Product and trackViewedItem to _learnq on a product page', async ({ page }) => {
        const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';

        // viewed.phtml pushes to window._learnq. Record every push before klaviyo.js can take
        // the queue over.
        await page.addInitScript(() => {
            const calls: unknown[] = [];
            const queue: unknown[] = [];
            const originalPush = queue.push;
            queue.push = function (...items: unknown[]) {
                calls.push(...items);
                return originalPush.apply(this, items);
            };
            (window as any).__klaviyoPushCalls = calls;
            (window as any)._learnq = queue;
        });

        const cspViolations = collectCspViolations(page);
        await page.goto(productUrl);
        await page.waitForFunction(
            () => (window as any).__klaviyoPushCalls.some((call: unknown[]) => call[0] === 'trackViewedItem'),
            null,
            { timeout: 15000 }
        );

        const pushCalls = await page.evaluate(() => (window as any).__klaviyoPushCalls);
        const viewedProduct = pushCalls.find((call: any[]) =>
            Array.isArray(call) && call[0] === 'track' && call[1] === 'Viewed Product'
        );
        const viewedItem = pushCalls.find((call: any[]) =>
            Array.isArray(call) && call[0] === 'trackViewedItem'
        );

        expect(viewedProduct).toBeDefined();
        expect(viewedItem).toBeDefined();
        expect(viewedProduct[2]).toHaveProperty('ProductName');
        expect(viewedProduct[2]).toHaveProperty('ProductID');

        await assertNoKlaviyoLumaJs(page);
        expect(cspViolations).toHaveLength(0);
    });
});
