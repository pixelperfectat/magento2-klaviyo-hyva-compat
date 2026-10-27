# Klaviyo Hyvä Theme Compatibility

Hyvä Theme compatibility module for [Klaviyo_Reclaim](https://github.com/klaviyo/magento2-klaviyo)
(`klaviyo/magento2-extension`).

Klaviyo's storefront code relies on RequireJS, Knockout and jQuery, which Hyvä doesn't load. This
module replaces Klaviyo's three storefront templates with Alpine.js versions that work under Hyvä's
strict Content Security Policy. It is an independent rewrite and an alternative to Hyvä's own
`hyva-themes/magento2-klaviyo-reclaim` compatibility module (which is under Hyvä's licence), not a
derivative of it. Apart from Klaviyo's documented queue stub, the templates only use Klaviyo's public
JavaScript API.

## Requirements

| Package | Version |
|---|---|
| PHP | 8.2, 8.3 or 8.4 |
| Magento Open Source / Adobe Commerce | 2.4 with `magento/framework` 103.x |
| `hyva-themes/magento2-theme-module` | 1.3.11 or later (first release with `HyvaCsp`) |
| `hyva-themes/magento2-compat-module-fallback` | 1.x |
| `klaviyo/magento2-extension` | 4.4.x or 5.x |

## What it does

The templates are swapped in through `hyva-themes/magento2-compat-module-fallback`, so they only
apply while a Hyvä theme renders the page. They keep Klaviyo's block classes and layout.

| Klaviyo template | Replacement |
|---|---|
| `analytics/initialize.phtml` | Loads `klaviyo.js` once consent is given and identifies a logged-in customer from Magento's `customer` section (`klaviyo.identify()` with email, first and last name) |
| `product/viewed.phtml` | Pushes `Viewed Product` and `trackViewedItem` to `window._learnq` on product pages |
| `checkout/cart.phtml` | Sends Klaviyo's cart reload request (`reclaim/checkout/reload`) on the cart page. Klaviyo's endpoint only answers `{"success":1}`; the POST itself refreshes Magento's private content version |

Every inline script is registered with `HyvaCsp`, and the Alpine components use no inline
expressions.

## Installation

```bash
composer require pixelperfectat/magento2-klaviyo-hyva-compat
bin/magento module:enable PixelPerfect_KlaviyoHyvaCompat
bin/magento setup:upgrade
```

Don't install Hyvä's `hyva-themes/magento2-klaviyo-reclaim` at the same time: both override the same
Klaviyo templates.

## Configuration

The module has no settings of its own.

- Klaviyo is switched on and off with Klaviyo's own setting, and the public API key comes from
  **Stores > Configuration > Klaviyo > General**. With the extension disabled the templates render
  nothing; without a public key `klaviyo.js` isn't loaded and no customer is identified.
- Consent follows Magento's cookie restriction mode (**Stores > Configuration > General > Web >
  Default Cookie Settings > Cookie Restriction Mode**):
  - **No:** Klaviyo loads on every page.
  - **Yes:** Klaviyo loads only after the visitor has accepted cookies, i.e. when the
    `user_allowed_save_cookie` cookie allows the current website. If the cookie notice dispatches
    Hyvä's `user-allowed-save-cookie` event, Klaviyo starts on the same page; otherwise on the next
    page load.

## Consent contract

A consent manager can take over the consent decision. This is the module's integration point:

- **`window.klaviyoConsentGranted()`**: a function that returns `true` when Klaviyo may run. The
  templates only define their default (the cookie restriction check above) if the function doesn't
  exist yet. Define yours **before** the Klaviyo templates render, e.g. in `head.additional`.
  The templates call it before loading `klaviyo.js`, before `klaviyo.identify()`, before pushing
  product views and before the cart request.
- **`cookie-consent-updated`** (window event): dispatch it when consent changes. The templates call
  `window.klaviyoConsentGranted()` again and catch up on what they held back. `initialize.phtml`
  also listens for Hyvä's `user-allowed-save-cookie` event.

## Known limitations

- **Luma checkout fallback:** when the checkout is rendered with a Luma theme (for example by
  `hyva-themes/magento2-luma-checkout`), the page is not a Hyvä page. Klaviyo's original templates
  and JavaScript run there, including the checkout email capture, and this module's consent check
  does not apply to them.
- **Checkout features on Hyvä:** Klaviyo's checkout email capture
  (`Klaviyo_Reclaim/js/view/checkout/email`) and the SMS/WhatsApp consent fields of Klaviyo 5 are
  Knockout components of the Luma checkout. They are not ported.
- **Checkout page:** Klaviyo adds its initialize block twice on `checkout_index_index`
  (`klaviyo.initialize` and `klaviyo_reclaim.checkout.initialize`). On a Hyvä-rendered checkout both
  use this module's template, so the identify component renders twice. `klaviyo.js` loads once.
- **Withdrawing consent** doesn't unload a `klaviyo.js` that is already running; that takes a page
  load.
- The product view and cart templates react to the first `cookie-consent-updated` event only. If that
  event doesn't grant consent, they wait for the next page.

## Uninstall

```bash
bin/magento module:disable PixelPerfect_KlaviyoHyvaCompat
composer remove pixelperfectat/magento2-klaviyo-hyva-compat
bin/magento setup:upgrade
```

The module has no database tables or configuration values to clean up. Remove any package that
requires this one first (`composer why pixelperfectat/magento2-klaviyo-hyva-compat` lists them).

## Development

The checks run in Docker with the repository mounted at `/app`:

```bash
composer install
composer check          # validate, lint, phpcs, phpstan, phpunit, infection
composer ci:normalize   # composer.json normalisation (dry run)
```

The PHP tests cover the `KlaviyoTracking` view model. The JavaScript in the templates is covered by
the Playwright suite in `tests/playwright`, which needs a running Magento store with Hyvä, Klaviyo
and Luma sample data. It isn't part of CI:

```bash
cd tests/playwright
npm ci
npx playwright install chromium
MAGENTO_BASE_URL=https://shop.example.test npm test
```

Optional variables: `TEST_PRODUCT_URL`, `TEST_CUSTOMER_EMAIL`, `TEST_CUSTOMER_PASSWORD`.

## License

[MIT](LICENSE)
