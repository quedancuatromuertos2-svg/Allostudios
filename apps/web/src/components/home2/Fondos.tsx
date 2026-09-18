'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

/*  Fondos de cada capítulo, ligados al scroll de la sección (progreso 0→1). Cada pack tiene
    el suyo, en su estilo:

    ESTÁNDAR (papel): rejilla de puntos que se mueve en parallax y dos luces suaves que
    derivan. Calma, orden, "que te encuentren".

    PRO (grafito): dos haces de luz que giran despacio y una franja de luz que barre la
    pantalla al bajar. Escena de noche, la luz que sí contesta.

    MAX (cinematográfico): la palabra MAX vista desde abajo, en metal cálido con brillo
    que recorre las letras, reflejo en el suelo y grano. Crece con el scroll hasta llenar
    el recuadro.                                                                          */

const GRANO = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>")`

export function FondoEstandar({ progreso }: { progreso: MotionValue<number> }) {
  const rejY = useTransform(progreso, [0, 1], ['0%', '-12%'])
  const luz1 = useTransform(progreso, [0, 1], ['-10%', '30%'])
  const luz2 = useTransform(progreso, [0, 1], ['40%', '-20%'])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <motion.div style={{ y: rejY, backgroundImage: 'radial-gradient(rgba(24,24,27,.16) 1px, transparent 1.2px)', backgroundSize: '26px 26px' }}
        className="absolute -inset-[15%]" />
      <motion.div style={{ y: luz1 }} className="absolute -left-[10%] top-[10%] w-[55vw] h-[55vw] rounded-full"
        // luz cálida, tenue
        aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(255,176,122,.55), rgba(255,143,184,.25) 50%, transparent 72%)', filter: 'blur(40px)' }} />
      </motion.div>
      <motion.div style={{ y: luz2 }} className="absolute -right-[12%] top-[30%] w-[48vw] h-[48vw] rounded-full">
        <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(201,194,255,.6), rgba(180,168,255,.2) 50%, transparent 72%)', filter: 'blur(50px)' }} />
      </motion.div>
      <div className="absolute inset-0 opacity-[.35] mix-blend-multiply" style={{ backgroundImage: GRANO }} />
    </div>
  )
}

export function FondoPro({ progreso }: { progreso: MotionValue<number> }) {
  // La luz «haz» de la marca (el triángulo que baja del cielo): parallax lento, escala sutil y una
  // franja de luz que barre la pantalla. Nada sintético encima: la imagen ya es el fondo.
  const y = useTransform(progreso, [0, 1], ['-6%', '6%'])
  const esc = useTransform(progreso, [0, 1], [1.08, 1.18])
  const barrido = useTransform(progreso, [0.15, 0.85], ['-20%', '120%'])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-clip" aria-hidden style={{ background: '#0b0b10' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ y, scale: esc, backgroundImage: 'url(/marca/luces/haz.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }} className="absolute -inset-[8%] opacity-[.92]" />
        <motion.div style={{ top: barrido }} className="absolute inset-x-0 h-[18vh]">
          <div className="w-full h-full" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.07) 50%, transparent)', filter: 'blur(4px)' }} />
        </motion.div>
        <div className="absolute inset-0 opacity-[.22] mix-blend-overlay" style={{ backgroundImage: GRANO }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.82) 0%, rgba(11,11,16,.25) 30%, rgba(11,11,16,.45) 65%, rgba(11,11,16,.94) 100%)' }} />
      </div>
    </div>
  )
}

