# FinPulse — Vue 3 Expense & Income Tracker

A modern, portfolio-ready **Personal Expense & Income Tracker** built with **Vue 3 (Composition API)**, **Pinia**, **Vue Router**, **Tailwind CSS v4**, **Chart.js**, and **SheetJS (XLSX)** — powered by a **100% free, zero-credit-card Browser IndexedDB Database Engine** that works permanently online on **Netlify / GitHub Pages / Vercel** without backend cold starts or database expiration.

## ✨ Key Features

- **Interactive Analytics Dashboard**:
  - Real-time KPI summary cards (**Total Balance**, **Total Income**, **Total Expenses**, and **Savings Rate %**).
  - Editable **Monthly Spending Budget Goal** with dynamic progress indicator.
  - **Financial Overview Doughnut Chart**, **Last 30 Days Expenses Bar Chart**, and **Last 60 Days Income Streams Doughnut Chart**.
- **Income & Expense Management**:
  - Add new income sources and expense categories with a custom **Category Emoji Picker**.
  - Interactive **Line Chart** for Expense Overview and **Bar Chart** for Income Overview.
  - Instant search filtering and deletion confirmation modals.
- **One-Click Excel (`.xlsx`) & JSON Database Export/Import**:
  - Download formatted Excel reports (`FinPulse_Income_Report.xlsx`, `FinPulse_Expense_Report.xlsx`, or a multi-sheet full report).
  - Full JSON database backup & restore directly from the top navigation bar.
- **Portfolio Demo Ready**:
  - Pre-seeded with realistic 60-day financial records so portfolio visitors and recruiters immediately see live charts and transactions.
  - Includes full Authentication flows (Sign In, Sign Up with local Base64 profile photo upload, One-Click Demo Login, and Reset Demo Data).

## 🚀 Run Locally

```bash
npm install
npm run dev
```

## 🌐 Free Deployment (Netlify / Vercel / Cloudflare Pages)

This repository includes a pre-configured `netlify.toml` with SPA routing rules:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
