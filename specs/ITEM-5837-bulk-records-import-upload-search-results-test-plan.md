# ITEM-5837 Bulk Records Import — Upload and Search & Results Vue 3 Conversion Test Plan

## Application Overview

Test plan for **ITEM-5837** ("[BMAD] Convert Bulk Records Import Upload and Search & Results"). This story converts the Bulk Records Import page from AngularJS to Vue 3, preserving the two-tab interface (Upload and Search & Results) with all upload, validation, search, and file-download behaviour intact.

**Page URL:** `/legacy/BulkRecordsImport` _(to be confirmed with dev — see ⚠️1)_
**Page objects:**
- `pages/utilities/BulkRecordsImportPage.ts` _(to be created)_
**Test files:** `tests/ITEM-5837/`
**Seed:** `tests/seed.spec.ts`

> ⚠️ The ticket AC numbering has three conflicts: two separate ACs are numbered **#8** (Validation and Page Structure), two are numbered **#16** (Company Selection: "hide template" and File Selection: "accept only .xlsx"), and two are numbered **#17** (Company Selection: "preserve company" and File Selection: "reject >100MB"). Each conflict is disambiguated in this plan using a section suffix (e.g. AC #16-Upload, AC #16-File).

---

## Existing XRAY Test Coverage

No XRAY test cases are referenced in this ticket. All test cases in this plan are new (➕).

---

## Risks & Gaps

