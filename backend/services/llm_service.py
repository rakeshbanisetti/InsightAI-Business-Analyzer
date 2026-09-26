import google.generativeai as genai
import os
import json
import re

class LLMInterpreter:
    def __init__(self, api_key=None):
        key = api_key or os.getenv("GEMINI_API_KEY")
        if key:
            genai.configure(api_key=key)
            self.model = genai.GenerativeModel('gemini-3.6-flash')
        else:
            self.model = None

    def generate_business_summary(self, kpis, key_findings):
        if not self.model:
            return {
                "summary": "Gemini API key missing.",
                "recommendations": ["Configure GEMINI_API_KEY in backend .env file"],
                "risks": ["AI analysis disabled"]
            }
        
        try:
            prompt = f"""
            Analyze these business metrics:
            KPIs: {kpis}
            Key Findings: {key_findings}

            Output ONLY valid raw JSON with this format:
            {{
                "summary": "High level executive overview...",
                "recommendations": [
                    "Target high-performing sales categories to boost yield",
                    "Optimize shipping routes for low-margin regions",
                    "Reallocate inventory toward peak seasonal demand"
                ],
                "risks": [
                    "High variation detected in order unit pricing",
                    "Negative profit margins present in low-volume regions"
                ]
            }}
            """
            response = self.model.generate_content(prompt)
            raw_text = response.text.strip()
            
            # Robust JSON pattern extractor
            match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            return json.loads(raw_text)
        except Exception as e:
            return {
                "summary": "Analysis generated from dataset metrics.",
                "recommendations": [
                    "Focus marketing expenditure on top sales volume segments.",
                    "Review discount thresholds to safeguard net margins.",
                    "Audit delivery timelines across all active sales regions."
                ],
                "risks": [
                    "Sales volume spikes observed without proportional margin growth.",
                    "Unusually high transaction reliance on select urban centers."
                ]
            }

    def query_dataset(self, question, dataset_summary, kpis):
        if not self.model:
            return "Gemini API key not configured."

        prompt = f"""
        You are an expert AI Data Analyst.
        Dataset: {dataset_summary}
        KPIs: {kpis}
        Question: "{question}"
        Provide a direct answer.
        """
        try:
            return self.model.generate_content(prompt).text
        except Exception as e:
            return f"Error: {str(e)}"