import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

candidates = [
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "models/gemini-1.5-flash-001",
    "gemini-1.5-flash-latest",
    "models/gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp", 
    "models/gemini-2.0-flash-exp"
]

print("Testing models...")
for model_name in candidates:
    try:
        print(f"Trying: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hi")
        print(f"SUCCESS with {model_name}")
        break
    except Exception as e:
        print(f"FAILED {model_name}: {e}")
