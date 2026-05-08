// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Edge Cases & Negative Scenarios', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000);
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

  test('TC52 â€” Verify Advanced Filter AND Logic: Restrictive Combination Returns Empty Results', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, expand Advanced Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // Get available Facility options and select one with known employees
    const facilityOptions = await eCardPage.facilitySelect.locator('option').allTextContents();
    const firstFacility = facilityOptions.find(opt => opt.trim() !== 'All');

    if (!firstFacility) {
      test.skip(); // Skip if no facility options available
      return;
    }

    // Select a specific Facility
    await eCardPage.selectFacility(firstFacility.trim());

    // Enter a Name that definitely does NOT exist in that Facility
    await eCardPage.fillNameAssociateId('ZZZZXXX_IMPOSSIBLE_NAME_999');

    // Click Search
    await eCardPage.clickSearch();
    await eCardPage.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });

    // expect: The Available Associates list is empty (AND condition produces zero matches)
    await expect(
      eCardPage.availableItems,
      'Available Associates should be empty when AND conditions produce no matches'
    ).toHaveCount(0, { timeout: 10000 });

    // expect: No employees from the selected Facility are shown
    await expect(
      eCardPage.availablePanel,
      'Available Associates panel should be visible (but empty)'
    ).toBeVisible();
  });
});
