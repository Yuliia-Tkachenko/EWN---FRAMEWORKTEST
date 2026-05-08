# ITEM-5835 eCard Data Export — Page Setup, Filters & Search Test Plan

## Application Overview

Test plan for **ITEM-5835** ("[BMAD] Convert eCard Data Export — Page Setup, Filters & Search"), the first of two stories covering the eCard Data Export page (`/legacy/ECardDataExport`). This story covers:

- **Tab Navigation** — "Search" tab as the sole active tab on page load.
- **Company Selection** — Typeahead autocomplete, Change link, validation, spinner, company-scoped filter reload.
- **Top Level Filters** — Has Photo, Has eCard, All Active Employees defaults and options.
- **Advanced Employee Filter** — Collapsible panel, all dropdowns, User Status/Type, Name/Associate ID, AND logic.
- **All Active Employees Override** — Hides dual list when checked (behavioral change from legacy).
- **Search** — Populates Available Associates, handles zero results, deduplicates against Selected list.
- **Dual List Associate Picker** — Hidden until search, row format, virtual scroll, real-time filter, Select All, arrow buttons, drag-and-drop.
- **Consistency & Quality** — Visual parity with legacy, API error handling, auth error flows, loading overlay.

**Related story:** ITEM-7699 (Export Configuration & CSV Download)  
**Page URL:** `/legacy/ECardDataExport`  
**Page object:** `pages/utilities/ECardDataExportPage.ts`  
**Test files:** `tests/ITEM-5835/`  
**Seed:** `tests/seed.spec.ts`

---

## Test Plan Summary

**53 test cases** total, organized across 9 sections:

| Section | TCs | Key Coverage |
|---|---|---|
| 1. Page Load & Tab Navigation | TC01 | "Search" tab sole active tab |
| 2. Company Selection | TC02–TC10 | Autocomplete, Change link, validation, spinner, filter reload, state reset |
| 3. Top Level Filters | TC11–TC17 | Has Photo/eCard defaults, All Active Employees toggle |
| 4. Advanced Employee Filter | TC18–TC25 | Collapse/expand, company-scoped dropdowns, AND logic, responsiveness |
| 5. All Active Override | TC26 | New behavioral change from legacy — dual list hides |
| 6. Search | TC27–TC30 | Results, zero-results state, re-search, no duplicates |
| 7. Dual List Picker | TC31–TC43 | Hidden until search, row format, virtual scroll, real-time filter, Select All, arrows, drag-drop |
| 8. Consistency & Quality | TC44–TC49 | Visual parity, API errors, auth flow, loading overlay, no console errors |
| 9. Edge Cases & Negatives | TC50–TC53 | No-company block, AND logic zero result, stale state after toggle |

**Mapped from Jira:**
- ✅ 49 from Manual Test Plan (customfield_12307)
- ✅ 4 XRAY test cases absorbed (XRAY-5425, XRAY-5278, XRAY-5098, XRAY-5331)

**New additions:**
- ➕ TC07 (spinner bounding area), TC49 (no console errors), TC50–TC53 (edge/negative cases)

---

## Existing XRAY Test Coverage (from Jira)

| XRAY Key  | Summary                                                                      | Status |
|-----------|------------------------------------------------------------------------------|--------|
| XRAY-5425 | Verify eCard Data Export page loads with correct page header and tab         | To Do  |
| XRAY-5278 | Verify filter panel is collapsed by default when page loads                  | Done   |
| XRAY-5098 | TC-12 Required validation message and red border when Company not selected   | Done   |
| XRAY-5331 | Extra space in "Name / Associate ID" field on eCard Data Export              | Done   |
| XRAY-5435 | Regression suite: eCard Data Export (Test Set)                               | To Do  |

---

## Test Scenarios

### 1. Page Load & Tab Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC01 — Verify Page Loads with Correct Header and "Search" Tab Active ✅

