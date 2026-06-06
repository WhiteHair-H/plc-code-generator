# AWS 배포 현황

> 기준 시각: 2026-06-06 22:57 KST

---

## 🟢 프론트엔드 — AWS Amplify

| 항목 | 내용 |
|------|------|
| 앱명 | `plc-frontend` |
| 앱 ID | `d2nqcfdovssxjt` |
| URL | https://main.d2nqcfdovssxjt.amplifyapp.com |
| 브랜치 | `main` |
| 최근 배포 | 2026-06-06 22:18 — **SUCCEED** ✅ |
| 배포 이력 | 총 4회, 전부 성공 |
| 백엔드 URL (환경변수) | `http://98.81.109.195:8000` |

### 배포 이력

| Job | 시작 시각 | 종료 시각 | 상태 |
|-----|----------|----------|------|
| #4 | 22:18:56 | 22:19:04 | ✅ SUCCEED |
| #3 | 22:13:05 | 22:13:13 | ✅ SUCCEED |
| #2 | 22:07:18 | 22:07:26 | ✅ SUCCEED |
| #1 | 21:55:03 | 21:55:05 | ✅ SUCCEED |

---

## 🟢 백엔드 — EC2

| 항목 | 내용 |
|------|------|
| 인스턴스명 | `plc-backend` |
| 인스턴스 ID | `i-0bdaf0853816cacbd` |
| 인스턴스 타입 | `t3.micro` |
| 상태 | **running** ✅ |
| 공개 IP | `98.81.109.195` |
| 공개 DNS | `ec2-98-81-109-195.compute-1.amazonaws.com` |
| 리전 / AZ | `us-east-1` / `us-east-1d` |
| 보안그룹 | `plc-backend-sg` (`sg-09da27777c33d64e8`) |
| 키페어 | `plc-backend-key` |
| 기동 시각 | 2026-06-06 12:40 UTC |

---

## 🟢 데이터베이스 — DynamoDB

| 항목 | 내용 |
|------|------|
| 테이블명 | `plc-codes` |
| 상태 | **ACTIVE** ✅ |
| 파티션 키 | `id` (String) |
| 과금 방식 | PAY_PER_REQUEST |
| 저장 아이템 수 | **0개** |
| 테이블 크기 | 0 bytes |
| 생성 일시 | 2026-06-06 21:39 KST |
| 삭제 방지 | 비활성 |

---

## ⚠️ 참고 사항

- DynamoDB 아이템이 0개 — 백엔드 API의 DB 저장 동작 확인 필요
- EC2 퍼블릭 IP(`98.81.109.195`)는 고정 IP(Elastic IP)가 아니므로 재시작 시 변경될 수 있음
- Amplify 환경변수의 `REACT_APP_API_URL`이 EC2 IP 직접 참조 중 → Elastic IP 또는 도메인 연결 권장
