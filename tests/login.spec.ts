import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('HP-04: Login page loads correctly', async ({ page }) => {
    // Expect a title "to contain" "Swag Labs"
    await expect(page).toHaveTitle(/Swag Labs/);

    // Expect the username and password fields to be empty
    await expect(page.locator('[data-test="username"]')).toHaveValue('');
    await expect(page.locator('[data-test="password"]')).toHaveValue('');

    // Expect the login button to be visible
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Expect the list of accepted usernames and the password hint to contain the correct text
    await expect(page.locator('[data-test="login-credentials"]')).toContainText('standard_user');
    await expect(page.locator('[data-test="login-password"]')).toContainText('secret_sauce');
  });
  
  test('HP-01: Log in successfully as standard_user with secret_sauce by clicking Login', async ({ page }) => {
    // Fill in the username and password for standard_user
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click the login button
    await page.locator('[data-test="login-button"]').click();

    // Expect the user to be redirected to the inventory page with the correct URL and the inventory list to be visible with 6 items  
    //await expect(page).toHaveURL('/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();  
  });

  test('NEG-01: Attempt to log in with empty username and password fields', async ({ page }) => {
    // Click the login button without filling in the username and password fields
    await page.locator('[data-test="login-button"]').click();

    // Expect the error message to be visible with the correct text
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
  
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-04: Attempt to log in with a valid username and an invalid password', async ({ page }) => {
    // Fill in the username for standard_user and an invalid password
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('invalid_password');

    // Click the login button
    await page.locator('[data-test="login-button"]').click();

    // Expect the error message to be visible with the correct text
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-08: Attempt to log in with a locked_out_user', async ({ page }) => {
    // Fill in the username for locked_out_user and the correct password
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Click the login button
    await page.locator('[data-test="login-button"]').click();

    // Expect the error message to be visible with the correct text
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  
    // Expect page to remain on the login page with the correct URL
    await expect(page).toHaveURL('/');
  });

  test('NEG-09: Attempt to access the inventory page directly without logging in', async ({ page }) => {
    // Navigate directly to the inventory page
    await page.goto('/inventory.html');

    // Expect the user to be redirected back to the login page with the correct URL
    await expect(page).toHaveURL('/');

    // Expect the error message to be visible with the correct text
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: You can only access \'/inventory.html\' when you are logged in.');  
  });
})
