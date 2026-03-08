"use client";

import { useState, useRef } from "react";
import { DUMMY_CASES, InsuranceCase } from "@/lib/dummyData";
import CaseCard from "@/components/CaseCard";
import AnalysisResult from "@/components/AnalysisResult";
import MessageOutput from "@/components/MessageOutput";

type AnalysisData = {
  winRate: number;
  keyClause: string;
  message: string;
};

type FullCaseData = InsuranceCase & AnalysisData;

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<InsuranceCase | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 더미 케이스 선택
  const handleSelectCase = async (item: InsuranceCase) => {
    setSelectedCase(item);
    setAnalysis(null);
    setError(null);
    setUploadedFileName(null);
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

  // PDF 업로드 처리
  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setError("PDF 파일만 업로드 가능합니다.");
      return;
    }

    setSelectedCase(null);
    setAnalysis(null);
    setError(null);
    setUploadedFileName(file.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("업로드 실패");

      const data: FullCaseData = await response.json();

      // 케이스 정보와 분석 결과 분리
      const { winRate, keyClause, message, ...caseInfo } = data;
      setSelectedCase(caseInfo);
      setAnalysis({ winRate, keyClause, message });
    } catch (err) {
      console.error(err);
      setError("PDF 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <main style={{ padding: 40, backgroundColor: "#0d1017", minHeight: "100vh", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ color: "#e8eaf0", marginBottom: 8 }}>보험 보장 분석 데모</h1>
      <p style={{ color: "#4a5068", fontSize: 14, marginBottom: 32 }}>
        거절 케이스를 선택하거나 PDF를 업로드하면 AI가 소명 전략을 분석합니다
      </p>

      {/* PDF 업로드 영역 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? "#4f8ef7" : uploadedFileName ? "rgba(79,247,160,0.4)" : "#252a3a"}`,
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragging ? "rgba(79,142,247,0.06)" : uploadedFileName ? "rgba(79,247,160,0.04)" : "#141720",
          marginBottom: 32,
          transition: "all 0.2s",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
        <div style={{ fontSize: 28, marginBottom: 8 }}>
          {uploadedFileName ? "✅" : "📄"}
        </div>
        <p style={{ color: uploadedFileName ? "#4ff7a0" : "#e8eaf0", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
          {uploadedFileName ? uploadedFileName : "PDF 파일을 드래그하거나 클릭해서 업로드"}
        </p>
        <p style={{ color: "#4a5068", fontSize: 12 }}>
          {uploadedFileName ? "다른 파일을 업로드하려면 클릭하세요" : "보험 거절 통보문, 청구서, 진단서 등"}
        </p>
      </div>

      {/* 구분선 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: "#252a3a" }} />
        <span style={{ color: "#4a5068", fontSize: 12 }}>또는 샘플 케이스 선택</span>
        <div style={{ flex: 1, height: 1, background: "#252a3a" }} />
      </div>

      {/* 더미 케이스 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {DUMMY_CASES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectCase(item)}
            disabled={loading}
            style={{
              textAlign: "left",
              background: selectedCase?.id === item.id && !uploadedFileName ? "rgba(247,79,106,0.12)" : "#141720",
              border: selectedCase?.id === item.id && !uploadedFileName ? "1px solid rgba(247,79,106,0.4)" : "1px solid #252a3a",
              borderRadius: 12,
              padding: "14px 20px",
              color: "#e8eaf0",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: loading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            [{item.insurer}] {item.diagnosisName} ({item.diagnosis}) — {item.amount.toLocaleString()}원
          </button>
        ))}
      </div>

      {/* 결과 영역 */}
      {selectedCase && (
        <>
          <CaseCard data={selectedCase} />

          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#4a5068", fontSize: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚙️</div>
              AI가 문서를 분석 중입니다...
            </div>
          )}

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

          {analysis && !loading && (
            <>
              <AnalysisResult winRate={analysis.winRate} keyClause={analysis.keyClause} />
              <MessageOutput message={analysis.message} />
            </>
          )}
        </>
      )}

      {/* PDF 업로드 후 케이스 없을 때 로딩 */}
      {!selectedCase && loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#4a5068", fontSize: 14 }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⚙️</div>
          PDF를 읽고 분석 중입니다...
        </div>
      )}
    </main>
  );
}