// src/components/ContentTypeCard.jsx
export const CONTENT_TYPES = [
  {
    id: 'blog',
    label: 'Insight Archive',
    desc: 'Long-form neural artifacts'
  },
  {
    id: 'social',
    label: 'Viral Sequence',
    desc: 'Social engagement nodes'
  },
  {
    id: 'marketing',
    label: 'Market Logic',
    desc: 'Conversion optimized strings'
  },
  {
    id: 'code',
    label: 'Logic Schema',
    desc: 'Technical documentation'
  },
]

export default function ContentTypeCard({ type, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(type.id)}
      className={`relative group flex items-start gap-5 p-6 rounded-3xl border transition-all duration-700 text-left w-full h-full glass-panel overflow-hidden ${
        selected 
          ? 'border-accent-blue/40 bg-accent-blue/[0.05] shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]' 
          : 'border-white/5 hover:border-white/20'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-all duration-700 ${
        selected ? 'bg-accent-blue text-white' : 'bg-white/5 text-white/20'
      }`}>
        <Box className="w-6 h-6" />
      </div>
      <div className="flex-1 relative z-10">
        <p className={`font-serif text-lg leading-tight ${selected ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
          {type.label}
        </p>
        <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${selected ? 'text-accent-blue/60' : 'text-white/10 group-hover:text-white/20'}`}>
          {type.desc}
        </p>
      </div>

      {selected && (
         <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-3xl -z-10" />
      )}
    </button>
  )
}

