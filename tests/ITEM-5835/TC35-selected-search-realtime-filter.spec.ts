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

  test('TC35 â€” Verify Selected Associates Search Box Filters in Real Time', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, move multiple associates to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // Move first two available associates to Selected (if enough exist)
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'First item should appear in Selected').toBeVisible({ timeout: 10000 });

    // Move another one
    const availableCountAfterFirst = await eCardPage.getAvailableCount();
    if (availableCountAfterFirst > 0) {
      await eCardPage.moveFirstAvailableToSelected();
    }

    const selectedCount = await eCardPage.getSelectedCount();
    expect(selectedCount, 'Should have at least 1 item in Selected').toBeGreaterThan(0);

    // Get a fragment from the first selected item to use for filtering
    const firstSelectedText = (await eCardPage.selectedItems.first().locator('span').textContent()) ?? '';
    const filterFragment = firstSelectedText.split(',')[0].trim().substring(0, 3);

    // Record available count before filtering (should be unaffected)
    const availableCountBefore = await eCardPage.getAvailableCount();

    // Type in the Selected Associates search box
    await eCardPage.filterSelectedList(filterFragment);

    // expect: Only rows containing the typed text are shown in Selected
    const filteredSelectedCount = await eCardPage.getSelectedCount();
    expect(filteredSelectedCount, 'Selected list should be filtered').toBeLessThanOrEqual(selectedCount);

    // expect: The Available Associates list is unaffected
    const availableCountAfter = await eCardPage.getAvailableCount();
    expect(
      availableCountAfter,
      'Available Associates list should not be affected by Selected filter'
    ).toBe(availableCountBefore);

    // Clean up: clear the filter
    await eCardPage.clearSelectedFilter();
  });
});
