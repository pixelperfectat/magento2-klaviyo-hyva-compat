import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/customer/account/login');
    await page.fill('#email', email);
    await page.fill('#pass', password);
    await page.click('#send2');
    await page.waitForURL('**/customer/account/');
}

export async function addProductToCart(page: Page, productUrl: string): Promise<void> {
    await page.goto(productUrl);
    await page.click('#product-addtocart-button');
    await page.waitForSelector('.message-success, [data-ui-id="message-success"]', { timeout: 10000 });
}

/**
 * Fails if Klaviyo's Luma (RequireJS/Knockout) integration is on the page.
 * Only Klaviyo markers are checked, so unrelated third-party scripts don't break the test.
 */
export async function assertNoKlaviyoLumaJs(page: Page): Promise<void> {
    const markers = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return {
            klaviyoMagentoInit: scripts.some(s =>
                s.type === 'text/x-magento-init' && (s.textContent ?? '').includes('KlaviyoCustomerData')
            ),
            klaviyoRequireJsModule: scripts.some(s =>
                s.src.includes('Klaviyo_Reclaim/js/') || (s.textContent ?? '').includes('Klaviyo_Reclaim/js/')
            ),
        };
    });

    expect(markers.klaviyoMagentoInit).toBe(false);
    expect(markers.klaviyoRequireJsModule).toBe(false);
}

/**
 * Starts collecting Content-Security-Policy violations. Call it before page.goto() so that
 * violations raised while the page loads are caught too.
 */
export function collectCspViolations(page: Page): string[] {
    const violations: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
            violations.push(msg.text());
        }
    });
    return violations;
}
