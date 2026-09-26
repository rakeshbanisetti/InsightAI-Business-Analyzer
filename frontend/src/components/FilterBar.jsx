import React from 'react';
import { Filter, RefreshCw, Calendar, Tag } from 'lucide-react';

export default function FilterBar({ columns = [], onFilterChange, onReset }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-sm">
          <Filter className="h-4 w-4" />
          <span>Interactive Data Slicer</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Time Horizon</span>
          </label>
          <select
            onChange={(e) => onFilterChange('timeframe', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Available Records</option>
            <option value="last_30">Last 30 Days</option>
            <option value="last_90">Last 90 Days</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>
        </div>

        {/* Dynamic Category Slicer */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span>Primary Segment</span>
          </label>
          <select
            onChange={(e) => onFilterChange('segment', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Segments & Categories</option>
            {columns.slice(0, 5).map((col, idx) => (
              <option key={idx} value={col}>
                Filter by {col}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Aggregation Threshold */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Metric Threshold</span>
          </label>
          <select
            onChange={(e) => onFilterChange('threshold', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">Include All Transactions</option>
            <option value="high">Above Average Values Only</option>
            <option value="outliers">Statistical Outliers Only (Z &gt; 3)</option>
          </select>
        </div>
      </div>
    </div>
  );
}