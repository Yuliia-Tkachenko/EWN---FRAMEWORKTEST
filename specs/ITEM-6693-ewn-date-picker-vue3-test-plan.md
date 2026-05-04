# ITEM-6693 ewnDatePicker — Vue 3 Component Conversion Test Plan

## Application Overview

Test plan for **ITEM-6693** ("[BMAD] Convert ewnDatePicker directive to Vue 3 component (affects many pages)"). This story replaces the existing `ewnDatePicker` AngularJS directive with a Vue 3 implementation built on top of the existing Vue date picker control, preserving all current behaviour and validation while removing AngularJS dependencies.

**Test page (sole scope):** My Reports → Organizational Tool Status Report — `/legacy/OrgToolStatusReport`
**Page object:** `pages/reports/OrgToolStatusReportPage.ts` _(to be created)_
**Test files:** `tests/ITEM-6693/`
**Seed:** `tests/seed.spec.ts`

> ⚠️ All 161 other `ewnDatePicker` usages (62 files, ~30 modules) are **explicitly out of scope**. Only the **Forecast** date field on the Organizational Tool Status Report page is in scope for this story.

> ⚠️ AC #12 (week numbers) and AC #22 (keyboard accessibility) are marked **TBD** in the ticket — test cases for those are deferred until the design decision is finalised.

---

## Risks & Gaps

