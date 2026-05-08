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

  test('TC36 â€” Verify "Select All" in Available Associates Selects All Visible Items', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // Click the "Select All" checkbox in Available Associates header
    await eCardPage.clickSelectAllAvailable();

    // expect: All currently visible rows in Available Associates are checked
    // Verify the Select All checkbox itself is checked
    await expect(
      eCardPage.selectAllAvailable,
      'Select All checkbox should be checked after clicking'
    ).toBeChecked();

    // Verify visible items have their checkboxes checked
    const visibleCount = await eCardPage.getAvailableCount();
    if (visibleCount > 0) {
      const firstCheckbox = eCardPage.availableItems.first().locator('input[type="checkbox"]');
      await expect(firstCheckbox, 'First available item should be checked after Select All').toBeChecked();
    }

    // Step 2: Click "Select All" again to deselect
    await eCardPage.clickSelectAllAvailable();

    // expect: All checked rows are deselected
    await expect(
      eCardPage.selectAllAvailable,
      'Select All checkbox should be unchecked after clicking again'
    ).not.toBeChecked();

    if (visibleCount > 0) {
      const firstCheckbox = eCardPage.availableItems.first().locator('input[type="checkbox"]');
      await expect(firstCheckbox, 'First available item should be unchecked after deselect all').not.toBeChecked();
    }
  });
});
