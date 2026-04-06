import { Page, expect, Locator } from '@playwright/test'; import { ColInfo } from 'xlsx';

export class EvaluatorSubmisOutliers {
    private readonly page: Page;

    //locators
    private readonly headerEvaluatorSubmisOutliers: Locator;
    private readonly fieldOperatorCompany: Locator;
    private readonly fieldEvaluatorCompany: Locator;
    private readonly startDate: Locator;
    private readonly endDate: Locator;
    private readonly buttonGenerateReport: Locator;
    private readonly buttonClearFilters: Locator;
    private readonly operatorCompanyErrorMessage: Locator;
    private readonly dateErrorMessage: Locator;
    private readonly dateRangeLimitError: Locator;

    //constructor
    constructor(page: Page) {
        this.page = page;
        this.headerEvaluatorSubmisOutliers = page.getByRole('heading', { name: 'Evaluator Submission Outliers Report' })
        this.fieldOperatorCompany = this.fieldOperatorCompany = page.locator('input[role="searchbox"]').first();
        this.fieldEvaluatorCompany = page.locator("//input[@id='typeahead-input-60220']")
        this.startDate = page.locator("//input[@id='__BVID__613']")
        this.endDate = page.locator("//input[@id='__BVID__615']")
        this.buttonGenerateReport = page.getByRole('button', { name: /Generate Report/i })
        this.buttonClearFilters = page.getByRole('button', { name: /Clear Filters/i })
        this.operatorCompanyErrorMessage = page.getByText('Operator Company is required.')
        this.dateErrorMessage = page.getByText('Date Range is required.')
        this.dateRangeLimitError = page.getByText('Date Range cannot exceed 31 days.')


    }

    async expectHeaderEvaluatorSubmisOutliersVisible() {
        await expect(this.headerEvaluatorSubmisOutliers).toBeVisible();
    }

    async enterOperatorCompany(operatorCompany: string) {
        await this.fieldOperatorCompany.click();
        await this.fieldOperatorCompany.fill(operatorCompany);
    }

    async enterStartDate(startDate: string) {
        await this.startDate.click();
        await this.startDate.fill(startDate);
    }

    async enterEndDate(endDate: string) {
        await this.endDate.click();
        await this.endDate.fill(endDate);
    }
    

    async visibleClearFilters() {
        await expect(this.buttonClearFilters).toBeVisible();
    }
    async clickGenerateReport() {
        await this.buttonGenerateReport.click();
    }
    async enableGenerateReportButton() {
        await expect(this.buttonGenerateReport).toBeEnabled();
    
    }

    async visibleGenerateReportButton() {
        await expect(this.buttonGenerateReport).toBeVisible();
    }



}

