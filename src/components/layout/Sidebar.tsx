import React from 'react';
import {
  LayoutDashboard,
  Plane,
  Receipt,
  Hotel,
  Globe,
  Users,
  Building,
  Scale,
  CreditCard,
  RotateCcw,
  BookOpen,
  DollarSign
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'tickets'
  | 'invoices'
  | 'hotels'
  | 'visas'
  | 'customers'
  | 'vendors'
  | 'bsp'
  | 'vouchers'
  | 'refunds'
  | 'accounting'
  | 'settings';

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
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' }
      ]
    },
    {
      title: 'TRAVEL OPERATIONS',
      items: [
        { id: 'tickets', label: 'Air Tickets & PNRs', icon: Plane },
        { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
        { id: 'hotels', label: 'Hotels & Umrah Packages', icon: Hotel },
        { id: 'visas', label: 'Visa Processing', icon: Globe },
      ]
    },
    {
      title: 'FINANCIAL LEDGERS',
      items: [
        { id: 'customers', label: 'Customer Receivables', icon: Users },
        { id: 'vendors', label: 'Airline & Vendor Payables', icon: Building },
        { id: 'bsp', label: 'IATA BSP Settlement', icon: Scale, badge: 'Period 2' },
        { id: 'vouchers', label: 'Vouchers (RV / PV / JV)', icon: CreditCard },
        { id: 'refunds', label: 'Refunds & ADMs', icon: RotateCcw },
      ]
    },
    {
      title: 'ACCOUNTING & REPORTS',
      items: [
        { id: 'accounting', label: 'General Ledger & Reports', icon: BookOpen },
        { id: 'settings', label: 'Forex & Agency Setup', icon: DollarSign },
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

      {/* Agency Footer Card */}
      <div className="p-4 border-t border-cream-200 bg-cream-50/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-cream-900">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>IATA Accr. # 27-2-8910</span>
        </div>
        <p className="text-[11px] text-cream-500 mt-0.5">SkyHorizon Travels & Tourism</p>
      </div>
    </aside>
  );
};
