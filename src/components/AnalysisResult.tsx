"use client";

import { useEffect, useState } from "react";

type Props = {
  winRate: number;
  keyClause: string;
};

export default function AnalysisResult({ winRate, keyClause }: Props) {
  const [displayRate, setDisplayRate] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // 숫자 카운트업 애니메이션
    let current = 0;
    const increment = winRate / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= winRate) {
        setDisplayRate(winRate);
        clearInterval(timer);
      } else {
        setDisplayRate(Math.floor(current));
      }
    }, 30);

    // 바 애니메이션 (살짝 딜레이)
    const barTimer = setTimeout(() => setBarWidth(winRate), 100);

    return () => {
      clearInterval(timer);
      clearTimeout(barTimer);
    };
  }, [winRate]);

  const getColor = (rate: number) => {
    if (rate >= 70) return "#4ff7a0";
    if (rate >= 40) return "#f7c44f";
    return "#f74f6a";
  };

  const color = getColor(winRate);

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {/* 승률 카드 */}
      <div
        className="bg-[#141720] border rounded-2xl p-5"
        style={{ borderColor: `${color}33` }}
      >
        <p className="text-[11px] text-[#4a5068] uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <span>📊</span> 소명 성공 예측
        </p>
        <p
          className="text-4xl font-bold leading-none mb-1.5"
          style={{ color }}
        >
          {displayRate}%
        </p>
        <p className="text-xs text-[#8890a8] mb-3">유사 사례 분석 기반</p>
        <div className="h-1 bg-[#252a3a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${color}, #4f8ef7)`,
            }}
          />
        </div>
      </div>

      {/* 핵심 근거 카드 */}
      <div className="bg-[#141720] border border-[#252a3a] rounded-2xl p-5">
        <p className="text-[11px] text-[#4a5068] uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <span>📌</span> 핵심 반박 근거
        </p>
        <p className="text-sm text-[#e8eaf0] leading-relaxed">{keyClause}</p>
      </div>
    </div>
  );
}