# ITEM-6694 ewnDateRangeValidationMessage — Vue 3 Component Conversion Test Plan

## Application Overview

Test plan for **ITEM-6694** ("[BMAD] Convert ewnDateRangeValidationMessage directive to Vue 3 component (affects many pages)"). This story replaces the existing `ewnDateRangeValidationMessage` AngularJS directive with a Vue 3 component that preserves all current validation behaviour and messaging while removing AngularJS dependencies.

**Primary test page (scope):** EWN Internal → Company Search — `/legacy/CompanyAccount`
Subscription Range start and end date pickers are the reference location for all core ACs.

**Secondary test page (custom messages scope):** Administrator → Suspensions → Search (URL to be confirmed with dev)
Used exclusively for TC11–TC12 to verify the `custom-messages` variant.

**Page object (primary):** `pages/internal/CompanySearchPage.ts` _(to be created)_
**Page object (secondary):** `pages/admin/SuspensionsSearchPage.ts` _(to be created)_
**Test files:** `tests/ITEM-6694/`
**Seed:** `tests/seed.spec.ts`

> ⚠️ Although `ewnDateRangeValidationMessage` is used across all pages where `ewnDatePicker` appears (see ITEM-6693 scope table), this story's in-scope reference page is **Company Search (`/legacy/CompanyAccount`)** only. The custom-messages variant is verified on **Suspensions Search**.

---

## Risks & Gaps

| #    | Risk / Gap                                                                                                                                  | Impact  |
|------|---------------------------------------------------------------------------------------------------------------------------------------------|---------|
| ⚠️1  | Exact URL for Suspensions Search is unconfirmed — assumed `/legacy/Suspensions` or similar. Verify with dev before automating TC11–TC12.   | High    |
| ⚠️2  | Vue 3 component tag name / selector is unknown until implementation is delivered — coordinate with dev to confirm before writing locators.  | High    |
| ⚠️3  | The exact trigger for "form touched" state (AC7) is unspecified — could be blur, input, or form submit. Confirm with dev to avoid flaky TC10. | Medium  |
| ⚠️4  | The `custom-messages` prop/attribute name and its accepted value format are unspecified — confirm with dev before automating TC11–TC12.     | Medium  |
| ⚠️5  | Maximum allowed date (12/31/9999) is only implied through the custom message text in AC6, not explicitly stated in AC3 — confirm with dev. | Low     |
| ⚠️6  | "Visually consistent" in AC8 requires a pre-migration baseline screenshot for true comparison — manual verification recommended for TC14.   | Low     |

---

## Test Scenarios

### 1. Vue 3 Migration & DOM Verification

#### 1.1. TC01 — Verify Vue 3 Component Renders on Company Search Page with No AngularJS ng-messages in DOM ➕

**File:** `tests/ITEM-6694/TC01-vue3-component-renders-no-ng-messages.spec.ts`
**Priority:** High
**Covers:** AC #1

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Locate the Subscription Range date picker group (start and end date pickers).
   - expect: The `ewnDateRangeValidationMessage` Vue 3 component element is present in the DOM (confirm tag name with dev, e.g. `<ewn-date-range-validation-message>`).
   - expect: No `ng-messages` or `ng-message` elements exist anywhere within or adjacent to the date range input group.
   - expect: No AngularJS-specific attributes (`ng-*`) are present on the validation message container.

---

### 2. Invalid Date Range Validation (Start > End)

#### 2.1. TC02 — Verify Validation Error Displays When Start Date Is After End Date ➕

**File:** `tests/ITEM-6694/TC02-error-start-date-after-end-date.spec.ts`
**Priority:** High
**Covers:** AC #2

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. In the Subscription Range start date field, enter `12/31/2026`.
3. In the end date field, enter `01/01/2026`.
4. Move focus away from the end date field (Tab or click elsewhere).
   - expect: A **red error message** appears below the date range fields.
   - expect: The error message text indicates that the date range is invalid (e.g. "Start date must be before end date" or equivalent).
   - expect: The error element carries the `text-danger` class.
   - expect: No page refresh or form submission is required for the error to appear.

---

#### 2.2. TC03 — Verify Validation Error Clears When Dates Are Corrected to a Valid Range ➕

**File:** `tests/ITEM-6694/TC03-error-clears-after-valid-date-range.spec.ts`
**Priority:** High
**Covers:** AC #4

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Trigger an invalid range error: enter `12/31/2026` in the start field and `01/01/2026` in the end field. Confirm the error message is visible.
3. Correct the dates: change the start field to `01/01/2026` (now start ≤ end).
   - expect: The error message **disappears** without a page refresh or form re-submission.
   - expect: No residual error markup remains in the DOM after correction.

---

### 3. Min/Max Boundary Validation

#### 3.1. TC04 — Verify Validation Error Displays When Start Date Is Before the Minimum Allowed Date ➕

