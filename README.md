# AdGameSim: Online Advertising Competition Simulator
> **Game-Theoretic Analysis of Online Advertising Competition**  
> Department of Computer Science & Engineering • V Semester Course Project

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Project Overview

**AdGameSim** is an interactive mathematical simulation web application that demonstrates how classical game-theoretic models govern strategic decision-making in digital advertising auctions, per-click pricing wars, and search keyword audience targeting.

Built as an academic research and coursework project based on our presentation *"Game-Theoretic Analysis of Online Advertising Competition"*, AdGameSim bridges theoretical microeconomics and modern digital ad networks (e.g., Google Ads, Microsoft Advertising, Meta, Amazon Ads).

---

## 2. Problem Statement

In contemporary digital advertising auctions, competing brands and ad exchanges rarely make decisions in isolation. Instead, every choice—how much to bid on brand keywords, what CPC price to charge advertisers, or which audience segment to target—is intensely interdependent:

1. **The Budget Escalation Trap:** Rational advertisers frequently engage in defensive bidding wars on branded queries, inflating platform revenue while depressing net corporate margins.
2. **Homogeneous Price Undercutting:** Ad networks serving undifferentiated traffic face cutthroat price competition, eroding profit margins down to basic infrastructure costs.
3. **Audience Clustering & Congestion:** Ad campaigns cluster around the same broad, high-volume keywords, ignoring long-tail niche queries and causing audience mismatch.

---

## 3. Project Objectives

- **Empirical Mathematical Simulation:** Replace static textbook payoff tables with interactive mathematical engines that compute best responses, Nash Equilibria, and Pareto frontiers in real-time.
- **Microeconomic Rigor:** Faithfully implement governing formulas, demand allocation functions, and boundary conditions without hardcoding or fabricating outputs.
- **SaaS Analytics Interface:** Deliver a clean dashboard with responsive charts, interactive sliders, normal-form matrix navigation, and collapsible theoretical derivations.
- **Educational Bridge:** Present complex concepts in intuitive notation suitable for undergraduate computer science students and academic evaluators.

---

## 4. Implemented Game Theory Models

### Model 1 — Prisoner's Dilemma: The Advertising Budget War
Models strategic ad budget allocation between two duopolists (e.g., Nike vs. Adidas) competing over fixed market demand.

- **Action Set:** $S_i \in \{\text{Escalate Spending}, \text{Restrain Spending}\}$
- **Payoff Matrix ($M USD Annual Net Profit):**
  | Brand A \ Brand B | B: Escalate | B: Restrain |
  | :--- | :---: | :---: |
  | **A: Escalate** | **($2M, $2M)** | ($6M, $0M) |
  | **A: Restrain** | ($0M, $6M) | ($4M, $4M) |
- **Key Insights:**
  - $\text{Escalate}$ strictly dominates $\text{Restrain}$ for both brands ($2 > 0$ and $6 > 4$).
  - $(\text{Escalate}, \text{Escalate})$ is the unique Nash Equilibrium yielding $\$4\text{M}$ combined profit.
  - $(\text{Restrain}, \text{Restrain})$ is Pareto Optimal yielding $\$8\text{M}$ combined profit.
  - Demonstrates why rational brands overspend: unilateral restraint leads to complete market abandonment ($\$0\text{M}$), while aggressive bids cancel each other out, transferring $\$4\text{M}$ of advertiser surplus directly to ad platforms.

---

### Model 2 — Bertrand Competition: The CPC Price War
Simulates two ad networks or supply-side platforms (SSPs) competing on Cost-Per-Click (CPC) pricing for identical ad traffic.

- **Baseline Parameters:**
  - Initial CPC: $\$2.00$
  - Marginal Cost ($c$): $\$1.00$ / click
  - Total Advertiser Demand ($Q_{\text{total}}$): $1,000$ clicks
  - Maximum Willingness to Pay ($V$): $\$5.00$ / click
- **Demand Allocation Rule:**
  $$Q_A(P_A, P_B) = \begin{cases} Q_{\text{total}} & \text{if } P_A < P_B \le V \\ \frac{1}{2}Q_{\text{total}} & \text{if } P_A = P_B \le V \\ 0 & \text{if } P_A > P_B \end{cases}$$
- **Profit Objective:**
  $$\Pi_i = (P_i - c) \cdot Q_i$$
- **Iterative Undercutting Engine:**
  - Simulates dynamic rounds where the losing firm reduces its CPC by a configurable step $\epsilon$ (default $\$0.10$).
  - System converges to the **Bertrand Nash Equilibrium** ($P_A^* = P_B^* = c = \$1.00$), where economic profits collapse to $\$0.00$.

---

### Model 3 — Hotelling's Linear City Model: Keyword Positioning
Adapts Harold Hotelling's (1929) continuous spatial model to digital keyword intent and audience preference distribution.

- **Market Geometry:** Continuous interval $[0, 1]$ representing consumer intent (e.g., $0$ = Budget / Developer, $1$ = Enterprise / Luxury).
- **Consumer Distance (Mismatch Cost):**
  $$d_A(x) = |x - a|, \quad d_B(x) = |x - b|$$
- **Indifference Cutoff Point ($a < b$):**
  $$\hat{x} = \frac{a + b}{2}$$
- **Market Shares:**
  $$S_A = \frac{a + b}{2}, \quad S_B = 1 - \frac{a + b}{2}$$
