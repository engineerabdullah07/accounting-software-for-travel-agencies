import {
  Account,
  Customer,
  VendorSupplier,
  TicketBooking,
  HotelBooking,
  UmrahPackage,
  VisaApplication,
  RefundRecord,
  ADMRecord,
  Voucher,
  BSPSettlement,
  JournalEntry,
  ExchangeRate
} from '../types';

export const initialExchangeRates: ExchangeRate[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToBase: 1.0 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rateToBase: 3.75 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToBase: 3.67 },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rateToBase: 278.50 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToBase: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToBase: 0.79 },
];

export const initialChartOfAccounts: Account[] = [
  // 1000: ASSETS
  { id: 'acc-1010', code: '1010', name: 'Cash on Hand (Main Vault)', category: 'ASSET', subCategory: 'Current Assets', balance: 14500, isSystem: true },
  { id: 'acc-1020', code: '1020', name: 'Front Desk Petty Cash', category: 'ASSET', subCategory: 'Current Assets', balance: 1850, isSystem: true },
  { id: 'acc-1030', code: '1030', name: 'Commercial Bank Operating A/c', category: 'ASSET', subCategory: 'Bank Accounts', balance: 64200, isSystem: true },
  { id: 'acc-1035', code: '1035', name: 'USD Foreign Currency Bank A/c', category: 'ASSET', subCategory: 'Bank Accounts', balance: 48900, isSystem: true },
  { id: 'acc-1040', code: '1040', name: 'Al-Rajhi Bank SAR Umrah Float', category: 'ASSET', subCategory: 'Bank Accounts', balance: 32600, isSystem: true },
  { id: 'acc-1100', code: '1100', name: 'Accounts Receivable - Corporate Clients', category: 'ASSET', subCategory: 'Receivables', balance: 38400, isSystem: true },
  { id: 'acc-1110', code: '1110', name: 'Accounts Receivable - Sub-Agents', category: 'ASSET', subCategory: 'Receivables', balance: 19800, isSystem: true },
  { id: 'acc-1120', code: '1120', name: 'Accounts Receivable - Walk-in Clients', category: 'ASSET', subCategory: 'Receivables', balance: 5200, isSystem: true },
  { id: 'acc-1200', code: '1200', name: 'IATA BSP Advance Security Deposit', category: 'ASSET', subCategory: 'Deposits & Floats', balance: 25000, isSystem: true },
  { id: 'acc-1210', code: '1210', name: 'Hotelbeds & Agoda Prepaid Float', category: 'ASSET', subCategory: 'Deposits & Floats', balance: 12400, isSystem: true },
  { id: 'acc-1300', code: '1300', name: 'Office IT Equipment & GDS Terminals', category: 'ASSET', subCategory: 'Fixed Assets', balance: 28500, isSystem: true },

  // 2000: LIABILITIES
  { id: 'acc-2010', code: '2010', name: 'Accounts Payable - IATA BSP Airlines', category: 'LIABILITY', subCategory: 'Payables', balance: 48500, isSystem: true },
  { id: 'acc-2020', code: '2020', name: 'Accounts Payable - GDS Consolidators', category: 'LIABILITY', subCategory: 'Payables', balance: 22400, isSystem: true },
  { id: 'acc-2040', code: '2040', name: 'Accounts Payable - Hotel & Ground Vendors', category: 'LIABILITY', subCategory: 'Payables', balance: 16800, isSystem: true },
  { id: 'acc-2050', code: '2050', name: 'Accounts Payable - Visa & Moafa Authorities', category: 'LIABILITY', subCategory: 'Payables', balance: 7400, isSystem: true },
  { id: 'acc-2100', code: '2100', name: 'Client Advance Deposits / Credits', category: 'LIABILITY', subCategory: 'Current Liabilities', balance: 15300, isSystem: true },
  { id: 'acc-2200', code: '2200', name: 'Accrued Staff Salaries & Commissions', category: 'LIABILITY', subCategory: 'Current Liabilities', balance: 11200, isSystem: true },

  // 3000: EQUITY
  { id: 'acc-3010', code: '3010', name: 'Partner Capital Investment', category: 'EQUITY', subCategory: 'Equity', balance: 120000, isSystem: true },
  { id: 'acc-3020', code: '3020', name: 'Retained Earnings', category: 'EQUITY', subCategory: 'Equity', balance: 49250, isSystem: true },

  // 4000: REVENUE
  { id: 'acc-4010', code: '4010', name: 'Airline Standard Commission Income', category: 'REVENUE', subCategory: 'Air Ticketing', balance: 28900, isSystem: true },
  { id: 'acc-4020', code: '4020', name: 'Airline Overriding Commission & Incentives (ORC)', category: 'REVENUE', subCategory: 'Air Ticketing', balance: 9400, isSystem: true },
  { id: 'acc-4030', code: '4030', name: 'Ticket Agency Service Fee & Markup', category: 'REVENUE', subCategory: 'Air Ticketing', balance: 18600, isSystem: true },
  { id: 'acc-4040', code: '4040', name: 'Hotel Booking Commission Margin', category: 'REVENUE', subCategory: 'Hotels & Accommodation', balance: 14200, isSystem: true },
  { id: 'acc-4050', code: '4050', name: 'Umrah & Hajj Package Gross Margin', category: 'REVENUE', subCategory: 'Religious Tourism', balance: 31800, isSystem: true },
  { id: 'acc-4060', code: '4060', name: 'Visa Processing & Consultancy Fees', category: 'REVENUE', subCategory: 'Visa Services', balance: 12700, isSystem: true },
  { id: 'acc-4070', code: '4070', name: 'Ticket Reissue & Date Change Income', category: 'REVENUE', subCategory: 'Ancillary Services', balance: 4350, isSystem: true },
  { id: 'acc-4080', code: '4080', name: 'Ticket Refund Processing Service Fee', category: 'REVENUE', subCategory: 'Ancillary Services', balance: 2100, isSystem: true },

  // 5000: COST OF SALES (DIRECT COSTS)
  { id: 'acc-5010', code: '5010', name: 'Net Airline Fare Remittance (COGS)', category: 'EXPENSE', subCategory: 'Direct Travel Cost', balance: 312000, isSystem: true },
  { id: 'acc-5020', code: '5020', name: 'Hotel Room Supplier Direct Cost', category: 'EXPENSE', subCategory: 'Direct Travel Cost', balance: 64800, isSystem: true },
  { id: 'acc-5030', code: '5030', name: 'Visa Official Embassy Fees Cost', category: 'EXPENSE', subCategory: 'Direct Travel Cost', balance: 38200, isSystem: true },

  // 6000: OPERATING EXPENSES
  { id: 'acc-6010', code: '6010', name: 'GDS Terminal Subscriptions (Amadeus & Sabre)', category: 'EXPENSE', subCategory: 'GDS & Tech', balance: 3600, isSystem: true },
  { id: 'acc-6020', code: '6020', name: 'Staff Salaries & Sales Incentives', category: 'EXPENSE', subCategory: 'Personnel', balance: 24500, isSystem: true },
  { id: 'acc-6030', code: '6030', name: 'Office Rent & Commercial Utilities', category: 'EXPENSE', subCategory: 'Occupancy', balance: 8500, isSystem: true },
  { id: 'acc-6040', code: '6040', name: 'Bank Charges & Credit Card Gateway Fees', category: 'EXPENSE', subCategory: 'Financial', balance: 1950, isSystem: true },
  { id: 'acc-6050', code: '6050', name: 'Forex Conversion Loss / Gain', category: 'EXPENSE', subCategory: 'Financial', balance: 850, isSystem: true },
  { id: 'acc-6060', code: '6060', name: 'Airline ADM Losses (Agency Debit Memos)', category: 'EXPENSE', subCategory: 'Losses', balance: 1400, isSystem: true },
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Al-Baraka Logistics Ltd',
    type: 'Corporate',
    contactPerson: 'Tariq Mansoor (Finance Director)',
    email: 'finance@albarakalogistics.com',
    phone: '+971 4 294 8812',
    address: 'Business Bay Tower 4, Dubai, UAE',
    creditLimit: 30000,
    creditDays: 30,
    currentBalance: 14850,
    currency: 'USD'
  },
  {
    id: 'cust-2',
    name: 'Horizon Tech Solutions',
    type: 'Corporate',
    contactPerson: 'Sarah Jenkins',
    email: 'travel@horizontech.io',
    phone: '+44 20 7946 0921',
    address: '12 Bishopsgate, London, UK',
    creditLimit: 25000,
    creditDays: 21,
    currentBalance: 8200,
    currency: 'USD'
  },
  {
    id: 'cust-3',
    name: 'Falcon Sub-Agent Travels',
    type: 'Sub-Agent',
    contactPerson: 'Haji Naeem Qureshi',
    email: 'falconsubagent@gmail.com',
    phone: '+92 300 8492019',
    address: 'Mall Road Office 14, Lahore, Pakistan',
    creditLimit: 15000,
    creditDays: 7,
    currentBalance: 12400,
    currency: 'USD'
  },
  {
    id: 'cust-4',
    name: 'Dr. Zeeshan & Family',
    type: 'Individual',
    contactPerson: 'Dr. Zeeshan Akhtar',
    email: 'dr.zeeshan@medicare.pk',
    phone: '+92 333 4182901',
    address: 'DHA Phase 5, Lahore, Pakistan',
    creditLimit: 0,
    creditDays: 0,
    currentBalance: 0,
    currency: 'USD'
  },
  {
    id: 'cust-5',
    name: 'Apex Petrochemical Group',
    type: 'Corporate',
    contactPerson: 'Eng. Fahad Al-Mutawa',
    email: 'traveldesk@apexpetro.sa',
    phone: '+966 11 482 9900',
    address: 'King Fahd Road, Riyadh, Saudi Arabia',
    creditLimit: 50000,
    creditDays: 45,
    currentBalance: 23550,
    currency: 'USD'
  }
];

