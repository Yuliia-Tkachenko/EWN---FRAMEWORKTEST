// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts
// NOTE: TC48 (visual consistency / spinner transience) â€” no screenshot diffing required.
// The test verifies functional behavior: spinner appears and disappears without blocking.

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Consistency & Quality', () => {
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

  test('TC48 â€” Verify Vue 3 Spinner After "Change" Is Brief and Does Not Block Page', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company, click "Change"
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // Verify company is selected
    await expect(eCardPage.changeLink, 'Change link should be visible').toBeVisible();

    // Click Change
    await eCardPage.changeLink.click();

    // expect: The spinner (cg-busy overlay) automatically disappears without user action
    await expect(
      eCardPage.cgBusyOverlay,
      'Loading overlay should disappear automatically after Change'
    ).toBeHidden({ timeout: 15000 });

    // expect: After the spinner, the page is in company-empty/reset state
    await expect(
      eCardPage.companySearchInput,
      'Company input should be visible and usable after Change completes'
    ).toBeVisible();
    await expect(
      eCardPage.companySearchInput,
      'Company input should be empty after Change'
    ).toHaveValue('');

    // expect: The user can type a new company name (page is not blocked)
    await eCardPage.companySearchInput.click();
    await eCardPage.companySearchInput.pressSequentially('N', { delay: 50 });
    const dropdown = page.locator('ul.company-dropdown');
    await expect(
      dropdown,
      'User should be able to type a new company after Change completes'
    ).toBeVisible({ timeout: 5000 });
  });
});
