import { Page, expect, Locator } from '@playwright/test';

export class MyRequirementsPage {
    readonly page: Page;

    // locators — TC01
    private readonly sidebarLink: Locator;
    private readonly pageHeader: Locator;
    private readonly searchTab: Locator;
    private readonly launchTab: Locator;

    // locators — TC02
    private readonly requirementsViewDropdown: Locator;
    private readonly companyTaskListDropdown: Locator;
    private readonly evaluationAuthorDropdown: Locator;
    private readonly catalogDropdown: Locator;
    private readonly evaluationStatusMultiSelect: Locator;
    private readonly subscriptionStatusDropdown: Locator;
    private readonly evaluationTypeDropdown: Locator;
    private readonly forecastDateInput: Locator;
    private readonly evaluationTitleInput: Locator;
    private readonly searchButton: Locator;
    private readonly requirementsViewEvaluationOption: Locator;

    // locators — TC06
    private readonly evalStatusDropdownToggle: Locator;
    private readonly evalStatusDeselectAll: Locator;
    private readonly evalStatusDropdownMenu: Locator;

    private readonly resultsHeader: Locator;
    private readonly noResultsRow: Locator;
    private readonly completedIcons: Locator;
    private readonly expiringSoonIcons: Locator;
    private readonly expiredOrNotCompletedIcons: Locator;
    private readonly suspendedIcons: Locator;
    private readonly busyBackdrop: Locator;

    // locators — TC05
    private readonly resultsTable: Locator;
    private readonly exportToButton: Locator;
    private readonly iconLegend: Locator;
    private readonly tableDataRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // TC01
        this.sidebarLink = page.locator('a', { hasText: 'My Requirements' }).first();
        this.pageHeader  = page.getByRole('heading', { name: 'My Requirements', level: 1 });
        this.searchTab   = page.locator('#tabMyRequirementsSearch');
        this.launchTab   = page.locator('#tabLaunch');

        // TC02
        this.requirementsViewDropdown    = page.locator('#uxDdlRequirementsView');
        this.companyTaskListDropdown     = page.locator('#uxDdlOperators');
        this.evaluationAuthorDropdown    = page.locator('#uxDdlEvalAuthor');
        this.catalogDropdown             = page.locator('#uxDdlCatalog');
        this.evaluationStatusMultiSelect = page.locator('#mltEvaluationStatus');
        this.subscriptionStatusDropdown  = page.locator('#uxDdlSubStatus');
        this.evaluationTypeDropdown      = page.locator('#uxDdlEvaluationType');
        this.forecastDateInput           = page.locator('#uxCalReportAsOfDate');
        this.evaluationTitleInput        = page.locator('#uxTxtEvaluationTitle');
        this.searchButton                = page.locator('button', { hasText: /search/i });
        this.requirementsViewEvaluationOption = page.locator('#uxDdlRequirementsView option[value="E"]');

        // TC06
        this.evalStatusDropdownToggle       = page.locator('#mltEvaluationStatus button.dropdown-toggle');
        this.evalStatusDeselectAll          = page.locator('#mltEvaluationStatus [ng-click="uncheckAll()"]');
        this.evalStatusDropdownMenu         = page.locator('#mltEvaluationStatus ul[uib-dropdown-menu]');

        this.resultsHeader                  = page.locator('h2', { hasText: /results/i });
        this.noResultsRow                   = page.locator('table[ng-table] tr').filter({ hasText: /no results/i });
        this.completedIcons                 = page.locator('table[ng-table] tbody tr:not(.ng-hide) span.ri-checkbox-circle-line.ri-green');
        this.expiringSoonIcons              = page.locator('table[ng-table] tbody tr:not(.ng-hide) span.ri-alert-line.ri-orange');
        this.expiredOrNotCompletedIcons     = page.locator('table[ng-table] tbody tr:not(.ng-hide) span.ri-spam-2-line.ri-red');
        this.suspendedIcons                 = page.locator('table[ng-table] tbody tr:not(.ng-hide) span.ri-spam-3-line');
        this.busyBackdrop                   = page.locator('.cg-busy-backdrop').first();

