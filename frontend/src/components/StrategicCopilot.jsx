import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function StrategicCopilot({ insights }) {
  return (
    <div className="w-full h-full bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-lg mb-4">
          <AlertTriangle className="h-5 w-5" />
          <h2>Risk & Anomaly Radar</h2>
        </div>
        {Array.isArray(insights?.risks) ? (
          <ul className="space-y-3 text-slate-300 text-sm list-disc list-inside">
            {insights.risks.map((risk, index) => (
              <li key={index} className="leading-relaxed">
                {risk}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm">No risk anomalies detected.</p>
        )}
      </div>
    </div>
  );
}