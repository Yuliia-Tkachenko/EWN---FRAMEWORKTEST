// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Dual List Associate Picker', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000);
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

  test('TC31 â€” Verify Dual List Is Hidden Until a Search Is Executed', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, do NOT click Search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // expect: The Available Associates section is not visible
    await expect(
      eCardPage.dualListContainer,
      'Dual list should be hidden before search is executed'
    ).toBeHidden();

    // expect: The Available Associates panel specifically is hidden
    await expect(eCardPage.availablePanel, 'Available Associates panel should not be visible before search').toBeHidden();

    // Step 2: Click Search
    await eCardPage.clickSearch();

    // expect: Both list sections appear
    await expect(
      eCardPage.dualListContainer,
      'Dual list should become visible after clicking Search'
    ).toBeVisible({ timeout: 20000 });
    await expect(eCardPage.availablePanel, 'Available Associates panel should be visible after search').toBeVisible();
    await expect(eCardPage.selectedPanel, 'Selected Associates panel should be visible after search').toBeVisible();
  });
});
