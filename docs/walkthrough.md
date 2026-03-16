# Netlify Deployment & Feature Enhancements Walkthrough

I've implemented the necessary configurations to resolve the deployment issues you encountered on Netlify and added the requested CSV export functionality.

## Changes Made

### Configuration
I added a `netlify.toml` file to the root of your project to provide instructions on how to build and serve your Angular application.
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/cat-explorer/browser`
- **Local API Proxy**: Configured a redirect for `/api/*` to your AWS Lambda endpoint.

### Enhancements & Bug Fixes
- **Robust API Proxy (Node.js Serverless Function)**: Replaced standard Netlify redirects and Edge Functions with a dedicated **Node.js Serverless Function** proxy. 
    - **The Core Issue**: The AWS API Gateway backend rigidly requires the exact casing `Content-Type: application/json`. Standard Edge Functions and HTTP/2 normalization force headers to lowercase (`content-type`), which caused AWS Lambda to crash and return `502 Bad Gateway` on POST/PUT requests.
    - **The Fix**: The new Node.js Serverless Function uses the native `https` module to manually construct the request and strictly preserves the HTTP/1.1 title-cased headers, fully resolving the 502 errors for "Save" and "Create" operations.
- **Strict Form Validations**: Enhanced the `CatFormComponent` with robust user input validations:
    - **Name**: Requires 2-50 characters. Uses Regex (`/^[a-zA-Z\s]*$/`) to ensure only alphabetical characters and spaces are allowed.
    - **Age**: Requires a number between 0 and 30. Uses Regex (`/^(0|[1-9]\d*)$/`) to prevent decimals, negative numbers, or non-numeric characters.
    - **Description**: Requires 1-500 characters.
    - **UI Feedback**: Added specific error messages to `mat-input` fields for each validation state (e.g. "Name can only contain letters and spaces"). 
- **CSV Export**: Replaced manual download logic with the robust `file-saver` library and later refined it with a manual anchor-based method to ensure correct filename handling on Mac/Safari. The exported data now includes **Name**, **Age**, and **Description** (removing the internal ID column for a cleaner look).


## Documentation Assets
I've captured and organized visual assets for the project documentation:
- **Dashboard**: ![Dashboard](assets/dashboard.png)
- **Explorer**: ![Explorer](assets/explorer.png)
- **Details**: ![Details](assets/details.png)
- **Functional Walkthrough**: ![Walkthrough](assets/walkthrough.webp)



## Verification Results
- **CSV Export**: Verified that the "Export CSV" button is correctly rendered, enabled, and functional in the browser environment.
- **Service Headers**: Confirmed that `HttpHeaders` are correctly applied to `create` and `update` requests.

### GitHub Repository
All changes, including the `netlify.toml`, `.env.example`, documentation assets, and the updated `README.md`, have been pushed to the main branch.

> [!TIP]
> Your `README.md` now features a professional showcase section with these assets, making it ready for production presentation!
