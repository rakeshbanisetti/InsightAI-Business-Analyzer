import React, { useMemo } from 'react';

export default function DataTable({ data = [], queryPlan = null }) {
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!queryPlan) return data;

    let result = [...data];

    // Filter using query expression
    if (queryPlan.query_str) {
      const match = queryPlan.query_str.match(/([\w\s]+)\s*(>|<|==|>=|<=|!=)\s*(.+)/);
      if (match) {
        const [, field, operator, rawVal] = match;
        const col = field.trim();
        const val = rawVal.trim().replace(/^['"]|['"]$/g, '');
        const numVal = Number(val);

        result = result.filter((row) => {
          const rowVal = row[col];
          if (rowVal === undefined) return true;

          const compareRowVal = isNaN(Number(rowVal)) ? String(rowVal).toLowerCase() : Number(rowVal);
          const compareTarget = isNaN(numVal) ? val.toLowerCase() : numVal;

          switch (operator) {
            case '>': return compareRowVal > compareTarget;
            case '<': return compareRowVal < compareTarget;
            case '>=': return compareRowVal >= compareTarget;
            case '<=': return compareRowVal <= compareTarget;
            case '==': return compareRowVal == compareTarget;
            case '!=': return compareRowVal != compareTarget;
            default: return true;
          }
        });
      }
    }

    // Sort evaluation
    if (queryPlan.sort_by && result.length > 0) {
      const col = queryPlan.sort_by;
      const asc = queryPlan.ascending !== false;
      result.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });
    }

    // Limit evaluation
    if (queryPlan.limit && queryPlan.limit > 0) {
      result = result.slice(0, queryPlan.limit);
    }

    return result;
  }, [data, queryPlan]);

  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-sm p-4">No dataset preview loaded.</div>;
  }

  const columns = Object.keys(data[0] || {});

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Data Workbench Results
        </h3>
        {queryPlan && (
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
            Filter applied: {queryPlan.query_str || 'Sorted/Limited'}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col} className="p-3 border-b border-slate-800 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="p-3 whitespace-nowrap text-slate-200">
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}