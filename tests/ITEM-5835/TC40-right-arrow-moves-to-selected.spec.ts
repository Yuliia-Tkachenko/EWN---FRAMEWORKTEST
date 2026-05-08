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

  test('TC40 â€” Verify Right Arrow Moves Checked Items from Available to Selected', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, search
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.clickSearch();
    await eCardPage.waitForDualListToLoad();
    await eCardPage.expectAvailableListHasItems();

    const initialAvailableCount = await eCardPage.getAvailableCount();
    const initialSelectedCount = await eCardPage.getSelectedCount();
    expect(initialAvailableCount, 'Available list should have items').toBeGreaterThanOrEqual(2);

    // Get texts of items to move
    const firstText = await eCardPage.getFirstAvailableText();
    const secondText = (await eCardPage.availableItems.nth(1).locator('span').textContent()) ?? '';

    // Check two rows in Available Associates
    await eCardPage.availableItems.first().locator('input[type="checkbox"]').click();
    await eCardPage.availableItems.nth(1).locator('input[type="checkbox"]').click();

    // Click the right arrow (â†’) button
    await eCardPage.moveCheckedToSelected();

    // expect: The two checked rows disappear from Available Associates
    await expect(
      eCardPage.availableItems,
      'Available Associates should have 2 fewer items after moving'
    ).toHaveCount(initialAvailableCount - 2, { timeout: 10000 });

    // expect: The two rows appear in Selected Associates
    await expect(
      eCardPage.selectedItems,
      'Selected Associates should have 2 more items after moving'
    ).toHaveCount(initialSelectedCount + 2, { timeout: 10000 });

    // Verify specific items are in Selected
    const selectedTexts = await eCardPage.selectedItems.allTextContents();
    expect(
      selectedTexts.some(t => t.includes(firstText.trim())),
      `"${firstText}" should appear in Selected Associates`
    ).toBe(true);
  });
});
