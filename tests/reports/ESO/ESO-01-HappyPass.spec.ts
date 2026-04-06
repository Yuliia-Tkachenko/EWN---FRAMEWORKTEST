/* ESO-01: Happy Path - Generate Report with Valid Filters
1. Login to the application with valid credentials.
2. Navigate to the Report>Evaluator Submission Outliers Report page.
3. Verify that the header "Evaluator Submission Outliers Report" is visible.
4. Enter a valid Operator Company in the "Operator Company" field.
5. Select a valid date range (not exceeding 31 days) in the "Start Date" and "End Date" fields.
6. Click the "Generate Report" button.
7. Verify that the report is generated.

*/

import { test } from '@playwright/test';
import { EvaluatorSubmisOutliers } from '../../../pages/Reports/EvaluatorSubmisOutliers';
import { LoginPage } from '../../../pages/LoginPage';
import { TestConfig } from '../../../test.config';
import { HomePage } from '../../../pages/HomePage';
import { LeftMenuComponent } from '../../../components/left-menu.component';

let config: TestConfig;
let loginPage: LoginPage;
let evaluatorSubmisOutliers: EvaluatorSubmisOutliers;
let leftMenuComponent: LeftMenuComponent;


test.beforeEach(async ({ page }) => {
    //Navigate to the login page
    config = new TestConfig();
    await page.goto(config.appUrl);
})

test('ESO-01: Happy Path - Generate Report with Valid Filters', async ({ page }) => {
    loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    evaluatorSubmisOutliers = new EvaluatorSubmisOutliers(page);
    //1. Login with valid credentials
    await loginPage.login(config.validUsername1, config.validPassword1);
    await homePage.expectUserNameVisible1();
    await page.waitForTimeout(5000);

    //2. Navigate to the Report>Evaluator Submission Outliers Report page
   leftMenuComponent = new LeftMenuComponent(page);
   await leftMenuComponent.expectReportPageVisible();
   await leftMenuComponent.clickReportPage();
   await leftMenuComponent.expectEvaluatorSubmisOutliersVisible();
   await leftMenuComponent.clickEvaluatorSubmisOutliers();

    //3. Verify that the header "Evaluator Submission Outliers Report" is visible
    await evaluatorSubmisOutliers.expectHeaderEvaluatorSubmisOutliersVisible();
    
    //4. Enter a valid Operator Company in the "Operator Company" field
    config.operatorCompany="Energy Worldnet"; 
    await page.waitForTimeout(3000);
    await evaluatorSubmisOutliers.enterOperatorCompany(config.operatorCompany);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    //5. Select a valid date range (not exceeding 31 days) in the "Start Date" and "End Date" fields
    await evaluatorSubmisOutliers.enterStartDate(config.startDate);
    await evaluatorSubmisOutliers.enterEndDate(config.endDate);

    //6. Click the "Generate Report" button
    await evaluatorSubmisOutliers.visibleGenerateReportButton();
    await evaluatorSubmisOutliers.clickGenerateReport();
    await page.waitForTimeout(5000);


}
)

