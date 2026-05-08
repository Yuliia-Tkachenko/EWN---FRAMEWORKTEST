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

  test('TC37 â€” Verify "Select All" with Active Filter Only Selects Visible (Filtered) Items', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    const totalCount = await eCardPage.getAvailableCount();
    expect(totalCount, 'Should have multiple items to filter').toBeGreaterThan(1);

    // Get a filter fragment from the first item
    const firstRowText = await eCardPage.getFirstAvailableText();
    const filterFragment = firstRowText.split(',')[0].trim().substring(0, 3);

    // Type a filter to narrow the list
    await eCardPage.filterAvailableList(filterFragment);

    const filteredCount = await eCardPage.getAvailableCount();

    // Click "Select All" on the filtered list
    await eCardPage.clickSelectAllAvailable();

    // expect: Only visible (filtered) rows are checked
    await expect(
      eCardPage.selectAllAvailable,
      'Select All should be checked after clicking on filtered list'
    ).toBeChecked();

    // Verify filtered items are checked
    if (filteredCount > 0) {
      const firstCheckbox = eCardPage.availableItems.first().locator('input[type="checkbox"]');
      await expect(firstCheckbox, 'First filtered item should be checked').toBeChecked();
    }

    // Clear filter to see all items
    await eCardPage.clearAvailableFilter();

    // expect: The count increased back; previously hidden items should not be selected
    // (Their checkboxes should remain unchecked because only filtered subset was selected)
    const restoredCount = await eCardPage.getAvailableCount();
    if (restoredCount > filteredCount) {
      // Items outside the filter were not visible and should not have been selected
      // The last item (beyond the filter count) should not be checked
      const lastCheckbox = eCardPage.availableItems.last().locator('input[type="checkbox"]');
      await expect(
        lastCheckbox,
        'Items outside the filter should not be checked by Select All on filtered list'
      ).not.toBeChecked();
    }
  });
});
