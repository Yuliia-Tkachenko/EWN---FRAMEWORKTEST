# ITEM-5834 ISN Manual Export Test Plan

## Application Overview

Test plan for ITEM-5834, which converts the ISN Manual Export page (`/legacy/IsnManualExport`) from AngularJS to Vue. The page lets an EWN or company user select a company via a `uib-typeahead` input, then move employees between Available and Selected dual-list panels and click **Export to ISN** to submit the selection. After a successful export the `persistentAlert` Vue component shows a dismissible success banner. The dual list is the same Vue `associate-dual-listbox` component used on the Login Statistics Report (ITEM-6668). Explored live at `https://test-app.ewn.com/legacy/IsnManualExport` as an EWN user selecting company NTC.

**Page object:** `pages/utilities/IsnManualExportPage.ts`
**Test files:** `tests/ITEM-5834/`
**Seed:** `tests/seed.spec.ts`

---

## Test Scenarios

### 1. Page Load & Permissions

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC01 — Page Loads with Correct Title and Heading ✅

**File:** `tests/ITEM-5834/TC01-page-title-heading.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`.
    - expect: The browser tab / document title contains 'ISN Manual Export' (case-insensitive).
    - expect: An `<h1>` or prominent page heading with text matching 'ISN Manual Export' is visible.
    - expect: The page loads without a JavaScript error.

#### 1.2. TC02 — Page Navigation / Breadcrumb ✅

**File:** `tests/ITEM-5834/TC02-breadcrumb-navigation.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`.
    - expect: A breadcrumb or navigation trail is displayed that includes a link back to the parent section (e.g. 'Utilities' or 'Home').
    - expect: The current page label in the breadcrumb matches 'ISN Manual Export'.

#### 1.3. TC03 — Permission Guard: User Without IsnManualUpload.View Cannot Access ➕

**File:** `tests/ITEM-5834/TC03-permission-guard.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as a user account that does NOT have the `IsnManualUpload.View` permission. Navigate directly to `/legacy/IsnManualExport`.
    - expect: The user is redirected to an access-denied page, the login page, or a 403/401 error message is shown.
    - expect: The ISN Manual Export form/content is NOT rendered.

#### 1.4. TC04 — Initial Page State: Only Info Panel and Company Input Visible ✅

**File:** `tests/ITEM-5834/TC04-initial-state.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Do NOT select any company.
    - expect: An informational panel or description text about ISN Manual Export is visible.
    - expect: The 'Select Company' typeahead input field is visible and empty.
    - expect: The Associate Dual List (Available Employees / Selected Employees) is NOT visible.
    - expect: The 'Export to ISN' button is NOT visible.
    - expect: No 'Change' link is present.

---

### 2. Company Selection

#### 2.1. TC05 — Company Typeahead: Dropdown Appears After Typing ✅

**File:** `tests/ITEM-5834/TC05-typeahead-dropdown-appears.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Click on the 'Select Company' typeahead input. Type 'NTC'.
    - expect: A dropdown/listbox appears beneath the input field within 15 seconds.
    - expect: The dropdown contains at least one option matching 'NTC'.
    - expect: The dropdown uses the AngularJS `uib-typeahead-popup` role="listbox" pattern.

#### 2.2. TC06 — Company Typeahead: Selecting Company Shows Dual List ✅

**File:** `tests/ITEM-5834/TC06-company-selection-shows-dual-list.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Click the 'Select Company' input, type 'NTC', wait for the dropdown, then click the 'NTC' option.
    - expect: The typeahead input is replaced by a static display showing the selected company name 'NTC'.
    - expect: A 'Change' link appears next to the company display.
    - expect: The Associate Dual List ('Available Employees' / 'Selected Employees' panels) becomes visible.
    - expect: The 'Export to ISN' button becomes visible.
    - expect: The Available Employees panel is populated with at least one employee entry.

#### 2.3. TC07 — Company Typeahead: Dropdown Filters by Partial Name ➕

**File:** `tests/ITEM-5834/TC07-typeahead-partial-match.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Click the 'Select Company' input and type 'NT'.
    - expect: The dropdown appears and shows only companies whose names contain or start with 'NT'.
    - expect: Companies that do not match 'NT' are not shown in the dropdown.
  2. Continue typing to make the text 'NTC'.
    - expect: The dropdown narrows to show only NTC (and any other company matching 'NTC').

#### 2.4. TC08 — Change Button Resets to Initial State ✅

**File:** `tests/ITEM-5834/TC08-change-button-resets.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Confirm the dual list and 'Export to ISN' button are visible.
    - expect: Associate Dual List is visible. 'Export to ISN' button is visible.
  2. Click the 'Change' link next to the selected company name.
    - expect: The selected company name display is hidden.
    - expect: The 'Select Company' typeahead input reappears and is empty.
    - expect: The 'Change' link disappears.
    - expect: The Associate Dual List is hidden.
    - expect: The 'Export to ISN' button is hidden.

