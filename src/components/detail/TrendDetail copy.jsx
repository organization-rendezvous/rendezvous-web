
//보관용
// import { useState, useEffect } from "react";
// import { api } from "../../api/client";
// import { ScoreBar } from "./ScoreBar";
// import { ScoreRadar } from "./ScoreRadar";
// import { LinkCard } from "./LinkCard";

// const SCORE_LABELS = {
//   mention_score: "언급량",
//   trend_momentum_score: "급상승", // growth_score → trend_momentum_score
//   diversity_score: "출처 다양성",
//   influence_score: "영향력",
//   recency_score: "최신성",
//   ai_importance_score: "AI 중요도",
// };

// // 순위 히스토리 미니 그래프
// function RankHistoryChart({ history }) {
//   if (!history || history.length === 0) return null;

//   const maxRank = Math.max(...history.map((h) => h.rank));
//   const chartHeight = 60;
//   const chartWidth = 200;
//   const padX = 12;
//   const padY = 8;

//   const innerW = chartWidth - padX * 2;
//   const innerH = chartHeight - padY * 2;

//   // 점 좌표 계산 (rank가 낮을수록 위)
//   const points = history.map((h, i) => ({
//     x:
//       padX +
//       (history.length === 1 ? innerW / 2 : (i / (history.length - 1)) * innerW),
//     y: padY + ((h.rank - 1) / Math.max(maxRank - 1, 1)) * innerH,
//     ...h,
//   }));

//   const pathD = points
//     .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
//     .join(" ");

//   // 면적 채우기용 path
//   const areaD =
//     pathD +
//     ` L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${chartHeight - padY} Z`;

