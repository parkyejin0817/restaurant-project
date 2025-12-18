# CI/CD 설명

## 1. GitHub Actions를 사용하는 이유

코드를 수정할 때마다 로컬에서 빌드, Docker 이미지 생성, Docker Hub 업로드, EC2 접속해 Pull, 컨테이너 재시작하는 과정이 많이 번거로웠다.
그러나 GitHub Actions를 사용하면 main에서 Push 한 번으로 자동 진행이 되고, yml 파일만 작성하면 됐기 때문에 편리해서 사용한다.

## 2. 워크플로우 실행 조건

main 브랜치에 Push할 때 자동으로 실행된다.

## 3. 자동화된 단계별 흐름
1. 코드 가져오기
- GitHub 저장소에서 소스코드를 빌드 서버로 가져온다

2. java 환경 설정
- java 21 설치

3. gradle 빌드
- ./gradlew clean build -x test` 으로 JAR 파일 생성

4. Docker Hub 로그인
- 이미지를 올리기 위해 로그인. GitHub Secrets에 저장해두고 사용한다

5. Docker 이미지 빌드 & push
- 백엔드와 프론트엔드 각각 Dockerfile로 이미지를 만들고 Docker Hub에 업로드한다

6. EC2 배포
- SSH로 EC2 서버에 접속한 다음, `docker-compose pull`로 새 이미지를 받고
`docker-compose up -d`로 컨테이너를 재시작한다


## 4. (있다면) 실패했을 때 원인과 해결 과정

### openjdk 이미지 없음 에러

Dockerfile에 `FROM openjdk:17-jdk-slim`을 썼는데 이미지를 찾을 수 없다는 에러가 났다.
openjdk 공식 이미지가 더 이상 지원되지 않는다고 해서 `eclipse-temurin:21-jdk`로 바꿨더니 
정상적으로 빌드됐다.

### SSH 연결 타임아웃 에러
```
2025/12/18 01:20:29 dial tcp ***:22: i/o timeout
Error: Process completed with exit code 1.
```

Deploy to EC2 단계에서 에러가 발생했다.
1. GitHub Secrets의 EC2_HOST 값이 이전 인스턴스의 IP로 되어있었다. 
그래서 새로 생성한 EC2의 퍼블릭 IP로 변경했다.
2. EC2 서버에 `/home/ec2-user/app` 디렉토리가 없었음. 워크플로우의 script에서 해당 경로로 이동하려고 하는데 
폴더가 없어서 에러가 났다. 원인을 알고 난 후에 EC2에 접속해서 디렉토리를 생성한 후 해결되었다.
