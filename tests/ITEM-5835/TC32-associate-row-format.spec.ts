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

  test('TC32 â€” Verify Associate Row Format Is "LastName, FirstName - EWN ID"', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company NTC, click Search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // expect: Each row matches the pattern 'LastName, FirstName - EWN-XXXXXX'
    const rowPattern = /^[^,]+,\s+[^-]+-\s+EWN-\d+$/;

    // Check first visible row
    const firstRowText = (await eCardPage.availableItems.first().locator('span').textContent()) ?? '';
    expect(
      firstRowText.trim(),
      `Row "${firstRowText}" should match format "LastName, FirstName - EWN-XXXXXX"`
    ).toMatch(rowPattern);

    // Check a few more rows if they exist
    const count = await eCardPage.getAvailableCount();
    if (count >= 2) {
      const secondRowText = (await eCardPage.availableItems.nth(1).locator('span').textContent()) ?? '';
      expect(
        secondRowText.trim(),
        `Second row "${secondRowText}" should match format "LastName, FirstName - EWN-XXXXXX"`
      ).toMatch(rowPattern);
    }
  });
});
