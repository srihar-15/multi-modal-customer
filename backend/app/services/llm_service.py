import os
import google.genai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            print("Warning: GOOGLE_API_KEY not found in .env")
        
        genai.configure(api_key=self.api_key)
        # User requested Gemini 3 Pro - defaulting to latest 2.0 Flash Exp as closest proxy
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    async def get_response(self, prompt: str, context: str = "") -> dict:
        try:
            # Construct a structured prompt to enforce the output format we want
            full_prompt = f"""
            You are a helpful Customer Support Agent.
            
            Context: {context}
            
            User Message: {prompt}
            
            Instructions:
            1. Analyze the intent (complaint, refund, technical, sales, general_info).
            2. Provide a natural, helpful response.
            3. Rate your confidence (0.0 to 1.0). If you are unsure or if it's sensitive, lower the score.
            
            Output Format (Strictly just this format):
            Response: [Your response here]
            Intent: [Intent]
            Confidence: [0.0-1.0]
            """
            
            response = self.model.generate_content(full_prompt)
            text = response.text
            
            # Simple parsing of the response
            # In a production app, we would use structured keys or JSON mode
            response_text = "I couldn't process that."
            intent = "unknown"
            confidence = 0.5
            
            lines = text.split('\n')
            for line in lines:
                if line.startswith("Response:"):
                    response_text = line.replace("Response:", "").strip()
                elif line.startswith("Intent:"):
                    intent = line.replace("Intent:", "").strip()
                elif line.startswith("Confidence:"):
                    try:
                        confidence = float(line.replace("Confidence:", "").strip())
                    except:
                        confidence = 0.5
                        
            return {
                "text": response_text,
                "intent": intent,
                "confidence": confidence
            }
            
        except Exception as e:
            print(f"LLM Error: {e}")
            return {
                "text": f"I'm having trouble connecting to my brain right now. Error: {str(e)}",
                "intent": "error",
                "confidence": 0.0
            }
