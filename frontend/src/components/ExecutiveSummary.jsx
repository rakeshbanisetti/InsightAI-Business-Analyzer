import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function ExecutiveSummary({ narrative }) {
  // Extract recommendations whether 'narrative' is passed as an array, an object with recommendations, or a string
  const items = Array.isArray(narrative) 
    ? narrative 
    : (narrative?.recommendations || narrative?.bullets || [narrative]);

  return (
    <div className="w-full h-full bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-lg mb-4">
          <Lightbulb className="h-5 w-5" />
          <h2>AI Strategic Recommendations</h2>
        </div>
        {Array.isArray(items) && items.length > 1 ? (
          <ul className="space-y-3 text-slate-300 text-sm list-disc list-inside">
            {items.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-sm">{typeof narrative === 'string' ? narrative : (items[0] || "No recommendations generated yet.")}</p>
        )}
      </div>
    </div>
  );
}