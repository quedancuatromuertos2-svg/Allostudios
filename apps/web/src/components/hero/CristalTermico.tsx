'use client'

import { useEffect, useRef } from 'react'

/*  Cristal estriado + visión térmica, en WebGL.

    Detrás hay un campo de calor (frío violeta → caliente blanco) con la
    palabra recortada en oscuro. Delante, un cristal de franjas verticales
    que refracta lo que hay detrás como una lente cilíndrica, con su brillo
    y su sombra en cada franja.

    El degradado NO es una imagen: es una rampa de color en el shader. Por
    eso se puede animar, es nítido a cualquier resolución y cambiar los
    colores es cambiar una línea.                                           */

export type Rampa = 'violeta' | 'magenta' | 'brasa'

type Props = {
  palabra?: string
  rampa?: Rampa
  franjas?: number
  fuerza?: number      // cuánto refracta el cristal (0 = plano)
  className?: string
}

// Las tres escalas térmicas. Todas arrancan en el violeta de la marca:
// una escala de calor de verdad empieza en frío azul-violeta y acaba en blanco.
const RAMPAS: Record<Rampa, number[][]> = {
  // La más fiel a la marca: violeta → magenta → rosa → blanco
  violeta: [
    [0.02, 0.02, 0.06], [0.09, 0.05, 0.28], [0.36, 0.36, 0.84],
    [0.63, 0.36, 1.00], [0.88, 0.36, 0.95], [1.00, 0.62, 0.90], [1.00, 0.96, 1.00],
  ],
  // Más contraste: se va antes al magenta y quema más
  magenta: [
    [0.02, 0.01, 0.05], [0.15, 0.03, 0.34], [0.45, 0.14, 0.85],
    [0.80, 0.20, 0.90], [1.00, 0.30, 0.72], [1.00, 0.66, 0.82], [1.00, 1.00, 1.00],
  ],
  // Guiño a tus referencias: el extremo caliente se va a brasa, sin perder el violeta
  brasa: [
    [0.02, 0.01, 0.05], [0.13, 0.04, 0.32], [0.42, 0.22, 0.86],
    [0.78, 0.26, 0.72], [1.00, 0.38, 0.32], [1.00, 0.72, 0.30], [1.00, 0.98, 0.90],
  ],
}

