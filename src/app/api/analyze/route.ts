import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { insurer, product, diagnosisName, diagnosis, hospital, amount, visitDate, rejectionReason } = body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `당신은 보험 전문가입니다. 보험금 지급 거절 케이스를 분석하고 반드시 아래 JSON 형식만 반환하세요. 다른 텍스트나 마크다운 없이 JSON만 출력하세요.
{
  "winRate": 숫자(0-100),
  "keyClause": "약관 기반 핵심 반박 근거 1-2문장",
  "message": "보험사 담당자에게 보낼 소명 메시지 (정중하고 논리적으로, 약관 조항 언급 포함, 3-5문단)"
}`,
      messages: [
        {
          role: "user",
          content: `다음 보험금 지급 거절 케이스를 분석해주세요:

- 보험사: ${insurer}
- 상품명: ${product}
- 진단명: ${diagnosisName} (${diagnosis})
- 병원: ${hospital}
- 청구 금액: ${Number(amount).toLocaleString()}원
- 진료일: ${visitDate}
- 거절 사유: ${rejectionReason}

소명 성공 가능성(winRate), 핵심 반박 근거(keyClause), 보험사에 보낼 소명 메시지(message)를 JSON으로 반환하세요.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Claude API 호출 실패" }, { status: 500 });
  }

  const data = await response.json();
  const text = data.content
    .map((block: { type: string; text?: string }) =>
      block.type === "text" ? block.text : ""
    )
    .join("");

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return NextResponse.json(parsed);
}