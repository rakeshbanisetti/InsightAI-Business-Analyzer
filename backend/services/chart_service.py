import pandas as pd
import numpy as np
from typing import Dict, Any, List

class ChartEngine:
    def __init__(self, df: pd.DataFrame, column_roles: Dict[str, List[str]]):
        self.df = df
        self.roles = column_roles

    def generate_chart_configs(self) -> List[Dict[str, Any]]:
        """Generates dynamic, interactive chart specifications based on inferred schema."""
        charts = []

        # 1. Bar Chart: Top Category vs Numeric KPI
        categorical_cols = self.roles.get("categorical", [])
        numeric_cols = self.roles.get("numerical", [])
        datetime_cols = self.roles.get("datetime", [])

        if categorical_cols and numeric_cols:
            cat_col = categorical_cols[0]
            num_col = numeric_cols[0]
            top_data = self.df.groupby(cat_col)[num_col].sum().nlargest(10).reset_index()

            charts.append({
                "id": "bar_top_categories",
                "title": f"Top 10 {cat_col} by {num_col}",
                "type": "bar",
                "data": {
                    "labels": top_data[cat_col].astype(str).tolist(),
                    "values": top_data[num_col].round(2).tolist()
                },
                "axis_labels": {"x": cat_col, "y": num_col}
            })

        # 2. Line Chart: Time Series Trend
        if datetime_cols and numeric_cols:
            date_col = datetime_cols[0]
            num_col = numeric_cols[0]
            
            temp_df = self.df.copy()
            if not pd.api.types.is_datetime64_any_dtype(temp_df[date_col]):
                temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
            
            temp_df = temp_df.dropna(subset=[date_col])
            temp_df['YearMonth'] = temp_df[date_col].dt.to_period('M').astype(str)
            trend_data = temp_df.groupby('YearMonth')[num_col].sum().reset_index()

            charts.append({
                "id": "line_time_trend",
                "title": f"Monthly Trend for {num_col}",
                "type": "line",
                "data": {
                    "labels": trend_data['YearMonth'].tolist(),
                    "values": trend_data[num_col].round(2).tolist()
                },
                "axis_labels": {"x": "Month", "y": num_col}
            })

        # 3. Pie/Donut Chart: Share Distribution across primary Category
        if len(categorical_cols) > 0 and numeric_cols:
            cat_col = categorical_cols[0]
            num_col = numeric_cols[0]
            pie_data = self.df.groupby(cat_col)[num_col].sum().nlargest(5).reset_index()

            charts.append({
                "id": "pie_category_share",
                "title": f"Distribution of {num_col} by {cat_col}",
                "type": "pie",
                "data": {
                    "labels": pie_data[cat_col].astype(str).tolist(),
                    "values": pie_data[num_col].round(2).tolist()
                }
            })

        return charts