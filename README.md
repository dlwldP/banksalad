# 보험 보장 분석 데모 🛡️

보험금 지급 거절 케이스를 AI가 분석하여 소명 전략과 메시지를 자동 생성하는 데모 프로젝트입니다.

---

## 주요 기능

- **거절 케이스 시각화** — 보험사, 진단명, 청구 금액, 거절 사유를 카드 형태로 표시
- **AI 소명 성공률 예측** — Claude가 유사 판례 및 약관 논리를 기반으로 승률 분석
- **핵심 반박 근거 생성** — 약관 조항 기반의 논리적 반박 포인트 자동 추출
- **소명 메시지 자동 작성** — 보험사 담당자에게 보낼 편지를 즉시 생성 및 복사

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 Anthropic API 키를 입력합니다.

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxx
```

> API 키는 [console.anthropic.com](https://console.anthropic.com) → API Keys에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 메인 페이지 (케이스 선택 + 결과 렌더링)
│   └── api/
│       └── analyze/
│           └── route.ts          # Claude API 호출 서버 라우트
├── components/
│   ├── CaseCard.tsx              # 거절 케이스 정보 카드
│   ├── AnalysisResult.tsx        # 승률 및 핵심 근거 표시
│   └── MessageOutput.tsx         # 소명 메시지 출력 + 복사 버튼
└── lib/
    └── dummyData.ts              # 샘플 보험 거절 케이스 데이터
```

---

## AI 분석 흐름

```
케이스 선택 (클릭)
      ↓
page.tsx → POST /api/analyze
      ↓
route.ts → Claude API 호출
      ↓
Claude 분석 결과 (JSON)
  {
    winRate: 72,
    keyClause: "약관 제3조 2항에 의거...",
    message: "안녕하세요, 담당자님..."
  }
      ↓
AnalysisResult + MessageOutput 렌더링
```

---

## 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요. (`.gitignore`에 기본 포함)
- API 키는 서버(`route.ts`)에서만 사용되며 브라우저에 노출되지 않습니다.
- 본 데모는 실제 법적 효력이 있는 소명 자료가 아닙니다.