export const initialVendors: VendorSupplier[] = [
  {
    id: 'vend-1',
    name: 'IATA BSP Settlement Office',
    type: 'Airline',
    code: 'BSP-IATA',
    contactPerson: 'Billing Desk',
    email: 'bspsettlement@iata.org',
    phone: '+41 22 770 1200',
    balance: 48500,
    currency: 'USD'
  },
  {
    id: 'vend-2',
    name: 'Emirates Airline (Direct NDC)',
    type: 'Airline',
    code: 'EK-176',
    contactPerson: 'Agency Support Desk',
    email: 'agency.dubai@emirates.com',
    phone: '+971 600 555555',
    balance: 14200,
    currency: 'USD'
  },
  {
    id: 'vend-3',
    name: 'Saudi Arabian Airlines (Saudia)',
    type: 'Airline',
    code: 'SV-065',
    contactPerson: 'IATA Coordinator',
    email: 'agencyhelp@saudia.com',
    phone: '+966 9200 22222',
    balance: 9800,
    currency: 'USD'
  },
  {
    id: 'vend-4',
    name: 'Fly365 Global Consolidators',
    type: 'GDS Consolidator',
    code: 'F365-CONS',
    contactPerson: 'Kamran Siddiqui',
    email: 'accounts@fly365global.com',
    phone: '+971 4 399 1100',
    balance: 22400,
    currency: 'USD'
  },
  {
    id: 'vend-5',
    name: 'Hotelbeds Bedbank Ltd',
    type: 'Hotel Provider',
    code: 'HBEDS',
    contactPerson: 'XML Integration Accounts',
    email: 'finance@hotelbeds.com',
    phone: '+34 971 60 78 50',
    balance: 16800,
    currency: 'USD'
  },
  {
    id: 'vend-6',
    name: 'Dar Al-Taqwa Hospitality Makkah',
    type: 'Hotel Provider',
    code: 'DAR-TAQWA',
    contactPerson: 'Hussain Al-Harbi',
    email: 'reservation@daraltaqwa.com',
    phone: '+966 12 555 4400',
    balance: 8500,
    currency: 'USD'
  }
];

