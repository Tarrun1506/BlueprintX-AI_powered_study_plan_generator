from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.ollama_service import generate_quiz, chat_with_context

router = APIRouter()

class QuizRequest(BaseModel):
    topic_name: str
    topic_context: Optional[str] = ""
    difficulty: str = "Medium"

class ChatRequest(BaseModel):
    topic_context: str
    user_query: str

@router.post("/quiz")
async def create_quiz(request: QuizRequest):
    """Generate a quiz for a topic."""
    try:
        if not request.topic_name:
             raise HTTPException(status_code=400, detail="Topic name is required")
        
        quiz = await generate_quiz(request.topic_name, request.topic_context, request.difficulty)
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_topic(request: ChatRequest):
    """Chat with context about a topic."""
    try:
        if not request.user_query:
            raise HTTPException(status_code=400, detail="Query is required")
            
        response = await chat_with_context(request.user_query, request.topic_context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
