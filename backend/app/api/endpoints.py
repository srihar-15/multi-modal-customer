from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..schemas import ChatRequest, AgentResponse
from ..services.llm_service import LLMService
from ..services.speech_service import SpeechService
from ..services.vision_service import VisionService

router = APIRouter()
llm_service = LLMService()
speech_service = SpeechService()
vision_service = VisionService()

@router.post("/chat/text", response_model=AgentResponse)
async def chat_text(request: ChatRequest):
    # Retrieve context (mock for now)
    context = request.context or ""
    
    result = await llm_service.get_response(request.message, context)
    
    escalate = result["confidence"] < 0.8
    
    return AgentResponse(
        response_text=result["text"],
        confidence_score=result["confidence"],
        escalate_to_human=escalate,
        intent=result["intent"],
        suggested_actions=["Check Order Status", "Contact Support"]
    )

@router.post("/chat/voice", response_model=AgentResponse)
async def chat_voice(session_id: str = Form(...), audio: UploadFile = File(...)):
    transcribed_text = await speech_service.transcribe(audio.file)
    
    # Send transcribed text to LLM
    result = await llm_service.get_response(transcribed_text)
    
    return AgentResponse(
        response_text=result["text"],
        confidence_score=result["confidence"], # In real app, combine STT confidence + LLM confidence
        escalate_to_human=False,
        intent=result["intent"]
    )

@router.post("/chat/image", response_model=AgentResponse)
async def chat_image(session_id: str = Form(...), image: UploadFile = File(...), message: str = Form(None)):
    image_analysis = await vision_service.analyze_image(image.file)
    
    # Combine image analysis with user message
    prompt = f"User provided image description: {image_analysis}. User message: {message or ''}"
    
    result = await llm_service.get_response(prompt)
    
    return AgentResponse(
        response_text=result["text"],
        confidence_score=result["confidence"],
        escalate_to_human=False,
        intent=result["intent"]
    )
