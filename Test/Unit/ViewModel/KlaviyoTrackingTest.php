<?php

declare(strict_types=1);

namespace PixelPerfect\KlaviyoHyvaCompat\Test\Unit\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
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

        self::assertSame($flag, (new KlaviyoTracking($scopeConfig))->isCookieRestrictionEnabled());
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
        $viewModel = new KlaviyoTracking($this->createMock(ScopeConfigInterface::class));

        self::assertSame(
            'https://static.klaviyo.com/onsite/js/AbC123/klaviyo.js',
            $viewModel->getSdkUrl('AbC123')
        );
    }

    public function testSdkUrlEncodesCharactersThatWouldChangeThePath(): void
    {
        $viewModel = new KlaviyoTracking($this->createMock(ScopeConfigInterface::class));

        self::assertSame(
            'https://static.klaviyo.com/onsite/js/a%2F..%3Fx%3D%22/klaviyo.js',
            $viewModel->getSdkUrl('a/..?x="')
        );
    }
}
