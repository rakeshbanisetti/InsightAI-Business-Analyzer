import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Play } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CustomChartBuilder({ columns = [], data = [] }) {
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (columns.length >= 2 && !xAxis && !yAxis) {
      setXAxis(columns[0]);
      setYAxis(columns[1] || columns[0]);
    }
  }, [columns]);

  const handleRenderChart = () => {
    let sourceData = data;
    const session = localStorage.getItem('insightai_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.table_preview && parsed.table_preview.length > 0) {
          sourceData = parsed.table_preview;
        }
      } catch (e) {
        // ignore parse error
      }
    }

    if (!xAxis || !yAxis || !sourceData || sourceData.length === 0) return;

    const grouped = {};
    sourceData.forEach((row) => {
      const actualXKey = Object.keys(row).find(
        (k) => k.trim().toLowerCase() === xAxis.trim().toLowerCase()
      ) || xAxis;

      const actualYKey = Object.keys(row).find(
        (k) => k.trim().toLowerCase() === yAxis.trim().toLowerCase()
      ) || yAxis;

      const xKey = String(row[actualXKey] ?? 'Unknown').trim();
      const rawY = row[actualYKey];
      const yVal = typeof rawY === 'number' ? rawY : (parseFloat(String(rawY).replace(/[\$,]/g, '')) || 0);

      if (xKey) {
        grouped[xKey] = (grouped[xKey] || 0) + yVal;
      }
    });

    const formatted = Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);

    setChartData(formatted);
  };

  useEffect(() => {
    if (xAxis && yAxis) {
      handleRenderChart();
    }
  }, [xAxis, yAxis, data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-medium shadow-sm"
          >
            <option value="">Select Category (X-Axis)</option>
            {columns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-medium shadow-sm"
          >
            <option value="">Select Metric (Y-Axis)</option>
            {columns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex bg-slate-100 border border-slate-300 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg transition-all ${chartType === 'bar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-lg transition-all ${chartType === 'line' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LineIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              className={`p-1.5 rounded-lg transition-all ${chartType === 'pie' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <PieIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRenderChart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Render Custom Visualisation
          </button>
        </div>

        <div className="text-xs text-slate-700 font-semibold bg-slate-100 px-3 py-2 rounded-xl border border-slate-300 shadow-sm">
          Total Rows: <span className="text-indigo-600 font-bold">{data.length}</span>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-300 rounded-2xl font-medium">
            Select X-Axis and Y-Axis columns above, then click "Render Custom Visualisation".
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={{ fill: '#334155', fontSize: 11 }}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}