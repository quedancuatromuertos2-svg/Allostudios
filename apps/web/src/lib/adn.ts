// ADN de diseño por sector para las demos Pro y Cinematográfica.
// Cada sector tiene identidad propia (tipografías, paleta, composición de cabecera, materiales),
// al nivel del sistema de allostudios.net pero sin parecerse a él: allo usa grafito + Outfit + violeta;
// aquí ninguno repite esa combinación. Las fuentes vienen de Google Fonts.

export type Cabecera = 'panel' | 'editorial' | 'centro'
// Concepto de la cabecera Cinematográfica (ninguno es el cristal de allo):
//   revelado  — foto a pantalla completa, título enorme que aparece palabra a palabra, cinta de servicios en marcha
//   aura      — luz suave del sector, título centrado con palabra en cursiva, tarjetas flotantes en cascada
//   dividido  — mitad papel con titular y tarjeta de cita, mitad foto en marco de doble bisel
//   poster    — cabecera clara de papel, título de cartel, sello giratorio, foto en ventana
//   velocidad — título con contorno duplicado, franja diagonal, contadores que suben
export type Cine = 'revelado' | 'aura' | 'dividido' | 'poster' | 'velocidad'
export type ADN = {
  clave: string
  nombre: string            // nombre interno del ADN (para enseñarlo)
  fuentes: { display: string; texto: string; url: string; displayPeso: number }
  bg: string                // grafito propio del sector
  papel: string             // papel propio
  tinta: string             // texto sobre papel
  acento: string            // color de marca del sector (botones, palabra en color)
  acento2: string           // segundo color (luz, detalles)
  luz: [string, string]     // dos focos de la luz de fondo (oscuro)
  luzPapel: [string, string] // dos focos del orbe sobre papel
  cristal: { fondo: string; c1: string; c2: string; c3: string; c4: string } // luz detrás del vidrio (cine)
  cabecera: Cabecera
  cine: Cine
  carta: boolean            // servicios como carta (lista con puntos) en vez de tarjetas
  eyebrow: string
}

const G = (familias: string) => `https://fonts.googleapis.com/css2?${familias}&display=swap`

