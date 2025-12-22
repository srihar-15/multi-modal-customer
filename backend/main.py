from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.api import endpoints

load_dotenv()

app = FastAPI(
    title="Multi-Modal Customer Support Agent",
    description="Backend for AI Agent handling Text, Voice, and Image inputs.",
    version="0.1.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Standard Vite port
    "http://localhost:3000",
        "https://multi-modal-customer-kq7l.vercel.app",
        "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api/v1", tags=["chat"])

@app.get("/")
async def root():
    return {"message": "Multi-Modal Agent Backend is Running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
