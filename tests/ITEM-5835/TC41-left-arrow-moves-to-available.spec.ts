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

  test('TC41 â€” Verify Left Arrow Moves Checked Items from Selected Back to Available', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search, move two associates to Selected
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    // Move first associate to Selected
    await eCardPage.moveFirstAvailableToSelected();
    await expect(eCardPage.selectedItems.first(), 'First item in Selected should be visible').toBeVisible({ timeout: 10000 });

    // Move second associate to Selected
    const availableCount = await eCardPage.getAvailableCount();
    if (availableCount > 0) {
      await eCardPage.moveFirstAvailableToSelected();
    }

    const selectedCountBefore = await eCardPage.getSelectedCount();
    const availableCountBefore = await eCardPage.getAvailableCount();
    expect(selectedCountBefore, 'Selected list should have at least 1 item').toBeGreaterThan(0);

    // Get text of the first selected item (will be moved back)
    const selectedItemText = (await eCardPage.selectedItems.first().locator('span').textContent()) ?? '';

    // Check the first item in Selected Associates
    await eCardPage.selectedItems.first().locator('input[type="checkbox"]').click();

    // Click the left arrow (â†) button
    await eCardPage.moveCheckedToAvailable();

    // expect: The checked row is removed from Selected Associates
    await expect(
      eCardPage.selectedItems,
      'Selected Associates should have 1 fewer item after moving back'
    ).toHaveCount(selectedCountBefore - 1, { timeout: 10000 });

    // expect: The row reappears in Available Associates
    await expect(
      eCardPage.availableItems,
      'Available Associates should have 1 more item after moving back'
    ).toHaveCount(availableCountBefore + 1, { timeout: 10000 });

    // Verify the item is in Available
    const availableTexts = await eCardPage.availableItems.allTextContents();
    expect(
      availableTexts.some(t => t.includes(selectedItemText.trim())),
      `"${selectedItemText}" should reappear in Available Associates`
    ).toBe(true);
  });
});
