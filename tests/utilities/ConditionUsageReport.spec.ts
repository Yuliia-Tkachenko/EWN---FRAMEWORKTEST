import {test, expect, Locator} from '@playwright/test';
import fs from 'fs';
import path from 'path/win32';
//import { ConditionUsageReportPage } from '../pages/ConditionUsageReportPage';
// EWN Login Test
 test('Successful run and download of Condition Usage Report', async ({ page }) => {
    await page.goto("https://test-auth.ewn.com/static/login");
    await page.getByLabel('Username').fill('ytkachenko');
    await page.getByLabel('Password').fill('!TestEnv!1');
    await page.getByRole('button', { name: 'Log In' }).click();

    //await page.waitForURL("https://test-app.ewn.com/legacy/Help");
    //await expect(page).toHaveURL('https://test-app.ewn.com/legacy/Help');
    await page.waitForTimeout(5000);

    const Utils:Locator=page.getByRole('link', { name: 'Utilities' });
    await expect(Utils).toBeVisible();
    await Utils.click();
    await page.waitForTimeout(3000);

    const ConditionUsageReport:Locator=page.getByRole('link', { name: 'Condition Usage' });
    await ConditionUsageReport.click();
    await page.waitForTimeout(3000);
    
    //Verify header of the report
    const HeaderConditionUsageReport:Locator=page.getByRole('heading', { name: 'Condition Usage Report' });
    await expect(HeaderConditionUsageReport).toBeVisible();

      //Select filters for the report
    
      await page.locator('#uxDdlCompanies').selectOption({ label: 'Allison Company' });
      await page.waitForTimeout(3000);

      const includeInactive:Locator=page.getByRole('checkbox', { name: 'Include Inactive Users:' })
      await expect(includeInactive).toBeEnabled();
      await includeInactive.check(); 
      await page.waitForTimeout(3000);

      const RunReport:Locator=page.getByRole('button', { name: 'Run Report' })
      await expect(RunReport).toBeVisible();

      // ✅ Set up download listener BEFORE clicking Run Report
     const downloadPromise = page.waitForEvent('download');
     await RunReport.click();

      /*
      await RunReport.click();
      await page.waitForTimeout(3000);
      */

       // Check immediately with a short timeout — if it's a flash, catch it fast
         await expect(page.getByText('Generating Report'))
        .toBeVisible({ timeout: 5000 })
        .catch(() => console.warn('Loading modal was too fast to catch — skipping'));

        // ✅ Wait for the loading modal to disappear (report is done generating)
        await expect(page.getByText('Generating Report'))
        .toBeHidden({ timeout: 90000 })
        .catch(() => console.warn('Loading modal was already gone'));

        // ✅ Capture the download
        const download = await downloadPromise;

    // ✅ Verify the filename matches expected pattern
    const fileName = download.suggestedFilename();
    console.log(`Downloaded file: ${fileName}`);
    expect(fileName).toMatch(/ConditionUsageReport_.*\.xlsx/);

    // ✅ Save the file and verify it exists on disk
    const downloadPath:any= path.join('./downloads', fileName);
    await download.saveAs(downloadPath);

    expect(fs.existsSync(downloadPath)).toBeTruthy();

    // ✅ Verify file size is greater than 0 (not an empty file)
    const fileSize:number= fs.statSync(downloadPath).size;
    console.log(`File size: ${fileSize} bytes`);
    expect(fileSize).toBeGreaterThan(0);

    console.log(`✅ Download verified: ${fileName} (${fileSize} bytes)`);

  });

 

