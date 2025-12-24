from pydantic import BaseModel
from typing import List, Optional

class Topic(BaseModel):
    name: str
    importance: str # e.g., High, Medium, Low
    estimated_hours: Optional[float] = None
    scheduled_date: Optional[str] = None # ISO Format YYYY-MM-DD
    completed: bool = False
    subtopics: List['Topic'] = []

# Allow Topic to reference itself for subtopics
Topic.model_rebuild()

class SyllabusAnalysisResponse(BaseModel):
    filename: Optional[str] = None
    content_hash: Optional[str] = None
    topics: List[Topic]
    total_study_hours: Optional[float] = None
    priority_topics: List[Topic] = []