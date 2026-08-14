# 블루배터리 (Blue Battery) - 자동차 배터리 구매 및 교체 예약 앱

## 📱 프로젝트 개요
블루배터리는 자동차 배터리를 구매하고 교체를 예약할 수 있는 모바일 앱입니다.
- **사용자**: 배터리 상품 조회, 예약, 결제 (신용카드/카카오페이/토스)
- **관리자**: 예약자 명단 관리, 매출 현황 조회

## 🛠️ 기술 스택

### 모바일 앱 (React Native)
- React Native
- Redux (상태 관리)
- Axios (API 통신)
- React Navigation (화면 이동)

### 백엔드 (Node.js + Express)
- Node.js + Express
- MongoDB (NoSQL 데이터베이스)
- JWT (인증)
- Iamport API (결제 연동: 신용카드, 카카오페이, 토스)

### 어드민 대시보드 (React)
- React
- Axios
- Chart.js (매출 차트)

## 📁 디렉토리 구조

```
blue-battery/
├── mobile/                    # React Native 모바일 앱
│   ├── src/
│   │   ├── screens/          # 화면 컴포넌트
│   │   ├── components/       # UI 컴포넌트
│   │   ├── redux/            # Redux 상태 관리
│   │   ├── services/         # API 통신
│   │   ├── navigation/       # 화면 네비게이션
│   │   └── utils/            # 유틸리티 함수
│   └── package.json
│
├── backend/                   # Node.js Express 백엔드
│   ├── src/
│   │   ├── routes/           # API 라우트
│   │   ├── controllers/      # 컨트롤러 (비즈니스 로직)
│   │   ├── models/           # MongoDB 스키마
│   │   ├── middleware/       # 미들웨어 (JWT, 에러 처리)
│   │   ├── services/         # 서비스 (결제, 이메일 등)
│   │   ├── config/           # 설정 파일
│   │   └── server.js         # 메인 서버
│   ├── .env.example          # 환경 변수 예시
│   └── package.json
│
├── admin-dashboard/          # React 웹 어드민 대시보드
│   ├── src/
│   │   ├── pages/            # 페이지
│   │   ├── components/       # 컴포넌트
│   │   ├── services/         # API 통신
│   │   └── App.js
│   └── package.json
│
└── docs/                      # 문서
    ├── API.md                # API 문서
    └── SETUP.md              # 설치 가이드
```

## 🚀 주요 기능

### 👤 사용자 기능
- ✅ 회원가입 / 로그인
- ✅ 배터리 상품 목록 조회
- ✅ 배터리 교체 예약
- ✅ 결제 (신용카드, 카카오페이, 토스)
- ✅ 예약 내역 조회 및 취소
- ✅ 프로필 관리

### 👨‍💼 관리자 기능
- ✅ 예약자 명단 조회
- ✅ 예약 상태 관리 (승인/거절/완료)
- ✅ 매출 현황 대시보드
- ✅ 사용자 관리
- ✅ 배터리 상품 관리

## 📚 사용 가이드

### 설치 및 실행
자세한 설치 방법은 [SETUP.md](docs/SETUP.md)를 참고하세요.

### API 문서
[API.md](docs/API.md)에서 모든 API 엔드포인트를 확인할 수 있습니다.

## 📝 환경 변수 설정

백엔드 `.env` 파일에서 다음을 설정하세요:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
IAMPORT_KEY=your_iamport_key
IAMPORT_SECRET=your_iamport_secret
```

## 👨‍💻 개발자
- 프로젝트 시작: 2026년 8월

## 📄 라이선스
MIT License