export function FondoMax({ progreso, palabra }: { progreso: MotionValue<number>; palabra: string }) {
  // Nace del título (pequeña, tumbada, donde estaba «Max.»), se levanta y crece hasta llenar el recuadro.
  const escala = useTransform(progreso, [0.11, 0.42, 0.95], [0.4, 1, 1.03])
  const giro = useTransform(progreso, [0.11, 0.5], [58, 4])
  const y = useTransform(progreso, [0.11, 0.95], ['6%', '-22%'])
  // Nace cuando el título ya se ha ido del todo; cuando el mosaico y la caja pasan por encima, baja a un quinto
  const opacidad = useTransform(progreso, [0.115, 0.19, 0.3, 0.4, 1], [0, 1, 1, 0.22, 0.16])
  const barridoY = useTransform(progreso, [0.12, 0.6], ['-10%', '110%'])
  const brillo = useTransform(progreso, [0.1, 0.9], ['120%', '-20%'])
  const metal = {
    background: 'linear-gradient(180deg, #FFF1E6 0%, #FFCFAE 18%, #FF9A5C 36%, #8E3A1F 50%, #FFB07A 58%, #C9542A 74%, #3A1610 100%)',
    WebkitBackgroundClip: 'text', color: 'transparent',
  } as const
  return (
    <div className="absolute inset-0 pointer-events-none overflow-clip" aria-hidden style={{ background: 'radial-gradient(120% 70% at 50% 100%, #2a0f0a 0%, #120b0e 55%, #0b0b10 100%)' }}>
      {/* luz volumétrica de fondo */}
      <motion.div animate={{ opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0" style={{ background: 'radial-gradient(55% 40% at 50% 60%, rgba(255,122,42,.45), rgba(255,79,163,.12) 55%, transparent 75%)' }} />
      {/* escenario con perspectiva: pegado a la pantalla mientras dura el capítulo */}
      <div className="sticky top-0 h-screen w-full flex items-start justify-center overflow-hidden" style={{ perspective: '760px' }}>
        <motion.div style={{ scale: escala, rotateX: giro, y, opacity: opacidad, transformOrigin: '50% 100%' }}
          className="relative mt-[2vh] md:mt-[4vh] font-display font-semibold leading-none tracking-[-0.07em] select-none whitespace-nowrap">
          {/* sombra proyectada */}
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ color: 'rgba(0,0,0,.55)', transform: 'translateY(2.5%) scaleY(.96)', filter: 'blur(14px)' }}>{palabra}</span>
          {/* metal */}
          <span className="relative block text-[46vw] md:text-[40vw]" style={metal}>{palabra}</span>
          {/* brillo que recorre las letras */}
          <motion.span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ backgroundImage: 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,.8) 50%, transparent 60%)', backgroundSize: '300% 100%', backgroundPositionX: brillo, backgroundRepeat: 'no-repeat', WebkitBackgroundClip: 'text', color: 'transparent', mixBlendMode: 'screen' }}>{palabra}</motion.span>
          {/* tecnológico: contorno fino desplazado (como un plano de CAD) y líneas de barrido sobre el metal */}
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.28)', transform: 'translate(-.6%, -1.2%)' }}>{palabra}</span>
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,.14) 0 1px, transparent 1px 9px)', WebkitBackgroundClip: 'text', color: 'transparent', mixBlendMode: 'overlay' }}>{palabra}</span>
          <motion.span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,.9) 50%, transparent 100%)', backgroundSize: '100% 12%', backgroundRepeat: 'no-repeat', backgroundPositionY: barridoY, WebkitBackgroundClip: 'text', color: 'transparent', mixBlendMode: 'screen' }}>{palabra}</motion.span>
          {/* reflejo en el suelo */}
          <span className="absolute left-0 right-0 top-full block text-[46vw] md:text-[40vw]" style={{ ...metal, transform: 'scaleY(-.55) translateY(8%)', transformOrigin: '50% 0%', opacity: .28, filter: 'blur(3px)', WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,.9), transparent 60%)', maskImage: 'linear-gradient(180deg, rgba(0,0,0,.9), transparent 60%)' }}>{palabra}</span>
        </motion.div>
      </div>
      {/* suelo: línea de horizonte y niebla */}
      <div className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: 'linear-gradient(180deg, transparent, rgba(11,11,16,.85) 45%, #0b0b10 100%)' }} />
      <div className="absolute inset-0 opacity-[.35] mix-blend-overlay" style={{ backgroundImage: GRANO }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.75) 0%, transparent 22%)' }} />
    </div>
  )
}
