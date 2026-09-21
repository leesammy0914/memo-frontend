# memo-frontend

KAIST 클라우드 수업 개인과제 — 메모 앱의 **프론트엔드**입니다.
React(Vite)로 만들고 Vercel에 배포했습니다.

## 배포 주소

| 항목 | 주소 |
|---|---|
| 개인 소개 페이지 | https://memo-frontend-olive.vercel.app/about.html |
| 메모 앱 (프론트↔백엔드 연동) | https://memo-frontend-olive.vercel.app |
| 백엔드 Swagger UI | https://memo-backend-4yvc.onrender.com/docs |
| 백엔드 저장소 | https://github.com/leesammy0914/memo-backend |

두 페이지는 서로 링크로 오갈 수 있습니다.
메모 앱 상단의 "← 만든 사람 소개", 소개 페이지의 "메모 앱 열어보기" 버튼.

> ⚠️ 백엔드는 Render 무료 플랜이라 접속이 없으면 서버가 잠듭니다.
> 처음 열 때 메모 목록이 뜨기까지 **30초~1분** 걸릴 수 있습니다.

## 프로젝트 소개

메모를 추가·조회·삭제하는 가장 단순한 CRUD 앱입니다.
기능을 최소로 줄이고, **세 계층이 어떻게 나뉘고 어떻게 연결되는지**에 집중했습니다.

```
브라우저 ──fetch──► Vercel (React 정적 파일)
                      │
                      └──fetch──► Render (FastAPI) ──► 메모리 저장소
```

- 화면은 데이터를 갖고 있지 않고, 백엔드에 물어봅니다
- 그래서 새로고침해도 메모가 남습니다
- 백엔드는 누가 부르든 상관하지 않습니다 (브라우저든 Swagger UI든)

## 주요 구성

```
memo-frontend/
├── public/
│   └── about.html      개인 소개 페이지 (정적 HTML)
├── src/
│   └── App.jsx         메모 앱 화면 + API 호출
├── .env                로컬 개발용 백엔드 주소 (git 제외)
└── package.json
```

### API 호출

`App.jsx`에서 백엔드의 엔드포인트 3개를 부릅니다.

| 동작 | 요청 |
|---|---|
| 목록 조회 | `GET /memos` |
| 추가 | `POST /memos` |
| 삭제 | `DELETE /memos/{id}` |

### 환경변수

백엔드 주소는 코드에 박지 않고 환경변수로 뺐습니다.

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

| 환경 | VITE_API_URL |
|---|---|
| 로컬 (`.env`) | `http://localhost:8000` |
| Vercel (Production) | `https://memo-backend-4yvc.onrender.com` |

같은 코드가 환경에 따라 다른 백엔드를 바라봅니다.

## 로컬에서 실행하기

백엔드를 먼저 켜야 합니다 ([memo-backend](https://github.com/leesammy0914/memo-backend) 참고).

```bash
npm install
npm run dev
```

→ http://localhost:5173

## 배포

`main` 브랜치에 push하면 Vercel이 감지해 자동으로 빌드·배포합니다(CI/CD).
배포 버튼을 누르는 과정이 없습니다.

## 기술 스택

React 19 · Vite · Vercel

## AI 활용

Claude를 사용했습니다.

- API 호출 코드(`fetch`) 작성, 소개 페이지 HTML 초안, README 구성
- 검증: 로컬에서 백엔드를 켠 상태로 메모 추가 후 새로고침해 데이터가 남는지,
  Swagger UI에서 넣은 메모가 화면에 나타나는지, 백엔드를 끄면 오류가 뜨는지 직접 확인
- 배포 후에는 실제 Vercel 주소에서 메모 추가·삭제가 Render 백엔드에 반영되는지 확인
