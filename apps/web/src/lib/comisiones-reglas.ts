/*  Reglas puras de comisión (sin base de datos): las usa la calculadora pública y lib/comisiones.ts.
      Escalera SEMANAL (lunes-domingo): 1.ª y 2.ª venta → 20 % · 3.ª y 4.ª → 25 % · 5.ª+ → 30 %.
      El % se fija al cobrar la primera cuota y se aplica a las 12 cuotas del cliente.              */
export const ESCALERA: { desde: number; pct: number; etiqueta: string }[] = [
  { desde: 1, pct: 20, etiqueta: '1.ª y 2.ª venta de la semana' },
  { desde: 3, pct: 25, etiqueta: '3.ª y 4.ª venta de la semana' },
  { desde: 5, pct: 30, etiqueta: '5.ª venta en adelante' },
]
export const MESES_COMISION = 12
export const DIA_PAGO = 5

/* % que corresponde a la venta número `n` de la semana */
export function pctParaVenta(n: number) {
  let pct = ESCALERA[0].pct
  for (const e of ESCALERA) if (n >= e.desde) pct = e.pct
  return pct
}
