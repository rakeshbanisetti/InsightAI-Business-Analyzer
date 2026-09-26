import React from 'react';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';

export default function KpiCards({ analytics = {}, datasetSummary = {} }) {
  const totalSales = datasetSummary?.total_sales ?? 0;
  const totalRecords = datasetSummary?.total_records ?? analytics?.total_rows ?? 0;
  const avgValue = datasetSummary?.avg_sales ?? (totalRecords > 0 ? totalSales / totalRecords : 0);
  const totalCols = analytics?.columns_count ?? (analytics?.numeric_columns?.length || 0) + (analytics?.categorical_columns?.length || 0);

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Total Sales */}
      <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-lg shadow-slate-200/50 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales / Revenue</p>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(totalSales)}</h3>
          <p className="text-xs text-emerald-600 font-medium">Aggregated Metrics</p>
        </div>
        <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* Total Records */}
      <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-lg shadow-slate-200/50 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Records</p>
          <h3 className="text-3xl font-black text-slate-900">{totalRecords.toLocaleString()}</h3>
          <p className="text-xs text-indigo-600 font-medium">{totalCols} columns parsed</p>
        </div>
        <div className="p-3.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-2xl">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* Average Value */}
      <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 shadow-lg shadow-slate-200/50 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Value</p>
          <h3 className="text-3xl font-black text-slate-900">{formatCurrency(avgValue)}</h3>
          <p className="text-xs text-purple-600 font-medium">Per Transaction</p>
        </div>
        <div className="p-3.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-2xl">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}