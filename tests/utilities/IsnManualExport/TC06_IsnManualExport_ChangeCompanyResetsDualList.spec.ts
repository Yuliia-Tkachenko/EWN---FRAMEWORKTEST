//Test created by AI

/*
TC-06 — ISN Manual Export: Change Company Resets Dual List

Preconditions: User is logged in; navigate to ISN Manual Export page

Step 1 | Select Company A (NiSource) | Company selected; dual list loads with users
Step 2 | Move first available user to Selected panel | User appears in Selected panel
Step 3 | Click "Change" link | Company input clears; dual list hides
Step 4 | Select Company B (ASTAR) | Company selected; dual list reloads
Step 5 | Assert Selected panel is empty | No users from Company A remain
Step 6 | Assert Available panel has Company B users | New users loaded
Step 7 | Move first ASTAR user to Selected | Selected panel has 1 item; available count decreases by 1
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { IsnManualExportPage } from '../../../pages/utilities/IsnManualExportPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-06 — ISN Manual Export: Change Company Resets Dual List', () => {
  const COMPANY_A = 'NiSource';
  const COMPANY_B = 'ASTAR';

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername1, config.validPassword1);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {
    const isnPage = new IsnManualExportPage(page);
    await isnPage.navigateTo();
  });

  // Steps 1–7: Full flow — change company clears selected panel and reloads
  test('switching company clears Selected panel and reloads Available with new users', async () => {
    const isnPage = new IsnManualExportPage(page);

    // Step 1: Select Company A
    await isnPage.typeCompanyName(COMPANY_A);
    await isnPage.selectCompanyFromDropdown(COMPANY_A);
    await isnPage.waitForDualListToLoad();
    await isnPage.expectAvailableItemsCountGreaterThan(0);

    // Step 2: Move first user to Selected
    await isnPage.moveFirstAvailableItemToSelected();
    await isnPage.expectSelectedItemsCount(1);

    // Step 3: Click Change
    await isnPage.clickChangeLink();

    // Step 4: Select Company B
    await isnPage.typeCompanyName(COMPANY_B);
    await isnPage.selectCompanyFromDropdown(COMPANY_B);
    await isnPage.waitForDualListToLoad();

    // Step 5: Selected panel is empty
    await isnPage.expectSelectedPanelEmpty();

    // Step 6: Available panel has Company B users
    await isnPage.expectAvailableItemsCountGreaterThan(0);
  });

  // Selected panel is empty immediately after changing company
  test('Selected panel is empty after changing company before new users load', async () => {
    const isnPage = new IsnManualExportPage(page);

    // Select Company A and move a user
    await isnPage.typeCompanyName(COMPANY_A);
    await isnPage.selectCompanyFromDropdown(COMPANY_A);
    await isnPage.waitForDualListToLoad();
    await isnPage.moveFirstAvailableItemToSelected();
    await isnPage.expectSelectedItemsCount(1);

    // Change to Company B
    await isnPage.clickChangeLink();
    await isnPage.typeCompanyName(COMPANY_B);
    await isnPage.selectCompanyFromDropdown(COMPANY_B);

    // Selected panel must be empty immediately after company change
    await isnPage.expectSelectedPanelEmpty();

    // After load, available populates with Company B users
    await isnPage.waitForDualListToLoad();
    await isnPage.expectAvailableItemsCountGreaterThan(0);
  });

  // Moving a user from Company B after reset works correctly
  test('can move first Company B user to Selected after company change', async () => {
    const isnPage = new IsnManualExportPage(page);

    // Select A, move user, change to B
    await isnPage.typeCompanyName(COMPANY_A);
    await isnPage.selectCompanyFromDropdown(COMPANY_A);
    await isnPage.waitForDualListToLoad();
    await isnPage.moveFirstAvailableItemToSelected();
    await isnPage.clickChangeLink();

    // Select Company B
    await isnPage.typeCompanyName(COMPANY_B);
    await isnPage.selectCompanyFromDropdown(COMPANY_B);
    await isnPage.waitForDualListToLoad();

    // Step 7: Move first ASTAR user
    await isnPage.moveFirstAvailableItemToSelected();

    // Selected has 1 item
    await isnPage.expectSelectedItemsCount(1);
  });
});
