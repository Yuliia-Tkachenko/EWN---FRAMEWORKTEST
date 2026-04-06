/*
Test Case: Verify successful login functionality

Tags: @smoke @regression

Steps:
1.Navigate to the login page
2.Enter valid username and password
3.Click the "Login" button
4.Wait for the page to load and verify that the login was successful by checking for the presence of a specific element on the landing page (e.g., a welcome message or user profile icon).
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';

let config: TestConfig;
let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  //1.Navigate to the login page
  config = new TestConfig();
  await page.goto(config.appUrl); //Navigate to base URL
})

test.afterEach(async ({ page }) => {
  await page.close();
})

//Test Case 1: Verify EWN logo is visible on the login page
test('EWN logo is visible', async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.expectLogoVisible();
});


//Test Case 2: Verify successful login functionality
test('Verify successful login functionality', async ({ page }) => {
  //Enter valid username and password
  loginPage = new LoginPage(page);
  await loginPage.login(config.validUsername, config.validPassword);
  
  //Click the "Login" button
  await loginPage.expectLoginButtonEnabled();
  await loginPage.clickLoginButton();
  await page.waitForTimeout(5000);

  //Wait for the page to load and verify that the login was successful by checking for the presence of a specific element on the landing page (e.g., a welcome message or user profile icon). 
  homePage = new HomePage(page);
  await homePage.expectUserNameVisible();
  await page.waitForTimeout(5000);
});

//Test Case 3: Verify that fields "Username" and "Password" are required
test('Verify that fields "Username" and "Password" are required', async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.clickPasswordField();
  await loginPage.expectUsernameErrorMessageVisible(); //Verify that the error message for the username field is visible
  await page.waitForTimeout(5000);
  await loginPage.clickText();
  await loginPage.expectPasswordErrorMessageVisible();  //Verify that the error message for the password field is visible
  await page.waitForTimeout(5000);
  await loginPage.expectLoginButtonDisabled();//Verify that the login button is not clickable when the fields are empty


});




