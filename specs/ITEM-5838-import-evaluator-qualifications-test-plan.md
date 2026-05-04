# ITEM-5838 Import Evaluator Qualifications — Vue Conversion Test Plan

## Application Overview

Test plan for **ITEM-5838** ("[BMAD] Convert Import Evaluator Qualifications"). This story converts the Import Evaluator Qualifications page from AngularJS to Vue 3, preserving all existing upload behaviour while introducing two layout enhancements (field width stretch, padding) and reusing the existing `FileUploadTooltip` Vue component.

**Page URL:** `/legacy/ImportEvaluatorQualifications`
**Page object:** `pages/utilities/ImportEvaluatorQualificationsPage.ts`
**Test files:** `tests/ITEM-5838/`
**Seed:** `tests/seed.spec.ts`

**Related stories:**
- ITEM-6687 — `ewnAssociateInput` Vue component (User/Associate input field)
- ITEM-6851 — `FileUploadTooltip` Vue component (tooltip on Upload File label)

> ⚠️ The `ewnAssociateInput` component (User field) is covered by ITEM-6687. Tests in this plan treat the User field as a black box — interaction tests for autocomplete, ARIA, and keyboard navigation belong in `tests/ITEM-6687/`.

---

## Existing XRAY Test Coverage (from Jira)

The following XRAY tests exist for Import Evaluator Qualifications and cover **file tooltip and file validation** behaviour:

| XRAY Key  | Summary                                                                              | Status |
|-----------|--------------------------------------------------------------------------------------|--------|
| XRAY-3313 | Verify tooltip icon at 'Upload File:' label — AC1a                                   | To Do  |
| XRAY-3314 | Verify message opens when user hovers over tooltip icon — AC1b                       | To Do  |
| XRAY-3315 | Verify message format mentions file extensions & max size — AC1c                     | To Do  |
| XRAY-3316 | Verify image file format listed is PDF — AC1e                                        | To Do  |
| XRAY-3317 | Verify Browse button tooltip is suppressed — AC1f                                    | To Do  |
| XRAY-3318 | Verify validation message shows when trying to upload invalid file type — AC2a       | To Do  |
| XRAY-3319 | Verify validation message shows when trying to upload file over advised size limit — AC2a | To Do  |
| XRAY-5584 | Verify Upload Icon visibility and behavior across all platform areas — regression     | Done   |

These 8 tests are preserved as ✅ in this plan where they apply. All other test cases are new (➕).

---

## Risks & Gaps

