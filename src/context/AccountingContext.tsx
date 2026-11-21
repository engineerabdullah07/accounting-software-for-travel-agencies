import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Account,
  Party,
  SaleInvoice,
  SupplierBill,
  Voucher,
  LedgerTransaction,
  AgencyProfile
} from '../types';
import {
  initialChartOfAccounts,
  initialParties,
  initialSalesInvoices,
  initialSupplierBills,
  initialVouchers
} from '../data/mockData';
import { getDeviceFingerprint } from '../utils/fingerprint';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AccountingContextType {
  accounts: Account[];
  parties: Party[];
  salesInvoices: SaleInvoice[];
  supplierBills: SupplierBill[];
  vouchers: Voucher[];
  
  agencyProfile: AgencyProfile;
  deviceFingerprint: string;
  isLocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  updateAgencyProfile: (profile: Partial<AgencyProfile>) => void;
  clearDataForNewAgency: (agencyName: string, pin: string) => void;

  activeCurrency: string;
  currencySymbol: string;
  setActiveCurrency: (curr: string) => void;
  formatMoney: (amount: number) => string;
  
  isOperating: boolean;
  operationStatusText: string;
  operationProgress: number;
  toasts: Toast[];
  showToast: (title: string, message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Real Accounting Actions
  addSaleInvoice: (invoice: Omit<SaleInvoice, 'id' | 'invoiceNumber' | 'totalCost' | 'totalSale' | 'totalProfit' | 'balanceDue' | 'status'>) => Promise<SaleInvoice>;
  addSupplierBill: (bill: Omit<SupplierBill, 'id' | 'billNumber' | 'balanceDue' | 'status'>) => Promise<SupplierBill>;
  addVoucher: (voucher: Omit<Voucher, 'id' | 'voucherNumber'>) => Promise<Voucher>;
  addParty: (party: Omit<Party, 'id' | 'currentBalance'>) => void;
  addAccount: (account: Omit<Account, 'id' | 'balance'>) => void;
  
  // Ledger generation helpers
  getPartyLedger: (partyId: string, fromDate?: string, toDate?: string) => LedgerTransaction[];
  getAccountLedger: (accountId: string, fromDate?: string, toDate?: string) => LedgerTransaction[];
  getDayBook: (date: string) => Array<{ time: string; voucherNo: string; type: string; narration: string; debit: number; credit: number }>;
  
  // Data maintenance
  resetToSampleData: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('ta_accounts');
    return saved ? JSON.parse(saved) : initialChartOfAccounts;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('ta_parties');
    return saved ? JSON.parse(saved) : initialParties;
  });

  const [salesInvoices, setSalesInvoices] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('ta_invoices');
    return saved ? JSON.parse(saved) : initialSalesInvoices;
  });

  const [supplierBills, setSupplierBills] = useState<SupplierBill[]>(() => {
    const saved = localStorage.getItem('ta_bills');
    return saved ? JSON.parse(saved) : initialSupplierBills;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('ta_vouchers');
    return saved ? JSON.parse(saved) : initialVouchers;
  });

  const deviceFingerprint = getDeviceFingerprint();

  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(() => {
    const saved = localStorage.getItem('ta_agency_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.agencyName === 'Al-Haramain Travels & Tours') {
          return {
            ...parsed,
            agencyName: 'My Travel Agency',
            tagline: 'Complete Travel & Tourism Accounting',
            licenseNo: 'IATA-LIC-001',
            email: 'accounts@travelagency.com',
            isConfigured: false,
            deviceFingerprint
          };
        }
        return { ...parsed, deviceFingerprint };
      } catch (e) {}
    }
    return {
      agencyName: 'My Travel Agency',
      tagline: 'Complete Travel & Tourism Accounting',
      licenseNo: 'IATA-LIC-001',
      phone: '+92 300 0000000',
      email: 'accounts@travelagency.com',
      address: 'Office #1, Commercial Area',
      pinCode: '1234',
      isLockEnabled: true,
      deviceFingerprint,
      createdAt: new Date().toISOString(),
      isConfigured: false
    };
  });

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const savedProfile = localStorage.getItem('ta_agency_profile');
    const isLockOn = savedProfile ? JSON.parse(savedProfile).isLockEnabled : true;
    if (!isLockOn) return false;
    const sessionUnlocked = sessionStorage.getItem('ta_session_unlocked');
    return sessionUnlocked !== 'true';
  });

  const [activeCurrency, setActiveCurrency] = useState<string>('PKR');
  const currencySymbol = activeCurrency === 'USD' ? '$' : activeCurrency === 'SAR' ? '﷼' : activeCurrency === 'AED' ? 'AED' : 'Rs';

  // Creamy loading bar & toasts
  const [isOperating, setIsOperating] = useState(false);
  const [operationStatusText, setOperationStatusText] = useState('');
  const [operationProgress, setOperationProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('ta_accounts', JSON.stringify(accounts));
    localStorage.setItem('ta_parties', JSON.stringify(parties));
    localStorage.setItem('ta_invoices', JSON.stringify(salesInvoices));
    localStorage.setItem('ta_bills', JSON.stringify(supplierBills));
    localStorage.setItem('ta_vouchers', JSON.stringify(vouchers));
    localStorage.setItem('ta_agency_profile', JSON.stringify(agencyProfile));
  }, [accounts, parties, salesInvoices, supplierBills, vouchers, agencyProfile]);

  const unlockApp = (pin: string): boolean => {
    if (pin.trim() === (agencyProfile.pinCode || '1234')) {
      setIsLocked(false);
      sessionStorage.setItem('ta_session_unlocked', 'true');
      showToast('Vault Unlocked', `Welcome to ${agencyProfile.agencyName} Accounts.`, 'success');
      return true;
    } else {
      showToast('Access Denied', 'Ghalat PIN code! Please enter correct 4-digit security PIN.', 'error');
      return false;
    }
  };

  const lockApp = () => {
    sessionStorage.removeItem('ta_session_unlocked');
    setIsLocked(true);
    showToast('Vault Locked', 'Agency accounts have been locked for security.', 'info');
  };

  const updateAgencyProfile = (profileUpdate: Partial<AgencyProfile>) => {
    setAgencyProfile(prev => ({ ...prev, ...profileUpdate }));
    showToast('Agency Profile Updated', 'Settings saved to your local device vault.', 'success');
  };

  const clearDataForNewAgency = (newAgencyName: string, newPin: string) => {
    setSalesInvoices([]);
    setSupplierBills([]);
    setVouchers([]);
    setParties([]);
    setAccounts(initialChartOfAccounts.map(a => ({ ...a, balance: 0 })));
    setAgencyProfile(prev => ({
      ...prev,
      agencyName: newAgencyName.trim() || 'My Travel Agency',
      pinCode: newPin.trim() || '1234',
      tagline: 'Complete Travel & Tourism Accounting',
      licenseNo: 'LIC-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString()
    }));
    sessionStorage.setItem('ta_session_unlocked', 'true');
    setIsLocked(false);
    showToast('New Agency Initialized', `100% Clean Workspace for ${newAgencyName} created!`, 'success');
  };

  const showToast = (title: string, message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatMoney = (amount: number): string => {
    return `${currencySymbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const runSimulatedProgress = async (text: string, durationMs: number = 600): Promise<void> => {
    setIsOperating(true);
    setOperationStatusText(text);
    setOperationProgress(25);
    await new Promise(r => setTimeout(r, durationMs * 0.4));
    setOperationProgress(75);
    await new Promise(r => setTimeout(r, durationMs * 0.4));
    setOperationProgress(100);
    setTimeout(() => {
      setIsOperating(false);
      setOperationProgress(0);
      setOperationStatusText('');
    }, 200);
  };

  // Add Sale Invoice (Air Ticket, Hotel, Umrah, Visa)
  const addSaleInvoice = async (data: Omit<SaleInvoice, 'id' | 'invoiceNumber' | 'totalCost' | 'totalSale' | 'totalProfit' | 'balanceDue' | 'status'>): Promise<SaleInvoice> => {
    await runSimulatedProgress('Posting Travel Sales Invoice & Updating General Ledgers...', 650);

    const totalSale = data.items.reduce((acc, it) => acc + it.salePrice, 0);
    const totalCost = data.items.reduce((acc, it) => acc + it.costPrice, 0);
    const totalProfit = totalSale - totalCost;
    const balanceDue = Math.max(0, totalSale - data.paidAmount);
    const status: SaleInvoice['status'] = balanceDue <= 0 ? 'PAID' : data.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: SaleInvoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      totalSale,
      totalCost,
      totalProfit,
      balanceDue,
      status
    };

    setSalesInvoices(prev => [newInvoice, ...prev]);

    // Update Customer Balance (Receivable increased by balanceDue)
    if (balanceDue > 0) {
      setParties(prev => prev.map(p => p.id === data.customerId ? { ...p, currentBalance: p.currentBalance + balanceDue } : p));
    }

    // Update Suppliers Payables (Cost owed to suppliers)
    data.items.forEach(item => {
      if (item.supplierId && item.costPrice > 0) {
        setParties(prev => prev.map(p => p.id === item.supplierId ? { ...p, currentBalance: p.currentBalance + item.costPrice } : p));
      }
    });

    // Update Account Balances
    setAccounts(prev => prev.map(acc => {
      if (acc.code === '1100') return { ...acc, balance: acc.balance + balanceDue }; // Receivables
      if (acc.code === '2010') return { ...acc, balance: acc.balance + totalCost }; // Payables
      if (acc.code === '4010') return { ...acc, balance: acc.balance + totalProfit }; // Revenue / Profit
      if (data.paidAmount > 0 && acc.id === (data.depositAccountId || 'acc-1010')) {
        return { ...acc, balance: acc.balance + data.paidAmount };
      }
      return acc;
    }));

    showToast('Sales Invoice Created', `Invoice ${invoiceNumber} created. Customer ledger and supplier accounts updated.`);
    return newInvoice;
  };

  // Add Supplier Bill (BSP Statement / Consolidator Bill)
  const addSupplierBill = async (data: Omit<SupplierBill, 'id' | 'billNumber' | 'balanceDue' | 'status'>): Promise<SupplierBill> => {
    await runSimulatedProgress(`Logging Supplier Bill for ${data.supplierName}...`, 500);

    const balanceDue = Math.max(0, data.amount - data.paidAmount);
    const billNumber = `BILL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newBill: SupplierBill = {
      ...data,
      id: `bill-${Date.now()}`,
      billNumber,
      balanceDue,
      status: balanceDue <= 0 ? 'PAID' : data.paidAmount > 0 ? 'PARTIAL' : 'UNPAID'
    };

    setSupplierBills(prev => [newBill, ...prev]);

    // Update Supplier Balance (We owe supplier more)
    setParties(prev => prev.map(p => p.id === data.supplierId ? { ...p, currentBalance: p.currentBalance + balanceDue } : p));
    
    // Update Accounts Payable GL
    setAccounts(prev => prev.map(a => a.code === '2010' ? { ...a, balance: a.balance + balanceDue } : a));

    showToast('Supplier Bill Logged', `Bill ${billNumber} recorded for ${data.supplierName}.`);
    return newBill;
  };

  // Add Voucher (RV, PV, JV, CN, DN)
  const addVoucher = async (data: Omit<Voucher, 'id' | 'voucherNumber'>): Promise<Voucher> => {
    await runSimulatedProgress(`Posting ${data.type} Voucher...`, 550);

    const voucherNumber = `${data.type}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newVoucher: Voucher = {
      ...data,
      id: `vch-${Date.now()}`,
      voucherNumber
    };

    setVouchers(prev => [newVoucher, ...prev]);

    // 1. If RV (Receipt from Client): reduce Customer's receivable balance
    if (data.type === 'RV' && data.partyId) {
      setParties(prev => prev.map(p => p.id === data.partyId ? { ...p, currentBalance: Math.max(0, p.currentBalance - data.amount) } : p));
    }

    // 2. If PV (Payment to Supplier): reduce Supplier's payable balance
    if (data.type === 'PV' && data.partyId) {
      setParties(prev => prev.map(p => p.id === data.partyId ? { ...p, currentBalance: Math.max(0, p.currentBalance - data.amount) } : p));
    }

    // 3. Update Chart of Accounts balances (Debit increases Debit accounts, Credit increases Credit accounts)
    setAccounts(prev => prev.map(acc => {
      let b = acc.balance;
      // Debit leg
      if (acc.id === data.debitAccountId) {
        if (acc.category === 'ASSET' || acc.category === 'EXPENSE') b += data.amount;
        else b -= data.amount;
      }
      // Credit leg
      if (acc.id === data.creditAccountId) {
        if (acc.category === 'LIABILITY' || acc.category === 'INCOME' || acc.category === 'EQUITY') b += data.amount;
        else b -= data.amount;
      }
      return { ...acc, balance: b };
    }));

    showToast('Voucher Posted', `${data.type} Voucher ${voucherNumber} of ${formatMoney(data.amount)} posted to general ledger.`);
    return newVoucher;
  };

  const addParty = (data: Omit<Party, 'id' | 'currentBalance'>) => {
    const newParty: Party = {
      ...data,
      id: `pty-${Date.now()}`,
      currentBalance: data.openingBalance || 0
    };
    setParties(prev => [...prev, newParty]);
    showToast(`${data.type === 'CUSTOMER' ? 'Client' : 'Supplier'} Created`, `${data.name} added to khata list.`);
  };

  const addAccount = (data: Omit<Account, 'id' | 'balance'>) => {
    const newAccount: Account = {
      ...data,
      id: `acc-${Date.now()}`,
      balance: 0
    };
    setAccounts(prev => [...prev, newAccount]);
    showToast('Account Added', `${data.code} - ${data.name} created in Chart of Accounts.`);
  };

  // Generate Party Ledger (Khata / Statement of Accounts)
  const getPartyLedger = (partyId: string, fromDate?: string, toDate?: string): LedgerTransaction[] => {
    const party = parties.find(p => p.id === partyId);
    if (!party) return [];

    const isCustomer = party.type === 'CUSTOMER';
    const txs: Array<{
      date: string;
      voucherNo: string;
      type: string;
      particulars: string;
      debit: number;
      credit: number;
    }> = [];

    // 1. Sales Invoices
    salesInvoices.filter(inv => inv.customerId === partyId).forEach(inv => {
      txs.push({
        date: inv.date,
        voucherNo: inv.invoiceNumber,
        type: 'SALE_INVOICE',
        particulars: inv.items.map(i => `${i.serviceType}: ${i.passengerName || i.description} (${i.sector || ''})`).join(' | '),
        debit: inv.totalSale,
        credit: 0
      });
      // If invoice had downpayment
      if (inv.paidAmount > 0) {
        txs.push({
          date: inv.date,
          voucherNo: `RCPT-${inv.invoiceNumber}`,
          type: 'PAYMENT_RECEIVED',
          particulars: `Advance / Part payment against ${inv.invoiceNumber}`,
          debit: 0,
          credit: inv.paidAmount
        });
      }
    });

    // 2. Supplier Bills (If supplier)
    supplierBills.filter(b => b.supplierId === partyId).forEach(b => {
      txs.push({
        date: b.date,
        voucherNo: b.billNumber,
        type: 'SUPPLIER_BILL',
        particulars: b.description,
        debit: 0,
        credit: b.amount // We owe supplier credit
      });
    });

    // 3. Vouchers (RV, PV, JV, CN, DN)
    vouchers.filter(v => v.partyId === partyId).forEach(v => {
      if (isCustomer) {
        if (v.type === 'RV') {
          txs.push({
            date: v.date,
            voucherNo: v.voucherNumber,
            type: 'RECEIPT_VOUCHER',
            particulars: `${v.narration} (${v.paymentMethod} ${v.chequeOrRefNo ? 'Ref: ' + v.chequeOrRefNo : ''})`,
            debit: 0,
            credit: v.amount
          });
        } else if (v.type === 'CN') {
          txs.push({
            date: v.date,
            voucherNo: v.voucherNumber,
            type: 'CREDIT_NOTE',
            particulars: `Credit Note / Refund / Discount: ${v.narration}`,
            debit: 0,
            credit: v.amount
          });
        }
      } else {
        // Supplier
        if (v.type === 'PV') {
          txs.push({
            date: v.date,
            voucherNo: v.voucherNumber,
            type: 'PAYMENT_VOUCHER',
            particulars: `${v.narration} (${v.paymentMethod} ${v.chequeOrRefNo ? 'Ref: ' + v.chequeOrRefNo : ''})`,
            debit: v.amount, // Dr Supplier decreases payable
            credit: 0
          });
        }
      }
    });

    // Sort chronologically
    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter by dates if specified
    const filteredTxs = txs.filter(t => {
      if (fromDate && t.date < fromDate) return false;
      if (toDate && t.date > toDate) return false;
      return true;
    });

    let runningBal = party.openingBalance || 0;
    return filteredTxs.map((t, idx) => {
      if (isCustomer) {
        runningBal += (t.debit - t.credit);
      } else {
        runningBal += (t.credit - t.debit);
      }
      return {
        id: `tx-${idx}`,
        ...t,
        runningBalance: runningBal
      };
    });
  };

  // Generate General Ledger for any Account
  const getAccountLedger = (accountId: string, fromDate?: string, toDate?: string): LedgerTransaction[] => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return [];

    const txs: Array<{
      date: string;
      voucherNo: string;
      type: string;
      particulars: string;
      debit: number;
      credit: number;
    }> = [];

    vouchers.forEach(v => {
      if (v.debitAccountId === accountId) {
        txs.push({
          date: v.date,
          voucherNo: v.voucherNumber,
          type: v.type,
          particulars: `${v.narration} (Cr. ${v.creditAccountName})`,
          debit: v.amount,
          credit: 0
        });
      }
      if (v.creditAccountId === accountId) {
        txs.push({
          date: v.date,
          voucherNo: v.voucherNumber,
          type: v.type,
          particulars: `${v.narration} (Dr. ${v.debitAccountName})`,
          debit: 0,
          credit: v.amount
        });
      }
    });

    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let bal = 0;
    return txs.map((t, idx) => {
      if (acc.category === 'ASSET' || acc.category === 'EXPENSE') {
        bal += (t.debit - t.credit);
      } else {
        bal += (t.credit - t.debit);
      }
      return { id: `acc-tx-${idx}`, ...t, runningBalance: bal };
    });
  };

  // Day Book helper
  const getDayBook = (date: string) => {
    const dayVouchers = vouchers.filter(v => v.date === date);
    return dayVouchers.map(v => ({
      time: '12:00 PM',
      voucherNo: v.voucherNumber,
      type: v.type,
      narration: v.narration || `${v.debitAccountName} / ${v.creditAccountName}`,
      debit: v.amount,
      credit: v.amount
    }));
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setAccounts(initialChartOfAccounts);
    setParties(initialParties);
    setSalesInvoices(initialSalesInvoices);
    setSupplierBills(initialSupplierBills);
    setVouchers(initialVouchers);
    showToast('Reset Done', 'Travel agency accounting data reset to sample state.');
  };

  const exportDatabaseJSON = () => {
    const db = {
      accounts,
      parties,
      salesInvoices,
      supplierBills,
      vouchers,
      version: '2.0.0',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TravelAgency_Accounting_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup Downloaded', 'Complete financial database exported to JSON.');
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.accounts && parsed.parties && parsed.salesInvoices) {
        setAccounts(parsed.accounts);
        setParties(parsed.parties);
        setSalesInvoices(parsed.salesInvoices);
        setSupplierBills(parsed.supplierBills || []);
        setVouchers(parsed.vouchers || []);
        showToast('Database Restored', 'Accounts, ledgers and vouchers restored successfully.');
        return true;
      }
      showToast('Invalid File', 'JSON structure is missing required accounting tables.', 'error');
      return false;
    } catch (e) {
      showToast('Import Error', 'Failed to parse JSON file.', 'error');
      return false;
    }
  };

  return (
    <AccountingContext.Provider
      value={{
        accounts,
        parties,
        salesInvoices,
        supplierBills,
        vouchers,
        agencyProfile,
        deviceFingerprint,
        isLocked,
        unlockApp,
        lockApp,
        updateAgencyProfile,
        clearDataForNewAgency,
        activeCurrency,
        currencySymbol,
        setActiveCurrency,
        formatMoney,
        isOperating,
        operationStatusText,
        operationProgress,
        toasts,
        showToast,
        dismissToast,
        addSaleInvoice,
        addSupplierBill,
        addVoucher,
        addParty,
        addAccount,
        getPartyLedger,
        getAccountLedger,
        getDayBook,
        resetToSampleData,
        exportDatabaseJSON,
        importDatabaseJSON
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) throw new Error('useAccounting must be used within an AccountingProvider');
  return context;
};
