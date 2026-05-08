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

  test('TC28 â€” Verify Zero Search Results Shows Empty/No-Results State', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, type an impossible name in Name/Associate ID, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // Enter a name that definitely does not exist
    await eCardPage.fillNameAssociateId('ZZZZZZZ_DOES_NOT_EXIST');

    await eCardPage.clickSearch();

    // Wait for dual list to appear
    await expect(eCardPage.dualListContainer, 'Dual list container should appear even with zero results').toBeVisible({ timeout: 20000 });

    // expect: The Available Associates list is empty (no vs-repeat items rendered)
    await expect(
      eCardPage.availableItems,
      'Available Associates list should be empty for impossible search term'
    ).toHaveCount(0, { timeout: 15000 });

    // expect: The dual list section is visible (not hidden â€” just empty)
    await expect(eCardPage.availablePanel, 'Available panel should be visible even with no results').toBeVisible();
  });
});
