# Scraper Fix Implementation Plan

The current scrapers for DB Insurance, Meritz Fire, Hanwha Non-Life, and Hanwha Life are failing due to UI changes on the respective insurance company websites. This plan outlines the necessary updates for each scraper.

## 1. DB Insurance (`db_insurance_all.py`)
- **Issue**: The scraper expects iframes and uses an obsolete frame-hooking method.
- **Fix**: 
    - Remove frame-related logic.
    - Implement a 4-step selection process:
        - Step 1: Select Broad Category -> Channel -> Sub-category.
        - Step 2: Select Product from list.
        - Step 3: Select Sales Period.
        - Step 4: Click download buttons (`step4Btn1`, `step4Btn2`, `step4Btn3`).
    - Update the download URL pattern.

## 2. Meritz Fire (`meritz_fire_all.py`)
- **Issue**: The direct disclosure URL is broken. The '장기보험' tab is replaced by individual categories.
- **Fix**:
    - Start navigation from `https://www.meritzfire.com/disclosure.do`.
    - Navigate to '상품공시' > '상품목록'.
    - Use '분류형' (Category Type) view.
    - Iterate through relevant long-term categories in `.cate_wrap`.
    - Perform 3-step interaction (Category -> Product -> Table) to expose download rows.

## 3. Hanwha Non-Life (`hanwha_nonlife_all.py`)
- **Issue**: Existing selectors for steps and download buttons are outdated.
- **Fix**:
    - Update selector for steps to `.box_step_sel fieldset ul li a`.
    - Update download button selector to `a.btn_sub1.ic1`.
    - Specifically target '약관' (Policy) using `a.btn_sub1.ic1[title*="약관확인"]`.

## 4. Hanwha Life (`hanwha_life_all.py`)
- **Issue**: Categories and search button selectors are incorrect.
- **Fix**:
    - Update search button selector to `#btnSearch`.
    - Update category selector to `.ck-search1`.
    - Update product table row selector to `table tbody tr`.

## Validation
- Run each script individually and verify that PDFs are correctly saved to the `downloads/` directory.
- Verify that the metadata (JSON files) are correctly populated.
