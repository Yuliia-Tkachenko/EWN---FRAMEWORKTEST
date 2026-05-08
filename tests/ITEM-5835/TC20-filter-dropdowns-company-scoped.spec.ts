// spec: specs/ITEM-5835-ecard-data-export-page-setup-filters-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ECardDataExportPage } from '../../pages/utilities/ECardDataExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('ITEM-5835 â€” eCard Data Export: Advanced Employee Filter', () => {
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

  test('TC20 â€” Verify Filter Dropdowns Are Populated with Company-Scoped Options Defaulting to "All"', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company NTC, expand Advanced Employee Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // expect: Each dropdown shows “All” as the default selected value
    await expect(eCardPage.facilitySelect.locator('option:checked'), 'Facility dropdown should default to All').toContainText('All');
    await expect(eCardPage.jobTitleSelect.locator('option:checked'), 'Job Title dropdown should default to All').toContainText('All');
    await expect(eCardPage.groupSelect.locator('option:checked'), 'Group dropdown should default to All').toContainText('All');
    await expect(eCardPage.projectSelect.locator('option:checked'), 'Project dropdown should default to All').toContainText('All');
    await expect(eCardPage.supervisorSelect.locator('option:checked'), 'Supervisor dropdown should default to All').toContainText('All');
    await expect(eCardPage.testingPoolSelect.locator('option:checked'), 'Testing Pool dropdown should default to All').toContainText('All');

    // expect: Facility has at least one option (beyond “All”) — company-scoped data
    const facilityOptions = await eCardPage.facilitySelect.locator('option').count();
    expect(facilityOptions, 'Facility dropdown should have at least one company-scoped option').toBeGreaterThan(1);

    // expect: User Type defaults to “All Users”
    await expect(eCardPage.userTypeSelect.locator('option:checked'), 'User Type should default to All Users').toContainText('All Users');
  });
});