**File:** `tests/ITEM-6694/TC04-error-start-date-before-min.spec.ts`
**Priority:** High
**Covers:** AC #3

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. In the Subscription Range start date field, enter `12/31/1752` (one day before 01/01/1753).
3. Move focus away from the field.
   - expect: A validation error appears for the **start date field** indicating the date is out of the allowed range.
   - expect: The error message references the allowed minimum date (01/01/1753) or otherwise indicates the value is too early.
   - expect: The end date field shows no error (assuming the end date is valid or empty).

---

#### 3.2. TC05 — Verify Validation Error Displays When End Date Is Before the Minimum Allowed Date ➕

**File:** `tests/ITEM-6694/TC05-error-end-date-before-min.spec.ts`
**Priority:** High
**Covers:** AC #3

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Enter a valid date (e.g. `01/01/2025`) in the start date field.
3. In the end date field, enter `12/31/1752` (before 01/01/1753).
4. Move focus away from the field.
   - expect: A validation error appears for the **end date field** indicating the date is out of the allowed range.
   - expect: The start date field shows no error.
   - expect: The error message references the allowed minimum date or indicates the value is too early.

---

### 4. Independent Field Validation

#### 4.1. TC06 — Verify Only the Start Date Field Shows an Error When Only the Start Date Is Invalid ➕

**File:** `tests/ITEM-6694/TC06-only-start-field-shows-error.spec.ts`
**Priority:** High
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Enter `12/31/1752` (before min) in the start date field and a valid date (e.g. `12/31/2025`) in the end date field.
3. Move focus away from both fields.
   - expect: A validation error is visible **only** for the start date field.
   - expect: The end date field shows **no error** message.
   - expect: The count of visible error elements equals exactly one.

---

#### 4.2. TC07 — Verify Only the End Date Field Shows an Error When Only the End Date Is Invalid ➕

**File:** `tests/ITEM-6694/TC07-only-end-field-shows-error.spec.ts`
**Priority:** High
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Enter a valid date (e.g. `01/01/2025`) in the start date field and `12/31/1752` (before min) in the end date field.
3. Move focus away from both fields.
   - expect: A validation error is visible **only** for the end date field.
   - expect: The start date field shows **no error** message.
   - expect: The count of visible error elements equals exactly one.

---

#### 4.3. TC08 — Verify Both Fields Show Errors Simultaneously When Both Dates Are Invalid ➕

**File:** `tests/ITEM-6694/TC08-both-fields-show-errors-simultaneously.spec.ts`
**Priority:** Medium
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Enter `12/31/1752` in the start date field and `12/31/1752` in the end date field (both before minimum).
3. Move focus away from both fields.
   - expect: A validation error appears for **both** the start date field and the end date field at the same time.
   - expect: Neither error blocks or suppresses the other — both are visible simultaneously.
   - expect: The count of visible error elements equals exactly two.

---

### 5. Initial Load & Interaction Trigger Behavior

#### 5.1. TC09 — Verify No Validation Errors Are Shown on Initial Page Load With Empty Date Fields ➕

**File:** `tests/ITEM-6694/TC09-no-errors-on-initial-page-load.spec.ts`
**Priority:** High
**Covers:** AC #7

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount` (do not interact with any date fields).
2. Observe the Subscription Range date pickers immediately after page load.
   - expect: **No validation error messages** are visible adjacent to either the start or end date fields.
   - expect: The error message container (if rendered) is hidden or empty.
   - expect: No `text-danger` error text is displayed in the date range section.

---

#### 5.2. TC10 — Verify Errors Appear Only After the User Has Interacted With a Date Field ➕

**File:** `tests/ITEM-6694/TC10-errors-appear-only-after-interaction.spec.ts`
**Priority:** High
**Covers:** AC #7

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`. Confirm no errors are visible (pre-condition from TC09).
2. Click the start date field and type `12/31/1752` (an out-of-range value).
3. Before moving focus away — observe the field.
   - expect: No error may be shown yet (depends on trigger: blur vs. input — confirm with dev).
4. Move focus away (Tab to end date or click elsewhere).
   - expect: The validation error for the start date field **now appears**.
   - expect: The error was absent before interaction and is present after the field was touched.

---

### 6. Custom Validation Messages

#### 6.1. TC11 — Verify Custom Messages Display the Specific Allowed Date Range on Suspensions Search ➕

**File:** `tests/ITEM-6694/TC11-custom-messages-show-specific-range.spec.ts`
**Priority:** High
**Covers:** AC #6

**Steps:**
1. Log in. Navigate to the Suspensions Search page (URL to be confirmed with dev).
2. In a date field that uses the `custom-messages` variant, enter a date before `01/01/1753`.
3. Move focus away.
   - expect: The error message reads (or contains) **"Date must be between 01/01/1753 and 12/31/9999"** (or the page-specific equivalent).
   - expect: The message is specific to the allowed range for that field — not a generic "invalid date" message.
   - expect: The error is styled with `text-danger` and positioned below the input.

