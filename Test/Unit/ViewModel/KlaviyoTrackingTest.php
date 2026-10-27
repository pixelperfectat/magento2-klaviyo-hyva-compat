<?php

declare(strict_types=1);

namespace PixelPerfect\KlaviyoHyvaCompat\Test\Unit\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\UrlInterface;
use Magento\Store\Model\ScopeInterface;
use PHPUnit\Framework\TestCase;
use PixelPerfect\KlaviyoHyvaCompat\ViewModel\KlaviyoTracking;

class KlaviyoTrackingTest extends TestCase
{
    /**
     * @dataProvider restrictionFlagProvider
     */
    public function testCookieRestrictionFollowsTheStoreScopedConfigFlag(bool $flag): void
    {
        $scopeConfig = $this->createMock(ScopeConfigInterface::class);
        $scopeConfig->expects(self::once())
            ->method('isSetFlag')
            ->with('web/cookie/cookie_restriction', ScopeInterface::SCOPE_STORE)
            ->willReturn($flag);

        self::assertSame($flag, (new KlaviyoTracking($scopeConfig, $this->createMock(UrlInterface::class)))->isCookieRestrictionEnabled());
    }

    /**
     * @return array<string, array{bool}>
     */
    public static function restrictionFlagProvider(): array
    {
        return [
            'restriction mode on' => [true],
            'restriction mode off' => [false],
        ];
    }

    public function testSdkUrlEmbedsThePublicKeyAsPathSegment(): void
    {
        $viewModel = new KlaviyoTracking(
            $this->createMock(ScopeConfigInterface::class),
            $this->createMock(UrlInterface::class)
        );

        self::assertSame(
            'https://static.klaviyo.com/onsite/js/AbC123/klaviyo.js',
            $viewModel->getSdkUrl('AbC123')
        );
    }

    public function testSdkUrlEncodesCharactersThatWouldChangeThePath(): void
    {
        $viewModel = new KlaviyoTracking(
            $this->createMock(ScopeConfigInterface::class),
            $this->createMock(UrlInterface::class)
        );

        self::assertSame(
            'https://static.klaviyo.com/onsite/js/a%2F..%3Fx%3D%22/klaviyo.js',
            $viewModel->getSdkUrl('a/..?x="')
        );
    }

    public function testReloadUrlIsBuiltByTheStoreUrlBuilder(): void
    {
        $urlBuilder = $this->createMock(UrlInterface::class);
        $urlBuilder->expects(self::once())
            ->method('getUrl')
            ->with('reclaim/checkout/reload')
            ->willReturn('https://shop.example.com/de/reclaim/checkout/reload/');

        $viewModel = new KlaviyoTracking($this->createMock(ScopeConfigInterface::class), $urlBuilder);

        self::assertSame('https://shop.example.com/de/reclaim/checkout/reload/', $viewModel->getReloadUrl());
    }
}
