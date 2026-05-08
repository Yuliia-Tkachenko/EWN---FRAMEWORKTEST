// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: All Active Employees Override', () => {
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

  test('TC26 â€” Verify Dual List Hides When "All Active Employees" Is Checked Regardless of Prior Selections', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, move associates to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Move one associate to Selected Associates
    await eCardPage.moveFirstAvailableToSelected();
    await expect(
      eCardPage.selectedItems.first(),
      'Selected Associates should have at least one item'
    ).toBeVisible({ timeout: 10000 });

    // Verify dual list is visible with both panels populated
    await expect(eCardPage.dualListContainer, 'Dual list should be visible before checking All Active').toBeVisible();

    // Check "All Active Employees"
    await eCardPage.checkAllActiveEmployees();

    // expect: Both Available and Selected Associates lists immediately become hidden
    await expect(
      eCardPage.dualListContainer,
      'Dual list should be hidden when All Active Employees is checked (behavioral change from legacy)'
    ).toBeHidden();

    // expect: No confusion state â€” the advanced filter component is also hidden
    await expect(
      eCardPage.advancedFilterComponent,
      'Advanced Employee Filter should be hidden when All Active Employees is checked'
    ).toBeHidden();
  });
});
