import { expect, test } from '@playwright/test';

test.describe('404 page', () => {
  test('custom 404 page renders correctly', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345/');
    await expect(
      page.getByRole('heading', { level: 1, name: '404' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Seite nicht gefunden' }),
    ).toBeVisible();
    await expect(page.getByText(/Ups!/)).toBeVisible();
  });

  test('back to home link navigates to homepage', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345/');
    const backLink = page.getByRole('link', { name: /Zurück zur Startseite/ });
    await expect(backLink).toBeVisible();
    await backLink.click();
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Neueste Beiträge' }),
    ).toBeVisible();
  });
});
