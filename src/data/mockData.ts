import { Account, Party, SaleInvoice, SupplierBill, Voucher } from '../types';

export const initialChartOfAccounts: Account[] = [
  // 1000: ASSETS
  { id: 'acc-1010', code: '1010', name: 'Cash in Hand (Safe Vault)', category: 'ASSET', subCategory: 'Cash & Cash Equivalents', balance: 185000, isSystem: true },
  { id: 'acc-1020', code: '1020', name: 'Petty Cash (Front Counter)', category: 'ASSET', subCategory: 'Cash & Cash Equivalents', balance: 25000, isSystem: true },
  { id: 'acc-1030', code: '1030', name: 'Meezan Bank (Current A/c)', category: 'ASSET', subCategory: 'Bank Accounts', balance: 940000, isSystem: true },
  { id: 'acc-1035', code: '1035', name: 'HBL Operating Account', category: 'ASSET', subCategory: 'Bank Accounts', balance: 650000, isSystem: true },
  { id: 'acc-1040', code: '1040', name: 'Standard Chartered USD A/c', category: 'ASSET', subCategory: 'Bank Accounts', balance: 420000, isSystem: true },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable (Clients Control)', category: 'ASSET', subCategory: 'Receivables', balance: 745000, isSystem: true },
  { id: 'acc-1200', code: '1200', name: 'Airline Security Deposits / Float', category: 'ASSET', subCategory: 'Prepayments & Deposits', balance: 500000, isSystem: true },
  { id: 'acc-1300', code: '1300', name: 'Office Furniture & Computers', category: 'ASSET', subCategory: 'Fixed Assets', balance: 350000, isSystem: true },

  // 2000: LIABILITIES
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable (Airlines / IATA / Consolidators)', category: 'LIABILITY', subCategory: 'Payables', balance: 890000, isSystem: true },
  { id: 'acc-2020', code: '2020', name: 'Accounts Payable (Hotel Suppliers)', category: 'LIABILITY', subCategory: 'Payables', balance: 310000, isSystem: true },
  { id: 'acc-2030', code: '2030', name: 'Accounts Payable (Visa & Moafa Agents)', category: 'LIABILITY', subCategory: 'Payables', balance: 145000, isSystem: true },
  { id: 'acc-2100', code: '2100', name: 'Client Advance Balances', category: 'LIABILITY', subCategory: 'Current Liabilities', balance: 120000, isSystem: true },
  { id: 'acc-2200', code: '2200', name: 'Accrued Staff Salaries & Expenses', category: 'LIABILITY', subCategory: 'Current Liabilities', balance: 165000, isSystem: true },

  // 3000: EQUITY / CAPITAL
  { id: 'acc-3010', code: '3010', name: 'Proprietor / Partner Capital', category: 'EQUITY', subCategory: 'Equity', balance: 1800000, isSystem: true },
  { id: 'acc-3020', code: '3020', name: 'Retained Earnings', category: 'EQUITY', subCategory: 'Equity', balance: 485000, isSystem: true },

  // 4000: INCOME / REVENUE
  { id: 'acc-4010', code: '4010', name: 'Air Ticket Sales & Commission Revenue', category: 'INCOME', subCategory: 'Travel Operating Revenue', balance: 410000, isSystem: true },
  { id: 'acc-4020', code: '4020', name: 'Hotel Booking Markup Margin', category: 'INCOME', subCategory: 'Travel Operating Revenue', balance: 185000, isSystem: true },
  { id: 'acc-4030', code: '4030', name: 'Umrah & Tour Packages Profit', category: 'INCOME', subCategory: 'Travel Operating Revenue', balance: 320000, isSystem: true },
  { id: 'acc-4040', code: '4040', name: 'Visa Processing & Service Fees', category: 'INCOME', subCategory: 'Travel Operating Revenue', balance: 165000, isSystem: true },
  { id: 'acc-4050', code: '4050', name: 'Ticket Refund & Date Change Charges', category: 'INCOME', subCategory: 'Travel Operating Revenue', balance: 45000, isSystem: true },

  // 6000: EXPENSES
  { id: 'acc-6010', code: '6010', name: 'Office Rent & Commercial Utilities', category: 'EXPENSE', subCategory: 'Operating Expenses', balance: 140000, isSystem: true },
  { id: 'acc-6020', code: '6020', name: 'Staff Salaries & Incentives', category: 'EXPENSE', subCategory: 'Operating Expenses', balance: 210000, isSystem: true },
  { id: 'acc-6030', code: '6030', name: 'Internet, Telephone & Software Fees', category: 'EXPENSE', subCategory: 'Operating Expenses', balance: 32000, isSystem: true },
  { id: 'acc-6040', code: '6040', name: 'Bank Charges & Online Transfer Fees', category: 'EXPENSE', subCategory: 'Financial Expenses', balance: 12000, isSystem: true },
  { id: 'acc-6050', code: '6050', name: 'Tea, Refreshment & Office Cleaning', category: 'EXPENSE', subCategory: 'Office Expenses', balance: 24000, isSystem: true },
  { id: 'acc-6060', code: '6060', name: 'Printing, Stationery & Postage', category: 'EXPENSE', subCategory: 'Office Expenses', balance: 18000, isSystem: true },
];

