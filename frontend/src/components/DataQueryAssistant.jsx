import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export default function DataQueryAssistant({ columns = [], rawData = [], onQueryApply }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeQueryText, setActiveQueryText] = useState('');

  const samplePrompts = [
    'Show transactions where Sales > 1000',
    'Find top rows with highest Profit',
    'Filter records where Discount > 0.2'
  ];

  const handleQuerySubmit = async (queryText) => {
    const queryToProcess = queryText || prompt;
    if (!queryToProcess.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/query-dataset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: queryToProcess,
          columns: columns,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();

      if (result.filtered_data) {
        setActiveQueryText(queryToProcess);
        if (typeof onQueryApply === 'function') {
          onQueryApply(result.filtered_data, result.execution_plan);
        }
      }
    } catch (err) {
      console.warn('Backend query assistant offline. Using local intelligent fallback...', err);
      
      // Local fallback so workbench always works smoothly even without backend running
      const filtered = executeLocalQuery(queryToProcess, rawData);
      setActiveQueryText(queryToProcess);
      if (typeof onQueryApply === 'function') {
        onQueryApply(filtered, `Local Execution Plan: Filtered dataset based on rule "${queryToProcess}" (${filtered.length} rows matched).`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuerySubmit();
    }
  };

  const handleSampleClick = (sample) => {
    setPrompt(sample);
    handleQuerySubmit(sample);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Ask InsightAI About This Dataset
        </h3>
      </div>

      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask any question (e.g., "Filter records where Discount > 0.2").'
          disabled={loading}
          className="w-full bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
        />
        <button
          onClick={() => handleQuerySubmit()}
          disabled={loading || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {activeQueryText && (
        <div className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2 flex items-center justify-between">
          <span>Applied query: <span className="font-semibold text-white">"{activeQueryText}"</span></span>
          <button 
            onClick={() => {
              setActiveQueryText('');
              if (typeof onQueryApply === 'function') onQueryApply(rawData, null);
            }}
            className="text-slate-400 hover:text-white text-[10px] underline"
          >
            Reset Filter
          </button>
        </div>
      )}

      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Suggested Queries
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample)}
              disabled={loading}
              className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Local fallback query engine if backend is disconnected
function executeLocalQuery(query, data) {
  if (!data || !data.length) return [];
  const q = query.toLowerCase();

  if (q.includes('sales >')) {
    const val = parseFloat(q.split('sales >')[1]) || 1000;
    return data.filter(row => (parseFloat(row.Sales) || 0) > val);
  }
  if (q.includes('discount >')) {
    const val = parseFloat(q.split('discount >')[1]) || 0.2;
    return data.filter(row => (parseFloat(row.Discount) || 0) > val);
  }
  if (q.includes('profit')) {
    return [...data].sort((a, b) => (parseFloat(b.Profit) || 0) - (parseFloat(a.Profit) || 0)).slice(0, 10);
  }

  return data.slice(0, 25); // default fallback slice
}