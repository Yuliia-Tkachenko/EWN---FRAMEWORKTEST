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

  test('TC39 â€” Verify Individual Row Checkbox Selects Only That Row', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    const totalCount = await eCardPage.getAvailableCount();
    expect(totalCount, 'Should have at least 2 items to test individual checkbox').toBeGreaterThanOrEqual(2);

    // Check the checkbox on the first row only
    const firstRowCheckbox = eCardPage.availableItems.first().locator('input[type="checkbox"]');
    await firstRowCheckbox.click();

    // expect: Only that row is checked
    await expect(firstRowCheckbox, 'First row checkbox should be checked').toBeChecked();

    // expect: Other rows remain unchecked
    const secondRowCheckbox = eCardPage.availableItems.nth(1).locator('input[type="checkbox"]');
    await expect(secondRowCheckbox, 'Second row checkbox should remain unchecked').not.toBeChecked();

    if (totalCount >= 3) {
      const thirdRowCheckbox = eCardPage.availableItems.nth(2).locator('input[type="checkbox"]');
      await expect(thirdRowCheckbox, 'Third row checkbox should remain unchecked').not.toBeChecked();
    }

    // expect: Select All checkbox is NOT checked (not all are selected)
    await expect(
      eCardPage.selectAllAvailable,
      'Select All should not be checked when only one row is selected'
    ).not.toBeChecked();
  });
});
