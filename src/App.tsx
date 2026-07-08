import { Link, Route, Routes } from 'react-router-dom'

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm font-semibold text-blue-600">Quespot FE</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
          미션으로 떠나는 특별한 여행을 준비합니다.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          Vite, React, TypeScript, React Router, TanStack Query, Zustand, Zod,
          Axios, Tailwind CSS 세팅이 완료된 프론트엔드 스타터입니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            to="/missions"
          >
            미션 화면 보기
          </Link>
          <a
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            href="https://github.com/Quespot/FE"
            rel="noreferrer"
            target="_blank"
          >
            GitHub 저장소
          </a>
        </div>
      </section>
    </main>
  )
}

function MissionsPage() {
  return (
    <main className="min-h-screen bg-blue-50 px-6 py-10 text-slate-950">
      <section className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <Link className="text-sm font-semibold text-blue-600" to="/">
          홈으로
        </Link>
        <h2 className="mt-6 text-2xl font-bold">미션 코스 준비 중</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          지역 탐색, 미션 인증, 보상, 아카이브 기능을 이 라우트부터
          확장하면 됩니다.
        </p>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<MissionsPage />} path="/missions" />
    </Routes>
  )
}

export default App
