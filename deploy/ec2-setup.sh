#!/bin/bash
# EC2 Amazon Linux 2023 기준

# 1. 패키지 업데이트 및 Python 설치
sudo dnf update -y
sudo dnf install -y python3.11 python3.11-pip git

# 2. 코드 클론
cd /home/ec2-user
git clone https://github.com/WhiteHair-H/plc-code-generator.git
cd plc-code-generator/backend

# 3. 의존성 설치
pip3.11 install -r requirements.txt

# 4. 환경변수 파일 생성 (값은 직접 입력)
cat > .env << 'EOF'
OPENROUTER_API_KEY=여기에_키_입력
OPENROUTER_MODEL=anthropic/claude-3-haiku
AWS_REGION=us-east-1
DYNAMODB_TABLE=plc-codes
FRONTEND_URL=*
EOF

# 5. systemd 서비스 등록
sudo tee /etc/systemd/system/plc-backend.service > /dev/null << 'EOF'
[Unit]
Description=PLC Code Generator Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/plc-code-generator/backend
ExecStart=/usr/bin/python3.11 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
EnvironmentFile=/home/ec2-user/plc-code-generator/backend/.env

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable plc-backend
sudo systemctl start plc-backend
echo "Done. API running on port 8000"
