import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, Activity, ChevronDown } from 'lucide-react';

export default function AnalyticsCharts({ groupAnalysis = {}, rawData = [], columns = [] }) {
  const availableColumns = columns.length > 0 ? columns : ['Ship Mode', 'Segment', 'Country', 'City', 'State', 'Postal Code', 'Region', 'Category', 'Sub-Category'];
  const metricsList = ['Sales', 'Quantity', 'Discount', 'Profit'];
  
  const [xAxisKey, setXAxisKey] = useState(availableColumns[0] || 'Sub-Category');
  const [metricKey, setMetricKey] = useState('Sales');
  const [chartType, setChartType] = useState('bar');

  const [isXOpen, setIsXOpen] = useState(false);
  const [isMetricOpen, setIsMetricOpen] = useState(false);

  const xDropdownRef = useRef(null);
  const metricDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (xDropdownRef.current && !xDropdownRef.current.contains(event.target)) setIsXOpen(false);
      if (metricDropdownRef.current && !metricDropdownRef.current.contains(event.target)) setIsMetricOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chartData = useMemo(() => {
    if (groupAnalysis && groupAnalysis[xAxisKey]) {
      const dataObj = groupAnalysis[xAxisKey];
      return Object.keys(dataObj).map((key) => ({
        name: key,
        value: typeof dataObj[key] === 'object' ? (dataObj[key][metricKey] || Object.values(dataObj[key])[0] || 0) : dataObj[key]
      }));
    }

    if (!rawData || rawData.length === 0) return [];
    const map = {};
    rawData.forEach((row) => {
      const xVal = row[xAxisKey] !== undefined && row[xAxisKey] !== null ? String(row[xAxisKey]) : 'Unknown';
      const mVal = parseFloat(row[metricKey]) || 0;
      if (!map[xVal]) map[xVal] = 0;
      map[xVal] += mVal;
    });
    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  }, [groupAnalysis, rawData, xAxisKey, metricKey]);

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
          <BarChart3 className="h-5 w-5" />
          <span>Power BI Studio: Custom Chart Builder</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-20">
          
          {/* Group By (X-Axis) Dropdown */}
          <div className="relative" ref={xDropdownRef}>
            <div 
              className="flex items-center justify-between space-x-4 bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl px-4 py-2.5 cursor-pointer transition-all shadow-inner min-w-[160px]"
              onClick={() => setIsXOpen(!isXOpen)}
            >
              <span className="text-sm text-slate-100 font-semibold">{xAxisKey}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isXOpen ? 'rotate-180' : ''}`} />
            </div>

            {isXOpen && (
              <div 
                className="absolute left-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 max-h-56 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #020617' }}
              >
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-900">
                  Select Category (X-Axis)
                </div>
                {availableColumns.map((col) => (
                  <div
                    key={col}
                    onClick={() => { setXAxisKey(col); setIsXOpen(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${xAxisKey === col ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    {col}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metric (Y-Axis) Dropdown */}
          <div className="relative" ref={metricDropdownRef}>
            <div 
              className="flex items-center justify-between space-x-4 bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl px-4 py-2.5 cursor-pointer transition-all shadow-inner min-w-[140px]"
              onClick={() => setIsMetricOpen(!isMetricOpen)}
            >
              <span className="text-sm text-slate-100 font-semibold">{metricKey}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMetricOpen ? 'rotate-180' : ''}`} />
            </div>

            {isMetricOpen && (
              <div 
                className="absolute left-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 max-h-56 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #020617' }}
              >
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-900">
                  Select Metric (Y-Axis)
                </div>
                {metricsList.map((m) => (
                  <div
                    key={m}
                    onClick={() => { setMetricKey(m); setIsMetricOpen(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${metricKey === m ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart Type Toggles */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 space-x-1">
            <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg transition-colors ${chartType === 'bar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Bar Chart"><BarChart3 className="w-4 h-4" /></button>
            <button onClick={() => setChartType('line')} className={`p-2 rounded-lg transition-colors ${chartType === 'line' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Line Chart"><TrendingUp className="w-4 h-4" /></button>
            <button onClick={() => setChartType('area')} className={`p-2 rounded-lg transition-colors ${chartType === 'area' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Area Chart"><Activity className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="h-80 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
            No data available for the selected configuration.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}