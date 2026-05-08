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

  test('TC34 â€” Verify Available Associates Search Box Filters in Real Time', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search to populate Available list
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    const totalCountBefore = await eCardPage.getAvailableCount();
    expect(totalCountBefore, 'Should have items before filtering').toBeGreaterThan(0);

    // Get first row text to use as filter
    const firstRowText = await eCardPage.getFirstAvailableText();
    const filterFragment = firstRowText.split(',')[0].trim().substring(0, 3); // First 3 chars of last name

    // Type a name fragment in the Available Associates search box
    await eCardPage.filterAvailableList(filterFragment);

    // expect: The Available Associates list is filtered immediately
    // (vs-repeat renders only visible items â€” count changes)
    const filteredCount = await eCardPage.getAvailableCount();
    expect(
      filteredCount,
      `Filtering by "${filterFragment}" should reduce visible items from ${totalCountBefore}`
    ).toBeLessThanOrEqual(totalCountBefore);

    // expect: Only rows containing the typed text are shown
    if (filteredCount > 0) {
      const filteredRowText = (await eCardPage.availableItems.first().locator('span').textContent()) ?? '';
      expect(
        filteredRowText.toLowerCase(),
        `Filtered row should contain "${filterFragment.toLowerCase()}"`
      ).toContain(filterFragment.toLowerCase());
    }

    // Step 2: Clear the search box
    await eCardPage.clearAvailableFilter();

    // expect: All results return to the Available Associates list
    const restoredCount = await eCardPage.getAvailableCount();
    expect(
      restoredCount,
      'Clearing the filter should restore all items to Available list'
    ).toBe(totalCountBefore);
  });
});