---

#### 6.2. TC12 — Verify Generic Form Error Messages Do Not Appear on Pages Using the Custom-Messages Variant ➕

**File:** `tests/ITEM-6694/TC12-no-generic-errors-on-custom-messages-pages.spec.ts`
**Priority:** Medium
**Covers:** AC #6

**Steps:**
1. Log in. Navigate to the Suspensions Search page.
2. Trigger an out-of-range date error on a field using the `custom-messages` variant.
   - expect: The error message is the **custom** range-specific text (e.g. "Date must be between 01/01/1753 and 12/31/9999").
   - expect: **No generic** fallback messages (e.g. "Invalid date", "This field is required") are shown in place of or alongside the custom message.
   - expect: Exactly one error message is shown per invalid field.

---

### 7. Visual Consistency

#### 7.1. TC13 — Verify Error Message Uses text-danger Styling and Is Positioned Below the Date Range Input Group ➕

**File:** `tests/ITEM-6694/TC13-error-text-danger-positioned-below-inputs.spec.ts`
**Priority:** Medium
**Covers:** AC #8

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Trigger a validation error (e.g. enter `12/31/2026` start / `01/01/2026` end).
3. Inspect the rendered error message element.
   - expect: The error element or one of its ancestors has the CSS class **`text-danger`**.
   - expect: The error element is **below** (higher Y coordinate in the DOM layout than) the date range input group container.
   - expect: The error is not rendered inside, overlapping, or to the side of the inputs — it is beneath them.

---

#### 7.2. TC14 — Verify Visual Appearance of the Error Message Matches the Pre-Migration Implementation ➕

**File:** `tests/ITEM-6694/TC14-error-visual-parity-with-legacy.spec.ts`
**Priority:** Medium
**Covers:** AC #8

