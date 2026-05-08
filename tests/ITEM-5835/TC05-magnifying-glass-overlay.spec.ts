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

  test('TC05 â€” Verify Magnifying Glass Overlay on Select Company Field', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page
    await eCardPage.navigateTo();

    // expect: A magnifying glass icon is visible before company is selected
    await expect(
      eCardPage.companyMagnifyingGlass,
      'Magnifying glass icon should be visible before company is selected'
    ).toBeVisible();

    // Select a company
    await eCardPage.selectCompany('NTC');

    // expect: Company is now selected (Change link visible)
    await expect(eCardPage.changeLink, 'Change link should be visible after selection').toBeVisible();

    // Click Change to go back to input state
    await eCardPage.clickChangeCompany();

    // expect: Magnifying glass is still visible after going back to input state
    await expect(
      eCardPage.companyMagnifyingGlass,
      'Magnifying glass icon should still be visible after clicking Change'
    ).toBeVisible();
  });
});
