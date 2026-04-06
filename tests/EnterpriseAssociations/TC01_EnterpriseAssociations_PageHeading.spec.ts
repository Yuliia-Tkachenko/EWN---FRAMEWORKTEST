//Test created by AI

/*
TC-01 — Enterprise Associations: Page Heading Renders Correctly

Preconditions: Valid user credentials (ytkachenko)

Step 1 | Log in and click Utilities → Enterprise Associations in the left menu | Enterprise Associations page loads
Step 2 | Check the page heading | H1 reads "Enterprise Associations" and is visible
Step 3 | Inspect the H1 heading color | Heading has teal color (not black) applied by the page-title mixin
Step 4 | Check layout order | Company dropdown is visible and appears below the H1 heading
*/

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TestConfig } from '../../test.config';
import { EnterpriseAssociationsPage } from '../../pages/utilities/EnterpriseAssociations';

test.describe.configure({ mode: 'serial' });

test.describe('TC-01 — Enterprise Associations: Page Heading Renders Correctly', () => {
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
    await page.goto('/legacy/EnterpriseAssociations');
    await page.waitForLoadState('domcontentloaded');
  });

  // Step 2: H1 heading reads "Enterprise Associations" and is visible
  test('H1 heading reads "Enterprise Associations" and is visible', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);
    await enterprisePage.expectPageHeadingVisible();
  });

  // Step 3: H1 has teal styling applied via the page-title-legacy mixin
  test('H1 heading is rendered inside the teal-styled header container', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);

    await enterprisePage.expectHeaderContainerVisible();
    await enterprisePage.expectHeaderContainerText('Enterprise Associations');

    const color = await enterprisePage.getHeaderColor();
    expect(
      color,
      'Expected teal color from page-title-legacy mixin — update rgb value if needed',
    ).not.toBe('rgb(0, 0, 0)');
  });

  // Step 4: Enterprise company dropdown is visible below the heading
  test('Enterprise company dropdown is visible below the heading', async () => {
    const enterprisePage = new EnterpriseAssociationsPage(page);

    await enterprisePage.expectCompanyDropdownVisible();

    const headingBox = await enterprisePage.getPageHeadingBoundingBox();
    const dropdownBox = await enterprisePage.getCompanyDropdownBoundingBox();

    expect(headingBox, 'Heading bounding box should be defined').not.toBeNull();
    expect(dropdownBox, 'Dropdown bounding box should be defined').not.toBeNull();
    expect(headingBox!.y, 'Heading should appear above the dropdown').toBeLessThan(dropdownBox!.y);
  });
});
