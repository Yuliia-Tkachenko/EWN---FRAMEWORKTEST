# ITEM-6668 Advanced Employee Filter Test Plan

## Application Overview

Test plan for ITEM-6668, which converts the `ewnAdvancedAssociateFilterMulti` AngularJS directive to a Vue component. Reference page is the Login Statistics Report at https://test-app.ewn.com/legacy/LoginStatistics. The component renders an accordion-based advanced filter with multi-select dropdowns and single-select fields that narrow down the Associate Dual List. Explored live as an EWN user selecting company NTC.

## Test Scenarios

### 1. Advanced Employee Filter — Core Behaviour

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC01 — Advanced Employee Filter: Collapsed by Default (EWN User)

**File:** `tests/ITEM-6668/TC01-collapsed-by-default-ewn-user.spec.ts`

**Steps:**
  1. Log in as an EWN user (e.g. ytkachenko). Navigate to the Login Statistics Report page (https://test-app.ewn.com/legacy/LoginStatistics). In the Select Company field, type 'NTC' and select 'NTC' from the autocomplete dropdown.
    - expect: The Advanced Employee Filter panel is visible but in a collapsed state immediately after company selection.
    - expect: A down-arrow icon (▼) is displayed on the filter header button.
    - expect: The filter content area (fields, Filter button) is not visible.

#### 1.2. TC02 — Advanced Employee Filter: Expand / Collapse Toggle

**File:** `tests/ITEM-6668/TC02-expand-collapse-toggle.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC so the filter becomes visible in collapsed state.
    - expect: Filter panel is collapsed with a down-arrow (▼) icon.
  2. Click the 'Advanced Employee Filter' header button.
    - expect: The filter panel expands.
    - expect: The arrow icon changes to an up-arrow (▲).
    - expect: All filter fields (Employee Name/ID, Facility, Job Title, Group, Project, Supervisor, Testing Pool, Subscription, User Type, User Status) become visible.
    - expect: The 'Filter' button is visible at the bottom of the expanded section.
  3. Click the 'Advanced Employee Filter' header button again.
    - expect: The filter panel collapses.
    - expect: The arrow icon reverts to a down-arrow (▼).
    - expect: The filter fields and Filter button are hidden.

#### 1.3. TC03 — EWN User: Filter Requires Company Selection

**File:** `tests/ITEM-6668/TC03-ewn-filter-requires-company.spec.ts`

**Steps:**
  1. Log in as an EWN user. Navigate to the Login Statistics Report page. Do NOT select any company.
    - expect: The Advanced Employee Filter accordion button is NOT visible.
    - expect: The Associate Dual List is NOT visible.
    - expect: Only the 'Select Company' input field, Login Date range, and Search button are shown.

#### 1.4. TC04 — EWN User: Filter Appears After Company Selection

**File:** `tests/ITEM-6668/TC04-ewn-filter-appears-after-company-selection.spec.ts`

**Steps:**
  1. Log in as an EWN user. Navigate to Login Statistics Report. With no company selected, verify the filter is absent. Type 'NTC' in the Select Company field and select 'NTC' from the autocomplete.
    - expect: Once NTC is selected, the 'Select Company' field is replaced by the text 'NTC' with a 'Change' link.
    - expect: The Advanced Employee Filter accordion appears in a collapsed state.
    - expect: The Associate Dual List (Available Employees / Selected Employees) appears below the filter.

#### 1.5. TC05 — EWN User: Deselecting Company Hides Filter

**File:** `tests/ITEM-6668/TC05-deselect-company-hides-filter.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Confirm the Advanced Employee Filter and Dual List are visible.
    - expect: Advanced Employee Filter accordion is visible.
    - expect: Associate Dual List is visible.
  2. Click the 'Change' link next to the selected company name 'NTC'.
    - expect: The selected company is cleared.
    - expect: The Select Company input field reappears with a 'Required' validation message.
    - expect: The Advanced Employee Filter accordion disappears.
    - expect: The Associate Dual List disappears.

#### 1.6. TC06 — Company User: Page Load State

**File:** `tests/ITEM-6668/TC06-company-user-page-load.spec.ts`

**Steps:**
  1. Log in as a Company-level user (non-EWN). Navigate to the Login Statistics Report page.
    - expect: The Search tab is displayed.
    - expect: The Advanced Employee Filter is displayed in a collapsed state immediately on page load.
    - expect: No company selection dropdown is visible (it is pre-selected for the company user's company).

#### 1.7. TC07 — Filter Field Layout (Row Structure)

**File:** `tests/ITEM-6668/TC07-filter-field-layout.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Click the Advanced Employee Filter header to expand the panel.
    - expect: Row 1 (full width): 'Employee Name / ID:' text input occupies the full row width.
    - expect: Row 2: 'Facility:' multi-select button (left half), 'Job Title:' multi-select button (right half).
    - expect: Row 3: 'Group:' multi-select button (left half), 'Project:' multi-select button (right half).
    - expect: Row 4: 'Supervisor:' multi-select button (left half), 'Testing Pool:' multi-select button (right half).
    - expect: Row 5: 'Subscription:' multi-select button (left half), 'User Type:' single-select combobox (right half).
    - expect: Row 6: 'User Status:' single-select combobox (left half only).
    - expect: A 'Filter' button (with filter icon) is displayed at the bottom center of the expanded section.
    - expect: Total of 6 rows of fields are visible.

#### 1.8. TC08 — Multi-Select Dropdowns Default to 'All'

**File:** `tests/ITEM-6668/TC08-multiselect-defaults-to-all.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Inspect each multi-select field button label: Facility, Job Title, Group, Project, Supervisor, Testing Pool, Subscription.
    - expect: All seven multi-select dropdown buttons display the text 'All' as their default label.
    - expect: No items are pre-selected in any multi-select dropdown.

#### 1.9. TC09 — User Type Defaults to 'All Users'

**File:** `tests/ITEM-6668/TC09-user-type-defaults-all-users.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Observe the User Type dropdown.
    - expect: User Type combobox displays 'All Users' as the selected/default value.

#### 1.10. TC10 — User Status Defaults to 'Active'

**File:** `tests/ITEM-6668/TC10-user-status-defaults-active.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Observe the User Status dropdown.
    - expect: User Status combobox shows 'Active' as the selected/default value.
    - expect: Available options in User Status are: 'All', 'Active', 'Inactive'.

#### 1.11. TC11 — Multi-Select: Select Multiple Values Simultaneously

**File:** `tests/ITEM-6668/TC11-multiselect-multiple-values.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Click the 'Facility:' button to open its dropdown.
    - expect: The Facility dropdown opens, displaying 'Select All' and 'Deselect All' buttons at the top, followed by facility options (e.g. June_23, Lower_Shed, NTC_Building).
  2. Click 'June_23' in the Facility dropdown.
    - expect: June_23 is selected (checkmark or highlighted).
    - expect: The Facility button label changes from 'All' to 'June_23'.
  3. Click 'Lower_Shed' in the still-open Facility dropdown.
    - expect: Lower_Shed is also selected (both June_23 and Lower_Shed are selected simultaneously).
    - expect: The Facility button label changes to '2 Selected'.
  4. Repeat the multi-select test for at least one other multi-select field (e.g. Job Title, Group, or Project).
    - expect: Each multi-select field allows more than one value to be selected at the same time.
    - expect: The button label reflects the number of selected items (e.g. '2 Selected', '3 Selected').

#### 1.12. TC12 — Multi-Select: Select All Control

**File:** `tests/ITEM-6668/TC12-multiselect-select-all.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Open the Facility dropdown by clicking the 'Facility:' button.
    - expect: The Facility dropdown opens.
    - expect: 'Select All' button is present at the top of the options list.
    - expect: 'Deselect All' button is present next to 'Select All' at the top.
  2. Click the 'Select All' button.
    - expect: All available facility options become selected.
    - expect: The Facility button label changes to show the total count (e.g. '3 Selected' for 3 facilities).

#### 1.13. TC13 — Multi-Select: Deselect All Control

**File:** `tests/ITEM-6668/TC13-multiselect-deselect-all.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Open the Facility dropdown and click 'Select All' so all facilities are selected.
    - expect: All facilities are selected. Button label shows 'N Selected'.
  2. Click the 'Deselect All' button in the still-open dropdown.
    - expect: All options become deselected.
    - expect: The Facility button label reverts to 'All'.

#### 1.14. TC14 — Multi-Select: Scrollbar Appears When Content Overflows

**File:** `tests/ITEM-6668/TC14-multiselect-scrollbar.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select a company that has a large number of items in at least one multi-select field (e.g. many Job Titles or Supervisors). Expand the Advanced Employee Filter. Open the dropdown with many items.
    - expect: A vertical scrollbar appears in the dropdown options panel when the list of items exceeds the visible area.
    - expect: The user can scroll the list to view all options.

#### 1.15. TC15 — User Type and User Status Are Single-Select

**File:** `tests/ITEM-6668/TC15-user-type-status-single-select.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Click the User Type dropdown and select 'Administrator'.
    - expect: Only 'Administrator' is selected; the previous selection ('All Users') is replaced.
    - expect: The User Type combobox only allows one value at a time (standard <select> behaviour).
  2. Click the User Status dropdown and select 'Inactive'.
    - expect: Only 'Inactive' is selected; the previous selection ('Active') is replaced.
    - expect: The User Status combobox only allows one value at a time.

#### 1.16. TC16 — Dropdowns Populate with Correct Sorted Data

**File:** `tests/ITEM-6668/TC16-dropdowns-sorted-data.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Open the Facility dropdown and review the list of options.
    - expect: Facility options are sorted alphabetically (e.g. 'June_23', 'Lower_Shed', 'NTC_Building' in ascending order).
  2. Open the Job Title dropdown and review the list.
    - expect: Job Title options represent company job titles and are sorted alphabetically.
  3. Open the Group dropdown and review the list.
    - expect: Group options represent company groups and are sorted alphabetically.
  4. Open the Project dropdown and review the list.
    - expect: Project options are in 'Company Name - Project Name' format and are sorted alphabetically.
  5. Open the Supervisor dropdown and review the list.
    - expect: Supervisor options are formatted as full name and are sorted alphabetically.
  6. Open the Testing Pool dropdown and review the list.
    - expect: Only active testing pools are shown, sorted alphabetically.
  7. Open the Subscription dropdown and review the list.
    - expect: Subscription types assigned to the company are listed and sorted alphabetically.

#### 1.17. TC17 — User Type: Non-ATAC Company Excludes ATAC Types

**File:** `tests/ITEM-6668/TC17-user-type-non-atac.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select a non-ATAC company (e.g. NTC). Expand the Advanced Employee Filter. Open the User Type dropdown.
    - expect: The User Type dropdown does NOT contain ATAC-specific types such as 'TPE Evaluator', 'TPE Proctor', 'TPE Trainer'.
    - expect: The available options for a non-ATAC company include only standard types: All Users, Administrator, Supervisor, Proctor, Evaluator, Non-Billable User, All Billable Users.

#### 1.18. TC18 — User Type: excludeNonUsers Removes Applicant and 3rd Party

**File:** `tests/ITEM-6668/TC18-user-type-excludenonusers.spec.ts`

**Steps:**
  1. Log in as EWN user (or Company user). Navigate to Login Statistics Report, which uses the excludeNonUsers configuration. Expand the Advanced Employee Filter. Open the User Type dropdown.
    - expect: 'Applicant' type is NOT listed in the User Type dropdown.
    - expect: '3rd Party' type is NOT listed in the User Type dropdown.

#### 1.19. TC19 — Filter Button: Triggers Search

**File:** `tests/ITEM-6668/TC19-filter-button-triggers-search.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Note the initial full employee list in the Available Employees Dual List panel. Type 'admin' in the Employee Name/ID field. Do NOT click Filter yet.
    - expect: The Available Employees list does NOT change while typing (no auto-search).
  2. Click the 'Filter' button.
    - expect: The Available Employees list is filtered to show only employees whose name contains 'admin' (e.g. 'Admin, Adrian - EWN-596338', 'ADMIN, Natallia - EWN-269775').
    - expect: Employees not matching the filter are removed from the Available Employees list.

#### 1.20. TC20 — Filter Button: Enter Key Submits Filter

**File:** `tests/ITEM-6668/TC20-filter-enter-key-submits.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Click into the Employee Name/ID text field. Type 'bond'.
    - expect: The Available Employees list does NOT change while typing.
  2. Press the Enter key while the Employee Name/ID field has focus.
    - expect: The filter is submitted (same effect as clicking the Filter button).
    - expect: The Available Employees list is filtered to show only employees matching 'bond' (e.g. 'Bond, James - EWN-380632').

#### 1.21. TC21 — Employee Name/ID: No Auto-Search on Typing

**File:** `tests/ITEM-6668/TC21-no-autosearch-on-typing.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Observe the initial employee count in the Available Employees list. Type multiple characters into the Employee Name/ID field (e.g. type 'test', 'te', 'admin' one character at a time) and wait 1 second between characters.
    - expect: No network requests to the employee list API are fired while typing.
    - expect: The Available Employees list content does NOT change after each keystroke.
    - expect: The employee list remains unchanged from its pre-typing state.

#### 1.22. TC22 — Filter Button: Visible Only When Filter is Expanded

**File:** `tests/ITEM-6668/TC22-filter-button-visible-only-when-expanded.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Observe the Advanced Employee Filter in its collapsed state.
    - expect: The 'Filter' button is NOT visible in the collapsed state.
  2. Click the Advanced Employee Filter header to expand the panel.
    - expect: The 'Filter' button IS visible inside the expanded accordion panel.
  3. Click the Advanced Employee Filter header again to collapse the panel.
    - expect: The 'Filter' button is hidden again after collapsing.

#### 1.23. TC23 — Filter Button: Style and Position

**File:** `tests/ITEM-6668/TC23-filter-button-style.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Observe the 'Filter' button.
    - expect: The 'Filter' button contains a filter/funnel icon.
    - expect: The button label is 'Filter'.
    - expect: The button is positioned below the filter fields, centered inside the accordion section.

#### 1.24. TC24 — Filter Button: Always Active When Filter is Open

**File:** `tests/ITEM-6668/TC24-filter-button-always-enabled.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Leave all fields at their defaults (Employee Name/ID empty, all multi-selects showing 'All', User Type 'All Users', User Status 'Active'). Inspect the Filter button.
    - expect: The 'Filter' button is enabled (not disabled/greyed out) even when no custom filter values are selected.
  2. Click the 'Filter' button with all defaults.
    - expect: The filter fires and the Available Employees list refreshes (showing all active employees for the company).

#### 1.25. TC25 — Dual List Component: Style Regression

**File:** `tests/ITEM-6668/TC25-dual-list-style-regression.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Observe the Associate Dual List component (Available Employees / Selected Employees).
    - expect: The Dual List renders with two columns: 'Available Employees' on the left and 'Selected Employees' on the right.
    - expect: Each column has a search box at the top, a 'Select all' checkbox, and a scrollable list of employee items with checkboxes.
    - expect: Transfer control buttons (Move to Selected / Move to Available) are displayed between the columns.
    - expect: No visible CSS regressions (broken layout, overlapping elements, missing borders, incorrect spacing).

#### 1.26. TC26 — Dual List Component: Interaction Regression

**File:** `tests/ITEM-6668/TC26-dual-list-interaction-regression.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. In the Available Employees list, select a checkbox for one employee (e.g. 'Admin, Adrian - EWN-596338').
    - expect: The employee checkbox is checked.
    - expect: The 'Move to Selected Employees' button becomes enabled.
  2. Click the 'Move to Selected Employees' button.
    - expect: The selected employee moves from the Available Employees list to the Selected Employees list.
    - expect: The employee is no longer in the Available list.
  3. Select the employee's checkbox in the Selected Employees list and click 'Move to Available Employees'.
    - expect: The employee returns to the Available Employees list.
    - expect: The Selected Employees list is empty again.
  4. Expand the Advanced Employee Filter, type 'bond' in Employee Name/ID, and click Filter.
    - expect: The Available Employees list updates to show only employees matching 'bond'.
    - expect: The Dual List responds correctly to the filter without layout or functional regressions.

#### 1.27. TC27 — Negative: Filter with No Matching Results

**File:** `tests/ITEM-6668/TC27-filter-no-matching-results.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Type 'zzz_nonexistent_xyz' in the Employee Name/ID field. Click the 'Filter' button.
    - expect: The Available Employees list shows zero results or an empty state.
    - expect: No JavaScript error or application crash occurs.
    - expect: The page remains functional.

#### 1.28. TC28 — Negative: Filter with All Fields at Default Returns Full Active List

**File:** `tests/ITEM-6668/TC28-filter-defaults-returns-full-list.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Leave all filter fields at defaults: Employee Name/ID empty, all multi-selects on 'All', User Type 'All Users', User Status 'Active'. Click the 'Filter' button.
    - expect: The Available Employees list shows all active employees for the company NTC.
    - expect: No employees are incorrectly excluded from the list.

#### 1.29. TC29 — Multi-Select Button Label Shows Single Item Name

**File:** `tests/ITEM-6668/TC29-multiselect-label-single-item.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Open the Facility dropdown. Select exactly one facility (e.g. 'June_23').
    - expect: The Facility button label changes from 'All' to the name of the selected item (e.g. 'June_23').
    - expect: The label does NOT show '1 Selected' — it shows the actual item name.

#### 1.30. TC30 — Multi-Select Button Label Shows 'N Selected' for Multiple Items

**File:** `tests/ITEM-6668/TC30-multiselect-label-n-selected.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Open the Facility dropdown. Select two facility options (e.g. 'June_23' and 'Lower_Shed').
    - expect: The Facility button label shows '2 Selected' (not the individual names).
  2. Select a third facility (e.g. 'NTC_Building') from the same dropdown.
    - expect: The Facility button label updates to '3 Selected'.

#### 1.31. TC31 — Filter Header: Tooltip Text

**File:** `tests/ITEM-6668/TC31-filter-header-tooltip.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC so the Advanced Employee Filter accordion appears. Hover over the Advanced Employee Filter header button.
    - expect: A tooltip appears with the text 'Click for Advanced Employee Filter Options'.

#### 1.32. TC32 — User Status Dropdown Options

**File:** `tests/ITEM-6668/TC32-user-status-options.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC. Expand the Advanced Employee Filter. Click the User Status dropdown.
    - expect: The User Status dropdown contains exactly three options: 'All', 'Active', 'Inactive'.
    - expect: 'Active' is the pre-selected default option.

#### 1.33. TC33 — User Type Dropdown Options (Standard Company)

**File:** `tests/ITEM-6668/TC33-user-type-options-standard.spec.ts`

**Steps:**
  1. Log in as EWN user. Navigate to Login Statistics Report. Select company NTC (a standard non-ATAC company). Expand the Advanced Employee Filter. Click the User Type dropdown.
    - expect: The User Type dropdown contains: 'All Users', 'Administrator', 'Supervisor', 'Proctor', 'TPE Evaluator', 'TPE Proctor', 'TPE Trainer', 'Evaluator', 'Non-Billable User', 'All Billable Users'.
    - expect: 'All Users' is the pre-selected default option.
