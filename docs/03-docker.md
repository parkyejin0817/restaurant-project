# Docker 구성 설명

## 1. Docker를 사용하는 이유
서버에 직접 JAVA, MySQL, Node.js를 하나하나 설치하고 관리하는 작업이 번거롭기 때문에,
Docker로 여러 서비스를 독립적으로 관리하여 사용한다.
또한 컨테이너만 실행하면 되기 때문에 서버 환경 설정이 간단해진다.

## 2. Backend Dockerfile 설명
```dockerfile
FROM eclipse-temurin:21-jdk
```
- **의미**: Java 21이 설치된 기본 이미지를 가져온다.
- **eclipse-temurin**: 기존 openjdk 이미지가 Docker Hub에서 지원 종료되어 공식 대체 이미지인 eclipse-temurin 사용
- **21**: 프로젝트가 Java 21로 빌드되었기 때문에 동일 버전 필요
```dockerfile
COPY build/libs/*.jar app.jar
```
- **의미**: 로컬에서 빌드된 JAR 파일을 컨테이너 내부로 복사
- **build/libs**: Gradle 빌드 시 JAR 파일이 생성되는 경로
- **app.jar**: 실행 명령어를 단순화하기 위해
```dockerfile
ENTRYPOINT ["java", "-jar", "/app.jar"]
```
- **의미**: 컨테이너가 시작될 때 실행할 명령어 지정
- **ENTRYPOINT**: 컨테이너의 주 실행 프로세스를 정의하기 위해


## 3. Frontend Dockerfile 설명
### 빌드 단계 (Multi-stage Build)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```
- **node:20**: Next.js 16 버전이 Node.js 20 이상을 요구
- **alpine**: 이미지 크기를 최소화하기 위함
- **package.json**: 의존성 설치를 캐싱하여 빌드 속도 향상을 위함
- **AS builder**: 빌드용 이미지/실행용 이미지 분리

### 실행 단계
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```
- **새 이미지**: 실행에 필요한 파일만 포함하여 이미지 크기 최소화
- **standalone**: standalone 모드로 빌드하면 필요한 파일만 추출


## 4. docker-compose 역할
### docker-compose.yml 구성
```yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root1234
      MYSQL_DATABASE: restaurant
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 5s
      retries: 10

  backend:
    image: parkyejin0817/restaurant-backend
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/restaurant

  frontend:
    image: parkyejin0817/restaurant-frontend
    depends_on:
      - backend
```

### 왜 docker-compose를 사용하는가?

1. **여러 컨테이너 일괄 관리**
    - 개별 docker run 명령어 대신 `docker-compose up -d` 한 번으로 전체 실행
    - 종료도 `docker-compose down` 한 번으로 완료

2. **컨테이너 간 네트워크 자동 구성**
    - 같은 docker-compose 파일의 서비스들은 자동으로 같은 네트워크에 연결
    - backend에서 mysql:3306으로 접근 가능

3. **의존성 순서 관리**
    - `depends_on`으로 MySQL이 준비된 후 Backend가 시작하도록 설정
    - `healthcheck`로 MySQL이 실제로 연결 가능한 상태인지 확인

4. **환경변수 중앙 관리**
    - 각 컨테이너의 환경변수를 한 파일에서 관리
    - 배포 환경별로 다른 설정 적용 가능