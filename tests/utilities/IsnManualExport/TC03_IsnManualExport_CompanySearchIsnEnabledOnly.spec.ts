//Test created by AI

/*
TC-03 — ISN Manual Export: Company Search — Active ISN-Enabled Companies Only

Preconditions: User is logged in; navigate to ISN Manual Export page

Step 1 | Verify company search input is visible and empty | Input is present with no value
Step 2 | Type partial company name "NiSource" | Dropdown appears with matching results
Step 3 | Select a company from the dropdown | Dropdown closes; selected name displayed; Change link visible
Step 4 | Verify dual list and Export button are hidden before selection | Elements not rendered
Step 5 | Verify dual list and Export button appear after selection | Elements rendered
Step 6 | Click outside input while dropdown is open | Dropdown closes
Step 7 | Keyboard navigation — ArrowDown then Enter selects a company | First option active; company selected
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { IsnManualExportPage } from '../../../pages/utilities/IsnManualExportPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-03 — ISN Manual Export: Company Search ISN-Enabled Only', () => {
  const SEARCH_INPUT = 'NiSource';

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

  // Steps 1–2: Typing shows matching dropdown results
  test('typing "NiSource" shows matching companies in dropdown', async () => {
    const isnPage = new IsnManualExportPage(page);

    // Step 1: Input is visible and empty
    await isnPage.expectCompanySearchInputVisible();
    await isnPage.expectCompanySearchInputEmpty();

    // Step 2: Type and wait for dropdown
    await isnPage.typeCompanyName(SEARCH_INPUT);
    await isnPage.expectDropdownVisible();
    await isnPage.expectDropdownHasResults();
  });

  // Step 3: Selecting a company closes dropdown and shows selected state
  test('dropdown closes and selected company is displayed after selection', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeCompanyName(SEARCH_INPUT);
    await isnPage.selectCompanyFromDropdown(SEARCH_INPUT);

    await isnPage.expectDropdownHidden();
    await isnPage.expectSelectedCompanyDisplayVisible();
    await isnPage.expectSelectedCompanyDisplayContains(SEARCH_INPUT);
    await isnPage.expectChangeLinkVisible();
  });

  // Step 6: Dual list and Export button are hidden before company selection
  test('dual list and Export button are hidden before company selection', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.expectDualListHidden();
    await isnPage.expectExportButtonHidden();
  });

  // Step 7: Dual list and Export button appear after company is selected
  test('dual list and Export button appear after company is selected', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeCompanyName(SEARCH_INPUT);
    await isnPage.selectCompanyFromDropdown(SEARCH_INPUT);

    await isnPage.expectDualListVisible();
    await isnPage.expectExportButtonVisible();
  });

  // Step 8: Clicking outside closes the dropdown
  test('dropdown closes when clicking outside the input', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeCompanyName(SEARCH_INPUT);
    await isnPage.expectDropdownVisible();

    await page.locator('h1', { hasText: 'ISN Manual Export' }).click();

    await isnPage.expectDropdownHidden();
  });

  // Step 9: Keyboard navigation — ArrowDown highlights first option, Enter selects it
  test('ArrowDown highlights first option and Enter selects it', async () => {
    const isnPage = new IsnManualExportPage(page);

    await isnPage.typeCompanyName(SEARCH_INPUT);
    await isnPage.expectDropdownVisible();

    await isnPage.pressKeyOnSearchInput('ArrowDown');
    await isnPage.expectFirstOptionHasActiveClass();

    await isnPage.pressKeyOnSearchInput('Enter');
    await isnPage.expectSelectedCompanyDisplayVisible();
  });
});
