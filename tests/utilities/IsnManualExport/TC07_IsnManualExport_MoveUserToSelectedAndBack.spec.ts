//Test created by AI

/*
TC-07 — ISN Manual Export: Move User to Selected and Back to Available

Preconditions: User is logged in; NiSource selected; dual list loaded

Initial state: Available: [User A, User B, User C ...] | Selected: []

── PART 1: Available → Selected ──────────────────────────────
Step 1 | Click checkbox on first Available item | Checkbox becomes checked
Step 2 | Click move-right | User moves to Selected panel; removed from Available
Step 3 | Verify no duplicates across panels | Each user appears in one panel only

── PART 2: Selected → Available ──────────────────────────────
Step 4 | Click checkbox on first Selected item | Checkbox becomes checked
Step 5 | Click move-left | User moves back to Available; Selected panel empty
Step 6 | Verify user restored; no duplicates | Available has user back; Selected is empty
*/

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { IsnManualExportPage } from '../../../pages/utilities/IsnManualExportPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-07 — ISN Manual Export: Move User to Selected and Back to Available', () => {
  const COMPANY = 'NiSource';

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {
    const isnPage = new IsnManualExportPage(page);
    await isnPage.navigateTo();
    await isnPage.typeCompanyName(COMPANY);
    await isnPage.selectCompanyFromDropdown(COMPANY);
    await isnPage.waitForDualListToLoad();
  });

  // Full flow: move user right then back left
  test('move first user from Available to Selected then back to Available', async () => {
    const isnPage = new IsnManualExportPage(page);

    // ── Precondition: Selected panel is empty ─────────────────────────────────
    await isnPage.expectSelectedPanelEmpty();
    await isnPage.expectAvailableItemsCountGreaterThan(0);

    // Capture first user name before move
    const firstUserName = await isnPage.getFirstAvailableItemLabel();
    expect(firstUserName).toBeTruthy();

    // ── PART 1: Move Available → Selected ────────────────────────────────────

    // Step 1: Check first available item
    await isnPage.checkFirstAvailableItem();
    await isnPage.expectFirstAvailableItemChecked();

    // Step 2: Click move-right
    await isnPage.clickMoveRight();

    // Verify: user appears in Selected panel
    await isnPage.expectSelectedItemsCount(1);
    const selectedUserName = await isnPage.getFirstSelectedItemLabel();
    expect(selectedUserName).toBe(firstUserName);

    // Verify: no duplicates across panels
    await isnPage.expectNoDuplicatesAcrossPanels();

    // ── PART 2: Move Selected → Available ────────────────────────────────────

    // Step 4: Check first selected item
    await isnPage.checkFirstSelectedItem();
    await isnPage.expectFirstSelectedItemChecked();

    // Step 5: Click move-left
    await isnPage.clickMoveLeft();
    await page.waitForTimeout(500); 
    

    // Verify: Selected panel is empty again
    await isnPage.expectSelectedPanelEmpty();

    // Verify: user is back in Available
    const availableLabels = await isnPage.getAvailableItemLabels();
    expect(availableLabels).toContain(firstUserName);

    // Verify: no duplicates after restore
    await isnPage.expectNoDuplicatesAcrossPanels();
  });

  // Moving multiple users and moving all back
  test('move two users to Selected and move both back to Available', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.expectAvailableItemsCountGreaterThan(1);

    // Move first user
    await isnPage.checkFirstAvailableItem();
    await isnPage.clickMoveRight();
    await isnPage.expectSelectedItemsCount(1);

    // Move another user
    await isnPage.checkFirstAvailableItem();
    await isnPage.clickMoveRight();
    await isnPage.expectSelectedItemsCount(2);

    // No duplicates
    await isnPage.expectNoDuplicatesAcrossPanels();

    // Move both back — click all selected checkboxes
    const selectedItems = page.locator('ewn-dual-list .dual-list-right .list-group-item.vs-repeat-repeated-element');
    const count = await selectedItems.count();
    for (let i = 0; i < count; i++) {
      await selectedItems.nth(i).locator('input[type="checkbox"]').click();
    }
    await isnPage.clickMoveLeft();
    await page.waitForTimeout(500);

    await isnPage.expectSelectedPanelEmpty();
    await isnPage.expectNoDuplicatesAcrossPanels();
  });
});
