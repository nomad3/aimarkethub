from openai import OpenAI
import os
import re

class PaperAnalyzer:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_KEY'))
    
    def generate_summary(self, text):
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{
                "role": "user",
                "content": f"Resume este paper en 3 puntos clave: {text[:3000]}..."
            }]
        )
        return response.choices[0].message.content
    
    def calculate_market_potential(self, text):
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{
                "role": "user",
                "content": f"Evalúa el potencial comercial (0-10) de esta investigación: {text[:3000]}... Justificación breve."
            }]
        )
        return self.parse_score(response.choices[0].message.content)

    def parse_score(self, text):
        # Extraer score usando regex mejorado
        match = re.search(r'\b(\d{1,2}(?:\.\d{1,2})?)/10\b', text)
        if match:
            return min(float(match.group(1)), 10.0)
        return 5.0  # Valor por defecto seguro 