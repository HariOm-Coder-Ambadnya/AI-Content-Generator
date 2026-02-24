// src/components/ContentTypeCard.jsx
export const CONTENT_TYPES = [
  {
    id: 'blog',
    label: 'Blog Post',
    emoji: '✍️',
    desc: 'Long-form articles & essays',
    accent: 'ember',
    accentClass: 'text-ember-400',
    bgClass: 'bg-ember-500/10 border-ember-500/20',
    activeBg: 'bg-ember-500/20 border-ember-400/40',
  },
  {
    id: 'social',
    label: 'Social Caption',
    emoji: '📱',
    desc: 'Scroll-stopping social posts',
    accent: 'frost',
    accentClass: 'text-frost-400',
    bgClass: 'bg-frost-500/10 border-frost-500/20',
    activeBg: 'bg-frost-500/20 border-frost-400/40',
  },
  {
    id: 'marketing',
    label: 'Marketing Copy',
    emoji: '🎯',
    desc: 'Ads, emails & landing pages',
    accent: 'sage',
    accentClass: 'text-sage-400',
    bgClass: 'bg-sage-500/10 border-sage-500/20',
    activeBg: 'bg-sage-500/20 border-sage-400/40',
  },
  {
    id: 'code',
    label: 'Tech Docs',
    emoji: '💻',
    desc: 'Code snippets & documentation',
    accent: 'purple',
    accentClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10 border-purple-500/20',
    activeBg: 'bg-purple-500/20 border-purple-400/40',
  },
]

export default function ContentTypeCard({ type, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-left w-full ${
        selected ? type.activeBg : `${type.bgClass} hover:border-white/20`
      }`}
    >
      <span className="text-2xl leading-none mt-0.5">{type.emoji}</span>
      <div>
        <p className={`font-display font-semibold text-sm ${selected ? type.accentClass : 'text-white/80'}`}>
          {type.label}
        </p>
        <p className="text-white/40 text-xs font-body mt-0.5">{type.desc}</p>
      </div>
      {selected && (
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
          type.accent === 'ember' ? 'bg-ember-400' :
          type.accent === 'frost' ? 'bg-frost-400' :
          type.accent === 'sage' ? 'bg-sage-400' : 'bg-purple-400'
        } animate-pulse`} />
      )}
    </button>
  )
}