export const initialParties: Party[] = [
  // CUSTOMERS
  {
    id: 'pty-c1',
    type: 'CUSTOMER',
    name: 'Al-Baraka Logistics Ltd',
    companyName: 'Al-Baraka Group',
    phone: '0300-8491029',
    email: 'accounts@albaraka.com',
    address: 'Gulberg III, Lahore',
    creditLimit: 500000,
    creditDays: 30,
    openingBalance: 0,
    currentBalance: 245000 // Client owes agency
  },
  {
    id: 'pty-c2',
    type: 'CUSTOMER',
    name: 'Dr. Zeeshan Akhtar',
    companyName: 'Private Individual',
    phone: '0321-4492019',
    email: 'dr.zeeshan@gmail.com',
    address: 'DHA Phase 5, Lahore',
    creditLimit: 200000,
    creditDays: 15,
    openingBalance: 0,
    currentBalance: 95000
  },
  {
    id: 'pty-c3',
    type: 'CUSTOMER',
    name: 'Falcon Sub-Agency (Haji Naeem)',
    companyName: 'Falcon Travel & Tours',
    phone: '0333-8910294',
    email: 'falcon.tours@yahoo.com',
    address: 'Mall Road, Rawalpindi',
    creditLimit: 800000,
    creditDays: 7,
    openingBalance: 0,
    currentBalance: 405000
  },

  // SUPPLIERS
  {
    id: 'pty-s1',
    type: 'SUPPLIER',
    name: 'IATA BSP Clearing Center',
    companyName: 'IATA Pakistan Billing',
    phone: '021-35849201',
    email: 'bsppk@iata.org',
    address: 'IATA Karachi Hub',
    openingBalance: 0,
    currentBalance: 580000 // Agency owes IATA
  },
  {
    id: 'pty-s2',
    type: 'SUPPLIER',
    name: 'Fly365 Global Consolidators',
    companyName: 'Fly365 Ticketing Ltd',
    phone: '042-35718900',
    email: 'billing@fly365.com',
    address: 'Davis Road, Lahore',
    openingBalance: 0,
    currentBalance: 310000
  },
  {
    id: 'pty-s3',
    type: 'SUPPLIER',
    name: 'Hotelbeds & Direct Hotels Makkah',
    companyName: 'Hotelbeds Bedbank',
    phone: '0300-5554400',
    email: 'makkah@hotelbeds.com',
    address: 'Makkah Clock Tower Office',
    openingBalance: 0,
    currentBalance: 310000
  },
  {
    id: 'pty-s4',
    type: 'SUPPLIER',
    name: 'Al-Moafa Visa Consultancy Hub',
    companyName: 'Moafa Drop Box Services',
    phone: '0301-9920194',
    email: 'visas@moafa.com',
    address: 'Blue Area, Islamabad',
    openingBalance: 0,
    currentBalance: 145000
  }
];

export const initialSalesInvoices: SaleInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-101',
    date: '2026-11-18',
    dueDate: '2026-12-02',
    customerId: 'pty-c1',
    customerName: 'Al-Baraka Logistics Ltd',
    paymentType: 'CREDIT',
    items: [
      {
        id: 'item-1',
        serviceType: 'AIR_TICKET',
        description: 'Emirates Business Class Return Ticket',
        pnr: 'EK89QP',
        ticketNumber: '176-2948192034',
        passengerName: 'MR TARIQ / MANSOOR',
        sector: 'LHE-DXB-LHR-LHE',
        travelDate: '2026-11-28',
        supplierId: 'pty-s1',
        costPrice: 420000,
        salePrice: 465000,
        margin: 45000
      }
    ],
    totalCost: 420000,
    totalSale: 465000,
    totalProfit: 45000,
    paidAmount: 220000,
    balanceDue: 245000,
    status: 'PARTIAL',
    notes: 'Advance Rs 220,000 received via Meezan Bank. Balance due in 15 days.'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-102',
    date: '2026-11-19',
    dueDate: '2026-12-04',
    customerId: 'pty-c2',
    customerName: 'Dr. Zeeshan Akhtar',
    paymentType: 'CREDIT',
    items: [
      {
        id: 'item-2',
        serviceType: 'HOTEL',
        description: 'Pullman Zamzam Makkah (5 Nights Kaaba View)',
        pnr: 'CONF-8910',
        passengerName: 'Dr. Zeeshan (2 Pax)',
        sector: 'Makkah Stay',
        travelDate: '2026-12-10',
        supplierId: 'pty-s3',
        costPrice: 280000,
        salePrice: 325000,
        margin: 45000
      },
      {
        id: 'item-3',
        serviceType: 'VISA',
        description: 'Saudi Tourist eVisa (2 Passports)',
        passengerName: 'Dr. Zeeshan & Spouse',
        supplierId: 'pty-s4',
        costPrice: 70000,
        salePrice: 90000,
        margin: 20000
      }
    ],
    totalCost: 350000,
    totalSale: 415000,
    totalProfit: 65000,
    paidAmount: 320000,
    balanceDue: 95000,
    status: 'PARTIAL',
    notes: 'Partial payment paid via cash. Remaining balance Rs 95,000 due.'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-103',
    date: '2026-11-20',
    dueDate: '2026-11-27',
    customerId: 'pty-c3',
    customerName: 'Falcon Sub-Agency (Haji Naeem)',
    paymentType: 'CREDIT',
    items: [
      {
        id: 'item-4',
        serviceType: 'UMRAH_HAJJ',
        description: 'November 10-Pax Group Umrah Package',
        passengerName: 'Group Haji Naeem (10 Pax)',
        sector: 'Umrah Complete Package',
        travelDate: '2026-12-05',
        supplierId: 'pty-s2',
        costPrice: 1450000,
        salePrice: 1655000,
        margin: 205000
      }
    ],
    totalCost: 1450000,
    totalSale: 1655000,
    totalProfit: 205000,
    paidAmount: 1250000,
    balanceDue: 405000,
    status: 'PARTIAL',
    notes: 'Sub-agent quota allotment. Balance Rs 405,000 payable next week.'
  }
];

