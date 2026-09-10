import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DatasetAnalyzer:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def get_summary(self) -> Dict[str, Any]:
        """Generates comprehensive structural metadata and infers dynamic column roles."""
        roles = self._infer_column_roles()
        
        return {
            "shape": {
                "rows": len(self.df),
                "columns": len(self.df.columns)
            },
            "columns": list(self.df.columns),
            "column_roles": roles,
            "missing_values": self.df.isnull().sum().to_dict(),
            "data_types": {col: str(dtype) for col, dtype in self.df.dtypes.items()},
            "unique_counts": {col: int(self.df[col].nunique()) for col in self.df.columns}
        }

    def _infer_column_roles(self) -> Dict[str, List[str]]:
        """Classifies columns into semantic roles based on names and data types."""
        roles = {
            "numerical": [],
            "categorical": [],
            "datetime": [],
            "location": [],
            "identifier": [],
            "target_candidates": []
        }

        location_keywords = ["city", "state", "country", "region", "zip", "postal", "address"]
        id_keywords = ["id", "code", "number", "key"]

        for col in self.df.columns:
            col_lower = col.lower()
            dtype = self.df[col].dtype

            # 1. Datetime detection
            if pd.api.types.is_datetime64_any_dtype(dtype) or "date" in col_lower or "time" in col_lower:
                roles["datetime"].append(col)
                continue

            # 2. Location detection
            if any(keyword in col_lower for keyword in location_keywords):
                roles["location"].append(col)

            # 3. Identifier detection
            if any(keyword in col_lower for keyword in id_keywords) or self.df[col].nunique() == len(self.df):
                roles["identifier"].append(col)
                continue

            # 4. Numerical detection
            if pd.api.types.is_numeric_dtype(dtype):
                roles["numerical"].append(col)
                # Numerical fields with good variance are prime target candidates for ML prediction
                if self.df[col].nunique() > 5:
                    roles["target_candidates"].append(col)
            
            # 5. Categorical detection
            elif pd.api.types.is_object_dtype(dtype) or pd.api.types.is_categorical_dtype(dtype):
                roles["categorical"].append(col)

        return roles
    