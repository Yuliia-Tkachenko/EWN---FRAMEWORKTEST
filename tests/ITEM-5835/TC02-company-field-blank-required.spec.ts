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

  test('TC02 â€” Verify Select Company Field Is Blank and Required on Page Load', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page â€” do NOT interact with the company field
    await eCardPage.navigateTo();

    // expect: The Select Company input field is visible and empty
    await expect(eCardPage.companySearchInput, 'Company search input should be visible').toBeVisible();
    await expect(eCardPage.companySearchInput, 'Company search input should be empty on load').toHaveValue('');

    // expect: A magnifying glass icon/overlay is displayed on the Select Company field
    await expect(eCardPage.companyMagnifyingGlass, 'Magnifying glass icon should be visible').toBeVisible();

    // expect: The dual list section is not visible (no company selected, no search done)
    await expect(eCardPage.dualListContainer, 'Dual list section should be hidden on initial page load').toBeHidden();

    // expect: The Export CSV button is not visible (no company selected, no search done)
    await expect(eCardPage.exportCsvButton, 'Export CSV button should not be visible without company').toBeHidden();
  });
});