export const initialTicketBookings: TicketBooking[] = [
  {
    id: 'tkt-1',
    ticketNumber: '176-2948192034',
    pnr: 'EK89QP',
    gds: 'Amadeus',
    airlineCode: 'EK',
    airlineName: 'Emirates',
    passengerName: 'MR TARIQ / MANSOOR',
    passengerType: 'Adult',
    sector: 'DXB-LHR-DXB',
    flightDate: '2026-11-28',
    issueDate: '2026-11-20',
    cabinClass: 'Business',
    baseFare: 3200,
    taxes: 450,
    grossFare: 3650,
    airlineCommissionPercent: 5.0,
    airlineCommissionAmount: 160,
    markupAmount: 180,
    netCostToAirline: 3490,
    clientSellingPrice: 3830,
    discount: 0,
    customerId: 'cust-1',
    customerName: 'Al-Baraka Logistics Ltd',
    vendorId: 'vend-1',
    status: 'ISSUED',
    paymentStatus: 'UNPAID',
    paidAmount: 0
  },
  {
    id: 'tkt-2',
    ticketNumber: '065-9481029381',
    pnr: 'SV34MK',
    gds: 'Sabre',
    airlineCode: 'SV',
    airlineName: 'Saudia',
    passengerName: 'MR FAHAD / ALMUTAWA',
    passengerType: 'Adult',
    sector: 'RUH-JED-LHE',
    flightDate: '2026-12-02',
    issueDate: '2026-11-19',
    cabinClass: 'Economy',
    baseFare: 680,
    taxes: 120,
    grossFare: 800,
    airlineCommissionPercent: 7.0,
    airlineCommissionAmount: 47.6,
    markupAmount: 50,
    netCostToAirline: 752.4,
    clientSellingPrice: 850,
    discount: 0,
    customerId: 'cust-5',
    customerName: 'Apex Petrochemical Group',
    vendorId: 'vend-1',
    status: 'ISSUED',
    paymentStatus: 'PAID',
    paidAmount: 850
  },
  {
    id: 'tkt-3',
    ticketNumber: '157-4820194820',
    pnr: 'QR99TX',
    gds: 'Amadeus',
    airlineCode: 'QR',
    airlineName: 'Qatar Airways',
    passengerName: 'MS SARAH / JENKINS',
    passengerType: 'Adult',
    sector: 'LHR-DOH-SIN',
    flightDate: '2026-12-05',
    issueDate: '2026-11-18',
    cabinClass: 'Economy',
    baseFare: 1100,
    taxes: 280,
    grossFare: 1380,
    airlineCommissionPercent: 4.5,
    airlineCommissionAmount: 49.5,
    markupAmount: 70,
    netCostToAirline: 1330.5,
    clientSellingPrice: 1450,
    discount: 0,
    customerId: 'cust-2',
    customerName: 'Horizon Tech Solutions',
    vendorId: 'vend-1',
    status: 'ISSUED',
    paymentStatus: 'PARTIAL',
    paidAmount: 700
  },
  {
    id: 'tkt-4',
    ticketNumber: '214-5928104928',
    pnr: 'PK77WZ',
    gds: 'Galileo',
    airlineCode: 'PK',
    airlineName: 'Pakistan Int. Airlines',
    passengerName: 'DR ZEESHAN / AKHTAR',
    passengerType: 'Adult',
    sector: 'ISB-JED-ISB',
    flightDate: '2026-12-10',
    issueDate: '2026-11-17',
    cabinClass: 'Economy',
    baseFare: 850,
    taxes: 140,
    grossFare: 990,
    airlineCommissionPercent: 6.0,
    airlineCommissionAmount: 51,
    markupAmount: 60,
    netCostToAirline: 939,
    clientSellingPrice: 1050,
    discount: 0,
    customerId: 'cust-4',
    customerName: 'Dr. Zeeshan & Family',
    vendorId: 'vend-4',
    status: 'ISSUED',
    paymentStatus: 'PAID',
    paidAmount: 1050
  },
  {
    id: 'tkt-5',
    ticketNumber: '235-9102938102',
    pnr: 'TK41BB',
    gds: 'Direct NDC',
    airlineCode: 'TK',
    airlineName: 'Turkish Airlines',
    passengerName: 'MR ASIM / RAZA',
    passengerType: 'Adult',
    sector: 'IST-JFK-IST',
    flightDate: '2026-11-30',
    issueDate: '2026-11-15',
    cabinClass: 'Economy',
    baseFare: 1400,
    taxes: 310,
    grossFare: 1710,
    airlineCommissionPercent: 5.0,
    airlineCommissionAmount: 70,
    markupAmount: 90,
    netCostToAirline: 1640,
    clientSellingPrice: 1800,
    discount: 0,
    customerId: 'cust-3',
    customerName: 'Falcon Sub-Agent Travels',
    vendorId: 'vend-1',
    status: 'ISSUED',
    paymentStatus: 'UNPAID',
    paidAmount: 0
  }
];

