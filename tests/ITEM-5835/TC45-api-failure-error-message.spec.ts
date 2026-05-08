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

  test('TC45 â€” Verify API Failure Displays Appropriate Error Message', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Intercept the company autocomplete API to return a 500 error
    await page.route('**/api/companies**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Navigate to page
    await eCardPage.navigateTo();

    // Collect JS errors
    const jsErrors: string[] = [];
    page.on('pageerror', err => jsErrors.push(err.message));

    // Type in the company field to trigger the 500 error
    await eCardPage.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await eCardPage.companySearchInput.click();
    await eCardPage.companySearchInput.pressSequentially('NTC', { delay: 50 });

    // Wait briefly for the error response to be processed
    await page.waitForTimeout(2000);

    // expect: An error message or toast notification is displayed to the user
    // BUG: App silently swallows the 500 error â€" no toast or error message is shown.
    // The test correctly fails here until the app implements proper error handling.
    await expect(
      eCardPage.toastAlert,
      'A toast or error notification should be displayed when the API returns a 500'
    ).toBeVisible({ timeout: 5000 });

    // expect: The page does not crash or display a blank/broken state
    const heading = page.locator('.product-section h1').filter({ hasText: /eCard Data Export/i });
    await expect(heading, 'Page heading should still be visible after API error').toBeVisible();

    // expect: No unhandled JavaScript errors appear in the console
    const criticalErrors = jsErrors.filter(e => !e.includes('ResizeObserver'));
    expect(criticalErrors, 'No critical JavaScript errors should occur on API failure').toHaveLength(0);

    // Clean up the route mock
    await page.unroute('**/api/companies**');
  });
});
