<?php

declare(strict_types=1);

namespace PixelPerfect\KlaviyoHyvaCompat\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Store\Model\ScopeInterface;

/**
 * Server-side values the Klaviyo templates need and the browser cannot know on its own.
 */
class KlaviyoTracking implements ArgumentInterface
{
    private const XML_PATH_COOKIE_RESTRICTION = 'web/cookie/cookie_restriction';
    private const SDK_URL_PATTERN = 'https://static.klaviyo.com/onsite/js/%s/klaviyo.js';

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig
    ) {
    }

    /**
     * Whether Magento's cookie restriction mode is on for the current store.
     *
     * With restriction mode on, a missing user_allowed_save_cookie cookie means the visitor has
     * not agreed yet. With it off, the cookie never exists. Only the server can tell the two apart.
     */
    public function isCookieRestrictionEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(self::XML_PATH_COOKIE_RESTRICTION, ScopeInterface::SCOPE_STORE);
    }

    /**
     * URL of Klaviyo's onsite SDK for a public API key, with the key URL-encoded as a path segment.
     */
    public function getSdkUrl(string $publicApiKey): string
    {
        return sprintf(self::SDK_URL_PATTERN, rawurlencode($publicApiKey));
    }
}