export const ADNS: ADN[] = [
  {
    clave: 'barberia', nombre: 'Navaja', eyebrow: 'Barbería',
    fuentes: { display: "'Instrument Serif', Georgia, serif", texto: "'Archivo', system-ui, sans-serif", displayPeso: 400, url: G('family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600') },
    bg: '#0E1A15', papel: '#EDE7DC', tinta: '#12201A', acento: '#C09A5B', acento2: '#7A3030',
    luz: ['#1F4D3A', '#C09A5B'], luzPapel: ['#E8C27A', '#C9B79A'],
    cristal: { fondo: '#0E1A15', c1: '#1F4D3A', c2: '#C09A5B', c3: '#E8C27A', c4: '#FFF3D6' },
    cabecera: 'editorial', cine: 'revelado', carta: true,
  },
  {
    clave: 'estetica', nombre: 'Seda', eyebrow: 'Estética',
    fuentes: { display: "'Cormorant Garamond', Georgia, serif", texto: "'Jost', system-ui, sans-serif", displayPeso: 500, url: G('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500') },
    bg: '#1A1418', papel: '#F6EFEA', tinta: '#2A1F26', acento: '#D9A08F', acento2: '#5B3A5E',
    luz: ['#5B3A5E', '#D9A08F'], luzPapel: ['#F2C9B8', '#E7D3F0'],
    cristal: { fondo: '#1A1418', c1: '#5B3A5E', c2: '#D9A08F', c3: '#F2C9B8', c4: '#FFF4EC' },
    cabecera: 'centro', cine: 'aura', carta: false,
  },
  {
    clave: 'salud', nombre: 'Salvia', eyebrow: 'Salud',
    // Sans geométrica limpia (como el concepto Serra): salud = precisión y aire, sin cursivas
    fuentes: { display: "'Manrope', system-ui, sans-serif", texto: "'Karla', system-ui, sans-serif", displayPeso: 700, url: G('family=Manrope:wght@500;700;800&family=Karla:wght@400;500;600') },
    bg: '#101815', papel: '#F1F4F0', tinta: '#15211B', acento: '#7FA38A', acento2: '#B08A5A',
    luz: ['#2F5D4A', '#7FA38A'], luzPapel: ['#BFD9C6', '#E9DCC0'],
    cristal: { fondo: '#101815', c1: '#2F5D4A', c2: '#7FA38A', c3: '#D9C6A3', c4: '#F5F1E6' },
    cabecera: 'panel', cine: 'dividido', carta: false,
  },
  {
    clave: 'restaurante', nombre: 'Brasa', eyebrow: 'Cocina',
    // Serif negra y cálida (como el concepto Sequer): cocina = apetito y carácter
    fuentes: { display: "'Fraunces', Georgia, serif", texto: "'Jost', system-ui, sans-serif", displayPeso: 900, url: G('family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,700,50,1;0,9..144,900,50,1;1,9..144,700,50,1&family=Jost:wght@300;400;500') },
    bg: '#120C0A', papel: '#F3EBE0', tinta: '#22160F', acento: '#E2562B', acento2: '#FFB36B',
    luz: ['#7A2A16', '#E2562B'], luzPapel: ['#FFB36B', '#F0C9A0'],
    cristal: { fondo: '#120C0A', c1: '#7A2A16', c2: '#E2562B', c3: '#FFB36B', c4: '#FFF0D6' },
    cabecera: 'editorial', cine: 'revelado', carta: true,
  },
  {
    clave: 'cafeteria', nombre: 'Tueste', eyebrow: 'Café',
    fuentes: { display: "'Fraunces', Georgia, serif", texto: "'Inter Tight', system-ui, sans-serif", displayPeso: 600, url: G('family=Fraunces:opsz,wght,SOFT@9..144,600,50;9..144,700,50&family=Inter+Tight:wght@400;500') },
    bg: '#1B1410', papel: '#F7F1E8', tinta: '#2B1E16', acento: '#C7873A', acento2: '#5C6B3A',
    luz: ['#5A3A22', '#C7873A'], luzPapel: ['#E7B77A', '#D8D2A8'],
    cristal: { fondo: '#1B1410', c1: '#5A3A22', c2: '#C7873A', c3: '#E7B77A', c4: '#FFF2DC' },
    cabecera: 'centro', cine: 'poster', carta: true,
  },
  {
    clave: 'gimnasio', nombre: 'Voltio', eyebrow: 'Entreno',
    fuentes: { display: "'Unbounded', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif", displayPeso: 600, url: G('family=Unbounded:wght@600;700&family=Inter:wght@400;500;600') },
    bg: '#0B0D12', papel: '#EEF0F3', tinta: '#12151C', acento: '#C6FF3D', acento2: '#3B6CFF',
    luz: ['#1E2A6B', '#3B6CFF'], luzPapel: ['#D9FF8A', '#C7D4FF'],
    cristal: { fondo: '#0B0D12', c1: '#1E2A6B', c2: '#3B6CFF', c3: '#C6FF3D', c4: '#F0FFD0' },
    cabecera: 'panel', cine: 'velocidad', carta: false,
  },
  {
    clave: 'taller', nombre: 'Acero', eyebrow: 'Taller',
    fuentes: { display: "'Barlow Condensed', system-ui, sans-serif", texto: "'Barlow', system-ui, sans-serif", displayPeso: 600, url: G('family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500') },
    bg: '#0F1113', papel: '#ECECEA', tinta: '#15181B', acento: '#FF6A1A', acento2: '#9AA4AE',
    luz: ['#33383D', '#FF6A1A'], luzPapel: ['#FFC7A3', '#C9CFD4'],
    cristal: { fondo: '#0F1113', c1: '#33383D', c2: '#9AA4AE', c3: '#FF6A1A', c4: '#FFD9C2' },
    cabecera: 'editorial', cine: 'velocidad', carta: false,
  },
  {
    clave: 'despacho', nombre: 'Tinta', eyebrow: 'Despacho',
    fuentes: { display: "'Playfair Display', Georgia, serif", texto: "'Source Sans 3', system-ui, sans-serif", displayPeso: 500, url: G('family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Source+Sans+3:wght@400;500;600') },
    bg: '#0E1220', papel: '#F2F1EC', tinta: '#141826', acento: '#C9A96E', acento2: '#4B5FA8',
    luz: ['#24305E', '#4B5FA8'], luzPapel: ['#E8D9B5', '#C9CFEA'],
    cristal: { fondo: '#0E1220', c1: '#24305E', c2: '#4B5FA8', c3: '#C9A96E', c4: '#F3E7CD' },
    cabecera: 'centro', cine: 'dividido', carta: false,
  },
  {
    clave: 'comercio', nombre: 'Coral', eyebrow: 'Tienda',
    fuentes: { display: "'Sora', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif", displayPeso: 600, url: G('family=Sora:wght@600;700&family=Inter:wght@400;500;600') },
    bg: '#14121A', papel: '#F5F2EE', tinta: '#1B1820', acento: '#FF6B6B', acento2: '#FFC857',
    luz: ['#4A3F9B', '#FF6B6B'], luzPapel: ['#FFD0C2', '#FFE8B0'],
    cristal: { fondo: '#14121A', c1: '#4A3F9B', c2: '#FF6B6B', c3: '#FFC857', c4: '#FFF6E0' },
    cabecera: 'panel', cine: 'aura', carta: false,
  },
  {
    // Startups y negocios digitales. Referencia: los shots de «saas landing page dark» y «startup pricing»
    // de Dribbble (20/09/2026): negro azulado, un solo acento eléctrico, grotesca apretada, cifras grandes.
    clave: 'startup', nombre: 'Vector', eyebrow: 'Startup',
    fuentes: { display: "'Space Grotesk', system-ui, sans-serif", texto: "'Inter', system-ui, sans-serif", displayPeso: 700, url: G('family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600') },
    bg: '#07080F', papel: '#F6F7FB', tinta: '#0B0C14', acento: '#7C5CFF', acento2: '#38E1B0',
    luz: ['#2B1F7A', '#38E1B0'], luzPapel: ['#DCD6FF', '#CFF7EA'],
    cristal: { fondo: '#07080F', c1: '#2B1F7A', c2: '#7C5CFF', c3: '#38E1B0', c4: '#EAF7FF' },
    cabecera: 'centro', cine: 'velocidad', carta: false,
  },
]

export function adnDe(sector: string | null | undefined): ADN {
  const s = (sector || '').toLowerCase()
  const k =
    s.includes('peluq') || s.includes('barb') ? 'barberia' :
    s.includes('estét') || s.includes('spa') || s.includes('masaj') ? 'estetica' :
    s.includes('dental') || s.includes('clínic') || s.includes('fisio') || s.includes('veterin') || s.includes('óptic') ? 'salud' :
    s.includes('restaur') || s.includes('bar') ? 'restaurante' :
    s.includes('cafet') ? 'cafeteria' :
    s.includes('gimnas') || s.includes('entren') ? 'gimnasio' :
    s.includes('taller') || s.includes('mecán') ? 'taller' :
    s.includes('abogad') || s.includes('asesor') || s.includes('inmobil') ? 'despacho' :
    s.includes('startup') || s.includes('digital') || s.includes('saas') || s.includes('app') || s.includes('online') ? 'startup' : 'comercio'
  return ADNS.find(a => a.clave === k) || ADNS[ADNS.length - 1]
}
