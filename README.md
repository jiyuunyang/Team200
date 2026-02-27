# Team200 – Predictive Maintenance Web Platform


배터리 충전 및 방전 데이터를 기반으로  
**상태 모니터링과 예지보전(Predictive Maintenance)** 을 목표로 하는 웹 서비스입니다. 👉 [발표 PDF 자료 보러가기](https://drive.google.com/file/d/1e97v352MC7YDU_LXzmHsQ9laZS0NzKws/view?usp=sharing)

![화면 기록 2026-02-05 오전 9 32 24](https://github.com/user-attachments/assets/9a951afc-d271-43cf-a8e2-a9e3692cb277)
[시연 영상 예시]
- 한 사이클의 배터리 데이터를 불러와 남은 배터리 잔량을 예측할 수 있습니다.
- 실제 상용화될 경우 해당 배터리에 대한 센서데이터로 대체 가능합니다.

본 프로젝트는 **Next.js 프론트엔드 + FastAPI 백엔드** 구조로 구성되어 있으며,  
Docker 기반 **dev / stage 환경 분리**,  
로그 중심 **Observability 구성**,  
CI 흐름을 고려한 저장소 구조를 포함합니다.

---

## ✨ Project Overview

본 프로젝트는 다음 목표를 중심으로 설계되었습니다.

- 설비 데이터 기반 상태 조회 및 분석 결과 제공
- 프론트엔드와 백엔드의 명확한 책임 분리
- Docker 기반 개발 환경 표준화
- dev / stage 환경 분리를 통한 배포 전 검증 흐름 구성
- 로그 기반 Observability 구성
- (예정) 학습된 모델 가중치 기반 추론 기능 연동

단순 모델 구현이 아닌,  
**실제 서비스 운영을 고려한 구조 설계**를 목표로 합니다.

---

## 🧱 Architecture Concept

```text
Client (Next.js)
        ↓
     Nginx
        ↓
Backend API (FastAPI)  -------------
        ↓                          ↓
     MySQL                        M L
     
<Monitoring>
Observability
(Grafana + Loki + Promtail)

(Resource - Planned)
Prometheus + cAdvisor
```

## 설계 의도
- UI는 빠른 화면 구성과 사용자 흐름에 집중
- Backend는 도메인 로직과 데이터 접근의 단일 진입점
- 실행 환경은 Docker로 통일
- 로그 기반 가시화를 우선 확보하고, 메트릭 기반으로 확장 가능하도록 설계

---

## 🧩 Role Definition
### Frontend (Next.js)
- 설비 상태 및 분석 결과 시각화
- 사용자 요청 처리 및 API 연동
- 대시보드 UI 구성

### Backend (FastAPI)
- REST API 제공
- 비즈니스 로직 처리
- MySQL 데이터 접근 및 관리
- (예정) 모델 추론 호출 및 결과 반환

### ML (Planned)
- 데이터 분석 결과를 기반으로 모델 구성
- 학습된 모델 가중치(artifact) 관리
- Backend에서 호출 가능한 추론 구조로 확장 예정

현재 ML 추론은 미구현 상태이며,
분석 → 모델 아티팩트 생성 → Backend 연동 흐름으로 확장할 계획입니다.

---
## 📂 Repository Structure
```text
Team200/
├─ frontend/                 # Next.js Web Client
├─ backend/                  # FastAPI Backend Server
├─ ml/                       # (Planned) model artifacts / inference
├─ infra/
│  ├─ docker/
│  │  ├─ docker-compose.dev.yml     # Development environment
│  │  └─ docker-compose.stage.yml   # Staging environment
│  ├─ nginx/
│  └─ observability/         # Grafana / Loki / Promtail configs
├─ gitflow/                  # CI / Git workflow configs
└─ README.md
```

---

## 🚀 Development Philosophy
- 프론트엔드와 백엔드의 책임 분리
- 데이터 접근은 Backend 단에서만 수행
- Docker 기반으로 개발/실행 환경 통일
- dev / stage 환경 분리를 통해 배포 전 검증 흐름 확보
- 로그 기반 Observability를 우선 적용하고 메트릭 기반으로 확장

---

## 🛠 Tech Stack
### Frontend
- Next.js

### Backend
- Python
- FastAPI

### Database
- MySQL

### Observability
- rafana (Visualization)
- Loki (Log aggregation)
- Promtail (Log shipping)
- (Planned) Prometheus (Metrics)
- (Planned) cAdvisor (Container metrics)

### Infra / DevOps
- Docker
- Docker Compose
- Nginx
- GitHub Actions (CI)

--- 

### 📌 Project Status
- ✅ Next.js 프론트엔드 구성
- ✅ FastAPI 백엔드 API 서버 구성
- ✅ Docker 기반 dev / stage 환경 분리
- ✅ CI 구조 구성 (./gitflow)
- ✅ Grafana + Loki + Promtail 로그 모니터링 연동
- ⏳ Prometheus + cAdvisor 메트릭 수집 연동 예정
- ⏳ ML 추론 연동 설계 단계

--- 

### 실행 방법
A) dev 환경 
- local 환경(front) : ./frontend$ npm run dev (프론트 엔드 실행)
- docker-compose.dev(첫번째 컨테이너 묶음) : ./infra/docker$ docker compose -f docker-compose.dev.yml up (backend, ml, nginx, mysql 실행)
- docker-compose.observability(두번째 컨테이너 묶음) : ./infra/docker$ docker compose -f docker-compose.observability.yml up (promtail, loki, grafana 실행)
B) stage 환경
- docker-compose.stage (stage 환경 묶음) : ./infra/docker$ docker compose -f docker compose -f docker-compose.stage.yml up
  Web(Nginx + Next 빌드 파일), backend, ml, mysql
- 추후 모니터링 추가 시 작성

### 확인 방법
- 서비스 URL : http://localhost/
- 모니터링 서비스 URL : http://localhost:3001

--- 
 
### 📄 Notes
본 프로젝트는 국비 교육 과정의 팀 프로젝트로 진행되었으나,
- 서비스 구조 설계
- 환경 분리 및 배포 흐름 고려
- Observability 구성
등을 통해 실무 환경을 가정한 프로젝트 구성을 목표로 합니다.