export const initialHotelBookings: HotelBooking[] = [
  {
    id: 'htl-1',
    voucherNo: 'HTL-2026-881',
    confirmationNo: 'CONF-HBD-9912',
    hotelName: 'Swissotel Al Maqam Makkah',
    city: 'Makkah',
    country: 'Saudi Arabia',
    checkIn: '2026-12-10',
    checkOut: '2026-12-16',
    nights: 6,
    roomType: 'Junior Suite Haram View',
    mealPlan: 'Bed & Breakfast',
    guestName: 'Dr. Zeeshan Akhtar (2 Pax)',
    vendorName: 'Hotelbeds Bedbank Ltd',
    buyingCost: 2100,
    sellingPrice: 2550,
    profitMargin: 450,
    customerId: 'cust-4',
    customerName: 'Dr. Zeeshan & Family',
    status: 'CONFIRMED',
    issueDate: '2026-11-17'
  },
  {
    id: 'htl-2',
    voucherNo: 'HTL-2026-882',
    confirmationNo: 'CONF-SHER-3829',
    hotelName: 'The Landmark London',
    city: 'London',
    country: 'United Kingdom',
    checkIn: '2026-11-28',
    checkOut: '2026-12-01',
    nights: 3,
    roomType: 'Executive King Room',
    mealPlan: 'Room Only',
    guestName: 'Tariq Mansoor',
    vendorName: 'Direct Contract',
    buyingCost: 1450,
    sellingPrice: 1750,
    profitMargin: 300,
    customerId: 'cust-1',
    customerName: 'Al-Baraka Logistics Ltd',
    status: 'CONFIRMED',
    issueDate: '2026-11-20'
  }
];

