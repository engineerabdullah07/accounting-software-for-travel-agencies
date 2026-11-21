# TravelLedger: Double-Entry Accounting & Khata Software for Travel Agencies

**TravelLedger** is an open-source, offline-ready double-entry accounting and khata ERP system created specifically for **travel agencies, consolidators, and tour operators**.

Unlike generic booking engines or flight simulations, **TravelLedger focuses 100% on actual travel business accounting**:
- Managing client credit khatas
- Supplier & airline payables
- Receipt Vouchers (RV) & Payment Vouchers (PV)
- Cash & Bank registers
- Day Book (Roznamcha)
- Trial Balance, Profit & Loss (P&L), and Balance Sheet
- Excel / CSV ticket sales import

Styled with a luxurious creamy aesthetic, smooth micro-interactions, and live loading progress indicators.

---

## Core Travel Agency Accounting Modules

### 1. Sales Invoicing (Tickets, Hotels, Visas, Umrah)
- Record sales invoices for any service (Air Ticket, Hotel, Visa, Umrah, Tour).
- Capture PNR, Ticket Number, Passenger Name, Sector/Route, Travel Date.
- Select Client Khata and Supplier (Airline / Consolidator / Bedbank).
- Enter **Supplier Net Cost** vs **Customer Sale Price** — automatically computes gross profit margin!
- Payment options: Credit (Charge to Client Khata), Cash in Hand, or Bank Deposit.

### 2. Supplier & Airline Bills (Purchases)
- Enter billing statements received from IATA BSP, ticketing consolidators, hotel beds, or visa agencies.
- Track total bill amount, payments released, and outstanding payable balance.

### 3. Vouchers Center (RV / PV / JV / CN / DN)
- **Receipt Voucher (RV)**: Cash or bank transfer received from clients with cheque/wire reference.
- **Payment Voucher (PV)**: Released payments to suppliers, airlines, or office expenses (Rent, Salaries, Tea/Refreshment).
- **Journal Voucher (JV)**: Non-cash balance transfers & adjustments.
- **Credit Note (CN)**: Ticket refund credits and client discounts.

### 4. Client Ledgers (Party Statements / Khata)
- Select any corporate client, sub-agent, or passenger.
- Filter by date range (From Date - To Date) with opening and closing balances.
- Itemized running ledger: Date, Voucher #, Service Particulars (PNR, Passenger, Sector), Debit, Credit, and Running Balance.
- One-click **Print Statement** formatted with agency letterhead & signature lines.

### 5. Supplier Ledgers (Payables Khata)
- Complete reconciliation statement for IATA BSP, ticketing consolidators, and hotel beds.
- Track bills received vs payments released with running balance.

### 6. Cash Book & Bank Registers
- **Cash in Hand (Safe Vault)** counter register.
- **Bank Registers** (Meezan Bank, HBL, Standard Chartered USD, Al-Rajhi SAR).
- Complete running register of every deposit, withdrawal, and cheque.

### 7. Financial Statements & Audit Reports
- **Trial Balance**: Real-time equilibrium verification ensuring Total Debits = Total Credits.
- **Profit & Loss (P&L)**: Live breakdown of travel operating margins vs operating expenses.
- **Balance Sheet**: Assets = Liabilities + Capital & Retained Earnings.
- **Roznamcha (Day Book)**: Chronological daily transaction register.

### 8. Excel / CSV Import & JSON Data Backup
- **Bulk Paste Import**: Paste ticket sales directly from Excel/CSV to auto-generate invoices and post to ledgers.
- **Complete Backup & Restore**: Export and restore entire financial books with one click (JSON).

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/nexusworks421-boop/accounting-software-for-travel-agencies.git
cd accounting-software-for-travel-agencies

# Install dependencies
npm install

# Start local server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## License

Open-source under the [MIT License](LICENSE).
