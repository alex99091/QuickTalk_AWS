# QuickTalk - 

> "빠르고 익명성 있는, 실시간 랜덤 사용자 채팅"  
> "AWS 배포 서비스"  

---

## ✨ 프로젝트 개요

QuickTalk은 **React + Spring Boot + Python NLP + Kafka + MongoDB** 조합으로 구성된 **실시간 익명 채팅 시스템**입니다. EC2, Docker Compose를 활용한 클라우드 기반의 배포 경험을 제공하며, 다음을 실현합니다:

* 실시간 랜덤 사용자 매칭 및 채팅 기능
* AWS EC2 서버 구축
* Docker & Docker Compose 환경 구성
* Kafka 메시지 큐 통합
* MongoDB를 통한 채팅 기록 저장
* Python NLP 연동 준비 구조 구현
* (GitHub Actions 기반 CI/CD 자동화 -- 예정)

> 본 문서는 실제 EC2 배포 및 문제 해결 경험을 바탕으로 작성되었습니다.

---

## 🌍 개념 설명 및 사전 지식

### ✅ AWS란?

Amazon Web Services는 **클라우드 컴퓨팅 플랫폼**으로, 사용자는 물리적인 서버 없이도 다양한 IT 자원을 인터넷을 통해 임대하여 사용할 수 있습니다. 주요 서비스로는 다음이 있습니다:

* EC2: 가상 서버를 제공하는 서비스
* S3: 객체 스토리지 서비스
* RDS: 관계형 데이터베이스 서비스
* Lambda: 서버 없는 함수 실행 환경

### ✅ EC2란?

Amazon EC2(Elastic Compute Cloud)는 **클라우드 기반 가상 서버**입니다. Ubuntu, Windows, Amazon Linux 등 다양한 OS 선택이 가능하며, 사용자는 이 인스턴스에 직접 접속하여 서버처럼 사용할 수 있습니다.

### ✅ t2.micro란?

AWS EC2에서 제공하는 **프리 티어(무료)** 인스턴스 타입 중 하나로,

* 1 vCPU
* 1GB RAM

성능이 제한적이므로 학습용이나 소규모 테스트 환경에 적합합니다.

### ✅ 보안 그룹이란?

EC2 인스턴스를 방화벽처럼 보호하는 역할을 합니다. 포트(8080, 27017 등)를 열어야 외부에서 접근할 수 있습니다.

### ✅ Docker란?

Docker는 **컨테이너 기반 가상화 플랫폼**입니다. 애플리케이션을 실행하는 데 필요한 모든 것을 하나의 컨테이너 안에 담아 배포합니다. 호스트 환경과 무관하게 동일한 환경에서 실행할 수 있는 장점이 있습니다.

### ✅ Dockerfile이란?

Docker 이미지를 만들기 위한 **설정 파일**입니다. 어떤 OS를 쓸지, 어떤 패키지를 설치할지, 어떤 명령어를 실행할지 등의 내용이 포함됩니다.  
  
본 프로젝트는 backend, frontend, nlp-service의 각각 dockerfile을 생성하였습니다.  

예시:

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
```

### ✅ docker-compose.yml이란?

여러 개의 Docker 컨테이너를 하나의 파일에서 **한 번에 구성**하고 실행할 수 있게 해주는 도구입니다. 예를 들어 React, Spring Boot, MongoDB, Kafka 등을 한 번에 실행합니다.

---

## 📊 시스템 아키텍처

아래 다이어그램은 사용자가 웹 브라우저에서 메시지를 보내면, 백엔드에서 Kafka 메시지 큐를 통해 처리되고, MongoDB에 저장되며 다시 사용자에게 실시간으로 전송되는 전체 흐름을 보여줍니다.

```plaintext
┌────────────────────┐
│  사용자 브라우저       │
│ (React + WebSocket)│
└────────┬───────────┘
         │ 실시간 메시지 송신
         ▼
