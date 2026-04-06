//Test created by AI

/*
TC-02 — Enterprise Associations: Enterprise Company Field Required Validation

Preconditions: Navigate to Enterprise Associations page

Step 1 | Open the page | No error message is shown on initial render
Step 2 | Select a company, then revert dropdown to "-- Select --" | Required error appears; label and dropdown get error styling
Step 3 | Select a valid company | No error message shown; error styling removed
Step 4 | Trigger error (step 2), then select a valid company | Error clears and error styling is removed
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { EnterpriseAssociationsPage } from '../../pages/utilities/EnterpriseAssociations';

test.describe.configure({ mode: 'serial' });

test.describe('TC-02 — Enterprise Associations: Enterprise Company Field Required Validation', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {
    await page.goto('/legacy/EnterpriseAssociations');
    await page.waitForLoadState('domcontentloaded');
  });

  // Step 1: No error shown on initial render
  test('Required error is not shown on initial render', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.expectFieldErrorNotVisible();
    await enterprisePage.expectLabelNotHasErrorClass();
  });

  // Step 2: Error appears when dropdown reverted to "-- Select --"
  test('Required error appears when user reverts dropdown to "-- Select --"', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.selectDefaultOption();
    await enterprisePage.expectFieldErrorVisible();
    await enterprisePage.expectFieldErrorText('Required');
    await enterprisePage.expectLabelHasErrorClass();
    await enterprisePage.expectDropdownHasErrorClass();
  });

  // Step 3: No error when a valid company is selected
  test('Required error is not shown when a valid company is selected', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectFieldErrorNotVisible();
    await enterprisePage.expectLabelNotHasErrorClass();
    await enterprisePage.expectDropdownNotHasErrorClass();
  });

  // Step 4: Error clears after selecting a valid company
  test('Required error clears when user selects a valid company after the error was shown', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.selectFirstCompany();
    await enterprisePage.selectDefaultOption();
    await enterprisePage.expectFieldErrorVisible();

    await enterprisePage.selectFirstCompany();
    await enterprisePage.expectLoadingOverlayHidden();
    await enterprisePage.expectFieldErrorNotVisible();
    await enterprisePage.expectLabelNotHasErrorClass();
  });
});
