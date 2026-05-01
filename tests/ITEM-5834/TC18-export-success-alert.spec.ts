// spec: specs/ITEM-5834-isn-manual-export-test-plan.md
// seed: tests/seed.spec.ts

import { test, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { IsnManualExportPage } from '../../pages/utilities/IsnManualExportPage';
import { TestConfig } from '../../test.config';

test.describe.configure({ mode: 'serial' });

let page: Page;
let context: BrowserContext;

test.describe('TC18 — Export button: successful export shows success alert', () => {
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

  test('TC18: clicking Export to ISN after selecting an employee shows a success alert', async () => {
    const report = new IsnManualExportPage(page);

    // Step 1: Navigate to ISN Manual Export and select company 'JuliaLLC'
    await report.navigateTo();
    await report.selectCompany('JuliaLLC');
    await report.waitForDualListToLoad();

    // Step 2: Move at least one employee to the Selected panel
    await report.moveFirstAvailableItemToSelected();
    await report.expectSelectedItemsCount(1);

    // Step 3: Click the 'Export to ISN' button
    await report.clickExportButton();

    // Step 4: Verify a success alert is displayed via the persistentAlert component
    await report.expectSuccessAlertVisible();
  });
});