#### 2.5. TC09 — Negative: No Company Match Returns Empty Dropdown ➕

**File:** `tests/ITEM-5834/TC09-typeahead-no-results.spec.ts`

**Priority:** Low

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Click the 'Select Company' input and type 'ZZZNONEXISTENT'.
    - expect: Either the dropdown does not appear, or it appears with a 'No results found' message.
    - expect: No JavaScript error or application crash occurs.
    - expect: The page remains functional after this action.

---

### 3. Dual List Interaction

#### 3.1. TC10 — Dual List: Available Employees Populated After Company Selection ✅

**File:** `tests/ITEM-5834/TC10-available-employees-populated.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'.
    - expect: The 'Available Employees' section heading is visible.
    - expect: At least one employee item (with role="option") is visible in the Available Employees panel.
    - expect: The 'Selected Employees' panel is visible but initially empty (zero selected items).

#### 3.2. TC11 — Dual List: Move Employee from Available to Selected ✅

**File:** `tests/ITEM-5834/TC11-move-employee-to-selected.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Wait for the Available Employees list to load.
    - expect: Available Employees list has at least one item. Selected Employees list has zero items.
  2. Check the checkbox next to the first available employee.
    - expect: The employee checkbox is checked.
    - expect: The 'Move to Selected' button (→) becomes active/enabled.
  3. Click the 'Move to Selected' button.
    - expect: The employee moves from the Available list to the Selected list.
    - expect: The employee is no longer in the Available list.
    - expect: The Selected Employees list now shows exactly one item.

#### 3.3. TC12 — Dual List: Move Employee from Selected Back to Available ✅

**File:** `tests/ITEM-5834/TC12-move-employee-to-available.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Move the first available employee to the Selected list (as in TC11).
    - expect: One employee is in the Selected Employees list.
  2. Check the checkbox next to the employee in the Selected list. Click the 'Move to Available' button (←).
    - expect: The employee returns to the Available Employees list.
    - expect: The Selected Employees list is empty again.

#### 3.4. TC13 — Dual List: Search Filter Narrows Available Employees ✅

**File:** `tests/ITEM-5834/TC13-search-filter-available.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Wait for the Available Employees list to load. Note the initial count of available employees.
    - expect: Multiple employees are visible in Available Employees.
  2. Type a partial employee name (e.g. 'admin') into the search input inside the Available Employees panel.
    - expect: The Available Employees list is filtered in real time (or after pressing Enter/Filter) to show only employees whose name matches 'admin'.
    - expect: Employees not matching the search term are removed from the Available list.
    - expect: No page error or crash occurs.

#### 3.5. TC14 — Dual List: Search Filter Narrows Selected Employees ➕

**File:** `tests/ITEM-5834/TC14-search-filter-selected.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Move two or more employees to the Selected list.
    - expect: At least two employees are in the Selected Employees panel.
  2. Type a partial name into the search input inside the Selected Employees panel.
    - expect: The Selected Employees list is filtered to show only matching employees.
    - expect: Employees in the Selected list that do not match the filter are hidden.
    - expect: The Available Employees list is unaffected by the Selected panel search.

#### 3.6. TC15 — Dual List: Negative — Filter Returns No Results ➕

**File:** `tests/ITEM-5834/TC15-search-filter-no-results.spec.ts`

**Priority:** Low

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. In the Available Employees search input, type 'zzz_nonexistent_xyz'.
    - expect: The Available Employees list shows zero employee items.
    - expect: No JavaScript error or application crash occurs.
    - expect: The page and dual list component remain functional after this action.

---

### 4. Export to ISN

#### 4.1. TC16 — Loading Overlay Displays Briefly During API Call ➕

**File:** `tests/ITEM-5834/TC16-export-button-visible.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'JuliaLLC'. Move at least one employee to the Selected list.
  2. Intercept the export API call (`/legacy/ApiProxy?url=…isn-evaluation-exports`) to hold the response, then click 'Export to ISN'.
    - expect: A loading overlay appears briefly while the API call is in progress.
    - expect: The 'Export to ISN' button is disabled (not clickable) during the in-flight request.
  3. Release the intercepted request.
    - expect: The loading overlay disappears.
    - expect: A success alert is shown confirming the export was accepted.

#### 4.2. TC17 — Export Button: Not Visible Before Company Selection ✅

