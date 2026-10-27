# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Support PHP 8.2, 8.3 and 8.4 (`~8.2.0 || ~8.3.0 || ~8.4.0`); the code has no 8.3-only syntax.
- Allow `klaviyo/magento2-extension` 5.x (`^4.4 || ^5.0`). The Klaviyo frontend code these templates replace is identical in 4.4.4 and 5.2.0.
- Require `hyva-themes/magento2-theme-module ^1.3.11`, the first release with the `HyvaCsp` view model the templates use. Older Hyvä versions failed on these templates.

## [0.2.0] - 2026-07-06

### Added
- MIT license file.
- PixelPerfect coding standard, PHPStan, PHPUnit and the GitHub CI workflow.
- Renovate configuration.

### Changed
- Require PHP `^8.3`, `magento/framework ^103.0`, `hyva-themes/magento2-compat-module-fallback ^1.0`
  and `klaviyo/magento2-extension ^4.0` instead of open constraints.

## [0.1.0] - 2026-05-06

### Added
- Hyvä/Alpine.js templates for Klaviyo_Reclaim's customer identification, product view tracking
  and cart reload, registered through `hyva-themes/magento2-compat-module-fallback`.

### Fixed
- Viewed Product events were not sent on product pages.
- Race between Alpine initialisation and component registration in the cart and viewed-product templates.

[Unreleased]: https://github.com/pixelperfectat/magento2-klaviyo-hyva-compat/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/pixelperfectat/magento2-klaviyo-hyva-compat/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/pixelperfectat/magento2-klaviyo-hyva-compat/releases/tag/v0.1.0
