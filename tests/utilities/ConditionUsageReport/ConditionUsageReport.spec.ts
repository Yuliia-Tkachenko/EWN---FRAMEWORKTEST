import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { ConditionUsageReportPage } from '../../../pages/utilities/ConditionUsageReportPage';

test.describe.configure({ mode: 'serial' });

test.describe('Condition Usage Report', () => {
    const COMPANY = 'Allison - EWN Platform Testing';

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
        const reportPage = new ConditionUsageReportPage(page);
        await reportPage.navigateTo();
    });

    test('Successful run and download of Condition Usage Report', async () => {
        test.setTimeout(120000);
        const reportPage = new ConditionUsageReportPage(page);

        // Verify page header
        await reportPage.expectHeaderVisible();

        // Select filters
        await reportPage.selectCompany(COMPANY);
        await reportPage.checkIncludeInactive();
        await reportPage.expectRunReportButtonVisible();

        // Set up download listener BEFORE clicking Run Report
        const downloadPromise = page.waitForEvent('download');
        await reportPage.clickRunReport();

        // Wait for report generation to complete
        await reportPage.waitForReportToGenerate();

        // Capture the download
        const download = await downloadPromise;

        // Verify filename matches expected pattern
        const fileName = download.suggestedFilename();
        expect(fileName).toMatch(/ConditionUsageReport_.*\.xlsx/);

        // Save file and verify it exists on disk
        const downloadPath = path.join('downloads', fileName);
        await download.saveAs(downloadPath);
        expect(fs.existsSync(downloadPath)).toBeTruthy();

        // Verify file is not empty
        const fileSize = fs.statSync(downloadPath).size;
        expect(fileSize).toBeGreaterThan(0);
    });
});
