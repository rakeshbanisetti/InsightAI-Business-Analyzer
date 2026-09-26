import pandas as pd
import numpy as np

class AnalyticsEngine:
    def __init__(self, df: pd.DataFrame, column_roles: dict):
        self.df = df
        self.roles = column_roles

    def generate_analytics(self) -> dict:
        kpis = {}
        key_findings = []
        anomalies = []

        # Numerical Anomaly Detection (Z-Score)
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            mean = self.df[col].mean()
            std = self.df[col].std()
            if std > 0:
                z_scores = (self.df[col] - mean) / std
                outliers = self.df[np.abs(z_scores) > 3]
                if not outliers.empty:
                    anomalies.append({
                        "column": col,
                        "count": len(outliers),
                        "max_value": float(outliers[col].max()),
                        "min_value": float(outliers[col].min()),
                        "message": f"Detected {len(outliers)} statistical outlier(s) in '{col}' (Z-Score > 3)."
                    })

        return {
            "kpis": kpis,
            "key_findings": key_findings,
            "anomalies": anomalies
        }