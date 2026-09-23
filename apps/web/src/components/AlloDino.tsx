/*  allo, la mascota: el allosaurus de Ángel, vectorizado.
    Se pinta como MÁSCARA CSS sobre currentColor, así que coge el color del texto de
    donde esté (grafito sobre papel, claro sobre oscuro) sin duplicar archivos ni meter
    58 KB de trazado en el bundle: el SVG vive en /public y el navegador lo cachea.
    Piezas en MARCA-ALLOSTUDIOS/mascota/ (expresiones/ = las 8 caras).                 */

export type Expresion =
  | 'normal'     // saludo, por defecto
  | 'contento'   // pago hecho, demo lista
  | 'guino'      // confirmación corta
  | 'pensando'   // está escribiendo
  | 'dormido'    // fuera de horario
  | 'susto'      // el meteorito
  | 'triste'     // error, 404

type Props = {
  expresion?: Expresion
  /** 'cara' para avatares pequeños (el cuerpo entero se emborrona por debajo de 64 px) */
  parte?: 'cara' | 'cuerpo'
  className?: string
  title?: string
}

export default function AlloDino({ expresion = 'normal', parte = 'cara', className = '', title }: Props) {
  const url = `/marca/mascota/${expresion}-${parte}.svg`
  return (
    <span
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