**XRAY:** XRAY-5425  
**File:** `tests/ITEM-5835/TC01-page-header-tab.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`.
   - expect: The page title or `<h1>` heading contains "eCard Data Export" (case-insensitive).
   - expect: A "Search" tab is visible and marked as the active/selected tab.
   - expect: No other tab is visible or active on page load.
   - expect: The page loads without JavaScript console errors.

---

### 2. Company Selection

#### 2.1. TC02 — Verify Select Company Field Is Blank and Required on Page Load ✅

**File:** `tests/ITEM-5835/TC02-company-field-blank-required.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Do NOT interact with the company field.
   - expect: The Select Company input field is visible and empty.
   - expect: A magnifying glass icon/overlay is displayed on the Select Company field.
   - expect: The Search button is not functional (disabled or triggers validation).
   - expect: The Available Associates / dual list section is hidden.
   - expect: The Export CSV button is not visible.

#### 2.2. TC03 — Verify Autocomplete Triggers on First Character Entry ✅

**File:** `tests/ITEM-5835/TC03-company-autocomplete.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Click the Select Company input and type `N`.
   - expect: An autocomplete dropdown appears beneath the input within 5 seconds.
   - expect: The dropdown contains at least one option with a company name.
2. Type additional characters (e.g., `NT`).
   - expect: The dropdown results narrow to match the typed string.

#### 2.3. TC04 — Verify Selecting Company from Autocomplete Populates the Field ✅

**File:** `tests/ITEM-5835/TC04-company-select-populates.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Type `NTC` into the Select Company field. Click the first autocomplete result.
   - expect: The Select Company field displays the chosen company name.
   - expect: The autocomplete dropdown closes.
   - expect: A "Change" link becomes visible next to the company field.

#### 2.4. TC05 — Verify Magnifying Glass Overlay on Select Company Field ✅

**File:** `tests/ITEM-5835/TC05-magnifying-glass-overlay.spec.ts`  
**Priority:** Low

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`.
   - expect: A magnifying glass icon is overlaid on or adjacent to the Select Company input field.
   - expect: The icon is visible before and after a company is selected.

#### 2.5. TC06 — Verify Change Link Triggers Validation UI (Red Label + Border + Required Text) ✅

**XRAY:** XRAY-5098  
**File:** `tests/ITEM-5835/TC06-change-link-validation.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click the "Change" link.
   - expect: The Select Company label turns red.
   - expect: The company input field is outlined in red.
   - expect: A "Required" validation message in red appears below the input.
   - expect: A Vue 3 spinner appears briefly and covers only the area above the Advanced Employee Filters panel.
   - expect: The spinner disappears without a page reload.

#### 2.6. TC07 — Verify Vue 3 Spinner After Change Click Is Scoped Correctly ➕

**File:** `tests/ITEM-5835/TC07-spinner-area-constraint.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click "Change" rapidly.
   - expect: A loading spinner is visible briefly in the upper portion of the page (above the Advanced Employee Filter section).
   - expect: The spinner does NOT cover the Advanced Employee Filter panel or any area below it.
   - expect: After the spinner disappears, the page is in the "no company selected" state.

#### 2.7. TC08 — Verify Changing Company Reloads All Filter Dropdowns with New Company Scope ✅

**File:** `tests/ITEM-5835/TC08-company-change-reloads-filters.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select company A. Expand Advanced Employee Filter. Note the options in Facility dropdown. Click "Change" and select company B.
   - expect: Facility, Job Title, Group, Project, Supervisor, and Testing Pool dropdowns are repopulated with data scoped to company B.
   - expect: The dropdown options differ from company A's scope (if companies have different data).

#### 2.8. TC09 — Verify Changing Company Resets and Hides Bottom-Level Controls ✅

**File:** `tests/ITEM-5835/TC09-company-change-resets-bottom.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move an associate to Selected Associates. Click "Change".
   - expect: The Available Associates list is hidden.
   - expect: The Selected Associates list is hidden.
   - expect: Any filters below the Search button are hidden.
   - expect: The Export to CSV button is hidden.

#### 2.9. TC10 — Verify Search and Export CSV Are Not Functional Without Company Selected ✅

