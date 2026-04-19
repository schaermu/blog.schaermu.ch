import { test, expect } from '@playwright/test';

test.describe('blog post and series', () => {
  test('welcome post renders metadata, hero image, prose, and series badge', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-fixture-with-hero/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'E2E Fixture Post With Hero',
    );
    await expect(page.locator('time').first()).toBeVisible();
    await expect(page.getByText(/\d+\s+Min\.\s+Lesezeit/i)).toBeVisible();

    const tagLinks = page.locator('main a[href^="/tags/"]');
    await expect(tagLinks.first()).toBeVisible();
    await expect(
      page.locator('main a[href="/tags/e2e-testing/"]'),
    ).toBeVisible();
    await expect(page.locator('main a[href="/tags/e2e-astro/"]')).toBeVisible();
    await expect(
      page.locator('main a[href="/tags/e2e-web-dev/"]'),
    ).toBeVisible();

    await expect(
      page.locator('img[alt="E2E Fixture Post With Hero"]'),
    ).toBeVisible();
    await expect(page.locator('.prose')).toBeVisible();

    const badge = page
      .locator('div')
      .filter({ hasText: /Teil 1 von 2/ })
      .first();
    await expect(badge).toContainText('Teil 1 von 2');
    await expect(badge).toContainText('E2E Test Series');
  });

  test('post without hero image omits hero section', async ({ page }) => {
    await page.goto('/blog/e2e-fixture-no-hero/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'E2E Fixture Post Without Hero',
    );
    await expect(
      page.locator('img[alt="E2E Fixture Post Without Hero"]'),
    ).toHaveCount(0);
    await expect(page.locator('.prose')).toBeVisible();
  });

  test('desktop series quick navigation shows correct prev/next links', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile);

    await page.goto('/blog/e2e-fixture-with-hero/');
    const partOneQuickNav = page.getByRole('navigation', {
      name: 'Schnellnavigation Serie',
    });
    await expect(partOneQuickNav).toBeVisible();
    await expect(
      partOneQuickNav.locator('a[href="/blog/e2e-fixture-no-hero/"]'),
    ).toBeVisible();
    await expect(
      partOneQuickNav.locator('a[href="/blog/e2e-fixture-with-hero/"]'),
    ).toHaveCount(0);

    await page.goto('/blog/e2e-fixture-no-hero/');
    const partTwoQuickNav = page.getByRole('navigation', {
      name: 'Schnellnavigation Serie',
    });
    await expect(partTwoQuickNav).toBeVisible();
    await expect(
      partTwoQuickNav.locator('a[href="/blog/e2e-fixture-with-hero/"]'),
    ).toBeVisible();
    await expect(
      partTwoQuickNav.locator('a[href="/blog/e2e-fixture-no-hero/"]'),
    ).toHaveCount(0);
  });

  test('mobile series quick navigation expands and shows links', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile);

    await page.goto('/blog/e2e-fixture-with-hero/');

    const mobileDetails = page
      .locator('details')
      .filter({ has: page.locator('summary') })
      .first();
    await expect(mobileDetails).toBeVisible();
    await mobileDetails.locator('summary').click();
    await expect(
      mobileDetails.locator('a[href="/blog/e2e-fixture-no-hero/"]'),
    ).toBeVisible();

    await page.goto('/blog/e2e-fixture-no-hero/');
    const secondMobileDetails = page
      .locator('details')
      .filter({ has: page.locator('summary') })
      .first();
    await expect(secondMobileDetails).toBeVisible();
    await secondMobileDetails.locator('summary').click();
    await expect(
      secondMobileDetails.locator('a[href="/blog/e2e-fixture-with-hero/"]'),
    ).toBeVisible();
  });

  test('series footer navigation shows progress and links between posts', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-fixture-with-hero/');

    const footerNav = page.getByRole('navigation', {
      name: 'Seriennavigation',
    });
    await expect(footerNav).toBeVisible();
    await expect(footerNav).toContainText('E2E Test Series');
    await expect(footerNav).toContainText('Teil 1 von 2');

    const nextLink = footerNav.locator('a[href="/blog/e2e-fixture-no-hero/"]');
    await expect(nextLink).toBeVisible();
    await expect(nextLink).toContainText('Weiter');

    await nextLink.click();
    await expect(page).toHaveURL('/blog/e2e-fixture-no-hero/');

    const secondFooterNav = page.getByRole('navigation', {
      name: 'Seriennavigation',
    });
    await expect(secondFooterNav).toContainText('E2E Test Series');

    const prevLink = secondFooterNav.locator(
      'a[href="/blog/e2e-fixture-with-hero/"]',
    );
    await expect(prevLink).toBeVisible();
    await expect(prevLink).toContainText('Zurück');
  });

  test('clicking a tag on a blog post navigates to the tag page', async ({
    page,
  }) => {
    await page.goto('/blog/e2e-fixture-with-hero/');

    const tagLink = page.locator('main a[href="/tags/e2e-testing/"]');
    await expect(tagLink).toBeVisible();
    await tagLink.click();

    await expect(page).toHaveURL('/tags/e2e-testing/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Beiträge mit Tag',
    );
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      '#e2e-testing',
    );

    await expect(
      page.locator('a[href="/blog/e2e-fixture-with-hero/"]'),
    ).toBeVisible();
  });
});
