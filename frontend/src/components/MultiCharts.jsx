import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, ChevronDown, BarChart3, Activity } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function MultiCharts({ timeSeries = {}, regionData = {}, rawData = [], columns = [] }) {
  const availableColumns = columns.length > 0 ? columns : ['Region', 'Category', 'Segment', 'Ship Mode'];

  const [pieDimension, setPieDimension] = useState(availableColumns[0] || 'Region');
  const [trendDimension, setTrendDimension] = useState(availableColumns[1] || 'Category');
  const [trendChartType, setTrendChartType] = useState('bar');

  const [isPieOpen, setIsPieOpen] = useState(false);
  const [isTrendOpen, setIsTrendOpen] = useState(false);

  const pieRef = useRef(null);
  const trendRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pieRef.current && !pieRef.current.contains(event.target)) setIsPieOpen(false);
      if (trendRef.current && !trendRef.current.contains(event.target)) setIsTrendOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pieData = useMemo(() => {
    if (regionData && Object.keys(regionData).length > 0 && pieDimension === 'Region') {
      return Object.keys(regionData).map((k) => ({ name: k, value: regionData[k] }));
    }
    if (!rawData || rawData.length === 0) return [];
    const map = {};
    rawData.forEach((row) => {
      const key = row[pieDimension] !== undefined ? String(row[pieDimension]) : 'Other';
      map[key] = (map[key] || 0) + (parseFloat(row.Sales) || 1);
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] })).slice(0, 6);
  }, [regionData, rawData, pieDimension]);

  const trendData = useMemo(() => {
    if (timeSeries && Object.keys(timeSeries).length > 0) {
      return Object.keys(timeSeries).map((k) => ({ name: k, value: timeSeries[k] }));
    }
    if (!rawData || rawData.length === 0) return [];
    const map = {};
    rawData.forEach((row) => {
      const key = row[trendDimension] !== undefined ? String(row[trendDimension]) : 'Other';
      map[key] = (map[key] || 0) + (parseFloat(row.Profit) || parseFloat(row.Sales) || 1);
    });
    return Object.keys(map).map((k) => ({ name: k, value: map[k] })).slice(0, 8);
  }, [timeSeries, rawData, trendDimension]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      
      {/* Card 1: Distribution Breakdown (Pie Chart) */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between relative z-20">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <PieIcon className="h-5 w-5" />
            <span>Distribution Breakdown</span>
          </div>

          <div className="relative" ref={pieRef}>
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 cursor-pointer transition-all" onClick={() => setIsPieOpen(!isPieOpen)}>
              <span className="text-sm text-slate-200 font-semibold">{pieDimension}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPieOpen ? 'rotate-180' : ''}`} />
            </div>

            {isPieOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 max-h-56 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #020617' }}
              >
                {availableColumns.map((col) => (
                  <div key={col} onClick={() => { setPieDimension(col); setIsPieOpen(false); }} className={`px-3.5 py-2 text-sm cursor-pointer transition-colors ${pieDimension === col ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>{col}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">No distribution data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                  {pieData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Card 2: Comparative Performance with Chart Type Toggles */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-20">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
            <TrendingUp className="h-5 w-5" />
            <span>Comparative Performance</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Toggles */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 space-x-1">
              <button onClick={() => setTrendChartType('bar')} className={`p-1.5 rounded-lg transition-colors ${trendChartType === 'bar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Bar Chart"><BarChart3 className="w-4 h-4" /></button>
              <button onClick={() => setTrendChartType('line')} className={`p-1.5 rounded-lg transition-colors ${trendChartType === 'line' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Line Chart"><TrendingUp className="w-4 h-4" /></button>
              <button onClick={() => setTrendChartType('area')} className={`p-1.5 rounded-lg transition-colors ${trendChartType === 'area' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`} title="Area Chart"><Activity className="w-4 h-4" /></button>
            </div>

            {/* Dimension Dropdown */}
            <div className="relative" ref={trendRef}>
              <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 cursor-pointer transition-all" onClick={() => setIsTrendOpen(!isTrendOpen)}>
                <span className="text-sm text-slate-200 font-semibold">{trendDimension}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTrendOpen ? 'rotate-180' : ''}`} />
              </div>

              {isTrendOpen && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 max-h-56 overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #020617' }}
                >
                  {availableColumns.map((col) => (
                    <div key={col} onClick={() => { setTrendDimension(col); setIsTrendOpen(false); }} className={`px-3.5 py-2 text-sm cursor-pointer transition-colors ${trendDimension === col ? 'bg-emerald-600/30 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>{col}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">No comparative data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {trendChartType === 'bar' ? (
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : trendChartType === 'line' ? (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              ) : (
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}