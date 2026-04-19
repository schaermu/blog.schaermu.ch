import { test, expect } from '@playwright/test';

const POST_URL = '/blog/e2e-fixture-with-hero/';
const SITE_ORIGIN = 'https://blog.schaermu.ch';
const FULL_POST_URL = `${SITE_ORIGIN}${POST_URL}`;
const POST_TITLE = 'E2E Fixture Post With Hero';
const SHARE_TEXT = `${POST_TITLE} ${FULL_POST_URL}`;

test.describe('share buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(POST_URL);
  });

  test('renders share label and all five buttons', async ({ page }) => {
    const container = page
      .locator('[data-pagefind-ignore]')
      .filter({ hasText: 'Teilen' });
    await expect(container).toBeVisible();
    await expect(container.locator('text=Teilen').first()).toBeVisible();

    await expect(container.locator('a', { hasText: 'LinkedIn' })).toBeVisible();
    await expect(container.locator('a', { hasText: 'Xing' })).toBeVisible();
    await expect(container.locator('a', { hasText: 'Bluesky' })).toBeVisible();
    await expect(container.locator('a', { hasText: 'Mastodon' })).toBeVisible();
    await expect(
      container.locator('button', { hasText: 'Link kopieren' }),
    ).toBeVisible();
  });

  test('LinkedIn share link has correct href', async ({ page }) => {
    const link = page.locator('a[aria-label="Auf LinkedIn teilen"]');
    await expect(link).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(FULL_POST_URL)}`,
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Xing share link has correct href', async ({ page }) => {
    const link = page.locator('a[aria-label="Auf Xing teilen"]');
    await expect(link).toHaveAttribute(
      'href',
      `https://www.xing.com/spi/shares/new?url=${encodeURIComponent(FULL_POST_URL)}`,
    );
  });

  test('Bluesky share link has correct href', async ({ page }) => {
    const link = page.locator('a[aria-label="Auf Bluesky teilen"]');
    await expect(link).toHaveAttribute(
      'href',
      `https://bsky.app/intent/compose?text=${encodeURIComponent(SHARE_TEXT)}`,
    );
  });

  test('Mastodon share link has correct href', async ({ page }) => {
    const link = page.locator('a[aria-label="Auf Mastodon teilen"]');
    await expect(link).toHaveAttribute(
      'href',
      `https://share.joinmastodon.org/?text=${encodeURIComponent(SHARE_TEXT)}`,
    );
  });

  test('all share links open in new tab', async ({ page }) => {
    const shareLinks = page.locator('.share-btn');
    const count = await shareLinks.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i++) {
      await expect(shareLinks.nth(i)).toHaveAttribute('target', '_blank');
      await expect(shareLinks.nth(i)).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      );
    }
  });

  test('copy link button shows "Copied!" feedback on click', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyBtn = page.locator('.share-copy-btn');
    await expect(copyBtn).toBeVisible();

    const label = copyBtn.locator('.share-copy-label');
    await expect(label).toHaveText('Link kopieren');

    await copyBtn.click();

    await expect(label).toHaveText('Kopiert!');
    await expect(copyBtn.locator('.share-copy-icon')).toBeHidden();
    await expect(copyBtn.locator('.share-check-icon')).toBeVisible();

    await expect(label).toHaveText('Link kopieren', { timeout: 5000 });
  });

  test('copy link button stores correct URL in data attribute', async ({
    page,
  }) => {
    const copyBtn = page.locator('.share-copy-btn');
    await expect(copyBtn).toHaveAttribute('data-share-url', FULL_POST_URL);
  });

  test('share buttons are excluded from search index', async ({ page }) => {
    const container = page
      .locator('[data-pagefind-ignore]')
      .filter({ hasText: 'Teilen' });
    await expect(container).toHaveAttribute('data-pagefind-ignore', '');
  });

  test('share buttons also appear on post without hero image', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-fixture-no-hero/');

    await expect(
      page.locator('a[aria-label="Auf LinkedIn teilen"]'),
    ).toBeVisible();
    await expect(
      page.locator('a[aria-label="Auf Bluesky teilen"]'),
    ).toBeVisible();
    await expect(page.locator('.share-copy-btn')).toBeVisible();
  });

  test('each share button contains an SVG icon', async ({ page }) => {
    const shareLinks = page.locator('.share-btn');
    const count = await shareLinks.count();

    for (let i = 0; i < count; i++) {
      await expect(shareLinks.nth(i).locator('svg')).toBeVisible();
    }

    await expect(page.locator('.share-copy-btn svg').first()).toBeVisible();
  });
});
