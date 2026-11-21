// Pure Accounting Types for Travel Agency Business

export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subCategory: string;
  balance: number;
  isSystem?: boolean;
}

export type PartyType = 'CUSTOMER' | 'SUPPLIER';

export interface Party {
  id: string;
  type: PartyType;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit?: number;
  creditDays?: number;
  openingBalance: number;
  currentBalance: number; // For customers: positive = receivable. For suppliers: positive = payable.
}

export type ServiceType = 'AIR_TICKET' | 'HOTEL' | 'VISA' | 'UMRAH_HAJJ' | 'TOUR_PACKAGE' | 'OTHER';

export interface SaleInvoiceItem {
  id: string;
  serviceType: ServiceType;
  description: string;
  pnr?: string;
  ticketNumber?: string;
  passengerName?: string;
  sector?: string; // e.g. LHE-DXB-LHR
  travelDate?: string;
  supplierId: string; // Airline or Supplier (e.g., Emirates, IATA, Hotelbeds)
  costPrice: number; // Cost owed to supplier
  salePrice: number; // Amount charged to client
  margin: number; // salePrice - costPrice
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-1001
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  paymentType: 'CREDIT' | 'CASH' | 'BANK';
  depositAccountId?: string; // If paid in cash/bank directly
  items: SaleInvoiceItem[];
  totalCost: number;
  totalSale: number;
  totalProfit: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  notes?: string;
}

export interface SupplierBill {
  id: string;
  billNumber: string; // e.g. BILL-501 or IATA invoice ref
  date: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  description: string;
  amount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export type VoucherType = 'RV' | 'PV' | 'JV' | 'CN' | 'DN'; 
// RV: Receipt Voucher (Cash/Bank in from client)
// PV: Payment Voucher (Cash/Bank out to supplier or expense)
// JV: Journal Voucher (Non-cash transfer/adjustment)
// CN: Credit Note (Client discount / ticket refund)
// DN: Debit Note (Supplier penalty / extra charge)

export interface Voucher {
  id: string;
  voucherNumber: string; // e.g. RV-2026-001
  type: VoucherType;
  date: string;
  partyId?: string;
  partyName?: string;
  debitAccountId: string;
  debitAccountName: string;
  creditAccountId: string;
  creditAccountName: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE' | 'ADJUSTMENT';
  chequeOrRefNo?: string;
  narration: string;
}

export interface LedgerTransaction {
  id: string;
  date: string;
  voucherNo: string;
  type: string;
  particulars: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface AgencyProfile {
  agencyName: string;
  tagline: string;
  licenseNo: string;
  phone: string;
  email: string;
  address: string;
  pinCode: string;
  isLockEnabled: boolean;
  deviceFingerprint: string;
  createdAt: string;
}

