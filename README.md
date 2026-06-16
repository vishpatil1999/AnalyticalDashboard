# 📊 Analytical Dashboard

A modern, responsive analytical dashboard built with **React**, **Vite**, **shadcn/ui**, and **Tailwind CSS**. Designed for visualizing call data records (CDRs) with KPI metrics, charts, and paginated sortable tables.

---

## ✨ Features

- 📈 **KPI Cards** — Total calls, success rate, failed calls, average duration, and total cost at a glance
- 📉 **Charts & Visualizations** — Calls per hour, calls per day, cost by city, duration breakdown
- 📋 **Sortable & Paginated Table** — Recent call logs with column sorting (asc/desc) and page controls
- 🏷️ **Status Badges** — Visual indicators for call direction (Inbound/Outbound) and status (Success/Failed)
- ⚡ **Fast Development** — Vite-powered HMR for instant feedback
- 🎨 **Consistent Design System** — shadcn/ui components with Tailwind CSS utility classes
- 📱 **Responsive Layout** — Works across desktop and tablet viewports

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18+ | UI framework |
| [Vite](https://vitejs.dev/) | 5+ | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Accessible UI component library |
| [Recharts](https://recharts.org/) | 2+ | Chart & data visualization |
| [Lucide React](https://lucide.dev/) | Latest | Icon library |

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── api/
│   │   └── CdrService.jsx         # API calls for CDR data fetching
│   ├── assets/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── chart.jsx
│   │   │   └── table.jsx
│   │   ├── Activitytimeline.jsx   # Call activity timeline chart
│   │   ├── Citychart.jsx          # Calls breakdown by city
│   │   ├── Costchart.jsx          # Cost analysis chart
│   │   ├── Durationchart.jsx      # Call duration distribution chart
│   │   ├── Kpicards.jsx           # Summary KPI metric cards
│   │   └── Recentcallstable.jsx   # Sortable & paginated call log table
│   ├── hooks/
│   │   └── Usecdrdata.jsx         # Custom hook — data fetching & derived stats
│   ├── lib/
│   │   └── utils.js               # formatDuration, formatCost, formatDateTime
│   ├── App.css
│   ├── App.jsx                    # Root layout — composes all dashboard sections
│   ├── index.css                  # Tailwind directives + CSS variables
│   └── main.jsx                   # React DOM entry point
├── .gitignore
├── components.json                # shadcn/ui CLI config
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0 (or `pnpm` / `yarn`)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/vishpatil1999/AnalyticalDashboard.git
cd analytical-dashboard
```

**2. Install dependencies**

```bash
npm install
```
**4. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across the project |

---

## 🧩 shadcn/ui Setup
Currently installed shadcn components:

| File | Component |
|---|---|
| `badge.jsx` | `<Badge>` — status label pills |
| `button.jsx` | `<Button>` — all button variants |
| `card.jsx` | `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardTitle>` |
| `chart.jsx` | `<ChartContainer>`, `<ChartTooltip>` — Recharts wrapper |
| `table.jsx` | `<Table>`, `<TableHead>`, `<TableRow>`, `<TableCell>` |

To add more shadcn components:

```bash
npx shadcn@latest add <component-name>

# Examples
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add tooltip
```

The `components.json` file at the project root controls paths, aliases, and the Tailwind config used by the shadcn CLI.

---

## 🎨 Tailwind CSS Configuration

Tailwind is configured in `tailwind.config.js`. The design tokens (colors, radius, etc.) are defined as CSS variables in `src/index.css` and consumed by shadcn components via the `hsl(var(--...))` pattern.

Key CSS variables (defined in `:root` and `.dark`):

```css
--background        /* Page background */
--foreground        /* Default text */
--primary           /* Primary action color */
--muted-foreground  /* Subdued text, icons */
--border            /* Dividers and outlines */
--card              /* Card surface */
```

To extend the theme, add values under `theme.extend` in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
    },
  },
},
```

---

## 📊 Data & Hooks

All CDR data fetching and derived statistics live in the `Usecdrdata` custom hook (`src/hooks/Usecdrdata.jsx`). It exposes:

| Export | Type | Description |
|---|---|---|
| `loading` | `boolean` | True while data is fetching |
| `error` | `string \| null` | Error message if fetch failed |
| `records` | `array` | Raw CDR records |
| `kpis` | `object` | `totalCalls`, `successRate`, `totalCost`, `avgDuration`, etc. |
| `durationStats` | `object` | Longest, shortest, average, top-10 chart data |
| `costByCity` | `array` | Cost aggregated by city (top 8) |
| `callsPerHour` | `array` | 24-hour call volume distribution |
| `callsPerDay` | `array` | Daily call volume over time |
| `callsByCity` | `array` | Call count by city (top 8) |
| `statusBreakdown` | `array` | `[{name, value}]` for pie chart |
| `directionBreakdown` | `array` | Inbound vs Outbound split |
| `recentCalls` | `array` | All records sorted newest first |

---

## 🗃️ CDR Record Shape

Each record returned from the API is expected to match this shape:

```ts
{
  id:             string | number
  callerName:     string
  callerNumber:   string
  receiverNumber: string
  city:           string
  callDirection:  boolean   // true = Inbound, false = Outbound
  callStatus:     boolean   // true = Success, false = Failed
  callDuration:   number    // seconds
  callCost:       string    // e.g. "0.420"
  callStartTime:  string    // ISO 8601 datetime
}
```

---

## 🔧 Utility Functions

Located in `src/lib/utils.js` (plain JS, no JSX):

```js
formatDuration(seconds)   // 125 → "2m 5s"
formatCost(cost)          // "0.42" → "£0.42"
formatDateTime(iso)       // ISO string → "16 Jun, 14:32"
cn(...classes)            // clsx + tailwind-merge helper for conditional classes
```

---

> Built with React + Vite + shadcn/ui + Tailwind CSS