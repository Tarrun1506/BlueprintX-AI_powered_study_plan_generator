from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, PlainSerializer
from typing import List, Optional, Dict, Any, Annotated
from datetime import datetime
from bson import ObjectId

# Pydantic v2 compatible ObjectId
def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str) and ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")

PyObjectId = Annotated[
    str | ObjectId, 
    BeforeValidator(validate_object_id),
    PlainSerializer(lambda x: str(x), return_type=str),
]

class TopicDetail(BaseModel):
    priority: str
    estimated_hours: float
    description: Optional[str] = None

class AnalysisResult(BaseModel):
    course_name: Optional[str] = None
    topics: Dict[str, TopicDetail]
    summary: Optional[str] = None

class SyllabusAnalysis(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[PyObjectId] = Field(default=None)
    filename: str
    content_hash: str
    analysis_result: Dict[str, Any]
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    version: int = 1

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class SyllabusAnalysisCreate(BaseModel):
    filename: str
    content_hash: str
    analysis_result: Dict[str, Any]
