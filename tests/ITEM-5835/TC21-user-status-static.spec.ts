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

  test('TC21 â€” Verify "User Status" Displays "Active" as Static Non-Editable Value', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, expand Advanced Employee Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // expect: A "User Status" field shows the text "Active"
    await expect(
      eCardPage.userStatusDisplay,
      'User Status should display "Active"'
    ).toBeVisible();
    await expect(eCardPage.userStatusDisplay).toContainText('Active');

    // expect: The "User Status" field is read-only / not editable
    // It uses a .form-control-static div, not an input â€” so it's not a form element
    const tagName = await eCardPage.userStatusDisplay.evaluate(el => el.tagName.toLowerCase());
    expect(
      tagName,
      'User Status should be a static display element (div), not an input'
    ).not.toBe('input');
    expect(
      tagName,
      'User Status should be a static display element (div), not a select'
    ).not.toBe('select');
  });
});
