FROM python:3.11-slim

# 로그 바로 출력
ENV PYTHONUNBUFFERED=1

WORKDIR /backendWorkspace

# 의존성 먼저 복사 (캐시 효율)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# backend 전체 복사
COPY . .

EXPOSE 8000

CMD ["uvicorn", "test.test_main:app", "--host", "0.0.0.0", "--port", "8000"]
