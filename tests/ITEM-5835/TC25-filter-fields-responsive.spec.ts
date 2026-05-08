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

  test('TC25 â€” Verify All Filter Fields Are Responsive When Page Is Resized', async () => {
    const eCardPage = new ECardDataExportPage(page);

    // Step 1: Navigate, select company, expand Advanced Filter
    await eCardPage.navigateTo();
    await eCardPage.selectCompany('NTC');
    await eCardPage.expandAdvancedFilter();

    // Resize the browser viewport to a narrow width (768px)
    await page.setViewportSize({ width: 768, height: 720 });

    // expect: All filter fields remain visible and accessible
    await expect(eCardPage.facilitySelect, 'Facility dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.jobTitleSelect, 'Job Title dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.groupSelect, 'Group dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.projectSelect, 'Project dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.supervisorSelect, 'Supervisor dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.testingPoolSelect, 'Testing Pool dropdown should be visible at 768px').toBeVisible();
    await expect(eCardPage.nameAssociateIdInput, 'Name/Associate ID input should be visible at 768px').toBeVisible();
    await expect(eCardPage.userTypeSelect, 'User Type dropdown should be visible at 768px').toBeVisible();

    // expect: No overflow â€” fields are within viewport width
    const filterPanelBox = await eCardPage.advancedFilterPanel.boundingBox();
    if (filterPanelBox) {
      expect(
        filterPanelBox.width,
        'Advanced Filter panel should fit within 768px viewport'
      ).toBeLessThanOrEqual(768);
    }

    // Restore original viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});
