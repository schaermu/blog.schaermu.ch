import { test, expect } from '@playwright/test';

test.describe('blog post and series', () => {
  test('welcome post renders metadata, hero image, prose, and series badge', async ({ page }) => {
    await page.goto('/blog/welcome-to-the-blog/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to My Blog');
    await expect(page.locator('time').first()).toBeVisible();
    await expect(page.getByText(/\d+\s+min read/i)).toBeVisible();

    const tagLinks = page.locator('main a[href^="/tags/"]');
    await expect(tagLinks.first()).toBeVisible();
    await expect(page.locator('main a[href="/tags/blogging/"]')).toBeVisible();
    await expect(page.locator('main a[href="/tags/astro/"]')).toBeVisible();
    await expect(page.locator('main a[href="/tags/web-dev/"]')).toBeVisible();

    await expect(page.locator('img[alt="Welcome to My Blog"]')).toBeVisible();
    await expect(page.locator('.prose')).toBeVisible();

    const badge = page.locator('div').filter({ hasText: /Part 1 of 2/ }).first();
    await expect(badge).toContainText('Part 1 of 2');
    await expect(badge).toContainText('Building a Blog with Astro');
  });

  test('post without hero image omits hero section', async ({ page }) => {
    await page.goto('/blog/building-with-astro/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Building a Static Blog with Astro Content Collections');
    await expect(page.locator('img[alt="Building a Static Blog with Astro Content Collections"]')).toHaveCount(0);
    await expect(page.locator('.prose')).toBeVisible();
  });

  test('desktop series quick navigation shows correct prev/next links', async ({ page, isMobile }) => {
    test.skip(isMobile);

    await page.goto('/blog/welcome-to-the-blog/');
    const partOneQuickNav = page.getByRole('navigation', { name: 'Series quick navigation' });
    await expect(partOneQuickNav).toBeVisible();
    await expect(partOneQuickNav.locator('a[href="/blog/building-with-astro/"]')).toBeVisible();
    await expect(partOneQuickNav.locator('a[href="/blog/welcome-to-the-blog/"]')).toHaveCount(0);

    await page.goto('/blog/building-with-astro/');
    const partTwoQuickNav = page.getByRole('navigation', { name: 'Series quick navigation' });
    await expect(partTwoQuickNav).toBeVisible();
    await expect(partTwoQuickNav.locator('a[href="/blog/welcome-to-the-blog/"]')).toBeVisible();
    await expect(partTwoQuickNav.locator('a[href="/blog/building-with-astro/"]')).toHaveCount(0);
  });

  test('mobile series quick navigation expands and shows links', async ({ page, isMobile }) => {
    test.skip(!isMobile);

    await page.goto('/blog/welcome-to-the-blog/');

    const mobileDetails = page.locator('details').filter({ has: page.locator('summary') }).first();
    await expect(mobileDetails).toBeVisible();
    await mobileDetails.locator('summary').click();
    await expect(mobileDetails.locator('a[href="/blog/building-with-astro/"]')).toBeVisible();

    await page.goto('/blog/building-with-astro/');
    const secondMobileDetails = page.locator('details').filter({ has: page.locator('summary') }).first();
    await expect(secondMobileDetails).toBeVisible();
    await secondMobileDetails.locator('summary').click();
    await expect(secondMobileDetails.locator('a[href="/blog/welcome-to-the-blog/"]')).toBeVisible();
  });

  test('series footer navigation shows progress and links between posts', async ({ page }) => {
    await page.goto('/blog/welcome-to-the-blog/');

    const footerNav = page.getByRole('navigation', { name: 'Series navigation' });
    await expect(footerNav).toBeVisible();
    await expect(footerNav).toContainText('Building a Blog with Astro');
    await expect(footerNav).toContainText('Part 1 of 2');

    const nextLink = footerNav.locator('a[href="/blog/building-with-astro/"]');
    await expect(nextLink).toBeVisible();
    await expect(nextLink).toContainText('Next');

    await nextLink.click();
    await expect(page).toHaveURL('/blog/building-with-astro/');

    const secondFooterNav = page.getByRole('navigation', { name: 'Series navigation' });
    await expect(secondFooterNav).toContainText('Building a Blog with Astro');

    const prevLink = secondFooterNav.locator('a[href="/blog/welcome-to-the-blog/"]');
    await expect(prevLink).toBeVisible();
    await expect(prevLink).toContainText('Previous');
  });
});
