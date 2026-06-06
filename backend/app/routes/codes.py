from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.dynamodb_service import get_code, list_codes, delete_code, save_code

router = APIRouter(prefix="/codes", tags=["codes"])

class SaveRequest(BaseModel):
    description: str = ""
    code: str
    ladder_data: list = []

@router.post("/save")
def save(req: SaveRequest):
    try:
        item = save_code(req.description, req.code, req.ladder_data)
        return {"id": item["id"]}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("")
def get_list():
    try:
        return list_codes()
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("/{code_id}")
def get_one(code_id: str):
    item = get_code(code_id)
    if not item:
        raise HTTPException(404, "Not found")
    return item

@router.delete("/{code_id}")
def delete(code_id: str):
    delete_code(code_id)
    return {"ok": True}