> **Note:** This test case requires a pre-migration baseline screenshot for comparison. Automate element-presence and class assertions; full visual parity should be verified manually against the reference implementation.

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount` (after the Vue 3 migration is deployed).
2. Trigger a validation error and compare the error message rendering against a pre-migration reference screenshot.
   - expect: Error text **color** is red (matching `text-danger` Bootstrap styling).
   - expect: Error **font size and weight** are consistent with the legacy directive output.
   - expect: Error **position and spacing** relative to the date inputs match the legacy layout.
   - expect: No additional decorative elements (icons, borders) are present that were not in the legacy version.

---

### 8. Regression

#### 8.1. TC15 — Verify the Company Search Page Loads Without Console Errors After the Vue 3 Migration ➕

**File:** `tests/ITEM-6694/TC15-page-load-no-console-errors.spec.ts`
**Priority:** High
**Covers:** Regression guard / Assumptions (no new console errors or warnings)

**Steps:**
1. Open browser console monitoring. Log in. Navigate to `/legacy/CompanyAccount`.
   - expect: The page loads successfully (no crash, HTTP 200).
   - expect: The Subscription Range date fields are rendered and interactive.
   - expect: **No new console errors or warnings** are emitted — especially no Vue prop warnings, no AngularJS `ng-messages` errors, and no "Component not found" errors.
2. Enter an invalid date range, observe the error, correct the dates.
   - expect: The full interaction (error shown → error cleared) produces no console errors.

---

### 9. Edge Cases

#### 9.1. TC16 — Verify Same Date for Start and End Is Valid and Shows No Error ➕

**File:** `tests/ITEM-6694/TC16-same-start-end-date-is-valid.spec.ts`
**Priority:** Low
**Covers:** Boundary edge case (start = end is valid per AC #2 which only flags start > end)

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. Enter `06/15/2025` in both the start and end date fields.
3. Move focus away from both fields.
   - expect: **No validation error** is displayed — a range where start equals end is valid.
   - expect: The component does not treat start = end as an invalid range.

---

#### 9.2. TC17 — Verify Validation Error When Date Exceeds the Maximum Allowed Date ➕

**File:** `tests/ITEM-6694/TC17-error-date-exceeds-maximum.spec.ts`
**Priority:** Low
**Covers:** Boundary edge case (max date boundary, implied by AC #6 custom message text)

> **Note:** The maximum date of 12/31/9999 is inferred from the custom message text in AC #6 but is not explicitly stated in AC #3. Confirm this boundary with the dev team before automating.

**Steps:**
1. Log in. Navigate to `/legacy/CompanyAccount`.
2. In the start date field, type `01/01/10000` (one day past 12/31/9999).
3. Move focus away.
   - expect: A validation error appears indicating the date exceeds the allowed maximum.
   - expect: The error message references the maximum boundary or indicates the value is out of range.
   - expect: The field is styled as invalid.

---

## Coverage Summary

| TC   | Description                                                                                                | Priority | AC Ref         |
|------|------------------------------------------------------------------------------------------------------------|----------|----------------|
| TC01 | Vue 3 component renders on Company Search page — no ng-messages in DOM                                    | High     | AC #1          |
| TC02 | Validation error displays when start date is after end date                                                | High     | AC #2          |
| TC03 | Validation error clears when dates are corrected to a valid range (no page refresh)                        | High     | AC #4          |
| TC04 | Validation error displays when start date is before minimum (01/01/1753)                                   | High     | AC #3          |
| TC05 | Validation error displays when end date is before minimum (01/01/1753)                                     | High     | AC #3          |
| TC06 | Only start date field shows an error when only the start date is invalid                                   | High     | AC #5          |
| TC07 | Only end date field shows an error when only the end date is invalid                                       | High     | AC #5          |
| TC08 | Both fields show errors simultaneously when both dates are invalid                                         | Medium   | AC #5          |
| TC09 | No validation errors shown on initial page load with empty date fields                                     | High     | AC #7          |
| TC10 | Errors appear only after user interacts with a date field                                                  | High     | AC #7          |
| TC11 | Custom messages display specific allowed date range on Suspensions Search                                  | High     | AC #6          |
| TC12 | Generic form error messages do not appear on pages using the custom-messages variant                       | Medium   | AC #6          |
| TC13 | Error message uses text-danger styling and is positioned below the date range input group                  | Medium   | AC #8          |
| TC14 | Visual appearance of the error message matches the pre-migration implementation                            | Medium   | AC #8          |
| TC15 | Company Search page loads without console errors after Vue 3 migration                                     | High     | Regression     |
| TC16 | Same date for start and end is valid — no error shown                                                      | Low      | Boundary edge  |
| TC17 | Validation error when date exceeds maximum allowed (12/31/9999)                                            | Low      | Boundary edge  |

---

## Automation Recommendations

### Automate — High Confidence

| TC   | Automation approach                                                                                                         | Suggested order |
|------|-----------------------------------------------------------------------------------------------------------------------------|-----------------|
| TC01 | Assert Vue component tag present; assert `ng-messages` count === 0 via `page.locator`                                       | 1 — smoke       |
| TC09 | Navigate to page, assert no `.text-danger` error elements are visible in the date range section                             | 1 — smoke       |
| TC02 | Fill start `12/31/2026`, end `01/01/2026`, tab away, assert error element visible with `.text-danger`                       | 2 — core flow   |
| TC03 | Trigger error, then correct start date, assert error element no longer visible — all without `page.reload()`                | 2 — core flow   |
| TC04 | Enter `12/31/1752` in start, tab away, assert start error visible, end error absent                                         | 2 — core flow   |
| TC05 | Enter valid start, `12/31/1752` in end, tab away, assert end error visible, start error absent                              | 2 — core flow   |
| TC06 | Enter out-of-range start + valid end, assert exactly one error element visible                                              | 3 — field parity |
| TC07 | Enter valid start + out-of-range end, assert exactly one error element visible                                              | 3 — field parity |
| TC08 | Enter out-of-range dates in both fields, assert exactly two error elements visible simultaneously                           | 3 — field parity |
| TC10 | Enter invalid value, assert no error before blur; tab away, assert error appears                                             | 3 — interaction  |
| TC13 | Trigger error, assert error element has class `text-danger`; assert its Y position > bottom Y of input group via `evaluate` | 4 — visual DOM  |
| TC15 | Collect `page.on('console')` events during full interaction flow; assert none with type `error`                             | 5 — regression  |
| TC16 | Enter same date in both fields, tab away, assert zero error elements visible                                                | 5 — edge case   |

### Automate — With Caveats

| TC   | Caveat before automating                                                                                    |
|------|-------------------------------------------------------------------------------------------------------------|
| TC11 | Confirm Suspensions Search URL and the exact custom error message text with dev before writing the assertion |
| TC12 | Confirm that no generic fallback messages are rendered — requires knowing all possible generic message texts |
| TC17 | Confirm max date boundary (12/31/9999) and that typing 01/01/10000 triggers the error with dev before automating |

### Manual Only — Do Not Automate

| TC   | Reason                                                                                                                          |
|------|---------------------------------------------------------------------------------------------------------------------------------|
| TC14 | True visual parity with the pre-migration legacy directive requires screenshot diff against a baseline — not a DOM assertion   |

### Summary

| Category                    | TCs                                                      | Count |
|-----------------------------|----------------------------------------------------------|-------|
| Automate — high confidence  | TC01–TC10, TC13, TC15, TC16                              | 13    |
| Automate — with caveats     | TC11, TC12, TC17                                         | 3     |
| Manual only                 | TC14                                                     | 1     |
