import { Page, expect, Locator } from '@playwright/test';

export class LoginStatisticsReportPage {
    private readonly page: Page;

    // ── Company selection (AngularJS uib-typeahead) ──────────────────────────
    private readonly companySearchInput: Locator;
    private readonly companyDropdownOptions: Locator;
    private readonly selectedCompanyDisplay: Locator;
    private readonly changeLink: Locator;

    // ── Vue associate-dual-listbox component ─────────────────────────────────
    private readonly associateDualListbox: Locator;

    // ── Filter accordion (inside associate-dual-listbox) ─────────────────────
    private readonly filterHeaderButton: Locator;
    private readonly filterPanel: Locator;
    private readonly filterButton: Locator;

    // ── Filter fields (inside the filter panel body) ─────────────────────────
    private readonly employeeNameInput: Locator;
    private readonly userTypeSelect: Locator;
    private readonly userStatusSelect: Locator;

    // ── Dual list panels ─────────────────────────────────────────────────────
    private readonly availablePanel: Locator;
    private readonly availableItems: Locator;
    private readonly selectedItems: Locator;
    private readonly moveRightButton: Locator;
    private readonly moveLeftButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Company (AngularJS uib-typeahead — no ID on the input)
        this.companySearchInput    = page.locator('input[uib-typeahead]');
        this.companyDropdownOptions = page.locator('ul[uib-typeahead-popup][role="listbox"] li');
        this.selectedCompanyDisplay = page.locator('p.form-control-static');
        this.changeLink            = page.locator('a[ng-click*="changeSelection"]');

        // Vue component root
        this.associateDualListbox = page.locator('associate-dual-listbox');

        // Filter accordion header — a div[role="button"] NOT a <button>
        this.filterHeaderButton = page.locator(
            '.panel-heading.accordion-toggle[role="button"]'
        );

        // Filter panel body — hidden via style="display:none" when collapsed
        this.filterPanel = page.locator('#login-stats-associate-filter-body');

        // Filter button at the bottom of the expanded panel
        this.filterButton = page.locator(
            'associate-dual-listbox button.button-secondary'
        ).filter({ hasText: /filter/i });

        // Filter fields (inside the panel body — no IDs on Employee Name)
        this.employeeNameInput = page.locator(
            '#login-stats-associate-filter-body input[type="text"]'
        );
        this.userTypeSelect    = page.locator('select#associateTypeId');
        this.userStatusSelect  = page.locator('select#status');

        // Dual list — new Vue component (NOT the old AngularJS ewn-dual-list)
        this.availablePanel = page.locator('section[aria-label="Available Employees"]');

        // Virtual-scroll items inside each panel
        this.availableItems = page.locator(
            'section[aria-label="Available Employees"] .dual-list-item[role="option"]'
        );
        this.selectedItems  = page.locator(
            'section[aria-label="Selected Employees"] .dual-list-item[role="option"]'
        );

        // Move buttons between panels
        this.moveRightButton = page.getByRole('button', { name: /move to selected/i });
        this.moveLeftButton  = page.getByRole('button', { name: /move to available/i });
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    async navigateTo() {
        await this.page.goto('/legacy/LoginStatistics');
        await this.page.waitForLoadState('domcontentloaded');
    }

    // ── Company selection ────────────────────────────────────────────────────

