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

export async function goToCheckout(page: Page): Promise<void> {
    await page.goto('/checkout');
    await page.waitForSelector('[x-data]', { timeout: 10000 });
}

export async function assertNoLumaJs(page: Page): Promise<void> {
    const lumaErrors = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        const hasRequireJs = scripts.some(s => s.src.includes('requirejs') || s.textContent?.includes('require('));
        const hasMagentoInit = !!document.querySelector('script[type="text/x-magento-init"]');
        const hasKlaviyoLumaInit = scripts.some(s =>
            s.textContent?.includes('KlaviyoCustomerData') ||
            s.textContent?.includes('Klaviyo_Reclaim/js/')
        );
        return { hasRequireJs, hasMagentoInit, hasKlaviyoLumaInit };
    });

    expect(lumaErrors.hasRequireJs).toBe(false);
    expect(lumaErrors.hasMagentoInit).toBe(false);
    expect(lumaErrors.hasKlaviyoLumaInit).toBe(false);
}

export async function assertNoCspViolations(page: Page): Promise<void> {
    const cspErrors: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
            cspErrors.push(msg.text());
        }
    });
    await page.waitForTimeout(1000);
    expect(cspErrors).toHaveLength(0);
}
