import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Try specific model name that definitely exists
model_name = "gemini-1.5-flash"

try:
    print(f"Testing {model_name}...")
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello")
    print("Success!")
except Exception as e:
    print(f"Failed with {model_name}: {e}")
    try:
        model_name = "models/gemini-1.5-flash"
        print(f"Testing {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print("Success!")
    except Exception as e2:
        print(f"Failed with {model_name}: {e2}")
