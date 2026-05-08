// Page object for eCard Data Export page (/legacy/CardDataExport)
// Part of ITEM-5835 test suite

import { Page, expect, Locator } from '@playwright/test';

export class ECardDataExportPage {
    private readonly page: Page;

    // The actual page URL discovered from navigation menu
    static readonly URL = '/legacy/CardDataExport';

    // ── Page header ──────────────────────────────────────────────────────────
    readonly pageHeading: Locator;
    readonly searchTab: Locator;

    // ── Company selection (AngularJS ewn-company-input / uib-typeahead) ───────
    readonly companySearchInput: Locator;
    readonly companyDropdownOptions: Locator;
    readonly selectedCompanyDisplay: Locator;
    readonly changeLink: Locator;
    readonly companyMagnifyingGlass: Locator;
    readonly companyValidationError: Locator;
    readonly highlightErrorDiv: Locator;

    // ── Top-level filters ─────────────────────────────────────────────────────
    readonly hasPhotoSelect: Locator;
    readonly hasECardSelect: Locator;
    readonly allActiveCheckbox: Locator;

    // ── Advanced Employee Filter (Vue 3 ecard-advanced-employee-filter) ───────
    readonly advancedFilterButton: Locator;
    readonly advancedFilterPanel: Locator;
    readonly advancedFilterComponent: Locator;
    readonly facilitySelect: Locator;
    readonly jobTitleSelect: Locator;
    readonly groupSelect: Locator;
    readonly projectSelect: Locator;
    readonly supervisorSelect: Locator;
    readonly testingPoolSelect: Locator;
    readonly userStatusDisplay: Locator;
    readonly userTypeSelect: Locator;
    readonly nameAssociateIdInput: Locator;

    // ── Search button ─────────────────────────────────────────────────────────
    readonly searchButton: Locator;

    // ── AngularJS ewn-dual-list component ────────────────────────────────────
    readonly dualListContainer: Locator;
    readonly availablePanel: Locator;
    readonly selectedPanel: Locator;
    readonly availableItems: Locator;
    readonly selectedItems: Locator;
    readonly moveRightButton: Locator;
    readonly moveLeftButton: Locator;
    readonly selectAllAvailable: Locator;
    readonly selectAllSelected: Locator;
    readonly availableSearchInput: Locator;
    readonly selectedSearchInput: Locator;

    // ── Export CSV button ─────────────────────────────────────────────────────
    readonly exportCsvButton: Locator;

    // ── cg-busy loading overlay ───────────────────────────────────────────────
    readonly cgBusyOverlay: Locator;
    readonly cgBusyText: Locator;

    // ── Toast / alert ────────────────────────────────────────────────────────
    readonly toastAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Page header — the h1 inside the product-section
        this.pageHeading = page.locator('.product-section h1').filter({ hasText: /eCard Data Export/i });
        this.searchTab   = page.locator('#tabCustomHeaderList');

        // Company selection — Vue 3 ecard-company-input component
        this.companySearchInput     = page.locator('#txtCompany');
        this.companyDropdownOptions = page.locator('ul.company-dropdown [role="option"]');
        this.selectedCompanyDisplay = page.locator('p.selected-display');
        this.changeLink             = page.locator('a.change-link');
        this.companyMagnifyingGlass = page.locator('.search-icon');
        this.companyValidationError = page.locator('.error-message');
        this.highlightErrorDiv      = page.locator('.form-group:has(#txtCompany)');

        // Top-level filters
        this.hasPhotoSelect    = page.locator('#ddlHasPhoto');
        this.hasECardSelect    = page.locator('#ddlHasCard');
        this.allActiveCheckbox = page.locator('#chkRunForAll');

