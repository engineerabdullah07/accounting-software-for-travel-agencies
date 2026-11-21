import React, { useState } from 'react';
import { AccountingProvider, useAccounting } from './context/AccountingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { LoadingBar } from './components/ui/LoadingBar';
import { ToastContainer } from './components/ui/ToastContainer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { SalesInvoicesView } from './components/views/SalesInvoicesView';
import { SupplierBillsView } from './components/views/SupplierBillsView';
import { VouchersView } from './components/views/VouchersView';
import { ClientLedgersView } from './components/views/ClientLedgersView';
import { SupplierLedgersView } from './components/views/SupplierLedgersView';
import { CashBankView } from './components/views/CashBankView';
import { ReportsView } from './components/views/ReportsView';
import { ChartOfAccountsView } from './components/views/ChartOfAccountsView';
import { DataBackupView } from './components/views/DataBackupView';

// Modals
import { NewSaleInvoiceModal } from './components/modals/NewSaleInvoiceModal';
import { NewSupplierBillModal } from './components/modals/NewSupplierBillModal';
import { NewVoucherModal } from './components/modals/NewVoucherModal';
import { NewPartyModal } from './components/modals/NewPartyModal';
import { PrintSaleInvoiceModal } from './components/modals/PrintSaleInvoiceModal';

import { SaleInvoice, SupplierBill, Party, VoucherType } from './types';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<VoucherType>('RV');
  const [voucherPartyId, setVoucherPartyId] = useState<string | undefined>(undefined);
  const [voucherAmount, setVoucherAmount] = useState<number | undefined>(undefined);

  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [partyModalDefaultType, setPartyModalDefaultType] = useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER');

  const [activePrintInvoice, setActivePrintInvoice] = useState<SaleInvoice | null>(null);

  const handleQuickAction = (actionType: 'sale' | 'receipt' | 'payment' | 'voucher' | 'party') => {
    if (actionType === 'sale') {
      setIsSaleModalOpen(true);
    } else if (actionType === 'receipt') {
      setVoucherType('RV');
      setVoucherPartyId(undefined);
      setVoucherAmount(undefined);
      setIsVoucherModalOpen(true);
    } else if (actionType === 'payment') {
      setVoucherType('PV');
      setVoucherPartyId(undefined);
      setVoucherAmount(undefined);
      setIsVoucherModalOpen(true);
    } else if (actionType === 'party') {
      setPartyModalDefaultType('CUSTOMER');
      setIsPartyModalOpen(true);
    }
  };

  const handleReceiveFromCustomer = (party: Party) => {
    setVoucherType('RV');
    setVoucherPartyId(party.id);
    setVoucherAmount(party.currentBalance > 0 ? party.currentBalance : 50000);
    setIsVoucherModalOpen(true);
  };

  const handlePayToSupplier = (party: Party) => {
    setVoucherType('PV');
    setVoucherPartyId(party.id);
    setVoucherAmount(party.currentBalance > 0 ? party.currentBalance : 100000);
    setIsVoucherModalOpen(true);
  };

  const handlePayAgainstBill = (bill: SupplierBill) => {
    setVoucherType('PV');
    setVoucherPartyId(bill.supplierId);
    setVoucherAmount(bill.balanceDue);
    setIsVoucherModalOpen(true);
  };

  const handleReceiveAgainstInvoice = (inv: SaleInvoice) => {
    setVoucherType('RV');
    setVoucherPartyId(inv.customerId);
    setVoucherAmount(inv.balanceDue);
    setIsVoucherModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-cream-900 flex flex-col">
      <LoadingBar />
      <ToastContainer />

      <Navbar
        onOpenQuickAction={handleQuickAction}
        onSearch={(query) => {
          if (query.trim().length > 0 && activeTab !== 'sales') {
            setActiveTab('sales');
          }
        }}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickAction={handleQuickAction}
            />
          )}

          {activeTab === 'sales' && (
            <SalesInvoicesView
              onOpenNewSale={() => setIsSaleModalOpen(true)}
              onPrintInvoice={(inv) => setActivePrintInvoice(inv)}
              onReceivePayment={handleReceiveAgainstInvoice}
            />
          )}

          {activeTab === 'bills' && (
            <SupplierBillsView
              onOpenNewBill={() => setIsBillModalOpen(true)}
              onPayBill={handlePayAgainstBill}
            />
          )}

          {activeTab === 'vouchers' && (
            <VouchersView
              onOpenQuickAction={handleQuickAction}
              onPrintVoucher={() => {}}
            />
          )}

          {activeTab === 'clientLedgers' && (
            <ClientLedgersView
              onOpenNewParty={() => {
                setPartyModalDefaultType('CUSTOMER');
                setIsPartyModalOpen(true);
              }}
              onReceivePayment={handleReceiveFromCustomer}
            />
          )}

          {activeTab === 'supplierLedgers' && (
            <SupplierLedgersView
              onOpenNewParty={() => {
                setPartyModalDefaultType('SUPPLIER');
                setIsPartyModalOpen(true);
              }}
              onPaySupplier={handlePayToSupplier}
            />
          )}

          {activeTab === 'cashBank' && <CashBankView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'coa' && <ChartOfAccountsView />}

          {activeTab === 'data' && <DataBackupView />}
        </main>
      </div>

      {/* Modals */}
      <NewSaleInvoiceModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />

      <NewSupplierBillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
      />

      <NewVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        initialType={voucherType}
        initialPartyId={voucherPartyId}
        initialAmount={voucherAmount}
      />

      <NewPartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        defaultType={partyModalDefaultType}
      />

      <PrintSaleInvoiceModal
        isOpen={!!activePrintInvoice}
        invoice={activePrintInvoice}
        onClose={() => setActivePrintInvoice(null)}
      />

    </div>
  );
};

export function App() {
  return (
    <AccountingProvider>
      <MainAppContent />
    </AccountingProvider>
  );
}

export default App;
