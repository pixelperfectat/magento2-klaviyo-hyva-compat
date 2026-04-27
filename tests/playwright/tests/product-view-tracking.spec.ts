import { test, expect } from '@playwright/test';
import { assertNoLumaJs, assertNoCspViolations } from '../fixtures/helpers';

test.describe('Klaviyo Product View Tracking', () => {
    test('fires Viewed Product event on product page', async ({ page }) => {
        const productUrl = process.env.TEST_PRODUCT_URL || '/fusion-backpack.html';

        await page.addInitScript(() => {
            window.__klaviyoPushCalls = [];
            const origPush = Array.prototype.push;
            Object.defineProperty(window, '_klOnsite', {
                set(val) {
                    this.__klOnsiteInternal = val;
                },
                get() {
                    if (!this.__klOnsiteProxy) {
                        this.__klOnsiteInternal = this.__klOnsiteInternal || [];
                        this.__klOnsiteProxy = new Proxy(this.__klOnsiteInternal, {
                            get(target, prop) {
                                if (prop === 'push') {
                                    return (...args: any[]) => {
                                        window.__klaviyoPushCalls.push(...args);
                                        return origPush.apply(target, args);
                                    };
                                }
                                return target[prop as any];
                            }
                        });
                    }
                    return this.__klOnsiteProxy;
                }
            });
        });

        await page.goto(productUrl);
        await page.waitForTimeout(3000);

        const pushCalls = await page.evaluate(() => window.__klaviyoPushCalls);
        const viewedProduct = pushCalls.find((call: any[]) =>
            Array.isArray(call) && call[0] === 'track' && call[1] === 'Viewed Product'
        );
        const viewedItem = pushCalls.find((call: any[]) =>
            Array.isArray(call) && call[0] === 'trackViewedItem'
        );

        expect(viewedProduct).toBeDefined();
        expect(viewedItem).toBeDefined();

        if (viewedProduct) {
            const productData = viewedProduct[2];
            expect(productData).toHaveProperty('ProductName');
            expect(productData).toHaveProperty('ProductID');
        }

        await assertNoLumaJs(page);
        await assertNoCspViolations(page);
    });
});
