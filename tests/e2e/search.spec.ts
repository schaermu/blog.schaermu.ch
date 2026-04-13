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
});
