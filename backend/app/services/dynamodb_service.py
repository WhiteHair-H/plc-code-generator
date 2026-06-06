import boto3, uuid
from datetime import datetime
from ..config import settings

def get_table():
    db = boto3.resource("dynamodb", region_name=settings.AWS_REGION,
                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
    return db.Table(settings.DYNAMODB_TABLE)

def save_code(description: str, code: str, ladder_data: list = None) -> dict:
    item = {
        "id": str(uuid.uuid4()),
        "description": description,
        "code": code,
        "ladder_data": ladder_data or [],
        "created_at": datetime.utcnow().isoformat(),
    }
    get_table().put_item(Item=item)
    return item

def get_code(code_id: str) -> dict | None:
    res = get_table().get_item(Key={"id": code_id})
    return res.get("Item")

def list_codes(limit: int = 20) -> list:
    res = get_table().scan(Limit=limit)
    items = res.get("Items", [])
    return sorted(items, key=lambda x: x.get("created_at", ""), reverse=True)

def delete_code(code_id: str):
    get_table().delete_item(Key={"id": code_id})
