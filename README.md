# Financial Independence Flowchart (Digitized)

A production-grade, interactive digitization of the famous r/personalfinance "Prime Directive" flowchart (v4.3). Built with Next.js App Router and Feature-Sliced Design (FSD).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8)

## 🚀 Features

- **Interactive Flowchart**: A zoomable, pannable, and interactive graph implementation using [React Flow](https://reactflow.dev/).
- **Jargon Buster**: Click on complex financial terms (e.g., "IRA", "HYSA") within nodes to see instant definitions without leaving the flow.
- **"Real Numbers" Simulator**: Input your monthly income and expenses to see exactly how your money flows through the steps (Logic In-Progress).
- **Responsive Design**: Fully optimized for mobile and desktop usage.
- **SEO Optimized**: Includes JSON-LD schemas for `DefinedTermSet` (Glossary) and `FAQPage`.

## 🏗️ Architecture

This project strictly adheres to **Feature-Sliced Design (FSD)** methodology for scalability and maintainability.

- **Layers**:
  - `app/`: Next.js App Router setup and specific page layouts.
  - `pages/`: Compositional layer for pages.
  - `widgets/`: Self-contained UI blocks (`FlowChart`, `DefinitionModal`).
  - `features/`: User interactions (`chart-navigation`, `flow-simulation`, `jargon-buster`).
  - `entities/`: Business domain models (`flow-node`, `wallet`, `glossary-term`).
  - `shared/`: Reusable UI kit and libraries.

See [ARCHITECTURE.md](./src/ARCHITECTURE.md) for a deep dive into the slice boundaries.

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/mels0n/Financial-Independence-Flow-Chart.git
   cd Financial-Independence-Flow-Chart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **build for production**
   ```bash
   npm run build
   ```

## 👏 Attribution

The logic and structure of this flowchart are based on the **"Prime Directive" Flowchart Version 4.3** created by **u/happyasianpanda** for the r/personalfinance and r/financialindependence communities.

Original Source: [r/personalfinance Wiki](https://www.reddit.com/r/personalfinance/wiki/commontopics)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
