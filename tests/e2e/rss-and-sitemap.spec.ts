import { test, expect } from '@playwright/test';

test.describe('RSS and sitemap', () => {
  test('RSS feed is valid and contains fixture posts', async ({ page }) => {
    const response = await page.request.get('/rss.xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');

    const body = await response.text();
    expect(body).toContain('<title>schaermu.ch</title>');
    expect(body).toContain('E2E Fixture Post With Hero');
    expect(body).toContain('E2E Fixture Post Without Hero');
    expect(body).toContain('/blog/e2e-fixture-with-hero/');
    expect(body).toContain('/blog/e2e-fixture-no-hero/');
  });

  test('sitemap index is valid', async ({ page }) => {
    const response = await page.request.get('/sitemap-index.xml');

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<sitemapindex');
    expect(body).toContain('sitemap-0.xml');
  });

  test('sitemap child contains known routes', async ({ page }) => {
    const response = await page.request.get('/sitemap-0.xml');

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('/blog/e2e-fixture-with-hero/');
    expect(body).toContain('/tags/');
    expect(body).toContain('/about/');
  });
});
