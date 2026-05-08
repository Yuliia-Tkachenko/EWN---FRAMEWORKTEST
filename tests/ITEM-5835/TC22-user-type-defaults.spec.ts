// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Advanced Employee Filter', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000);
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('TC22 â€” Verify "User Type" Defaults to "All Users" and Offers Selectable Options', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, expand Advanced Employee Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // expect: The "User Type" dropdown shows "All Users" as the default selection
    await expect(eCardPage.userTypeSelect, 'User Type should be visible').toBeVisible();
    const defaultOption = await eCardPage.userTypeSelect.locator('option:checked').textContent();
    expect(
      defaultOption?.trim(),
      'User Type should default to "All Users"'
    ).toBe('All Users');

    // expect: Clicking the dropdown reveals multiple user type options
    const options = await eCardPage.userTypeSelect.locator('option').allTextContents();
    expect(options.length, 'User Type should have multiple options').toBeGreaterThan(1);

    // expect: A different user type can be selected
    await eCardPage.selectUserType('Administrator');
    await expect(eCardPage.userTypeSelect, 'User Type should accept Administrator selection').toHaveValue('1');

    // Restore default
    await eCardPage.userTypeSelect.selectOption({ label: 'All Users' });
    await expect(eCardPage.userTypeSelect.locator('option:checked')).toContainText('All Users');
  });
});
