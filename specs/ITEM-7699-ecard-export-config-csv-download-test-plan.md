# ITEM-7699 eCard Data Export — Export Configuration & CSV Download Test Plan

## Application Overview

Test plan for **ITEM-7699** ("[BMAD] Convert eCard Data Export — Export Configuration & CSV Download"), the second of two stories covering the eCard Data Export page (`/legacy/ECardDataExport`). The first story (ITEM-5835) covers page setup, top-level filters, advanced employee filter, search, and dual list. This story covers:

- **Export Configuration** — Type dropdown, "Mark as Has eCard" and "Include Job Title" checkboxes.
- **Export CSV** — Button state rules, loading spinner + progress modal, download token flow.
- **Download Output** — Sticker Export (CSV) and eCard Export (.zip with Images, QRCodes, CardData CSV), filename timestamp format.
- **Error Handling** — Attention modal when no employee selected, API error toast, timeout message.
- **State Reset** — Dual list and export controls hidden when company is deselected.

**Related story:** ITEM-5835 (Page Setup, Filters & Search)
**Page URL:** `/legacy/ECardDataExport`
**Page object:** `pages/utilities/ECardDataExportPage.ts`
**Test files:** `tests/ITEM-7699/`
**Seed:** `tests/seed.spec.ts`

> ⚠️ **Note:** The Jira ticket referenced as ITEM-7966 in the test request maps to **ITEM-7699** in Jira. All references use ITEM-7699.

---

## Existing XRAY Test Coverage (from Jira)

| XRAY Key   | Summary                                                                 | Status |
|------------|-------------------------------------------------------------------------|--------|
| XRAY-5673  | Generate a Card export → confirm CR-80 front-only format output         | To Do  |
| XRAY-5425  | Verify page loads with correct page header and tab                      | To Do  |
| XRAY-5278  | Verify filter panel is collapsed by default on page load                | Done   |
| XRAY-5098  | TC-12 Required validation when Company not selected                     | Done   |
| XRAY-5331  | Extra space in "Name / Associate ID" field                              | Done   |

---

## Test Scenarios

### 1. Export Configuration

#### 1.1. TC01 — Verify Export Type Dropdown Defaults to "eCard Export" and Shows Both Options ✅

**File:** `tests/ITEM-7699/TC01-export-type-dropdown.spec.ts`

**Priority:** High

**Covers:** AC #1

**Steps:**
  1. Log in as an EWN user. Navigate to `/legacy/ECardDataExport`. Select a company, click Search, move at least one associate to Selected.
    - expect: An "Export Type" (or similar label) dropdown is visible in the export configuration section.
    - expect: The dropdown defaults to **"eCard Export"** (DataAndImages) on page load.
    - expect: The dropdown contains exactly two options: **"eCard Export"** and **"Sticker Export"** (Data).

#### 1.2. TC02 — Verify "Mark as Has eCard" Checkbox Is Unchecked by Default and Sends Correct API Flag ➕

**File:** `tests/ITEM-7699/TC02-mark-as-has-ecard-checkbox.spec.ts`

**Priority:** High

**Covers:** AC #2

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company and click Search.
    - expect: "Mark as Has eCard" checkbox is visible in the export configuration section.
    - expect: Checkbox is **unchecked** by default.
  2. Check the "Mark as Has eCard" checkbox. Intercept the export API request. Click Export CSV.
    - expect: The export API request body includes a flag/field indicating `markAsHasECard: true` (or equivalent).
  3. Uncheck the checkbox and click Export CSV again.
    - expect: The export API request does NOT include the mark-as-has-ecard flag (or it is `false`).

#### 1.3. TC03 — Verify "Include Job Title" Checkbox Is Unchecked by Default and Adds Job Title Column to CSV ➕

**File:** `tests/ITEM-7699/TC03-include-job-title-checkbox.spec.ts`

**Priority:** High

