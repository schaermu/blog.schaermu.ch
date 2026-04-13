import { test, expect } from '@playwright/test';

async function setTheme(page: Parameters<typeof test>[0]['page'], theme: 'light' | 'dark') {
  await page.evaluate((value) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
  }, theme);
}

test.describe('theme switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('default theme exists on html and toggle is visible', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', /^(light|dark)$/);
    await expect(page.locator('#theme-toggle')).toBeVisible();
  });

  test('light mode shows moon icon and dark mode shows sun icon', async ({ page }) => {
    await setTheme(page, 'light');
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.moon-icon')).toBeVisible();
    await expect(page.locator('.sun-icon')).toBeHidden();

    await setTheme(page, 'dark');
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.sun-icon')).toBeVisible();
    await expect(page.locator('.moon-icon')).toBeHidden();
  });

  test('clicking toggle switches themes and persists localStorage', async ({ page }) => {
    await setTheme(page, 'light');
    await page.reload();

    const toggle = page.locator('#theme-toggle');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  });

  test('theme changes body background color', async ({ page }) => {
    await setTheme(page, 'light');
    await page.reload();

    const lightBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const darkBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(darkBackground).not.toBe(lightBackground);
  });

  test('theme toggle works on a blog post page', async ({ page }) => {
    await page.goto('/blog/e2e-fixture-with-hero/');
    await setTheme(page, 'light');
    await page.reload();

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
