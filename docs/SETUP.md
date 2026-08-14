# Blue Battery App 설치 및 실행 가이드

## 사전 요구사항

- Node.js v14 이상
- MongoDB (로컬 또는 클라우드)
- npm 또는 yarn
- Iamport 계정 (결제 시스템)
- Git

## 백엔드 설치

### 1. 저장소 클론

```bash
git clone https://github.com/soul130/blue-battery.git
cd blue-battery/backend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
cp .env.example .env
```

그 후 `.env` 파일을 편집하여 다음 정보를 입력하세요:

```
# MongoDB 연결
MONGODB_URI=mongodb://localhost:27017/blue-battery
# 또는 MongoDB Atlas 사용
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blue-battery

# JWT 설정
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# 서버 설정
PORT=5000
NODE_ENV=development

# Iamport 결제 API 설정
# https://admin.iamport.kr에서 확인
IAMPORT_KEY=your_iamport_key
IAMPORT_SECRET=your_iamport_secret

# 앱 설정
APP_NAME=BlueBattery
APP_URL=http://localhost:5000
```

### 4. MongoDB 시작 (로컬 사용 시)

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows
mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. 백엔드 서버 시작

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 또는 일반 모드
npm start
```

출력:
```
✅ MongoDB 연결 성공
🚀 서버가 포트 5000에서 실행 중입니다.
```

### 6. API 테스트

```bash
curl http://localhost:5000/
# 응답: {"message": "블루배터리 API 서버 v1.0"}
```

---

## 모바일 앱 설치 (React Native)

### 1. 프로젝트 디렉토리로 이동

```bash
cd blue-battery/mobile
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경 변수 설정

`src/config/api.js` 파일을 생성하세요:

```javascript
const API_URL = 'http://localhost:5000/api';

export default API_URL;
```

### 4. iOS 실행 (macOS)

```bash
npm run ios
# 또는
react-native run-ios
```

### 5. Android 실행

```bash
npm run android
# 또는
react-native run-android
```

### 6. 개발 서버 실행

```bash
npm start
```

---

## 어드민 대시보드 설치

### 1. 프로젝트 디렉토리로 이동

```bash
cd blue-battery/admin-dashboard
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일 생성:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. 개발 서버 시작

```bash
npm start
```

브라우저에서 `http://localhost:3000` 접속

---

## 초기 데이터 설정

### 테스트용 배터리 데이터 추가

```bash
curl -X POST http://localhost:5000/api/battery \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "삼성 배터리 Pro",
    "model": "SA-100",
    "description": "고성능 자동차 배터리",
    "price": 250000,
    "specifications": {
      "capacity": "90Ah",
      "voltage": "12V",
      "warranty": "5년"
    },
    "stock": 50,
    "category": "premium"
  }'
```

---

## 트러블슈팅

### MongoDB 연결 실패

```
❌ MongoDB 연결 실패: connect ECONNREFUSED 127.0.0.1:27017
```

**해결책:**
- MongoDB 서비스가 실행 중인지 확인
- `MONGODB_URI` 환경 변수 확인
- MongoDB Atlas 사용 시 IP 화이트리스트 확인

### 포트 이미 사용 중

```
Error: listen EADDRINUSE: address already in use :::5000
```

**해결책:**
```bash
# macOS/Linux - 포트 5000 사용 중인 프로세스 찾기
lsof -i :5000

# 프로세스 종료
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### JWT 토큰 오류

```
error: "토큰이 유효하지 않습니다."
```

**해결책:**
- 로그인 후 받은 토큰이 맞는지 확인
- 토큰 앞에 "Bearer " 추가
- JWT_SECRET이 일치하는지 확인

### Iamport 결제 실패

```
error: "Iamport 토큰 획득 실패"
```

**해결책:**
- `IAMPORT_KEY`와 `IAMPORT_SECRET` 확인
- Iamport 관리자 페이지에서 API 키 재발급
- 네트워크 연결 확인

---

## 프로덕션 배포

### 백엔드 배포 (Heroku 예시)

```bash
# Heroku CLI 설치
npm install -g heroku

# 로그인
heroku login

# 앱 생성
heroku create blue-battery-api

# 환경 변수 설정
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set IAMPORT_KEY=your_key
heroku config:set IAMPORT_SECRET=your_secret

# 배포
git push heroku main
```

### 모바일 앱 배포

#### iOS (App Store)
1. Apple Developer 계정 필요
2. Xcode로 빌드
3. Testflight에서 테스트
4. App Store에 제출

#### Android (Play Store)
1. Google Play Developer 계정 필요
2. 앱 서명 키 생성
3. Bundle 빌드
4. Play Store에 제출

---

## 추가 리소스

- [API 문서](./API.md)
- [React Native 공식 문서](https://reactnative.dev/)
- [Express.js 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [Iamport 문서](https://docs.iamport.kr/)
