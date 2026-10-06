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
      // Updated to point to your live Render backend URL
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
        <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800
