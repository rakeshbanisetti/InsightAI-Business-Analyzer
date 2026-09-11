import React, { useState } from 'react';
import { 
  BarChart3, 
  Upload, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import FileUpload from './components/FileUpload';

export default function App() {
  // --- ADD STATE & HANDLER HERE ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = async (file) => {
    setIsAnalyzing(true);
    console.log('Sending file to backend:', file.name);

    // Backend fetch integration will go here
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`File "${file.name}" received! Ready to send to http://localhost:8000/api/analyze`);
    }, 1500);
  };
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              InsightAI
            </h1>
            <p className="text-xs text-slate-500 font-medium">Business Intelligence Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            System Operational
          </span>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/20">
            New Analysis
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        
        {/* Hero Banner / Upload Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Turn Raw Financial Data into <span className="text-indigo-400">Actionable Insights</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Upload your business datasets, sales reports, or transaction histories to generate instant automated forecasting, anomaly detection, and executive summaries.
            </p>
          </div>

          {/* Interactive File Upload Component */}
          <FileUpload onFileUpload={handleAnalysisStart} isLoading={isAnalyzing} />
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Revenue Analyzed</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">$128,450.00</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" /> +12.4% vs last quarter
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Processed Records</span>
              <FileText className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,240,890</div>
            <p className="text-xs text-slate-500">across 4 uploaded files</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Risk Anomaly Score</span>
              <ShieldCheck className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">0.02%</div>
            <p className="text-xs text-emerald-400 font-medium">Low risk detected</p>
          </div>
        </section>

      </main>
    </div>
  );
}