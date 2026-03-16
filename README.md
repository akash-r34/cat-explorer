# CatExplorer 🐾

A cinematic, high-fidelity cat management dashboard built with **Angular 21**, **Signals**, and **Zoneless change detection**. This application connects to a high-performance AWS Lambda backend to provide a seamless interface for managing feline diagnostic registries.

![App Preview](docs/assets/dashboard.png)

## 🚀 Key Features

- **Apple-Style Clean Aesthetic**: Pristine light-themed UI with high-contrast Inter typography and vibrant hot-pink accents.
- **Full CRUD Operations**: Create, read, update, and delete cat records with real-time feedback.
- **Real-time Live Search**: Filter through your cat registry instantly using Angular Signals and RxJS.
- **Interactive Dashboard**: Visualize your cat collection with dynamic charts and key performance indicators.
- **Cinematic Transitions**: Ultra-snappy hover effects and smooth layout transitions utilizing premium cubic-bezier easing.
- **Global Error Handling**: Integrated `MatSnackBar` notifications and confirmation dialogs for destructive actions.

## 📸 App Showcase

### Dashboard & Analytics
The intelligent dashboard provides an instant overview of your feline diagnostics.
![Dashboard](docs/assets/dashboard.png)

### Cat Registry
Manage your entire collection with our high-performance explorer interface.
![Explorer](docs/assets/explorer.png)

### In-Depth Details
View comprehensive profiles and diagnostic history for every cat.
![Details](docs/assets/details.png)


## 🚀 Live Demo
Experience the application live here:
**[https://cat-explorer-4u.netlify.app/](https://cat-explorer-4u.netlify.app/)**

## 🌐 Deployment

This application is optimized for deployment on **Netlify**.

### Build Configuration
A `netlify.toml` file is included in the project root to handle:
- Automated builds via `npm run build`
- SPA routing rules (redirecting all paths to `index.html`)

### API Proxy (Serverless Function)
The application includes a custom **Netlify Node.js Serverless Function** (`netlify/functions/api-proxy.ts`) to handle API requests securely and robustly:
- Proxies `/api/*` requests to the AWS Lambda backend (`https://gps6cdg7h9.execute-api.eu-central-1.amazonaws.com/prod`).
- **Header Casing Preservation**: The backend explicitly requires title-cased headers (e.g., `Content-Type: application/json`). Standard Netlify redirects and Edge Functions use HTTP/2 which normalizes headers to lowercase, causing the backend to throw a 502 Bad Gateway. This custom Serverless Function uses the native Node `https` module to explicitly preserve the exact header casing required by AWS API Gateway, ensuring flawless `POST` and `PUT` operations.

To deploy, simply connect your GitHub repository to Netlify and it will handle the rest!

## 🏗️ Technical Architecture


This project strictly adheres to the latest Angular best practices:

- **Framework**: Angular 21.2.0 (latest stable)
- **Architecture**: 100% Standalone Components (No NgModules)
- **Reactive State**: Pure Angular Signals for state management
- **Performance**: Zoneless change detection enabled via `provideZonelessChangeDetection()`
- **Type Safety**: Strict TypeScript mode with zero usage of `any`
- **UI System**: Angular Material 3 with custom design tokens
- **Proxy Layer**: Integrated local proxy to handle CORS and case-sensitive header injections for the Lambda backend

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v22+ (LTS recommended)
- **npm**: v11+
- **Angular CLI**: v19+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[USER]/cat-api-web-app.git
   cd cat-api-web-app/cat-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Backend Proxy Note

The development server is configured to proxy API requests to bypass CORS and inject the required case-sensitive `Content-Type` headers for the AWS Lambda backend. This configuration is located in `src/proxy.conf.json`.

## 🧪 Documentation & Walkthrough

A detailed implementation walkthrough, including verification recordings and screenshots, can be found in the [walkthrough.md](docs/walkthrough.md).

## 📄 License

This project is licensed under the MIT License.