**File:** `tests/ITEM-5835/TC10-buttons-disabled-no-company.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Do NOT select a company. Click the Search button.
   - expect: A "Required" validation message appears on the Select Company field.
   - expect: The Available Associates / dual list section remains hidden (search is blocked).
   - expect: The Export CSV button remains hidden.

> **Environment discrepancy (AC #11):** In the **Test** environment the app executes the search and populates 11 results in Available Associates, and the Export CSV button becomes visible — despite the validation error. In **Pre-prod** (correct behavior) the dual list and Export CSV remain hidden until a company is selected. The automated test is written against Pre-prod expected behavior and will **fail in Test** as a regression marker until the bug is resolved.

---

### 3. Top Level Filters

#### 3.1. TC11 — Verify "Has Photo" Defaults to "Yes" on Page Load ✅

**File:** `tests/ITEM-5835/TC11-has-photo-default.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Do NOT change any filter.
   - expect: The "Has Photo" control shows "Yes" as the selected/active option.

#### 3.2. TC12 — Verify "Has eCard" Defaults to "No" on Page Load ✅

**File:** `tests/ITEM-5835/TC12-has-ecard-default.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Do NOT change any filter.
   - expect: The "Has eCard" control shows "No" as the selected/active option.

#### 3.3. TC13 — Verify "All Active Employees" Is Unchecked on Page Load ✅

**File:** `tests/ITEM-5835/TC13-all-active-employees-unchecked.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`.
   - expect: The "All Active Employees" checkbox is unchecked on initial page load.

#### 3.4. TC14 — Verify "Has Photo" Offers Yes / No / All Options ✅

**File:** `tests/ITEM-5835/TC14-has-photo-options.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Interact with the "Has Photo" control.
   - expect: Three options are available: Yes, No, All.
   - expect: Each option is selectable and the selection is reflected in the control.

#### 3.5. TC15 — Verify "Has eCard" Offers Yes / No / All Options ✅

**File:** `tests/ITEM-5835/TC15-has-ecard-options.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Interact with the "Has eCard" control.
   - expect: Three options are available: Yes, No, All.
   - expect: Each option is selectable and the selection is reflected in the control.

#### 3.6. TC16 — Verify Checking "All Active Employees" Hides Advanced Filter and Dual List ✅

**File:** `tests/ITEM-5835/TC16-all-active-hides-filter-and-list.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search to reveal the dual list. Check "All Active Employees".
   - expect: The Advanced Employee Filter panel is hidden (or collapsed and non-interactive).
   - expect: The Available Associates list is hidden.
   - expect: The Selected Associates list is hidden.

#### 3.7. TC17 — Verify Unchecking "All Active Employees" Restores the Dual List ✅

**File:** `tests/ITEM-5835/TC17-all-active-uncheck-restores-list.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Check "All Active Employees". Then uncheck it.
   - expect: The dual list associate picker (Available Associates and Selected Associates) is restored and visible.
   - expect: The Advanced Employee Filter panel is accessible again.

---

### 4. Advanced Employee Filter

#### 4.1. TC18 — Verify Advanced Employee Filter Panel Is Collapsed by Default ✅

**XRAY:** XRAY-5278  
**File:** `tests/ITEM-5835/TC18-filter-panel-collapsed-default.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Do NOT click the filter header.
   - expect: The Advanced Employee Filter panel is collapsed (dropdown fields are not visible).
   - expect: The panel header is visible and shows a collapsed state indicator (e.g., chevron pointing down).

#### 4.2. TC19 — Verify Clicking Filter Panel Header Toggles Collapse/Expand ✅

**File:** `tests/ITEM-5835/TC19-filter-panel-toggle.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click the Advanced Employee Filter header.
   - expect: The panel expands and filter fields become visible.
2. Click the header again.
   - expect: The panel collapses and filter fields are hidden.

#### 4.3. TC20 — Verify Filter Dropdowns Are Populated with Company-Scoped Options Defaulting to "All" ✅

**File:** `tests/ITEM-5835/TC20-filter-dropdowns-company-scoped.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select company NTC. Expand Advanced Employee Filter.
   - expect: Facility, Job Title, Group, Project, Supervisor, and Testing Pool dropdowns each have at least one option.
   - expect: Each dropdown shows "All" as the default selected value.
   - expect: Options are scoped to the selected company (not cross-company data).

