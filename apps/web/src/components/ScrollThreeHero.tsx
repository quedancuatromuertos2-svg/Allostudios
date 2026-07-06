'use client'

/**
 * Hero — CRISTAL LÍQUIDO IRIDISCENTE (Three.js, shader a medida).
 * Firma estética de toda la web: una forma orgánica que muta, refleja y respira.
 * - Se transforma al hacer SCROLL y reacciona al RATÓN.
 * - Shader de ruido simplex (desplaza los vértices) + iridiscencia por fresnel.
 * - Aurora de partículas de fondo para profundidad y coherencia.
 * - Vectorial → nítido a cualquier resolución. Funciona en móvil (scroll real).
 * - Veladura radial mantiene el texto central legible.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const chips = [
  { label: 'Instagram gestionado', dot: '#7C9CFF' },
  { label: 'Webs profesionales', dot: '#3fb950' },
  { label: 'Anuncios · IA 24/7', dot: '#c58bff' },
]
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

const NOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+1.0*C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

export default function ScrollThreeHero() {
  const wrapRef = useRef<HTMLElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      if (disposed || !mountRef.current) return
      const mount = mountRef.current
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100)
      camera.position.z = 6.2
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      mount.appendChild(renderer.domElement)

      const uniforms = {
        uTime: { value: 0 }, uProg: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) }, uAmp: { value: 0.42 },
      }
      const mat = new THREE.ShaderMaterial({
        uniforms, transparent: true, side: THREE.DoubleSide,
        vertexShader: NOISE + `
          uniform float uTime; uniform float uProg; uniform vec2 uMouse; uniform float uAmp;
          varying vec3 vN; varying vec3 vView; varying float vD;
          void main(){
            vec3 p = position; float t = uTime*0.32;
            float n = snoise(p*1.05 + vec3(t, t*0.7, -t*0.5));
            float n2 = snoise(p*2.3 + vec3(-t*0.8, t*0.4, t)) * 0.5;
            float m = (uMouse.x*p.y - uMouse.y*p.x)*0.25;
            float disp = (n + n2 + m) * (uAmp + uProg*0.28);
            vec3 np = p + normal * disp;
            vN = normalize(normalMatrix * (normal + normal*disp*0.6));
            vec4 mv = modelViewMatrix * vec4(np,1.0);
            vView = normalize(-mv.xyz); vD = disp;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          precision highp float;
          uniform float uProg; uniform float uTime;
          varying vec3 vN; varying vec3 vView; varying float vD;
          vec3 pal(float t){
            vec3 a=vec3(0.55,0.5,0.6), b=vec3(0.45,0.45,0.5), c=vec3(1.0,1.0,1.0), d=vec3(0.0,0.15,0.35);
            return a + b*cos(6.28318*(c*t+d));
          }
          void main(){
            vec3 N=normalize(vN); vec3 V=normalize(vView);
            float fres = pow(1.0 - clamp(dot(N,V),0.0,1.0), 2.4);
            float hue = fres*0.9 + vD*0.6 + uTime*0.03;
            vec3 irid = pal(hue);
            vec3 base = mix(vec3(0.05,0.06,0.14), vec3(0.16,0.12,0.34), fres);
            vec3 col = mix(base, irid, fres*0.85);
            col += irid * pow(fres,1.5) * 0.6;
            float alpha = 0.32 + fres*0.68;
            gl_FragColor = vec4(col, alpha);
          }`,
      })
      const geo = new THREE.IcosahedronGeometry(1.7, 24)
      const blob = new THREE.Mesh(geo, mat)
      scene.add(blob)

      const coreGeo = new THREE.IcosahedronGeometry(1.2, 8)
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x5b6bff, transparent: true, opacity: 0.1 })
      const core = new THREE.Mesh(coreGeo, coreMat)
      scene.add(core)

      const N = 520, pp = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const r = 3.2 + Math.random() * 6, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
        pp[i * 3] = r * Math.sin(ph) * Math.cos(th); pp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pp[i * 3 + 2] = r * Math.cos(ph)
      }
      const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
      const pMat = new THREE.PointsMaterial({ color: 0x8ba0ff, size: 0.022, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
      const particles = new THREE.Points(pGeo, pMat)
      scene.add(particles)

      let tmx = 0, tmy = 0, mx = 0, my = 0
      const onMove = (e: MouseEvent) => { tmx = (e.clientX / window.innerWidth - 0.5) * 2; tmy = (e.clientY / window.innerHeight - 0.5) * 2 }
      window.addEventListener('mousemove', onMove, { passive: true })
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h)
      }
      window.addEventListener('resize', resize)
      const scrollProgress = () => {
        const wrap = wrapRef.current; if (!wrap) return 0
        const rect = wrap.getBoundingClientRect(); const total = wrap.offsetHeight - window.innerHeight
        return Math.max(0, Math.min(1, -rect.top / total))
      }

      const clock = new THREE.Clock()
      let raf = 0
      setReady(true)
      const render = () => {
        const t = clock.getElapsedTime(), p = scrollProgress()
        uniforms.uTime.value = reduce ? 0 : t
        uniforms.uProg.value = p
        mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05
        uniforms.uMouse.value.set(mx, my)
        const s = 0.82 + p * 0.5; blob.scale.setScalar(s); core.scale.setScalar(s)
        blob.rotation.y = (reduce ? 0 : t * 0.12) + mx * 0.5 + p * Math.PI * 0.5
        blob.rotation.x = my * 0.4 + p * 0.2
        particles.rotation.y = (reduce ? 0 : t * 0.03) + mx * 0.15
        particles.rotation.x = my * 0.1
        camera.position.x += (mx * 0.5 - camera.position.x) * 0.05
        camera.position.y += (-my * 0.5 - camera.position.y) * 0.05
        camera.position.z = 6.2 - p * 1.1; camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
        raf = requestAnimationFrame(render)
      }
      render()

      cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('resize', resize)
        renderer.dispose(); geo.dispose(); coreGeo.dispose(); pGeo.dispose()
        mat.dispose(); coreMat.dispose(); pMat.dispose()
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    })()

    return () => { disposed = true; cleanup() }
  }, [])

  const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

  return (
    <section ref={wrapRef} className="relative" style={{ height: '240vh', background: '#06070c' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s ease' }} />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(58% 48% at 50% 47%, rgba(6,7,12,0.78) 0%, rgba(6,7,12,0.34) 46%, transparent 74%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(6,7,12,0.55) 0%, transparent 22%, transparent 60%, rgba(6,7,12,0.96) 100%)' }} />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
            <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mb-8">
              {chips.map(c => (
                <span key={c.label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/85"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                  {c.label}
                </span>
              ))}
            </motion.div>

            <motion.h1 variants={item} className="text-white font-semibold leading-[1.03] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.7rem, 6.6vw, 5.2rem)' }}>
              Más clientes.
              <span className="block" style={{ background: 'linear-gradient(100deg,#7ee0ff,#8FA8FF 40%,#c58bff 75%,#ff9ecd)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                Sin tocar el marketing.
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-7 text-white/62 font-light max-w-xl mx-auto" style={{ fontSize: 'clamp(1rem,2vw,1.28rem)', lineHeight: 1.7 }}>
              Webs, Instagram, anuncios y un asistente de IA que responde 24/7 —
              para negocios locales de Valencia. Tú solo cierras.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <a href={wa} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[14px] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: 'linear-gradient(100deg,#5B5BD6,#7b5bd6)', boxShadow: '0 16px 44px -12px rgba(123,91,214,0.75)' }}>
                Pide tu demo gratis
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <button onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-medium text-[14px] text-white/80 border border-white/20 hover:border-white/45 hover:text-white transition-colors duration-200">
                Ver planes
              </button>
            </motion.div>

            <motion.p variants={item} className="mt-5 text-white/35 text-[11.5px]">
              La demo siempre es gratis · Sin permanencia
            </motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/40 text-[10px] tracking-[0.24em] uppercase">Desliza</span>
            <div className="w-px h-9 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
