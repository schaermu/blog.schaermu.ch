import { test, expect } from '@playwright/test';

test.describe('homepage and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage renders latest posts and post cards', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog \| schaermu\.ch/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Neueste Beiträge' }),
    ).toBeVisible();

    const postCards = page.locator('article');
    await expect(postCards.first()).toBeVisible();

    const cardCount = await postCards.count();
    expect(cardCount).toBeGreaterThan(0);

    for (let index = 0; index < cardCount; index += 1) {
      const card = postCards.nth(index);
      const titleLink = card.locator('a[href^="/blog/"]').first();
      const href = await titleLink.getAttribute('href');

      await expect(titleLink).toBeVisible();
      expect(href).toMatch(/^\/blog\/[\w-]+\/$/);
      await expect(card.locator('time').first()).toBeVisible();
      await expect(card.getByText(/\d+\s+Min\.\s+Lesezeit/i)).toBeVisible();
      await expect(card.locator('a[href^="/tags/"]').first()).toBeVisible();
    }
  });

  test('desktop header shows nav links and hides hamburger', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile);

    const desktopNavLinks = page.locator('header .hidden.md\\:flex nav a');
    await expect(desktopNavLinks).toHaveText(['Blog', 'Tags', 'Über mich']);
    await expect(page.locator('#mobile-menu-btn')).toBeHidden();
  });

  test('mobile hamburger opens menu and supports close interactions', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile);

    const menuButton = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    const mobileNavLinks = mobileMenu.locator('nav a');

    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await expect(mobileNavLinks).toHaveText(['Blog', 'Tags', 'Über mich']);

    await mobileMenu.getByRole('link', { name: 'Tags' }).click();
    await expect(page).toHaveURL('/tags/');
    await expect(mobileMenu).not.toHaveAttribute('data-open', 'true');

    await page.goto('/');
    await menuButton.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await page.keyboard.press('Escape');
    await expect(mobileMenu).not.toHaveAttribute('data-open', 'true');

    await menuButton.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await page.locator('#mobile-menu-backdrop').click();
    await expect(mobileMenu).not.toHaveAttribute('data-open', 'true');
  });

  test('footer is visible with copyright and rss link', async ({ page }) => {
    const footer = page.locator('footer');

    await expect(footer).toBeVisible();
    await expect(footer).toContainText('©');
    await expect(footer.getByRole('link', { name: /rss/i })).toBeVisible();
  });

  test('navigation reaches blog post, tags, and about pages', async ({
    page,
  }) => {
    const firstPostLink = page.locator('article a[href^="/blog/"]').first();

    await firstPostLink.click();
    await expect(page).toHaveURL(/\/blog\/[\w-]+\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/tags/');
    await expect(page).toHaveURL('/tags/');
    await expect(page.locator('main a[href^="/tags/"]').first()).toBeVisible();

    await page.goto('/about/');
    await expect(page).toHaveURL('/about/');
    await expect(
      page.getByRole('heading', { level: 1, name: /über mich/i }),
    ).toBeVisible();
  });
});
