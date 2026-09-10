from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from preprocessing.cleaner import DataCleaner
from services.dataset_service import DatasetAnalyzer
from services.analytics_service import AnalyticsEngine
from services.chart_service import ChartEngine
from services.llm_service import LLMInterpreter

app = FastAPI(
    title="InsightAI Business Analyzer API",
    description="Automated business intelligence backend providing cleaning, dynamic schema inference, analytics, and interactive charts.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "InsightAI Business Analyzer API is operational."}

@app.post("/api/analyze")
async def analyze_dataset(file: UploadFile = File(...)):
    """Uploads a CSV dataset, cleans it, infers schema, executes analytics, and generates chart configs."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are currently supported.")

    try:
        # Read raw CSV
        contents = await file.read()
        df_raw = pd.read_csv(io.BytesIO(contents))

        # 1. Pipeline: Data Cleaning
        cleaner = DataCleaner(df_raw)
        df_clean, cleaning_report = cleaner.clean()

        # 2. Pipeline: Dataset Schema & Role Inference
        analyzer = DatasetAnalyzer(df_clean)
        dataset_summary = analyzer.get_summary()

        # 3. Pipeline: Analytics Computation
        analytics = AnalyticsEngine(df_clean, dataset_summary["column_roles"])
        analytics_results = analytics.generate_analytics()

        # 4. Pipeline: Chart Schema Generation
        chart_engine = ChartEngine(df_clean, dataset_summary["column_roles"])
        charts = chart_engine.generate_chart_configs()

        # 5. Pipeline: LLM Strategic Interpretation
        llm = LLMInterpreter()
        narrative_summary = llm.generate_business_summary(
            kpis=analytics_results["kpis"],
            key_findings=analytics_results["key_findings"]
        )

        return {
            "status": "success",
            "cleaning_report": cleaning_report,
            "dataset_summary": dataset_summary,
            "analytics": analytics_results,
            "charts": charts,
            "executive_summary": narrative_summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing dataset: {str(e)}")