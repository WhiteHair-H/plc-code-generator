# PLC Code Generator AI

자연어로 PLC 래더 다이어그램 코드를 자동 생성하는 학습 플랫폼입니다.

## 빠른 시작

```bash
# 1. 환경변수 설정
cp .env.example .env  # 값 입력

# 2. 백엔드
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. 프론트엔드
cd frontend
npm install
npm start
```

## 주요 기능
- 자연어 → PLC 래더 코드 자동 생성 (Claude API)
- 생성 코드 저장/불러오기 (DynamoDB)
- AI 코드 검증 및 버그 분석
- URL 기반 코드 공유
- 코드 시뮬레이션 결과 표시

## 기술 스택
- Frontend: React 18
- Backend: FastAPI
- DB: AWS DynamoDB
- AI: Claude via OpenRouter
- Deploy: AWS Amplify + GitHub Actions
