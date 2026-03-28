// src/components/ContentTypeCard.jsx
export const CONTENT_TYPES = [
  {
    id: 'blog',
    label: 'Blog Post',
    emoji: '✍️',
    desc: 'Long-form articles & essays',
    accentClass: 'text-primary',
    bgClass: 'bg-white border-border shadow-sm',
    activeBg: 'bg-primary text-white border-primary shadow-xl',
  },
  {
    id: 'social',
    label: 'Social Caption',
    emoji: '📱',
    desc: 'Scroll-stopping social posts',
    accentClass: 'text-primary',
    bgClass: 'bg-white border-border shadow-sm',
    activeBg: 'bg-primary text-white border-primary shadow-xl',
  },
  {
    id: 'marketing',
    label: 'Marketing Copy',
    emoji: '🎯',
    desc: 'Ads, emails & landing pages',
    accentClass: 'text-primary',
    bgClass: 'bg-white border-border shadow-sm',
    activeBg: 'bg-primary text-white border-primary shadow-xl',
  },
  {
    id: 'code',
    label: 'Tech Docs',
    emoji: '💻',
    desc: 'Code snippets & documentation',
    accentClass: 'text-primary',
    bgClass: 'bg-white border-border shadow-sm',
    activeBg: 'bg-primary text-white border-primary shadow-xl',
  },
]

export default function ContentTypeCard({ type, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`relative group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 text-left w-full h-full ${
        selected 
          ? 'bg-black text-white border-black shadow-xl scale-[1.03]' 
          : 'bg-white text-foreground border-border shadow-md hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-colors ${
        selected ? 'bg-white/10' : 'bg-muted group-hover:bg-muted/80'
      }`}>
        {type.emoji}
      </div>
      <div className="flex-1">
        <p className={`font-display font-bold text-base leading-tight ${selected ? 'text-white' : 'text-foreground'}`}>
          {type.label}
        </p>
        <p className={`text-xs mt-1.5 leading-relaxed ${selected ? 'text-white/60' : 'text-muted-foreground'}`}>
          {type.desc}
        </p>
      </div>
    </button>
  )
}