        // Advanced Employee Filter — Vue 3 component
        this.advancedFilterComponent = page.locator('ecard-advanced-employee-filter');
        this.advancedFilterButton    = page.locator('.panel-heading.accordion-toggle');
        this.advancedFilterPanel     = page.locator('#ecard-employee-filter-body');
        this.facilitySelect          = page.locator('#ddlFacility');
        this.jobTitleSelect          = page.locator('#ddlJobTitle');
        this.groupSelect             = page.locator('#ddlGroup');
        this.projectSelect           = page.locator('#ddlProject');
        this.supervisorSelect        = page.locator('#ddlSupervisor');
        this.testingPoolSelect       = page.locator('#ddlTestingPool');
        this.userStatusDisplay       = page.locator('.form-control-static[aria-labelledby="ecard-user-status-label"]');
        this.userTypeSelect          = page.locator('#ddlType');
        this.nameAssociateIdInput    = page.locator('#txtNameOrAssociateId');

        // Search button — type="submit" inside form[ewn-submit]
        this.searchButton = page.locator('form[ewn-submit] button[type="submit"]');

        // AngularJS ewn-dual-list
        this.dualListContainer  = page.locator('ewn-dual-list');
        this.availablePanel     = page.locator('.dual-list-left');
        this.selectedPanel      = page.locator('.dual-list-right');
        this.availableItems     = page.locator('.dual-list-left .list-group-item.vs-repeat-repeated-element');
        this.selectedItems      = page.locator('.dual-list-right .list-group-item.vs-repeat-repeated-element');
        this.moveRightButton    = page.locator('.move-button-group .ri-arrow-right-s-line');
        this.moveLeftButton     = page.locator('.move-button-group .ri-arrow-left-s-line');
        this.selectAllAvailable = page.locator('.dual-list-left .list-group-header input[type="checkbox"]');
        this.selectAllSelected  = page.locator('.dual-list-right .list-group-header input[type="checkbox"]');
        this.availableSearchInput = page.locator('.dual-list-left input[placeholder="Search"]');
        this.selectedSearchInput  = page.locator('.dual-list-right input[placeholder="Search"]');

        // Export CSV button — type="button" .button-primary inside form
        this.exportCsvButton = page.locator('form[ewn-submit] button.button-primary');

        // cg-busy loading overlay (AngularJS cg-busy spinner)
        this.cgBusyOverlay = page.locator('.cg-busy.cg-busy-backdrop').first();
        this.cgBusyText    = page.locator('.cg-busy-default-text');

