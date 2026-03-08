import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
  }

  // PDF를 base64로 변환
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `당신은 보험 전문가입니다. 업로드된 보험 관련 문서(청구서, 거절 통보문, 진단서 등)를 분석하고 반드시 아래 JSON 형식만 반환하세요. 다른 텍스트나 마크다운 없이 JSON만 출력하세요.
{
  "insurer": "보험사명",
  "product": "상품명 (문서에 없으면 '정보 없음')",
  "diagnosis": "진단코드 (문서에 없으면 '정보 없음')",
  "diagnosisName": "진단명",
  "hospital": "병원명",
  "amount": 청구금액숫자 (숫자만, 없으면 0),
  "visitDate": "진료일 (YYYY.MM.DD 형식)",
  "rejectionReason": "거절 사유 또는 문서 요약",
  "winRate": 소명성공가능성숫자(0-100),
  "keyClause": "약관 기반 핵심 반박 근거 1-2문장",
  "message": "보험사 담당자에게 보낼 소명 메시지 (정중하고 논리적으로, 약관 조항 언급 포함, 3-5문단)"
}`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            {
              type: "text",
              text: "이 문서를 분석하여 보험금 거절 케이스 정보와 소명 전략을 JSON으로 반환해주세요.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Claude API 오류:", err);
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