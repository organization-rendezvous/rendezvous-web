//보관용

// import { useState } from "react";
// import { useMdExport } from "../../hooks/useMdExport";
// import { MdSettingsModal } from "./MdSettingsModal";

// const DEFAULT_SETTINGS = {
//   fileName: `daily-briefing-${new Date().toISOString().slice(0, 10)}`,
//   savePath: "~/Downloads",
//   sections: ["개발", "AI", "사회", "국제"],
// };

// const TOPIC_STATUS_LABEL = {
//   pending: "대기",
//   running: "처리 중",
//   completed: "완료",
//   failed: "실패",
// };

// function ProgressBar({ value }) {
//   return (
//     <div className="w-full h-0.5 bg-bg-border overflow-hidden">
//       <div
//         className="h-full transition-all duration-500 bg-yellow-primary"
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   );
// }

// export function MdExportPanel({ onClose }) {
//   const {
//     phase,
//     progress,
//     topics,
//     fileName,
//     downloadUrl,
//     error,
//     startExport,
//     reset,
//   } = useMdExport();
//   const [mdSettings, setMdSettings] = useState(DEFAULT_SETTINGS);
//   const [showSettings, setShowSettings] = useState(false);

//   const handleExport = () => {
//     console.log("HANDLE EXPORT CALLED", {
//       mdSettings,
//       type: typeof mdSettings,
//     });

//     startExport({
//       enabled_topics: mdSettings.sections ?? [],
//       section_order: mdSettings.sections ?? [],
//       result_limit: mdSettings.result_limit ?? 5,
//       include_summary: mdSettings.include_summary ?? true,
//       include_detail_summary: mdSettings.include_detail_summary ?? true,
//       include_keywords: mdSettings.include_keywords ?? true,
//       include_links: mdSettings.include_links ?? true,
//       file_name_pattern: mdSettings.fileName,
//       timezone: "Asia/Seoul",
//       save_path: mdSettings.savePath,
//     });
//   };

//   const BUTTON_CONFIG = {
//     idle: {
//       label: "MD 생성",
//       action: handleExport,
//       style: "bg-yellow-primary text-bg-base hover:bg-yellow-text",
//     },
//     loading: {
//       label: "준비 중…",
//       action: null,
//       style: "bg-bg-elevated text-text-muted cursor-not-allowed",
//     },
//     generating: {
//       label: `생성 중 (${Math.round(progress)}%)`,
//       action: null,
//       style: "bg-bg-elevated text-text-muted cursor-not-allowed",
//     },
//     ready: {
//       label: "다운로드",
//       action: null,
//       style: "bg-status-success text-bg-base hover:opacity-90",
//     },
//     error: {
//       label: "다시 시도",
//       action: () => {
//         reset();
//         handleExport();
//       },
//       style:
//         "bg-status-error/20 text-status-error border border-status-error/40 hover:bg-status-error/30",
//     },
//   };

//   const btn = BUTTON_CONFIG[phase];

//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-base/95 backdrop-blur-sm animate-fade-in">
//         <div className="max-w-md px-6 py-8 mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-lg font-bold font-display text-text-primary">
//                 MD 생성
//               </h2>
//               <p className="text-xs text-text-muted mt-0.5">
//                 분석 결과를 Markdown 파일로 내보냅니다
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="transition-colors text-text-secondary hover:text-yellow-primary"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M18 6L6 18M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* 현재 설정 미리보기 */}
//           <div className="p-4 mb-4 border bg-bg-card border-bg-border">
//             <div className="flex items-center justify-between mb-3">
//               <span className="section-label">생성 설정</span>
//               {phase === "idle" || phase === "error" ? (
//                 <button
//                   onClick={() => setShowSettings(true)}
//                   className="text-[10px] font-display text-text-secondary hover:text-yellow-primary border border-bg-border hover:border-yellow-primary/40 px-2 py-1 transition-colors"
//                 >
//                   편집
//                 </button>
//               ) : null}
//             </div>
//             <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
//               <div className="flex items-center gap-2">
//                 <span className="text-text-muted w-14 shrink-0">파일명</span>
//                 <span className="text-text-primary font-display">
//                   {mdSettings.fileName}.md
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-text-muted w-14 shrink-0">저장 경로</span>
//                 <span>{mdSettings.savePath}</span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <span className="text-text-muted w-14 shrink-0">섹션</span>
//                 <span>{mdSettings.sections.join(", ")}</span>
//               </div>
//             </div>
//           </div>

