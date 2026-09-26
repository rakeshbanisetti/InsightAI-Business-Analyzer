import React, { useState, useEffect, useMemo } from 'react';
import FileUploader from './components/FileUploader';
import KpiCards from './components/KpiCards';
import ExecutiveSummary from './components/ExecutiveSummary';
import AnalyticsCharts from './components/AnalyticsCharts';
import MultiCharts from './components/MultiCharts';
import CustomChartBuilder from './components/CustomChartBuilder';
import StrategicCopilot from './components/StrategicCopilot';
import DataTable from './components/DataTable';
import DataChat from './components/DataChat';
import DataQueryAssistant from './components/DataQueryAssistant';
import ReportExporter from './components/ReportExporter';
import FilterBar from './components/FilterBar';
import { Sparkles, Layers, LayoutDashboard, BarChart3, Database } from 'lucide-react';

export default function App() {
  const [analysisData, setAnalysisData] = useState(() => {
    const saved = localStorage.getItem('insightai_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTableData, setActiveTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('executive');
  const [queryPlan, setQueryPlan] = useState(null);

  useEffect(() => {
    if (analysisData) {
      localStorage.setItem('insightai_session', JSON.stringify(analysisData));
      if (!activeTableData && analysisData.table_preview) {
        setActiveTableData(analysisData.table_preview);
      }
    }
  }, [analysisData]);

  // Compute groupAnalysis safely from table preview and columns
  const groupAnalysis = useMemo(() => {
    if (analysisData?.analytics?.group_analysis) {
      return analysisData.analytics.group_analysis;
    }
    const rawData = analysisData?.table_preview || [];
    const columns = analysisData?.columns || [];
    if (!rawData.length || !columns.length) return {};
    
    const analysis = {};
    columns.forEach((col) => {
      analysis[col] = {};
      rawData.forEach((row) => {
        const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : 'Unknown';
        if (!analysis[col][val]) {
          analysis[col][val] = {
            Sales: 0,
            Profit: 0,
            Quantity: 0,
            Discount: 0
          };
        }
        analysis[col][val].Sales += parseFloat(row.Sales) || 0;
        analysis[col][val].Profit += parseFloat(row.Profit) || 0;
        analysis[col][val].Quantity += parseFloat(row.Quantity) || 0;
        analysis[col][val].Discount += parseFloat(row.Discount) || 0;
      });
    });
    return analysis;
  }, [analysisData]);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setActiveTableData(data?.table_preview || []);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleClearSession = () => {
    localStorage.removeItem('insightai_session');
    setAnalysisData(null);
    setActiveTableData(null);
    setQueryPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-900 selection:bg-indigo-600 selection:text-white font-sans antialiased relative overflow-x-hidden">
      {/* Balanced Soft Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 relative z-10">
        {/* Elite Header Container */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/90 backdrop-blur-xl border border-slate-300/80 rounded-3xl p-6 shadow-xl transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-ping" />
                Enterprise BI v2.0
              </span>
              <span className="text-xs text-slate-500 font-medium">Secure Session Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              InsightAI Strategic Copilot
            </h1>
            <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed">
              Multi-dimensional analytics engine transforming raw transactional logs into executive-grade visualizations and risk intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {analysisData && (
              <>
                <button
                  onClick={handleClearSession}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-200 rounded-2xl transition-all shadow-sm"
                >
                  New Session
                </button>
                <ReportExporter elementId="dashboard-content" />
              </>
            )}
          </div>
        </header>

        {/* File Uploader Card */}
        <div className="bg-white/90 border border-slate-300/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <FileUploader onAnalysisComplete={handleAnalysisComplete} setLoading={setLoading} loading={loading} />
        </div>

        {analysisData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Enterprise Tab Selector */}
            <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-2xl border border-slate-300/80 backdrop-blur-xl overflow-x-auto shadow-md">
              <button
                onClick={() => setActiveTab('executive')}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 transform whitespace-nowrap ${
                  activeTab === 'executive'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 transform whitespace-nowrap ${
                  activeTab === 'studio'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & BI Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('workbench')}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 transform whitespace-nowrap ${
                  activeTab === 'workbench'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Data Workbench</span>
              </button>
            </div>

            <FilterBar
              columns={analysisData.columns || []}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Main Content Area */}
            <div id="dashboard-content" className="space-y-6 transition-all duration-500">
              {activeTab === 'executive' && (
                <div className="space-y-6">
                  <KpiCards analytics={analysisData.analytics} datasetSummary={analysisData.dataset_summary} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                    <ExecutiveSummary narrative={analysisData.ai_insights?.recommendations || analysisData.recommendations} />
                    <StrategicCopilot insights={analysisData.ai_insights} />
                  </div>
                  <div className="w-full">
                    <DataChat 
                      rawData={analysisData.table_preview || []} 
                      columns={analysisData.columns || []} 
                      analytics={analysisData.analytics}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'studio' && (
                <div className="space-y-6">
                  {analysisData.columns && (
                    <div className="bg-white/90 border border-slate-300/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl space-y-4">
                      <div className="flex items-center space-x-2 text-indigo-600 font-bold text-base">
                        <Layers className="h-5 w-5" />
                        <span>Power BI Studio: Custom Chart Builder</span>
                      </div>
                      <CustomChartBuilder 
                        columns={analysisData.columns} 
                        data={analysisData.table_preview || []} 
                        groupAnalysis={groupAnalysis}
                        defaultX="Ship Mode"
                        defaultMetric="Sales"
                      />
                    </div>
                  )}

                  <AnalyticsCharts 
                    groupAnalysis={groupAnalysis} 
                    rawData={analysisData.table_preview || []} 
                    columns={analysisData.columns || []}
                  />
                  <MultiCharts 
                    timeSeries={analysisData.time_series}
                    regionData={analysisData.region_data}
                    rawData={analysisData.table_preview || []}
                    columns={analysisData.columns || []} 
                  />
                </div>
              )}

              {activeTab === 'workbench' && (
                <div className="w-full space-y-6">
                  <DataQueryAssistant
                    columns={analysisData.columns}
                    rawData={analysisData.table_preview}
                    onQueryApply={(filteredData, plan) => {
                      setActiveTableData(filteredData);
                      setQueryPlan(plan);
                    }}
                  />
                  <DataTable data={activeTableData || analysisData.table_preview} queryPlan={queryPlan} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}