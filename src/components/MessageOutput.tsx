"use client";

import { useState } from "react";

type Props = {
  message: string;
};

export default function MessageOutput({ message }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-[#141720] border border-[#252a3a] rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-[#1c2030] border-b border-[#252a3a]">
        <span>✉️</span>
        <h3 className="text-sm font-bold text-[#e8eaf0] flex-1">
          보험사 담당자에게 보낼 소명 메시지
        </h3>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            copied
              ? "bg-[rgba(79,247,160,0.12)] border-[rgba(79,247,160,0.3)] text-[#4ff7a0]"
              : "bg-[rgba(79,142,247,0.12)] border-[rgba(79,142,247,0.25)] text-[#4f8ef7] hover:bg-[rgba(79,142,247,0.2)]"
          }`}
        >
          {copied ? "✅ 복사됨" : "복사하기"}
        </button>
      </div>

      {/* 메시지 본문 */}
      <div className="p-5 text-sm text-[#e8eaf0] leading-loose whitespace-pre-wrap">
        {message}
      </div>
    </div>
  );
}