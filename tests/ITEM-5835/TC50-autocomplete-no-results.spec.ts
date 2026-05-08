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

  test('TC50 â€” Verify Company Autocomplete Shows No Results for Unrecognized Input', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, type an unrecognized company name
    await eCardPage.navigateTo();
    await eCardPage.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await eCardPage.companySearchInput.click();
    await eCardPage.companySearchInput.pressSequentially('ZZZZNOTACOMPANY', { delay: 50 });

    // Wait for the autocomplete to process
    const dropdown = page.locator('ul.dropdown-menu[uib-typeahead-popup]');

    // expect: Either no dropdown appears, or dropdown shows no results
    // The dropdown may remain hidden or show zero options
    const isDropdownVisible = await dropdown.isVisible().catch(() => false);

    if (isDropdownVisible) {
      const optionCount = await page.locator('ul.dropdown-menu[uib-typeahead-popup] li').count();
      expect(
        optionCount,
        'Dropdown should show 0 options for unrecognized input'
      ).toBe(0);
    } else {
      // Dropdown did not appear â€” which is also acceptable behavior
      await expect(dropdown, 'Dropdown should remain hidden for unrecognized input').toBeHidden();
    }

    // expect: No error or crash occurs â€” page remains functional
    const heading = page.locator('.product-section h1').filter({ hasText: /eCard Data Export/i });
    await expect(heading, 'Page should remain functional after no-results search').toBeVisible();
  });
});
