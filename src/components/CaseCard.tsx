import type { InsuranceCase } from "../lib/dummyData";

type Props = {
  data: InsuranceCase;
};

export default function CaseCard({ data }: Props) {
  return (
    <div className="bg-[#141720] border border-[#252a3a] rounded-2xl p-6 mb-6 relative overflow-hidden">
      {/* 상단 빨간 라인 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f74f6a] to-transparent" />

      {/* 헤더 */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 bg-[rgba(247,79,106,0.12)] border border-[rgba(247,79,106,0.3)] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
          ⛔
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#e8eaf0]">
            보험금 지급 거절 건
          </h2>
          <p className="text-sm text-[#8890a8] mt-0.5">
            {data.insurer} · {data.product}
          </p>
        </div>
        <span className="bg-[rgba(247,79,106,0.12)] border border-[rgba(247,79,106,0.3)] text-[#f74f6a] text-xs font-bold px-3 py-1.5 rounded-full">
          지급 거절
        </span>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "청구일", value: data.visitDate },
          {
            label: "청구 금액",
            value: `${data.amount.toLocaleString()}원`,
            highlight: true,
          },
          {
            label: "진단 코드",
            value: `${data.diagnosis} (${data.diagnosisName})`,
          },
          { label: "병원", value: data.hospital },
          { label: "가입 상품", value: data.product },
          { label: "보험사", value: data.insurer },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#1c2030] border border-[#252a3a] rounded-xl p-3"
          >
            <p className="text-[11px] text-[#4a5068] uppercase tracking-wide mb-1">
              {item.label}
            </p>
            <p
              className={`text-sm font-semibold ${
                item.highlight ? "text-[#f7c44f]" : "text-[#e8eaf0]"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* 거절 사유 */}
      <div className="bg-[rgba(247,79,106,0.06)] border border-[rgba(247,79,106,0.2)] rounded-xl p-4">
        <p className="text-[11px] text-[#f74f6a] uppercase tracking-wide mb-2 flex items-center gap-1.5">
          ⚠ 보험사 거절 사유
        </p>
        <p className="text-sm text-[#8890a8] leading-relaxed">
          {data.rejectionReason}
        </p>
      </div>
    </div>
  );
}