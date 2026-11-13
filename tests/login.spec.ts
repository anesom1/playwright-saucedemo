import { test, expect } from '@playwright/test';
import { users } from '../test-data/users';
import { LoginPage } from '../pages/login.page';
import { messages } from '../test-data/messages';

test.describe('Login page', () => {

  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });
  
  test('HP-04: Login page loads correctly', async ({ page }) => {
    // Expect a title "to contain" "Swag Labs"
    await expect(page).toHaveTitle(/Swag Labs/);

    // Expect the username and password fields to be empty
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');

    // Expect the login button to be visible
    await expect(loginPage.loginButton).toBeVisible();

    // Expect the list of accepted usernames and the password hint to contain the correct text
    await expect(loginPage.acceptedUsernames).toContainText(users.standard.username);
    await expect(loginPage.loginPassword).toContainText(users.standard.password);
  });
  
  test('HP-01: Log in successfully as standard_user with secret_sauce by clicking Login', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    // Expect the user to be redirected to the inventory page with the correct URL and the inventory list to be visible with 6 items  
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();  
  });

  test('NEG-01: Attempt to log in with empty username and password fields', async ({ page }) => {
    // Click the login button without filling in the username and password fields
    await loginPage.loginButton.click();

    // Expect the error message to be visible with the correct text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.username_required.msg);
  
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-04: Attempt to log in with a valid username and an invalid password', async ({ page }) => {
    // Fill in the username for standard_user and an invalid password
    await loginPage.login(users.wrong_password.username, users.wrong_password.password);

    // Expect the error message to be visible with the correct text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.wrong_credentials.msg);
    
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-08: Attempt to log in with a locked_out_user', async ({ page }) => {
    // Fill in the username for locked_out_user and the correct password
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    // Expect the error message to be visible with the correct text
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.lockedOut.msg);
  
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-09: Attempt to access the inventory page directly without logging in', async ({ page }) => {
    // Navigate directly to the inventory page
    await page.goto('/inventory.html');

    // Expect the user to be redirected back to the login page with the correct URL
    await expect(page).toHaveURL('/');

    // Expect the error message to be visible with the correct text
    await expect(loginPage.errorMessage).toBeVisible();
  
    await expect(loginPage.errorMessage).toHaveText(messages.not_logged_in.msg);  
  });
})
