// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Top Level Filters', () => {
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

  test('TC13 â€” Verify "All Active Employees" Is Unchecked on Page Load', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page
    await eCardPage.navigateTo();

    // expect: The "All Active Employees" checkbox is unchecked on initial page load
    await expect(
      eCardPage.allActiveCheckbox,
      'All Active Employees checkbox should be unchecked by default on page load'
    ).not.toBeChecked();
  });
});