        // TC05
        this.resultsTable   = page.locator('table[ng-table]').first();
        this.exportToButton = page.locator('button.dropdown-toggle', { hasText: /export to/i });
        this.iconLegend     = page.locator('.icon-legend');
        this.tableDataRows  = page.locator('table[ng-table] tr[ng-repeat]');
    }

    // ── Navigation ──────────────────────────────────────────────────────────

    async navigateTo() {
        await this.sidebarLink.click();
        await this.page.waitForURL('**/MyRequirements**', { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── TC01 — Page Navigation ───────────────────────────────────────────────

    async expectSidebarLinkVisible() {
        await expect(this.sidebarLink).toBeVisible();
    }

    async expectUrlContainsMyRequirements() {
        await expect(this.page).toHaveURL(/\/legacy\/MyRequirements/i);
    }

    async expectPageHeaderVisible() {
        await expect(this.pageHeader).toBeVisible();
    }

    async expectPageHeaderText() {
        await expect(this.pageHeader).toHaveText(/my requirements/i);
    }

    async expectSearchTabVisible() {
        await expect(this.searchTab).toBeVisible();
    }

    async expectSearchTabActive() {
        await expect(this.searchTab).toHaveClass(/active/);
    }

    async expectLaunchTabHidden() {
        await expect(this.launchTab).toBeHidden();
    }

    // ── TC02 — Search Form Default State ────────────────────────────────────

    async expectRequirementsViewDropdownVisible() {
        await expect(this.requirementsViewDropdown).toBeVisible();
    }

    async expectRequirementsViewDefaultValue() {
        await expect(this.requirementsViewDropdown).toHaveValue('E');
    }

    async expectCompanyTaskListDropdownVisible() {
        await expect(this.companyTaskListDropdown).toBeVisible();
    }

    async expectEvaluationAuthorDropdownVisible() {
        await expect(this.evaluationAuthorDropdown).toBeVisible();
    }

    async expectCatalogDropdownVisibleIfPresent() {
        const count = await this.catalogDropdown.count();
        if (count > 0) {
            await expect(this.catalogDropdown).toBeVisible();
        }
    }

    async expectEvaluationStatusMultiSelectVisible() {
        await expect(this.evaluationStatusMultiSelect).toBeVisible();
    }

    async expectSubscriptionStatusDropdownVisible() {
        await expect(this.subscriptionStatusDropdown).toBeVisible();
    }

    async expectEvaluationTypeDropdownVisible() {
        await expect(this.evaluationTypeDropdown).toBeVisible();
    }

    async expectForecastDateInputVisible() {
        await expect(this.forecastDateInput).toBeVisible();
    }

    async expectEvaluationTitleInputVisible() {
        await expect(this.evaluationTitleInput).toBeVisible();
    }

    async expectSearchButtonVisibleAndEnabled() {
        await expect(this.searchButton).toBeVisible();
        await expect(this.searchButton).toBeEnabled();
    }

    async expectEvaluationViewOptionText() {
        await expect(this.requirementsViewEvaluationOption).toHaveText(/evaluation view/i);
    }

    async expectDefaultStatusesSelectedCount(count: number) {
        const toggleButton = this.evaluationStatusMultiSelect.locator('button.dropdown-toggle');
        await expect(toggleButton).toContainText(`${count} Selected`);
    }

    // ── TC06 — Search by Evaluation Status ──────────────────────────────────

    async openEvalStatusDropdown() {
        await this.evalStatusDropdownToggle.click();
        await expect(this.evalStatusDropdownMenu).toBeVisible();
    }

    async deselectAllEvalStatuses() {
        await this.evalStatusDeselectAll.click();
    }

    async selectEvalStatusOption(label: string) {
        const option = this.evalStatusDropdownMenu.locator('a', { hasText: new RegExp(label, 'i') });
        await option.click();
    }

    async closeEvalStatusDropdown() {
        await this.page.locator('h1').first().click();
        await expect(this.evalStatusDropdownMenu).toBeHidden();
    }

    async clickSearch() {
        await this.searchButton.click();
    }

    async waitForResultsToLoad() {
        // Catch the spinner appearing (new search in flight); ignore if too fast
        await this.busyBackdrop.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
        // Wait for the spinner to be gone (search complete)
        await expect(this.busyBackdrop).toBeHidden({ timeout: 20000 });
        // Wait for network to settle so AngularJS has processed the response
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    }

    async expectEvaluationViewSelected() {
        await expect(this.requirementsViewDropdown).toHaveValue('E');
    }

    async expectResultsHeaderVisible() {
        await expect(this.resultsHeader).toBeVisible();
    }

    async expectNoResultsFound(): Promise<boolean> {
        const row = this.page.locator('table[ng-table] tr[ng-show="!$data.length"]');
        const count = await row.count();
        if (count === 0) return false;
        const isHidden = await row.evaluate((el) => el.classList.contains('ng-hide'));
        return !isHidden;
    }

    async expectNoResultsMessageVisible() {
        const row = this.page.locator('table[ng-table] tr[ng-show="!$data.length"]');
        await expect(row).not.toHaveClass(/ng-hide/);
        await expect(row).toContainText(/no results/i);
    }

    async expectCompletedIconsPresent() {
        const count = await this.completedIcons.count();
        expect(count).toBeGreaterThan(0);
    }

    async expectExpiringSoonIconsAbsent() {
        await expect(this.expiringSoonIcons).toHaveCount(0);
    }

    async expectExpiredOrNotCompletedIconsAbsent() {
        await expect(this.expiredOrNotCompletedIcons).toHaveCount(0);
    }

    async expectSuspendedIconsAbsent() {
        await expect(this.suspendedIcons).toHaveCount(0);
    }

    async expectEvalStatusNoneSelected() {
        await expect(this.evalStatusDropdownToggle).not.toContainText('Selected');
    }

    async expectEvalStatusToggleShowsLabel(label: string) {
        await expect(this.evalStatusDropdownToggle).toContainText(label);
    }

    // ── TC05 — Search with No Filters ───────────────────────────────────────

    async expectResultsTableVisible() {
        await expect(this.resultsTable).toBeVisible();
    }

    async expectExportToButtonVisible() {
        await expect(this.exportToButton).toBeVisible();
    }

    async expectIconLegendVisible() {
        await expect(this.iconLegend.first()).toBeVisible();
    }

    async expectResultsTableHasNoDataRows() {
        const count = await this.tableDataRows.count();
        expect(count).toBe(0);
    }

    async expectResultsOrNoResults() {
        const rowCount = await this.tableDataRows.count();
        const hasNoResults = (await this.noResultsRow.count()) > 0;
        expect(rowCount > 0 || hasNoResults).toBe(true);
    }

    async expectFirstRowHasStatusIcon() {
        const firstRow = this.tableDataRows.first();
        await expect(firstRow).toBeVisible();
        const statusIcon = firstRow.locator(
            'span.ri-checkbox-circle-line, span.ri-alert-line, span.ri-spam-2-line, span.ri-spam-3-line'
        );
        await expect(statusIcon.first()).toBeVisible();
    }

    async hasDataRows(): Promise<boolean> {
        return (await this.tableDataRows.count()) > 0;
    }

    async expectCompletedOptionChecked() {
        // Dropdown stays open after selection (auto-close="outsideClick")
        await expect(this.evalStatusDropdownMenu).toBeVisible();
        const completedOptionIcon = this.evalStatusDropdownMenu
            .locator('li').filter({ hasText: /completed/i })
            .locator('a i').first();
        await expect(completedOptionIcon).toHaveClass(/ri-check-line/);
        await expect(completedOptionIcon).not.toHaveClass(/empty/);
    }
}
