import { test, expect } from '@playwright/test';

const cloudflareHeroBase = 'https://blog.schaermu.ch/cdn-cgi/image/width=';
const absoluteHeroOrigin = 'https://storage.schaermu.ch/blog/test-hero.png';

test.describe('absolute URL hero image', () => {
  test('post with absolute URL heroImage renders Cloudflare-transformed responsive image', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-absolute-hero/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'E2E Fixture Absolute Hero',
    );

    const heroImg = page.locator('img[alt="E2E Fixture Absolute Hero"]');
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveAttribute(
      'src',
      new RegExp(
        `${cloudflareHeroBase}1440,quality=80,format=auto,fit=cover/${absoluteHeroOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      ),
    );
    await expect(heroImg).toHaveAttribute(
      'srcset',
      new RegExp(
        `width=480,quality=80,format=auto,fit=cover/${absoluteHeroOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} 480w`,
      ),
    );
    await expect(heroImg).toHaveAttribute(
      'srcset',
      new RegExp(
        `width=1440,quality=80,format=auto,fit=cover/${absoluteHeroOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} 1440w`,
      ),
    );
  });

  test('OG meta contains absolute URL without double-wrapping', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-absolute-hero/');

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute(
      'content',
      'https://storage.schaermu.ch/blog/test-hero.png',
    );
  });
});