export const initialUmrahPackages: UmrahPackage[] = [
  {
    id: 'umr-1',
    packageCode: 'UMR-DEC-VIP',
    packageName: 'December 12-Day 5-Star VIP Umrah Group',
    groupLeader: 'Maulana Salman Farooq',
    paxCount: 14,
    durationDays: 12,
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    madinahHotel: 'The Oberoi Madinah',
    visaCostPerPax: 150,
    hotelCostPerPax: 1600,
    transportCostPerPax: 220,
    totalCost: 27580,
    sellingPrice: 34300,
    profit: 6720,
    customerId: 'cust-3',
    customerName: 'Falcon Sub-Agent Travels',
    departureDate: '2026-12-15',
    status: 'CONFIRMED'
  }
];

export const initialVisaApplications: VisaApplication[] = [
  {
    id: 'visa-1',
    refNumber: 'VSA-2026-041',
    applicantName: 'Muhammad Arshad',
    passportNumber: 'AB8492019',
    nationality: 'Pakistani',
    destinationCountry: 'United Arab Emirates',
    visaType: 'Tourist 30D',
    embassyFee: 85,
    serviceCharge: 35,
    totalSellingPrice: 120,
    supplierName: 'Gerry’s Visa Drop Box',
    status: 'APPROVED',
    applicationDate: '2026-11-18',
    customerId: 'cust-4',
    customerName: 'Dr. Zeeshan & Family'
  },
  {
    id: 'visa-2',
    refNumber: 'VSA-2026-042',
    applicantName: 'Bilal Ahmed',
    passportNumber: 'CD9381029',
    nationality: 'Pakistani',
    destinationCountry: 'Saudi Arabia',
    visaType: 'Umrah eVisa',
    embassyFee: 135,
    serviceCharge: 45,
    totalSellingPrice: 180,
    supplierName: 'Moafa Saudi Portal',
    status: 'APPROVED',
    applicationDate: '2026-11-19',
    customerId: 'cust-3',
    customerName: 'Falcon Sub-Agent Travels'
  }
];

