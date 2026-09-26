import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro'; // Updated import to support OKLCH colors

export default function ReportExporter({ elementId = 'dashboard-content' }) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    const input = document.getElementById(elementId);
    if (!input) {
      alert(`Element #${elementId} not found.`);
      return;
    }

    setExporting(true);

    try {
      // Capture dashboard with full CSS/oklch compatibility
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617', // Slate-950 dark theme background
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const renderHeight = (imgHeight * pdfWidth) / imgWidth;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, renderHeight);
      pdf.save('InsightAI_Executive_Report.pdf');
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert(`PDF Export Failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportPDF}
      disabled={exporting}
      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Export PDF Executive Report</span>
        </>
      )}
    </button>
  );
}