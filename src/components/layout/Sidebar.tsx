import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  CreditCard,
  Users,
  Building,
  Wallet,
  Scale,
  BookOpen,
  Database,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'sales'
  | 'bills'
  | 'vouchers'
  | 'clientLedgers'
  | 'supplierLedgers'
  | 'cashBank'
  | 'reports'
  | 'coa'
  | 'data';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Financial Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'TRANSACTIONS & BILLING',
      items: [
        { id: 'sales', label: 'Sales Invoices (Tickets/Tours)', icon: Receipt },
        { id: 'bills', label: 'Supplier / Airline Bills', icon: FileText },
        { id: 'vouchers', label: 'Vouchers Center (RV/PV/JV)', icon: CreditCard, badge: 'Core' }
      ]
    },
    {
      title: 'KHATAS & STATEMENTS',
      items: [
        { id: 'clientLedgers', label: 'Client Ledgers (Khata)', icon: Users },
        { id: 'supplierLedgers', label: 'Supplier & Airline Ledgers', icon: Building },
        { id: 'cashBank', label: 'Cash Book & Bank Registers', icon: Wallet }
      ]
    },
    {
      title: 'AUDIT & REPORTS',
      items: [
        { id: 'reports', label: 'Trial Balance & P&L', icon: Scale },
        { id: 'coa', label: 'Chart of Accounts (COA)', icon: BookOpen },
        { id: 'data', label: 'Excel Import & Data Backup', icon: Database }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-cream-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-cream-400 tracking-wider uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cream-900 text-gold-300 shadow-creamy'
                        : 'text-cream-700 hover:bg-cream-100 hover:text-cream-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-cream-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isActive 
                          ? 'bg-gold-500/20 text-gold-300 border border-gold-400/30' 
                          : 'bg-cream-100 text-cream-600 border border-cream-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Agency Accounting Footer */}
      <div className="p-4 border-t border-cream-200 bg-cream-50/50">
        <div className="text-xs font-bold text-cream-950">Travel Agency Accounting</div>
        <p className="text-[11px] text-cream-500 mt-0.5">Offline-first • Balanced Ledger</p>
      </div>
    </aside>
  );
};
