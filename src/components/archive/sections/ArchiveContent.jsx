import EditableStyledBlock from "../EditableStyledBlock";
import EditableKeywords from "../EditableKeywords";
import StyleableText from "../StyleableText";

export function ArchiveContent({
  data,

  summaryRef,
  detailRef,
  aiCommentRef,
  keywordsRef,

  stylesFor,
  hoveredFor,

  onMouseUp,

  onFieldUpdate,
  onKeywordsUpdate,

  COLOR_MAP,
}) {
  return (
    <>
      {data.summary && (
        <EditableStyledBlock
          label="요약"
          sectionKey="summary"
          value={data.summary}
          styles={stylesFor("summary")}
          hoveredComment={hoveredFor("summary")}
          textRef={summaryRef}
          onMouseUp={() => onMouseUp("summary", summaryRef)}
          onSave={(val) => onFieldUpdate("summary", val)}
          COLOR_MAP={COLOR_MAP}
        />
      )}

      {data.detail_summary && (
        <EditableStyledBlock
          label="상세 요약"
          sectionKey="detail"
          value={data.detail_summary}
          styles={stylesFor("detail")}
          hoveredComment={hoveredFor("detail")}
          textRef={detailRef}
          onMouseUp={() => onMouseUp("detail", detailRef)}
          onSave={(val) => onFieldUpdate("detail_summary", val)}
          COLOR_MAP={COLOR_MAP}
        />
      )}

      {data.ai_comment && (
        <EditableStyledBlock
          label="AI 한마디"
          sectionKey="ai"
          value={data.ai_comment}
          styles={stylesFor("ai")}
          hoveredComment={hoveredFor("ai")}
          textRef={aiCommentRef}
          onMouseUp={() => onMouseUp("ai")}
          onSave={(val) => onFieldUpdate("ai_comment", val)}
          renderContent={() => (
            <div className="py-1 pl-4 border-l-2 border-yellow-primary">
              <StyleableText
                text={data.ai_comment}
                styles={stylesFor("ai")}
                hoveredComment={hoveredFor("ai")}
                textRef={aiCommentRef}
                onMouseUp={() => onMouseUp("ai", aiCommentRef)}
                sectionKey="ai"
                COLOR_MAP={COLOR_MAP}
              />
            </div>
          )}
          COLOR_MAP={COLOR_MAP}
        />
      )}

      {data.keywords?.length > 0 && (
        <EditableKeywords
          keywords={data.keywords}
          styles={stylesFor("keywords")}
          hoveredComment={hoveredFor("keywords")}
          textRef={keywordsRef}
          onMouseUp={() => onMouseUp("keywords", keywordsRef)}
          onSave={onKeywordsUpdate}
          COLOR_MAP={COLOR_MAP}
        />
      )}

      {data.links?.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 section-label">관련 자료</p>

          <div className="flex flex-col gap-px bg-bg-border">
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 transition-colors bg-bg-card hover:bg-bg-elevated"
              >
                <p className="text-xs transition-colors text-text-primary hover:text-yellow-text">
                  {link.title}
                </p>

                <p className="text-[10px] text-text-muted mt-0.5">
                  {link.source_name}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