export const initialRefunds: RefundRecord[] = [
  {
    id: 'ref-1',
    refundNumber: 'RFND-2026-012',
    ticketNumber: '176-9018293811',
    pnr: 'EK11ZZ',
    passengerName: 'MR OMAR / FAROOQ',
    airlineName: 'Emirates',
    customerId: 'cust-1',
    customerName: 'Al-Baraka Logistics Ltd',
    originalGrossFare: 1650,
    airlineCancellationPenalty: 250,
    agencyRefundServiceFee: 50,
    netCustomerRefund: 1350,
    acmNumber: 'ACM-EK-89410',
    refundDate: '2026-11-16',
    status: 'PROCESSED'
  }
];

export const initialADMs: ADMRecord[] = [
  {
    id: 'adm-1',
    admNumber: 'ADM-EK-94819',
    airlineCode: 'EK',
    airlineName: 'Emirates Airline',
    ticketNumber: '176-1892019482',
    pnr: 'EK55WW',
    reason: 'Fare Discrepancy',
    amount: 320,
    issueDate: '2026-11-14',
    dueDate: '2026-11-28',
    status: 'DISPUTED',
    notes: 'Dispute submitted via BSPLink citing published promotional fare rule valid on issue date.'
  },
  {
    id: 'adm-2',
    admNumber: 'ADM-QR-38192',
    airlineCode: 'QR',
    airlineName: 'Qatar Airways',
    ticketNumber: '157-2910391823',
    pnr: 'QR22LL',
    reason: 'Tax Undercollection',
    amount: 85,
    issueDate: '2026-11-10',
    dueDate: '2026-11-24',
    status: 'ACCEPTED_PAID',
    notes: 'Airport development tax differential settled via BSP remittance cycle.'
  }
];

export const initialVouchers: Voucher[] = [
  {
    id: 'vch-1',
    voucherNumber: 'RV-2026-059',
    type: 'RV',
    date: '2026-11-19',
    partyType: 'CUSTOMER',
    partyId: 'cust-5',
    partyName: 'Apex Petrochemical Group',
    amount: 850,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    bankAccount: 'acc-1035',
    referenceNo: 'FT-99120934',
    narration: 'Payment received for PNR SV34MK (Ticket 065-9481029381)',
    status: 'POSTED'
  },
  {
    id: 'vch-2',
    voucherNumber: 'RV-2026-060',
    type: 'RV',
    date: '2026-11-17',
    partyType: 'CUSTOMER',
    partyId: 'cust-4',
    partyName: 'Dr. Zeeshan & Family',
    amount: 3600,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    bankAccount: 'acc-1030',
    referenceNo: 'AUTH-CC-4820',
    narration: 'Full payment for Umrah flight + Swissotel Makkah stay',
    status: 'POSTED'
  },
  {
    id: 'vch-3',
    voucherNumber: 'PV-2026-031',
    type: 'PV',
    date: '2026-11-18',
    partyType: 'VENDOR',
    partyId: 'vend-4',
    partyName: 'Fly365 Global Consolidators',
    amount: 5000,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    bankAccount: 'acc-1030',
    referenceNo: 'TT-7749102',
    narration: 'Partial settlement against November weekly statement',
    status: 'POSTED'
  }
];

