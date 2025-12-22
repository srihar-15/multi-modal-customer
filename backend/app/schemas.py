from pydantic import BaseModel, Field
from typing import Optional, List, Union

class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Unique session ID for the user")
    message: str = Field(..., description="User's text message")
    context: Optional[str] = Field(None, description="Previous context or RAG retrieval")

class AgentResponse(BaseModel):
    response_text: str
    confidence_score: float
    escalate_to_human: bool
    intent: str
    suggested_actions: Optional[List[str]] = None

class FeedbackRequest(BaseModel):
    session_id: str
    message_id: str
    rating: int  # 1-5
