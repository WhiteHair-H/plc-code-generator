from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.claude_service import generate_ladder_code
from ..services.dynamodb_service import save_code

router = APIRouter(prefix="/generate", tags=["generate"])

class GenerateRequest(BaseModel):
    description: str
    save: bool = True

@router.post("")
async def generate(req: GenerateRequest):
    try:
        code, ladder_data = await generate_ladder_code(req.description)
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")

    item = None
    if req.save:
        try:
            item = save_code(req.description, code, ladder_data)
        except Exception:
            pass

    return {"code": code, "ladder_data": ladder_data, "id": item["id"] if item else None}
