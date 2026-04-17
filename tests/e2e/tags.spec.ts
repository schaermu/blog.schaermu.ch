import { test, expect } from '@playwright/test';

test.describe('tags', () => {
  test('tags index shows heading and all fixture tag links with # prefix', async ({ page }) => {
    await page.goto('/tags/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tags');

    await expect(page.locator('a[href="/tags/e2e-testing/"]')).toBeVisible();
    await expect(page.locator('a[href="/tags/e2e-astro/"]')).toBeVisible();
    await expect(page.locator('a[href="/tags/e2e-web-dev/"]')).toBeVisible();
    await expect(page.locator('a[href="/tags/e2e-typescript/"]')).toBeVisible();
    await expect(page.locator('a[href="/tags/e2e-tutorial/"]')).toBeVisible();

    await expect(page.locator('a[href="/tags/e2e-testing/"]')).toContainText('#e2e-testing');
  });

  test('tag page for shared tag shows both fixture posts with time elements', async ({ page }) => {
    await page.goto('/tags/e2e-astro/');

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toContainText('Beiträge mit Tag');
    await expect(h1).toContainText('#e2e-astro');

    await expect(page.locator('a[href="/blog/e2e-fixture-with-hero/"]')).toBeVisible();
    await expect(page.locator('a[href="/blog/e2e-fixture-no-hero/"]')).toBeVisible();

    await expect(page.locator('article time').first()).toBeVisible();

    const withHeroTop = await page.locator('a[href="/blog/e2e-fixture-with-hero/"]').evaluate(
      (el) => (el.closest('article') as HTMLElement).getBoundingClientRect().top
    );
    const noHeroTop = await page.locator('a[href="/blog/e2e-fixture-no-hero/"]').evaluate(
      (el) => (el.closest('article') as HTMLElement).getBoundingClientRect().top
    );
    expect(withHeroTop).toBeLessThan(noHeroTop);
  });

  test('tag page for unique tag shows only the fixture post that has that tag', async ({ page }) => {
    await page.goto('/tags/e2e-testing/');

    await expect(page.locator('a[href="/blog/e2e-fixture-with-hero/"]')).toBeVisible();
    await expect(page.locator('a[href="/blog/e2e-fixture-no-hero/"]')).toHaveCount(0);
  });

  test('clicking a tag page post link navigates to the fixture blog post', async ({ page }) => {
    await page.goto('/tags/e2e-testing/');

    await page.locator('a[href="/blog/e2e-fixture-with-hero/"]').first().click();

    await expect(page).toHaveURL('/blog/e2e-fixture-with-hero/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('E2E Fixture Post With Hero');
  });
});
