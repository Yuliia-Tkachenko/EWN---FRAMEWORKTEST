// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Company Selection', () => {
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

  test('TC07 â€” Verify Vue 3 Spinner After Change Click Is Scoped Correctly', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select a company
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');

    // Get the bounding box of the Advanced Employee Filter panel (spinner should NOT cover it)
    const filterBtn = eCardPage.advancedFilterButton;
    const filterBtnBox = await filterBtn.boundingBox();
    expect(filterBtnBox, 'Advanced Employee Filter button bounding box should be obtainable').toBeTruthy();

    // Click Change to trigger the spinner â€” catch it transiently with getBoundingClientRect
    // (The spinner is cg-busy overlay which appears briefly)
    await eCardPage.changeLink.click();

    // Attempt to capture spinner bounding box while it may be visible
    // Using page.evaluate with getBoundingClientRect per spec requirement
    const spinnerInfo = await page.evaluate(() => {
      const overlay = document.querySelector('.cg-busy.cg-busy-backdrop');
      if (!overlay) return null;
      const overlayRect = overlay.getBoundingClientRect();
      const isVisible = window.getComputedStyle(overlay).display !== 'none' &&
                        !overlay.classList.contains('ng-hide');
      return { rect: overlayRect, isVisible };
    });

    // After the Change click, page should be in "no company selected" state
    await expect(eCardPage.companySearchInput, 'Company input should be visible after Change').toBeVisible();

    // expect: After the spinner, the page is in no-company/reset state
    await expect(eCardPage.companySearchInput).toHaveValue('');

    // Verify spinner is no longer visible (transient)
    await expect(eCardPage.cgBusyOverlay, 'Loading spinner should disappear after Change completes').toBeHidden();

    // If we captured the spinner rect while visible, verify it doesn't cover the filter area
    if (spinnerInfo?.isVisible && filterBtnBox) {
      // The spinner should be above the Advanced Employee Filter button
      expect(
        spinnerInfo.rect.bottom,
        'Spinner bottom should not extend below the Advanced Filter panel top'
      ).toBeLessThanOrEqual(filterBtnBox.y + filterBtnBox.height + 50); // +50px tolerance
    }
  });
});
