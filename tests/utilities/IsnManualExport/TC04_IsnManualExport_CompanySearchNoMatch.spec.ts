//Test created by AI

/*
TC-04 — ISN Manual Export: Company Search — No Match

Preconditions: User is logged in; navigate to ISN Manual Export page

Step 1 | Type a non-existent company name "ddd" | Dropdown  has zero options
Step 2 | Dual list and Export button remain hidden | No company selected — conditional elements not rendered
Step 3 | Input retains the typed text | Input value equals "ddd"
Step 4 | No company selected state shown | Selected display and Change link are hidden
Step 5 | Clear the input | Dropdown hides; input is empty
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { IsnManualExportPage } from '../../../pages/utilities/IsnManualExportPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-04 — ISN Manual Export: Company Search No Match', () => {
  const SEARCH_INPUT = 'ddd';

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
  });

  // Step 1: Typing a non-existent name shows no results; field turns red with Required message
  test('typing a non-existent company name shows no dropdown results', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.expectCompanySearchInputVisible();
    await isnPage.expectCompanySearchInputEmpty();

    await isnPage.typeAndWaitForApiResponse(SEARCH_INPUT);

    await isnPage.expectDropdownEmptyOrHidden();
  });

  // Step 2: Dual list and Export button remain hidden
  test('dual list remains hidden when no company is matched or selected', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeAndWaitForApiResponse(SEARCH_INPUT);

    await isnPage.expectDualListHidden();
    await isnPage.expectExportButtonHidden();
  });

  // Step 3: Input retains typed text
  test('company input retains the typed text after no-match search', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeAndWaitForApiResponse(SEARCH_INPUT);

    await isnPage.expectCompanySearchInputHasValue(SEARCH_INPUT);
  });

  // Step 4: No selected state shown
  test('no company is selected after typing a non-existent name', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeAndWaitForApiResponse(SEARCH_INPUT);

    await isnPage.expectSelectedCompanyDisplayHidden();
    await isnPage.expectChangeLinkHidden();
  });

  // Step 5: Clearing input hides the dropdown
  test('clearing the input after no-match hides the dropdown', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeAndWaitForApiResponse(SEARCH_INPUT);
    await isnPage.clearCompanyInput();

    await isnPage.expectDropdownHidden();
    await isnPage.expectCompanySearchInputEmpty();
  });


});
