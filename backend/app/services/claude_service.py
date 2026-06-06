import httpx, json
from ..config import settings

HEADERS = lambda: {"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                   "Content-Type": "application/json"}
API_URL = "https://openrouter.ai/api/v1/chat/completions"

GENERATE_PROMPT = """You are a PLC programming expert. Convert the user's natural language description into PLC Ladder Diagram code AND a structured JSON for visualization.

Rules:
- PLC code (variable names, labels, coil names, I/O addresses) must use standard English/IEC 61131-3 notation
- Comments and descriptions explaining the code must be written in Korean
- JSON "comment" and "desc" fields must be in Korean

Respond in this EXACT format (no extra text):

LADDER CODE:
[ladder rungs - code in English, inline comments in Korean]

VARIABLES:
[variable list: English names, Korean descriptions]

LADDER JSON:
[JSON array of rungs]

JSON schema:
[
  {
    "rung": 1,
    "comment": "런 설명 (한국어)",
    "elements": [
      {"type": "NO", "label": "I0.0", "desc": "시작 버튼"},
      {"type": "NC", "label": "I0.1", "desc": "정지 버튼"},
      {"type": "COIL", "label": "Q0.0", "desc": "모터 출력"}
    ]
  }
]
Element types: NO, NC, COIL, TON, CTU, BRANCH_START, BRANCH_END"""

ANALYZE_PROMPT = """You are a PLC code reviewer.
- PLC code references (variable names, addresses, coil names) must remain in their original English/standard notation
- All explanations, findings, and suggestions must be written in Korean

Analyze the provided PLC Ladder Diagram code:
1. 버그 또는 논리적 오류 식별
2. 안전 문제 확인
3. 개선 사항 제안
구체적이고 간결하게 작성하세요."""


async def generate_ladder_code(description: str) -> tuple[str, list]:
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(API_URL, headers=HEADERS(), json={
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": GENERATE_PROMPT},
                {"role": "user", "content": description}
            ]
        })
    res.raise_for_status()
    content = res.json()["choices"][0]["message"]["content"]

    # 코드 텍스트 추출
    code_part = content
    if "LADDER CODE:" in content:
        code_part = content.split("LADDER CODE:")[1]
        if "VARIABLES:" in code_part:
            code_part = code_part.split("VARIABLES:")[0]
    
    # VARIABLES 추출
    var_part = ""
    if "VARIABLES:" in content:
        var_part = content.split("VARIABLES:")[1]
        if "LADDER JSON:" in var_part:
            var_part = var_part.split("LADDER JSON:")[0]

    # JSON 구조 추출
    ladder_data = []
    if "LADDER JSON:" in content:
        json_str = content.split("LADDER JSON:")[1].strip()
        start = json_str.find("[")
        end = json_str.rfind("]") + 1
        if start >= 0 and end > start:
            try:
                ladder_data = json.loads(json_str[start:end])
            except Exception:
                ladder_data = []

    full_text = f"VARIABLES:\n{var_part.strip()}\n\nLADDER CODE:\n{code_part.strip()}"
    return full_text, ladder_data


async def analyze_code(code: str) -> str:
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(API_URL, headers=HEADERS(), json={
            "model": settings.OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": ANALYZE_PROMPT},
                {"role": "user", "content": f"Analyze this PLC code:\n\n{code}"}
            ]
        })
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]
