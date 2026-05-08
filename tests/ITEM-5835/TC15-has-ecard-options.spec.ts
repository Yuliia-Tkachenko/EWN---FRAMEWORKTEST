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

  test('TC15 â€” Verify "Has eCard" Offers Yes / No / All Options', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate to page and interact with the "Has eCard" control
    await eCardPage.navigateTo();

    // expect: Three options are available: Yes, No, All
    const options = await eCardPage.hasECardSelect.locator('option').allTextContents();
    expect(options, 'Has eCard should have 3 options').toHaveLength(3);
    expect(options.some(o => o.trim() === 'Yes'), 'Has eCard should have "Yes" option').toBeTruthy();
    expect(options.some(o => o.trim() === 'No'), 'Has eCard should have "No" option').toBeTruthy();
    expect(options.some(o => o.trim() === 'All'), 'Has eCard should have "All" option').toBeTruthy();

    // expect: "Yes" option is selectable
    await eCardPage.setHasECard('Yes');
    await expect(eCardPage.hasECardSelect, 'Has eCard should accept Yes selection').toHaveValue('true');

    // expect: "All" option is selectable
    await eCardPage.setHasECard('All');
    await expect(eCardPage.hasECardSelect, 'Has eCard should accept All selection').toHaveValue('');

    // Restore default
    await eCardPage.setHasECard('No');
    await expect(eCardPage.hasECardSelect, 'Has eCard should restore to No').toHaveValue('false');
  });
});
