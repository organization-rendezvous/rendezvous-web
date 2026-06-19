const AXES = [
  { key: "mention_score", label: "언급량" },
  { key: "ai_importance_score", label: "AI 중요도" },
  { key: "influence_score", label: "영향력" },
  { key: "recency_score", label: "최신성" },
  { key: "diversity_score", label: "출처 다양성" },
  { key: "trend_momentum_score", label: "급상승" },
];

const CX = 160;
const CY = 150;
const R = 100;
const LEVELS = 4;

function polarToXY(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function pointsStr(pts) {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

export function ScoreRadar({ scores }) {
  const n = AXES.length;
  const angleStep = 360 / n;

  // Grid polygons
  const gridPolygons = Array.from({ length: LEVELS }, (_, i) => {
    const r = (R * (i + 1)) / LEVELS;
    const pts = AXES.map((_, idx) => polarToXY(idx * angleStep, r));
    return pointsStr(pts);
  });

  // Axis lines
  const axisLines = AXES.map((_, idx) => {
    const end = polarToXY(idx * angleStep, R);
    return { x1: CX, y1: CY, x2: end.x, y2: end.y };
  });

  // Data polygon
  const dataPoints = AXES.map((axis, idx) => {
    const val = Math.min(scores?.[axis.key] ?? 0, 100);
    return polarToXY(idx * angleStep, (R * val) / 100);
  });
  const dataStr = pointsStr(dataPoints);

  // Labels — push them slightly beyond R
  const labelOffset = 22;
  const labels = AXES.map((axis, idx) => {
    const pos = polarToXY(idx * angleStep, R + labelOffset);
    // nudge anchor based on position
    let anchor = "middle";
    if (pos.x < CX - 10) anchor = "end";
    else if (pos.x > CX + 10) anchor = "start";
    return { ...pos, label: axis.label, anchor };
  });

  return (
    <svg
      viewBox={`0 0 320 300`}
      width="100%"
      style={{ maxWidth: 320 }}
      aria-hidden="true"
    >
      {/* Grid rings */}
      {gridPolygons.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="#242424"
          strokeWidth="1"
        />
      ))}

      {/* Axis spokes */}
      {axisLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#242424"
          strokeWidth="1"
        />
      ))}

      {/* Data fill */}
      <polygon
        points={dataStr}
        fill="#F5C51822"
        stroke="#F5C518"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#F5C518" />
      ))}

      {/* Level value labels (innermost = 25, outermost = 100) */}
      {Array.from({ length: LEVELS }, (_, i) => {
        const r = (R * (i + 1)) / LEVELS;
        const pos = polarToXY(0, r);
        return (
          <text
            key={i}
            x={pos.x + 4}
            y={pos.y - 3}
            fontSize="8"
            fill="#444"
            fontFamily="Inter, sans-serif"
          >
            {(i + 1) * 25}
          </text>
        );
      })}

      {/* Axis labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor={l.anchor}
          dominantBaseline="middle"
          fontSize="10"
          fill="#888"
          fontFamily="Space Grotesk, sans-serif"
        >
          {l.label}
        </text>
      ))}

      {/* Center score */}
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#F5C518"
        fontFamily="Space Grotesk, sans-serif"
      >
        {(scores?.final_score ?? 0).toFixed(1)}
      </text>
      <text
        x={CX}
        y={CY + 10}
        textAnchor="middle"
        fontSize="9"
        fill="#444"
        fontFamily="Inter, sans-serif"
      >
        최종점수
      </text>
    </svg>
  );
}