| #    | Risk / Gap                                                                                                          | Impact  |
|------|---------------------------------------------------------------------------------------------------------------------|---------|
| ⚠️1  | Exact URL for Org Tool Status Report is unconfirmed — assumed `/legacy/OrgToolStatusReport`. Verify before automating. | Medium  |
| ⚠️2  | The minimum date constraint value for the Forecast field (AC #18) is unknown — needs confirmation from dev/design.   | Medium  |
| ⚠️3  | "Visually disabled" state for out-of-range dates (AC #11) depends on CSS class name from the Vue component — confirm with dev. | Medium  |
| ⚠️4  | AC #12 (week numbers) is TBD — TC is omitted; add when decision is finalised.                                        | Low     |
| ⚠️5  | AC #22 (keyboard accessibility) is TBD — TC is omitted; add when scope is confirmed.                                | Low     |
| ⚠️6  | "Validation feedback" format for invalid dates (AC #3) is unspecified — assumed inline error message below input.    | Low     |

---

## Test Scenarios

### 1. Date Input Field

#### 1.1. TC01 — Verify Date Input Displays the Selected Date in MM/DD/YYYY Format ➕

**File:** `tests/ITEM-6693/TC01-date-input-displays-mm-dd-yyyy-format.spec.ts`
**Priority:** High
**Covers:** AC #1

**Steps:**
1. Log in. Navigate to `/legacy/OrgToolStatusReport`.
2. Open the calendar popup and click any date in the grid (e.g. May 15, 2025).
   - expect: The date input field displays the selected date in **MM/DD/YYYY** format (e.g. `05/15/2025`).
   - expect: No other format (e.g. YYYY-MM-DD or DD/MM/YYYY) is used.

---

#### 1.2. TC02 — Verify Typing a Valid Date Directly Into the Input Field Updates the Bound Model Value ➕

**File:** `tests/ITEM-6693/TC02-typing-valid-date-updates-model.spec.ts`
**Priority:** High
**Covers:** AC #2

**Steps:**
1. Log in. Navigate to the page.
2. Click the date input field and type a valid date in MM/DD/YYYY format (e.g. `05/20/2025`).
   - expect: The input field displays the typed value.
3. Submit the report form (click Search / Apply or equivalent).
   - expect: The typed date is passed as the Forecast date in the outgoing request or applied to the report results.
   - expect: No error message is shown for the valid date.

---

#### 1.3. TC03 — Verify Typing an Invalid Date Does Not Update the Model and Shows Validation Feedback ➕

**File:** `tests/ITEM-6693/TC03-invalid-date-shows-validation-feedback.spec.ts`
**Priority:** High
**Covers:** AC #3

**Steps:**
1. Log in. Navigate to the page.
2. Click the date input field and type an invalid date (e.g. `13/32/2026`).
3. Move focus away from the input (Tab or click elsewhere).
   - expect: The bound model value is **not** updated to the invalid date.
   - expect: A validation feedback message (inline error) is displayed near the input field.
   - expect: The input is visually marked as invalid (e.g. red border or error class).
4. Clear the field and type a valid date.
   - expect: The validation feedback disappears after a valid value is entered.

---

#### 1.4. TC04 — Verify a Calendar Icon Button Is Displayed Adjacent to the Input Field ➕

**File:** `tests/ITEM-6693/TC04-calendar-icon-button-visible.spec.ts`
**Priority:** High
**Covers:** AC #4

**Steps:**
1. Log in. Navigate to the page.
2. Observe the Forecast date field area.
   - expect: A calendar icon button is **visible** directly adjacent to the date input field (typically to the right).
   - expect: The icon is rendered (not a broken image or empty space).
   - expect: The button is interactable (not disabled).

---

#### 1.5. TC05 — Verify Clicking the Calendar Icon Button Opens the Calendar Popup ➕

**File:** `tests/ITEM-6693/TC05-clicking-icon-opens-calendar-popup.spec.ts`
**Priority:** High
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to the page.
2. Click the calendar icon button adjacent to the Forecast date input.
   - expect: The calendar popup **opens** and is visible on screen.
   - expect: The popup appears in proximity to the input field (not off-screen or clipped).
   - expect: The popup is interactable (not obscured by other elements).

---

### 2. Calendar Popup

#### 2.1. TC06 — Verify Calendar Popup Displays a Month/Year Header with Left and Right Arrow Navigation ➕

**File:** `tests/ITEM-6693/TC06-popup-month-year-header-and-arrows.spec.ts`
**Priority:** High
**Covers:** AC #6

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup.
2. Observe the header area of the popup.
   - expect: A **month and year** label is displayed (e.g. "May 2025").
   - expect: A **left arrow** button is visible to navigate to the previous month.
   - expect: A **right arrow** button is visible to navigate to the next month.
3. Click the right arrow once.
   - expect: The header updates to the next month (e.g. "June 2025").
   - expect: The day grid updates to reflect the new month.
4. Click the left arrow once.
   - expect: The header returns to the original month (e.g. "May 2025").

---

#### 2.2. TC07 — Verify Calendar Popup Displays a Day Grid with Sun–Sat Column Headers ➕

**File:** `tests/ITEM-6693/TC07-popup-day-grid-sun-sat-headers.spec.ts`
**Priority:** High
**Covers:** AC #7

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup.
2. Observe the column headers of the day grid.
   - expect: Exactly **seven** column headers are displayed.
   - expect: The headers are in order: **Sun, Mon, Tue, Wed, Thu, Fri, Sat** (or their full/abbreviated equivalents).
   - expect: Day cells are arranged beneath the corresponding header columns.

---

#### 2.3. TC08 — Verify Days from Previous and Next Months Are Visible but Visually Muted ➕

**File:** `tests/ITEM-6693/TC08-prev-next-month-days-muted.spec.ts`
**Priority:** Medium
**Covers:** AC #8

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup on a month where the first day is not Sunday (e.g. May 2025 starts on Thursday).
2. Observe the day grid cells that belong to the previous month (the greyed-out days at the start of the grid).
   - expect: Those cells display day numbers from the **previous month**.
   - expect: Those cells are visually **muted** — a noticeably lighter color or reduced opacity compared to current-month days.
3. Observe the trailing cells that belong to the next month.
   - expect: Same muted visual treatment.
   - expect: These cells are not highlighted as selectable current-month days.

---

#### 2.4. TC09 — Verify Today's Date Is Visually Highlighted in the Calendar Grid ➕

**File:** `tests/ITEM-6693/TC09-today-date-highlighted.spec.ts`
**Priority:** High
**Covers:** AC #9

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup and navigate to the current month if not already shown.
2. Identify today's date in the grid.
   - expect: Today's date cell has a **distinct visual highlight** (e.g. bold text, coloured background, or border) that differentiates it from other days.
   - expect: Only today's cell has this highlight — no other date shares the same style.
   - expect: If the current date is visible (not in a previous/next month), the highlight is applied.

---

#### 2.5. TC10 — Verify Clicking a Date Selects It, Updates the Input Field, and Closes the Popup ➕

**File:** `tests/ITEM-6693/TC10-clicking-date-selects-updates-closes.spec.ts`
**Priority:** High
**Covers:** AC #10

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup.
2. Click any enabled date in the current month (e.g. the 15th).
   - expect: The popup **closes** immediately after the click.
   - expect: The date input field now displays the clicked date in **MM/DD/YYYY** format.
   - expect: The bound model value reflects the selected date.

---

#### 2.6. TC11 — Verify Dates Outside the Allowed Range Are Visually Disabled and Not Selectable ➕

**File:** `tests/ITEM-6693/TC11-out-of-range-dates-disabled.spec.ts`
**Priority:** High
**Covers:** AC #11

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup (a date range restriction is applied to the Forecast field).
2. Navigate to a month that contains dates outside the allowed range.
   - expect: Out-of-range date cells are **visually disabled** (e.g. greyed out, strikethrough, or muted styling distinct from the muted prev/next month days).
3. Attempt to click a disabled date.
   - expect: The click has **no effect** — the popup remains open, the input is not updated, and no selection is made.

---

### 3. Popup Action Buttons

#### 3.1. TC12 — Verify "Today" Button Sets the Date to the Current Date and Closes the Popup ➕

**File:** `tests/ITEM-6693/TC12-today-button-sets-current-date.spec.ts`
**Priority:** High
**Covers:** AC #13

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup. Navigate to a different month (so today is not on the visible grid page).
2. Click the **"Today"** button.
   - expect: The popup **closes**.
   - expect: The date input field displays today's date in MM/DD/YYYY format.
   - expect: The bound model value equals today's date.

---

#### 3.2. TC13 — Verify "Clear" Button Clears the Selected Date and Closes the Popup ➕

**File:** `tests/ITEM-6693/TC13-clear-button-clears-date.spec.ts`
**Priority:** High
**Covers:** AC #14

**Steps:**
1. Log in. Navigate to the page. Select a date via the calendar so the input field is populated.
2. Re-open the calendar popup. Click the **"Clear"** button.
   - expect: The popup **closes**.
   - expect: The date input field is **empty** (no date displayed).
   - expect: The bound model value is cleared/null.

---

#### 3.3. TC14 — Verify "Close" Button Closes the Popup Without Changing the Selected Date ➕

**File:** `tests/ITEM-6693/TC14-close-button-dismisses-without-change.spec.ts`
**Priority:** High
**Covers:** AC #15

**Steps:**
1. Log in. Navigate to the page. Select a date (e.g. 05/15/2025) via the calendar — note the displayed date.
2. Re-open the calendar popup. Navigate to a different month. Click the **"Close"** button.
   - expect: The popup **closes**.
   - expect: The date input field still displays the **previously selected date** (05/15/2025) — unchanged.
   - expect: The bound model value is unchanged.

---

### 4. Validation on Org Tool Status Report Page

#### 4.1. TC15 — Verify the Component Renders Identically to the Legacy ewnDatePicker in the Forecast Field Position ➕

**File:** `tests/ITEM-6693/TC15-forecast-field-parity-with-legacy.spec.ts`
**Priority:** High
**Covers:** AC #16

**Steps:**
1. Log in. Navigate to the Organizational Tool Status Report page.
2. Locate the **Forecast** date field.
   - expect: The component is rendered in the same position and layout as the legacy `ewnDatePicker` was (label, input, icon adjacency).
   - expect: The input field, icon button, and any surrounding labels are visually consistent with how the field appeared before the migration.
   - expect: No layout shifts, missing elements, or duplicate controls are present.

---

#### 4.2. TC16 — Verify Selecting a Forecast Date Passes the Value Correctly to the Report's Search Criteria ➕

**File:** `tests/ITEM-6693/TC16-forecast-date-passes-to-search-criteria.spec.ts`
**Priority:** High
**Covers:** AC #17

**Steps:**
1. Log in. Navigate to the Organizational Tool Status Report page.
2. Select a forecast date (e.g. 06/01/2025) via the calendar popup.
3. Submit the report form (click the Search / Run Report button).
   - expect: The outgoing network request includes the selected forecast date as a query/body parameter.
   - expect: The report results are filtered/generated using the chosen forecast date.
   - expect: No error response or "invalid date" server-side rejection occurs.

---

#### 4.3. TC17 — Verify the Component Respects the Page's Minimum Date Constraint for the Forecast Field ➕

**File:** `tests/ITEM-6693/TC17-forecast-field-respects-min-date.spec.ts`
**Priority:** High
**Covers:** AC #18

**Steps:**
1. Log in. Navigate to the Organizational Tool Status Report page. Open the calendar popup for the Forecast field.
2. Navigate to a month that includes dates before the minimum allowed date.
   - expect: Dates earlier than the minimum are **visually disabled** in the calendar grid.
3. Attempt to click a disabled date.
   - expect: No selection is made — the input value is not updated.
4. Type a date earlier than the minimum directly into the input field.
   - expect: Validation feedback is shown and the model value is not updated to the out-of-range date.

---

### 5. Visual Consistency

#### 5.1. TC18 — Verify the Input Field Dimensions, Font, and Spacing Match the Existing ewnDatePicker Appearance ➕

**File:** `tests/ITEM-6693/TC18-input-field-visual-parity.spec.ts`
**Priority:** Medium
**Covers:** AC #19

**Steps:**
1. Log in. Navigate to the Organizational Tool Status Report page.
2. Observe the Forecast date input field.
   - expect: The input field **width**, **height**, **font size**, and **padding** match the legacy `ewnDatePicker` input (within a reasonable tolerance — compare reference screenshots).
   - expect: The calendar icon is the same size and positioned identically to the legacy icon.
   - expect: No unexpected gaps, overflow, or extra spacing are introduced around the field.

---

#### 5.2. TC19 — Verify the Calendar Popup Layout Is Visually Consistent with the Legacy Date Picker ➕

**File:** `tests/ITEM-6693/TC19-popup-layout-visual-parity.spec.ts`
**Priority:** Medium
**Covers:** AC #20

**Steps:**
1. Log in. Navigate to the page. Open the calendar popup.
2. Compare the popup layout against a reference screenshot of the legacy `ewnDatePicker` popup.
   - expect: The day grid dimensions, button arrangement ("Today", "Clear", "Close"), header style, and navigation arrows are visually consistent with the legacy popup.
   - expect: No elements are missing, duplicated, or mis-aligned relative to the legacy popup.
   - expect: Font family and sizes within the popup match the legacy control.

---

#### 5.3. TC20 — Verify the Calendar Popup Does Not Overflow or Clip on Smaller Viewports ➕

**File:** `tests/ITEM-6693/TC20-popup-responsive-no-overflow.spec.ts`
**Priority:** Medium
**Covers:** AC #21, AC #21a

**Steps:**
1. Log in. Navigate to the page at a tablet viewport (e.g. 768×1024).
2. Open the calendar popup.
   - expect: The popup is fully visible within the viewport — no clipping on edges.
   - expect: All popup content (grid, buttons, navigation) remains interactive and not obscured.
3. Repeat at a mobile viewport (e.g. 375×812).
   - expect: The popup is still visible and functional (may reposition or scroll, but must not lose content).
   - expect: The date input and calendar icon are still accessible without horizontal scroll.

---

### 6. Regression

#### 6.1. TC21 — Verify the Org Tool Status Report Page Loads Without Console Errors After the Vue 3 Migration ➕

**File:** `tests/ITEM-6693/TC21-page-load-no-console-errors.spec.ts`
**Priority:** High
**Covers:** Regression guard / Assumptions (no new console errors)

**Steps:**
1. Open the browser console. Log in. Navigate to the Organizational Tool Status Report page.
   - expect: The page loads successfully (HTTP 200, no crash).
   - expect: The Forecast date field is rendered (calendar icon visible, input accessible).
   - expect: **No new console errors or warnings** are emitted that were not present before this migration (especially no AngularJS-related errors or Vue prop warnings).
2. Open the calendar popup, select a date, submit the report.
   - expect: The full interaction produces no console errors.

---

## Coverage Summary

| TC   | Description                                                                              | Priority | AC Ref    |
|------|------------------------------------------------------------------------------------------|----------|-----------|
| TC01 | Verify date input displays the selected date in MM/DD/YYYY format                        | High     | AC #1     |
| TC02 | Verify typing a valid date directly updates the bound model value                        | High     | AC #2     |
| TC03 | Verify typing an invalid date does not update the model and shows validation feedback    | High     | AC #3     |
| TC04 | Verify a calendar icon button is displayed adjacent to the input field                   | High     | AC #4     |
| TC05 | Verify clicking the calendar icon button opens the calendar popup                        | High     | AC #5     |
| TC06 | Verify calendar popup displays a month/year header with left/right arrow navigation     | High     | AC #6     |
| TC07 | Verify calendar popup displays a day grid with Sun–Sat column headers                   | High     | AC #7     |
| TC08 | Verify days from previous and next months are visible but visually muted                | Medium   | AC #8     |
| TC09 | Verify today's date is visually highlighted in the calendar grid                        | High     | AC #9     |
| TC10 | Verify clicking a date selects it, updates the input field, and closes the popup        | High     | AC #10    |
| TC11 | Verify dates outside the allowed range are visually disabled and not selectable         | High     | AC #11    |
| TC12 | Verify "Today" button sets the date to the current date and closes the popup             | High     | AC #13    |
| TC13 | Verify "Clear" button clears the selected date and closes the popup                     | High     | AC #14    |
| TC14 | Verify "Close" button closes the popup without changing the selected date               | High     | AC #15    |
| TC15 | Verify the component renders identically to the legacy ewnDatePicker in Forecast field  | High     | AC #16    |
| TC16 | Verify selecting a forecast date passes the value correctly to the report search        | High     | AC #17    |
| TC17 | Verify the component respects the page's minimum date constraint for the Forecast field | High     | AC #18    |
| TC18 | Verify the input field dimensions, font, and spacing match the existing ewnDatePicker   | Medium   | AC #19    |
| TC19 | Verify the calendar popup layout is visually consistent with the legacy date picker     | Medium   | AC #20    |
| TC20 | Verify the calendar popup does not overflow or clip on smaller viewports                | Medium   | AC #21    |
| TC21 | Verify the page loads without console errors after the Vue 3 migration                  | High     | Regression|

**Deferred (TBD in ticket):**
- AC #12 — Week numbers in calendar grid (design decision pending)
- AC #22 — Keyboard accessibility (scope pending)

---

## Automation Recommendations

### Automate — High Confidence

Clear DOM assertions, no dependency on unknown implementation details. Implement these first.

| TC   | Automation approach                                                                                     | Suggested order |
|------|---------------------------------------------------------------------------------------------------------|-----------------|
| TC04 | Assert calendar icon button `isVisible()`                                                               | 1 — smoke       |
| TC05 | Click icon, assert popup element `isVisible()`                                                          | 1 — smoke       |
| TC10 | Click a date cell, assert popup is hidden, assert input value equals the clicked date in MM/DD/YYYY     | 2 — core flow   |
| TC12 | Click "Today", assert popup closes, assert input value equals today's date in MM/DD/YYYY                | 2 — core flow   |
| TC13 | Pre-select a date, reopen popup, click "Clear", assert input is empty                                   | 2 — core flow   |
| TC14 | Pre-select a date, reopen popup, click "Close", assert input still shows the original date              | 2 — core flow   |
| TC01 | Select a date via popup, assert `input.value` matches `/^\d{2}\/\d{2}\/\d{4}$/`                        | 3 — input field |
| TC02 | Type valid date directly, submit form, assert date param present in outgoing network request            | 3 — input field |
| TC03 | Type `13/32/2026`, tab away, assert inline error visible and input model not updated                   | 3 — input field |
| TC06 | Assert header text, click left/right arrows, assert header text updates each time                       | 4 — popup UI    |
| TC07 | Assert exactly 7 column header cells with text Sun–Sat in order                                        | 4 — popup UI    |
| TC09 | Compute today's date, find matching cell in grid, assert it carries a highlight CSS class               | 4 — popup UI    |
| TC16 | Intercept the report search request, select a forecast date, submit — assert date appears in payload   | 5 — integration |
| TC21 | Collect `page.on('console')` errors during full interaction flow, assert none are emitted               | 5 — regression  |

### Automate — With Caveats

Automatable, but require a dev confirmation before writing the assertions.

| TC   | Caveat before automating                                                                                |
|------|---------------------------------------------------------------------------------------------------------|
| TC08 | Confirm the CSS class name applied to muted previous/next-month day cells from dev                     |
| TC11 | Confirm the actual date range boundary for the Forecast field and the disabled-state CSS class from dev |
| TC17 | Confirm the exact minimum date value applied to the Forecast field before writing the boundary assertion|
| TC20 | Use `page.setViewportSize()` (768×1024 and 375×812), open popup, assert bounding box stays within viewport — straightforward once the build is available |

### Manual Only — Do Not Automate

Pixel/layout comparisons that require a human eye or a dedicated visual regression tool (e.g. Percy, Chromatic). Standard Playwright `getBoundingClientRect()` assertions are too fragile and do not catch subtle visual regressions.

| TC   | Reason                                                                                                  |
|------|---------------------------------------------------------------------------------------------------------|
| TC15 | "Renders identically to legacy" — element presence can be checked, but true visual parity needs a screenshot diff against a baseline |
| TC18 | Font size, padding, and spacing comparisons are a visual judgement call, not a DOM assertion            |
| TC19 | Popup layout parity with the legacy control requires visual comparison, not attribute checks            |

### Summary

| Category               | TCs                                              | Count |
|------------------------|--------------------------------------------------|-------|
| Automate — high confidence | TC01–TC07, TC09, TC10, TC12–TC14, TC16, TC21 | 14    |
| Automate — with caveats    | TC08, TC11, TC17, TC20                       | 4     |
| Manual only                | TC15, TC18, TC19                             | 3     |