export const initialBSPSettlements: BSPSettlement[] = [
  {
    id: 'bsp-1',
    periodName: '2026-11-P1 (01-15 Nov)',
    startDate: '2026-11-01',
    endDate: '2026-11-15',
    airlineCount: 9,
    ticketCount: 48,
    grossSales: 64200,
    refunds: 2400,
    airlineCommissions: 3520,
    taxRemitted: 8100,
    netPayableToIATA: 58280,
    status: 'SETTLED',
    settlementDate: '2026-11-17'
  },
  {
    id: 'bsp-2',
    periodName: '2026-11-P2 (16-30 Nov)',
    startDate: '2026-11-16',
    endDate: '2026-11-30',
    airlineCount: 11,
    ticketCount: 34,
    grossSales: 52400,
    refunds: 1650,
    airlineCommissions: 2890,
    taxRemitted: 6450,
    netPayableToIATA: 47860,
    status: 'PENDING_RECONCILIATION'
  }
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'je-1',
    entryNumber: 'JE-2026-0101',
    date: '2026-11-20',
    voucherType: 'TICKET_ISSUE',
    referenceNo: 'TKT-176-2948192034',
    description: 'Issued e-ticket for Al-Baraka Logistics (PNR: EK89QP, Route: DXB-LHR)',
    totalDebit: 3830,
    totalCredit: 3830,
    createdAt: '2026-11-20T10:30:00Z',
    lines: [
      { accountId: 'acc-1100', accountCode: '1100', accountName: 'Accounts Receivable - Corporate Clients', debit: 3830, credit: 0, description: 'Al-Baraka Logistics balance' },
      { accountId: 'acc-2010', accountCode: '2010', accountName: 'Accounts Payable - IATA BSP Airlines', debit: 0, credit: 3490, description: 'Net payable to Emirates (Gross 3650 - Comm 160)' },
      { accountId: 'acc-4010', accountCode: '4010', accountName: 'Airline Standard Commission Income', debit: 0, credit: 160, description: '5% Standard airline commission' },
      { accountId: 'acc-4030', accountCode: '4030', accountName: 'Ticket Agency Service Fee & Markup', debit: 0, credit: 180, description: 'Corporate booking fee markup' }
    ]
  },
  {
    id: 'je-2',
    entryNumber: 'JE-2026-0102',
    date: '2026-11-19',
    voucherType: 'RECEIPT',
    referenceNo: 'RV-2026-059',
    description: 'Bank payment received from Apex Petrochemical for PNR SV34MK',
    totalDebit: 850,
    totalCredit: 850,
    createdAt: '2026-11-19T14:15:00Z',
    lines: [
      { accountId: 'acc-1035', accountCode: '1035', accountName: 'USD Foreign Currency Bank A/c', debit: 850, credit: 0, description: 'Funds deposited' },
      { accountId: 'acc-1100', accountCode: '1100', accountName: 'Accounts Receivable - Corporate Clients', debit: 0, credit: 850, description: 'Cleared invoice for PNR SV34MK' }
    ]
  },
  {
    id: 'je-3',
    entryNumber: 'JE-2026-0103',
    date: '2026-11-18',
    voucherType: 'PAYMENT',
    referenceNo: 'PV-2026-031',
    description: 'Bank wire transfer payment to Fly365 Global Consolidators',
    totalDebit: 5000,
    totalCredit: 5000,
    createdAt: '2026-11-18T16:00:00Z',
    lines: [
      { accountId: 'acc-2020', accountCode: '2020', accountName: 'Accounts Payable - GDS Consolidators', debit: 5000, credit: 0, description: 'Settlement payment' },
      { accountId: 'acc-1030', accountCode: '1030', accountName: 'Commercial Bank Operating A/c', debit: 0, credit: 5000, description: 'Bank wire release' }
    ]
  }
];
