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

  test('TC51 â€” Verify Search Button Does Nothing Without Company (Negative Test)', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Track network requests to the search API
    const searchRequests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('searchCompanyAssociates') || req.url().includes('card-data') || req.url().includes('associates')) {
        searchRequests.push(req.url());
      }
    });

    // Step 1: Navigate â€” do NOT select a company
    await eCardPage.navigateTo();

    // Verify no company is selected
    await expect(eCardPage.companySearchInput, 'Company input should be visible (no company selected)').toBeVisible();
    await expect(eCardPage.companySearchInput).toHaveValue('');

    // Attempt to click Search
    await eCardPage.clickSearch();

    // expect: A validation message or disabled state prevents execution
    await expect(
      eCardPage.companyValidationError,
      'Required validation message should appear when clicking Search without company'
    ).toBeVisible();
    await expect(eCardPage.companyValidationError).toContainText(/required/i);

    // expect: No network requests were dispatched to the search API
    // BUG (Test env): search requests ARE fired despite the validation error.
    expect(
      searchRequests,
      'No search API requests should fire when no company is selected'
    ).toHaveLength(0);

    // expect: The dual list section remains hidden â€" search was truly blocked
    // Pre-prod correctly keeps this hidden; Test env shows it with results (known bug).
    await expect(
      eCardPage.dualListContainer,
      'Dual list section must remain hidden when no company is selected'
    ).toBeHidden({ timeout: 5000 });

    await expect(
      eCardPage.availableItems,
      'Available Associates list must be empty when search is blocked by missing company'
    ).toHaveCount(0, { timeout: 5000 });

    // expect: Export CSV must not be visible without a company and without search results
    await expect(
      eCardPage.exportCsvButton,
      'Export CSV button must remain hidden when no company is selected'
    ).toBeHidden();
  });
});
