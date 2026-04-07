//Test created by AI

/*
TC-11 — ISN Manual Export: Export with Specific Users Selected

Preconditions: User is logged in; NiSource selected; dual list loaded

Step 1 | Move 3 users to Selected panel | Selected panel has exactly 3 users
Step 2 | Click Export to ISN | API POST fires; success toast appears
Step 3 | Verify request payload | Body contains only the 3 selected user IDs
Step 4 | Export button visible/enabled after company selected | Button state correct
Step 5 | Payload contains only selected IDs — not all available | Body length = selected count
*/

import { test, expect, type Page, type BrowserContext, type Request } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { IsnManualExportPage } from '../../../pages/utilities/IsnManualExportPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-11 — ISN Manual Export: Export with Specific Users Selected', () => {
  const COMPANY       = 'NiSource';
  const USERS_TO_MOVE = 3;

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

  // Steps 1–3: Move 3 users, export, verify success toast and payload
  test('exporting 3 selected users shows success toast and sends correct payload', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.expectAvailableItemsCountGreaterThan(USERS_TO_MOVE - 1);

    // Step 1: Move 3 users to Selected
    const movedLabels = await isnPage.moveNAvailableUsersToSelected(USERS_TO_MOVE);
    await isnPage.expectSelectedItemsCount(USERS_TO_MOVE);
    await isnPage.expectSelectedPanelHasLabels(movedLabels);

    // Step 2: Set up intercept BEFORE clicking export
    let capturedRequest: Request | null = null;
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('isn')) {
        capturedRequest = req;
      }
    });

    const exportResponsePromise = page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('isn'),
      { timeout: 15000 },
    );

    await isnPage.expectExportButtonVisible();
    await isnPage.expectExportButtonEnabled();
    await isnPage.clickExportButton();

    const exportResponse = await exportResponsePromise;

    // Step 3: API returned success
    expect(exportResponse.status()).toBeLessThan(300);

    // Payload contains exactly 3 IDs
    expect(capturedRequest).not.toBeNull();
    const body = capturedRequest!.postDataJSON() as number[];
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(USERS_TO_MOVE);

    // Success toast appears
    await isnPage.expectSuccessToastVisible();
  });

  // Step 4: Export button visible and enabled after company and users selected
  test('export button is visible and enabled after company is selected', async () => {
    const isnPage = new IsnManualExportPage(page);

    // Button visible as soon as company is selected
    await isnPage.expectExportButtonVisible();
    await isnPage.expectExportButtonEnabled();

    // Still enabled after moving a user
    await isnPage.checkFirstAvailableItem();
    await isnPage.clickMoveRight();
    await isnPage.expectSelectedItemsCount(1);

    await isnPage.expectExportButtonVisible();
    await isnPage.expectExportButtonEnabled();
  });

  // Step 5: Payload contains only selected user IDs, not all available
  test('request payload contains only selected user IDs — not all available users', async () => {
    const isnPage = new IsnManualExportPage(page);

    const totalAvailable = await isnPage.getAvailableItemsCount();
    expect(totalAvailable).toBeGreaterThan(2);

    // Move only 2 users
    await isnPage.moveNAvailableUsersToSelected(2);
    await isnPage.expectSelectedItemsCount(2);

    let capturedRequest: Request | null = null;
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('isn')) {
        capturedRequest = req;
      }
    });

    const exportResponsePromise = page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('isn'),
      { timeout: 15000 },
    );

    await isnPage.clickExportButton();
    await exportResponsePromise;

    expect(capturedRequest).not.toBeNull();
    const body = capturedRequest!.postDataJSON() as number[];

    // Only 2 selected — not all available users
    expect(body).toHaveLength(2);
    expect(body.length).toBeLessThan(totalAvailable);
  });
});
