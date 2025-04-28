# QuickTalk - 랜덤 채팅 서비스

> “빠르고 익명성 있는, 실시간 랜덤 사용자 채팅”

---

## ✨ 프로젝트 개요

QuickTalk은 실시간 **랜덤 매칭 채팅 서비스**입니다. 사용자들은 익명으로 매칭되어 즉시 메시지를 주고받을 수 있습니다.

이 프로젝트는 다음을 실습하는 것을 목표로 합니다:
- AWS EC2 서버 구축
- Docker & Docker Compose 환경 구성
- Kafka 메시지 큐 통합
- MongoDB를 통한 채팅 기록 저장
- GitHub Actions를 통한 CI/CD 자동화

> 목표는 실제 서비스 개발, 도커화(Dockerization), 클라우드 배포를 엔드-투-엔드로 경험하는 것입니다.

---

## 📊 시스템 아키텍처

```plaintext
[ 클라이언트 (WebSocket/HTTP) ]
        ↓
[ 백엔드 서버 (Spring Boot) ]
        ↓ (Publish)
[ Kafka 브로커 (Docker) ]
        ↓ (Subscribe)
[ 백엔드 컨슈머 ]
        ↓
[ MongoDB (Docker) - 채팅 기록 저장 ]
```

---

## 🌐 기술 스택 및 기본 개념

| 아이템 | 기술 | 기본 개발 과정 |
|:------------|:-------------------------------|:--------------|
| 백엔드 | Spring Boot (Java) | 웹 백엔드 프레임워크로 API 및 WebSocket 통신을 담당합니다. |
| 데이터베이스 | MongoDB | 유연한 스키마를 가진 NoSQL 문서형 데이터베이스입니다. |
| 메시징 | Apache Kafka | 실시간 데이터 스트리밍을 처리하는 분산 이벤트 플랫폼입니다. |
| 인프라 | Docker, Docker Compose | 서비스들을 컨테이너화하고, 여러 컨테이너를 손쉽게 오케스트레이션합니다. |
| 클라우드 | AWS EC2 (Ubuntu 22.04) | 클라우드 가상 서버로, 전체 서비스를 배포합니다. |
| CI/CD | GitHub Actions + DockerHub | 코드 변경 시 자동 빌드 및 배포를 수행합니다. |

---

## 🔧 주요 기능

- **/connect**: 랜덤 매칭을 위한 등록
- **/chat**: 매칭된 사용자 간 메시지 교환
- **/disconnect**: 채팅 종료
- **Kafka**: 메시지 처리 파이프라인
- **MongoDB**: 채팅 기록 영구 저장
- **Docker Compose**: 멀티 컨테이너 오케스트레이션
- **CI/CD**: GitHub Push 시 자동 빌드 및 배포

---

## 🚀 개발 흐름

### 0. AWS EC2 세팅
- EC2 인스턴스 생성 (Ubuntu 22.04)
- 필요한 포트(8080, 9092, 27017) 오픈
- Docker 및 Docker Compose 설치

### 1. 백엔드 개발
- Spring Initializr 또는 Nest CLI로 프로젝트 초기화
- WebSocket(또는 REST) API 구축
- Kafka Producer/Consumer 구현
- MongoDB 연결

### 2. 도커라이징
- 백엔드용 `Dockerfile` 작성
- Kafka, Zookeeper, MongoDB, App을 포함한 `docker-compose.yml` 설정

### 3. CI/CD 파이프라인 구축
- GitHub Actions 워크플로우 설정
    - Docker 이미지 빌드
    - DockerHub로 푸시
    - EC2로 SSH 배포 스크립트 실행

### 4. 최종 배포
- EC2에서 최신 Docker 이미지 Pull
- Docker Compose로 서비스 실행
- 퍼블릭 IP로 정상 작동 확인

---

## 📅 QuickTalk MVP 기능 정의

- 사용자 런더 메치니그 (random matching)
- 채팅 메시지 송수신 (WebSocket)
- 채팅방 연결 / 종료
- MongoDB에 채팅 기록 저장
- Kafka를 통한 메시지 전달
- React에서 실시간 메시지 표시

---

## 📁 프로젝트 디렉토리 구조

### 백엔드 (Spring Boot)
```plaintext
backend/
├─ src/main/java/com/quicktalk
│   ├─ controller/        # API, WebSocket Controller
│   ├─ service/            # Business Logic
│   ├─ kafka/              # Kafka Producer/Consumer
│   ├─ model/              # MongoDB Document Models
│   ├─ repository/         # MongoDB Repository
│   ├─ config/             # Kafka, MongoDB Config
│   └─ QuickTalkApplication.java
├─ src/main/resources/
│   ├─ application.yml     # 환경설정 파일
└─ Dockerfile
```

### 프론트엔드 (React)
```plaintext
frontend/
├─ public/
│   └─ index.html
├─ src/
│   ├─ components/          # ChatRoom, ConnectButton
│   ├─ hooks/               # useWebSocket
│   ├─ pages/               # Home.jsx
│   ├─ services/            # API 통신 모듈 (axios)
│   ├─ App.jsx
│   └─ main.jsx
├─ package.json
└─ Dockerfile
```

### 루트 디렉토리
```plaintext
.gitignore
README.md
docker-compose.yml
```

---

## 🛀 기능 흐름 요약 (시퀀스 다이어그램)

```plaintext
[사용자] → "Connect" 버튼 클릭
    ↓
[React 프론트] → WebSocket 연결
    ↓
[Spring Boot 서버] → Kafka에 연결정보 Publish
    ↓
[다른 사용자 매칭] → Kafka Consumer가 매칭 처리
    ↓
[React] → 채팅방 입장
    ↓
[메시지 전송] → WebSocket 송신
    ↓
[Spring Boot] → Kafka Publish
    ↓
[Kafka Consumer] → MongoDB 저장 및 상대방 WebSocket Push
```

---

## 🔍 향후 개선 예정 사항
- 친구 추가 및 친구 목록 기능
- 채팅 기록 검색 기능
- Kafka 토픽 파티셔닝 (로드밸런싱)
- MongoDB ReplicaSet 구성 (고가용성)
- Prometheus + Grafana를 통한 모니터링

---

> 🌟 프로젝트가 도움이 되었다면 Star를 눌러주세요! 🚀