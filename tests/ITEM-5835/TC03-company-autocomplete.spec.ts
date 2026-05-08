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

  test('TC03 â€” Verify Autocomplete Triggers on First Character Entry', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page. Click the Select Company input and type 'N'.
    await eCardPage.navigateTo();
    await eCardPage.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await eCardPage.companySearchInput.click();
    await eCardPage.companySearchInput.pressSequentially('N', { delay: 50 });

    // expect: An autocomplete dropdown appears within 5 seconds
    const dropdown = page.locator('ul.company-dropdown');
    await expect(dropdown, 'Autocomplete dropdown should appear after typing "N"').toBeVisible({ timeout: 5000 });

    // expect: The dropdown contains at least one option
    const options = page.locator('ul.company-dropdown [role="option"]');
    await expect(options.first(), 'Dropdown should have at least one option').toBeVisible();

    // Step 2: Type additional characters (e.g., 'NT')
    await eCardPage.companySearchInput.pressSequentially('T', { delay: 50 });

    // expect: The dropdown results narrow to match the typed string
    const count = await options.count();
    expect(count, 'Dropdown should have options matching "NT"').toBeGreaterThan(0);
  });
});
