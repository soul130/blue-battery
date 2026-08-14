# Blue Battery - 프로젝트 기여 가이드

## 개발 환경 설정

1. 저장소 포크 및 클론
2. 새로운 브랜치 생성: `git checkout -b feature/기능명`
3. 변경 사항 커밋: `git commit -m 'Add 기능명'`
4. 브랜치에 푸시: `git push origin feature/기능명`
5. Pull Request 생성

## 코드 스타일

- JavaScript/Node.js: ES6+ 문법 사용
- 함수명: camelCase
- 상수: UPPER_CASE
- 들여쓰기: 2칸

## 커밋 메시지 규칙

```
[타입] 간단한 설명

상세 설명 (필요 시)

- 변경 사항 1
- 변경 사항 2
```

### 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 의존성 등

## 이슈 및 버그 리포트

GitHub Issues에서 버그를 보고해주세요.

### 버그 리포트 양식

- 발생한 문제 설명
- 재현 방법
- 예상 동작
- 실제 동작
- 스크린샷 (필요 시)
- 환경 정보 (OS, Node.js 버전 등)

## 기능 요청

GitHub Discussions에서 새로운 기능을 제안해주세요.
