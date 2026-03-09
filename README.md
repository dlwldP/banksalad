# 보험 보장 분석 데모 🛡️

> **솔루션 3: 지급 거절 방어 알고리즘**의 프로토타입 구현체입니다.
> 보험금 지급 거절 케이스를 AI가 분석하여 소명 전략과 메시지를 자동 생성합니다.

http://localhost:3000/api-docs
-> swagger문서에서 api 프로세스 확인 가능

---

## 배경 및 목적

보험사가 지급을 거절했을 때, 대부분의 고객은 복잡한 약관을 해석하지 못해 그냥 포기합니다.
이 프로토타입은 **거절 통보서 PDF 한 장**으로 아래 세 가지를 자동화합니다.

| 솔루션 3 기능 | 구현 여부 | 구현 내용 |
|---|---|---|
| 약관 기반 역산 | ✅ 구현 | Claude가 PDF를 직접 읽고 거절 사유의 약관 근거를 역분석 |
| 소명 텍스트 생성 | ✅ 구현 | 보험사 담당자에게 보낼 소명 메시지 자동 생성 + 복사 버튼 |
| 손해사정 리포트 | 🔜 다음 단계 | 진료 기록 + 약관 데이터 결합 시 확장 가능 |

---

## 주요 기능

- **PDF 업로드 분석** — 보험 거절 통보서, 청구서, 진단서 등을 드래그앤드롭으로 업로드하면 AI가 자동 분석
- **거절 케이스 시각화** — 보험사, 진단명, 청구 금액, 거절 사유를 카드 형태로 정리
- **AI 소명 성공률 예측** — Claude가 약관 논리 기반으로 소명 성공 가능성을 0~100%로 추론
- **핵심 반박 근거 생성** — 약관 조항을 근거로 한 논리적 반박 포인트 자동 추출
- **소명 메시지 자동 작성** — 보험사 담당자에게 보낼 편지를 즉시 생성, 복사 버튼으로 바로 사용 가능
- **샘플 케이스 지원** — PDF 없이도 더미 데이터로 전체 흐름 시연 가능

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| 런타임 | Node.js (Next.js API Route — 서버 사이드) |

---

## 왜 Claude API인가

1. **PDF 네이티브 처리** — OCR이나 텍스트 추출 전처리 없이 PDF를 base64로 인코딩해 직접 전달하면 문서 전체를 이해합니다. 복잡한 보험 약관, 거절 통보서도 그대로 분석 가능합니다.

2. **긴 문서 처리 성능** — 수백 페이지의 약관도 처리할 수 있는 긴 컨텍스트 윈도우를 지원합니다.

3. **한국어 금융·법률 문서 정확도** — 보험 약관 특유의 법률 용어와 한국어 문체에서도 높은 이해도와 생성 품질을 보입니다.

4. **구조화 출력 강제** — 시스템 프롬프트로 JSON 형식만 반환하도록 설정하여 프론트엔드에서 바로 파싱해 UI에 꽂을 수 있습니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 메인 페이지
│   │                               # - PDF 드래그앤드롭 업로드 UI
│   │                               # - 더미 케이스 선택 버튼
│   │                               # - 로딩 / 에러 상태 관리
│   │                               # - 분석 결과 렌더링
│   └── api/
│       ├── analyze/
│       │   └── route.ts            # 더미 케이스 분석 API
│       │                           # - JSON 케이스 데이터 수신
│       │                           # - Claude API 호출 (텍스트 기반)
│       │                           # - winRate / keyClause / message 반환
│       └── upload/
│           └── route.ts            # PDF 업로드 분석 API
│                                   # - multipart/form-data로 PDF 수신
│                                   # - PDF → base64 변환
│                                   # - Claude API 호출 (document 타입)
│                                   # - 케이스 정보 + 분석 결과 통합 반환
├── components/
│   ├── CaseCard.tsx                # 거절 케이스 정보 카드
│   │                               # - 보험사, 상품명, 진단코드, 병원
│   │                               # - 청구 금액, 진료일, 거절 사유 표시
│   ├── AnalysisResult.tsx          # 소명 성공률 + 핵심 반박 근거
│   │                               # - 승률 카운트업 애니메이션
│   │                               # - 프로그레스 바 애니메이션
│   │                               # - 색상 분기 (녹색/노랑/빨강)
│   └── MessageOutput.tsx           # 소명 메시지 출력 컴포넌트
│                                   # - 메시지 본문 표시
│                                   # - 클립보드 복사 버튼
└── lib/
    └── dummyData.ts                # 샘플 보험 거절 케이스 3건
                                    # - 삼성생명 / KB손해보험 / 메리츠화재
