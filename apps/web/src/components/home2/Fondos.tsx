'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

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
  // La luz «haz» de la marca (el triángulo), tratada como una escena: parallax lento, respiración, un foco
  // que barre y velos muy largos (nada corta en seco). Encima, grano fino y una bruma abajo para asentar.
  const y = useTransform(progreso, [0, 1], ['-5%', '5%'])
  const esc = useTransform(progreso, [0, 1], [1.06, 1.16])
  const barrido = useTransform(progreso, [0.1, 0.9], ['-30%', '130%'])
  const focoX = useTransform(progreso, [0, 1], ['-8%', '8%'])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-clip" aria-hidden style={{ background: '#0b0b10' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* la luz de la marca */}
        <motion.div style={{ y, scale: esc, backgroundImage: 'url(/marca/luces/haz.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 32%' }} className="absolute -inset-[8%]" />
        {/* respiración: la luz sube y baja de intensidad muy despacio */}
        <motion.div animate={{ opacity: [0.0, 0.22, 0.0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0" style={{ background: 'radial-gradient(40% 45% at 50% 30%, rgba(255,255,255,.35), transparent 70%)' }} />
        {/* foco que se desplaza con el scroll: un halo violeta que cruza la escena */}
        <motion.div style={{ x: focoX }} className="absolute inset-0" >
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[70vw] h-[60vh] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(91,91,214,.28), rgba(255,79,163,.1) 55%, transparent 75%)', filter: 'blur(50px)' }} />
        </motion.div>
        {/* franja de luz que barre */}
        <motion.div style={{ top: barrido }} className="absolute inset-x-0 h-[22vh]">
          <div className="w-full h-full" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.05) 50%, transparent)', filter: 'blur(10px)' }} />
        </motion.div>
        {/* grano fino */}
        <div className="absolute inset-0 opacity-[.16] mix-blend-overlay" style={{ backgroundImage: GRANO }} />
        {/* velos largos: nada corta en seco. Arriba para el titular, abajo para asentar la caja de compra */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.9) 0%, rgba(11,11,16,.62) 12%, rgba(11,11,16,.28) 28%, rgba(11,11,16,.14) 45%, rgba(11,11,16,.3) 62%, rgba(11,11,16,.6) 80%, rgba(11,11,16,.95) 100%)' }} />
        {/* bruma lateral: oscurece los bordes para que la luz se lea en el centro */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,11,16,.55) 0%, rgba(11,11,16,0) 28%, rgba(11,11,16,0) 72%, rgba(11,11,16,.55) 100%)' }} />
      </div>
    </div>
  )
}

export function FondoMax(props: { progreso: MotionValue<number>; palabra: string }) {
  // En móvil el capítulo es altísimo (todo apilado), así que el mismo progreso 0→1 cubre muchos más
  // píxeles: la palabra tardaba una pantalla entera en empezar a moverse. Se usan tramos más cortos.
  const [movil, setMovil] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)')
    const f = () => setMovil(m.matches)
    f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f)
  }, [])
  return <FondoMaxEscena key={movil ? 'm' : 'd'} movil={movil} {...props} />
}

