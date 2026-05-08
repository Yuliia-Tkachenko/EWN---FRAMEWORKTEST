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

  test('TC18 â€” Verify Advanced Employee Filter Panel Is Collapsed by Default', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company, do NOT click the filter header
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // expect: The Advanced Employee Filter panel is collapsed (body hidden)
    await expect(
      eCardPage.advancedFilterPanel,
      'Advanced Employee Filter body should be hidden by default'
    ).toBeHidden();

    // expect: The panel header is visible
    await expect(
      eCardPage.advancedFilterButton,
      'Advanced Employee Filter header/button should be visible'
    ).toBeVisible();

    // expect: aria-expanded="false" on the toggle button (collapsed state indicator)
    await expect(eCardPage.advancedFilterButton).toHaveAttribute('aria-expanded', 'false');

    // expect: The dropdown fields are not visible (collapsed)
    await expect(eCardPage.facilitySelect, 'Facility dropdown should not be visible when collapsed').toBeHidden();
    await expect(eCardPage.jobTitleSelect, 'Job Title dropdown should not be visible when collapsed').toBeHidden();
  });
});