**Covers:** AC #3

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company and click Search.
    - expect: "Include Job Title" checkbox is visible in the export configuration section.
    - expect: Checkbox is **unchecked** by default.
  2. Check "Include Job Title". Intercept the export API. Click Export CSV.
    - expect: The API request includes a flag indicating `includeJobTitle: true` (or equivalent).
  3. Verify the downloaded CSV has an additional "Job Title" column.
    - expect: The CSV header row contains a job title column not present when the option is unchecked.

#### 1.4. TC04 — Verify Export Configuration and Dual List Are Hidden When Company Is Deselected ✅

**File:** `tests/ITEM-7699/TC04-config-hidden-on-deselect.spec.ts`

**Priority:** High

**Covers:** AC #4

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select a company and click Search. Confirm dual list, export configuration, and Export CSV button are visible.
    - expect: Dual list, export config section, and Export CSV button are all visible.
  2. Click the "Change" link to deselect the company.
    - expect: Dual list (Available Associates / Selected Associates) is hidden.
    - expect: Export configuration section (Type dropdown, checkboxes) is hidden.
    - expect: Export CSV button is hidden.
    - expect: The company search input is shown again (page returns to initial state).

---

### 2. Export CSV Button State

#### 2.1. TC05 — Verify Export CSV Button Is Enabled When All Active Employees Is Checked ✅

**File:** `tests/ITEM-7699/TC05-export-button-enabled-all-active.spec.ts`

**Priority:** High

**Covers:** AC #11a

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select a company. Check "All Active Employees". (Do NOT move any associates to Selected.)
    - expect: Export CSV button is **enabled** (clickable, not greyed out).

#### 2.2. TC06 — Verify Export CSV Button Is Enabled When Associates Are in the Selected List ✅

**File:** `tests/ITEM-7699/TC06-export-button-enabled-with-selection.spec.ts`

**Priority:** High

**Covers:** AC #11a

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company, click Search. Move at least one associate to the Selected list. Ensure "All Active Employees" is unchecked.
    - expect: Export CSV button is **enabled**.

#### 2.3. TC07 — Verify Export CSV Button Shows Attention Modal When No Associates Are Selected ➕

**File:** `tests/ITEM-7699/TC07-export-button-no-selection-modal.spec.ts`

**Priority:** High

