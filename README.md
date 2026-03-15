# CatExplorer 🐾

A cinematic, high-fidelity cat management dashboard built with **Angular 21**, **Signals**, and **Zoneless change detection**. This application connects to a high-performance AWS Lambda backend to provide a seamless interface for managing feline diagnostic registries.

![App Preview](file:///Users/akashr/.gemini/antigravity/brain/6d888b4c-804d-4988-9f70-c4d3ad259eea/apple_aesthetic_check_1773568840961.png)

## 🚀 Key Features

- **Apple-Style Clean Aesthetic**: Pristine light-themed UI with high-contrast Inter typography and vibrant hot-pink accents.
- **Full CRUD Operations**: Create, read, update, and delete cat records with real-time feedback.
- **Real-time Live Search**: Filter through your cat registry instantly using Angular Signals and RxJS.
- **Cinematic Transitions**: Ultra-snappy hover effects and smooth layout transitions utilizing premium cubic-bezier easing.
- **Global Error Handling**: Integrated `MatSnackBar` notifications and confirmation dialogs for destructive actions.

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

A detailed implementation walkthrough, including verification recordings and screenshots, can be found in the [walkthrough.md](file:///Users/akashr/.gemini/antigravity/brain/6d888b4c-804d-4988-9f70-c4d3ad259eea/walkthrough.md).

## 📄 License

This project is licensed under the MIT License.
