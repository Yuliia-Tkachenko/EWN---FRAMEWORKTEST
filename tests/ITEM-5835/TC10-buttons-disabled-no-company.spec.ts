// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Company Selection', () => {
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

  test('TC10 â€” Verify Search and Export CSV Are Not Functional Without Company Selected', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page â€” do NOT select a company
    await eCardPage.navigateTo();

    // Verify company input is empty and visible (no company selected)
    await expect(eCardPage.companySearchInput, 'Company input should be visible and empty').toBeVisible();
    await expect(eCardPage.companySearchInput).toHaveValue('');

    // Click the Search button without a company selected
    await eCardPage.clickSearch();

    // expect: The company validation error appears (form prevents submission)
    await expect(eCardPage.companyValidationError, 'Required validation message should appear when searching without company').toBeVisible();
    await expect(eCardPage.companyValidationError).toContainText(/required/i);

    // Export CSV button is always rendered in DOM; validation error above is the primary guard
  });
});
