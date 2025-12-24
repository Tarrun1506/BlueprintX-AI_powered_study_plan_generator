from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.analysis import SyllabusAnalysis, SyllabusAnalysisCreate
from app.core.database import get_database
from datetime import datetime
from bson import ObjectId
from app.api.dependencies import get_current_user
from app.services.scheduler import generate_study_schedule
from app.models.syllabus import Topic
from pydantic import BaseModel
from typing import Optional

class ScheduleRequest(BaseModel):
    start_date: datetime
    daily_hours: float = 2.0
    days_off: List[int] = []

router = APIRouter()

@router.post("/", response_model=SyllabusAnalysis)
async def save_analysis(
    analysis: SyllabusAnalysisCreate, 
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    new_analysis = analysis.model_dump()
    new_analysis["created_at"] = datetime.utcnow()
    new_analysis["user_id"] = current_user["_id"]
    
    result = await db.analyses.insert_one(new_analysis)
    created_analysis = await db.analyses.find_one({"_id": result.inserted_id})
    return created_analysis

@router.get("/", response_model=List[SyllabusAnalysis])
async def list_analyses(
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    analyses = await db.analyses.find({"user_id": current_user["_id"]}).sort("created_at", -1).to_list(100)
    return analyses

@router.get("/{id}", response_model=SyllabusAnalysis)
async def get_analysis(
    id: str, 
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    analysis = await db.analyses.find_one({
        "_id": ObjectId(id),
        "user_id": current_user["_id"]
    })
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.delete("/{id}")
async def delete_analysis(
    id: str, 
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await db.analyses.delete_one({
        "_id": ObjectId(id),
        "user_id": current_user["_id"]
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"message": "Analysis deleted successfully"}

@router.put("/{id}", response_model=SyllabusAnalysis)
async def update_analysis(
    id: str,
    analysis: SyllabusAnalysisCreate,
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    # Update the analysis
    update_data = analysis.model_dump()
    result = await db.analyses.update_one(
        {"_id": ObjectId(id), "user_id": current_user["_id"]},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Return updated document
    updated_analysis = await db.analyses.find_one({"_id": ObjectId(id)})
    return updated_analysis


@router.post("/{id}/schedule", response_model=SyllabusAnalysis)
async def generate_schedule(
    id: str,
    request: ScheduleRequest,
    db = Depends(get_database),
    current_user = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    analysis = await db.analyses.find_one({
        "_id": ObjectId(id),
        "user_id": current_user["_id"]
    })
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    # Extract topics from existing analysis result
    # We assume standard structure from SyllabusAnalysisResponse
    raw_topics = analysis.get("analysis_result", {}).get("topics", [])
    if not raw_topics:
         raise HTTPException(status_code=400, detail="No topics found in analysis to schedule.")

    # Convert to Pydantic models
    try:
        topics = [Topic(**t) for t in raw_topics]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data corrupted: {str(e)}")

    # Generate schedule
    scheduled_topics, completion_date = generate_study_schedule(
        topics, 
        request.start_date, 
        request.daily_hours, 
        request.days_off
    )
    
    # Update analysis result
    updated_result = analysis["analysis_result"]
    updated_result["topics"] = [t.model_dump() for t in scheduled_topics]
    updated_result["projected_completion_date"] = completion_date
    updated_result["schedule_params"] = request.model_dump() # Save params used
    
    # Save to DB
    await db.analyses.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": {"analysis_result": updated_result}}
    )
    
    # Return updated document
    analysis["analysis_result"] = updated_result
    return analysis
