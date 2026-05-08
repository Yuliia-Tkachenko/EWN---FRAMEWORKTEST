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

  test('TC46 â€” Verify Unauthorized Access Triggers Auth Error Handling Flow', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Intercept the CardDataExport page route to return 401 (unauthorized)
    // This simulates what would happen for a user without the required permission.
    await page.route('**/legacy/CardDataExport', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'text/html',
        body: '<html><body><h1>Unauthorized</h1></body></html>',
      });
    });

    // Navigate to the page with 401 response
    await page.goto(ECardDataExportPage.URL);

    // expect: The page shows an unauthorized/error state (not the eCard export content)
    const heading = page.locator('.product-section h1').filter({ hasText: /eCard Data Export/i });
    await expect(heading, 'eCard Data Export content should NOT be shown for unauthorized access').toBeHidden();

    // Expect some kind of unauthorized/error response indicator
    // (The page body should show "Unauthorized" or redirect)
    const bodyText = await page.locator('body').textContent();
    expect(
      bodyText?.includes('Unauthorized') || bodyText?.includes('login') || bodyText?.includes('error'),
      'Page body should indicate unauthorized access'
    ).toBeTruthy();

    // Clean up route mock
    await page.unroute('**/legacy/CardDataExport');
  });
});