┌────────────────────┐
│ Spring Boot 백엔드   │
│ (WebSocket 처리)    │
└────────┬───────────┘
         │ Kafka Producer
         ▼
┌────────────────────┐
│   Kafka 브로커       │
└────────┬───────────┘
         │ Kafka Consumer
         ▼
┌────────────────────┐       ┌────────────────────┐
│ MongoDB (저장소)     │◀──────┤ NLP 서비스 (Python) │
└────────────────────┘       └────────────────────┘
         ▲
         │ WebSocket 응답 전달
         ▼
┌────────────────────┐
│ 사용자 브라우저로 응답   │
└────────────────────┘
```

---

## 🌐 기술 스택 및 개념 정리

| 구성 요소  | 기술                       | 역할 설명                                              |
| ------ | ------------------------ | -------------------------------------------------- |
| 프론트엔드  | React + Vite             | 사용자 인터페이스 및 WebSocket 통신 담당                        |
| 백엔드    | Spring Boot              | WebSocket 서버, Kafka Producer/Consumer, REST API 구현 |
| NLP 모듈 | Python                   | 위험 단어 감지 등 확장 가능 구조 구현 완료                          |
| 메시징 큐  | Apache Kafka + Zookeeper | 메시지 비동기 처리                                         |
| DB     | MongoDB                  | 채팅 로그 저장 (NoSQL 문서형 DB)                            |
| 배포 환경  | AWS EC2 (Ubuntu 22.04)   | 클라우드 인프라 운영                                        |
| 자동화    | Docker, GitHub Actions   | 빌드/배포 자동화, 컨테이너 오케스트레이션                            |

---

## 🔧 주요 기능 및 API 흐름

* `/connect`: 랜덤 매칭 등록
* `/chat`: 메시지 전송 및 수신
* `/disconnect`: 연결 종료
* WebSocket + Kafka 기반 채팅 처리
* MongoDB 채팅 이력 저장

---

## 🛠️ 실전 기반 AWS 배포 프로세스

### ① EC2 인스턴스 생성

* 리전: `ap-northeast-2 (서울)`
* 인스턴스 타입: `t2.micro` (프리 티어)
* OS: `Ubuntu 22.04 LTS`

```bash
ssh -i ~/path/to/<키>.pem ubuntu@<EC2_PUBLIC_IP>
```

### ② 초기 환경 설정

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose unzip git -y
sudo usermod -aG docker $USER
newgrp docker
```

### ③ 프로젝트 업로드 및 실행

```bash
scp -i ~/<키>.pem QuickTalk_AWS.zip ubuntu@<EC2_PUBLIC_IP>:~/
ssh -i ~/<키>.pem ubuntu@<EC2_PUBLIC_IP>
unzip QuickTalk_AWS.zip
cd QuickTalk_AWS
sudo docker-compose up --build
```

---

## ⚡️ 실전 문제 및 해결 경험

### ❌ 1. t2.micro 리소스 한계

* Kafka + Zookeeper + Spring Boot + React + NLP 모두 동시 실행 시 CPU 100%
* 해결: 백엔드/프론트/NLP 분리 배포 권장 (EC2 여러 개 or Lambda 전환)

### ❌ 2. 프론트 실행 오류 (npm start 오류)

* `package.json`에 vite 누락 → `"start": "vite"` 추가 및 Dockerfile 수정

### ❌ 3. NLP Python 컨테이너 오류

* `main.py`가 아니라 `run.py` 존재 → Dockerfile CMD 수정

---

## 📈 리소스 병목 분석 (t2.micro 기준)

| 컨테이너             | CPU 사용량 | RAM 사용량    | 상태              |
| ---------------- | ------- | ---------- | --------------- |
| backend (Spring) | 60\~90% | 800MB 이상   | 서버 멈춤 발생        |
| frontend (Vite)  | 30% 이상  | 250MB 이상   | 사용 가능           |
| kafka/zookeeper  | 매우 높음   | 600\~800MB | JVM 기반으로 매우 무거움 |
| nlp-service      | 낮음      | 낮음         | 실행됨 (기본 구조만 구성) |

