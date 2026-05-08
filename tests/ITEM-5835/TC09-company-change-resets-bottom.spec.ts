// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Company Selection', () => {
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

  test('TC09 â€” Verify Changing Company Resets and Hides Bottom-Level Controls', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, run search, move an associate to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // Run search to populate dual list
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Verify dual list is visible after search
    await expect(eCardPage.dualListContainer, 'Dual list should appear after search').toBeVisible();

    // Move one associate to Selected
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'Selected Associates should have an item').toBeVisible({ timeout: 10000 });

    // Click Change to reset company selection
    await eCardPage.clickChangeCompany();

    // expect: The Available Associates list is hidden
    await expect(eCardPage.dualListContainer, 'Dual list should be hidden after Change').toBeHidden();

    // expect: The Export to CSV button is hidden
    await expect(eCardPage.exportCsvButton, 'Export CSV button should be hidden after Change').toBeHidden();
  });
});