**File:** `tests/ITEM-5834/TC17-export-button-hidden-initial.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Do NOT select any company.
    - expect: The 'Export to ISN' button is NOT visible on the page.

#### 4.3. TC18 — Export Button: Successful Export Shows Success Alert ✅

**File:** `tests/ITEM-5834/TC18-export-success-alert.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Move at least one employee to the Selected list. Click the 'Export to ISN' button.
    - expect: A success alert/banner is displayed (via the `persistentAlert` Vue component).
    - expect: The alert text indicates the export was submitted or completed successfully (e.g. 'Export submitted', 'Success').
    - expect: No error alert is shown.

#### 4.4. TC19 — Export Button: Duplicate Request Prevention ✅

**File:** `tests/ITEM-5834/TC19-export-duplicate-prevention.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Move at least one employee to the Selected list.
  2. Click the 'Export to ISN' button rapidly twice (double-click or two quick clicks).
    - expect: Only one export request is submitted (the button is disabled or becomes unresponsive after the first click while the request is in-flight).
    - expect: No duplicate export requests are fired.
    - expect: After the response arrives, the success (or error) alert is shown exactly once.

#### 4.5. TC20 — Export Button: API Error Shows Failure Alert ⚠️

**File:** `tests/ITEM-5834/TC20-export-error-alert.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Move at least one employee to the Selected list.
  2. Intercept / mock the Export API call to return a 500 error, then click the 'Export to ISN' button.
    - expect: A failure/error alert is displayed indicating the export could not be completed.
    - expect: No success alert is shown.
    - expect: The page remains functional after the error (user can retry).

  **Note (⚠️ Gap):** Requires network interception (`page.route()`). Confirm the exact API endpoint path from the network tab before implementing. If the error state is not reachable in test environment without mocking, mark this test `.skip` and file a note.

#### 4.6. TC27 — Export Button Disabled When No Employees in Selected ➕

**File:** `tests/ITEM-5834/TC27-export-button-disabled-no-selection.spec.ts`

**Priority:** High

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'JuliaLLC'. Wait for the dual list to load. Do NOT move any employees to the Selected panel.
    - expect: The Available Employees panel has at least one employee item.
    - expect: The Selected Employees panel is empty (zero items).
    - expect: The 'Export to ISN' button is **disabled** (greyed out, not clickable) when no employees are in the Selected panel.

---

### 5. persistentAlert Component

#### 5.1. TC21 — persistentAlert: Success Banner Persists After Navigation ✅

**File:** `tests/ITEM-5834/TC21-persistent-alert-persists.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Perform a successful export (see TC18). Confirm the success alert appears.
    - expect: The success alert banner is visible.
  2. Navigate to another page (e.g. Home or any Utilities page) and then navigate back to `/legacy/IsnManualExport`.
    - expect: The success alert banner is still displayed after returning to the page (or, if it is a page-level alert, it appears on the redirected page).

  **Note:** Depending on implementation, the `persistentAlert` may use session storage or a Vuex/AngularJS shared service. Verify the actual persistence mechanism during implementation.

#### 5.2. TC22 — persistentAlert: Alert Can Be Dismissed ✅

**File:** `tests/ITEM-5834/TC22-persistent-alert-dismiss.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Perform a successful export so the success alert is visible.
    - expect: A dismiss button (✕ or 'Close') is visible on the alert banner.
  2. Click the dismiss button on the alert.
    - expect: The alert disappears.
    - expect: The rest of the page remains functional after dismissal.

---

### 6. Styling & Visual Regression

#### 6.1. TC23 — Dual List Component: Style Parity ✅

**File:** `tests/ITEM-5834/TC23-dual-list-style-parity.spec.ts`

**Priority:** Medium

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Observe the Associate Dual List component.
    - expect: The Dual List renders with two columns: 'Available Employees' on the left, 'Selected Employees' on the right.
    - expect: Each column has a search input at the top.
    - expect: Transfer control buttons (Move to Selected / Move to Available) are displayed between the two columns.
    - expect: Employee items are displayed with checkboxes and full name + ID.
    - expect: No visible CSS regression (broken layout, overlapping elements, missing borders, incorrect spacing).

#### 6.2. TC24 — Export Button Styling ➕

**File:** `tests/ITEM-5834/TC24-export-button-style.spec.ts`

**Priority:** Low

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Select company 'NTC'. Observe the 'Export to ISN' button.
    - expect: The button has a yellow/primary background color consistent with the design spec.
    - expect: The button label is exactly 'Export to ISN' (or as defined in the AC).
    - expect: The button is positioned below the dual list panels.
    - expect: The button is horizontally centered or right-aligned per the design.

---

### 7. Keyboard Navigation

#### 7.1. TC25 — Keyboard Navigation: Tab Through Form Elements ➕

**File:** `tests/ITEM-5834/TC25-keyboard-navigation.spec.ts`

