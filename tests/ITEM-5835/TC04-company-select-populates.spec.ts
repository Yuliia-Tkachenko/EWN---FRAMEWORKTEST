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

  test('TC04 â€” Verify Selecting Company from Autocomplete Populates the Field', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate and type 'NTC' in the Select Company field
    await eCardPage.navigateTo();

    // Select NTC company from autocomplete
    await eCardPage.selectCompany('NTC');

    // expect: The Select Company field displays the chosen company name
    await expect(eCardPage.selectedCompanyDisplay, 'Selected company display should show NTC').toContainText('NTC');

    // expect: The autocomplete dropdown closes
    const dropdown = page.locator('ul.dropdown-menu[uib-typeahead-popup]');
    await expect(dropdown, 'Dropdown should close after selection').toBeHidden();

    // expect: A "Change" link becomes visible next to the company field
    await expect(eCardPage.changeLink, 'Change link should appear after company selected').toBeVisible();

    // expect: The typeahead input is no longer shown
    await expect(eCardPage.companySearchInput, 'Typeahead input should be hidden after selection').toBeHidden();
  });
});
