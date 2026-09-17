// Estados de la luz de fondo para páginas interiores (módulo sin 'use client' para poder usarlo desde páginas de servidor)
export type Foco = [x: number, y: number, tam: number, rol: string] // vw, vh, vw, rol de color
// Estados genéricos para páginas interiores: violeta/azul calmados, alternando lados, y cierre cálido
export const ESTADOS_INTERIOR: Foco[][] = [
  [[80, 30, 72, 'c'], [14, 86, 62, 'd'], [50, 50, 0, 'o']],
  [[18, 32, 66, 'd'], [84, 74, 64, 'h'], [50, 50, 0, 'o']],
  [[84, 26, 62, 'c'], [12, 84, 60, 'b'], [50, 50, 0, 'o']],
  [[22, 30, 64, 'h'], [82, 76, 66, 'c'], [50, 50, 0, 'o']],
  [[80, 34, 66, 'd'], [16, 80, 60, 'c'], [50, 50, 0, 'o']],
  [[50, 100, 84, 'a'], [50, 92, 104, 'b'], [50, 50, 40, 'c']],
]

