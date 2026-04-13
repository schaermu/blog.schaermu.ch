import { expect, test } from '@playwright/test';

test.describe('meta tags', () => {
  test('blog post with hero has correct OG meta tags', async ({ page }) => {
    await page.goto('/blog/e2e-fixture-with-hero/');

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('E2E Fixture Post With Hero');

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toContain('A test fixture post used for E2E testing');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https:\/\//);
    expect(ogImage).not.toContain('/og-default.png');

    const siteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    expect(siteName).toBe('blog.schaermu.ch');

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toBe('E2E Fixture Post With Hero');
  });

  test('blog post without hero uses default OG image', async ({ page }) => {
    await page.goto('/blog/e2e-fixture-no-hero/');

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/og-default.png');
  });

  test('homepage has website OG type and correct meta tags', async ({ page }) => {
    await page.goto('/');

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('/og-default.png');

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
  });
});