//           {/* 진행 상태 */}
//           {(phase === "generating" || phase === "loading") && (
//             <div className="p-4 mb-4 border bg-bg-card border-bg-border animate-fade-in">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="section-label">진행 중</span>
//                 <span className="text-xs font-display text-yellow-primary">
//                   {Math.round(progress)}%
//                 </span>
//               </div>
//               <ProgressBar value={progress} />
//               {topics.length > 0 && (
//                 <div className="flex flex-col gap-2 mt-3">
//                   {topics.map((t) => (
//                     <div
//                       key={t.id ?? t.name}
//                       className="flex items-center justify-between"
//                     >
//                       <span className="text-xs text-text-secondary">
//                         {t.name}
//                       </span>
//                       <div className="flex items-center gap-1.5">
//                         {t.status !== "completed" && t.status !== "failed" && (
//                           <span className="w-1.5 h-1.5 rounded-full bg-yellow-primary animate-pulse-slow" />
//                         )}
//                         <span
//                           className={`text-[10px] font-display ${
//                             t.status === "completed"
//                               ? "text-status-success"
//                               : t.status === "failed"
//                                 ? "text-status-error"
//                                 : "text-yellow-primary"
//                           }`}
//                         >
//                           {TOPIC_STATUS_LABEL[t.status] ?? t.status}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* 완료 상태 */}
//           {phase === "ready" && (
//             <div className="p-4 mb-4 border bg-status-success/5 border-status-success/20 animate-fade-in">
//               <div className="flex items-center gap-2 mb-1">
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   className="text-status-success"
//                 >
//                   <path d="M20 6L9 17l-5-5" />
//                 </svg>
//                 <span className="text-xs font-semibold font-display text-status-success">
//                   생성 완료
//                 </span>
//               </div>
//               <p className="pl-5 text-xs text-text-secondary">{fileName}</p>
//             </div>
//           )}

//           {/* 에러 상태 */}
//           {phase === "error" && error && (
//             <div className="p-4 mb-4 border bg-status-error/5 border-status-error/20 animate-fade-in">
//               <p className="text-xs text-status-error">{error}</p>
//             </div>
//           )}

//           {/* 액션 버튼 */}
//           <div className="flex flex-col gap-2">
//             {phase === "ready" ? (
//               <>
//                 <button
//                   onClick={async () => {
//                     console.log("downloadUrl:", downloadUrl);
//                     try {
//                       const res = await fetch(downloadUrl);
//                       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                       const blob = await res.blob();
//                       const url = URL.createObjectURL(blob);
//                       const a = document.createElement("a");
//                       a.href = url;
//                       a.download = fileName;
//                       document.body.appendChild(a); // ← 추가
//                       a.click();
//                       document.body.removeChild(a); // ← 추가
//                       URL.revokeObjectURL(url);
//                     } catch (e) {
//                       console.error("다운로드 실패:", e);
//                     }
//                   }}
//                   className="block w-full py-3 text-sm font-bold text-center transition-opacity bg-status-success text-bg-base font-display hover:opacity-90"
//                 >
//                   다운로드
//                 </button>
//                 <button
//                   onClick={reset}
//                   className="w-full py-2.5 border border-bg-border text-text-secondary font-display text-xs hover:border-yellow-primary/40 hover:text-text-primary transition-colors"
//                 >
//                   다시 생성
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={btn.action}
//                 disabled={!btn.action}
//                 className={`w-full py-3 font-display font-bold text-sm transition-colors ${btn.style}`}
//               >
//                 {btn.label}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {showSettings && (
//         <MdSettingsModal
//           settings={mdSettings}
//           onChange={setMdSettings}
//           onClose={() => setShowSettings(false)}
//         />
//       )}
//     </>
//   );
// }