function FondoMaxEscena({ progreso, palabra, movil }: { progreso: MotionValue<number>; palabra: string; movil: boolean }) {
  // Un solo MAX. Al entrar (progreso ≈ 0,1: la sección ocupa la pantalla) es un titular plano bajo el
  // subtítulo; al bajar se inclina hacia atrás, crece hasta llenar el recuadro y se queda pegado a la
  // pantalla mientras dura el capítulo. Cuando el mosaico y la caja pasan por encima, baja a un quinto.
  const k = movil ? 0.42 : 1 // en móvil todo ocurre en menos de la mitad del recorrido
  const escala = useTransform(progreso, [0.06 * k, 0.16 * k, 0.42 * k, 0.95], [movil ? 0.5 : 0.27, movil ? 0.55 : 0.3, 1, 1.03])
  const giro = useTransform(progreso, [0.14 * k, 0.24 * k, 0.5 * k], [0, 55, 4])
  const y = useTransform(progreso, [0.06 * k, 0.16 * k, 0.5 * k, 0.95], ['0%', '0%', '-14%', '-24%'])
  const opacidad = useTransform(progreso, [0, 0.04 * k, 0.3 * k, 0.4 * k, 1], [0, 1, 1, 0.22, 0.16])
  const brillo = useTransform(progreso, [0.16 * k, 0.9], ['120%', '-20%'])
  // Diseño «Apple»: titanio pulido, monocromo, con la luz de la marca solo como reflejo ambiental.
  // Nada de cromo naranja ni líneas técnicas: superficie limpia, un brillo que la recorre y un reflejo suave.
  // Naranja anodizado (el naranja de la marca tratado como el titanio de Apple): claro arriba, denso en el canto
  const titanio = {
    background: 'linear-gradient(180deg, #FFE3CF 0%, #FFC29A 16%, #FF8F4A 38%, #C8491A 52%, #FFA366 64%, #E2622A 82%, #6A2410 100%)',
    WebkitBackgroundClip: 'text', color: 'transparent',
  } as const
  return (
    <div className="absolute inset-0 pointer-events-none overflow-clip" aria-hidden style={{ background: 'radial-gradient(120% 70% at 50% 100%, #15131b 0%, #0c0c11 55%, #0b0b10 100%)' }}>
      {/* luz ambiental de la marca, muy tenue, que respira */}
      <motion.div animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0" style={{ background: 'radial-gradient(45% 32% at 42% 52%, rgba(255,122,42,.32), transparent 70%), radial-gradient(40% 30% at 62% 48%, rgba(255,79,163,.16), transparent 70%)' }} />
      {/* escenario con perspectiva: pegado a la pantalla mientras dura el capítulo */}
      <div className="sticky top-0 h-screen w-full flex items-start justify-center overflow-hidden" style={{ perspective: '760px' }}>
        <motion.div style={{ scale: escala, rotateX: giro, y, opacity: opacidad, transformOrigin: '50% 0%', fontFamily: 'var(--font-geist-sans), Inter, -apple-system, "SF Pro Display", system-ui, sans-serif' }}
          className="relative mt-[38vh] md:mt-[40vh] font-bold leading-none tracking-[-0.065em] select-none whitespace-nowrap">
          {/* sombra de contacto, suave */}
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ color: 'rgba(0,0,0,.6)', transform: 'translateY(3%) scaleY(.94)', filter: 'blur(18px)' }}>{palabra}</span>
          {/* titanio */}
          <span className="relative block text-[46vw] md:text-[40vw]" style={titanio}>{palabra}</span>
          {/* arista superior: una línea de luz finísima en el borde de las letras */}
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.35)', transform: 'translateY(-.35%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 35%)', maskImage: 'linear-gradient(180deg, #000 0%, transparent 35%)' }}>{palabra}</span>
          {/* brillo que recorre las letras, lento y blanco */}
          <motion.span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ backgroundImage: 'linear-gradient(100deg, transparent 42%, rgba(255,255,255,.55) 50%, transparent 58%)', backgroundSize: '300% 100%', backgroundPositionX: brillo, backgroundRepeat: 'no-repeat', WebkitBackgroundClip: 'text', color: 'transparent', mixBlendMode: 'screen' }}>{palabra}</motion.span>
          {/* reflejo de la marca en la superficie (violeta → naranja), apenas */}
          <span className="absolute inset-0 block text-[46vw] md:text-[40vw]" style={{ background: 'linear-gradient(100deg, rgba(255,255,255,.35) 0%, transparent 45%, rgba(255,79,163,.25) 100%)', WebkitBackgroundClip: 'text', color: 'transparent', mixBlendMode: 'soft-light' }}>{palabra}</span>
          {/* reflejo en el suelo */}
          <span className="absolute left-0 right-0 top-full block text-[46vw] md:text-[40vw]" style={{ ...titanio, transform: 'scaleY(-.5) translateY(6%)', transformOrigin: '50% 0%', opacity: .18, filter: 'blur(4px)', WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,.9), transparent 55%)', maskImage: 'linear-gradient(180deg, rgba(0,0,0,.9), transparent 55%)' }}>{palabra}</span>
        </motion.div>
      </div>
      {/* suelo: línea de horizonte y niebla */}
      <div className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: 'linear-gradient(180deg, transparent, rgba(11,11,16,.85) 45%, #0b0b10 100%)' }} />
      <div className="absolute inset-0 opacity-[.35] mix-blend-overlay" style={{ backgroundImage: GRANO }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.75) 0%, transparent 22%)' }} />
    </div>
  )
}
