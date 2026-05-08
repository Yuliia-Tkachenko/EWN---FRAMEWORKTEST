// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Consistency & Quality', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000);
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

  test('TC49 â€” Verify No New Console Errors or Warnings Are Introduced', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Collect JS errors throughout all interactions
    const jsErrors: string[] = [];
    page.on('pageerror', err => jsErrors.push(err.message));

    // Step 1: Navigate to page
    await eCardPage.navigateTo();

    // Step 2: Select a company
    await eCardPage.selectCompany('NTC');

    // Step 3: Expand Advanced Employee Filter
    await eCardPage.expandAdvancedFilter();

    // Step 4: Run a search
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Step 5: Move associates between lists
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'Item should be in Selected').toBeVisible({ timeout: 10000 });
    await eCardPage.moveFirstSelectedToAvailable();

    // Step 6: Check and uncheck "All Active Employees"
    await eCardPage.checkAllActiveEmployees();
    await eCardPage.uncheckAllActiveEmployees();

    // expect: No new JavaScript errors appear in the browser console throughout all interactions
    // Filter out known benign ResizeObserver errors
    const criticalErrors = jsErrors.filter(
      e => !e.includes('ResizeObserver') && !e.includes('Non-Error exception captured')
    );
    expect(
      criticalErrors,
      `No JavaScript errors should occur during typical interactions. Found: ${criticalErrors.join(', ')}`
    ).toHaveLength(0);
  });
});
