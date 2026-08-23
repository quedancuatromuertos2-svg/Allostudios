/**
 * AlloStudios brand logo — faithful recreation of the official mark:
 * • A-shape: two diagonal strokes meeting at a rounded peak, no crossbar
 * • Audio wave: 5 vertical bars inside the A (short › medium › tall › medium › short)
 * • Wordmark: "Allo" semibold + "Studios" medium — same ink color, no accent
 */

interface LogoMarkProps {
  size?: number
  className?: string
  color?: string
}

export function LogoMark({ size = 32, className = '', color = 'currentColor' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-label="AlloStudios mark"
    >
      {/* Left leg of the A */}
      <path
        d="M24 5 L4 43"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leg of the A */}
      <path
        d="M24 5 L44 43"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Audio bars inside the A — short | medium | tall | medium | short */}
      {/* Bar 1 — leftmost, shortest */}
      <line
        x1="16" y1="40"
        x2="16" y2="35"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Bar 2 — medium */}
      <line
        x1="20" y1="40"
        x2="20" y2="30"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Bar 3 — center, tallest */}
      <line
        x1="24" y1="40"
        x2="24" y2="23"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Bar 4 — medium */}
      <line
        x1="28" y1="40"
        x2="28" y2="30"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Bar 5 — rightmost, shortest */}
      <line
        x1="32" y1="40"
        x2="32" y2="35"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Compact icon — used in nav, favicon, app icon contexts */
export function LogoIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-ink ${className}`}
      style={{ width: size, height: size }}
    >
      <LogoMark size={Math.round(size * 0.72)} color="white" />
    </div>
  )
}

/** Full logo: mark + wordmark */
export function LogoFull({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28
  const textSize = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} className="text-ink shrink-0" />
      <span className={`${textSize} tracking-[-0.03em] text-ink select-none`}>
        <span className="font-semibold">Allo</span>
        <span className="font-normal">Studios</span>
      </span>
    </div>
  )
}

/** White version — for dark backgrounds */
export function LogoFullWhite({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28
  const textSize = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} color="white" className="shrink-0" />
      <span className={`${textSize} tracking-[-0.03em] text-white select-none`}>
        <span className="font-semibold">Allo</span>
        <span className="font-normal">Studios</span>
      </span>
    </div>
  )
}
