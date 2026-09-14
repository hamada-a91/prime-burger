import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
    test('Login und Navigation', async ({ page }) => {
        await page.goto('/admin/login');
        await page.getByLabel('E-Mail').fill(process.env.ADMIN_EMAIL ?? 'admin@example.com');
        await page.getByLabel('Passwort').fill(process.env.ADMIN_PASSWORD ?? 'password');
        await page.getByRole('button', { name: 'Anmelden' }).click();
        await expect(page).toHaveURL(/\/admin$/);
        await expect(page.getByText('Neueste Anfragen')).toBeVisible();

        await page.goto('/admin/menu');
        await expect(page.getByRole('heading', { name: 'Kategorien' })).toBeVisible();

        await page.goto('/admin/gallery');
        await expect(page.getByText('Bilder hierher ziehen')).toBeVisible();

        await page.goto('/admin/settings');
        await expect(page.getByRole('tab', { name: 'Öffnungszeiten' })).toBeVisible();
    });
});
