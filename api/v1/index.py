import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backend')
sys.path.insert(0, backend_path)

# Import the FastAPI app from backend
from backend.main import app

# Export the app for Vercel
app = app
