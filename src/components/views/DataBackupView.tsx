import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Database, Download, Upload, FileSpreadsheet, CheckCircle2, RefreshCw } from 'lucide-react';

export const DataBackupView: React.FC = () => {
  const { 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetToSampleData, 
    addSaleInvoice,
    parties,
    showToast 
  } = useAccounting();

  const [csvText, setCsvText] = useState('');

  // Sample CSV format
  const sampleCsv = `2026-11-21,Al-Baraka Logistics Ltd,EK99ZZ,176-9018293810,MR ZUBAIR ALI,LHE-DXB-JFK,IATA BSP Clearing Center,380000,430000
2026-11-21,Dr. Zeeshan Akhtar,SV44LL,065-4920194820,MRS ZEESHAN,ISB-JED-ISB,Fly365 Global Consolidators,180000,210000`;

  const handleImportCsv = async () => {
    if (!csvText.trim()) {
      showToast('No Data', 'Please paste CSV lines first.', 'warning');
      return;
    }

    const lines = csvText.trim().split('\n');
    let importedCount = 0;

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 8) {
        const [date, clientName, pnr, ticketNo, paxName, sector, supplierName, costStr, saleStr] = parts;
        const costPrice = parseFloat(costStr) || 0;
        const salePrice = parseFloat(saleStr) || 0;

        // Find or fallback customer
        const customer = parties.find(p => p.name.toLowerCase().includes(clientName.toLowerCase())) || parties[0];
        const supplier = parties.find(p => p.name.toLowerCase().includes(supplierName.toLowerCase())) || parties[3];

        await addSaleInvoice({
          date: date || new Date().toISOString().split('T')[0],
          dueDate: date || new Date().toISOString().split('T')[0],
          customerId: customer.id,
          customerName: customer.name,
          paymentType: 'CREDIT',
          paidAmount: 0,
          notes: 'Bulk imported from Excel CSV',
          items: [
            {
              id: `item-${Date.now()}-${Math.random()}`,
              serviceType: 'AIR_TICKET',
              description: `Flight E-Ticket (${sector})`,
              pnr,
              ticketNumber: ticketNo,
              passengerName: paxName,
              sector,
              supplierId: supplier.id,
              costPrice,
              salePrice,
              margin: salePrice - costPrice
            }
          ]
        });
        importedCount++;
      }
    }

    setCsvText('');
    showToast('Import Complete', `${importedCount} ticket invoices imported and posted to ledgers.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importDatabaseJSON(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-cream-950 tracking-tight">
          Excel / CSV Import & Accounting Data Backup
        </h1>
        <p className="text-xs text-cream-500 mt-1">
          Bulk import ticket sales from Excel sheets, export complete ledger backups, and restore database.
        </p>
      </div>

      {/* Excel / CSV Bulk Paste Import */}
      <div className="creamy-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <h3 className="text-sm font-bold text-cream-950 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Bulk Import Ticket Sales from Excel (CSV)</span>
            </h3>
            <p className="text-xs text-cream-500">
              Format: Date, Client Name, PNR, Ticket Number, Passenger Name, Sector, Supplier Name, Cost, Sale
            </p>
          </div>
          <button
            onClick={() => setCsvText(sampleCsv)}
            className="text-[11px] font-bold text-gold-700 hover:text-gold-900"
          >
            Load Sample CSV
          </button>
        </div>

        <textarea
          rows={5}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste rows from Excel or CSV here..."
          className="w-full p-3 font-mono text-xs bg-cream-50/70 border border-cream-200 rounded-xl text-cream-900 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
        />

        <div className="flex justify-between items-center text-xs">
          <span className="text-cream-500">
            Paste comma-separated rows. Each row creates an invoice and posts to client & supplier ledgers.
          </span>
          <button
            onClick={handleImportCsv}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold shadow-creamy active:scale-95 transition-all"
          >
            Import Invoices to General Ledger
          </button>
        </div>
      </div>

      {/* JSON Backup & Restore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Export Card */}
        <div className="creamy-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cream-100 text-cream-800 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-cream-950">Export Accounting Database</h4>
              <p className="text-[11px] text-cream-500">Download complete financial ledger backup (JSON)</p>
            </div>
          </div>
          <p className="text-xs text-cream-600">
            Exports all client ledgers, supplier accounts, invoices, vouchers, and chart of accounts.
          </p>
          <button
            onClick={exportDatabaseJSON}
            className="w-full py-2 rounded-xl bg-cream-900 text-gold-300 font-bold text-xs hover:bg-cream-800 shadow-creamy active:scale-95 transition-all"
          >
            Download JSON Backup File
          </button>
        </div>

        {/* Restore Card */}
        <div className="creamy-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-cream-950">Restore Database Backup</h4>
              <p className="text-[11px] text-cream-500">Restore your financial records from file</p>
            </div>
          </div>
          <p className="text-xs text-cream-600">
            Upload any previously saved VoyageLedger JSON backup to restore all khatas and balances.
          </p>
          <label className="block w-full py-2 text-center rounded-xl border-2 border-dashed border-cream-300 text-cream-700 font-semibold text-xs hover:bg-cream-50 cursor-pointer transition-colors">
            <span>Choose JSON File to Restore</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

      </div>

      {/* Reset sample data */}
      <div className="p-4 rounded-xl bg-cream-100/60 border border-cream-200 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-cream-900 block">Need fresh testing data?</span>
          <span className="text-cream-500">Reset back to default realistic travel agency records.</span>
        </div>
        <button
          onClick={resetToSampleData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-cream-800 font-semibold hover:bg-cream-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

    </div>
  );
};