#### 4.4. TC21 — Verify "User Status" Displays "Active" as Static Non-Editable Value ✅

**File:** `tests/ITEM-5835/TC21-user-status-static.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter.
   - expect: A "User Status" field shows the text "Active".
   - expect: The "User Status" field is read-only / not editable by the user.

#### 4.5. TC22 — Verify "User Type" Defaults to "All Users" and Offers Selectable Options ✅

**File:** `tests/ITEM-5835/TC22-user-type-defaults.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter.
   - expect: The "User Type" dropdown shows "All Users" as the default selection.
   - expect: Clicking the dropdown reveals multiple user type options.
   - expect: A different user type can be selected.

#### 4.6. TC23 — Verify "Name / Associate ID" Accepts Text Entry and Applies It to Search ✅

**XRAY:** XRAY-5331 (regression guard: no extra leading/trailing space)  
**File:** `tests/ITEM-5835/TC23-name-associate-id-filter.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter. Type a partial last name (e.g., `Smith`) in the "Name / Associate ID" field. Click Search.
   - expect: The Available Associates list only contains rows where the associate's name or EWN ID matches "Smith".
   - expect: No leading or trailing whitespace is prepended to the entered value (regression: XRAY-5331).
2. Clear the field and type an EWN ID number. Click Search.
   - expect: Results are filtered to the matching associate.

#### 4.7. TC24 — Verify Multiple Filters Are Combined with AND Logic ✅

**File:** `tests/ITEM-5835/TC24-multiple-filters-and-logic.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter. Select a specific Facility and a specific Job Title. Click Search.
   - expect: The Available Associates list shows only associates matching BOTH the selected Facility AND the selected Job Title.
   - expect: Associates matching only one of the two criteria are NOT shown.

#### 4.8. TC25 — Verify All Filter Fields Are Responsive When Page Is Resized ✅

**File:** `tests/ITEM-5835/TC25-filter-fields-responsive.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter. Resize the browser viewport to a narrow width (e.g., 768px).
   - expect: All filter fields remain visible and accessible (no overflow or clipped inputs).
   - expect: Labels and fields do not overlap.
   - expect: The filter panel is still functional at reduced width.

---

### 5. All Active Employees Override (Behavioral Change from Legacy)

#### 5.1. TC26 — Verify Dual List Hides When "All Active Employees" Is Checked Regardless of Prior Selections ✅

**File:** `tests/ITEM-5835/TC26-all-active-overrides-dual-list.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move one or more associates to the Selected Associates list. Then check "All Active Employees".
   - expect: Both Available Associates and Selected Associates lists immediately become hidden.
   - expect: Previously selected associates are no longer visible.
   - expect: No confusion state is shown (this is a behavioral change from legacy — the old UI left both lists visible, this is intentionally hidden).

---

### 6. Search

#### 6.1. TC27 — Verify Clicking Search Populates the Available Associates List ✅

**File:** `tests/ITEM-5835/TC27-search-populates-available-list.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select company NTC. Click Search.
   - expect: The Available Associates list appears with one or more results.
   - expect: Each row displays in the format `LastName, FirstName - EWN ID`.
   - expect: The dual list section becomes visible.

#### 6.2. TC28 — Verify Zero Search Results Shows Empty/No-Results State ✅

**File:** `tests/ITEM-5835/TC28-search-zero-results.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. In "Name / Associate ID", type an impossible value (e.g., `ZZZZZZZ_DOES_NOT_EXIST`). Click Search.
   - expect: The Available Associates list is visible but empty.
   - expect: An "no results" or empty-state message is displayed (not a hidden list with no message).

#### 6.3. TC29 — Verify Re-Running Search Updates the Available Associates List ✅

