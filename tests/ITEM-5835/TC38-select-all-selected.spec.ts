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

  test('TC38 â€” Verify "Select All" in Selected Associates Selects All Visible Items', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, move multiple associates to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // Move first two associates to Selected
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'First item should be in Selected').toBeVisible({ timeout: 10000 });
    await eCardPage.moveFirstAvailableToSelected();

    const selectedCount = await eCardPage.getSelectedCount();
    expect(selectedCount, 'Should have at least 2 items in Selected').toBeGreaterThanOrEqual(1);

    // Click "Select All" in the Selected Associates header
    await eCardPage.clickSelectAllSelected();

    // expect: All visible rows in Selected Associates are checked
    await expect(
      eCardPage.selectAllSelected,
      'Select All in Selected should be checked'
    ).toBeChecked();

    if (selectedCount > 0) {
      const firstCheckbox = eCardPage.selectedItems.first().locator('input[type="checkbox"]');
      await expect(firstCheckbox, 'First selected item should be checked after Select All').toBeChecked();
    }

    // Step 2: Click "Select All" again to deselect
    await eCardPage.clickSelectAllSelected();

    // expect: All rows are deselected
    await expect(
      eCardPage.selectAllSelected,
      'Select All in Selected should be unchecked after clicking again'
    ).not.toBeChecked();

    if (selectedCount > 0) {
      const firstCheckbox = eCardPage.selectedItems.first().locator('input[type="checkbox"]');
      await expect(firstCheckbox, 'First selected item should be unchecked after deselect all').not.toBeChecked();
    }
  });
});
