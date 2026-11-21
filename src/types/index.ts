// Types for Travel Agency Accounting System (VoyageLedger)

export type CurrencyCode = 'USD' | 'SAR' | 'AED' | 'PKR' | 'EUR' | 'GBP';

export interface ExchangeRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToBase: number; // base is USD
}

export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subCategory: string;
  balance: number;
  description?: string;
  isSystem?: boolean;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export type VoucherType = 'TICKET_ISSUE' | 'INVOICE' | 'RECEIPT' | 'PAYMENT' | 'REFUND' | 'ADM' | 'ACM' | 'JOURNAL';

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  voucherType: VoucherType;
  referenceNo: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
}

export type GdsSystem = 'Amadeus' | 'Sabre' | 'Galileo' | 'Direct NDC';
export type TicketStatus = 'ISSUED' | 'REISSUED' | 'REFUNDED' | 'VOID';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export interface TicketBooking {
  id: string;
  ticketNumber: string; // 13-digit e-ticket (e.g. 176-5839201948)
  pnr: string; // 6-char GDS PNR
  gds: GdsSystem;
  airlineCode: string; // EK, QR, SV, PK, etc.
  airlineName: string;
  passengerName: string;
  passengerType: 'Adult' | 'Child' | 'Infant';
  sector: string; // e.g. DXB-LHR-JFK
  flightDate: string;
  issueDate: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  
  // Financials
  baseFare: number;
  taxes: number; // airport & government taxes
  grossFare: number; // baseFare + taxes
  airlineCommissionPercent: number;
  airlineCommissionAmount: number;
  markupAmount: number; // agency service fee or extra markup
  netCostToAirline: number; // grossFare - commission
  clientSellingPrice: number; // grossFare + markupAmount - discount
  discount: number;
  
  customerId: string;
  customerName: string;
  vendorId: string; // Airline or Consolidator
  status: TicketStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number;
}

export interface HotelBooking {
  id: string;
  voucherNo: string;
  confirmationNo: string;
  hotelName: string;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  mealPlan: 'Room Only' | 'Bed & Breakfast' | 'Half Board' | 'Full Board' | 'All Inclusive';
  guestName: string;
  vendorName: string; // Hotelbeds, Expedia, Direct Hotel
  buyingCost: number;
  sellingPrice: number;
  profitMargin: number;
  customerId: string;
  customerName: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  issueDate: string;
}

export interface UmrahPackage {
  id: string;
  packageCode: string;
  packageName: string;
  groupLeader: string;
  paxCount: number;
  durationDays: number;
  makkahHotel: string;
  madinahHotel: string;
  visaCostPerPax: number;
  hotelCostPerPax: number;
  transportCostPerPax: number;
  totalCost: number;
  sellingPrice: number;
  profit: number;
  customerId: string;
  customerName: string;
  departureDate: string;
  status: 'INQUIRY' | 'CONFIRMED' | 'TRAVELLING' | 'COMPLETED';
}

export interface VisaApplication {
  id: string;
  refNumber: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  destinationCountry: string;
  visaType: 'Tourist 30D' | 'Tourist 90D' | 'Business' | 'Work' | 'Umrah eVisa';
  embassyFee: number;
  serviceCharge: number;
  totalSellingPrice: number;
  supplierName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COLLECTED';
  applicationDate: string;
  customerId: string;
  customerName: string;
}

export interface RefundRecord {
  id: string;
  refundNumber: string;
  ticketNumber: string;
  pnr: string;
  passengerName: string;
  airlineName: string;
  customerId: string;
  customerName: string;
  originalGrossFare: number;
  airlineCancellationPenalty: number;
  agencyRefundServiceFee: number;
  netCustomerRefund: number;
  acmNumber?: string; // Agency Credit Memo from Airline
  refundDate: string;
  status: 'PENDING' | 'PROCESSED' | 'CREDITED_TO_CLIENT';
}

export interface ADMRecord {
  id: string;
  admNumber: string;
  airlineCode: string;
  airlineName: string;
  ticketNumber: string;
  pnr: string;
  reason: 'Fare Discrepancy' | 'Class Mismatch' | 'Tax Undercollection' | 'Baggage Rule' | 'Void Window Violation';
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'OPEN' | 'DISPUTED' | 'ACCEPTED_PAID' | 'WAIVED';
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  type: 'Corporate' | 'Sub-Agent' | 'Individual';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  creditDays: number;
  currentBalance: number; // positive = customer owes agency, negative = advance balance
  currency: CurrencyCode;
}

export interface VendorSupplier {
  id: string;
  name: string;
  type: 'Airline' | 'GDS Consolidator' | 'Hotel Provider' | 'Visa Provider';
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  balance: number; // positive = agency owes vendor
  currency: CurrencyCode;
}

export interface Voucher {
  id: string;
  voucherNumber: string;
  type: 'RV' | 'PV' | 'JV' | 'CN' | 'DN'; // Receipt, Payment, Journal, Credit Note, Debit Note
  date: string;
  partyType: 'CUSTOMER' | 'VENDOR' | 'GENERAL';
  partyId: string;
  partyName: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Credit Card' | 'Direct Adjustment';
  bankAccount?: string;
  referenceNo: string;
  narration: string;
  status: 'POSTED' | 'DRAFT';
}

export interface BSPSettlement {
  id: string;
  periodName: string; // e.g. "2026-11-P2 (16-30 Nov)"
  startDate: string;
  endDate: string;
  airlineCount: number;
  ticketCount: number;
  grossSales: number;
  refunds: number;
  airlineCommissions: number;
  taxRemitted: number;
  netPayableToIATA: number;
  status: 'PENDING_RECONCILIATION' | 'RECONCILED' | 'SETTLED';
  settlementDate?: string;
}
