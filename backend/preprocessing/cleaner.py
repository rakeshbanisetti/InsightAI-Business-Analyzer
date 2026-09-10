import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any

class DataCleaner:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.report = {
            "initial_rows": len(df),
            "initial_cols": len(df.columns),
            "duplicates_removed": 0,
            "missing_values_handled": 0,
            "cleaned_columns": [],
            "outliers_detected": {}
        }

    def clean(self) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Executes the full automated cleaning pipeline."""
        self._remove_duplicates()
        self._clean_data_types()
        self._handle_missing_values()
        self._detect_outliers()
        
        self.report["final_rows"] = len(self.df)
        self.report["final_cols"] = len(self.df.columns)
        return self.df, self.report

    def _remove_duplicates(self):
        """Detects and drops exact duplicate rows."""
        dup_count = self.df.duplicated().sum()
        if dup_count > 0:
            self.df = self.df.drop_duplicates().reset_index(drop=True)
            self.report["duplicates_removed"] = int(dup_count)

    def _clean_data_types(self):
        """Fixes string formatting issues (e.g. '$1,000', '25%') and attempts date parsing."""
        for col in self.df.columns:
            if self.df[col].dtype == 'object':
                sample_str = self.df[col].dropna().astype(str).str.strip()
                
                # Strip currency symbols and commas if values are numeric
                cleaned_num = sample_str.str.replace(r'[$,₹]', '', regex=True).str.replace(',', '', regex=False)
                if cleaned_num.str.replace('.', '', regex=False).str.isnumeric().all() and not sample_str.empty:
                    self.df[col] = pd.to_numeric(cleaned_num, errors='coerce')
                    self.report["cleaned_columns"].append(f"Converted '{col}' to numeric")
                    continue

                # Attempt date conversion for date/time columns
                if "date" in col.lower() or "time" in col.lower():
                    try:
                        self.df[col] = pd.to_datetime(self.df[col])
                        self.report["cleaned_columns"].append(f"Converted '{col}' to datetime")
                    except Exception:
                        pass

    def _handle_missing_values(self):
        """Fills missing values based on column type."""
        missing_before = int(self.df.isnull().sum().sum())
        
        for col in self.df.columns:
            if self.df[col].isnull().sum() > 0:
                if pd.api.types.is_numeric_dtype(self.df[col]):
                    median_val = self.df[col].median()
                    self.df[col] = self.df[col].fillna(median_val)
                else:
                    mode_val = self.df[col].mode()
                    fill_val = mode_val[0] if not mode_val.empty else "Unknown"
                    self.df[col] = self.df[col].fillna(fill_val)
                    
        missing_after = int(self.df.isnull().sum().sum())
        self.report["missing_values_handled"] = missing_before - missing_after

    def _detect_outliers(self):
        """Identifies statistical outliers using IQR without destructive deletion."""
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            q1 = self.df[col].quantile(0.25)
            q3 = self.df[col].quantile(0.75)
            iqr = q3 - q1
            if iqr > 0:
                outliers = int(((self.df[col] < (q1 - 1.5 * iqr)) | (self.df[col] > (q3 + 1.5 * iqr))).sum())
                if outliers > 0:
                    self.report["outliers_detected"][col] = outliers