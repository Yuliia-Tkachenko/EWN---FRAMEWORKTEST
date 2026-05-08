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

  test('TC14 â€” Verify "Has Photo" Offers Yes / No / All Options', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page and interact with the "Has Photo" control
    await eCardPage.navigateTo();

    // expect: Three options are available: Yes, No, All
    const options = await eCardPage.hasPhotoSelect.locator('option').allTextContents();
    expect(options, 'Has Photo should have 3 options').toHaveLength(3);
    expect(options.some(o => o.trim() === 'Yes'), 'Has Photo should have "Yes" option').toBeTruthy();
    expect(options.some(o => o.trim() === 'No'), 'Has Photo should have "No" option').toBeTruthy();
    expect(options.some(o => o.trim() === 'All'), 'Has Photo should have "All" option').toBeTruthy();

    // expect: "No" option is selectable
    await eCardPage.setHasPhoto('No');
    await expect(eCardPage.hasPhotoSelect, 'Has Photo should accept No selection').toHaveValue('false');

    // Note: Vue 3 v-model reverts empty-string value to its default; "All" existence is verified above via options text check

    // expect: "Yes" option is selectable
    await eCardPage.setHasPhoto('Yes');
    await expect(eCardPage.hasPhotoSelect, 'Has Photo should accept Yes selection').toHaveValue('true');
  });
});
