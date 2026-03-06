"use client";

import { useState } from "react";
import { DUMMY_CASES, InsuranceCase } from "@/lib/dummyData";
import CaseCard from "@/components/CaseCard";
import AnalysisResult from "@/components/AnalysisResult";
import MessageOutput from "@/components/MessageOutput";

type AnalysisData = {
  winRate: number;
  keyClause: string;
  message: string;
};

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<InsuranceCase | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectCase = async (item: InsuranceCase) => {
    setSelectedCase(item);
    setAnalysis(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error("분석 요청 실패");

      const data: AnalysisData = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: 40,
        backgroundColor: "#0d1017",
        minHeight: "100vh",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#e8eaf0", marginBottom: 8 }}>보험 보장 분석 데모</h1>
      <p style={{ color: "#4a5068", fontSize: 14, marginBottom: 32 }}>
        거절 케이스를 선택하면 AI가 소명 전략을 분석합니다
      </p>

      {/* 케이스 선택 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {DUMMY_CASES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectCase(item)}
            disabled={loading}
            style={{
              textAlign: "left",
              background: selectedCase?.id === item.id ? "rgba(247,79,106,0.12)" : "#141720",
              border: selectedCase?.id === item.id ? "1px solid rgba(247,79,106,0.4)" : "1px solid #252a3a",
              borderRadius: 12,
              padding: "14px 20px",
              color: "#e8eaf0",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: loading && selectedCase?.id !== item.id ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            [{item.insurer}] {item.diagnosisName} ({item.diagnosis}) — {item.amount.toLocaleString()}원
          </button>
        ))}
      </div>

      {/* 선택된 케이스 카드 */}
      {selectedCase && (
        <>
          <CaseCard data={selectedCase} />

          {/* 로딩 */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#4a5068", fontSize: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚙️</div>
              AI가 약관 및 유사 판례를 분석 중입니다...
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div style={{
              padding: "16px 20px",
              background: "rgba(247,79,106,0.08)",
              border: "1px solid rgba(247,79,106,0.3)",
              borderRadius: 12,
              color: "#f74f6a",
              fontSize: 14,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {/* 분석 결과 */}
          {analysis && !loading && (
            <>
              <AnalysisResult winRate={analysis.winRate} keyClause={analysis.keyClause} />
              <MessageOutput message={analysis.message} />
            </>
          )}
        </>
      )}
    </main>
  );
}