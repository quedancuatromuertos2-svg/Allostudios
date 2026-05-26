export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 5 L4 43" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M24 5 L44 43" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="15" y1="33" x2="15" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="19.5" y1="27" x2="19.5" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="24" y1="22" x2="24" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="28.5" y1="27" x2="28.5" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="33" y1="33" x2="33" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  )
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={28} />
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
        Allo<span className="text-accent">Studios</span>
      </span>
    </div>
  )
}