export const initialSupplierBills: SupplierBill[] = [
  {
    id: 'bill-201',
    billNumber: 'BSP-PK-NOV-P1',
    date: '2026-11-16',
    dueDate: '2026-11-25',
    supplierId: 'pty-s1',
    supplierName: 'IATA BSP Clearing Center',
    description: 'Fortnightly IATA BSP Statement (Period 1 Nov 2026)',
    amount: 980000,
    paidAmount: 400000,
    balanceDue: 580000,
    status: 'PARTIAL'
  },
  {
    id: 'bill-202',
    billNumber: 'FLY-INV-9920',
    date: '2026-11-17',
    dueDate: '2026-11-27',
    supplierId: 'pty-s2',
    supplierName: 'Fly365 Global Consolidators',
    description: 'Weekly Consolidator Air Ticket Ledger Statement',
    amount: 510000,
    paidAmount: 200000,
    balanceDue: 310000,
    status: 'PARTIAL'
  }
];

export const initialVouchers: Voucher[] = [
  {
    id: 'vch-1',
    voucherNumber: 'RV-2026-001',
    type: 'RV',
    date: '2026-11-18',
    partyId: 'pty-c1',
    partyName: 'Al-Baraka Logistics Ltd',
    debitAccountId: 'acc-1030', // Meezan Bank
    debitAccountName: 'Meezan Bank (Current A/c)',
    creditAccountId: 'acc-1100', // Accounts Receivable
    creditAccountName: 'Accounts Receivable (Clients Control)',
    amount: 220000,
    paymentMethod: 'BANK_TRANSFER',
    chequeOrRefNo: 'FT-9941029',
    narration: 'Advance payment received against Emirates Ticket Invoice INV-2026-101'
  },
  {
    id: 'vch-2',
    voucherNumber: 'RV-2026-002',
    type: 'RV',
    date: '2026-11-19',
    partyId: 'pty-c2',
    partyName: 'Dr. Zeeshan Akhtar',
    debitAccountId: 'acc-1010', // Cash in Hand
    debitAccountName: 'Cash in Hand (Safe Vault)',
    creditAccountId: 'acc-1100',
    creditAccountName: 'Accounts Receivable (Clients Control)',
    amount: 320000,
    paymentMethod: 'CASH',
    chequeOrRefNo: 'CASH-RCPT',
    narration: 'Cash received at front desk for Pullman Zamzam Hotel Booking & Visas'
  },
  {
    id: 'vch-3',
    voucherNumber: 'PV-2026-001',
    type: 'PV',
    date: '2026-11-17',
    partyId: 'pty-s1',
    partyName: 'IATA BSP Clearing Center',
    debitAccountId: 'acc-2010', // Accounts Payable
    debitAccountName: 'Accounts Payable (Airlines / IATA / Consolidators)',
    creditAccountId: 'acc-1030', // Meezan Bank
    creditAccountName: 'Meezan Bank (Current A/c)',
    amount: 400000,
    paymentMethod: 'BANK_TRANSFER',
    chequeOrRefNo: 'RTGS-881920',
    narration: 'Partial settlement to IATA BSP against Period 1 billing'
  },
  {
    id: 'vch-4',
    voucherNumber: 'PV-2026-002',
    type: 'PV',
    date: '2026-11-20',
    debitAccountId: 'acc-6010', // Office Rent
    debitAccountName: 'Office Rent & Commercial Utilities',
    creditAccountId: 'acc-1030', // Meezan Bank
    creditAccountName: 'Meezan Bank (Current A/c)',
    amount: 70000,
    paymentMethod: 'CHEQUE',
    chequeOrRefNo: 'CHQ-559102',
    narration: 'November office commercial space rent installment paid'
  }
];