---

## 🧪 CI/CD란 무엇인가요?

CI/CD는 "지속적 통합(Continuous Integration)"과 "지속적 배포(Continuous Deployment)"를 의미합니다. 개발자가 코드 변경을 저장소(GitHub 등)에 Push하면, 자동으로 테스트와 빌드가 수행되고, 문제가 없으면 서버에 자동으로 배포까지 이어지게 하는 자동화 파이프라인입니다.

QuickTalk에서는 아직 이 흐름이 **자동화되지 않았으며**, 실제 배포는 EC2 터미널에서 명령어를 수동으로 입력하여 진행했습니다. 그러나 이 섹션은 향후 적용할 수 있는 **CI/CD 구조의 이해와 필요성**을 위한 설명입니다.

### ✅ CI/CD 구성 요소 설명

| 구성 요소           | 설명                                                                  |
| --------------- | ------------------------------------------------------------------- |
| GitHub Actions  | GitHub에서 제공하는 CI/CD 플랫폼. push나 PR 이벤트 발생 시 워크플로우 파일을 따라 자동 실행됨      |
| DockerHub       | Docker 이미지 저장소. `docker build`된 이미지를 올려서 서버에서 `pull` 가능             |
| EC2 SSH 배포 스크립트 | GitHub Actions 내에서 EC2에 SSH로 접속하여 `docker-compose pull && up` 명령 실행 |

### 💡 적용 시 예상 흐름 (예시)

```yaml
name: Deploy to EC2
on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t quicktalk-backend ./backend

      - name: Login to DockerHub
        run: echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

      - name: Push Docker image
        run: docker push $DOCKER_USERNAME/quicktalk-backend

      - name: SSH & Deploy on EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd ~/QuickTalk_AWS
            docker-compose pull
            docker-compose up -d
```

### 📌 정리

* 현재는 GitHub → EC2로 자동 배포되지 않고, EC2 내에서 수동 명령어 입력으로 배포됨
* 그러나 추후 GitHub Actions + DockerHub + SSH를 통해 완전 자동화 가능
* 자동화를 도입하면 협업 시 안정성, 속도, 일관성 모두 개선됨

---

## 🔮 개선 방안 요약 및 확장 가능성

1. **서버 분리 구성** (최소 2\~3개의 EC2 권장)
2. **nginx Reverse Proxy** (WebSocket `/ws`, API `/api` 프록시 분리)
3. **MongoDB Atlas 사용** (클라우드 DB)
4. **모니터링 도입** (Docker Stats, Prometheus, CloudWatch)
5. **JWT 기반 사용자 인증 도입**
6. **Lambda 기반 NLP 처리로 분산 구조 실현**
7. **Kafka Topic 파티셔닝 및 멀티 Consumer 구조로 확장성 강화**

---

## 📁 프로젝트 구조

### backend (Spring Boot)

```plaintext
backend/
├── controller/
├── service/
├── kafka/
├── model/
├── repository/
├── config/
└── QuickTalkApplication.java
```

### frontend (React + Vite)

```plaintext
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── main.jsx
└── public/index.html
```

### nlp-service (Python)

```plaintext
nlp-service/
├── danger_analyzer.py
├── kafka_consumer.py
└── run.py
```

---

## 📌 실전 팁 요약

* EC2 하나에 너무 많은 컨테이너 실행 X
* `docker-compose.yml`에서 불필요한 서비스 주석 처리로 리소스 절약
* `docker logs`, `docker stats`로 상태 모니터링 필수
* 포트 충돌, 메모리 초과 상황 주의

---

> 🚀 AWS 클라우드 배포 과정에서의 시행착오와 해결 과정을 담고 있습니다.
