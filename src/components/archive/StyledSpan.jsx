export default function StyledSpan({ chunk, COLOR_MAP }) {
  const styles = chunk.styles ?? [];
  const isBold = styles.some((s) => s.style_type === "bold");
  const isUnderline = styles.some((s) => s.style_type === "underline");
  const highlight = styles.find((s) => s.style_type === "highlight");
  const color = styles.find((s) => s.style_type === "color");

  const style = {
    fontWeight: isBold ? 700 : undefined,
    textDecoration: isUnderline ? "underline" : undefined,
    backgroundColor: chunk.isHovered
      ? "rgba(245,197,24,0.25)"
      : highlight
        ? (COLOR_MAP[highlight.style_value] ?? highlight.style_value) + "64"
        : undefined,
    color: color
      ? (COLOR_MAP[color.style_value] ?? color.style_value)
      : undefined,
    outline: chunk.isHovered ? "1px solid rgba(245,197,24,0.5)" : undefined,
  };

  return <span style={style}>{chunk.text}</span>;
}