**File:** `tests/ITEM-5835/TC29-search-updates-available-list.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search with no filter (wide results). Move associates to Selected. Change the Name filter and click Search again.
   - expect: Available Associates list is refreshed with the new filter criteria.
   - expect: Associates in the Selected list that also match the new search are NOT re-added to Available (no duplicates).

#### 6.4. TC30 — Verify Selected Associates Are Excluded from Available List (No Duplicates) ✅

**File:** `tests/ITEM-5835/TC30-no-duplicates-across-lists.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move associate "Smith, John - 12345" to the Selected list. Click Search again.
   - expect: "Smith, John - 12345" does NOT appear in the Available Associates list after re-search.
   - expect: "Smith, John - 12345" remains in the Selected Associates list.

---

### 7. Dual List Associate Picker

#### 7.1. TC31 — Verify Dual List Is Hidden Until a Search Is Executed ✅

**File:** `tests/ITEM-5835/TC31-dual-list-hidden-before-search.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Do NOT click Search.
   - expect: The Available Associates section is not visible.
   - expect: The Selected Associates section is not visible.
2. Click Search.
   - expect: Both list sections appear.

#### 7.2. TC32 — Verify Associate Row Format Is "LastName, FirstName - EWN ID" ✅

**File:** `tests/ITEM-5835/TC32-associate-row-format.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search.
   - expect: At least one row in Available Associates is visible.
   - expect: Each row matches the pattern `LastName, FirstName - [numeric EWN ID]` (e.g., `Doe, Jane - 98765`).

#### 7.3. TC33 — Verify Virtual Scrolling for Large Result Sets (100+ Items) ✅

**File:** `tests/ITEM-5835/TC33-virtual-scrolling-large-results.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company with 100+ employees. Click Search.
   - expect: The Available Associates list renders without freezing or significant lag.
   - expect: The list is scrollable and items are rendered on demand (only visible rows are in the DOM, or scroll is fluid).
   - expect: Scrolling to the bottom eventually reveals the last associate in the result set.

#### 7.4. TC34 — Verify Available Associates Search Box Filters in Real Time ✅

**File:** `tests/ITEM-5835/TC34-available-search-realtime-filter.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Type a name fragment in the Available Associates search box.
   - expect: The Available Associates list is filtered immediately as each character is typed.
   - expect: Only rows containing the typed text are shown.
2. Clear the search box.
   - expect: All results return to the Available Associates list.

#### 7.5. TC35 — Verify Selected Associates Search Box Filters in Real Time ✅

**File:** `tests/ITEM-5835/TC35-selected-search-realtime-filter.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move multiple associates to Selected. Type a name fragment in the Selected Associates search box.
   - expect: The Selected Associates list is filtered immediately as each character is typed.
   - expect: Only rows containing the typed text are shown in Selected.
   - expect: The Available Associates list is unaffected.

#### 7.6. TC36 — Verify "Select All" in Available Associates Selects All Visible Items ✅

**File:** `tests/ITEM-5835/TC36-select-all-available.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Click the "Select All" checkbox in the Available Associates header.
   - expect: All currently visible rows in Available Associates are checked.
2. Click "Select All" again.
   - expect: All checked rows are deselected.

#### 7.7. TC37 — Verify "Select All" with Active Filter Only Selects Visible (Filtered) Items ✅

**File:** `tests/ITEM-5835/TC37-select-all-filtered-subset.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Type a filter in the Available Associates search box to narrow the list. Click "Select All".
   - expect: Only the currently visible (filtered) rows are checked.
   - expect: Rows that were hidden by the filter are NOT selected.

#### 7.8. TC38 — Verify "Select All" in Selected Associates Selects All Visible Items ✅

**File:** `tests/ITEM-5835/TC38-select-all-selected.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move multiple associates to Selected. Click "Select All" in the Selected Associates header.
   - expect: All visible rows in Selected Associates are checked.
2. Click "Select All" again.
   - expect: All rows are deselected.

#### 7.9. TC39 — Verify Individual Row Checkbox Selects Only That Row ✅

