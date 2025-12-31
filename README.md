# Financial Quest Flow Chart

An interactive, gamified guide to Financial Independence. This application helps users navigate through personal finance priorities, from budgeting and emergency funds to maximizing tax-advantaged accounts and investment strategies.

## Overview

The **Financial Quest Flow Chart** takes the popular "Prime Directive" flow chart logic and turns it into an interactive wizard. Users input their financial details (income, expenses, debts) and the application guides them through the optimal order of operations for allocating their money.

## Features

- **Interactive Wizard**: Step-by-step flow guiding you through:
  - Income & Budgeting
  - Emergency Fund (Starter & Full)
  - Employer Match (401k/403b)
  - high-interest Debt Payoff
  - HSA & IRA Contributions
  - Maxing out 401k
  - Education & Goals
  - Taxable Brokerage Accounts
- **Automated Tax Year Logic**: Dynamically switches between "Official" (IRS-confirmed) and "Projected" limits based on the current date, ensuring longevity without manual code updates.
- **Visual Feedback**:
  - **Quest Bar**: Tracks your overall progress through the financial stages.
  - **Action Board**: Generates a customized "to-do" list based on your inputs.
  - **Budget Tracking**: Real-time visualization of your remaining budget as you allocate funds.
- **Privacy Focused**: All data is stored locally in your browser (Client-Side). No financial data is sent to a server.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utils**: `clsx`, `cva` (Class Variance Authority)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/financial-independence-flow-chart.git
    cd financial-independence-flow-chart
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Feature Sliced Design (FSD)
The project strictly adheres to [Feature Sliced Design](https://feature-sliced.design/) to ensure scalability and maintainability.

- `app`: App-wide settings, styles, and providers.
- `widgets`: Compositional units that glue features together (e.g., `QuestFlow`).
- `features`: Business logic slices (e.g., `BudgetStep`, `IraStep`). Each slice contains its own `ui`, `model`, and `api`.
- `entities`: Business domains (e.g., `financial` store, `taxYearConfig`).
- `shared`: Reusable infrastructure (e.g., `aeo` generator, UI kit).

### AEO & GEO Optimization (The "Semantic Twin")
This project implements **Answer Engine Optimization (AEO)** to maximize visibility in AI search (ChatGPT, Perplexity, Gemini).
- **Semantic Twins**: Key features have dedicated "How-To" pages (`/guide/*`, `/docs`) mirroring the interactive logic with valid HTML for crawlers.
- **Type-Safe JSON-LD**: All pages generate valid `SoftwareApplication` and `FAQPage` schemas via `src/shared/lib/aeo.ts`.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

## Credits

- Based on the [Personal Finance Flowchart](https://imgur.com/lSoyGJE) created by **u/happyasianpanda** on [r/personalfinance](https://www.reddit.com/r/personalfinance/).
- Inspired by the [Prime Directive](https://www.reddit.com/r/personalfinance/wiki/commontopics) from r/personalfinance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
