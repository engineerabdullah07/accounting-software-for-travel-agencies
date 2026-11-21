import React, { useState } from 'react';
import { AccountingProvider, useAccounting } from './context/AccountingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { LoadingBar } from './components/ui/LoadingBar';
import { ToastContainer } from './components/ui/ToastContainer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { TicketsView } from './components/views/TicketsView';
import { InvoicesView } from './components/views/InvoicesView';
import { HotelsView } from './components/views/HotelsView';
import { VisasView } from './components/views/VisasView';
import { CustomersView } from './components/views/CustomersView';
import { VendorsView } from './components/views/VendorsView';
import { BSPView } from './components/views/BSPView';
import { VouchersView } from './components/views/VouchersView';
import { RefundsView } from './components/views/RefundsView';
import { AccountingView } from './components/views/AccountingView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { IssueTicketModal } from './components/modals/IssueTicketModal';
import { CreateVoucherModal } from './components/modals/CreateVoucherModal';
import { BookHotelModal } from './components/modals/BookHotelModal';
import { VisaApplicationModal } from './components/modals/VisaApplicationModal';
import { RefundTicketModal } from './components/modals/RefundTicketModal';
import { PrintInvoiceModal } from './components/modals/PrintInvoiceModal';
import { PrintVoucherModal } from './components/modals/PrintVoucherModal';
import { ManualJournalModal } from './components/modals/ManualJournalModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { AddVendorModal } from './components/modals/AddVendorModal';

import { TicketBooking, Voucher, Customer, VendorSupplier } from './types';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modal States
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherModalType, setVoucherModalType] = useState<'RV' | 'PV'>('RV');
  const [voucherPartyId, setVoucherPartyId] = useState<string | undefined>(undefined);
  const [voucherAmount, setVoucherAmount] = useState<number | undefined>(undefined);

  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isManualJournalOpen, setIsManualJournalOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  // Active print and refund targets
  const [activePrintTicket, setActivePrintTicket] = useState<TicketBooking | null>(null);
  const [activeRefundTicket, setActiveRefundTicket] = useState<TicketBooking | null>(null);
  const [activePrintVoucher, setActivePrintVoucher] = useState<Voucher | null>(null);

  // Quick Action Handler from Navbar or Dashboard
  const handleQuickAction = (actionType: 'ticket' | 'receipt' | 'payment' | 'hotel' | 'visa') => {
    if (actionType === 'ticket') {
      setIsTicketModalOpen(true);
    } else if (actionType === 'receipt') {
      setVoucherModalType('RV');
      setVoucherPartyId(undefined);
      setVoucherAmount(undefined);
      setIsVoucherModalOpen(true);
    } else if (actionType === 'payment') {
      setVoucherModalType('PV');
      setVoucherPartyId(undefined);
      setVoucherAmount(undefined);
      setIsVoucherModalOpen(true);
    } else if (actionType === 'hotel') {
      setIsHotelModalOpen(true);
    } else if (actionType === 'visa') {
      setIsVisaModalOpen(true);
    }
  };

  const handleReceivePaymentForCustomer = (customer: Customer) => {
    setVoucherModalType('RV');
    setVoucherPartyId(customer.id);
    setVoucherAmount(customer.currentBalance > 0 ? customer.currentBalance : 500);
    setIsVoucherModalOpen(true);
  };

  const handleIssuePaymentToVendor = (vendor: VendorSupplier) => {
    setVoucherModalType('PV');
    setVoucherPartyId(vendor.id);
    setVoucherAmount(vendor.balance > 0 ? vendor.balance : 1000);
    setIsVoucherModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-cream-900 flex flex-col">
      {/* Top Creamy Animated Loading Bar */}
      <LoadingBar />

      {/* Creamy Toasts */}
      <ToastContainer />

      {/* Main Navbar */}
      <Navbar
        onOpenQuickAction={handleQuickAction}
        onSearch={(query) => {
          if (query.trim().length > 0 && activeTab !== 'tickets') {
            setActiveTab('tickets');
          }
        }}
      />

      {/* Body with Sidebar and Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickAction={handleQuickAction}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsView
              onOpenQuickAction={() => setIsTicketModalOpen(true)}
              onPrintTicket={(tkt) => setActivePrintTicket(tkt)}
              onRefundTicket={(tkt) => setActiveRefundTicket(tkt)}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoicesView
              onPrintInvoice={(tkt) => setActivePrintTicket(tkt)}
              onReceivePayment={(tkt) => {
                setVoucherModalType('RV');
                setVoucherPartyId(tkt.customerId);
                setVoucherAmount(tkt.clientSellingPrice - tkt.paidAmount);
                setIsVoucherModalOpen(true);
              }}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelsView
              onOpenQuickAction={() => setIsHotelModalOpen(true)}
            />
          )}

          {activeTab === 'visas' && (
            <VisasView
              onOpenQuickAction={() => setIsVisaModalOpen(true)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              onReceivePaymentForCustomer={handleReceivePaymentForCustomer}
              onAddNewCustomer={() => setIsAddCustomerOpen(true)}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorsView
              onIssuePaymentToVendor={handleIssuePaymentToVendor}
              onAddNewVendor={() => setIsAddVendorOpen(true)}
            />
          )}

          {activeTab === 'bsp' && <BSPView />}

          {activeTab === 'vouchers' && (
            <VouchersView
              onOpenQuickAction={handleQuickAction}
              onPrintVoucher={(v) => setActivePrintVoucher(v)}
            />
          )}

          {activeTab === 'refunds' && <RefundsView />}

          {activeTab === 'accounting' && (
            <AccountingView
              onOpenManualJournal={() => setIsManualJournalOpen(true)}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Modals */}
      <IssueTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      />

      <CreateVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        initialType={voucherModalType}
        initialPartyId={voucherPartyId}
        initialAmount={voucherAmount}
      />

      <BookHotelModal
        isOpen={isHotelModalOpen}
        onClose={() => setIsHotelModalOpen(false)}
      />

      <VisaApplicationModal
        isOpen={isVisaModalOpen}
        onClose={() => setIsVisaModalOpen(false)}
      />

      <RefundTicketModal
        isOpen={!!activeRefundTicket}
        ticket={activeRefundTicket}
        onClose={() => setActiveRefundTicket(null)}
      />

      <PrintInvoiceModal
        isOpen={!!activePrintTicket}
        ticket={activePrintTicket}
        onClose={() => setActivePrintTicket(null)}
      />

      <PrintVoucherModal
        isOpen={!!activePrintVoucher}
        voucher={activePrintVoucher}
        onClose={() => setActivePrintVoucher(null)}
      />

      <ManualJournalModal
        isOpen={isManualJournalOpen}
        onClose={() => setIsManualJournalOpen(false)}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />

      <AddVendorModal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
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
