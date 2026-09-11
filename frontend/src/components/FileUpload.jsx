import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function FileUpload({ onFileUpload, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['.csv', '.xlsx', '.json'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a valid CSV, XLSX, or JSON file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyzeClick = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <input 
        ref={fileInputRef}
        type="file" 
        id="file-upload-input" 
        className="hidden" 
        accept=".csv,.xlsx,.json"
        onChange={handleChange}
      />

      {!selectedFile ? (
        <div 
          className={`mt-8 border-2 border-dashed rounded-xl p-8 text-center bg-slate-950/40 transition-all cursor-pointer ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-slate-700 hover:border-indigo-500/80'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center transition-colors mb-4">
            <Upload className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">Upload Dataset to Analyze</h3>
          <p className="text-sm text-slate-500 mt-1">Drag and drop or browse your files (CSV, XLSX, JSON up to 50MB)</p>
          
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <span>Browse Files</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      ) : (
        <div className="mt-8 border border-slate-700/80 rounded-xl p-6 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <File className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <button 
              onClick={handleRemoveFile}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Ready for processing
            </span>
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing Pipeline...' : 'Run Intelligence Analysis'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}