```

---

## AI 분석 흐름

### 더미 케이스 선택 시

```
케이스 버튼 클릭
      ↓
page.tsx → POST /api/analyze  (JSON body)
      ↓
analyze/route.ts
  → Claude API 호출 (텍스트 프롬프트)
  → 시스템 프롬프트: "보험 전문가로서 JSON만 반환"
      ↓
Claude 응답 파싱
  { winRate, keyClause, message }
      ↓
AnalysisResult + MessageOutput 렌더링
```

### PDF 업로드 시

```
PDF 드래그앤드롭 or 파일 선택
      ↓
page.tsx → POST /api/upload  (multipart/form-data)
      ↓
upload/route.ts
  → PDF → base64 변환
  → Claude API 호출 (document 타입으로 PDF 직접 전달)
  → 시스템 프롬프트: "문서에서 케이스 정보 추출 + 분석 결과 JSON 반환"
      ↓
Claude 응답 파싱
  { insurer, product, diagnosis, diagnosisName,
    hospital, amount, visitDate, rejectionReason,
    winRate, keyClause, message }
      ↓
CaseCard + AnalysisResult + MessageOutput 렌더링
```

---

## Claude API 핵심 코드

### PDF를 base64로 변환 후 전달

```typescript
// upload/route.ts
const arrayBuffer = await file.arrayBuffer();
const base64 = Buffer.from(arrayBuffer).toString("base64");

// Claude API에 PDF document 타입으로 전달
{
  type: "document",
  source: {
    type: "base64",
    media_type: "application/pdf",
    data: base64,
  },
}
```

### JSON 구조화 출력 강제

```typescript
// 시스템 프롬프트로 JSON만 반환하도록 설정
system: `당신은 보험 전문가입니다.
반드시 아래 JSON 형식만 반환하세요.
다른 텍스트나 마크다운 없이 JSON만 출력하세요.
{
  "winRate": 숫자(0-100),
  "keyClause": "약관 기반 핵심 반박 근거 1-2문장",
  "message": "보험사 담당자에게 보낼 소명 메시지"
}`

// 응답에서 마크다운 코드블록 제거 후 파싱
const clean = text.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(clean);
```

---

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트(`package.json`과 같은 위치)에 `.env.local` 파일을 생성합니다.

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxx
```

> API 키 발급: [console.anthropic.com](https://console.anthropic.com) → 로그인 → API Keys → Create Key

### 3. API Route 폴더 확인

아래 폴더 구조가 없으면 직접 생성합니다.

```bash
# Windows
mkdir src\app\api\analyze
mkdir src\app\api\upload
```

각 폴더 안에 `route.ts` 파일이 있어야 합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

---

## 사용 방법

### PDF 업로드로 실제 분석

1. 보험 거절 통보서, 청구서, 진단서 등 PDF를 준비합니다.
2. 상단 업로드 영역에 드래그앤드롭하거나 클릭해서 파일을 선택합니다.
3. Claude가 PDF를 읽고 자동으로 케이스 정보를 추출합니다.
4. 소명 성공률, 핵심 반박 근거, 소명 메시지가 생성됩니다.
5. 복사 버튼으로 메시지를 복사해 보험사 담당자에게 전송합니다.

### 샘플 케이스로 흐름 확인

PDF 없이도 하단의 샘플 케이스 버튼을 클릭하면 전체 분석 흐름을 확인할 수 있습니다.

- [삼성생명] 위염 (K29.7) — 87,000원
- [KB손해보험] 요통 (M54.5) — 124,000원
- [메리츠화재] 급성 상기도 감염 (J06.9) — 35,000원

---

## 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요. (`.gitignore`에 기본 포함되어 있습니다.)
- API 키는 서버(`route.ts`)에서만 사용되며 브라우저에 절대 노출되지 않습니다.
- `npm run dev` 실행 전 `.env.local`이 있어야 API 호출이 정상 작동합니다.
- 본 데모는 실제 법적 효력이 있는 소명 자료가 아니며, 시연 목적으로만 사용합니다.
