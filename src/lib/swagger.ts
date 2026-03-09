import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "보험 보장 분석 API",
        version: "1.0.0",
        description:
          "보험금 지급 거절 케이스를 Claude LLM으로 분석하여 소명 전략과 메시지를 자동 생성하는 API입니다.",
      },
      paths: {
        "/api/analyze": {
          post: {
            summary: "더미 케이스 분석",
            description:
              "보험 거절 케이스 정보를 JSON으로 전달하면 Claude AI가 소명 성공률, 핵심 반박 근거, 소명 메시지를 생성합니다.",
            tags: ["분석"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: [
                      "insurer",
                      "product",
                      "diagnosis",
                      "diagnosisName",
                      "hospital",
                      "amount",
                      "visitDate",
                      "rejectionReason",
                    ],
                    properties: {
                      insurer: {
                        type: "string",
                        example: "삼성생명",
                        description: "보험사명",
                      },
                      product: {
                        type: "string",
                        example: "무배당 실손 2023",
                        description: "보험 상품명",
                      },
                      diagnosis: {
                        type: "string",
                        example: "K29.7",
                        description: "진단 코드 (KCD)",
                      },
                      diagnosisName: {
                        type: "string",
                        example: "위염",
                        description: "진단명",
                      },
                      hospital: {
                        type: "string",
                        example: "서울내과의원",
                        description: "진료 병원명",
                      },
                      amount: {
                        type: "number",
                        example: 87000,
                        description: "청구 금액 (원)",
                      },
                      visitDate: {
                        type: "string",
                        example: "2025.11.14",
                        description: "진료일",
                      },
                      rejectionReason: {
                        type: "string",
                        example: "의원급 외래 공제 기준 적용 후 잔여 금액 보장 한도 미만",
                        description: "보험사 거절 사유",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "분석 성공",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        winRate: {
                          type: "number",
                          example: 72,
                          description: "소명 성공 가능성 (0~100)",
                        },
                        keyClause: {
                          type: "string",
                          example: "약관 제7조 2항에 의거 외래 공제 기준 적용 시 잔여액이 보장 한도를 초과합니다.",
                          description: "핵심 반박 근거",
                        },
                        message: {
                          type: "string",
                          example: "안녕하세요. 담당자님, 저는 ...",
                          description: "보험사 담당자에게 보낼 소명 메시지",
                        },
                      },
                    },
                  },
                },
              },
              "500": {
                description: "Claude API 호출 실패",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string", example: "Claude API 호출 실패" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/upload": {
          post: {
            summary: "PDF 업로드 분석",
            description:
              "보험 거절 통보서, 진단서, 청구서 등 PDF를 업로드하면 Claude AI가 문서를 직접 읽고 케이스 정보를 추출한 뒤 소명 전략을 생성합니다.",
            tags: ["PDF 분석"],
            requestBody: {
              required: true,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    required: ["file"],
                    properties: {
                      file: {
                        type: "string",
                        format: "binary",
                        description: "분석할 PDF 파일 (보험 거절 통보서, 청구서, 진단서 등)",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "분석 성공",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        insurer: { type: "string", example: "현대해상", description: "보험사명" },
                        product: { type: "string", example: "굿앤굿 실손의료비보험", description: "상품명" },
                        diagnosis: { type: "string", example: "M75.1", description: "진단 코드" },
                        diagnosisName: { type: "string", example: "회전근개 증후군", description: "진단명" },
                        hospital: { type: "string", example: "세브란스병원", description: "병원명" },
                        amount: { type: "number", example: 350000, description: "청구 금액 (원)" },
                        visitDate: { type: "string", example: "2025.11.28", description: "진료일" },
                        rejectionReason: { type: "string", example: "비급여 도수치료 미보장", description: "거절 사유" },
                        winRate: { type: "number", example: 68, description: "소명 성공 가능성 (0~100)" },
                        keyClause: { type: "string", example: "약관 제7조...", description: "핵심 반박 근거" },
                        message: { type: "string", example: "안녕하세요...", description: "소명 메시지" },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "파일 없음 또는 PDF가 아닌 파일",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string", example: "파일이 없습니다" },
                      },
                    },
                  },
                },
              },
              "500": {
                description: "Claude API 호출 실패",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string", example: "Claude API 호출 실패" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};