    async selectCompany(name: string) {
        await this.companySearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.companySearchInput.click();
        // pressSequentially triggers AngularJS uib-typeahead $watch reliably (fill can miss it)
        await this.companySearchInput.pressSequentially(name);
        const dropdown = this.page.locator('ul[uib-typeahead-popup][role="listbox"]');
        await dropdown.waitFor({ state: 'visible', timeout: 15000 });
        const option = this.companyDropdownOptions.filter({ hasText: name }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        await this.selectedCompanyDisplay.waitFor({ state: 'visible', timeout: 10000 });
    }

    async clickChangeCompany() {
        await this.changeLink.click();
        await this.companySearchInput.waitFor({ state: 'visible' });
    }

    async expectCompanySearchInputVisible() {
        await expect(this.companySearchInput).toBeVisible();
    }

    async expectSelectedCompanyDisplayVisible() {
        await expect(this.selectedCompanyDisplay).toBeVisible();
    }

    async expectSelectedCompanyIs(name: string) {
        await expect(this.selectedCompanyDisplay).toContainText(new RegExp(name, 'i'));
    }

    async expectChangeLinkVisible() {
        await expect(this.changeLink).toBeVisible();
    }

    async expectCompanyRequiredMessageVisible() {
        // After clicking Change, AngularJS shows a required error on the field
        const msg = this.page
            .locator('[ng-messages]')
            .or(this.page.locator('.text-danger'))
            .filter({ hasText: /required/i })
            .first();
        await expect(msg).toBeVisible({ timeout: 5000 });
    }

    // ── Filter accordion ─────────────────────────────────────────────────────

    async expandFilter() {
        // Only click if currently collapsed
        const expanded = await this.filterHeaderButton.getAttribute('aria-expanded');
        if (expanded !== 'true') {
            await this.filterHeaderButton.click();
        }
        await this.filterPanel.waitFor({ state: 'visible', timeout: 5000 });
    }

    async collapseFilter() {
        const expanded = await this.filterHeaderButton.getAttribute('aria-expanded');
        if (expanded === 'true') {
            await this.filterHeaderButton.click();
        }
        await this.filterPanel.waitFor({ state: 'hidden', timeout: 5000 });
    }

    async expectFilterAccordionVisible() {
        await expect(this.filterHeaderButton).toBeVisible();
    }

    async expectFilterAccordionNotVisible() {
        await expect(this.filterHeaderButton).not.toBeVisible();
    }

    async expectFilterCollapsed() {
        // Panel body is hidden (display:none) when collapsed
        await expect(this.filterPanel).toBeHidden();
    }

    async expectFilterExpanded() {
        await expect(this.filterPanel).toBeVisible();
    }

    async expectFilterHeaderHasDownArrow() {
        // Collapsed state: ri-arrow-down-s-line class on the icon span
        await expect(
            this.filterHeaderButton.locator('.ri-arrow-down-s-line')
        ).toBeVisible();
    }

    async expectFilterHeaderHasUpArrow() {
        // Expanded state: ri-arrow-up-s-line class on the icon span
        await expect(
            this.filterHeaderButton.locator('.ri-arrow-up-s-line')
        ).toBeVisible();
    }

    async expectFilterHeaderTooltip(text: string) {
        // Tooltip text is in div.tooltip-inner inside the BVN popover
        const tooltip = this.page.locator('.tooltip-inner');
        await expect(tooltip).toContainText(text);
    }

    // ── Multi-select helpers ─────────────────────────────────────────────────

    private multiSelectToggle(fieldId: string): Locator {
        return this.page.locator(`button#${fieldId}.multi-select-dropdown__toggle`);
    }

    /** Map human-readable label to the button/select ID used in the markup */
    private fieldIdFor(fieldLabel: string): string {
        const map: Record<string, string> = {
            'Facility':      'facilities',
            'Job Title':     'jobTitles',
            'Group':         'groups',
            'Project':       'projects',
            'Supervisor':    'supervisors',
            'Testing Pool':  'substanceTestingPools',
            'Subscription':  'subscriptionTypes',
        };
        return map[fieldLabel] ?? fieldLabel.toLowerCase();
    }

    async getMultiSelectLabel(fieldLabel: string): Promise<string> {
        const id = this.fieldIdFor(fieldLabel);
        const title = this.page.locator(`button#${id} .multi-select-dropdown__title`);
        return ((await title.textContent()) ?? '').trim();
    }

    async expectMultiSelectLabel(fieldLabel: string, expected: string) {
        const id = this.fieldIdFor(fieldLabel);
        const title = this.page.locator(`button#${id} .multi-select-dropdown__title`);
        await expect(title).toContainText(new RegExp(expected, 'i'));
    }

    async openMultiSelect(fieldLabel: string) {
        const id = this.fieldIdFor(fieldLabel);
        const btn = this.multiSelectToggle(id);
        const isOpen = await btn.getAttribute('aria-expanded');
        if (isOpen !== 'true') {
            await btn.click();
        }
        await this.page.locator('.multi-select-dropdown__menu').waitFor({ state: 'visible', timeout: 5000 });
    }

    async selectMultiSelectOption(optionLabel: string) {
        const option = this.page.locator('li.multi-select-dropdown__option')
            .filter({ hasText: optionLabel })
            .first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    async clickSelectAll() {
        await this.page.locator('.multi-select-dropdown__action')
            .filter({ hasText: /select all/i })
            .first()
            .click();
    }

    async clickDeselectAll() {
        await this.page.locator('.multi-select-dropdown__action')
            .filter({ hasText: /deselect all/i })
            .first()
            .click();
    }

    async expectSelectAllControlVisible() {
        await expect(
            this.page.locator('.multi-select-dropdown__action').filter({ hasText: /select all/i }).first()
        ).toBeVisible();
    }

    async expectDeselectAllControlVisible() {
        await expect(
            this.page.locator('.multi-select-dropdown__action').filter({ hasText: /deselect all/i }).first()
        ).toBeVisible();
    }

    // ── User Type / User Status ───────────────────────────────────────────────

    async getUserTypeValue(): Promise<string> {
        return await this.userTypeSelect.inputValue();
    }

    async getUserStatusValue(): Promise<string> {
        return await this.userStatusSelect.inputValue();
    }

    async setUserType(value: string) {
        await this.userTypeSelect.selectOption({ label: value });
    }

    async setUserStatus(value: string) {
        await this.userStatusSelect.selectOption({ label: value });
    }

    async expectUserTypeValue(expected: string) {
        // The default "All Users" option has no value attribute, so we compare by selected option text
        const selected = await this.userTypeSelect.evaluate((sel: HTMLSelectElement) =>
            sel.options[sel.selectedIndex]?.text ?? ''
        );
        expect(selected).toMatch(new RegExp(expected, 'i'));
    }

    async expectUserStatusValue(expected: string) {
        const selected = await this.userStatusSelect.evaluate((sel: HTMLSelectElement) =>
            sel.options[sel.selectedIndex]?.text ?? ''
        );
        expect(selected).toMatch(new RegExp(expected, 'i'));
    }

    async getUserStatusOptions(): Promise<string[]> {
        return await this.userStatusSelect.locator('option').allTextContents();
    }

    async getUserTypeOptions(): Promise<string[]> {
        return await this.userTypeSelect.locator('option').allTextContents();
    }

    // ── Employee Name/ID ─────────────────────────────────────────────────────

    async fillEmployeeName(value: string) {
        await this.employeeNameInput.fill(value);
    }

    async clearEmployeeName() {
        await this.employeeNameInput.clear();
    }

    async expectEmployeeNameInputVisible() {
        await expect(this.employeeNameInput).toBeVisible();
    }

    // ── Filter button ────────────────────────────────────────────────────────

    async clickFilterButton() {
        await this.filterButton.click();
    }

    async pressEnterInFilter() {
        await this.employeeNameInput.press('Enter');
    }

    async expectFilterButtonVisible() {
        await expect(this.filterButton).toBeVisible();
    }

    async expectFilterButtonNotVisible() {
        await expect(this.filterButton).toBeHidden();
    }

    async expectFilterButtonEnabled() {
        await expect(this.filterButton).toBeEnabled();
    }

    async waitForSearchResults() {
        // Wait for the available panel — the virtual list may be hidden when there are no results
        await this.availablePanel.waitFor({ state: 'visible', timeout: 15000 });
    }

    // ── Dual List ────────────────────────────────────────────────────────────

    async expectDualListVisible() {
        await expect(this.availablePanel).toBeVisible();
    }

    async expectDualListNotVisible() {
        await expect(this.associateDualListbox).toBeHidden();
    }

    async waitForDualListToLoad() {
        await this.availablePanel.waitFor({ state: 'visible', timeout: 15000 });
        await this.availableItems.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    async getAvailableItemsCount(): Promise<number> {
        return await this.availableItems.count();
    }

    async expectAvailableItemsCountGreaterThan(n: number) {
        const count = await this.availableItems.count();
        expect(count).toBeGreaterThan(n);
    }

    async moveFirstAvailableItemToSelected() {
        const first = this.availableItems.first();
        await first.waitFor({ state: 'visible' });
        await first.locator('input[type="checkbox"]').click();
        await this.moveRightButton.click();
        await this.selectedItems.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async moveFirstSelectedItemToAvailable() {
        const first = this.selectedItems.first();
        await first.waitFor({ state: 'visible' });
        await first.locator('input[type="checkbox"]').click();
        await this.moveLeftButton.click();
    }

    async expectSelectedItemsCount(n: number) {
        await expect(this.selectedItems).toHaveCount(n);
    }

    // ── Empty / error state ──────────────────────────────────────────────────

    async expectNoResultsVisible() {
        // The app does not render any "no results" text when the filter returns zero
        // employees. Instead the virtual-scroll listbox collapses to height:0 and
        // contains zero [role="option"] items.  Assert that the available panel is
        // present but empty.
        await this.availablePanel.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.availableItems).toHaveCount(0, { timeout: 10000 });
    }
}
