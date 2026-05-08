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

  test('TC19 â€” Verify Clicking Filter Panel Header Toggles Collapse/Expand', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, click the Advanced Employee Filter header
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // Initial state: collapsed
    await expect(eCardPage.advancedFilterPanel, 'Panel should start collapsed').toBeHidden();

    // Click header to expand
    await eCardPage.advancedFilterButton.click();

    // expect: The panel expands and filter fields become visible
    await expect(
      eCardPage.advancedFilterPanel,
      'Panel should expand after clicking header'
    ).toBeVisible({ timeout: 5000 });
    await expect(eCardPage.facilitySelect, 'Facility dropdown should be visible when expanded').toBeVisible();

    // expect: aria-expanded="true"
    await expect(eCardPage.advancedFilterButton).toHaveAttribute('aria-expanded', 'true');

    // Step 2: Click the header again to collapse
    await eCardPage.advancedFilterButton.click();

    // expect: The panel collapses and filter fields are hidden
    await expect(
      eCardPage.advancedFilterPanel,
      'Panel should collapse after clicking header again'
    ).toBeHidden({ timeout: 5000 });

    // expect: aria-expanded="false"
    await expect(eCardPage.advancedFilterButton).toHaveAttribute('aria-expanded', 'false');
  });
});
