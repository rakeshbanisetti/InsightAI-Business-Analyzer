import React, { useState } from 'react';
import { Upload, FileText, Sparkles, X, AlertCircle } from 'lucide-react';

export default function FileUploader({ onAnalysisComplete, setLoading, loading }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://insightai-business-analyzer-api.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint not found. Make sure the Render backend URL is correct.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload and analyze file');
      }

      const data = await response.json();
      if (typeof onAnalysisComplete === 'function') {
        onAnalysisComplete(data);
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-700/80 hover:border-indigo-500/50 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <p className="mb-1 text-sm text-slate-300 font-medium">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">CSV or Excel datasets (up to 50MB)</p>
          </div>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-emerald-400 font-medium">Ready for processing</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemoveFile}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleUploadAndAnalyze}
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing...' : 'Run Intelligence Analysis'}</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
