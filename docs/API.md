# Blue Battery Backend API 문서

## 기본 설정

### 환경 변수 설정
`.env` 파일을 생성하고 다음 정보를 입력하세요:

```
MONGODB_URI=mongodb://localhost:27017/blue-battery
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
IAMPORT_KEY=your_iamport_key
IAMPORT_SECRET=your_iamport_secret
APP_NAME=BlueBattery
APP_URL=http://localhost:5000
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드로 실행 (nodemon 사용)
npm run dev

# 일반 실행
npm start
```

## API 엔드포인트

### 인증 (Authentication)

#### 회원가입
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123",
  "phone": "01012345678",
  "address": "서울시 강남구"
}

Response: 201 Created
{
  "message": "회원가입이 완료되었습니다.",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678"
  }
}
```

#### 로그인
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "hong@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "로그인이 완료되었습니다.",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "user"
  }
}
```

#### 프로필 조회
```
GET /api/auth/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "...",
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "01012345678",
  "address": "서울시 강남구",
  "role": "user"
}
```

#### 프로필 수정
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "01012345678",
  "address": "서울시 서초구"
}

Response: 200 OK
{
  "message": "프로필이 업데이트되었습니다.",
  "user": {...}
}
```

---

### 배터리 (Battery)

#### 모든 배터리 조회
```
GET /api/battery
GET /api/battery?category=premium
GET /api/battery?search=삼성

Response: 200 OK
[
  {
    "_id": "...",
    "name": "삼성 배터리 Pro",
    "model": "SA-100",
    "price": 250000,
    "category": "premium",
    "stock": 50,
    "specifications": {
      "capacity": "90Ah",
      "voltage": "12V",
      "warranty": "5년"
    }
  },
  ...
]
```

#### 배터리 상세 조회
```
GET /api/battery/{batteryId}

Response: 200 OK
{
  "_id": "...",
  "name": "삼성 배터리 Pro",
  "model": "SA-100",
  "description": "고성능 자동차 배터리",
  "price": 250000,
  "specifications": {...},
  "image": "...",
  "stock": 50,
  "category": "premium"
}
```

#### 배터리 추가 (관리자만)
```
POST /api/battery
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "LG 배터리",
  "model": "LG-200",
  "description": "고성능 LG 배터리",
  "price": 280000,
  "specifications": {
    "capacity": "100Ah",
    "voltage": "12V",
    "warranty": "5년"
  },
  "stock": 30,
  "category": "premium"
}

Response: 201 Created
{
  "message": "배터리가 추가되었습니다.",
  "battery": {...}
}
```

#### 배터리 수정 (관리자만)
```
PUT /api/battery/{batteryId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 270000,
  "stock": 45
}

Response: 200 OK
{
  "message": "배터리가 수정되었습니다.",
  "battery": {...}
}
```

#### 배터리 삭제 (관리자만)
```
DELETE /api/battery/{batteryId}
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "message": "배터리가 삭제되었습니다."
}
```

---

### 예약 (Reservation)

#### 예약 생성
```
POST /api/reservation
Authorization: Bearer {token}
Content-Type: application/json

{
  "batteryId": "...",
  "reservationDate": "2026-08-20",
  "timeSlot": "10:00-11:00",
  "location": "서울시 강남구 삼성동",
  "carInfo": {
    "carModel": "아반떼",
    "carYear": "2020",
    "licensePlate": "서울 12가 1234"
  },
  "notes": "빠른 교체 요청"
}

Response: 201 Created
{
  "message": "예약이 생성되었습니다.",
  "reservation": {
    "_id": "...",
    "userId": "...",
    "batteryId": "...",
    "reservationDate": "2026-08-20",
    "timeSlot": "10:00-11:00",
    "status": "pending",
    "createdAt": "2026-08-14T..."
  }
}
```

#### 내 예약 목록 조회
```
GET /api/reservation/my
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "...",
    "batteryId": {...},
    "reservationDate": "2026-08-20",
    "status": "pending",
    "paymentId": null
  },
  ...
]
```

#### 예약 상세 조회
```
GET /api/reservation/{reservationId}
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "...",
  "userId": "...",
  "batteryId": {...},
  "reservationDate": "2026-08-20",
  "timeSlot": "10:00-11:00",
  "location": "서울시 강남구 삼성동",
  "carInfo": {...},
  "status": "pending",
  "paymentId": null
}
```

#### 예약 수정
```
PUT /api/reservation/{reservationId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservationDate": "2026-08-21",
  "timeSlot": "14:00-15:00"
}

Response: 200 OK
{
  "message": "예약이 수정되었습니다.",
  "reservation": {...}
}
```

#### 예약 취소
```
DELETE /api/reservation/{reservationId}
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "예약이 취소되었습니다.",
  "reservation": {...}
}
```

---

### 결제 (Payment)

#### 결제 준비
```
POST /api/payment/prepare
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservationId": "...",
  "amount": 250000,
  "paymentMethod": "credit_card" (또는 "kakao_pay", "toss")
}

