import os
from typing import Dict, Any, List
import google.generativeai as genai

class LLMInterpreter:
    def __init__(self, api_key: str = None):
        # Retrieve key from parameter or environment variable
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def generate_business_summary(self, kpis: Dict[str, Any], key_findings: List[str]) -> str:
        """Translates structured statistical output into an executive summary."""
        if not self.model:
            return "Gemini API key not configured. Displaying calculated insights only."

        prompt = f"""
        You are an expert business intelligence consultant. 
        Analyze the following pre-calculated metrics and key findings to write a concise, professional executive summary for stakeholders.
        Do NOT invent or calculate new numbers; rely strictly on the provided data.

        Calculated KPIs:
        {kpis}

        Deterministic Key Findings:
        {key_findings}

        Provide 3-4 bullet points outlining performance, risks, and strategic recommendations.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating narrative summary: {str(e)}"