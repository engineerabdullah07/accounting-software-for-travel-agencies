# VoyageLedger: Open-Source Accounting Software for Travel Agencies

**VoyageLedger** is a full-featured, open-source ERP and double-entry accounting software designed specifically for the unique operational workflows of modern travel agencies, consolidators, tour operators, and Umrah/Hajj service providers.

Designed with a creamy, high-end warm aesthetic, smooth micro-interactions, live loading progress bars, and balanced financial ledgers.

---

## Key Modules & Features

### 1. Air Ticketing & GDS Operations
- **Multi-GDS Support**: Amadeus, Sabre, Travelport Galileo, and Direct NDC booking reconciliation.
- **Automated Fare Construction**: Base fare, fuel surcharges, airport taxes (YQ, RG, etc.), standard airline commission, overriding incentives (ORC), and agency service fees.
- **Double-Entry Automation**: Automatically debits Accounts Receivable and credits Airline Payables and Commission Revenue on ticket issuance.

### 2. IATA BSP Clearing & Settlement
- **Fortnightly Cycles**: Period 1 (01-15) and Period 2 (16-30/31) tracking.
- **3-Way Reconciliation**: Compares internal ticket records against airline gross billing with variance detection.
- **ACM / ADM Management**: Handles Agency Credit Memos and Agency Debit Memos with dispute tracking.

### 3. Hotel Vouchers & Religious Tourism (Umrah/Hajj)
- **Bedbank Reconciliation**: Hotelbeds, Agoda B2B, and direct hotel contract tracking.
- **Group Package Costing**: Per-pax visa, accommodation, and transport margin calculations.

### 4. Visa Processing & Embassy Charges
- Tracks official embassy consular fees vs agency consultancy margins.
- Application status pipeline (Submitted, Under Review, Approved, Collected).

### 5. Corporate Client Receivables & Aging
- B2B corporate credit limits, payment credit days, and quota monitoring.
- Aging analysis buckets (Current 0-30 days, 31-60 days, 60+ days overdue).
- Printable client statement of account with running debit/credit balances.

### 6. Comprehensive Double-Entry Engine
- **Chart of Accounts (COA)**: Tailored 6-digit classification (Assets, Liabilities, Equity, Operating Revenue, Direct Costs, Operating Expenses).
- **General Journal**: Every transaction recorded with balanced Debits and Credits.
- **Trial Balance**: Real-time equilibrium verification.
- **Profit & Loss (P&L)**: Live breakdown of flight commissions, hotel margins, visa revenue, and overhead.
- **Balance Sheet**: Assets = Liabilities + Equity.

### 7. Multi-Currency Engine
- Real-time conversion across USD, SAR, AED, PKR, EUR, and GBP.
- Foreign exchange gain/loss tracking.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Custom Creamy Palette: `#FAF8F5`, `#EBE3DA`, `#C69D3B`)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage & JSON Export/Import

---

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/USER/accounting-software-for-travel-agencies.git
cd accounting-software-for-travel-agencies

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## License

This project is open-source under the [MIT License](LICENSE).