**File:** `tests/ITEM-5835/TC39-individual-row-checkbox.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Check the checkbox on a single row in Available Associates.
   - expect: Only that row is checked.
   - expect: Other rows remain unchecked.

#### 7.10. TC40 — Verify Right Arrow Moves Checked Items from Available to Selected ✅

**File:** `tests/ITEM-5835/TC40-right-arrow-moves-to-selected.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Check two rows in Available Associates. Click the right arrow (→) button.
   - expect: The two checked rows disappear from Available Associates.
   - expect: The two rows appear in Selected Associates.
   - expect: The rows are no longer checkable from Available.

#### 7.11. TC41 — Verify Left Arrow Moves Checked Items from Selected Back to Available ✅

**File:** `tests/ITEM-5835/TC41-left-arrow-moves-to-available.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move two associates to Selected. Check one in Selected. Click the left arrow (←) button.
   - expect: The checked row is removed from Selected Associates.
   - expect: The row reappears in Available Associates.

#### 7.12. TC42 — Verify Drag and Drop Moves Items Between Lists ✅

**File:** `tests/ITEM-5835/TC42-drag-drop-between-lists.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Drag an associate row from Available Associates and drop it onto the Selected Associates panel.
   - expect: The row moves to Selected Associates.
   - expect: The row is no longer present in Available Associates.
2. Drag the same row from Selected back to Available.
   - expect: The row moves back to Available Associates.

#### 7.13. TC43 — Verify Dual List Is Hidden When "All Active Employees" Is Checked ✅

**File:** `tests/ITEM-5835/TC43-dual-list-hidden-all-active.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Check "All Active Employees".
   - expect: The entire dual list section (both Available and Selected Associate panels, search boxes, arrow buttons) is hidden.
   - expect: No duplicate or stale state from prior selections is shown.

---

### 8. Consistency & Quality / Error Handling

#### 8.1. TC44 — Verify UI/UX Is Visually Consistent with the Legacy Version ✅

**File:** `tests/ITEM-5835/TC44-visual-consistency-legacy.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport` (Vue 3 version).
   - expect: Layout, spacing, font sizes, and color scheme match the legacy AngularJS version's design.
   - expect: No obvious visual regressions (misaligned controls, incorrect font weight, broken icons).

#### 8.2. TC45 — Verify API Failure Displays Appropriate Error Message ✅

**File:** `tests/ITEM-5835/TC45-api-failure-error-message.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Mock or simulate a failed API response for the company autocomplete or search endpoint. Trigger the action (type a company name or click Search).
   - expect: An error message or toast notification is displayed to the user using the existing error handling pattern.
   - expect: The page does not crash or display a blank/broken state.
   - expect: No unhandled JavaScript errors appear in the console.

#### 8.3. TC46 — Verify Unauthorized Access Triggers Auth Error Handling Flow ✅

**File:** `tests/ITEM-5835/TC46-unauthorized-access.spec.ts`  
**Priority:** High

**Steps:**
1. Attempt to access `/legacy/ECardDataExport` without the required permission, or simulate a 401/403 response from the API.
   - expect: The existing authorization error handling is triggered (redirect to login, access-denied page, or error modal).
   - expect: The eCard Data Export page content is NOT accessible.

#### 8.4. TC47 — Verify "Please Wait..." Loading Overlay Displays During API Calls ✅

**File:** `tests/ITEM-5835/TC47-loading-overlay-api-calls.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search and observe the page immediately.
   - expect: A "Please wait..." loading overlay or spinner is displayed while the API call is in progress.
   - expect: The overlay disappears once results are returned.

#### 8.5. TC48 — Verify Vue 3 Spinner After "Change" Is Brief and Does Not Block Page ✅

**File:** `tests/ITEM-5835/TC48-spinner-transient-change-link.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click "Change".
   - expect: A Vue 3 spinner appears for a brief moment.
   - expect: The spinner automatically disappears without user action.
   - expect: After the spinner, the page is in the company-empty/reset state and the user can type a new company.

#### 8.6. TC49 — Verify No New Console Errors or Warnings Are Introduced ➕

