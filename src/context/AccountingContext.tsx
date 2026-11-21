import React, { createContext, useContext, useState, useEffect } from 'react';
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
  CurrencyCode,
  ExchangeRate
} from '../types';
import {
  initialChartOfAccounts,
  initialCustomers,
  initialVendors,
  initialTicketBookings,
  initialHotelBookings,
  initialUmrahPackages,
  initialVisaApplications,
  initialRefunds,
  initialADMs,
  initialVouchers,
  initialBSPSettlements,
  initialJournalEntries,
  initialExchangeRates
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AccountingContextType {
  // State
  accounts: Account[];
  customers: Customer[];
  vendors: VendorSupplier[];
  tickets: TicketBooking[];
  hotels: HotelBooking[];
  umrahPackages: UmrahPackage[];
  visas: VisaApplication[];
  refunds: RefundRecord[];
  adms: ADMRecord[];
  vouchers: Voucher[];
  bspSettlements: BSPSettlement[];
  journalEntries: JournalEntry[];
  activeCurrency: CurrencyCode;
  exchangeRates: ExchangeRate[];
  isOperating: boolean;
  operationStatusText: string;
  operationProgress: number;
  toasts: Toast[];

  // Actions
  setActiveCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amount: number, targetCurrency?: CurrencyCode) => string;
  convertAmount: (amount: number, targetCurrency?: CurrencyCode) => number;
  showToast: (title: string, message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  
  // Business Operations
  issueTicket: (ticketData: Omit<TicketBooking, 'id' | 'grossFare' | 'netCostToAirline' | 'clientSellingPrice' | 'airlineCommissionAmount'>) => Promise<TicketBooking>;
  processRefund: (refundData: Omit<RefundRecord, 'id' | 'refundNumber' | 'status'>) => Promise<RefundRecord>;
  createVoucher: (voucherData: Omit<Voucher, 'id' | 'voucherNumber'>) => Promise<Voucher>;
  addHotelBooking: (hotelData: Omit<HotelBooking, 'id' | 'voucherNo' | 'profitMargin'>) => Promise<HotelBooking>;
  addVisaApplication: (visaData: Omit<VisaApplication, 'id' | 'refNumber' | 'totalSellingPrice'>) => Promise<VisaApplication>;
  addCustomer: (customerData: Omit<Customer, 'id' | 'currentBalance'>) => void;
  addVendor: (vendorData: Omit<VendorSupplier, 'id' | 'balance'>) => void;
  reconcileBSPCycle: (periodId: string) => Promise<void>;
  postDirectJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'createdAt'>) => boolean;
  resetToDefaults: () => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state with local storage fallback
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('vl_accounts');
    return saved ? JSON.parse(saved) : initialChartOfAccounts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vl_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [vendors, setVendors] = useState<VendorSupplier[]>(() => {
    const saved = localStorage.getItem('vl_vendors');
    return saved ? JSON.parse(saved) : initialVendors;
  });

  const [tickets, setTickets] = useState<TicketBooking[]>(() => {
    const saved = localStorage.getItem('vl_tickets');
    return saved ? JSON.parse(saved) : initialTicketBookings;
  });

  const [hotels, setHotels] = useState<HotelBooking[]>(() => {
    const saved = localStorage.getItem('vl_hotels');
    return saved ? JSON.parse(saved) : initialHotelBookings;
  });

  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>(() => {
    const saved = localStorage.getItem('vl_umrah');
    return saved ? JSON.parse(saved) : initialUmrahPackages;
  });

  const [visas, setVisas] = useState<VisaApplication[]>(() => {
    const saved = localStorage.getItem('vl_visas');
    return saved ? JSON.parse(saved) : initialVisaApplications;
  });

  const [refunds, setRefunds] = useState<RefundRecord[]>(() => {
    const saved = localStorage.getItem('vl_refunds');
    return saved ? JSON.parse(saved) : initialRefunds;
  });

  const [adms, setAdms] = useState<ADMRecord[]>(() => {
    const saved = localStorage.getItem('vl_adms');
    return saved ? JSON.parse(saved) : initialADMs;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('vl_vouchers');
    return saved ? JSON.parse(saved) : initialVouchers;
  });

  const [bspSettlements, setBspSettlements] = useState<BSPSettlement[]>(() => {
    const saved = localStorage.getItem('vl_bsp');
    return saved ? JSON.parse(saved) : initialBSPSettlements;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('vl_journals');
    return saved ? JSON.parse(saved) : initialJournalEntries;
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [exchangeRates] = useState<ExchangeRate[]>(initialExchangeRates);

  // Animated creamy loading bar state
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const [operationStatusText, setOperationStatusText] = useState<string>('');
  const [operationProgress, setOperationProgress] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vl_accounts', JSON.stringify(accounts));
    localStorage.setItem('vl_customers', JSON.stringify(customers));
    localStorage.setItem('vl_vendors', JSON.stringify(vendors));
    localStorage.setItem('vl_tickets', JSON.stringify(tickets));
    localStorage.setItem('vl_hotels', JSON.stringify(hotels));
    localStorage.setItem('vl_umrah', JSON.stringify(umrahPackages));
    localStorage.setItem('vl_visas', JSON.stringify(visas));
    localStorage.setItem('vl_refunds', JSON.stringify(refunds));
    localStorage.setItem('vl_adms', JSON.stringify(adms));
    localStorage.setItem('vl_vouchers', JSON.stringify(vouchers));
    localStorage.setItem('vl_bsp', JSON.stringify(bspSettlements));
    localStorage.setItem('vl_journals', JSON.stringify(journalEntries));
  }, [accounts, customers, vendors, tickets, hotels, umrahPackages, visas, refunds, adms, vouchers, bspSettlements, journalEntries]);

  const showToast = (title: string, message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency helper
  const convertAmount = (amountUSD: number, targetCurrency: CurrencyCode = activeCurrency): number => {
    const rateObj = exchangeRates.find(r => r.code === targetCurrency);
    const rate = rateObj ? rateObj.rateToBase : 1;
    return amountUSD * rate;
  };

  const formatCurrency = (amountUSD: number, targetCurrency: CurrencyCode = activeCurrency): string => {
    const rateObj = exchangeRates.find(r => r.code === targetCurrency) || exchangeRates[0];
    const converted = amountUSD * rateObj.rateToBase;
    return `${rateObj.symbol} ${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Simulate Creamy Loading Progress
  const runSimulatedProgress = async (text: string, durationMs: number = 700): Promise<void> => {
    setIsOperating(true);
    setOperationStatusText(text);
    setOperationProgress(15);
    
    await new Promise(r => setTimeout(r, durationMs * 0.3));
    setOperationProgress(55);
    
    await new Promise(r => setTimeout(r, durationMs * 0.4));
    setOperationProgress(90);
    
    await new Promise(r => setTimeout(r, durationMs * 0.3));
    setOperationProgress(100);
    
    setTimeout(() => {
      setIsOperating(false);
      setOperationProgress(0);
      setOperationStatusText('');
    }, 250);
  };

  // Issue Air Ticket with automatic double-entry journal entry
  const issueTicket = async (data: Omit<TicketBooking, 'id' | 'grossFare' | 'netCostToAirline' | 'clientSellingPrice' | 'airlineCommissionAmount'>): Promise<TicketBooking> => {
    await runSimulatedProgress(`Issuing e-ticket ${data.ticketNumber} & posting to General Ledger...`, 800);

    const commAmount = (data.baseFare * data.airlineCommissionPercent) / 100;
    const grossFare = data.baseFare + data.taxes;
    const netCostToAirline = grossFare - commAmount;
    const clientSellingPrice = grossFare + data.markupAmount - data.discount;

    const newTicket: TicketBooking = {
      ...data,
      id: `tkt-${Date.now()}`,
      grossFare,
      airlineCommissionAmount: commAmount,
      netCostToAirline,
      clientSellingPrice,
      status: 'ISSUED',
      paymentStatus: data.paidAmount >= clientSellingPrice ? 'PAID' : data.paidAmount > 0 ? 'PARTIAL' : 'UNPAID',
    };

    // Auto-create Double-Entry Journal Entry
    const entryId = `je-${Date.now()}`;
    const entryNumber = `JE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const journalLines = [
      // 1. Debit Accounts Receivable (Customer owes total selling price)
      {
        accountId: 'acc-1100',
        accountCode: '1100',
        accountName: 'Accounts Receivable - Corporate Clients',
        debit: clientSellingPrice,
        credit: 0,
        description: `Receivable from ${data.customerName} for PNR ${data.pnr}`
      },
      // 2. Credit Accounts Payable (Net cost owed to Airline / BSP)
      {
        accountId: 'acc-2010',
        accountCode: '2010',
        accountName: 'Accounts Payable - IATA BSP Airlines',
        debit: 0,
        credit: netCostToAirline,
        description: `Payable to ${data.airlineName} (Net of Comm)`
      },
      // 3. Credit Airline Commission Revenue
      {
        accountId: 'acc-4010',
        accountCode: '4010',
        accountName: 'Airline Standard Commission Income',
        debit: 0,
        credit: commAmount,
        description: `${data.airlineCommissionPercent}% Commission earned`
      },
      // 4. Credit Markup / Agency Fee
      ...(data.markupAmount > 0 ? [{
        accountId: 'acc-4030',
        accountCode: '4030',
        accountName: 'Ticket Agency Service Fee & Markup',
        debit: 0,
        credit: data.markupAmount,
        description: `Agency service markup for ${data.passengerName}`
      }] : [])
    ];

    const totalDebit = clientSellingPrice;
    const totalCredit = netCostToAirline + commAmount + (data.markupAmount || 0);

    const newJournalEntry: JournalEntry = {
      id: entryId,
      entryNumber,
      date: data.issueDate,
      voucherType: 'TICKET_ISSUE',
      referenceNo: `TKT-${data.ticketNumber}`,
      description: `Issued e-ticket for ${data.passengerName} (PNR: ${data.pnr}, Route: ${data.sector})`,
      lines: journalLines,
      totalDebit,
      totalCredit,
      createdAt: new Date().toISOString()
    };

    // Update balances
    setTickets(prev => [newTicket, ...prev]);
    setJournalEntries(prev => [newJournalEntry, ...prev]);

    // Update customer balance if unpaid
    const unpaidAmount = clientSellingPrice - (data.paidAmount || 0);
    if (unpaidAmount > 0) {
      setCustomers(prev => prev.map(c => c.id === data.customerId ? { ...c, currentBalance: c.currentBalance + unpaidAmount } : c));
    }

    // Update vendor payable
    setVendors(prev => prev.map(v => v.id === data.vendorId ? { ...v, balance: v.balance + netCostToAirline } : v));

    // Update account balances
    setAccounts(prev => prev.map(acc => {
      if (acc.code === '1100') return { ...acc, balance: acc.balance + unpaidAmount };
      if (acc.code === '2010') return { ...acc, balance: acc.balance + netCostToAirline };
      if (acc.code === '4010') return { ...acc, balance: acc.balance + commAmount };
      if (acc.code === '4030') return { ...acc, balance: acc.balance + data.markupAmount };
      return acc;
    }));

    showToast('Ticket Issued & Posted!', `PNR ${data.pnr} issued for ${data.passengerName}. Double-entry journal ${entryNumber} recorded.`);
    return newTicket;
  };

  // Process Ticket Refund
  const processRefund = async (data: Omit<RefundRecord, 'id' | 'refundNumber' | 'status'>): Promise<RefundRecord> => {
    await runSimulatedProgress(`Calculating ticket refund & creating Credit Adjustment...`, 700);

    const refundId = `ref-${Date.now()}`;
    const refundNumber = `RFND-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRefund: RefundRecord = {
      ...data,
      id: refundId,
      refundNumber,
      status: 'PROCESSED'
    };

    // Update ticket status
    setTickets(prev => prev.map(t => t.ticketNumber === data.ticketNumber ? { ...t, status: 'REFUNDED' } : t));
    setRefunds(prev => [newRefund, ...prev]);

    // Auto-journal for refund
    const entryNumber = `JE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newJournal: JournalEntry = {
      id: `je-${Date.now()}`,
      entryNumber,
      date: data.refundDate,
      voucherType: 'REFUND',
      referenceNo: refundNumber,
      description: `Refund processed for Ticket ${data.ticketNumber} (${data.passengerName})`,
      totalDebit: data.originalGrossFare,
      totalCredit: data.originalGrossFare,
      createdAt: new Date().toISOString(),
      lines: [
        {
          accountId: 'acc-2010',
          accountCode: '2010',
          accountName: 'Accounts Payable - IATA BSP Airlines',
          debit: data.originalGrossFare - data.airlineCancellationPenalty,
          credit: 0,
          description: `Airline ACM credit receivable for ticket ${data.ticketNumber}`
        },
        {
          accountId: 'acc-1100',
          accountCode: '1100',
          accountName: 'Accounts Receivable - Corporate Clients',
          debit: 0,
          credit: data.netCustomerRefund,
          description: `Customer refund credit credited to ${data.customerName}`
        },
        {
          accountId: 'acc-4080',
          accountCode: '4080',
          accountName: 'Ticket Refund Processing Service Fee',
          debit: 0,
          credit: data.agencyRefundServiceFee,
          description: `Agency refund processing income`
        }
      ]
    };

    setJournalEntries(prev => [newJournal, ...prev]);

    // Adjust customer and vendor balances
    setCustomers(prev => prev.map(c => c.id === data.customerId ? { ...c, currentBalance: Math.max(0, c.currentBalance - data.netCustomerRefund) } : c));
    setVendors(prev => prev.map(v => v.code.includes('BSP') ? { ...v, balance: Math.max(0, v.balance - (data.originalGrossFare - data.airlineCancellationPenalty)) } : v));

    showToast('Refund Processed', `Refund ${refundNumber} of ${formatCurrency(data.netCustomerRefund)} processed successfully.`);
    return newRefund;
  };

  // Create Voucher (Receipt, Payment, Journal)
  const createVoucher = async (data: Omit<Voucher, 'id' | 'voucherNumber'>): Promise<Voucher> => {
    await runSimulatedProgress(`Posting ${data.type} Voucher ${data.referenceNo}...`, 600);

    const id = `vch-${Date.now()}`;
    const voucherNumber = `${data.type}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newVoucher: Voucher = {
      ...data,
      id,
      voucherNumber,
      status: 'POSTED'
    };

    setVouchers(prev => [newVoucher, ...prev]);

    // Post to accounting journal
    const entryNumber = `JE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const bankOrCashAccId = data.paymentMethod === 'Cash' ? 'acc-1010' : (data.bankAccount || 'acc-1030');
    const bankOrCashAcc = accounts.find(a => a.id === bankOrCashAccId) || accounts[2];

    let lines = [];
    if (data.type === 'RV') {
      // Customer payment received: Dr Cash/Bank, Cr Accounts Receivable
      lines = [
        {
          accountId: bankOrCashAcc.id,
          accountCode: bankOrCashAcc.code,
          accountName: bankOrCashAcc.name,
          debit: data.amount,
          credit: 0,
          description: `Funds received via ${data.paymentMethod} (Ref: ${data.referenceNo})`
        },
        {
          accountId: 'acc-1100',
          accountCode: '1100',
          accountName: 'Accounts Receivable - Corporate Clients',
          debit: 0,
          credit: data.amount,
          description: `Payment from ${data.partyName}`
        }
      ];
      // Reduce customer balance
      setCustomers(prev => prev.map(c => c.id === data.partyId ? { ...c, currentBalance: c.currentBalance - data.amount } : c));
      // Increase bank balance
      setAccounts(prev => prev.map(a => a.id === bankOrCashAcc.id ? { ...a, balance: a.balance + data.amount } : a));
    } else if (data.type === 'PV') {
      // Payment to Vendor: Dr Accounts Payable, Cr Cash/Bank
      lines = [
        {
          accountId: 'acc-2010',
          accountCode: '2010',
          accountName: 'Accounts Payable - IATA BSP Airlines',
          debit: data.amount,
          credit: 0,
          description: `Settlement to ${data.partyName}`
        },
        {
          accountId: bankOrCashAcc.id,
          accountCode: bankOrCashAcc.code,
          accountName: bankOrCashAcc.name,
          debit: 0,
          credit: data.amount,
          description: `Payment released via ${data.paymentMethod}`
        }
      ];
      // Reduce vendor balance
      setVendors(prev => prev.map(v => v.id === data.partyId ? { ...v, balance: v.balance - data.amount } : v));
      // Decrease bank balance
      setAccounts(prev => prev.map(a => a.id === bankOrCashAcc.id ? { ...a, balance: a.balance - data.amount } : a));
    } else {
      lines = [
        {
          accountId: 'acc-6030',
          accountCode: '6030',
          accountName: 'Office Rent & Commercial Utilities',
          debit: data.amount,
          credit: 0,
          description: data.narration
        },
        {
          accountId: bankOrCashAcc.id,
          accountCode: bankOrCashAcc.code,
          accountName: bankOrCashAcc.name,
          debit: 0,
          credit: data.amount,
          description: `Voucher settlement`
        }
      ];
    }

    const journal: JournalEntry = {
      id: `je-${Date.now()}`,
      entryNumber,
      date: data.date,
      voucherType: data.type === 'RV' ? 'RECEIPT' : data.type === 'PV' ? 'PAYMENT' : 'JOURNAL',
      referenceNo: voucherNumber,
      description: data.narration || `${data.type} for ${data.partyName}`,
      totalDebit: data.amount,
      totalCredit: data.amount,
      createdAt: new Date().toISOString(),
      lines
    };

    setJournalEntries(prev => [journal, ...prev]);
    showToast(`Voucher ${voucherNumber} Created`, `${data.type} posted for ${formatCurrency(data.amount)}.`);
    return newVoucher;
  };

  // Add Hotel Booking
  const addHotelBooking = async (data: Omit<HotelBooking, 'id' | 'voucherNo' | 'profitMargin'>): Promise<HotelBooking> => {
    await runSimulatedProgress(`Generating Hotel Voucher for ${data.hotelName}...`, 600);
    const voucherNo = `HTL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const profitMargin = data.sellingPrice - data.buyingCost;

    const newBooking: HotelBooking = {
      ...data,
      id: `htl-${Date.now()}`,
      voucherNo,
      profitMargin
    };

    setHotels(prev => [newBooking, ...prev]);

    // Update account balances: Dr Client Receivable, Cr Hotel Vendor, Cr Hotel Commission Revenue
    setAccounts(prev => prev.map(a => {
      if (a.code === '1100') return { ...a, balance: a.balance + data.sellingPrice };
      if (a.code === '2040') return { ...a, balance: a.balance + data.buyingCost };
      if (a.code === '4040') return { ...a, balance: a.balance + profitMargin };
      return a;
    }));

    showToast('Hotel Voucher Issued', `${data.hotelName} booked for ${data.guestName} (${voucherNo}).`);
    return newBooking;
  };

  // Add Visa Application
  const addVisaApplication = async (data: Omit<VisaApplication, 'id' | 'refNumber' | 'totalSellingPrice'>): Promise<VisaApplication> => {
    await runSimulatedProgress(`Submitting Visa Application for ${data.applicantName}...`, 600);
    const refNumber = `VSA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const totalSellingPrice = data.embassyFee + data.serviceCharge;

    const newVisa: VisaApplication = {
      ...data,
      id: `visa-${Date.now()}`,
      refNumber,
      totalSellingPrice
    };

    setVisas(prev => [newVisa, ...prev]);

    setAccounts(prev => prev.map(a => {
      if (a.code === '1100') return { ...a, balance: a.balance + totalSellingPrice };
      if (a.code === '2050') return { ...a, balance: a.balance + data.embassyFee };
      if (a.code === '4060') return { ...a, balance: a.balance + data.serviceCharge };
      return a;
    }));

    showToast('Visa Application Logged', `${data.destinationCountry} visa for ${data.applicantName} logged (${refNumber}).`);
    return newVisa;
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'currentBalance'>) => {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      currentBalance: 0
    };
    setCustomers(prev => [...prev, newCustomer]);
    showToast('Customer Added', `${data.name} profile created.`);
  };

  const addVendor = (data: Omit<VendorSupplier, 'id' | 'balance'>) => {
    const newVendor: VendorSupplier = {
      ...data,
      id: `vend-${Date.now()}`,
      balance: 0
    };
    setVendors(prev => [...prev, newVendor]);
    showToast('Supplier Added', `${data.name} supplier created.`);
  };

  // Reconcile BSP Settlement Period
  const reconcileBSPCycle = async (periodId: string) => {
    await runSimulatedProgress('Importing GDS Billing Data & Reconciling BSP Fortnight...', 1200);

    setBspSettlements(prev => prev.map(b => {
      if (b.id === periodId) {
        return {
          ...b,
          status: 'RECONCILED'
        };
      }
      return b;
    }));

    showToast('BSP Billing Reconciled', 'IATA billing feed matched with zero unmatched variance.');
  };

  // Manual General Journal Voucher
  const postDirectJournalEntry = (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'createdAt'>): boolean => {
    if (Math.abs(entry.totalDebit - entry.totalCredit) > 0.01) {
      showToast('Validation Error', 'Debit and Credit totals must be exactly equal.', 'error');
      return false;
    }

    const entryNumber = `JE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}`,
      entryNumber,
      createdAt: new Date().toISOString()
    };

    setJournalEntries(prev => [newEntry, ...prev]);
    showToast('Journal Entry Posted', `Journal voucher ${entryNumber} posted to General Ledger.`);
    return true;
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setAccounts(initialChartOfAccounts);
    setCustomers(initialCustomers);
    setVendors(initialVendors);
    setTickets(initialTicketBookings);
    setHotels(initialHotelBookings);
    setUmrahPackages(initialUmrahPackages);
    setVisas(initialVisaApplications);
    setRefunds(initialRefunds);
    setAdms(initialADMs);
    setVouchers(initialVouchers);
    setBspSettlements(initialBSPSettlements);
    setJournalEntries(initialJournalEntries);
    showToast('Reset Complete', 'Loaded sample travel agency accounts and bookings.');
  };

  return (
    <AccountingContext.Provider
      value={{
        accounts,
        customers,
        vendors,
        tickets,
        hotels,
        umrahPackages,
        visas,
        refunds,
        adms,
        vouchers,
        bspSettlements,
        journalEntries,
        activeCurrency,
        exchangeRates,
        isOperating,
        operationStatusText,
        operationProgress,
        toasts,
        setActiveCurrency,
        formatCurrency,
        convertAmount,
        showToast,
        dismissToast,
        issueTicket,
        processRefund,
        createVoucher,
        addHotelBooking,
        addVisaApplication,
        addCustomer,
        addVendor,
        reconcileBSPCycle,
        postDirectJournalEntry,
        resetToDefaults
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
