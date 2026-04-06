import { Page, expect, Locator } from '@playwright/test';

export class LeftMenuComponent {
    private readonly page: Page;

    //locators:
    private readonly EvaluatorSubmisOutliers: Locator;
    private readonly ReportPage: Locator;


    //constructor
    constructor(page: Page) {
        this.page = page;
        this.EvaluatorSubmisOutliers = page.getByText('Evaluator Submission Outliers', { exact: true });
        this.ReportPage = page.getByText('Reports', { exact: true });
    }

    async expectEvaluatorSubmisOutliersVisible() {
        await expect(this.EvaluatorSubmisOutliers).toBeVisible();
    }

    async expectReportPageVisible() {
        await expect(this.ReportPage).toBeVisible();
    }

    async clickReportPage() {
        await this.ReportPage.click();
    }

    async clickEvaluatorSubmisOutliers() {
        await this.EvaluatorSubmisOutliers.click();

}}