**File:** `tests/ITEM-5835/TC49-no-console-errors.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter. Run a search. Move associates between lists. Check and uncheck "All Active Employees".
   - expect: No new JavaScript errors appear in the browser console throughout all interactions.
   - expect: No new Vue warnings (e.g., prop type mismatches, missing keys) appear.

---

### 9. Edge Cases & Negative Scenarios

#### 9.1. TC50 — Verify Company Autocomplete Shows No Results for Unrecognized Input ➕

**File:** `tests/ITEM-5835/TC50-autocomplete-no-results.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Type `ZZZZNOTACOMPANY` in the Select Company field.
   - expect: The autocomplete dropdown shows a "no results" state or no dropdown appears.
   - expect: No error or crash occurs.

#### 9.2. TC51 — Verify Search Button Does Nothing Without Company (Negative Test) ➕

**File:** `tests/ITEM-5835/TC51-search-blocked-without-company.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Do NOT select a company. Attempt to click Search.
   - expect: No search API request is sent (verified via network monitor).
   - expect: A "Required" validation message appears on the Select Company field.
   - expect: The Available Associates / dual list section remains hidden.
   - expect: The Export CSV button remains hidden.

> **Environment discrepancy:** Same as TC10 — Test env runs the search and shows results. Pre-prod correctly blocks it. See TC10 notes.

#### 9.3. TC52 — Verify Advanced Filter AND Logic: Restrictive Combination Returns Empty Results ➕

**File:** `tests/ITEM-5835/TC52-filter-and-logic-empty-result.spec.ts`  
**Priority:** Medium

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Expand Advanced Employee Filter. Select a Facility with known employees. Enter a Name / Associate ID that definitely does NOT exist in that Facility. Click Search.
   - expect: The Available Associates list shows an empty / no-results state.
   - expect: No employees from the selected Facility are shown because the AND condition with the name filter produces zero matches.

#### 9.4. TC53 — Verify Checking "All Active Employees" Then Unchecking Does Not Show Stale Selected Associates ➕

**File:** `tests/ITEM-5835/TC53-all-active-toggle-no-stale-state.spec.ts`  
**Priority:** High

**Steps:**
1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company. Click Search. Move 3 associates to Selected. Check "All Active Employees" (dual list hides). Uncheck "All Active Employees".
   - expect: The dual list reappears.
   - expect: The 3 previously selected associates are still in the Selected Associates list (state is preserved).
   - expect: No duplicates appear in Available that are already in Selected.

---

## Gaps & Risks

| # | Description | Severity |
|---|-------------|----------|
| ⚠️ 1 | Drag-and-drop (TC42) may be brittle in Playwright — requires `dragAndDrop` API or HTML5 drag events simulation. Verify with real browser run before merging. | Medium |
| ⚠️ 2 | Virtual scrolling assertion (TC33) is hard to verify deterministically without knowing exact employee count per company. Test should use a company confirmed to have 100+ employees. | Medium |
| ⚠️ 3 | TC07 (spinner area constraint) requires pixel-level or bounding-box assertion; standard `toBeVisible` is insufficient. May need `getBoundingClientRect` evaluation. | Medium |
| ⚠️ 4 | TC45 (API failure) likely requires route interception (`page.route()`). Ensure the mock URL pattern matches the actual endpoint (`api/companies/{id}/card-data`). | High |
| ⚠️ 5 | TC46 (auth error flow) may be hard to automate without a dedicated test account lacking the required permission. Flag for manual verification if no such account exists. | High |
| ⚠️ 6 | "Please wait..." overlay timing (TC47) is fast; assertions need `waitFor` with short timeout to catch transient state before it disappears. | Low |
| ⚠️ 7 | No explicit AC for keyboard navigation (tab order, Enter key in filters). Accessibility tests are out of scope here but are a gap for future coverage. | Low |
| ⚠️ 8 | AC #10 (bottom-level controls hidden until Search is clicked after company select) and AC #25 (dual list hidden until search) overlap significantly — both are covered by TC10 and TC31 but boundary behavior after multiple search cycles should be verified. | Low |
