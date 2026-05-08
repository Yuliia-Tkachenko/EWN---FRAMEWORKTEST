// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Advanced Employee Filter', () => {
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

  test('TC24 â€” Verify Multiple Filters Are Combined with AND Logic', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company NTC, expand Advanced Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // Get available Facility options (pick first non-All option)
    const facilityOptions = await eCardPage.facilitySelect.locator('option').allTextContents();
    const firstFacility = facilityOptions.find(opt => opt !== 'All');

    // Get available Job Title options (pick first non-All option)
    const jobTitleOptions = await eCardPage.jobTitleSelect.locator('option').allTextContents();
    const firstJobTitle = jobTitleOptions.find(opt => opt !== 'All');

    if (!firstFacility || !firstJobTitle) {
      test.skip(); // Skip if no options available for this company
      return;
    }

    // Select a specific Facility and Job Title
    await eCardPage.selectFacility(firstFacility);
    await eCardPage.selectJobTitle(firstJobTitle);

    // Click Search
    await eCardPage.clickSearch();
    await eCardPage.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });

    // Wait for dual list (could be empty if AND logic produces 0 results)
    const availableCount = await eCardPage.getAvailableCount();

    // expect: Results are scoped to the AND combination
    // We verify by doing a broader search (only facility) and comparing
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();
    await eCardPage.selectFacility(firstFacility);
    await eCardPage.clickSearch();
    await eCardPage.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });
    const facilityOnlyCount = await eCardPage.getAvailableCount();

    // expect: AND logic produces equal or fewer results than single-filter search
    expect(
      availableCount,
      'AND logic (Facility + Job Title) should return equal or fewer results than Facility alone'
    ).toBeLessThanOrEqual(facilityOnlyCount);
  });
});
