// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Top Level Filters', () => {
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

  test('TC16 â€” Verify Checking "All Active Employees" Hides Advanced Filter and Dual List', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company, click Search to reveal the dual list
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Verify dual list is visible after search
    await expect(eCardPage.dualListContainer, 'Dual list should be visible after search').toBeVisible();

    // Check "All Active Employees"
    await eCardPage.checkAllActiveEmployees();

    // expect: The Advanced Employee Filter component is hidden (ng-hide applied)
    await expect(
      eCardPage.advancedFilterComponent,
      'Advanced Employee Filter should be hidden when All Active Employees is checked'
    ).toBeHidden();

    // expect: The Available Associates list is hidden
    await expect(eCardPage.dualListContainer, 'Dual list should be hidden when All Active Employees is checked').toBeHidden();
  });
});
