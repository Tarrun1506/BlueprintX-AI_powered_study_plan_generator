from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.models.analysis import SyllabusAnalysis, SyllabusAnalysisCreate
from app.core.database import get_database
from datetime import datetime
from bson import ObjectId
from app.api.dependencies import get_current_user

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