**Covers:** AC #11c, AC #12

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company, click Search. Ensure "All Active Employees" is unchecked and Selected Associates list is empty.
    - expect: Export CSV button is **enabled/active** (not disabled — AC #11c).
  2. Click Export CSV with no associates selected and All Active Employees unchecked.
    - expect: An **"Attention"** modal appears with message "Please select at least one employee".
    - expect: No 422 HTTP error is triggered (the check happens client-side before the request).
    - expect: No export file download begins.
  3. Close/dismiss the modal.
    - expect: The page remains functional; user can select associates and retry.

#### 2.4. TC08 — Verify Export CSV Button Is Disabled While Export Is In Progress ✅

**File:** `tests/ITEM-7699/TC08-export-button-disabled-in-progress.spec.ts`

**Priority:** High

**Covers:** AC #11b

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company, click Search. Move at least one associate to Selected.
  2. Intercept the export API to introduce a delay. Click Export CSV.
    - expect: Export CSV button is **disabled** immediately after the click, while the API call is in-flight.
  3. Release the intercepted request.
    - expect: The button becomes enabled or the download begins.

---

### 3. Loading State

#### 3.1. TC09 — Verify Vue 3 Loading Spinner Displays Briefly Before the Downloading Progress Modal ➕

**File:** `tests/ITEM-7699/TC09-loading-spinner-before-modal.spec.ts`

**Priority:** Medium

**Covers:** AC #7

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected.
  2. Intercept the export API to add delay. Click Export CSV.
    - expect: A Vue 3 loading spinner (distinct from the "Downloading" modal) appears briefly before the "Downloading File Please Wait…" modal.
    - expect: The spinner is scoped to the export area (not a full-page overlay).
  3. Release the intercepted response.
    - expect: Spinner disappears and/or the progress modal transitions appropriately.

#### 3.2. TC10 — Verify "Downloading File Please Wait…" Progress Modal Displays During File Download ✅

**File:** `tests/ITEM-7699/TC10-downloading-progress-modal.spec.ts`

**Priority:** High

**Covers:** AC #8

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected. Click Export CSV.
    - expect: A modal or overlay appears with text matching **"Downloading File Please Wait…"** (or similar) while the download is in progress.
    - expect: The modal indicates a loading/progress state (spinner, progress bar, or indeterminate animation).
    - expect: The modal disappears once the download completes or an error is shown.

---

### 4. Download — Sticker Export (CSV)

#### 4.1. TC11 — Verify Sticker Export Produces a CSV File With Correct Timestamp in the Filename ✅

**File:** `tests/ITEM-7699/TC11-sticker-export-csv-output.spec.ts`

**Priority:** High

**Covers:** AC #9 (XRAY-5673 partial)

**Steps:**
  1. Log in. Select company, click Search. Move at least one associate to Selected. Set Export Type to **"Sticker Export"**. Click Export CSV.
    - expect: A file download begins.
    - expect: The downloaded file is a **CSV** (`.csv` extension, `text/csv` content-type or equivalent).
    - expect: The filename includes a timestamp in `YYYY/MM/DD/HH/MM/SS` format (or underscore-separated equivalent).
    - expect: The CSV contains at least one data row with employee information.

#### 4.2. TC12 — Verify Sticker Export CSV Contains Clickable Links to Employee Qualifications ➕

**File:** `tests/ITEM-7699/TC12-sticker-export-qualification-links.spec.ts`

**Priority:** Medium

**Covers:** AC #9

**Steps:**
  1. Log in. Perform a Sticker Export (as TC11). Parse the downloaded CSV content.
    - expect: Each employee row contains a URL/link column pointing to that employee's qualifications page within EWN.
    - expect: URLs are non-empty and well-formed (start with `http` or `/`).

---

### 5. Download — eCard Export (ZIP)

#### 5.1. TC13 — Verify eCard Export Produces a ZIP File Containing Images, QRCodes, and CardData CSV ➕

**File:** `tests/ITEM-7699/TC13-ecard-export-zip-structure.spec.ts`

**Priority:** High

**Covers:** AC #10

**Steps:**
  1. Log in. Select company, click Search. Move at least one associate to Selected. Set Export Type to **"eCard Export"** (default). Click Export CSV.
    - expect: A file download begins and the file is a **ZIP** archive (`.zip` extension).
    - expect: The ZIP archive contains an **Images** folder.
    - expect: The ZIP archive contains a **QRCodes** folder.
    - expect: The ZIP archive contains a **CardData** CSV file with a timestamp in `YYYY/MM/DD/HH/MM/SS` format.

#### 5.2. TC14 — Verify eCard Export CSV Column Headers Match Sticker Export CSV Column Headers ➕

**File:** `tests/ITEM-7699/TC14-ecard-csv-matches-sticker-csv.spec.ts`

**Priority:** Medium

**Covers:** AC #10

**Steps:**
  1. Log in. Perform a Sticker Export with a known set of associates. Note the column headers and data.
  2. Perform an eCard Export with the same associates.
    - expect: The CardData CSV inside the ZIP has **identical column headers** to the Sticker Export CSV.
    - expect: Employee rows for the same associate contain equivalent data values.

#### 5.3. TC15 — Verify Export Output Matches the Legacy Version for Identical Inputs ⚠️

**File:** `tests/ITEM-7699/TC15-legacy-output-parity.spec.ts`

**Priority:** High

**Covers:** AC #17

**Steps:**
  1. Execute the same export (same company, same associates, same export type) on the **legacy** AngularJS page and on the **new Vue** page.
    - expect: Column headers are identical in both CSV outputs.
    - expect: Data values for the same associate are identical in both outputs.
    - expect: Timestamp format in the filename is the same.

  **Note (⚠️ Gap):** Requires access to the legacy page being available in parallel with the converted page, or a pre-captured baseline file for comparison. If legacy is already decommissioned, capture a baseline from preprod before migration.

---

### 6. All Active Employees Export

#### 6.1. TC16 — Verify Export Request Uses All-Active Flag When All Active Employees Is Checked ➕

**File:** `tests/ITEM-7699/TC16-all-active-employees-export-flag.spec.ts`

**Priority:** High

**Covers:** AC #5

**Steps:**
  1. Log in. Select company, click Search. Check **"All Active Employees"**. Intercept the export API call. Click Export CSV.
    - expect: The API request body includes an `allActiveEmployees: true` flag (or equivalent), NOT a list of individual associate IDs.
  2. Uncheck "All Active Employees", select one associate manually, repeat intercept.
    - expect: The API request body contains the specific associate ID(s), NOT the all-active flag.

#### 6.2. TC17 — Verify Dual List Is Hidden When All Active Employees Is Checked ✅

**File:** `tests/ITEM-7699/TC17-all-active-hides-dual-list.spec.ts`

**Priority:** High

**Covers:** ITEM-5835 AC #33 (regression guard for this story)

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected (both panels visible).
  2. Check "All Active Employees".
    - expect: Both **Available Associates** and **Selected Associates** dual list panels are **hidden**.
    - expect: Previously selected associates in the list do not cause confusion — the all-active flag takes precedence.
  3. Uncheck "All Active Employees".
    - expect: The dual list panels reappear.

---

### 7. Error Handling

#### 7.1. TC18 — Verify User-Facing Error Toast Is Displayed When Export API Returns an Error ✅

**File:** `tests/ITEM-7699/TC18-api-error-toast.spec.ts`

**Priority:** High

**Covers:** AC #14, AC #16

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected.
  2. Intercept the export API call and return a 500 error response. Click Export CSV.
    - expect: A user-facing **error toast message** is displayed (no raw stack trace or API error body).
    - expect: No file download is triggered.
    - expect: The page remains functional; user can retry.

#### 7.2. TC19 — Verify Timeout Validation Message Is Displayed When Export Exceeds the Threshold ➕ ⚠️

**File:** `tests/ITEM-7699/TC19-export-timeout-message.spec.ts`

**Priority:** Medium

**Covers:** AC #13

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected.
  2. Intercept the export API call and simulate a request timeout (delay beyond the app's timeout threshold). Click Export CSV.
    - expect: A user-facing **timeout/error validation message** is displayed (e.g. "Export timed out. Please try again.").
    - expect: No file download is triggered.
    - expect: The Export CSV button becomes re-enabled after the timeout so the user can retry.

  **Note (⚠️ Gap):** Timeout threshold value must be confirmed from the implementation or network config before implementing this test. Use `page.route()` with a never-resolving response to simulate.

#### 7.3. TC20 — Verify Attention Modal Appears When Export Is Clicked With No Selection and All Active Employees Unchecked ✅

**File:** `tests/ITEM-7699/TC20-attention-modal-no-selection.spec.ts`

**Priority:** High

**Covers:** AC #12

**Steps:**
  1. Log in. Select company, click Search. Ensure Selected Associates is empty and "All Active Employees" is unchecked.
  2. Click Export CSV.
    - expect: Modal with title **"Attention"** and body **"Please select at least one employee"** is shown.
    - expect: No HTTP 422 error appears in the browser network log.
    - expect: No download is triggered.
  3. Click the modal's close/dismiss button.
    - expect: Modal closes. Page is fully functional.

---

### 8. Download Token Flow

#### 8.1. TC21 — Verify Successful Export Returns a Download Token and Triggers File Download ➕

**File:** `tests/ITEM-7699/TC21-download-token-flow.spec.ts`

**Priority:** High

**Covers:** AC #6

**Steps:**
  1. Log in. Select company, click Search. Move one associate to Selected. Set up network monitoring. Click Export CSV.
    - expect: The export API (`POST card-data` or equivalent) responds with a **download token**.
    - expect: A subsequent **GET** request is made to `card-data?token={token}` to retrieve the file.
    - expect: The file download begins (browser triggers save dialog or auto-download).

---

### 9. Visual & UI Consistency

#### 9.1. TC22 — Verify Export Configuration Section Is Visually Consistent With the Legacy Page ➕

**File:** `tests/ITEM-7699/TC22-export-config-ui-consistency.spec.ts`

**Priority:** Low

**Covers:** AC #15

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Select company, click Search. Observe the export configuration section.
    - expect: Export Type dropdown, "Mark as Has eCard", and "Include Job Title" controls are laid out consistently with the legacy page (same order, same labels, comparable spacing).
    - expect: Export CSV button is styled consistently with the design spec (correct color, label, position below the dual list).
    - expect: No broken layout, overlapping elements, or missing borders compared to legacy.

#### 9.2. TC23 — Verify No Console Errors Occur During Normal Export Flow ➕

**File:** `tests/ITEM-7699/TC23-no-console-errors.spec.ts`

**Priority:** Medium

**Covers:** ITEM-5835 Assumptions ("No new console errors or warnings are introduced")

**Steps:**
  1. Log in. Navigate to `/legacy/ECardDataExport`. Perform a full happy-path export: select company → click Search → move associate → click Export CSV.
    - expect: No JavaScript errors (`console.error`) are captured during the entire flow.
    - expect: No unhandled promise rejections appear in the console.

---

## Coverage Summary

| TC   | Description                                                        | Type | Priority | AC Ref      |
|------|--------------------------------------------------------------------|------|----------|-------------|
| TC01 | Verify Export Type dropdown defaults to "eCard Export" and shows both options | ✅   | High     | AC #1       |
| TC02 | Verify "Mark as Has eCard" checkbox is unchecked by default and sends correct API flag | ➕   | High     | AC #2       |
| TC03 | Verify "Include Job Title" checkbox is unchecked by default and adds job title column to CSV | ➕   | High     | AC #3       |
| TC04 | Verify export configuration and dual list are hidden when company is deselected | ✅   | High     | AC #4       |
| TC05 | Verify Export CSV button is enabled when All Active Employees is checked | ✅   | High     | AC #11a     |
| TC06 | Verify Export CSV button is enabled when associates are in the Selected list | ✅   | High     | AC #11a     |
| TC07 | Verify Export CSV button shows Attention modal when no associates are selected | ➕   | High     | AC #11c, #12|
| TC08 | Verify Export CSV button is disabled while export is in progress   | ✅   | High     | AC #11b     |
| TC09 | Verify Vue 3 loading spinner displays briefly before the Downloading progress modal | ➕   | Medium   | AC #7       |
| TC10 | Verify "Downloading File Please Wait…" progress modal displays during file download | ✅   | High     | AC #8       |
| TC11 | Verify Sticker Export produces a CSV file with correct timestamp in the filename | ✅   | High     | AC #9       |
| TC12 | Verify Sticker Export CSV contains clickable links to employee qualifications | ➕   | Medium   | AC #9       |
| TC13 | Verify eCard Export produces a ZIP file containing Images, QRCodes, and CardData CSV | ➕   | High     | AC #10      |
| TC14 | Verify eCard Export CSV column headers match Sticker Export CSV column headers | ➕   | Medium   | AC #10      |
| TC15 | Verify export output matches the legacy version for identical inputs | ⚠️   | High     | AC #17      |
| TC16 | Verify export request uses all-active flag when All Active Employees is checked | ➕   | High     | AC #5       |
| TC17 | Verify dual list is hidden when All Active Employees is checked    | ✅   | High     | ITEM-5835   |
| TC18 | Verify user-facing error toast is displayed when export API returns an error | ✅   | High     | AC #14, #16 |
| TC19 | Verify timeout validation message is displayed when export exceeds the threshold | ⚠️   | Medium   | AC #13      |
| TC20 | Verify Attention modal appears when export is clicked with no selection and All Active Employees unchecked | ✅   | High     | AC #12      |
| TC21 | Verify successful export returns a download token and triggers file download | ➕   | High     | AC #6       |
| TC22 | Verify export configuration section is visually consistent with the legacy page | ➕   | Low      | AC #15      |
| TC23 | Verify no console errors occur during normal export flow           | ➕   | Medium   | Assumptions |

**Legend:** ✅ Covers existing Jira/XRAY TC &nbsp;|&nbsp; ➕ New Playwright-only TC &nbsp;|&nbsp; ⚠️ Gap or risk requiring special handling

---

## Risks & Gaps

| # | Risk | Mitigation |
|---|------|------------|
| R1 | **File download assertions** — Playwright intercepts downloads via `page.waitForEvent('download')` but cannot open ZIP contents natively; CSV parse requires `fs.readFileSync` on the temp path | Use `download.path()` + Node `fs` to read CSV; for ZIP use a library like `adm-zip` in a helper |
| R2 | **Legacy parity (TC15)** — Legacy page may be decommissioned before automation runs | Capture baseline CSV/ZIP from preprod before migration; store as fixture files |
| R3 | **Timeout threshold (TC19)** — Timeout value not specified in AC | Confirm threshold with dev team before implementing; use `page.route()` + never-resolving response |
| R4 | **Download token in URL (TC21)** — Token format / endpoint path may differ from `card-data?token=` | Confirm endpoint via network tab on live page before implementing |
| R5 | **AC #11c ambiguity** — Button is "active" with no selection, but clicking shows an attention modal rather than performing the export — this may confuse users expecting a disabled button | Discuss UX intent with product; TC07 documents and validates the current spec |

---

## Page Object Outline

**File:** `pages/utilities/ECardDataExportPage.ts`

```typescript
// ── Export Configuration ──────────────────────────────────────────────
exportTypeDropdown       = page.locator('select[name*="type"], [data-testid="export-type"]');
markAsHasECardCheckbox   = page.locator('input[type="checkbox"]').filter({ hasText: /mark.*ecard/i });
includeJobTitleCheckbox  = page.locator('input[type="checkbox"]').filter({ hasText: /job title/i });

// ── Export CSV button ─────────────────────────────────────────────────
exportCsvButton          = page.getByRole('button', { name: /export.*csv/i });

// ── Progress / Loading ────────────────────────────────────────────────
loadingSpinner           = page.locator('.spinner, [data-testid="loading-spinner"]');
downloadingModal         = page.locator('.modal').filter({ hasText: /downloading file please wait/i });

// ── Attention modal ───────────────────────────────────────────────────
attentionModal           = page.locator('.modal').filter({ hasText: /attention/i });
attentionModalBody       = page.locator('.modal-body');

// ── Toast alerts ──────────────────────────────────────────────────────
errorToast               = page.locator('.toast, [role="alert"]').filter({ hasText: /error|fail/i });

// ── Key methods ───────────────────────────────────────────────────────
selectExportType(type: 'eCard Export' | 'Sticker Export')
checkMarkAsHasECard()
checkIncludeJobTitle()
clickExportCsv()
waitForDownloadingModal()
expectDownloadingModalVisible()
expectAttentionModalVisible()
dismissAttentionModal()
expectErrorToastVisible()
expectExportCsvButtonEnabled()
expectExportCsvButtonDisabled()
waitForDownload(): Promise<Download>
```

> **Note:** Locators above are best-guess patterns to be validated against the live DOM once the feature is implemented. Update selectors after inspecting `/legacy/ECardDataExport` in the test environment.