| # | Risk / Gap | Impact |
|---|------------|--------|
| ⚠️1 | AC numbering conflict in the ticket: two separate ACs are both numbered 11 (Enhancement: "Select Company stretches" and User Selection: "Disable User input"). Treated as separate ACs throughout this plan. | Low — documentation only |
| ⚠️2 | AC #13 restricts User input to users only (not Applicants). Requires a test account with at least one Applicant-type associate in the company to verify the restriction. | Medium — test data dependency |
| ⚠️3 | AC #21 submits Company ID, Associate ID, and file to an import API. The exact API endpoint and request shape must be confirmed with dev to write a reliable network-intercept assertion. | Medium |
| ⚠️4 | AC #26 (double-click protection) may be difficult to assert reliably — depends on whether the button is visually disabled or simply debounced. Confirm implementation with dev. | Low |
| ⚠️5 | "Blank and corrupt PDFs are accepted" (Assumptions). No test covers content-level validation — this is an intentional gap per the spec. | Low |
| ⚠️6 | Visual parity tests (AC #2–6) require screenshots of the legacy page as a baseline before decommission. Capture these before migration is complete. | High if legacy is decommissioned first |

---

## Test Scenarios

### 1. Page Structure & Visual Consistency

#### 1.1. TC01 — Verify Page Header Displays "Import Evaluator Qualifications" With Upload Tab ➕

**File:** `tests/ITEM-5838/TC01-page-header-and-upload-tab.spec.ts`
**Priority:** High
**Covers:** AC #1

**Steps:**
1. Log in. Navigate to `/legacy/ImportEvaluatorQualifications`.
   - expect: Page heading text is exactly **"Import Evaluator Qualifications"**.
   - expect: An **"Upload"** tab is visible and active by default.
   - expect: No other tabs are present or active that are out of scope.

---

#### 1.2. TC02 — Verify Button Styles Match Spec (Teal Secondary for Upload, Primary for Browse) ➕

**File:** `tests/ITEM-5838/TC02-button-styles.spec.ts`
**Priority:** Medium
**Covers:** AC #3, AC #4

**Steps:**
1. Log in. Navigate to the page.
   - expect: The **Upload** button has the `button-secondary` CSS class (teal styled).
   - expect: The **Browse** button has the `button-primary` CSS class.
   - expect: Both buttons use the correct **Remixicon** classes for their icons (`ri-upload-*` or equivalent as per design spec).
   - expect: No default-browser button styles are applied over the custom styles.

---

#### 1.3. TC03 — Verify Red Required-Field Indicators Are Present on Company, User, and File Inputs ➕

**File:** `tests/ITEM-5838/TC03-required-field-indicators.spec.ts`
**Priority:** High
**Covers:** AC #6

**Steps:**
1. Log in. Navigate to the page. Do not fill in any field.
   - expect: The **Company** label has a red required indicator (asterisk or equivalent styling).
   - expect: The **User** label has a red required indicator.
   - expect: The **Upload File** label has a red required indicator.
   - expect: The indicators use the same styling class as required fields elsewhere on the platform.

---

### 2. Company Selection

#### 2.1. TC04 — Verify Company Can Be Selected via the Company Input Field ➕

**File:** `tests/ITEM-5838/TC04-company-selection.spec.ts`
**Priority:** High
**Covers:** AC #8

**Steps:**
1. Log in. Navigate to the page. Click the Company input field and type a company name.
   - expect: An autocomplete dropdown appears with matching companies.
2. Click a company from the dropdown.
   - expect: The Company field transitions to display mode showing the selected company name.
   - expect: No error state or console error is thrown.

---

#### 2.2. TC05 — Verify Company ID Displays Below the Company Input After Selection ➕

**File:** `tests/ITEM-5838/TC05-company-id-displays-after-selection.spec.ts`
**Priority:** High
**Covers:** AC #9

**Steps:**
1. Log in. Navigate to the page. Select a company.
   - expect: The **Company ID** (numeric identifier) is displayed below the company input field.
   - expect: The Company ID matches the selected company's ID in the system.
   - expect: The ID is visible without scrolling.

---

#### 2.3. TC06 — Verify Changing Company Clears the Previously Selected User ➕

**File:** `tests/ITEM-5838/TC06-company-change-clears-user.spec.ts`
**Priority:** High
**Covers:** AC #10

**Steps:**
1. Log in. Navigate to the page. Select a company. Select a user (User field is populated).
2. Click "Change" on the Company field and select a different company.
   - expect: The **User field is cleared** — no previously selected user name or Associate ID remains visible.
   - expect: The User field returns to its empty/placeholder state.
   - expect: The User field is enabled (since a new company is now selected).

---

### 3. Layout Enhancements

#### 3.1. TC07 — Verify Select Company Field Stretches to Match Upload File Field Width ➕

**File:** `tests/ITEM-5838/TC07-company-field-width-matches-file-field.spec.ts`
**Priority:** Medium
**Covers:** AC #11 (Enhancement)

**Steps:**
1. Log in. Navigate to the page.
   - expect: The rendered width of the **Company** input field equals (or is equivalent to) the rendered width of the **Upload File** input/control.
   - expect: No overflow or wrapping of the Company field at viewport widths 1280×800 and 1920×1080.

---

#### 3.2. TC08 — Verify Correct Padding Exists Above the Blue Well and Below the Upload Tab ➕

**File:** `tests/ITEM-5838/TC08-well-padding.spec.ts`
**Priority:** Low
**Covers:** AC #12 (Enhancement)

**Steps:**
1. Log in. Navigate to the page.
   - expect: There is visible padding/spacing **above** the blue well/panel area (not flush against the tab bar).
   - expect: There is visible white space **below** the Upload tab before the form content begins.
   - expect: The spacing matches the design screenshot referenced in the ticket.

---

### 4. User Selection

#### 4.1. TC09 — Verify User Input Is Disabled Until a Company Is Selected ➕

**File:** `tests/ITEM-5838/TC09-user-input-disabled-without-company.spec.ts`
**Priority:** High
**Covers:** AC #11 (User Selection)

**Steps:**
1. Log in. Navigate to the page. Do not select a company.
   - expect: The **User** input field is **disabled** and not interactable.
   - expect: Attempting to type in the User field has no effect.
2. Select a company.
   - expect: The User field becomes **enabled** and accepts keyboard input.

---

#### 4.2. TC10 — Verify User Input Is Enabled After a Company Is Selected ➕

**File:** `tests/ITEM-5838/TC10-user-input-enabled-after-company.spec.ts`
**Priority:** High
**Covers:** AC #12

**Steps:**
1. Log in. Navigate to the page. Select a company.
   - expect: The User input field is enabled and shows a placeholder.
2. Type a character.
   - expect: An autocomplete dropdown appears with matching users for the selected company.

---

#### 4.3. TC11 — Verify User Input Restricts Results to Users Only (No Applicants) ➕

**File:** `tests/ITEM-5838/TC11-user-input-restricts-to-users.spec.ts`
**Priority:** High
**Covers:** AC #13

**Steps:**
1. Log in. Navigate to the page. Select a company that has at least one associate with type **"Applicant"**. Type the Applicant's name in the User field.
   - expect: The Applicant does **not** appear in the autocomplete dropdown.
   - expect: Only associates with a "User" account type are returned in the dropdown.

> ⚠️ Requires test data: a company with a known Applicant-type associate.

---

#### 4.4. TC12 — Verify Associate ID Displays Below the User Input After Selection ➕

**File:** `tests/ITEM-5838/TC12-associate-id-displays-after-user-selection.spec.ts`
**Priority:** High
**Covers:** AC #14

**Steps:**
1. Log in. Navigate to the page. Select a company. Select a user from the autocomplete.
   - expect: The **Associate ID** is displayed below the User input field.
   - expect: The Associate ID matches the selected user's record in the system.

---

### 5. File Selection

#### 5.1. TC13 — Verify Tooltip Icon Is Present on the Upload File Label ✅

**File:** `tests/ITEM-5838/TC13-upload-file-tooltip-icon-present.spec.ts`
**Priority:** Medium
**Covers:** AC #19 (maps to XRAY-3313)

**Steps:**
1. Log in. Navigate to the page.
   - expect: A tooltip/info icon is visible next to or on the **"Upload File:"** label.
   - expect: The icon renders using the correct Remixicon class.

---

#### 5.2. TC14 — Verify Tooltip Shows Correct Text on Hover ✅

**File:** `tests/ITEM-5838/TC14-upload-file-tooltip-text-on-hover.spec.ts`
**Priority:** Medium
**Covers:** AC #19 (maps to XRAY-3314, XRAY-3315, XRAY-3316)

**Steps:**
1. Log in. Navigate to the page. Hover over the tooltip icon on the Upload File label.
   - expect: A tooltip appears with the text: **"Supported file formats: PDF. Maximum file size: 15MB."**
   - expect: The tooltip message format matches existing tooltip messages elsewhere on the platform.
   - expect: "PDF" is listed as the supported file format.
   - expect: The Browse button itself does **not** show a tooltip (XRAY-3317).

---

#### 5.3. TC15 — Verify Only PDF Files Are Accepted via the Browse Button ➕

**File:** `tests/ITEM-5838/TC15-browse-accepts-only-pdf.spec.ts`
**Priority:** High
**Covers:** AC #15, AC #18

**Steps:**
1. Log in. Navigate to the page. Select company and user. Click Browse and select a valid `.pdf` file.
   - expect: The selected filename appears in the **read-only Upload File input**.
   - expect: No error state is shown.
   - expect: The filename ends with `.pdf`.

---

#### 5.4. TC16 — Verify Non-PDF File Shows "Invalid File Type" Error With Red Styling ✅

**File:** `tests/ITEM-5838/TC16-invalid-file-type-error.spec.ts`
**Priority:** High
**Covers:** AC #16 (maps to XRAY-3318)

**Steps:**
1. Log in. Navigate to the page. Select company and user. Click Browse and select a non-PDF file (e.g. `.jpg`, `.xlsx`, `.txt`).
   - expect: Error text **"Invalid file type"** appears in **red** below the Upload File input.
   - expect: The Upload File **label** turns red.
   - expect: The Upload File **input border** turns red.
   - expect: The Upload button remains disabled — the file cannot be submitted.

---

#### 5.5. TC17 — Verify File Over 15 MB Shows "Exceeds Maximum File Size" Error With Red Styling ✅

**File:** `tests/ITEM-5838/TC17-file-exceeds-size-limit-error.spec.ts`
**Priority:** High
**Covers:** AC #17 (maps to XRAY-3319)

**Steps:**
1. Log in. Navigate to the page. Select company and user. Click Browse and select a PDF file larger than 15 MB.
   - expect: Error text **"Exceeds maximum file size"** appears in **red** below the Upload File input.
   - expect: The Upload File **label** turns red.
   - expect: The Upload File **input border** turns red.
   - expect: The Upload button remains disabled — the file cannot be submitted.

---

#### 5.6. TC18 — Verify Blank or Corrupt PDF Is Accepted Without Validation Error ➕

**File:** `tests/ITEM-5838/TC18-blank-corrupt-pdf-accepted.spec.ts`
**Priority:** Low
**Covers:** Assumption ("Blank and corrupt PDFs are accepted")

**Steps:**
1. Log in. Navigate to the page. Select company and user. Click Browse and select a **blank** (0-byte) `.pdf` file.
   - expect: No "Invalid file type" or "Exceeds maximum file size" error appears.
   - expect: The filename is shown in the read-only input.
   - expect: The Upload button becomes enabled (all three fields are filled).

---

### 6. Upload Button State

#### 6.1. TC19 — Verify Upload Button Is Disabled Until All Three Fields Are Provided ➕

**File:** `tests/ITEM-5838/TC19-upload-button-disabled-until-all-fields.spec.ts`
**Priority:** High
**Covers:** AC #20

**Steps:**
1. Log in. Navigate to the page. Observe the Upload button with no fields filled.
   - expect: Upload button is **disabled**.
2. Select only a company (no user, no file).
   - expect: Upload button remains **disabled**.
3. Select company and user (no file).
   - expect: Upload button remains **disabled**.
4. Select company, user, and a valid PDF file.
   - expect: Upload button becomes **enabled**.
5. Remove the file (re-open Browse and cancel, or trigger invalid file to clear).
   - expect: Upload button becomes **disabled** again.

---

### 7. Upload Submit Flow

#### 7.1. TC20 — Verify Clicking Upload Submits Company ID, Associate ID, and File to the Import API ➕

**File:** `tests/ITEM-5838/TC20-upload-submits-correct-payload.spec.ts`
**Priority:** High
**Covers:** AC #21

**Steps:**
1. Log in. Navigate to the page. Select company (note Company ID), select user (note Associate ID), and attach a valid PDF. Set up network monitoring on the import API endpoint.
2. Click the Upload button.
   - expect: A **POST** request is made to the import API.
   - expect: The request payload includes the **Company ID**, **Associate ID**, and the **file contents**.
   - expect: No unrelated IDs or stale data are included in the payload.

---

#### 7.2. TC21 — Verify "Uploading…" Progress Modal Appears During File Upload ➕

**File:** `tests/ITEM-5838/TC21-uploading-progress-modal.spec.ts`
**Priority:** High
**Covers:** AC #22

**Steps:**
1. Log in. Navigate to the page. Select company, user, and a valid PDF. Intercept the import API to introduce a delay. Click Upload.
   - expect: A modal or overlay with text matching **"Uploading…"** (or equivalent) appears while the API call is in-flight.
   - expect: The modal indicates a loading/progress state.
2. Release the intercepted API call.
   - expect: The modal **dismisses automatically** once the upload completes — no manual close needed.

---

#### 7.3. TC22 — Verify Green Success Alert Displays "The record was added successfully." ➕

**File:** `tests/ITEM-5838/TC22-success-alert-message.spec.ts`
**Priority:** High
**Covers:** AC #23

**Steps:**
1. Log in. Navigate to the page. Select company, user, and a valid PDF. Click Upload and wait for completion.
   - expect: A **green** alert banner appears.
   - expect: The alert text reads exactly: **"The record was added successfully."**
   - expect: The alert is styled consistently with other success alerts on the platform.

---

#### 7.4. TC23 — Verify All Fields Are Cleared After a Successful Upload ➕

**File:** `tests/ITEM-5838/TC23-fields-cleared-after-success.spec.ts`
**Priority:** High
**Covers:** AC #24

**Steps:**
1. Log in. Navigate to the page. Select company, user, and a valid PDF. Click Upload and wait for the success alert.
   - expect: The **Company** field is cleared and returns to empty/placeholder state.
   - expect: The **User** field is cleared and returns to empty/placeholder state.
   - expect: The **Upload File** input is cleared — no filename is shown.
   - expect: The Upload button returns to its **disabled** state.
   - expect: The form is ready for a new submission without a page reload.

---

#### 7.5. TC24 — Verify Red Error Alert Displays "An error occurred while adding the record." on Upload Failure ➕

**File:** `tests/ITEM-5838/TC24-error-alert-on-upload-failure.spec.ts`
**Priority:** High
**Covers:** AC #25

**Steps:**
1. Log in. Navigate to the page. Select company, user, and a valid PDF. Intercept the import API and return a **500** error response. Click Upload.
   - expect: A **red** error alert banner appears.
   - expect: The alert text reads exactly: **"An error occurred while adding the record."**
   - expect: No raw stack trace or API error body is shown to the user.
   - expect: The form fields remain populated (allowing the user to retry).
   - expect: The Upload button re-enables after the error (user can retry).

---

#### 7.6. TC25 — Verify Clicking Upload a Second Time While Submission Is In Progress Has No Effect ➕

**File:** `tests/ITEM-5838/TC25-double-click-upload-no-effect.spec.ts`
**Priority:** Medium
**Covers:** AC #26

**Steps:**
1. Log in. Navigate to the page. Select company, user, and a valid PDF. Intercept the import API to add a delay. Click the Upload button.
2. While the upload is in progress (modal is visible), click the Upload button again.
   - expect: Only **one** API request is made — no duplicate submission.
   - expect: The Upload button is disabled or non-responsive during the in-flight request.
   - expect: The progress modal does not flicker or reset.

---

### 8. Well / Panel Styling

#### 8.1. TC26 — Verify Well/Panel Background Styling Is Preserved on the Form Area ➕

**File:** `tests/ITEM-5838/TC26-well-panel-background-styling.spec.ts`
**Priority:** Medium
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to the page.
   - expect: The form area (Company, User, Upload File, and Upload button) is enclosed in a **well or panel** container with the correct background styling (light blue / grey background, consistent with the legacy AngularJS version).
   - expect: No raw white `<div>` without styling wraps the form.
   - expect: No console errors related to missing CSS classes.

---

### 9. Regression

#### 9.1. TC27 — Verify Upload Icon Visibility on the Import Evaluator Qualifications Page ✅

**File:** `tests/ITEM-5838/TC27-upload-icon-regression.spec.ts`
**Priority:** High
**Covers:** XRAY-5584 (regression guard — Evaluator Qualifications Import line item)

**Steps:**
1. Log in. Navigate to the page.
   - expect: The **upload/browse icon** next to the Browse button is visible and renders correctly.
   - expect: The icon uses the correct Remixicon class (no broken image or missing glyph).
   - expect: The icon is sized and positioned consistently with the legacy page.

---

#### 9.2. TC28 — Verify No New Console Errors or Warnings Are Introduced ➕

**File:** `tests/ITEM-5838/TC28-no-console-errors.spec.ts`
**Priority:** High
**Covers:** Assumption ("No new console errors or warnings are introduced")

**Steps:**
1. Log in. Navigate to the page. Perform a full happy-path flow: select company → select user → attach a valid PDF → click Upload.
   - expect: No `console.error` messages are captured throughout the flow.
   - expect: No unhandled promise rejections appear.
   - expect: No Vue `[warn]` messages appear in the console.

---

## Coverage Summary

| TC   | Description                                                                                | Type | Priority | AC Ref      |
|------|--------------------------------------------------------------------------------------------|------|----------|-------------|
| TC01 | Verify page header displays "Import Evaluator Qualifications" with Upload tab              | ➕   | High     | AC #1       |
| TC02 | Verify button styles match spec (teal secondary for Upload, primary for Browse)            | ➕   | Medium   | AC #3, #4   |
| TC03 | Verify red required-field indicators are present on Company, User, and File inputs         | ➕   | High     | AC #6       |
| TC04 | Verify company can be selected via the company input field                                 | ➕   | High     | AC #8       |
| TC05 | Verify Company ID displays below the company input after selection                         | ➕   | High     | AC #9       |
| TC06 | Verify changing company clears the previously selected user                                | ➕   | High     | AC #10      |
| TC07 | Verify Select Company field stretches to match Upload File field width                     | ➕   | Medium   | AC #11 Enh  |
| TC08 | Verify correct padding exists above the blue well and below the Upload tab                 | ➕   | Low      | AC #12 Enh  |
| TC09 | Verify User input is disabled until a company is selected                                  | ➕   | High     | AC #11 User |
| TC10 | Verify User input is enabled after a company is selected                                   | ➕   | High     | AC #12 User |
| TC11 | Verify User input restricts results to users only (no Applicants)                          | ➕   | High     | AC #13      |
| TC12 | Verify Associate ID displays below the User input after selection                          | ➕   | High     | AC #14      |
| TC13 | Verify tooltip icon is present on the Upload File label                                    | ✅   | Medium   | AC #19 / XRAY-3313 |
| TC14 | Verify tooltip shows correct text on hover                                                 | ✅   | Medium   | AC #19 / XRAY-3314–3317 |
| TC15 | Verify only PDF files are accepted via the Browse button                                   | ➕   | High     | AC #15, #18 |
| TC16 | Verify non-PDF file shows "Invalid file type" error with red styling                       | ✅   | High     | AC #16 / XRAY-3318 |
| TC17 | Verify file over 15 MB shows "Exceeds maximum file size" error with red styling            | ✅   | High     | AC #17 / XRAY-3319 |
| TC18 | Verify blank or corrupt PDF is accepted without validation error                           | ➕   | Low      | Assumption  |
| TC19 | Verify Upload button is disabled until all three fields are provided                       | ➕   | High     | AC #20      |
| TC20 | Verify clicking Upload submits Company ID, Associate ID, and file to the import API        | ➕   | High     | AC #21      |
| TC21 | Verify "Uploading…" progress modal appears during file upload and dismisses automatically  | ➕   | High     | AC #22      |
| TC22 | Verify green success alert displays "The record was added successfully."                   | ➕   | High     | AC #23      |
| TC23 | Verify all fields are cleared after a successful upload                                    | ➕   | High     | AC #24      |
| TC24 | Verify red error alert displays "An error occurred while adding the record." on failure    | ➕   | High     | AC #25      |
| TC25 | Verify clicking Upload a second time while submission is in progress has no effect         | ➕   | Medium   | AC #26      |
| TC26 | Verify well/panel background styling is preserved on the form area                         | ➕   | Medium   | AC #5       |
| TC27 | Verify Upload icon visibility on the Import Evaluator Qualifications page                  | ✅   | High     | XRAY-5584   |
| TC28 | Verify no new console errors or warnings are introduced                                    | ➕   | High     | Assumption  |

---

## Automation Recommendation

### Summary

| Recommendation | Count | TCs |
|---|---|---|
| ✅ Automate | 25 | TC01–06, TC09–25, TC27–28 |
| ⚠️ Manual only | 3 | TC07, TC08, TC26 |

---

### ✅ Automate — 25 TCs

| TC | Reason |
|----|--------|
| **TC01** — Page header & Upload tab | Pure DOM text + visibility assertion. Zero flakiness. Serves as a smoke test on every run. |
| **TC02** — Button styles (teal/primary) | CSS class assertion (`button-secondary`, `button-primary`, Remixicon class names) is deterministic. Scope to class checks only — actual colour rendering belongs in visual regression tooling. |
| **TC03** — Required-field indicators | CSS class or computed-colour assertion on label elements. Reliable and fast. |
| **TC04** — Company selection | Standard autocomplete interaction (type → dropdown → click). Playwright handles this pattern well. Core happy-path entry point. |
| **TC05** — Company ID displays after selection | Text-content assertion after selecting a company. Same reliable DOM pattern as TC04. |
| **TC06** — Changing company clears user | Multi-step interaction sequence with a cleared-field assertion. Directly tests AC #10 and is high-value as a regression guard. |
| **TC09** — User disabled without company | `disabled` attribute check — first-class Playwright assertion (`toBeDisabled()`). Critical for AC #11. |
| **TC10** — User enabled after company | Complement to TC09. `toBeEnabled()` after company selection. Minimal extra effort, high coverage value. |
| **TC11** — User restricts to users only (no Applicants) | Type a known Applicant name → assert it does not appear in dropdown. High business value (data integrity). ⚠️ Requires a company in the test environment that has at least one Applicant-type associate — document this as a `@requires-test-data` tag and confirm test account with the team before implementing. |
| **TC12** — Associate ID displays after user selection | Text-content assertion. Mirrors TC05. No added complexity. |
| **TC13** — Tooltip icon visible on Upload File label | `toBeVisible()` on the icon element. Simple regression guard for XRAY-3313. |
| **TC14** — Tooltip text on hover | `hover()` + `toBeVisible()` + exact text assertion. Playwright's hover support is reliable; covers XRAY-3314–3317 in one test. |
| **TC15** — Only PDF accepted via Browse | `setInputFiles()` with a valid `.pdf` — assert filename appears, no error state. Core happy path for file selection. |
| **TC16** — Non-PDF shows "Invalid file type" error | `setInputFiles()` with a `.jpg`/`.xlsx` → assert error text, red CSS classes on label/border, Upload button disabled. Already mapped to XRAY-3318. |
| **TC17** — File >15 MB shows "Exceeds maximum file size" error | `setInputFiles()` with a synthetically generated `Buffer` of >15 MB (no real file needed) → assert error text and red styling. Maps to XRAY-3319. |
| **TC18** — Blank/corrupt PDF accepted without error | `setInputFiles()` with a 0-byte `.pdf` → verify no validation error and Upload button is enabled. Low effort, confirms client-side validation boundary. |
| **TC19** — Upload button disabled until all three fields provided | Step-by-step `toBeDisabled()` / `toBeEnabled()` as Company → User → File are progressively filled and then removed. Directly tests AC #20 state machine. |
| **TC20** — Upload submits correct payload to import API | `page.route()` intercept to capture the POST request body and assert it contains the correct Company ID, Associate ID, and file. ⚠️ Confirm the exact API endpoint and multipart field names with dev before implementing (see Risk ⚠️3). |
| **TC21** — "Uploading…" progress modal appears and auto-dismisses | `page.route()` with an artificial delay to hold the request in-flight → assert modal is visible → release route → assert modal disappears. Reliable with Playwright's routing API. |
| **TC22** — Green success alert "The record was added successfully." | Assert alert text and success CSS class after a completed upload. Core happy-path outcome. |
| **TC23** — All fields cleared after successful upload | Post-submit DOM assertions: all inputs return to empty/placeholder state, Upload button is disabled. Tests AC #24 fully. |
| **TC24** — Red error alert on upload failure | `page.route()` returning `{ status: 500 }` → assert red alert text, fields remain populated, button re-enables. Essential error-path coverage for AC #25. |
| **TC25** — Double-click Upload has no effect | `page.route()` with delay → click Upload twice → assert `page.waitForRequest` count equals 1. Playwright's request counting makes this deterministic. |
| **TC27** — Upload icon visibility (XRAY-5584 regression guard) | `toBeVisible()` on the browse icon. Lightweight regression guard with a direct XRAY mapping — must stay in the suite. |
| **TC28** — No console errors during happy-path flow | Attach a `page.on('console', ...)` listener before navigation and assert zero `error`/`warning` messages during the full happy-path flow. Playwright built-in; no additional tooling needed. |

---

### ⚠️ Manual only — 3 TCs

| TC | Reason |
|----|--------|
| **TC07** — Company field width matches Upload File field width | Width equality via `getBoundingClientRect()` is fragile: values vary with OS font rendering, browser zoom, and DPI. The assertion would produce false failures in CI. If layout consistency becomes a recurring regression, migrate to a dedicated visual regression tool (e.g., Percy or Playwright visual comparisons with a stored baseline). |
| **TC08** — Padding above the blue well and below the Upload tab | Computed padding values (`getComputedStyle`) are brittle and low-value to assert numerically. This is a designer/manual review concern and does not block functionality. Low priority (AC #12 Enhancement). |
| **TC26** — Well/panel background styling preserved | CSS class presence can be checked, but the actual rendered background colour and visual appearance require either a visual regression baseline or a manual review against the legacy AngularJS page. Until a visual regression pipeline is in place, verify this manually during QA sign-off. |
