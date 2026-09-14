import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('loads successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('a.flex.items-center.gap-2.font-bold.text-xl')).toBeVisible(); // Logo/Brand
    });

    test('navigation works', async ({ page }) => {
        await page.goto('/');
        // Check if we can find the link and click it
        // Match the link in the footer (contentinfo) as it matches "Über uns" too and is always visible
        const link = page.getByRole('contentinfo').getByRole('link', { name: 'Über uns' });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(/\/about/);
    });
});
