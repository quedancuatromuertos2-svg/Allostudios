/**
 * Logo de AlloStudios (marca de 16/09/2026): una pieza de luz — la luz sube desde la
 * base sobre negro — y el nombre "allostudios" en minúscula, en Outfit 700.
 * La versión con "allo." dentro vive en MARCA-ALLOSTUDIOS/logo; aquí, a tamaño de
 * barra, solo la luz (con palabra no se leería por debajo de 48 px).
 */

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 32, className = '', claro = true }: LogoMarkProps & { claro?: boolean }) {
  // Versión clara (la de la marca, 18/09/2026): la pieza de papel con la luz. Es la que va en la barra y en el favicon.
  if (claro) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/marca/icono-claro-256.png" width={size} height={size} alt="AlloStudios" className={className} style={{ borderRadius: size * 0.27 }} />
  }
  // Pieza redondeada con la luz (Faro) dentro. Sin texto: a este tamaño solo se ve la luz.
  const id = 'allo' + size
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="AlloStudios">
      <defs>
        <clipPath id={id + 'c'}><rect width="100" height="100" rx="27" /></clipPath>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B6CFF" /><stop offset=".7" stopColor="#0B0B10" /></linearGradient>
        <radialGradient id={id + 'l'} cx="50%" cy="100%" r="100%" gradientTransform="translate(0.5 1) scale(0.2 0.92) translate(-0.5 -1)">
          <stop offset="0" stopColor="#FFF1B8" /><stop offset=".28" stopColor="#FF7A2A" /><stop offset=".52" stopColor="#FF4FA3" stopOpacity=".75" /><stop offset=".84" stopColor="#0B0B10" stopOpacity="0" />
        </radialGradient>
        <filter id={id + 'b'} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8.5" /></filter>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="100" height="100" fill="#0B0B10" />
        <g filter={`url(#${id}b)`}><rect x="-22" y="-22" width="144" height="144" fill={`url(#${id}s)`} /><rect x="-22" y="-22" width="144" height="144" fill={`url(#${id}l)`} /></g>
        <rect width="100" height="100" rx="27" fill="none" stroke="rgba(255,255,255,.12)" />
      </g>
    </svg>
  )
}

/** Full logo: mark + wordmark */
export function LogoFull({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28
  const textSize = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} className="shrink-0" />
      <span className={`${textSize} font-logo font-bold tracking-[-0.035em] text-ink select-none`}>allostudios</span>
    </div>
  )
}

/** White version — for dark backgrounds */
export function LogoFullWhite({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 36 : 28
  const textSize = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} className="shrink-0" />
      <span className={`${textSize} font-logo font-bold tracking-[-0.035em] text-white select-none`}>allostudios</span>
    </div>
  )
}