export default function CristalTermico({
  palabra = 'allostudios',
  rampa = 'violeta',
  franjas = 46,
  fuerza = 1,
  className = '',
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const lienzo = ref.current
    if (!lienzo) return

    const gl = lienzo.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
    if (!gl) return

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── La palabra, dibujada en un lienzo 2D y subida como textura ──
    const texto = document.createElement('canvas')
    texto.width = 2048
    texto.height = 512
    const c2 = texto.getContext('2d')!
    c2.clearRect(0, 0, texto.width, texto.height)
    c2.fillStyle = '#fff'
    c2.textAlign = 'center'
    c2.textBaseline = 'middle'
    // Tipografía de Apple: SF Pro en Mac y iPhone. En Windows y Android no
    // existe, así que cae a Inter, que es prácticamente la misma letra.
    const TIPO = '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Inter, sans-serif'
    const n = palabra.trim().length
    const ancho = n <= 2 ? 0.46 : n <= 5 ? 0.72 : 0.88
    const grosor = n <= 5 ? 700 : 600
    let tam = n <= 2 ? 470 : 430
    c2.font = `${grosor} ${tam}px ${TIPO}`
    while (c2.measureText(palabra).width > texto.width * ancho && tam > 40) {
      tam -= 6
      c2.font = `${grosor} ${tam}px ${TIPO}`
    }
    c2.fillText(palabra, texto.width / 2, texto.height / 2 + tam * 0.02)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texto)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const VS = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){ vUv = aPos*0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`

    const FS = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexto;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uRaton;
      uniform float uFranjas;
      uniform float uFuerza;
      uniform vec3 uRampa[7];

      // Rampa de color: interpola entre los 7 puntos de la escala térmica
      vec3 calorColor(float h){
        h = clamp(h, 0.0, 1.0) * 6.0;
        float i = floor(h);
        float f = smoothstep(0.0, 1.0, fract(h));
        if (i < 1.0) return mix(uRampa[0], uRampa[1], f);
        if (i < 2.0) return mix(uRampa[1], uRampa[2], f);
        if (i < 3.0) return mix(uRampa[2], uRampa[3], f);
        if (i < 4.0) return mix(uRampa[3], uRampa[4], f);
        if (i < 5.0) return mix(uRampa[4], uRampa[5], f);
        return mix(uRampa[5], uRampa[6], f);
      }

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float ruido(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int k = 0; k < 4; k++){ v += a*ruido(p); p *= 2.03; a *= 0.5; }
        return v;
      }

      // Alfa de la palabra. La textura es 4:1 y se encaja a lo ANCHO de la
      // pantalla; la altura se deduce de la proporción para no deformarla.
      // (Antes se dividía por la relación de aspecto y solo se veía el 40 %
      //  central de la textura: la palabra salía ampliada y cortada.)
      float letra(vec2 uv){
        float rel = uRes.x / uRes.y;
        float escala = 0.88;              // parte del ancho que ocupa
        float alto = (rel / 4.0) * escala; // altura de la banda, en uv
        vec2 t;
        t.x = (uv.x - 0.5) / escala + 0.5;
        t.y = (uv.y - 0.60) / alto + 0.5;  // centrada en la franja alta
        if (t.x < 0.0 || t.x > 1.0 || t.y < 0.0 || t.y > 1.0) return 0.0;
        return texture2D(uTexto, t).a;
      }

      // Cristal mate: en vez de una muestra nítida, se promedian varias
      // alrededor. Eso es lo que hace que la luz se difunda en vez de reflejarse.
      float letraDifusa(vec2 uv, float r){
        float s = letra(uv);
        s += letra(uv + vec2( r, 0.0)) + letra(uv + vec2(-r, 0.0));
        s += letra(uv + vec2(0.0, r)) + letra(uv + vec2(0.0, -r));
        s += letra(uv + vec2( r*0.7,  r*0.7)) + letra(uv + vec2(-r*0.7,  r*0.7));
        s += letra(uv + vec2( r*0.7, -r*0.7)) + letra(uv + vec2(-r*0.7, -r*0.7));
        return s / 9.0;
      }

      void main(){
        vec2 uv = vUv;
        float rel = uRes.x / uRes.y;

        // ── El cristal: cada franja es una lente cilíndrica ──
        float x = uv.x * uFranjas;
        float f = fract(x) * 2.0 - 1.0;                 // -1..1 dentro de la franja
        float curva = sign(f) * pow(abs(f), 1.35);
        float desvio = curva * 0.0155 * uFuerza;
        vec2 uvR = vec2(uv.x - desvio, uv.y + curva * 0.006 * uFuerza);

        // ── El campo de calor que hay detrás ──
        vec2 foco = vec2(0.5 + uRaton.x * 0.10 + sin(uTime*0.11)*0.05,
                         0.5 + uRaton.y * 0.08 + cos(uTime*0.09)*0.04);
        float d = distance(vec2(uvR.x*rel, uvR.y), vec2(foco.x*rel, foco.y));
        float h = 1.0 - smoothstep(0.02, 0.72, d);
        h += (fbm(uvR*vec2(rel,1.0)*3.2 + vec2(uTime*0.05, uTime*0.03)) - 0.5) * 0.42;

        // La palabra ya no es una silueta oscura: es la LUZ. Se muestrea a
        // tres radios — el núcleo casi nítido, el resplandor que atraviesa el
        // cristal, y el halo ancho que tiñe todo lo de alrededor.
        float nucleo = letraDifusa(uvR, 0.0016);
        float pasa   = letraDifusa(uvR, 0.0130);
        float halo   = letraDifusa(uvR, 0.0380);

        h = h * 0.34 + nucleo * 0.98 + pasa * 0.52 + halo * 0.34;

        vec3 col = calorColor(h);
        // El corazón de la letra se va a blanco puro
        col = mix(col, vec3(1.0), smoothstep(0.62, 1.0, nucleo) * 0.62);

        // ── Relieve MATE: nada de reflejo especular. Un velo ancho y suave,
        //    la junta apenas insinuada, y una textura fina de vidrio arenado.
        float velo = pow(1.0 - abs(f), 2.6) * 0.085;
        float borde = smoothstep(0.82, 1.0, abs(f));
        col *= 0.88 + 0.12 * (1.0 - abs(f));       // volumen muy suave
        col *= 1.0 - borde * 0.28;                  // junta discreta
        col += velo;                                // velo mate, no reflejo
        col *= 0.97 + 0.06 * ruido(uv * vec2(420.0, 90.0));   // arenado

        // Grano: tapa el bandeado de los degradados oscuros
        col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.035;

        // Viñeta
        float v = distance(uv, vec2(0.5));
        col *= 1.0 - smoothstep(0.42, 0.92, v) * 0.75;

        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`

    const compila = (tipo: number, src: string) => {
      const sh = gl.createShader(tipo)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('shader:', gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }
    const vs = compila(gl.VERTEX_SHADER, VS)
    const fs = compila(gl.FRAGMENT_SHADER, FS)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    gl.uniform1i(u('uTexto'), 0)
    gl.uniform1f(u('uFranjas'), franjas)
    gl.uniform1f(u('uFuerza'), fuerza)
    const puntos = RAMPAS[rampa]
    for (let i = 0; i < 7; i++) gl.uniform3fv(u(`uRampa[${i}]`), puntos[i])

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const r = lienzo.getBoundingClientRect()
      lienzo.width = Math.max(1, Math.round(r.width * dpr))
      lienzo.height = Math.max(1, Math.round(r.height * dpr))
      gl.viewport(0, 0, lienzo.width, lienzo.height)
      gl.uniform2f(u('uRes'), lienzo.width, lienzo.height)
    }
    medir()
    window.addEventListener('resize', medir)

    const meta = { x: 0, y: 0 }, act = { x: 0, y: 0 }
    const mover = (e: MouseEvent) => {
      meta.x = (e.clientX / window.innerWidth) * 2 - 1
      meta.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', mover, { passive: true })

    let visible = true
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    obs.observe(lienzo)

    const t0 = performance.now()
    let raf = 0
    const pinta = () => {
      raf = requestAnimationFrame(pinta)
      if (!visible || document.hidden) return
      act.x += (meta.x - act.x) * 0.05
      act.y += (meta.y - act.y) * 0.05
      gl.uniform1f(u('uTime'), quieto ? 0 : (performance.now() - t0) / 1000)
      gl.uniform2f(u('uRaton'), act.x, act.y)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    pinta()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('resize', medir)
      window.removeEventListener('mousemove', mover)
      gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog)
    }
  }, [palabra, rampa, franjas, fuerza])

  return <canvas ref={ref} className={className} aria-hidden />
}
