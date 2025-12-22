import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
print(f"Key loaded: {api_key[:5]}...{api_key[-4:] if api_key else 'None'}")

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, can you hear me?")
    print("Success!")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
