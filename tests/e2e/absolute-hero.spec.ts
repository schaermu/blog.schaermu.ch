import { test, expect } from '@playwright/test';

test.describe('absolute URL hero image', () => {
  test('post with absolute URL heroImage renders img tag with correct src', async ({ page }) => {
    await page.goto('/blog/e2e-absolute-hero/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('E2E Fixture Absolute Hero');

    const heroImg = page.locator('img[alt="E2E Fixture Absolute Hero"]');
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveAttribute('src', 'https://storage.schaermu.ch/blog/test-hero.png');
  });

  test('homepage card renders absolute URL hero image', async ({ page }) => {
    await page.goto('/');

    const postCard = page.locator('article').filter({ hasText: 'E2E Fixture Absolute Hero' });
    await expect(postCard).toBeVisible();

    const heroImg = postCard.locator('img[alt="E2E Fixture Absolute Hero"]');
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveAttribute('src', 'https://storage.schaermu.ch/blog/test-hero.png');
  });

  test('OG meta contains absolute URL without double-wrapping', async ({ page }) => {
    await page.goto('/blog/e2e-absolute-hero/');

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', 'https://storage.schaermu.ch/blog/test-hero.png');
  });
});
