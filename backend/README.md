# Backend

FastAPI 기반 백엔드 서버입니다.  
Docker + MySQL 환경에서 실행됩니다.

## Environment
- Python 3.10
- FastAPI
- MySQL (Docker)

## Run (Local 기준)

```bash
conda create -n Team200 python=3.10 -y
conda activate Team200

cd backend
pip install -r requirements.txt

docker compose up --build
```

## Environment Variables
- .env 파일은 보안상 Git에 포함하지 않음
- Jira를 통해 공유

## API
- /auth/register : 회원가입
- /auth/login : 로그인 (구현 예정)