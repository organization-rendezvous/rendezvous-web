const SOURCE_ICONS = {
  official: '🏢',
  rss: '📡',
  news: '📰',
  reddit: '🔴',
  youtube: '▶',
  github: '⚙',
}

export function LinkCard({ link }) {
  const timeAgo = (iso) => {
    if (!iso) return null
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return '방금'
    if (h < 24) return `${h}시간 전`
    return `${Math.floor(h / 24)}일 전`
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-bg-card border border-bg-border hover:border-yellow-primary/40 hover:bg-bg-elevated transition-all duration-150 group"
    >
      <div className="flex items-start gap-2">
        <span className="text-base mt-0.5 shrink-0">{SOURCE_ICONS[link.source_type] ?? '🔗'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary group-hover:text-yellow-text transition-colors line-clamp-2 leading-snug">
            {link.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-text-muted">{link.source_name}</span>
            {link.published_at && (
              <span className="text-[10px] text-text-muted">{timeAgo(link.published_at)}</span>
            )}
            {link.credibility_score && (
              <span className="text-[10px] text-yellow-dim">신뢰도 {link.credibility_score.toFixed(0)}</span>
            )}
          </div>
          {link.summary && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{link.summary}</p>
          )}
        </div>
      </div>
    </a>
  )
}