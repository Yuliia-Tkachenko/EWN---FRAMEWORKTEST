// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Search', () => {
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

  test('TC27 â€” Verify Clicking Search Populates the Available Associates List', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company NTC, click Search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();

    // expect: The dual list section becomes visible
    await expect(eCardPage.dualListContainer, 'Dual list should appear after search').toBeVisible({ timeout: 20000 });

    // expect: The Available Associates list appears with one or more results
    await eCardPage.expectAvailableListHasItems();
    const count = await eCardPage.getAvailableCount();
    expect(count, 'Available Associates should have at least one result').toBeGreaterThan(0);

    // expect: Each row displays in the format 'LastName, FirstName - EWN ID'
    const firstRowText = await eCardPage.getFirstAvailableText();
    expect(
      firstRowText,
      `First row "${firstRowText}" should match format LastName, FirstName - EWN-XXXXXX`
    ).toMatch(/\w.+,\s+\w.+\s+-\s+EWN-\d+/);

    // expect: Both Available and Selected panels are visible
    await expect(eCardPage.availablePanel, 'Available Associates panel should be visible').toBeVisible();
    await expect(eCardPage.selectedPanel, 'Selected Associates panel should be visible').toBeVisible();
  });
});