//   return (
//     <div className="mt-3">
//       <p className="mb-2 section-label">순위 변화</p>
//       <div className="p-4 border bg-bg-card border-bg-border">
//         <svg
//           width={chartWidth}
//           height={chartHeight}
//           viewBox={`0 0 ${chartWidth} ${chartHeight}`}
//           className="overflow-visible"
//         >
//           {/* 면적 */}
//           <path d={areaD} fill="rgba(234,179,8,0.08)" />
//           {/* 선 */}
//           <path
//             d={pathD}
//             fill="none"
//             stroke="rgb(234,179,8)"
//             strokeWidth="1.5"
//             strokeLinejoin="round"
//           />
//           {/* 점 + 툴팁 */}
//           {points.map((p, i) => (
//             <g key={i}>
//               <circle cx={p.x} cy={p.y} r="3" fill="rgb(234,179,8)" />
//               {/* 날짜 레이블 (첫/마지막만) */}
//               {(i === 0 || i === points.length - 1) && (
//                 <text
//                   x={p.x}
//                   y={chartHeight}
//                   textAnchor="middle"
//                   fontSize="8"
//                   fill="rgb(120,120,120)"
//                 >
//                   {p.trend_date?.slice(5)}
//                 </text>
//               )}
//               {/* 순위 레이블 */}
//               <text
//                 x={p.x}
//                 y={p.y - 6}
//                 textAnchor="middle"
//                 fontSize="9"
//                 fill="rgb(234,179,8)"
//                 fontWeight="bold"
//               >
//                 #{p.rank}
//               </text>
//             </g>
//           ))}
//         </svg>
//         {history.length === 1 && (
//           <p className="text-[10px] text-text-muted mt-1">
//             분석 1회 — 데이터가 쌓이면 순위 변화가 표시됩니다
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export function TrendDetail({ trendId, onBack }) {
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     api
//       .getTrend(trendId)
//       .then(setDetail)
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, [trendId]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <span className="text-sm text-text-secondary animate-pulse-slow">
//           불러오는 중...
//         </span>
//       </div>
//     );
//   }

//   if (error || !detail) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <p className="text-sm text-status-error">
//           {error ?? "데이터를 불러올 수 없습니다"}
//         </p>
//         <button
//           onClick={onBack}
//           className="text-xs text-text-secondary hover:text-yellow-primary"
//         >
//           ← 돌아가기
//         </button>
//       </div>
//     );
//   }

//   // is_rising: API에 없으면 trend_momentum_score로 판단
//   const isRising =
//     detail.is_rising ?? (detail.scores?.trend_momentum_score ?? 0) >= 60;

//   return (
//     <div className="max-w-2xl px-6 py-6 mx-auto animate-slide-up">
//       {/* Back */}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-yellow-primary transition-colors mb-6"
//       >
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path d="M19 12H5M12 19l-7-7 7-7" />
//         </svg>
//         목록으로
//       </button>

//       {/* Header */}
//       <div className="flex items-start gap-4 mb-8">
//         <div className="text-lg rank-badge w-11 h-11">{detail.rank}</div>
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-xs font-display text-text-muted">
//               {detail.topic}
//             </span>
//             {isRising && (
//               <span className="text-[10px] font-display font-bold px-1.5 py-0.5 bg-yellow-muted text-yellow-primary border border-yellow-primary/30">
//                 ↑ 급상승
//               </span>
//             )}
//           </div>
//           <h1 className="text-2xl font-bold leading-tight font-display text-text-primary">
//             {detail.title}
//           </h1>
//           <div className="flex items-center gap-3 mt-2">
//             <div className="flex items-center gap-1">
//               <span className="text-lg font-bold text-yellow-primary font-display">
//                 {detail.score.toFixed(1)}
//               </span>
//               <span className="text-xs text-text-muted">점</span>
//             </div>
//             {/* 모멘텀 점수 인라인 표시 */}
//             {detail.scores?.trend_momentum_score != null && (
//               <div className="flex items-center gap-1 text-[10px] text-text-muted font-display">
//                 <span
//                   className={
//                     detail.scores.trend_momentum_score >= 60
//                       ? "text-yellow-primary"
//                       : ""
//                   }
//                 >
//                   ↑ 모멘텀 {detail.scores.trend_momentum_score.toFixed(0)}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Summary */}
//       <section className="mb-8">
//         <p className="mb-3 section-label">요약</p>
//         <div className="p-4 border bg-bg-card border-bg-border">
//           <p className="text-sm leading-relaxed text-text-primary">
//             {detail.summary}
//           </p>
//           {detail.detail_summary && (
//             <p className="mt-2 text-sm leading-relaxed text-text-secondary">
//               {detail.detail_summary}
//             </p>
//           )}
//         </div>
//       </section>

//       {/* AI 한마디 */}
//       {detail.ai_comment && (
//         <section className="mb-8">
//           <p className="mb-3 section-label">AI 한마디</p>
//           <div className="py-1 pl-4 border-l-2 border-yellow-primary">
//             <p className="text-sm italic leading-relaxed text-text-secondary">
//               {detail.ai_comment}
//             </p>
//           </div>
//         </section>
//       )}

//       {/* Keywords */}
//       {detail.keywords?.length > 0 && (
//         <section className="mb-8">
//           <p className="mb-3 section-label">키워드</p>
//           <div className="flex flex-wrap gap-2">
//             {detail.keywords.map((kw) => (
//               <span
//                 key={kw}
//                 className="px-2 py-1 text-xs transition-colors border border-bg-border text-text-secondary font-display hover:border-yellow-primary/40 hover:text-yellow-text"
//               >
//                 {kw}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Score breakdown */}
//       {detail.scores && (
//         <section className="mb-8">
//           <p className="mb-3 section-label">점수 상세</p>
//           <div className="p-4 border bg-bg-card border-bg-border">
//             <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
//               <div className="w-full sm:w-[200px] shrink-0 flex justify-center">
//                 <ScoreRadar scores={detail.scores} />
//               </div>
//               <div className="flex flex-col justify-center flex-1 w-full gap-3">
//                 {Object.entries(SCORE_LABELS).map(([key, label]) => (
//                   <ScoreBar
//                     key={key}
//                     label={label}
//                     value={detail.scores[key] ?? 0}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 순위 히스토리 그래프 */}
//           <RankHistoryChart history={detail.rank_history} />
//         </section>
//       )}

//       {/* Links */}
//       {detail.links?.length > 0 && (
//         <section className="mb-8">
//           <p className="mb-3 section-label">
//             관련 자료 · {detail.links.length}
//           </p>
//           <div className="flex flex-col gap-px bg-bg-border">
//             {detail.links.map((link, i) => (
//               <LinkCard key={i} link={link} />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
