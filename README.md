# Klaviyo Hyva Theme Compatibility

Hyva Theme compatibility module for [Klaviyo_Reclaim](https://github.com/klaviyo/magento2-klaviyo) (klaviyo/magento2-extension).

Based on [hyva-themes/magento2-klaviyo-reclaim](https://gitlab.hyva.io/hyva-themes/hyva-compat/magento2-klaviyo-reclaim) — rewritten with CSP strict compatibility under the PixelPerfect namespace.

## Requirements

- Magento 2.4+
- Hyva Theme
- hyva-themes/magento2-compat-module-fallback
- klaviyo/magento2-extension ^4.0

## Features

- Customer identification via Alpine.js (replaces RequireJS customer-data)
- Product view tracking (Viewed Product + trackViewedItem events)
- Cart reload tracking (replaces jQuery AJAX with fetch API)
- CSP strict compatible (HyvaCsp ViewModel pattern)