| #    | Risk / Gap                                                                                                                                                  | Impact  |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| ⚠️1  | Page URL is unconfirmed — assumed `/legacy/BulkRecordsImport`. Verify before automating any TC.                                                             | High    |
| ⚠️2  | The import API endpoint and request shape for the file + company data submission (AC #21) are unknown — confirm multipart field names with dev before TC20.  | High    |
| ⚠️3  | AC #38 says "Updated On date" but AC #31 lists the column as "Completed On" — clarify the correct column label with dev/design before asserting text in TC35. | Medium  |
| ⚠️4  | "Localized status labels" in AC #37 — confirm whether these are translation keys or hardcoded English strings, and whether a test-env locale is configured.  | Medium  |
| ⚠️5  | AC #29 (horizontal scroll bar in Firefox only) requires running TC28 against a Firefox browser profile — confirm Firefox is included in the Playwright project config. | Medium  |
| ⚠️6  | File download assertions (AC #15c, AC #39, AC #40) depend on the download file URL/endpoint — confirm with dev and use `page.waitForEvent('download')`.      | Medium  |
| ⚠️7  | The "Downloading File Please wait…" modal for Download Template Excel (AC #15c) requires a network delay to observe — confirm whether it uses the same progress-modal component as the upload flow. | Low     |
| ⚠️8  | AC #26 (double-click prevention) implementation is unconfirmed (button disabled vs. debounce). Confirm with dev before asserting the mechanism in TC25.       | Low     |
| ⚠️9  | Visual parity ACs (#3, #4, #6, #7, #36) require a pre-migration baseline screenshot. Capture the legacy page before it is decommissioned.                   | High if legacy decommissioned first |

---

## Test Scenarios

### 1. Page Structure & UI Consistency

#### 1.1. TC01 — Verify "Bulk Records Import" Header and Both Tabs Display on Page Load ➕

**File:** `tests/ITEM-5837/TC01-header-and-tabs-visible.spec.ts`
**Priority:** High
**Covers:** AC #1, AC #2

**Steps:**
1. Log in. Navigate to `/legacy/BulkRecordsImport`.
   - expect: The page heading reads exactly **"Bulk Records Import"**.
   - expect: Two tabs are visible: **"Upload"** and **"Search"**.
   - expect: The **Upload** tab is active (selected) by default.
   - expect: The **Search** tab is present but not active on initial load.

---

#### 1.2. TC02 — Verify Tab Icons and Tooltips Are Correct for Upload and Search Tabs ➕

**File:** `tests/ITEM-5837/TC02-tab-icons-and-tooltips.spec.ts`
**Priority:** Medium
**Covers:** AC #4 (Upload/Search icon classes), AC #7

**Steps:**
1. Log in. Navigate to the page.
2. Observe the **Upload** tab.
   - expect: The Upload tab displays the correct upload icon (verify Remixicon class with dev).
   - expect: Hovering over the Upload tab shows the existing tooltip message text (confirm exact string with dev).
3. Observe the **Search** tab.
   - expect: The Search tab displays the correct search icon.
   - expect: Hovering over the Search tab shows the existing tooltip message text.
   - expect: Tooltip text matches the legacy AngularJS implementation verbatim.

---

#### 1.3. TC03 — Verify Button Styles Match Spec (Teal Secondary for Upload/Search, Primary for Browse) ➕

**File:** `tests/ITEM-5837/TC03-button-styles.spec.ts`
**Priority:** Medium
**Covers:** AC #5

**Steps:**
1. Log in. Navigate to the page (Upload tab active).
   - expect: The **Upload** button has the `button-secondary` CSS class (teal).
   - expect: The **Browse** button has the `button-primary` CSS class.
2. Switch to the Search tab.
   - expect: The **Search** button has the `button-secondary` CSS class (teal).
   - expect: No default browser button styles override the custom classes.

---

#### 1.4. TC04 — Verify Panel Background Styling Is Preserved on Filter and Form Areas ➕

**File:** `tests/ITEM-5837/TC04-panel-background-styling.spec.ts`
**Priority:** Medium
**Covers:** AC #6

> **Note:** CSS class presence is automatable; actual rendered background colour requires a visual baseline. Verify colour manually during QA sign-off (see ⚠️9).

**Steps:**
1. Log in. Navigate to the page.
   - expect: The Upload form area (company, file, Upload button) is enclosed in a **panel or well** container with the correct background styling class.
2. Switch to the Search tab.
   - expect: The Search Results table is enclosed in a **panel or well** with the same styling class.
   - expect: No unstyled raw `<div>` wraps the form or table content.

---

### 2. Validation

#### 2.1. TC05 — Verify Clicking Upload Without Company or File Shows Red "Required" Indicators ➕

**File:** `tests/ITEM-5837/TC05-required-validation-on-empty-upload.spec.ts`
**Priority:** High
**Covers:** AC #8-Validation (a, b)

**Steps:**
1. Log in. Navigate to the page. Do not select a company or file.
2. Click the **Upload** button.
   - expect: The **Select Company** input shows a **red outline** border.
   - expect: A red **"Required"** message appears below the Select Company input.
   - expect: The **Upload File** input shows a **red outline** border.
   - expect: A red **"Required"** message appears below the Upload File input.
   - expect: No form submission or API request is triggered.

---

#### 2.2. TC06 — Verify "Required" Indicators Clear When Fields Are Populated ➕

**File:** `tests/ITEM-5837/TC06-required-indicators-clear-on-input.spec.ts`
**Priority:** High
**Covers:** AC #8-Validation (c)

**Steps:**
1. Log in. Navigate to the page. Click Upload to trigger the "Required" state on both fields.
2. Select a company from the lookup.
   - expect: The red outline and "Required" message disappear from the **Select Company** input immediately.
   - expect: The Upload File input still shows its error (unchanged).
3. Select a valid `.xlsx` file via Browse.
   - expect: The red outline and "Required" message disappear from the **Upload File** input.
   - expect: No red indicators remain on either field.

---

#### 2.3. TC07 — Verify Success and Error Alert Banners Use Correct Styling ➕

**File:** `tests/ITEM-5837/TC07-alert-banner-styling.spec.ts`
**Priority:** Medium
**Covers:** AC #9

**Steps:**
1. Log in. Navigate to the page. Trigger a successful upload (happy path).
   - expect: A **green** alert banner appears with success text.
   - expect: The banner styling matches the green alert pattern used elsewhere on the platform.
2. Intercept the import API to return a 500 error. Trigger an upload.
   - expect: A **red** alert banner appears with error text.
   - expect: The banner styling matches the red alert pattern used elsewhere on the platform.
   - expect: No raw stack trace or JSON is visible in the alert.

---

### 3. Upload Tab — Company Selection

#### 3.1. TC08 — Verify Company Lookup Works With Numbers, Special Characters, and Letters ➕

**File:** `tests/ITEM-5837/TC08-company-lookup-special-characters.spec.ts`
**Priority:** High
**Covers:** AC #12

**Steps:**
1. Log in. Navigate to the page.
2. Type a **number** (e.g. `1`) in the Select Company input.
   - expect: A dropdown appears with matching company names containing that number.
3. Clear and type an **underscore** (`_`).
   - expect: A dropdown appears (or an empty state is shown — not an unhandled error).
4. Clear and type an **ampersand** (`&`).
   - expect: Same — dropdown or graceful empty state, no JS error.
5. Clear and type a **hyphen** (`-`).
   - expect: Same — no crash, results or graceful empty state shown.
6. Clear and type a **single letter** (e.g. `N`).
   - expect: A dropdown appears with matching companies.

---

#### 3.2. TC09 — Verify Company Lookup Displays a Maximum of 10 Results ➕

**File:** `tests/ITEM-5837/TC09-company-lookup-max-10-results.spec.ts`
**Priority:** Medium
**Covers:** AC #13

**Steps:**
1. Log in. Navigate to the page. Type a common letter (e.g. `a`) that matches more than 10 companies.
   - expect: The dropdown shows **exactly 10** company name options — no more.
   - expect: No scrollbar or "load more" is triggered beyond the 10-item cap.
   - expect: All 10 items are legible and not truncated in the dropdown.

---

#### 3.3. TC10 — Verify Accepting a Company Shows Name, Change Link, Company ID, and Download Template ➕

**File:** `tests/ITEM-5837/TC10-company-selected-displays-details.spec.ts`
**Priority:** High
**Covers:** AC #14, AC #15 (a, b, c)

**Steps:**
1. Log in. Navigate to the page. Type a company name and select it from the dropdown.
   - expect: The full **company name** is displayed in the selection area.
   - expect: A **"Change"** interactive link is visible to the right of the company name.
   - expect: The **Company ID** (numeric) is displayed below the company name and Change link.
   - expect: A **"Download Template: Excel"** interactive link is displayed below the Company ID.
   - expect: The Excel link is styled as a link (not a button) and is clickable.

---

#### 3.4. TC11 — Verify Download Template Excel Link Triggers File Download With Progress Modal ➕

**File:** `tests/ITEM-5837/TC11-download-template-triggers-download-modal.spec.ts`
**Priority:** High
**Covers:** AC #15c

**Steps:**
1. Log in. Navigate to the page. Select a company (so the Download Template link is visible).
2. Click the **"Download Template: Excel"** link.
   - expect: A **"Downloading File Please wait…"** modal or overlay appears while the download is initiated.
   - expect: A file download event is triggered (`page.waitForEvent('download')`).
   - expect: The downloaded file has an `.xlsx` extension.
   - expect: The modal closes automatically once the download starts.

---

#### 3.5. TC12 — Verify Download Template Link Is Hidden When No Company Is Selected ➕

**File:** `tests/ITEM-5837/TC12-download-template-hidden-without-company.spec.ts`
**Priority:** Medium
**Covers:** AC #16-Upload

**Steps:**
1. Log in. Navigate to the page. Do not select a company.
   - expect: The **"Download Template: Excel"** link is **not visible** in the DOM or is hidden.
2. Select a company.
   - expect: The link becomes **visible**.
3. Click "Change" to deselect the company.
   - expect: The link **hides again**.

---

#### 3.6. TC13 — Verify Company Selection Is Preserved When Switching Between Tabs ➕

**File:** `tests/ITEM-5837/TC13-company-selection-preserved-on-tab-switch.spec.ts`
**Priority:** High
**Covers:** AC #17-Upload

**Steps:**
1. Log in. Navigate to the page. Select a company (note the company name and Company ID displayed).
2. Click the **Search** tab.
   - expect: The Search tab becomes active.
3. Click the **Upload** tab to return.
   - expect: The previously selected **company name** is still displayed.
   - expect: The **Company ID** is still displayed below the company name.
   - expect: The **"Download Template: Excel"** link is still visible.
   - expect: The state is identical to what was shown before navigating away.

---

### 4. Upload Tab — File Selection

#### 4.1. TC14 — Verify Only .xlsx Files Are Accepted via the Browse Button ➕

**File:** `tests/ITEM-5837/TC14-browse-accepts-only-xlsx.spec.ts`
**Priority:** High
**Covers:** AC #16-File

**Steps:**
1. Log in. Navigate to the page. Select a company. Click **Browse** and attach a valid `.xlsx` file.
   - expect: The filename appears in the **read-only Upload File input**.
   - expect: No error message is shown.
   - expect: The filename ends with `.xlsx`.
2. Click Browse again and attach a non-xlsx file (e.g. `.pdf`, `.csv`, `.xls`, `.txt`).
   - expect: A validation error appears indicating the file type is not accepted.
   - expect: The Upload button remains disabled or blocked.

---

#### 4.2. TC15 — Verify Files Exceeding 100 MB Are Rejected With a Validation Error ➕

**File:** `tests/ITEM-5837/TC15-file-exceeds-100mb-rejected.spec.ts`
**Priority:** High
**Covers:** AC #17-File

**Steps:**
1. Log in. Navigate to the page. Select a company. Click Browse and attach a synthetically generated `.xlsx` file larger than **100 MB** (use a `Buffer` approach — no real file needed).
   - expect: A validation error appears indicating the file exceeds the maximum allowed size.
   - expect: The filename does **not** populate the read-only input (or is cleared).
   - expect: The Upload button remains disabled.

---

#### 4.3. TC16 — Verify Selected Filename Displays in the Read-Only Input After File Selection ➕

**File:** `tests/ITEM-5837/TC16-selected-filename-displays-in-input.spec.ts`
**Priority:** High
**Covers:** AC #18

**Steps:**
1. Log in. Navigate to the page. Select a company. Click Browse and attach a valid `.xlsx` file (e.g. `import_test.xlsx`).
   - expect: The **read-only Upload File input** shows the filename `import_test.xlsx`.
   - expect: The input is not editable by typing.
   - expect: The filename is not truncated in the input at standard viewport width (1280×800).

---

#### 4.4. TC17 — Verify Clicking Upload With No File Shows a Validation Error ➕

**File:** `tests/ITEM-5837/TC17-upload-without-file-shows-error.spec.ts`
**Priority:** High
**Covers:** AC #19

**Steps:**
1. Log in. Navigate to the page. Select a company but **do not** attach a file.
2. Click the **Upload** button.
   - expect: A red validation error appears for the **Upload File** input (red outline + "Required" message).
   - expect: No API request is submitted.
   - expect: The Select Company input remains valid (no error shown on company field).

---

### 5. Upload Tab — Submit Flow

#### 5.1. TC18 — Verify Upload Button Is Blocked When Company or File Is Missing ➕

**File:** `tests/ITEM-5837/TC18-upload-button-blocked-without-company-or-file.spec.ts`
**Priority:** High
**Covers:** AC #20

**Steps:**
1. Log in. Navigate to the page with no inputs filled.
   - expect: Upload button is **disabled**.
2. Select a company only (no file).
   - expect: Upload button remains **disabled**.
3. Attach a file only (no company — use "Change" to clear company if needed).
   - expect: Upload button remains **disabled**.
4. Select both a company and a valid `.xlsx` file.
   - expect: Upload button becomes **enabled**.
5. Clear the file by selecting an invalid file or re-triggering Browse and cancelling.
   - expect: Upload button becomes **disabled** again.

---

#### 5.2. TC19 — Verify Upload Submits the File and Company Data to the Import API ➕

**File:** `tests/ITEM-5837/TC19-upload-submits-correct-payload.spec.ts`
**Priority:** High
**Covers:** AC #21

> ⚠️ Confirm the import API endpoint and multipart field names with dev before writing the network interception assertion (see ⚠️2).

**Steps:**
1. Log in. Navigate to the page. Select a company (note Company ID). Attach a valid `.xlsx` file. Set up network interception on the import API.
2. Click the **Upload** button.
   - expect: A **POST** request is made to the import API endpoint.
   - expect: The request payload contains the **Company ID** and the **.xlsx file** (as multipart or equivalent).
   - expect: No stale or incorrect IDs are included in the payload.

---

#### 5.3. TC20 — Verify "Uploading…" Modal With Teal Progress Bar Appears During Upload ➕

**File:** `tests/ITEM-5837/TC20-uploading-progress-modal.spec.ts`
**Priority:** High
**Covers:** AC #22

**Steps:**
1. Log in. Navigate to the page. Select company and file. Intercept the import API to introduce a delay. Click Upload.
   - expect: A modal appears with the text **"Uploading…"** (or equivalent).
   - expect: The modal contains a **teal-coloured progress bar**.
   - expect: The modal is visible and covers or overlays the form during the in-flight request.
2. Release the intercepted API call.
   - expect: The modal **disappears** automatically once the upload completes.
   - expect: No manual close is required.

---

#### 5.4. TC21 — Verify Success Alert Displays and Search Tab Activates After Successful Upload ➕

**File:** `tests/ITEM-5837/TC21-success-alert-and-search-tab-activated.spec.ts`
**Priority:** High
**Covers:** AC #23

**Steps:**
1. Log in. Navigate to the page. Select company and file. Click Upload and wait for completion.
   - expect: A **green** success alert banner is displayed.
   - expect: The page **automatically switches to the Search tab** after the upload completes.
   - expect: The Search tab is now active and the Upload tab is inactive.
   - expect: The success alert is visible on the Search tab.

---

#### 5.5. TC22 — Verify Form Resets to Pristine State After a Successful Upload ➕

**File:** `tests/ITEM-5837/TC22-form-resets-after-successful-upload.spec.ts`
**Priority:** High
**Covers:** AC #24

**Steps:**
1. Log in. Navigate to the page. Select company and file. Click Upload and wait for the success state. Switch back to the Upload tab.
   - expect: The **company** field is cleared and shows the placeholder/empty state.
   - expect: The **Upload File** input is cleared — no filename is shown.
   - expect: The **Download Template** link is **hidden** (no company selected).
   - expect: The Upload button is back to its **disabled** state.
   - expect: No "Required" red indicators are pre-populated.

---

#### 5.6. TC23 — Verify Red Error Alert Displays When Upload Fails ➕

**File:** `tests/ITEM-5837/TC23-error-alert-on-upload-failure.spec.ts`
**Priority:** High
**Covers:** AC #25

**Steps:**
1. Log in. Navigate to the page. Select company and file. Intercept the import API to return a **500** error. Click Upload.
   - expect: A **red** error alert banner appears.
   - expect: The alert contains a user-friendly error message (no raw stack trace or JSON).
   - expect: The form fields (company, file) remain populated — user can retry without re-entering.
   - expect: The Upload button re-enables after the error so the user can retry.

---

#### 5.7. TC24 — Verify Double-Click Upload Submits Only One Request ➕

**File:** `tests/ITEM-5837/TC24-double-click-upload-prevented.spec.ts`
**Priority:** Medium
**Covers:** AC #26

> ⚠️ Confirm whether prevention is via button `disabled` state or debounce before finalising the assertion (see ⚠️8).

**Steps:**
1. Log in. Navigate to the page. Select company and file. Intercept the import API with a delay. Click Upload.
2. While the upload is in progress (modal visible), click the Upload button a second time.
   - expect: Only **one** POST request is made to the import API — no duplicate.
   - expect: The Upload button is disabled or non-interactive during the in-flight request.
   - expect: The progress modal does not reset or flicker.

---

### 6. Search Tab — Filters

#### 6.1. TC25 — Verify Company Dropdown Loads All Companies and Defaults to "All" ➕

**File:** `tests/ITEM-5837/TC25-company-dropdown-loads-with-all-default.spec.ts`
**Priority:** High
**Covers:** AC #27, AC #28

**Steps:**
1. Log in. Navigate to the page. Click the **Search** tab.
   - expect: The company filter dropdown is populated with a list of companies.
   - expect: The default selected value is **"All"**.
   - expect: The dropdown contains more than one item (at least "All" + one company).

---

#### 6.2. TC26 — Verify Search Executes Automatically When the Search Tab Is Selected ➕

**File:** `tests/ITEM-5837/TC26-auto-search-on-tab-select.spec.ts`
**Priority:** High
**Covers:** AC #30

**Steps:**
1. Log in. Navigate to the page (Upload tab is active). Click the **Search** tab.
   - expect: A brief **"Please wait…"** loading indicator appears immediately.
   - expect: The loading indicator disappears and the Search Results table is populated — without clicking any Search button.
   - expect: The results reflect the current filter state (default: "All" companies).

---

#### 6.3. TC27 — Verify Filtering by Company Returns Relevant Results ➕

**File:** `tests/ITEM-5837/TC27-filter-by-company-returns-results.spec.ts`
**Priority:** High
**Covers:** AC #35

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab (auto-search runs).
2. Select a specific company from the company dropdown.
3. Click the **Search** button.
   - expect: The results table updates to show only records matching the selected company.
   - expect: Every row in the **Company** column displays the selected company name (or contains it).
   - expect: Records from other companies are not shown.
4. Select **"All"** and click Search.
   - expect: Results from all companies are shown again.

---

### 7. Search Tab — Results Table

#### 7.1. TC28 — Verify Results Table Displays All Seven Required Columns ➕

**File:** `tests/ITEM-5837/TC28-results-table-columns.spec.ts`
**Priority:** High
**Covers:** AC #31

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab.
   - expect: The Search Results table has exactly **7 column headers** in this order:
     **Company**, **Status**, **Uploaded File**, **Output File**, **Imported By**, **Imported On**, **Completed On**.
   - expect: All column headers are visible without horizontal scrolling at 1280×800.

---

#### 7.2. TC29 — Verify Results Are Sorted by Imported On Descending by Default ➕

**File:** `tests/ITEM-5837/TC29-results-sorted-imported-on-descending.spec.ts`
**Priority:** High
**Covers:** AC #32

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab and wait for results.
   - expect: The **Imported On** column has an active sort indicator (descending arrow or equivalent).
   - expect: The first row shows the **most recent** import record — verify the Imported On date of the first row is greater than or equal to the date in the second row.
   - expect: The sort order is consistently descending for all visible rows on the first page.

---

#### 7.3. TC30 — Verify Clicking Sortable Column Headers Reorders Results ➕

**File:** `tests/ITEM-5837/TC30-sortable-column-headers.spec.ts`
**Priority:** Medium
**Covers:** AC #33

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab and wait for results.
2. Click the **Company** column header.
   - expect: Results reorder alphabetically by Company (ascending or descending) and a sort indicator appears on the Company header.
3. Click **Company** again.
   - expect: Sort direction toggles (ascending ↔ descending).
4. Repeat for **Status**, **Imported By**, **Imported On**, and **Completed On** headers.
   - expect: Each produces a sort with the active indicator on the clicked column.
5. Click the **Uploaded File** or **Output File** header (non-sortable per AC #33).
   - expect: No sort change occurs — these columns are **not sortable**.

---

#### 7.4. TC31 — Verify Results Are Paginated at 25 Per Page ➕

**File:** `tests/ITEM-5837/TC31-results-paginated-25-per-page.spec.ts`
**Priority:** Medium
**Covers:** AC #34

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab with the "All" company filter (maximise result set).
   - expect: The results table shows **at most 25 rows** per page.
   - expect: If more than 25 total records exist, pagination controls are visible (page numbers, next/prev).
2. Navigate to the second page of results.
   - expect: A different set of up to 25 records is shown.
   - expect: The results from the first page are no longer visible.

---

### 8. Search Tab — Status Display

#### 8.1. TC32 — Verify All Six Status Labels Display Correctly ➕

**File:** `tests/ITEM-5837/TC32-status-labels-display-correctly.spec.ts`
**Priority:** High
**Covers:** AC #37

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab. Review the Status column across all result rows.
   - expect: The following **six** status labels appear (for matching records):
     **Pending**, **Running**, **Validation Failed**, **Importing**, **Complete**, **Error**.
   - expect: Each label is displayed as a localised string — no raw enum key or numeric code is shown.
   - expect: Status labels are consistently styled (confirm whether colour-coding is applied per status).

> ⚠️ Requires test data covering all six status values. If not all statuses are present in the test environment, assert the format for those available and document the gap.

---

#### 8.2. TC33 — Verify Completed On Date Shows Only for Complete, Error, and Validation Failed Statuses ➕

**File:** `tests/ITEM-5837/TC33-completed-on-date-conditional-display.spec.ts`
**Priority:** High
**Covers:** AC #38

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab.
2. Find a row with status **Pending** or **Running** or **Importing**.
   - expect: The **Completed On** cell for that row is **empty** (no date displayed).
3. Find a row with status **Complete**, **Error**, or **Validation Failed**.
   - expect: The **Completed On** cell displays a **date value** for that row.
   - expect: The date is formatted consistently with other date columns on the platform.

---

### 9. Search Tab — File Downloads

#### 9.1. TC34 — Verify Download Button Is Shown for the Uploaded Input File When a Filename Exists ➕

**File:** `tests/ITEM-5837/TC34-download-button-uploaded-file.spec.ts`
**Priority:** High
**Covers:** AC #39

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab.
2. Find a row where an **Uploaded File** filename exists.
   - expect: A **download button** (or icon link) is visible in the Uploaded File cell.
   - expect: Clicking the download button triggers a file download (`page.waitForEvent('download')`).
3. Find a row where no Uploaded File exists.
   - expect: No download button is shown in the Uploaded File cell.

---

#### 9.2. TC35 — Verify Download Button Is Shown for the Output File When It Exists ➕

**File:** `tests/ITEM-5837/TC35-download-button-output-file.spec.ts`
**Priority:** High
**Covers:** AC #40

**Steps:**
1. Log in. Navigate to the page. Switch to the Search tab.
2. Find a row (typically a Completed or Error row) where an **Output File** exists.
   - expect: A **download button** is visible in the Output File cell.
   - expect: Clicking it triggers a file download.
3. Find a row where no Output File exists (e.g. Pending or Running status).
   - expect: No download button is shown in the Output File cell — the cell is empty.

---

#### 9.3. TC36 — Verify Uploaded Filenames Over 30 Characters Are Truncated With "…" and Show Full Name in Tooltip ➕

**File:** `tests/ITEM-5837/TC36-long-filename-truncated-with-tooltip.spec.ts`
**Priority:** Medium
**Covers:** AC #41

**Steps:**
1. Log in. Upload a file with a name longer than 30 characters (e.g. `this_is_a_very_long_filename_test_file.xlsx`). Switch to the Search tab and find the row.
2. Observe the **Uploaded File** cell.
   - expect: The displayed filename is **truncated** with `...` appended (max 30 visible characters + `...`).
   - expect: The full filename is **not** shown inline in the cell.
3. Hover over the truncated filename.
   - expect: A **tooltip** appears showing the full, untruncated filename.

---

### 10. Regression

#### 10.1. TC37 — Verify the Page Loads Without Console Errors After the Vue 3 Migration ➕

**File:** `tests/ITEM-5837/TC37-no-console-errors.spec.ts`
**Priority:** High
**Covers:** Assumption ("No new console errors or warnings are introduced")

**Steps:**
1. Attach a `page.on('console', ...)` listener. Log in. Navigate to the page.
   - expect: Page loads successfully (HTTP 200).
   - expect: Upload and Search tabs render correctly.
2. Perform a full happy-path Upload flow: select company → attach file → Upload → observe success alert → switch to Search tab → filter by company → click Search.
   - expect: **No `console.error` messages** are captured throughout.
   - expect: **No Vue `[warn]` messages** are emitted.
   - expect: **No unhandled promise rejections** appear.

---

## Coverage Summary

| TC   | Description                                                                                               | Type | Priority | AC Ref              |
|------|-----------------------------------------------------------------------------------------------------------|------|----------|---------------------|
| TC01 | Verify "Bulk Records Import" header and both tabs display on page load                                    | ➕   | High     | AC #1, #2           |
| TC02 | Verify tab icons and tooltips are correct for Upload and Search tabs                                      | ➕   | Medium   | AC #4, #7           |
| TC03 | Verify button styles match spec (teal secondary for Upload/Search, primary for Browse)                    | ➕   | Medium   | AC #5               |
| TC04 | Verify panel background styling is preserved on filter and form areas                                     | ➕   | Medium   | AC #6               |
| TC05 | Verify clicking Upload without company or file shows red "Required" indicators                            | ➕   | High     | AC #8-Validation    |
| TC06 | Verify "Required" indicators clear when fields are populated                                              | ➕   | High     | AC #8-Validation (c)|
| TC07 | Verify success and error alert banners use correct styling                                                | ➕   | Medium   | AC #9               |
| TC08 | Verify company lookup works with numbers, special characters, and letters                                 | ➕   | High     | AC #12              |
| TC09 | Verify company lookup displays a maximum of 10 results                                                    | ➕   | Medium   | AC #13              |
| TC10 | Verify accepting a company shows name, Change link, Company ID, and Download Template                     | ➕   | High     | AC #14, #15 (a,b,c) |
| TC11 | Verify Download Template Excel link triggers file download with progress modal                            | ➕   | High     | AC #15c             |
| TC12 | Verify Download Template link is hidden when no company is selected                                       | ➕   | Medium   | AC #16-Upload       |
| TC13 | Verify company selection is preserved when switching between tabs                                         | ➕   | High     | AC #17-Upload       |
| TC14 | Verify only .xlsx files are accepted via the Browse button                                                | ➕   | High     | AC #16-File         |
| TC15 | Verify files exceeding 100 MB are rejected with a validation error                                       | ➕   | High     | AC #17-File         |
| TC16 | Verify selected filename displays in the read-only input after file selection                             | ➕   | High     | AC #18              |
| TC17 | Verify clicking Upload with no file selected shows a validation error                                     | ➕   | High     | AC #19              |
| TC18 | Verify Upload button is blocked when company or file is missing                                           | ➕   | High     | AC #20              |
| TC19 | Verify Upload submits the file and company data to the import API                                         | ➕   | High     | AC #21              |
| TC20 | Verify "Uploading…" modal with teal progress bar appears during upload                                    | ➕   | High     | AC #22              |
| TC21 | Verify success alert displays and Search tab activates after successful upload                            | ➕   | High     | AC #23              |
| TC22 | Verify form resets to pristine state after a successful upload                                            | ➕   | High     | AC #24              |
| TC23 | Verify red error alert displays when upload fails                                                         | ➕   | High     | AC #25              |
| TC24 | Verify double-click Upload submits only one request                                                       | ➕   | Medium   | AC #26              |
| TC25 | Verify company dropdown loads all companies and defaults to "All"                                         | ➕   | High     | AC #27, #28         |
| TC26 | Verify search executes automatically when the Search tab is selected                                      | ➕   | High     | AC #30              |
| TC27 | Verify filtering by company returns only matching results                                                 | ➕   | High     | AC #35              |
| TC28 | Verify results table displays all seven required columns                                                  | ➕   | High     | AC #31              |
| TC29 | Verify results are sorted by Imported On descending by default                                            | ➕   | High     | AC #32              |
| TC30 | Verify clicking sortable column headers reorders results                                                  | ➕   | Medium   | AC #33              |
| TC31 | Verify results are paginated at 25 per page                                                               | ➕   | Medium   | AC #34              |
| TC32 | Verify all six status labels display correctly                                                            | ➕   | High     | AC #37              |
| TC33 | Verify Completed On date shows only for Complete, Error, and Validation Failed statuses                   | ➕   | High     | AC #38              |
| TC34 | Verify download button is shown for the uploaded input file when a filename exists                        | ➕   | High     | AC #39              |
| TC35 | Verify download button is shown for the output file when it exists                                        | ➕   | High     | AC #40              |
| TC36 | Verify uploaded filenames over 30 characters are truncated with "…" and show full name in tooltip         | ➕   | Medium   | AC #41              |
| TC37 | Verify the page loads without console errors after the Vue 3 migration                                    | ➕   | High     | Regression          |

**Total: 37 test cases — all ➕ New**
**Priority split:** 24 High · 10 Medium · 3 Low (TC04, TC12 manual-only; see below)

---

## Automation Recommendations

### Automate — High Confidence

| TC   | Automation approach                                                                                                                                   | Order |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| TC01 | Assert heading text, assert two tabs visible, assert Upload tab has active class                                                                      | 1 — smoke |
| TC05 | Click Upload with empty form, assert red border class + "Required" text on both inputs                                                                | 1 — smoke |
| TC06 | Trigger required state, fill fields one by one, assert error disappears per field                                                                     | 2 — validation |
| TC14 | `setInputFiles()` with valid `.xlsx` → assert filename in read-only input; repeat with `.pdf` → assert error                                          | 2 — file |
| TC15 | `setInputFiles()` with a `Buffer` > 100 MB (synthesised) → assert size-exceeded error                                                                | 2 — file |
| TC16 | `setInputFiles()` → assert read-only input value matches filename                                                                                     | 2 — file |
| TC17 | Click Upload with company but no file → assert Upload File "Required" error; confirm company field has no error                                       | 2 — validation |
| TC18 | Step through company-only, file-only, both states → assert `toBeDisabled()` / `toBeEnabled()`                                                        | 2 — state |
| TC08 | Type `1`, `_`, `&`, `-`, single letter → assert dropdown appears or empty state shown, no JS errors                                                  | 3 — lookup |
| TC09 | Type common letter → count dropdown items → assert count ≤ 10                                                                                        | 3 — lookup |
| TC10 | Select company → assert company name, "Change" link, Company ID, and Download Template link are all visible                                           | 3 — company |
| TC12 | On load: assert template link hidden; select company: assert visible; click Change: assert hidden                                                     | 3 — company |
| TC13 | Select company → switch tabs → return → assert company name, ID, and template link still present                                                     | 3 — company |
| TC19 | `page.route()` intercept → capture POST body → assert Company ID and file present                                                                    | 4 — API |
| TC20 | `page.route()` with delay → assert modal visible with "Uploading…" text and teal progress bar class → release → assert modal gone                    | 4 — modal |
| TC21 | Complete upload → assert green alert visible → assert Search tab is active (has active CSS class)                                                     | 4 — flow |
| TC22 | Complete upload → switch to Upload tab → assert all inputs empty, button disabled, template link hidden                                              | 4 — flow |
| TC23 | `page.route()` returning 500 → click Upload → assert red alert, fields remain populated, button re-enables                                           | 4 — error |
| TC24 | `page.route()` with delay → click Upload → click again → assert `waitForRequest` count === 1                                                         | 4 — guard |
| TC25 | Click Search tab → assert company dropdown populated → assert default value is "All"                                                                  | 4 — search |
| TC26 | Click Search tab → assert loading indicator appears then disappears → assert table has rows                                                           | 4 — search |
| TC27 | Select company → click Search → assert each row Company cell contains selected company name                                                           | 4 — search |
| TC28 | Assert exactly 7 `<th>` elements with correct text in the results table                                                                               | 4 — table |
| TC29 | Read first two rows' Imported On values → assert first ≥ second (descending)                                                                         | 4 — table |
| TC30 | Click Company header → assert sort indicator; click again → assert direction toggles; repeat for all 5 sortable headers                               | 4 — table |
| TC31 | Count rows on first page → assert ≤ 25; click next page → assert different rows shown                                                                | 4 — table |
| TC33 | Find Pending/Running row → assert Completed On empty; find Complete row → assert Completed On has date                                                | 4 — status |
| TC34 | Find row with Uploaded File → assert download button visible, click → `waitForEvent('download')`                                                     | 4 — download |
| TC35 | Find row with Output File → assert download button visible, click → `waitForEvent('download')`                                                       | 4 — download |
| TC36 | Upload file with 35-char name → find row → assert cell shows `...` truncation → hover → assert tooltip with full name                                | 4 — display |
| TC37 | Attach `page.on('console')` listener → perform full happy path → assert zero error/warn events                                                       | 5 — regression |

### Automate — With Caveats

| TC   | Caveat                                                                                                                  |
|------|-------------------------------------------------------------------------------------------------------------------------|
| TC02 | Confirm exact Remixicon class names for Upload/Search tab icons and the exact tooltip strings with dev before asserting |
| TC03 | CSS class assertions only — actual teal colour rendering requires visual baseline comparison                             |
| TC07 | Confirm exact alert text strings from the Vue component with dev before asserting `toHaveText()`                        |
| TC11 | Confirm download API endpoint and file MIME type; use `page.waitForEvent('download')` pattern                           |
| TC32 | Requires test data covering all 6 statuses — tag `@requires-test-data` and document which statuses are available in CI |

### Manual Only — Do Not Automate

| TC   | Reason                                                                                                                       |
|------|------------------------------------------------------------------------------------------------------------------------------|
| TC04 | Panel background colour and texture require visual baseline comparison; CSS class presence is checkable but not sufficient   |
| TC03 (colour) | Rendered teal colour verification is a manual visual check; class assertions cover the automatable portion       |

### Summary

| Category                   | TCs                                                                 | Count |
|----------------------------|---------------------------------------------------------------------|-------|
| Automate — high confidence | TC01, TC05–TC29, TC31, TC33–TC37                                    | 31    |
| Automate — with caveats    | TC02, TC03, TC07, TC11, TC32                                        | 5     |
| Manual only                | TC04 (panel background colour)                                      | 1     |
