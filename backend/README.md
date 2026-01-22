# Backend

FastAPI 기반 백엔드 서버입니다.  
Docker + MySQL 환경에서 실행됩니다.

---

## Environment
- Python 3.10
- FastAPI
- SQLAlchemy
- MySQL (Docker)
- JWT Authentication

---

## Run (Local 기준)

```bash
conda create -n Team200 python=3.10 -y
conda activate Team200

cd backend
pip install -r requirements.txt

docker compose up --build
```
서버 실행 후 기본 주소: http://127.0.0.1:8000

---

## Environment Variables
- .env 파일은 보안상 Git에 포함하지 않습니다.
- 필요한 환경 변수는 Jira를 통해 공유합니다.

---

## Authentication API
### 회원가입
- **POST** `/auth/signup`
- 이메일 중복 체크 및 비밀번호 해싱 처리

**Request Body**
```json
{
  "email": "test@test.com",
  "password": "1234",
  "name": "testuser"
}
```

---

### 로그인
- **POST** `/auth/login`
- JWT Access Token 발급

**Request Body**
```json
{
  "email": "test@test.com",
  "password": "1234"
}
```

**Response Example**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

---

### 내 정보 조회
- **GET** `/auth/me`
- Authorization Header 필요

**Request Header**
```bash
Authorization: Bearer <access_token>
```

**Response Example**
```json
{
  "user_id": 1,
  "email": "test@test.com"
}
```

---

## Notes
- 인증 실패 시 보안상 이유로 로그인 오류 메시지는 단일화되어 반환됩니다.
- 현재는 로컬 DB 환경 기준으로 개발되었으며, 유저 데이터는 각 개발 환경별로 독립적으로 생성됩니다.

---
