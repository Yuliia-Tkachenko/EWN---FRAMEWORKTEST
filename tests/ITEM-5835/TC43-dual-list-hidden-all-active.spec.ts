// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Dual List Associate Picker', () => {
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

  test('TC43 â€” Verify Dual List Is Hidden When "All Active Employees" Is Checked', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, check "All Active Employees"
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Verify dual list is visible after search
    await expect(eCardPage.dualListContainer, 'Dual list should be visible after search').toBeVisible();

    // Check "All Active Employees"
    await eCardPage.checkAllActiveEmployees();

    // expect: The entire dual list section is hidden
    await expect(
      eCardPage.dualListContainer,
      'Dual list container should be hidden when All Active Employees is checked'
    ).toBeHidden();

    // expect: Available Associates search box hidden
    await expect(eCardPage.availableSearchInput, 'Available search box should be hidden').toBeHidden();

    // expect: Move buttons hidden (inside dual list)
    await expect(eCardPage.moveRightButton, 'Right arrow button should be hidden').toBeHidden();
    await expect(eCardPage.moveLeftButton, 'Left arrow button should be hidden').toBeHidden();

    // expect: No duplicate or stale state from prior selections
    // The advanced filter component is also hidden
    await expect(
      eCardPage.advancedFilterComponent,
      'Advanced Employee Filter should be hidden when All Active is checked'
    ).toBeHidden();
  });
});
