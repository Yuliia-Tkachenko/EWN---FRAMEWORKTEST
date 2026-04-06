//Test created by AI

/*
TC-02 — My Requirements: Search Form Default State

Preconditions: User is logged in; navigate to My Requirements page

Step 1 | Open the Search tab | All search form fields are visible; Requirements View defaults to "Evaluation View"; Search button is enabled
Step 2 | Inspect Requirements View dropdown | "Evaluation View" option (value "E") is present in the dropdown
Step 3 | Inspect Evaluation Status multi-select | Default selected statuses are: Expired, ExpiringSoon, NotCompleted, Suspended
*/

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { MyRequirementsPage } from '../../pages/myRequirements/MyRequirementsPage';

test.describe.configure({ mode: 'serial' });

test.describe('TC-02 — My Requirements: Search Form Default State', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const config = new TestConfig();
    context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(config.validUsername, config.validPassword);
    await page.waitForURL('**/legacy/**', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    const myRequirementsPage = new MyRequirementsPage(page);
    await myRequirementsPage.navigateTo();
  });

  test.afterAll(async () => {
    await context.close();
  });

  // Step 1: All search form fields visible and Requirements View defaults to Evaluation View
  test('search form loads with Evaluation View defaults on page open', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);

    await myRequirementsPage.expectRequirementsViewDropdownVisible();
    await myRequirementsPage.expectRequirementsViewDefaultValue();
    await myRequirementsPage.expectCompanyTaskListDropdownVisible();
    await myRequirementsPage.expectEvaluationAuthorDropdownVisible();
    await myRequirementsPage.expectCatalogDropdownVisibleIfPresent();
    await myRequirementsPage.expectEvaluationStatusMultiSelectVisible();
    await myRequirementsPage.expectSubscriptionStatusDropdownVisible();
    await myRequirementsPage.expectEvaluationTypeDropdownVisible();
    await myRequirementsPage.expectForecastDateInputVisible();
    await myRequirementsPage.expectEvaluationTitleInputVisible();
    await myRequirementsPage.expectSearchButtonVisibleAndEnabled();
  });

  // Step 2: Evaluation View option exists in the dropdown
  test('Evaluation View shows correct dropdown options', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);
    await myRequirementsPage.expectEvaluationViewOptionText();
  });

  // Step 3: Default statuses are pre-selected in Evaluation Status multi-select
  test('Evaluation Status multi-select has correct default selections', async () => {
    const myRequirementsPage = new MyRequirementsPage(page);
    // Default statuses: Expired, ExpiringSoon, NotCompleted, Suspended (4 total)
    await myRequirementsPage.expectDefaultStatusesSelectedCount(4);
  });
});
