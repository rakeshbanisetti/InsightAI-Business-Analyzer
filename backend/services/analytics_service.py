import pandas as pd
import numpy as np
from typing import Dict, Any, List

class AnalyticsEngine:
    def __init__(self, df: pd.DataFrame, column_roles: Dict[str, List[str]]):
        self.df = df
        self.roles = column_roles

    def generate_analytics(self) -> Dict[str, Any]:
        """Calculates dynamic business metrics, group aggregations, and trends."""
        return {
            "kpis": self._calculate_kpis(),
            "group_analysis": self._analyze_groups(),
            "trend_analysis": self._analyze_trends(),
            "key_findings": self._extract_key_findings()
        }

    def _calculate_kpis(self) -> Dict[str, Any]:
        """Generates statistical KPIs for numerical columns dynamically."""
        kpis = {}
        numeric_cols = self.roles.get("numerical", [])
        
        for col in numeric_cols:
            kpis[col] = {
                "total": float(self.df[col].sum()),
                "average": float(self.df[col].mean()),
                "median": float(self.df[col].median()),
                "min": float(self.df[col].min()),
                "max": float(self.df[col].max())
            }
        return kpis

    def _analyze_groups(self) -> Dict[str, Any]:
        """Groups numeric metrics by available categorical variables."""
        group_results = {}
        categorical_cols = self.roles.get("categorical", [])
        numeric_cols = self.roles.get("numerical", [])

        # Limit to top 3 categorical variables to keep response lightweight
        for cat in categorical_cols[:3]:
            group_results[cat] = {}
            for num in numeric_cols[:2]:
                grouped = self.df.groupby(cat)[num].sum().sort_values(ascending=False).head(5)
                group_results[cat][num] = grouped.to_dict()

        return group_results

    def _analyze_trends(self) -> Dict[str, Any]:
        """Computes time-based aggregations if datetime columns exist."""
        trend_results = {}
        datetime_cols = self.roles.get("datetime", [])
        numeric_cols = self.roles.get("numerical", [])

        if datetime_cols and numeric_cols:
            date_col = datetime_cols[0]
            temp_df = self.df.copy()
            
            # Convert to datetime if necessary and group by month
            if not pd.api.types.is_datetime64_any_dtype(temp_df[date_col]):
                temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
            
            temp_df = temp_df.dropna(subset=[date_col])
            temp_df['YearMonth'] = temp_df[date_col].dt.to_period('M').astype(str)

            for num in numeric_cols[:2]:
                monthly = temp_df.groupby('YearMonth')[num].sum().to_dict()
                trend_results[num] = monthly

        return trend_results

    def _extract_key_findings(self) -> List[str]:
        """Generates human-readable deterministic insights."""
        findings = []
        categorical_cols = self.roles.get("categorical", [])
        numeric_cols = self.roles.get("numerical", [])

        if categorical_cols and numeric_cols:
            cat = categorical_cols[0]
            num = numeric_cols[0]
            top_performer = self.df.groupby(cat)[num].sum().idxmax()
            top_val = self.df.groupby(cat)[num].sum().max()
            findings.append(f"Top performing {cat} for {num} is '{top_performer}' with a total of {top_val:,.2f}.")

        return findings
    