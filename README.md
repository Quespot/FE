# 🗺️ Quespot

### 전국 방방곡곡, 미션으로 떠나는 관광 서비스

**Quespot**은 관광지를 탐색하고, 지역별 미션을 수행하며, 여행의 경험을 기록할 수 있는 미션형 관광 서비스입니다.

사용자는 현재 위치 또는 선택한 지역을 기반으로 관광지와 추천 코스를 확인하고, 사진 인증·키워드 입력·감상 기록 등의 미션을 수행할 수 있습니다.

미션을 완료하면 포인트와 배지, 지역 스탬프를 획득하고 여행 기록을 아카이브에 남길 수 있습니다.

**🔗 [서비스 바로가기](https://quespot.site)**

---

## ✨ 주요 기능

### 1. 지역 기반 관광지 탐색

- 현재 위치 및 선택한 지역을 기반으로 관광지 탐색
- 관광지 위치 및 상세 정보 확인
- 난이도와 테마를 고려한 미션 코스 탐색
- Google Maps 기반 지도 인터페이스

### 2. 미션형 관광 코스

단순히 관광지를 방문하는 것에서 나아가, 관광지를 직접 관찰하고 경험할 수 있도록 미션을 제공합니다.

| 미션 유형 | 설명 |
|---|---|
| 📸 사진 인증 | 주어진 장소나 구도를 참고하여 사진 촬영 |
| 🔎 키워드 관찰 | 관광지에서 특정 요소를 발견하고 기록 |
| ✍️ 감상 기록 | 방문 장소에 대한 생각과 경험 작성 |

- 관광 코스별 미션 확인
- 미션 상세 정보 및 수행 화면 제공
- GPS 및 이미지 기반 인증 기능
- 인증 결과에 따른 화면 전환

### 3. 보상 및 스탬프

- 미션 수행에 따른 포인트 획득
- 미션 완료 보상 확인
- 지역별 스탬프 및 배지 수집
- 관광 활동에 대한 성취 경험 제공

### 4. 여행 아카이브

- 수행한 미션 및 여행 기록 확인
- 관광지별 활동 이력 관리
- 여행 기록과 보상 내역 확인
- 여행 경험을 공유할 수 있는 카드 기능

### 5. 알림

- 미션 관련 알림
- 보상 획득 알림
- 추천 관광지 및 서비스 알림

---

## 🛠 Tech Stack

| Category | Technologies |
|---|---|
| Language | TypeScript |
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM |
| Server State | TanStack Query v5 |
| HTTP Client | Axios |
| Maps | Google Maps, @vis.gl/react-google-maps |
| External Service | Firebase |
| PWA | vite-plugin-pwa |
| SVG | SVGR |
| UI Icons | Lucide React |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## 🏗 Frontend Architecture

Quespot은 관광지 탐색부터 미션 수행, 인증, 보상 및 아카이브까지 연결되는 사용자 흐름을 중심으로 구성된 React 기반 웹 애플리케이션입니다.

공통 레이아웃과 라우팅을 분리하고, 서버 데이터와 UI 상태의 역할을 구분하여 여러 기능을 관리할 수 있도록 구성했습니다.

### 1. 라우팅 및 공통 레이아웃

React Router의 `createBrowserRouter`를 활용하여 애플리케이션 라우팅을 구성했습니다.

**주요 구성**

- `MobileLayout`: 모바일 웹 환경의 공통 레이아웃
- `BottomNavigationLayout`: 하단 내비게이션을 사용하는 페이지의 공통 레이아웃
- `ProtectedRoute`: 인증이 필요한 페이지에 대한 접근 제어
- `PATH`: 페이지 경로를 별도로 관리하기 위한 상수

공통 UI를 레이아웃 단위로 분리하여 페이지마다 동일한 내비게이션과 화면 구조를 반복해서 작성하지 않도록 구성했습니다.

또한 인증이 필요한 화면의 접근 조건을 라우팅 계층에서 관리할 수 있도록 분리했습니다.

### 2. 서버 상태 관리

TanStack Query v5를 활용한 서버 상태 관리 환경을 구성했습니다.

**주요 구성**

- 애플리케이션 최상위에 `QueryClientProvider` 적용
- `QueryClient`를 통한 서버 상태 관리 기반 구성
- Axios를 활용한 HTTP 통신
- API 데이터 처리와 UI 렌더링 관심사 분리

이를 통해 관광지, 미션, 사용자 정보 등 서버와 연동되는 데이터를 다룰 수 있는 기반을 마련했습니다.

### 3. PWA 환경 구성

`vite-plugin-pwa`를 활용하여 모바일 환경에서 앱과 유사한 사용자 경험을 제공하기 위한 PWA 설정을 구성했습니다.

**적용 설정**

- Web App Manifest 등록
- `standalone` 디스플레이 모드
- `autoUpdate` 등록 방식 설정

PWA 설정을 통해 모바일 기기에서 홈 화면에 추가하여 사용할 수 있는 웹앱 환경을 지원하도록 구성했습니다.

### 4. 개발환경 구성

Vite와 TypeScript를 기반으로 프로젝트를 구성했습니다.

- TypeScript의 엄격한 타입 검사 설정
- `@/` alias를 통한 절대 경로 기반 모듈 참조
- Tailwind CSS v4 기반 스타일링
- SVGR을 활용한 SVG 컴포넌트 사용
- pnpm을 활용한 패키지 관리

---

## 🔄 User Flow

### 관광지 탐색부터 여행 기록까지

```text
지역 선택 / 현재 위치
          ↓
    관광지 및 코스 탐색
          ↓
       미션 상세
          ↓
       미션 수행
          ↓
   사진 / 키워드 / 감상 인증
          ↓
       인증 결과
          ↓
       보상 획득
          ↓
      여행 아카이브
```

### 1. 탐색 및 코스 선택

사용자가 관심 있는 지역을 선택하고, 관광지와 추천 미션 코스를 확인합니다.

### 2. 미션 수행

선택한 관광 코스에 포함된 미션을 수행합니다.

미션의 종류에 따라 사진 촬영, 키워드 입력, 감상 작성 등의 인터페이스를 제공합니다.

### 3. 인증 및 결과 확인

사용자가 제출한 인증 정보에 따라 인증 과정을 진행하고 결과를 확인합니다.

인증 진행 상태에 따라 로딩 및 결과 화면을 제공합니다.

### 4. 보상 및 아카이브

미션 수행 결과에 따른 보상을 확인하고, 사용자의 여행 활동을 아카이브에 기록합니다.

---

## 📂 Project Structure

주요 디렉터리와 파일을 중심으로 정리한 프로젝트 구조입니다.

```text
Quespot-FE/
├── public/                  # 정적 리소스 및 PWA 아이콘
├── scripts/                 # 프로젝트 스크립트
├── src/
│   ├── assets/              # 이미지 및 SVG 에셋
│   ├── components/          # 공통 및 기능별 컴포넌트
│   ├── layouts/             # 공통 레이아웃
│   │   ├── MobileLayout
│   │   └── BottomNavigationLayout
│   ├── pages/               # 기능별 페이지
│   │   ├── Auth/            # 로그인, 회원가입, 온보딩
│   │   ├── mission/         # 미션 탐색, 상세, 코스
│   │   │   └── verify/      # 미션 인증 및 결과
│   │   ├── map/             # 지도 및 장소 검색
│   │   ├── My/              # 마이페이지 및 아카이브
│   │   ├── HomePage
│   │   ├── RewardPage
│   │   └── NotificationPage
│   ├── routes/              # 라우팅 및 접근 제어
│   │   ├── router.tsx
│   │   ├── paths.ts
│   │   └── ProtectedRoute
│   ├── styles/              # 스타일 관련 파일
│   ├── App.tsx              # 앱 컴포넌트
│   └── main.tsx             # 앱 진입점 및 Provider
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## ⚙️ Development Environment

### Vite Configuration

프로젝트의 빌드 환경은 Vite를 기반으로 구성되어 있습니다.

**적용 플러그인**

- `@vitejs/plugin-react`: React 개발환경
- `@tailwindcss/vite`: Tailwind CSS 통합
- `vite-plugin-svgr`: SVG 컴포넌트 사용
- `vite-plugin-pwa`: PWA 설정 및 Manifest 생성

### TypeScript

TypeScript를 활용해 컴포넌트와 데이터 구조의 타입 안정성을 확보하고, 빌드 과정에서 타입 검사를 수행하도록 설정했습니다.

### Build & Deployment

- Vite 기반 개발 서버 실행
- `tsc && vite build`를 통한 타입 검사 및 프로덕션 빌드
- Vercel을 통한 웹 서비스 배포
- SPA 라우팅을 위한 배포 환경 설정

---

## 👩‍💻 Frontend Team

| Name | GitHub |
|---|---|
| 김재범 | [@kinjaebeom](https://github.com/kinjaebeom) |
| 강민서 | [@shooukie](https://github.com/shooukie) |
| 최효비 | [@Hyobee02](https://github.com/Hyobee02) |

---

## 🔗 Links

- **Service:** https://quespot.site
- **Frontend Repository:** https://github.com/Quespot/FE

---

Quespot은 사용자가 관광지를 직접 탐색하고, 미션을 수행하며, 여행 경험을 기록하는 과정을 하나의 서비스로 연결한 프로젝트입니다.
