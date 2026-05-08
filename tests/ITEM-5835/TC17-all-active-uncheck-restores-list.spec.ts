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

  test('TC17 â€” Verify Unchecking "All Active Employees" Restores the Dual List', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, click Search, check All Active Employees
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.checkAllActiveEmployees();

    // Confirm dual list is hidden
    await expect(eCardPage.dualListContainer, 'Dual list should be hidden when All Active checked').toBeHidden();

    // Uncheck "All Active Employees"
    await eCardPage.uncheckAllActiveEmployees();

    // expect: The dual list associate picker is restored and visible
    await expect(eCardPage.dualListContainer, 'Dual list should be visible after unchecking All Active').toBeVisible();
    await expect(eCardPage.availablePanel, 'Available Associates panel should be visible').toBeVisible();
    await expect(eCardPage.selectedPanel, 'Selected Associates panel should be visible').toBeVisible();

    // expect: The Advanced Employee Filter panel is accessible again
    await expect(eCardPage.advancedFilterComponent, 'Advanced Filter component should be visible').toBeVisible();
  });
});
