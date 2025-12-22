import os
import google.generativeai as genai
from PIL import Image
import io

class VisionService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    async def analyze_image(self, image_file) -> str:
        try:
            # Read image bytes
            image_bytes = await image_file.read()
            image = Image.open(io.BytesIO(image_bytes))
            
            prompt = "Analyze this image for a customer support agent. Describe what is in the image, specifically looking for product details, error messages, or damaged items. Keep it concise."
            
            response = self.model.generate_content([prompt, image])
            
            return response.text
        except Exception as e:
            print(f"Vision Error: {e}")
            return "Unable to analyze image."
