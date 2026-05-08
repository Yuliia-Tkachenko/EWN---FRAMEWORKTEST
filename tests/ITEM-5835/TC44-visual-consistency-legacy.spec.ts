// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

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

  test('TC44 â€” Verify UI/UX Is Visually Consistent with the Legacy Version', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to eCard Data Export
    await eCardPage.navigateTo();

    // expect: Layout, spacing, font sizes, and color scheme are consistent
    // Structural checks (non-screenshot): verify key Bootstrap classes and layout elements

    // Page uses form-horizontal layout
    const formHorizontal = page.locator('.form-horizontal').first();
    await expect(formHorizontal, 'Page should use form-horizontal layout').toBeVisible();

    // Panels use Bootstrap panel-primary class
    const panelPrimary = page.locator('.panel.panel-primary').first();
    await expect(panelPrimary, 'Advanced Filter should use Bootstrap panel-primary').toBeVisible();

    // Well containers for filter groups
    const wellSm = page.locator('.well.well-sm').first();
    await expect(wellSm, 'Filter group should use Bootstrap well-sm container').toBeVisible();

    // Select Company label uses control-label class
    const companyLabel = page.locator('label.control-label[for="txtCompany"]');
    await expect(companyLabel, 'Select Company label should use control-label class').toBeVisible();
    await expect(companyLabel).toContainText('Select Company');

    // Has Photo and Has eCard labels present
    const hasPhotoLabel = page.locator('label.control-label[for="ddlHasPhoto"]');
    await expect(hasPhotoLabel, 'Has Photo label should be visible').toBeVisible();

    const hasECardLabel = page.locator('label.control-label[for="ddlHasCard"]');
    await expect(hasECardLabel, 'Has eCard label should be visible').toBeVisible();

    // Search button uses Bootstrap btn class
    await expect(eCardPage.searchButton, 'Search button should be visible').toBeVisible();
    const searchBtnClass = await eCardPage.searchButton.getAttribute('class');
    expect(searchBtnClass, 'Search button should have Bootstrap btn class').toContain('btn');
  });
});