        // Toast
        this.toastAlert = page.locator('div.toast[role="alert"]');
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.goto(ECardDataExportPage.URL);
    }

    // ── Company selection ────────────────────────────────────────────────────

    async selectCompany(name: string) {
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.companySearchInput.click();
        await this.companySearchInput.pressSequentially(name, { delay: 50 });
        const dropdown = this.page.locator('ul.company-dropdown');
        await dropdown.waitFor({ state: 'visible', timeout: 15000 });
        const option = this.companyDropdownOptions.filter({ hasText: name }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        await this.selectedCompanyDisplay.waitFor({ state: 'visible', timeout: 10000 });
    }

    async clickChangeCompany() {
        await this.changeLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.changeLink.click();
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
    }

    async expectCompanyInputVisible() {
        await expect(this.companySearchInput, 'Company input should be visible').toBeVisible();
    }

    async expectCompanyInputEmpty() {
        await expect(this.companySearchInput).toHaveValue('');
    }

    async expectSelectedCompanyIs(name: string) {
        await expect(this.selectedCompanyDisplay).toContainText(new RegExp(name, 'i'));
    }

    async expectChangeLinkVisible() {
        await expect(this.changeLink, 'Change link visible after company selected').toBeVisible();
    }

    async expectChangeLinkNotVisible() {
        await expect(this.changeLink).toBeHidden();
    }

    async expectMagnifyingGlassVisible() {
        await expect(this.companyMagnifyingGlass).toBeVisible();
    }

    async expectValidationRedOnCompany() {
        await expect(this.highlightErrorDiv, 'Company field should have has-error class').toHaveClass(/has-error/);
    }

    async expectCompanyValidationMessageVisible() {
        await expect(this.companyValidationError, 'Required message should be visible').toBeVisible();
        await expect(this.companyValidationError).toContainText(/required/i);
    }

    // ── Top-level filters ────────────────────────────────────────────────────

    async setHasPhoto(option: 'Yes' | 'No' | 'All') {
        await this.hasPhotoSelect.selectOption({ label: option });
    }

    async setHasECard(option: 'Yes' | 'No' | 'All') {
        await this.hasECardSelect.selectOption({ label: option });
    }

    async checkAllActiveEmployees() {
        if (!(await this.allActiveCheckbox.isChecked())) {
            await this.allActiveCheckbox.check();
        }
    }

    async uncheckAllActiveEmployees() {
        if (await this.allActiveCheckbox.isChecked()) {
            await this.allActiveCheckbox.uncheck();
        }
    }

    // ── Advanced Employee Filter ──────────────────────────────────────────────

    async expandAdvancedFilter() {
        const isExpanded = await this.advancedFilterButton.getAttribute('aria-expanded');
        if (isExpanded !== 'true') {
            await this.advancedFilterButton.click();
            await this.advancedFilterPanel.waitFor({ state: 'visible', timeout: 10000 });
        }
    }

    async collapseAdvancedFilter() {
        const isExpanded = await this.advancedFilterButton.getAttribute('aria-expanded');
        if (isExpanded === 'true') {
            await this.advancedFilterButton.click();
            await this.advancedFilterPanel.waitFor({ state: 'hidden', timeout: 10000 });
        }
    }

    async expectAdvancedFilterCollapsed() {
        await expect(this.advancedFilterPanel, 'Advanced Filter panel should be collapsed').toBeHidden();
    }

    async expectAdvancedFilterExpanded() {
        await expect(this.advancedFilterPanel, 'Advanced Filter panel should be expanded').toBeVisible();
    }

    async expectAdvancedFilterComponentHidden() {
        await expect(this.advancedFilterComponent, 'Advanced filter component should be hidden when All Active is checked').toBeHidden();
    }

    async expectAdvancedFilterComponentVisible() {
        await expect(this.advancedFilterComponent).toBeVisible();
    }

    async selectFacility(value: string) {
        await this.facilitySelect.selectOption({ label: value });
    }

    async selectJobTitle(value: string) {
        await this.jobTitleSelect.selectOption({ label: value });
    }

    async selectGroup(value: string) {
        await this.groupSelect.selectOption({ label: value });
    }

    async selectProject(value: string) {
        await this.projectSelect.selectOption({ label: value });
    }

    async selectSupervisor(value: string) {
        await this.supervisorSelect.selectOption({ label: value });
    }

    async selectTestingPool(value: string) {
        await this.testingPoolSelect.selectOption({ label: value });
    }

    async selectUserType(value: string) {
        await this.userTypeSelect.selectOption({ label: value });
    }

    async expectUserStatusIsActive() {
        await expect(this.userStatusDisplay, 'User Status should display Active').toContainText('Active');
    }

    async fillNameAssociateId(text: string) {
        await this.nameAssociateIdInput.fill(text);
    }

    // ── Search ────────────────────────────────────────────────────────────────

    async clickSearch() {
        await this.searchButton.click();
    }

    async expectSearchButtonEnabled() {
        await expect(this.searchButton).toBeEnabled();
    }

    // ── Dual list ────────────────────────────────────────────────────────────

    async waitForDualListToLoad() {
        await this.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });
        await this.availablePanel.scrollIntoViewIfNeeded();
    }

    async searchAndWaitForResults() {
        await this.clickSearch();
        await this.dualListContainer.waitFor({ state: 'visible', timeout: 20000 });
    }

    async expectDualListVisible() {
        await expect(this.availablePanel, 'Available Associates panel should be visible').toBeVisible();
        await expect(this.selectedPanel, 'Selected Associates panel should be visible').toBeVisible();
    }

    async expectDualListHidden() {
        await expect(this.dualListContainer, 'Dual list should be hidden').toBeHidden();
    }

    async expectAvailableListEmpty() {
        await this.availablePanel.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.availableItems).toHaveCount(0, { timeout: 10000 });
    }

    async expectAvailableListHasItems() {
        await this.availableItems.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    async getAvailableCount(): Promise<number> {
        return await this.availableItems.count();
    }

    async getSelectedCount(): Promise<number> {
        return await this.selectedItems.count();
    }

    async getFirstAvailableText(): Promise<string> {
        return (await this.availableItems.first().locator('span').textContent()) ?? '';
    }

    async clickSelectAllAvailable() {
        await this.selectAllAvailable.click();
    }

    async clickSelectAllSelected() {
        await this.selectAllSelected.click();
    }

    async moveCheckedToSelected() {
        await this.moveRightButton.click();
    }

    async moveCheckedToAvailable() {
        await this.moveLeftButton.click();
    }

    async filterAvailableList(text: string) {
        await this.availableSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.availableSearchInput.fill(text);
    }

    async filterSelectedList(text: string) {
        await this.selectedSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.selectedSearchInput.fill(text);
    }

    async clearAvailableFilter() {
        await this.availableSearchInput.fill('');
    }

    async clearSelectedFilter() {
        await this.selectedSearchInput.fill('');
    }

    async moveFirstAvailableToSelected() {
        const first = this.availableItems.first();
        await first.waitFor({ state: 'visible', timeout: 15000 });
        await first.locator('input[type="checkbox"]').click();
        await this.moveRightButton.click();
    }

    async moveFirstSelectedToAvailable() {
        const first = this.selectedItems.first();
        await first.waitFor({ state: 'visible', timeout: 10000 });
        await first.locator('input[type="checkbox"]').click();
        await this.moveLeftButton.click();
    }

    async dragFirstAvailableToSelected() {
        // NOTE: Drag-and-drop is inherently brittle with virtual DOM; uses Playwright mouse API
        const sourceItem = this.availableItems.first();
        const targetPanel = this.selectedPanel;
        await sourceItem.waitFor({ state: 'visible', timeout: 15000 });
        const sourceBbox = await sourceItem.boundingBox();
        const targetBbox = await targetPanel.boundingBox();
        if (!sourceBbox || !targetBbox) throw new Error('Could not get bounding boxes for drag');
        await this.page.mouse.move(
            sourceBbox.x + sourceBbox.width / 2,
            sourceBbox.y + sourceBbox.height / 2
        );
        await this.page.mouse.down();
        await this.page.mouse.move(
            targetBbox.x + targetBbox.width / 2,
            targetBbox.y + targetBbox.height / 2,
            { steps: 10 }
        );
        await this.page.mouse.up();
    }

    async dragFirstSelectedToAvailable() {
        const sourceItem = this.selectedItems.first();
        const targetPanel = this.availablePanel;
        await sourceItem.waitFor({ state: 'visible', timeout: 10000 });
        const sourceBbox = await sourceItem.boundingBox();
        const targetBbox = await targetPanel.boundingBox();
        if (!sourceBbox || !targetBbox) throw new Error('Could not get bounding boxes for drag');
        await this.page.mouse.move(
            sourceBbox.x + sourceBbox.width / 2,
            sourceBbox.y + sourceBbox.height / 2
        );
        await this.page.mouse.down();
        await this.page.mouse.move(
            targetBbox.x + targetBbox.width / 2,
            targetBbox.y + targetBbox.height / 2,
            { steps: 10 }
        );
        await this.page.mouse.up();
    }

    // ── Export CSV ────────────────────────────────────────────────────────────

    async expectExportCsvVisible() {
        await expect(this.exportCsvButton, 'Export CSV button should be visible').toBeVisible();
    }

    async expectExportCsvHidden() {
        await expect(this.exportCsvButton, 'Export CSV button should be hidden').toBeHidden();
    }

    // ── Loading overlay ──────────────────────────────────────────────────────

    async expectLoadingOverlayVisible() {
        await expect(this.cgBusyOverlay, 'Loading overlay should be visible during API call').toBeVisible({ timeout: 5000 });
    }

    async expectLoadingOverlayHidden() {
        await expect(this.cgBusyOverlay).toBeHidden({ timeout: 15000 });
    }

    async expectLoadingTextVisible() {
        await expect(this.cgBusyText, '"Please Wait..." loading text should be visible').toBeVisible({ timeout: 5000 });
    }
}
