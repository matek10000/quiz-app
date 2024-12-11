const { test, expect } = require('@playwright/test');

test.describe('Test logowania i przejścia do profilu', () => {

  test('Logowanie poprawne i przejście do profilu użytkownika', async ({ page }) => {
    // Przejdź do strony logowania
    await page.goto('http://localhost:3000/user/signin');

    // Wpisz dane logowania
    await page.fill('input[type="email"]', 'mateusz.dybas10@gmail.com'); // Email użytkownika testowego
    await page.fill('input[type="password"]', 'admin!'); // Hasło użytkownika testowego

    await page.click('button[type="submit"]'); 

    await page.waitForURL('http://localhost:3000/user/profile');

    await expect(page.locator('h1')).toHaveText(/Mój profil/i);
  });

  test('Przekierowanie niezalogowanego użytkownika na stronę logowania', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');

    await page.waitForURL('http://localhost:3000/user/signin?returnUrl=%2Fuser%2Fprofile');

    await expect(page.getByRole('heading', { name: /Logowanie/i })).toBeVisible();
  });

});
