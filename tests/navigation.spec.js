// navigation.spec.js
const { test, expect } = require('@playwright/test');

test('has link to login page', async ({ page }) => {
  // Przejście do strony głównej aplikacji
  await page.goto('http://localhost:3000/');

  // Kliknięcie w link do logowania
  await page.click('text=Zaloguj się'); // Upewnij się, że dokładny tekst linku jest taki sam

  // Sprawdzenie, czy została otwarta strona logowania
  await expect(page).toHaveURL('http://localhost:3000/user/signin'); // Zmień URL na prawidłowy, jeśli używasz innej ścieżki

  // Sprawdzenie, czy na stronie logowania znajduje się nagłówek z tekstem "Logowanie"
  await expect(page.getByRole('heading', { name: 'Logowanie' })).toBeVisible();
});