**Priority:** Low

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/IsnManualExport`. Click inside the 'Select Company' input. Press Tab repeatedly.
    - expect: Tab key moves focus through all interactive form elements in a logical order: company input → (after selection) dual list controls → Export button.
    - expect: No focus traps occur (Tab always moves to the next element).
    - expect: All interactive elements are reachable via keyboard alone.
  2. After selecting a company via keyboard (type 'NTC', press Arrow Down to highlight, press Enter to confirm):
    - expect: Company is selected and focus moves appropriately to the dual list or next interactive element.
    - expect: The 'Export to ISN' button is reachable via Tab and can be activated with Space or Enter.

---

## Coverage Summary

| TC   | Description                                      | Type | Priority |
|------|--------------------------------------------------|------|----------|
| TC01 | Page title and heading                           | ✅   | High     |
| TC02 | Breadcrumb navigation                            | ✅   | Medium   |
| TC03 | Permission guard (no IsnManualUpload.View)       | ➕   | High     |
| TC04 | Initial state — only info panel + company input  | ✅   | High     |
| TC05 | Typeahead dropdown appears after typing          | ✅   | High     |
| TC06 | Company selection shows dual list                | ✅   | High     |
| TC07 | Typeahead partial match filtering                | ➕   | Medium   |
| TC08 | Change button resets to initial state            | ✅   | High     |
| TC09 | No company match → empty dropdown               | ➕   | Low      |
| TC10 | Available employees populated after selection    | ✅   | High     |
| TC11 | Move employee from Available to Selected         | ✅   | High     |
| TC12 | Move employee from Selected back to Available    | ✅   | High     |
| TC13 | Search filter narrows Available employees        | ✅   | High     |
| TC14 | Search filter narrows Selected employees         | ➕   | Medium   |
| TC15 | Search filter — no results (negative)            | ➕   | Low      |
| TC16 | Loading overlay displays during API call          | ➕   | High     |
| TC17 | Export button hidden before company selection    | ✅   | High     |
| TC18 | Successful export shows success alert            | ✅   | High     |
| TC19 | Duplicate request prevention                     | ✅   | High     |
| TC20 | API error shows failure alert                    | ⚠️   | Medium   |
| TC21 | persistentAlert persists after navigation        | ✅   | Medium   |
| TC22 | persistentAlert can be dismissed                 | ✅   | Medium   |
| TC23 | Dual list style parity                           | ✅   | Medium   |
| TC24 | Export button styling                            | ➕   | Low      |
| TC25 | Keyboard navigation                              | ➕   | Low      |
| TC27 | Export button disabled — no employees in Selected | ➕   | High     |

**Legend:** ✅ Covers existing manual TC &nbsp;|&nbsp; ➕ New Playwright-only TC &nbsp;|&nbsp; ⚠️ Gap or risk requiring special handling

---

## Page Object Outline

**File:** `pages/utilities/IsnManualExportPage.ts`

```typescript
// Locators (mirrors LoginStatisticsReportPage.ts conventions)
companySearchInput    = page.locator('input[uib-typeahead]');
companyDropdownOptions = page.locator('ul[uib-typeahead-popup][role="listbox"] li');
selectedCompanyDisplay = page.locator('p.form-control-static');
changeLink            = page.locator('a[ng-click*="changeSelection"]');

associateDualListbox  = page.locator('associate-dual-listbox');
availablePanel        = page.locator('section[aria-label="Available Employees"]');
selectedPanel         = page.locator('section[aria-label="Selected Employees"]');
availableItems        = page.locator('section[aria-label="Available Employees"] .dual-list-item[role="option"]');
selectedItems         = page.locator('section[aria-label="Selected Employees"] .dual-list-item[role="option"]');
moveRightButton       = page.getByRole('button', { name: /move to selected/i });
moveLeftButton        = page.getByRole('button', { name: /move to available/i });

exportButton          = page.getByRole('button', { name: /export to isn/i });
persistentAlert       = page.locator('.persistent-alert, [role="alert"]').first();
alertDismissButton    = page.locator('.persistent-alert .close, [role="alert"] button').first();
```

**Key methods to implement:**
- `navigateTo()` — `page.goto('/legacy/IsnManualExport')`
- `selectCompany(name)` — click + pressSequentially + dropdown click (same as LoginStatisticsReportPage)
- `clickChangeCompany()`
- `waitForDualListToLoad()`
- `moveFirstAvailableItemToSelected()`
- `moveFirstSelectedItemToAvailable()`
- `clickExportButton()`
- `expectSuccessAlertVisible()`
- `expectErrorAlertVisible()`
- `dismissAlert()`
- `searchAvailableEmployees(text)`
- `searchSelectedEmployees(text)`
