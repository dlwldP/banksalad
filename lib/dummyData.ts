export type InsuranceCase = {
  id: number;
  insurer: string;
  product: string;
  diagnosis: string;
  diagnosisName: string;
  hospital: string;
  amount: number;
  visitDate: string;
  rejectionReason: string;
};

export const DUMMY_CASES: InsuranceCase[] = [
  {
    id: 1,
    insurer: "삼성생명",
    product: "무배당 실손 2023",
    diagnosis: "K29.7",
    diagnosisName: "위염",
    hospital: "서울내과의원",
    amount: 87000,
    visitDate: "2025.11.14",
    rejectionReason:
      "의원급 외래 공제 기준(1만원) 적용 후 잔여 금액이 보장 한도 미만. 동일 질환 2회 이상 청구 시 면책 조항 적용 가능성.",
  },
  {
    id: 2,
    insurer: "KB손해보험",
    product: "KB실손보험 플러스",
    diagnosis: "M54.5",
    diagnosisName: "요통",
    hospital: "강남정형외과",
    amount: 124000,
    visitDate: "2025.10.22",
    rejectionReason:
      "해당 진료는 비급여 도수치료로 분류되며, 가입 특약에 비급여 물리치료 항목이 포함되지 않아 지급 대상 외로 처리.",
  },
  {
    id: 3,
    insurer: "메리츠화재",
    product: "메리츠 The건강보험",
    diagnosis: "J06.9",
    diagnosisName: "급성 상기도 감염",
    hospital: "하나이비인후과",
    amount: 35000,
    visitDate: "2025.12.03",
    rejectionReason:
      "청구 서류 중 진료비 세부내역서 미첨부로 인한 심사 불가. 서류 보완 요청 후 미제출로 자동 거절 처리.",
  },
];