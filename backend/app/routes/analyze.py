from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.claude_service import analyze_code

router = APIRouter(prefix="/analyze", tags=["analyze"])

class AnalyzeRequest(BaseModel):
    code: str

@router.post("")
async def analyze(req: AnalyzeRequest):
    try:
        result = await analyze_code(req.code)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")
