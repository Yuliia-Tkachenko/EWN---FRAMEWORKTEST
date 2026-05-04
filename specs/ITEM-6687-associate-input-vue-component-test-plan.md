# ITEM-6687 ewnAssociateInput — Vue Component Conversion Test Plan

## Application Overview

Test plan for **ITEM-6687** ("[BMAD] Convert ewnAssociateInput directive to Vue component"). This story converts the existing `ewnAssociateInput` AngularJS directive into a reusable Vue 3 component while preserving all existing behaviour, configuration options, and validation logic.

**Test page (sole scope):** Import Evaluator Qualifications — `/legacy/ImportEvaluatorQualifications`
**Page object:** `pages/utilities/ImportEvaluatorQualificationsPage.ts`
**Test files:** `tests/ITEM-6687/`
**Seed:** `tests/seed.spec.ts`
**Related stories:**
- ITEM-7772 — Advanced Search Modal (`isAdvanced` mode) — out of scope here
- ITEM-7773 — Create New Associate (`allowCreate` mode) — out of scope here

> ⚠️ All tests target the **Select User** field only (not the Upload File field). The Upload File field has its own existing XRAY coverage (XRAY-3313–3319).

---

## Existing XRAY Test Coverage (from Jira)

The following XRAY tests exist for the Import Evaluator Qualifications page but cover the **Upload File** section, not the Associate Input component:

| XRAY Key  | Summary                                                                              | Status |
|-----------|--------------------------------------------------------------------------------------|--------|
| XRAY-3313 | Verify tooltip icon at 'Upload File:' label                                          | To Do  |
| XRAY-3314 | Verify message opens when user hovers over tooltip icon                              | To Do  |
| XRAY-3315 | Verify message format mentions file extensions & max size                            | To Do  |
| XRAY-3316 | Verify image file format listed is PDF                                               | To Do  |
| XRAY-3317 | Verify Browse button tooltip is suppressed                                           | To Do  |
| XRAY-3318 | Verify validation message shows when trying to upload invalid file type              | To Do  |
| XRAY-3319 | Verify validation message shows when trying to upload file over advised size limit   | To Do  |
| XRAY-5584 | Verify Upload Icon visibility and behavior across all platform areas — regression    | Done   |
| XRAY-2422 | Verify Evaluation Field Mapping — all available fields for import/export process     | To Do  |

**No existing XRAY tests cover the Associate Input (`ewnAssociateInput`) component.** All test cases below are new (➕).

---

## Risks & Gaps

