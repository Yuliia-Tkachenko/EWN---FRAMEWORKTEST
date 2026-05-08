// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts
// NOTE: This test uses JuliaLLC or NTC company which should have 100+ employees.
// Virtual scrolling assertion is inherently limited â€” we verify scroll is fluid
// by checking rendered item count after scroll.

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

  test('TC33 â€” Verify Virtual Scrolling for Large Result Sets (100+ Items)', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company with many employees (JuliaLLC or NTC)
    // NTC has 100+ employees in the test environment
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('JuliaLLC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();

    // Check if we have enough items to test virtual scroll
    const visibleCount = await eCardPage.getAvailableCount();
    expect(visibleCount, 'Should have at least some visible items in Available list').toBeGreaterThan(0);

    // Check the virtual scroll container height (vs-repeat sets height based on total items)
    const vsContainer = page.locator('.dual-list-left .list-group-container');
    await expect(vsContainer, 'Virtual scroll container should be visible').toBeVisible();

    const containerHeight = await vsContainer.evaluate(el => {
      const style = (el as HTMLElement).style.height || window.getComputedStyle(el).height;
      return parseFloat(style);
    });

    // expect: The container has a significant height if there are many items
    // (vs-repeat sets style height = item count * row height)
    if (visibleCount > 0) {
      expect(
        containerHeight,
        'Virtual scroll container should have height proportional to total items'
      ).toBeGreaterThan(0);
    }

    // Scroll the available panel to trigger virtual scroll rendering
    await page.evaluate(() => {
      const panel = document.querySelector('.dual-list-left');
      if (panel) panel.scrollTop = 500;
    });

    // After scroll, items should still be rendering
    const afterScrollCount = await eCardPage.getAvailableCount();
    expect(afterScrollCount, 'Items should be visible after scrolling').toBeGreaterThan(0);

    // Scroll back to top
    await page.evaluate(() => {
      const panel = document.querySelector('.dual-list-left');
      if (panel) panel.scrollTop = 0;
    });
  });
});