- **Algorithmic Best-Response Engine:**
  - Evaluates candidate positions across the unit interval to locate the share-maximizing position.
  - Demonstrates **Hotelling's Law of Minimum Differentiation**: firms cluster at the median user ($a^* = b^* = 0.50$).
  - Analyzes the social welfare gap: center clustering causes average user mismatch distance to double from $0.125$ (social optimum at $0.25$ and $0.75$) to $0.250$ at the Nash equilibrium.
  - Explains how quadratic transport costs (d'Aspremont et al., 1979) and price competition motivate maximum differentiation (niche long-tail keywords).

---

## 5. Technology Stack

- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS (Navy / Slate / Restrained Amber palette)
- **Data Visualizations:** Recharts (SVG Responsive Charts & Pie Distributions)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Architecture:** 100% Client-side reactive math; zero backend or external API dependencies.

---

## 6. Installation & How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (version 9.0 or higher)

### Steps

1. **Clone or navigate to the repository:**
   ```bash
   cd "ProjecT"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Run mathematical verification test suite:**
   ```bash
   npm test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 7. Project Folder Structure

```
├── index.html                   # HTML entry point with Inter & JetBrains Mono typography
├── package.json                 # Project dependencies and script declarations
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS design system and custom tokens
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── test-verification.mjs        # Mathematical validation test script
├── src/
│   ├── App.tsx                  # Main application container & view router
│   ├── main.tsx                 # React DOM mount point
│   ├── index.css                # Global stylesheet & scrollbar styles
│   │
│   ├── components/              # Modular, reusable UI components
│   │   ├── Sidebar.tsx          # Navigation sidebar with responsive mobile drawer
│   │   ├── Header.tsx           # Sticky top navigation bar
│   │   ├── StatCard.tsx         # Analytical KPI metric cards
│   │   ├── ChartCard.tsx        # Recharts container wrapper
│   │   ├── PayoffMatrix.tsx     # Interactive 2x2 normal-form grid for Model 1
│   │   ├── SliderControl.tsx    # Slider with precision numeric inputs
│   │   ├── MathExplanation.tsx  # Collapsible "Understand the Mathematics" section
│   │   └── GlobalResultsPanel.tsx # Standardized game-theoretic state summary
│   │
│   ├── models/                  # Pure mathematical game theory engines
│   │   ├── prisonersDilemma.ts  # Matrix lookup, best response & Nash detection
│   │   ├── bertrand.ts          # Price allocation, profit & repeated undercutting
│   │   └── hotelling.ts         # User sampling, cutoff point & best-response search
│   │
│   ├── pages/                   # Application views
│   │   ├── Overview.tsx         # Executive dashboard & Nash explanation
│   │   ├── PrisonersDilemma.tsx # Model 1: Advertising Budget War simulation
│   │   ├── BertrandCompetition.tsx # Model 2: CPC Price War simulation
│   │   ├── HotellingModel.tsx   # Model 3: Keyword Positioning simulation
│   │   └── About.tsx            # Project team, course details & literature citations
│   │
│   └── utils/
│       └── calculations.ts      # Number, currency, and percentage formatting utilities
```

---

## 8. Application Screenshots & User Interface

*(Add interface screenshots upon deployment)*

- **Overview Page:** Executive summary, three model cards, and formal Nash Equilibrium introduction.
- **Model 1 (Prisoner's Dilemma):** 2×2 interactive matrix with instant dominant strategy and Nash identification, comparison bar charts, and "Why Rational Brands Overspend" breakdown.
- **Model 2 (Bertrand Competition):** Dynamic price sliders, market share donut chart, margin spread bar, and sequential undercutting table.
- **Model 3 (Hotelling's Model):** Linear audience intent track [0, 1] with active user dots, indifferent boundary markers, and algorithmic best-response trajectory generator.
- **Consistent Results & Collapsible Math:** Standardized 4-pillar analytics panel and formal LaTeX equation derivations on every page.

---

## 9. Project Team

Department of Computer Science & Engineering — V Semester Course Project

| Name | Registration Number | Primary Responsibility |
| :--- | :---: | :--- |
| **Kritik Saha** | `2427030549` | Mathematical Modeling & Bertrand Logic |
| **Aditya Prakash** | `2427030541` | Full-Stack Architecture & UI/UX Design |
| **Praneel Ghosh** | `2427030797` | Hotelling Spatial Dynamics & Algorithms |
| **Dhruv Singh** | `2427030595` | Prisoner's Dilemma & Payoff Mechanics |

---

## 10. Academic References

1. **Hotelling, H. (1929).** *Stability in Competition.* The Economic Journal, 39(153), 41–57.
2. **Varian, H. R. (2007).** *Position Auctions.* International Journal of Industrial Organization, 25(6), 1163–1178.
3. **Edelman, B., Ostrovsky, M., and Schwarz, M. (2007).** *Internet Advertising and the Generalized Second-Price Auction: Selling Billions of Dollars Worth of Keywords.* American Economic Review, 97(1), 242–259.
4. **Dixit, A. and Nalebuff, B. (1991).** *Thinking Strategically: The Competitive Edge in Business, Politics, and Everyday Life.* W. W. Norton & Company.
5. **d'Aspremont, C., Gabszewicz, J. J., and Thisse, J.-F. (1979).** *On Hotelling's "Stability in Competition".* Econometrica, 47(5), 1145–1150.