| # | Risk / Gap | Impact |
|---|------------|--------|
| ⚠️1 | AC #10a says associate ID displays **below** the name — exact DOM structure and CSS selector unknown until dev delivers. | Medium — may need locator adjustment |
| ⚠️2 | `aria-activedescendant` behaviour (AC #8) depends on Vue rendering each option with a stable `id` attribute — confirm with dev. | Medium — ARIA test may be brittle if IDs are dynamic |
| ⚠️3 | AC #18 ("stretches to match Upload File field") has the same number as the first visual-parity AC — numbering conflict in the ticket. Treated as two separate ACs. | Low — documentation risk only |
| ⚠️4 | Related stories ITEM-7772 (Advanced Search Modal) and ITEM-7773 (Create New Associate) are **explicitly out of scope**. Tests must not click the search icon or add-new button. | Medium — regression scope boundary |
| ⚠️5 | "Change" link label is assumed to be text "Change" — confirm exact label from design or dev before automating. | Low |

---

## Test Scenarios

### 1. Autocomplete Behaviour

#### 1.1. TC01 — Verify Typing a Single Character Triggers the Autocomplete Dropdown ➕

**File:** `tests/ITEM-6687/TC01-autocomplete-triggers-on-single-char.spec.ts`
**Priority:** High
**Covers:** AC #1

**Steps:**
1. Log in. Navigate to `/legacy/ImportEvaluatorQualifications`. Select a company so the Select User field is enabled.
2. Click the Select User input field and type a single alphabetic character (e.g. `"a"`).
   - expect: A dropdown list of autocomplete results appears within a reasonable timeout (≤ 2 s).
   - expect: The dropdown contains at least one result (assuming the test company has associates whose names start with that character).
   - expect: The dropdown is visible and attached below the input field.

---

#### 1.2. TC02 — Verify Autocomplete Results Display in "Name - EWN-ID" Format ➕

**File:** `tests/ITEM-6687/TC02-autocomplete-result-format.spec.ts`
**Priority:** High
**Covers:** AC #2

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character to open the dropdown.
2. Inspect the text of each result item in the dropdown.
   - expect: Each result item is formatted as **`"FirstName LastName - EWN-XXXXXX"`** (name, dash, EWN ID).
   - expect: No result item is empty or contains only whitespace.
   - expect: The EWN ID portion is non-empty.

---

#### 1.3. TC03 — Verify Clicking a Dropdown Result Selects the Associate and Activates Display Mode ➕

**File:** `tests/ITEM-6687/TC03-click-result-activates-display-mode.spec.ts`
**Priority:** High
**Covers:** AC #3

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character to open the dropdown. Note the first result's name.
2. Click the first result in the dropdown.
   - expect: The dropdown closes.
   - expect: The input field is replaced by a **display-mode** element showing the selected associate's name.
   - expect: The displayed text matches the name from the selected dropdown result.
   - expect: A "Change" link is visible next to the displayed name.

---

#### 1.4. TC04 — Verify Arrow Down / Arrow Up Keys Move the Highlight Between Results ➕

**File:** `tests/ITEM-6687/TC04-arrow-keys-navigate-results.spec.ts`
**Priority:** High
**Covers:** AC #4

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character to open the dropdown (ensure at least 2 results).
2. Press `ArrowDown` once.
   - expect: The first result item is visually highlighted (e.g. has an active/focused CSS class).
3. Press `ArrowDown` again.
   - expect: The second result item is highlighted; the first item is no longer highlighted.
4. Press `ArrowUp` once.
   - expect: The first result item is highlighted again.

---

#### 1.5. TC05 — Verify Pressing Enter on a Highlighted Result Selects It and Activates Display Mode ➕

**File:** `tests/ITEM-6687/TC05-enter-key-selects-highlighted-result.spec.ts`
**Priority:** High
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character. Press `ArrowDown` to highlight the first result.
2. Press `Enter`.
   - expect: The dropdown closes.
   - expect: Display mode activates showing the highlighted associate's name.
   - expect: The "Change" link is visible.
   - expect: The text input field is hidden.

---

#### 1.6. TC06 — Verify Pressing Escape Closes the Dropdown and Keeps Focus on the Input ➕

**File:** `tests/ITEM-6687/TC06-escape-closes-dropdown.spec.ts`
**Priority:** High
**Covers:** AC #6

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character to open the dropdown.
2. Press `Escape`.
   - expect: The dropdown closes immediately.
   - expect: The input field retains focus (no blur/navigation away).
   - expect: The typed text remains in the input field.
   - expect: No associate is selected — component remains in edit mode.

---

#### 1.7. TC07 — Verify Correct ARIA Attributes on the Autocomplete Container and Result List ➕

**File:** `tests/ITEM-6687/TC07-aria-attributes-combobox.spec.ts`
**Priority:** High
**Covers:** AC #7

**Steps:**
1. Log in. Navigate to the page. Select company.
2. Inspect the Select User container before typing.
   - expect: The container element has `role="combobox"`.
   - expect: `aria-expanded="false"` before the dropdown is open.
3. Type a character to open the dropdown.
   - expect: `aria-expanded="true"` on the container.
   - expect: The results list element has `role="listbox"`.
   - expect: Each result item has `role="option"`.
4. Close the dropdown (press Escape).
   - expect: `aria-expanded="false"` again.

---

#### 1.8. TC08 — Verify aria-activedescendant Points to the Highlighted Option When Navigating by Keyboard ➕

**File:** `tests/ITEM-6687/TC08-aria-activedescendant.spec.ts`
**Priority:** Medium
**Covers:** AC #8

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character to open the dropdown.
2. Press `ArrowDown` to highlight the first result. Note the `id` attribute of the highlighted option element.
   - expect: The `aria-activedescendant` attribute on the input/combobox equals the `id` of the highlighted option element.
3. Press `ArrowDown` again.
   - expect: `aria-activedescendant` updates to reflect the newly highlighted option's `id`.

---

### 2. Selection Display

#### 2.1. TC09 — Verify Select User Field Is Disabled Until a Company Is Selected ➕

**File:** `tests/ITEM-6687/TC09-select-user-disabled-without-company.spec.ts`
**Priority:** High
**Covers:** AC #9

**Steps:**
1. Log in. Navigate to `/legacy/ImportEvaluatorQualifications`. Do **not** select a company.
   - expect: The Select User input field is **disabled** (not interactable).
   - expect: Attempting to click or type into the field has no effect.
2. Select a company.
   - expect: The Select User input field becomes **enabled** and accepts keyboard input.

---

#### 2.2. TC10 — Verify Selected Associate Displays in "Name: First, Last - EWN ID" Format ➕

**File:** `tests/ITEM-6687/TC10-selected-associate-display-format.spec.ts`
**Priority:** High
**Covers:** AC #10

**Steps:**
1. Log in. Navigate to the page. Select company. Type a character. Click the first dropdown result (note the associate's full name and EWN ID).
2. Observe the display-mode element.
   - expect: The displayed text matches **`"Name: FirstName, LastName - EWN-XXXXXX"`** (label, colon, first name, comma, last name, dash, EWN ID).
3. If the associate has an Associate ID:
   - expect: The Associate ID is shown **below** the name line.

---

#### 2.3. TC11 — Verify Clicking "Change" Clears the Display and Returns to Edit Mode with Active Typeahead ➕

**File:** `tests/ITEM-6687/TC11-change-link-clears-and-returns-to-edit.spec.ts`
**Priority:** High
**Covers:** AC #11

**Steps:**
1. Log in. Navigate to the page. Select company. Select an associate (display mode active). A "Change" link is visible.
2. Click the "Change" link.
   - expect: The display-mode element (showing the associate's name) is hidden.
   - expect: The text input field is visible and focused (edit mode active).
   - expect: The input field is empty — no stale data from the previous selection.
   - expect: Typing a character immediately opens the autocomplete dropdown (typeahead active).

---

### 3. Edit Mode

#### 3.1. TC12 — Verify Empty Select User Field Shows Placeholder and No Stale Data ➕

**File:** `tests/ITEM-6687/TC12-empty-field-placeholder-no-stale-data.spec.ts`
**Priority:** High
**Covers:** AC #12

**Steps:**
1. Log in. Navigate to the page. Select company (field enabled, empty).
   - expect: The input field is empty (no pre-populated text from a previous session or stale state).
   - expect: A placeholder text is visible (e.g. "Search associate…" or equivalent).
   - expect: No autocomplete dropdown is open.
2. (Optional regression) Select an associate, click "Change", then navigate away and back.
   - expect: The field is still empty on return — no stale data persists.

---

#### 3.2. TC13 — Verify "Change" Link Is Not Visible When the Input Field Is Empty ➕

**File:** `tests/ITEM-6687/TC13-change-link-hidden-when-empty.spec.ts`
**Priority:** Medium
**Covers:** AC #13

**Steps:**
1. Log in. Navigate to the page. Select company. Confirm the Select User field is empty.
   - expect: The "Change" link is **not visible** (hidden or not rendered in the DOM).
2. Type a few characters into the input without selecting any result.
   - expect: The "Change" link **remains hidden** — it only appears after a full selection, not during typing.

---

#### 3.3. TC14 — Verify "Change" Link Appears When the Input Contains a Selection ➕

**File:** `tests/ITEM-6687/TC14-change-link-visible-after-selection.spec.ts`
**Priority:** Medium
**Covers:** AC #14

**Steps:**
1. Log in. Navigate to the page. Select company. Confirm "Change" link is hidden (empty state).
2. Type a character, open the dropdown, click a result.
   - expect: Display mode is active.
   - expect: The "Change" link is **visible** and clickable.
3. Click "Change" to return to edit mode. Clear the input manually (select all + delete).
   - expect: The "Change" link disappears once the input is empty again.

---

### 4. Validation

#### 4.1. TC15 — Verify Required-Field Error Appears on Form Submit When No Associate Is Selected ➕

**File:** `tests/ITEM-6687/TC15-required-error-on-submit.spec.ts`
**Priority:** High
**Covers:** AC #15

**Steps:**
1. Log in. Navigate to the page. Select company. Leave the Select User field empty.
2. Click the form's submit/import button without selecting an associate.
   - expect: A required-field error message appears **on the Select User component** (inline, not a toast).
   - expect: The form is not submitted — no network request is triggered.
   - expect: The error message text indicates the field is required (e.g. "Required").

---

#### 4.2. TC16 — Verify Error Styling Matches Other Validated Fields (Red Border, "Required" Text) ➕

**File:** `tests/ITEM-6687/TC16-error-styling-matches-other-fields.spec.ts`
**Priority:** Medium
**Covers:** AC #16

**Steps:**
1. Log in. Navigate to the page. Select company. Submit the form without selecting an associate.
   - expect: The Select User field has a **red border** (or equivalent error-state CSS class).
   - expect: The error text reads **"Required"** (matching the label used by other validated fields on the same form).
   - expect: The error style is visually consistent with any other required-field validation present on the Import Evaluator Qualifications form.

---

#### 4.3. TC17 — Verify Selecting an Associate After a Validation Error Clears the Error ➕

**File:** `tests/ITEM-6687/TC17-selecting-associate-clears-error.spec.ts`
**Priority:** High
**Covers:** AC #17

**Steps:**
1. Log in. Navigate to the page. Select company. Submit form to trigger the required-field error on Select User.
   - expect: Error message is visible.
2. Type a character to open the dropdown and click a result to select an associate.
   - expect: The error message **disappears immediately** after selection.
   - expect: The red border / error styling is removed.
   - expect: The component transitions to display mode showing the selected associate.

---

### 5. Input Width Enhancement

#### 5.1. TC18 — Verify Select User Input Stretches to Match the Upload File Field Width ➕

**File:** `tests/ITEM-6687/TC18-input-width-matches-upload-file-field.spec.ts`
**Priority:** Medium
**Covers:** AC #18 (Enhancement)

**Steps:**
1. Log in. Navigate to the page. Select company (Select User field is enabled).
2. Measure the rendered width of the **Select User** input field.
3. Measure the rendered width of the **Upload File** input/browse element.
   - expect: Both fields have equal (or equivalent) rendered widths — the Select User field is not narrower than the Upload File field.
   - expect: No overflow or truncation of the Select User field on standard viewport widths (1280×800, 1920×1080).

---

### 6. Visual & Styling Parity

#### 6.1. TC19 — Verify the Component Visually Matches the Legacy AngularJS Directive Across All Four Modes ➕

**File:** `tests/ITEM-6687/TC19-visual-parity-four-modes.spec.ts`
**Priority:** Medium
**Covers:** AC #18 (Visual Parity), AC #19

**Steps:**
1. Log in. Navigate to the page. Observe and/or screenshot each mode:
   - **Empty/placeholder state** (company selected, no text typed)
   - **Typeahead dropdown open** (character typed, results visible)
   - **Display mode** (associate selected, name shown)
   - **Edit action bar** ("Change" link visible alongside display)
   - expect: Each mode is visually consistent with the legacy AngularJS directive (layout, spacing, font sizes, colours).
   - expect: No broken layout, missing borders, or misaligned elements in any mode.

---

#### 6.2. TC20 — Verify Remixicon Icons in the Component Match the Legacy Directive's Icons ➕

**File:** `tests/ITEM-6687/TC20-remixicon-icons-match-legacy.spec.ts`
**Priority:** Low
**Covers:** AC #19

**Steps:**
1. Log in. Navigate to the page. Select company. Select an associate (display mode).
   - expect: Any icons present (search, clear, edit/change) use **Remixicon** classes (`ri-*`).
   - expect: Icon sizes and colours match the legacy directive (no default-icon fallbacks or missing icons).
2. Hover the "Change" link / action area.
   - expect: No icon rendering issues (no broken image, no missing glyph).

---

### 7. Regression — Existing Upload File Tests (Smoke)

#### 7.1. TC21 — Verify Upload File Section Still Functions After the Associate Input Component Is Converted ➕

**File:** `tests/ITEM-6687/TC21-upload-file-regression-smoke.spec.ts`
**Priority:** High
**Covers:** Regression guard for XRAY-3313–3319

**Steps:**
1. Log in. Navigate to the page. Select company and associate.
2. Click the Upload File browse/button control.
   - expect: File picker opens (or file input is interactable).
3. Attempt to upload an invalid file type (e.g. `.txt`).
   - expect: A validation error appears for the Upload File field (unchanged from existing XRAY coverage).
   - expect: The Select User field is not affected by the Upload File validation error.

---

## Coverage Summary

| TC   | Description                                                                              | Type | Priority | AC Ref   |
|------|------------------------------------------------------------------------------------------|------|----------|----------|
| TC01 | Verify typing a single character triggers the autocomplete dropdown                      | ➕   | High     | AC #1    |
| TC02 | Verify autocomplete results display in "Name - EWN-ID" format                           | ➕   | High     | AC #2    |
| TC03 | Verify clicking a dropdown result selects the associate and activates display mode       | ➕   | High     | AC #3    |
| TC04 | Verify arrow down / up keys move the highlight between results                          | ➕   | High     | AC #4    |
| TC05 | Verify pressing Enter on a highlighted result selects it and activates display mode      | ➕   | High     | AC #5    |
| TC06 | Verify pressing Escape closes the dropdown and keeps focus on the input                  | ➕   | High     | AC #6    |
| TC07 | Verify correct ARIA attributes on the autocomplete container and result list             | ➕   | High     | AC #7    |
| TC08 | Verify aria-activedescendant points to the highlighted option when navigating by keyboard| ➕   | Medium   | AC #8    |
| TC09 | Verify Select User field is disabled until a company is selected                         | ➕   | High     | AC #9    |
| TC10 | Verify selected associate displays in "Name: First, Last - EWN ID" format               | ➕   | High     | AC #10   |
| TC11 | Verify clicking "Change" clears the display and returns to edit mode with active typeahead| ➕  | High     | AC #11   |
| TC12 | Verify empty Select User field shows placeholder and no stale data                       | ➕   | High     | AC #12   |
| TC13 | Verify "Change" link is not visible when the input field is empty                        | ➕   | Medium   | AC #13   |
| TC14 | Verify "Change" link appears when the input contains a selection                         | ➕   | Medium   | AC #14   |
| TC15 | Verify required-field error appears on form submit when no associate is selected         | ➕   | High     | AC #15   |
| TC16 | Verify error styling matches other validated fields (red border, "Required" text)        | ➕   | Medium   | AC #16   |
| TC17 | Verify selecting an associate after a validation error clears the error                  | ➕   | High     | AC #17   |
| TC18 | Verify Select User input stretches to match the Upload File field width                  | ➕   | Medium   | AC #18   |
| TC19 | Verify the component visually matches the legacy directive across all four modes         | ➕   | Medium   | AC #18/19|
| TC20 | Verify Remixicon icons in the component match the legacy directive's icons               | ➕   | Low      | AC #19   |
| TC21 | Verify Upload File section still functions after associate input component is converted  | ➕   | High     | Regression|