Response: 200 OK
{
  "message": "결제가 준비되었습니다.",
  "merchantUid": "BLUE_1692000000000_abc123",
  "paymentId": "...",
  "amount": 250000,
  "paymentMethod": "credit_card"
}
```

#### 결제 완료 (서버 검증)
```
POST /api/payment/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "impUid": "imp_12345678",
  "merchantUid": "BLUE_1692000000000_abc123"
}

Response: 200 OK
{
  "message": "결제가 완료되었습니다.",
  "payment": {
    "_id": "...",
    "amount": 250000,
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "completedAt": "2026-08-14T..."
  },
  "paymentData": {...}
}
```

#### 결제 취소
```
POST /api/payment/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "impUid": "imp_12345678",
  "reason": "사용자 요청"
}

Response: 200 OK
{
  "message": "결제가 취소되었습니다.",
  "response": {...}
}
```

#### 결제 내역 조회
```
GET /api/payment/history
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "...",
    "amount": 250000,
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "createdAt": "2026-08-14T..."
  },
  ...
]
```

---

### 관리자 (Admin) - 모든 요청에 관리자 권한 필요

#### 모든 예약 조회
```
GET /api/admin/reservations
Authorization: Bearer {admin_token}
GET /api/admin/reservations?status=pending
GET /api/admin/reservations?startDate=2026-08-01&endDate=2026-08-31

Response: 200 OK
[
  {
    "_id": "...",
    "userId": {"name": "홍길동", "email": "..." },
    "batteryId": {...},
    "status": "pending",
    "createdAt": "..."
  },
  ...
]
```

#### 예약 상태 업데이트
```
PUT /api/admin/reservations/{reservationId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "기술자 지정 완료"
}

Response: 200 OK
{
  "message": "예약 상태가 업데이트되었습니다.",
  "reservation": {...}
}
```

#### 매출 통계
```
GET /api/admin/statistics/revenue
Authorization: Bearer {admin_token}
GET /api/admin/statistics/revenue?startDate=2026-08-01&endDate=2026-08-31

Response: 200 OK
{
  "totalRevenue": 2500000,
  "totalPayments": 10,
  "paymentMethodStats": {
    "credit_card": { "count": 5, "amount": 1250000 },
    "kakao_pay": { "count": 3, "amount": 750000 },
    "toss": { "count": 2, "amount": 500000 }
  }
}
```

#### 모든 사용자 조회
```
GET /api/admin/users
Authorization: Bearer {admin_token}

Response: 200 OK
[
  {
    "_id": "...",
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "role": "user",
    "createdAt": "..."
  },
  ...
]
```

#### 사용자 역할 변경
```
PUT /api/admin/users/{userId}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}

Response: 200 OK
{
  "message": "사용자 역할이 변경되었습니다.",
  "user": {...}
}
```

#### 대시보드 요약
```
GET /api/admin/dashboard/summary
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "totalUsers": 150,
  "totalReservations": 300,
  "pendingReservations": 45,
  "confirmedReservations": 120,
  "completedReservations": 130,
  "cancelledReservations": 5,
  "totalBatteries": 25,
  "totalRevenue": 5000000
}
```

---

### 사용자 대시보드 (User Dashboard)

#### 사용자 대시보드 조회
```
GET /api/user/dashboard
Authorization: Bearer {token}

Response: 200 OK
{
  "totalReservations": 5,
  "pendingReservations": 2,
  "confirmedReservations": 2,
  "completedReservations": 1,
  "totalSpent": 750000,
  "recentReservations": [...]
}
```

---

## 에러 처리

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "error": "에러 메시지"
}
```

### 일반적인 에러 코드

- `400 Bad Request`: 유효하지 않은 요청
- `401 Unauthorized`: 인증이 필요하거나 토큰이 유효하지 않음
- `403 Forbidden`: 권한이 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

---

## 결제 시스템 통합 (Iamport)

### 신용카드 결제 흐름
1. 클라이언트: `/api/payment/prepare` 호출 → `merchantUid` 받기
2. 클라이언트: Iamport 결제창 오픈 (신용카드 입력)
3. 클라이언트: 결제 완료 후 `impUid` 받기
4. 클라이언트: `/api/payment/complete` 호출하여 서버 검증
5. 서버: Iamport API로 결제 검증
6. 예약 상태 자동 변경 (pending → confirmed)

### 카카오페이/토스 결제 흐름
- 동일한 프로세스 (paymentMethod만 다름)
- Iamport가 각 결제 수단의 결제창을 자동으로 처리

---

## 테스트

### cURL로 API 테스트 예시

```bash
# 회원가입
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "hong@example.com",
    "password": "password123",
    "phone": "01012345678"
  }'

# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hong@example.com",
    "password": "password123"
  }'

# 배터리 조회
curl http://localhost:5000/api/battery
```
