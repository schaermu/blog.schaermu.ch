import { test, expect } from '@playwright/test';

test.describe('search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop search trigger opens pagefind modal', async ({ page, isMobile }) => {
    test.skip(isMobile);

    const trigger = page.locator('pagefind-modal-trigger.search-trigger');
    const modal = page.locator('pagefind-modal dialog.pf-modal');

    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(modal).toBeVisible();
  });

  test('mobile desktop-nav search trigger is hidden', async ({ page, isMobile }) => {
    test.skip(!isMobile);

    await expect(page.locator('.hidden.md\\:flex pagefind-modal-trigger.search-trigger')).toBeHidden();
  });

  test('mobile search button closes menu and opens pagefind modal', async ({ page, isMobile }) => {
    test.skip(!isMobile);

    const menuButton = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    const searchButton = page.locator('#mobile-search-btn');
    const modal = page.locator('pagefind-modal dialog.pf-modal');

    await menuButton.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await expect(searchButton).toBeVisible();

    await searchButton.click();
    await expect(mobileMenu).not.toHaveAttribute('data-open', 'true');
    await expect(modal).toBeVisible();
  });

  test('desktop search returns results for fixture content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'search interaction tested on desktop only');

    const trigger = page.locator('pagefind-modal-trigger.search-trigger');
    await trigger.click();
    await expect(page.locator('pagefind-modal dialog.pf-modal')).toBeVisible();

    const searchInput = page.getByRole('searchbox', { name: 'Suche' });
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Fixture');

    const results = page.locator('pagefind-modal dialog.pf-modal a[href*="/blog/"]');
    await expect(results.first()).toBeVisible({ timeout: 10000 });

    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a search result navigates to blog post', async ({ page, isMobile }) => {
    test.skip(isMobile, 'search interaction tested on desktop only');

    const trigger = page.locator('pagefind-modal-trigger.search-trigger');
    await trigger.click();
    await expect(page.locator('pagefind-modal dialog.pf-modal')).toBeVisible();

    const searchInput = page.getByRole('searchbox', { name: 'Suche' });
    await searchInput.fill('Fixture');

    const results = page.locator('pagefind-modal dialog.pf-modal a[href*="/blog/"]');
    await expect(results.first()).toBeVisible({ timeout: 10000 });

    await results.first().click();

    await expect(page).toHaveURL(/\/blog\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
