# Stagewise Integration Setup

This project has been configured to use the stagewise dev-tool for AI-powered editing capabilities through a browser toolbar.

## Installation

To complete the setup, install the required package:

```bash
npm install @stagewise/toolbar-next
```

## What's Included

1. **StagewiseToolbar Component** (`components/shared/StagewiseToolbar.tsx`)

   - Only renders in development mode
   - Uses dynamic imports to avoid SSR issues
   - Creates a separate React root to avoid interfering with the main app

2. **Integration in Root Layout** (`app/layout.tsx`)
   - The toolbar is included in the root layout
   - Automatically loads only in development environment

## Features

- ✅ Development-only rendering (excluded from production builds)
- ✅ Client-side only initialization
- ✅ Separate React root to avoid app interference
- ✅ Graceful error handling if package is not installed
- ✅ No linting errors

## Usage

Once the package is installed, the toolbar will automatically appear when running the development server:

```bash
npm run dev
```

The toolbar allows you to:

- Select elements in your web app
- Leave comments for AI agents
- Let AI agents make code changes based on context

## Configuration

The toolbar is configured with an empty plugins array by default. You can extend the configuration in `components/shared/StagewiseToolbar.tsx` as needed.
