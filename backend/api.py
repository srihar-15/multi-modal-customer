# Vercel Serverless Function Wrapper
from main import app

# Export the FastAPI app for Vercel
# Vercel will map requests to this handler
asgi_app = app
