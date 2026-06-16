import { expect, test } from '@playwright/test';

test('loads the homepage, selects a stage, and keeps rendering', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Tour Transalp 2026/i })).toBeVisible();
  await page.getByRole('button', { name: /Sillian\s+→\s+Falcade/i }).first().click();

  await expect(page.getByText(/Stage 2: Sillian\s+→\s+Falcade/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Sillian\s+→\s+Falcade/i })).toBeVisible();
});

test('opens the About view from the homepage', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'About this dashboard and Tour Transalp' }).click();

  await expect(page.getByRole('heading', { name: /Fernando Mattos at Tour Transalp 2026/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back to dashboard' })).toBeVisible();
});
