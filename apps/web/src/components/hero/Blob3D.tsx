'use client'

import { useEffect, useRef, useState } from 'react'

/*  Masa líquida violeta en WebGL para la cabecera.

    Es una esfera muy subdividida deformada por ruido en el vértice, con
    material propio: degradado violeta, brillo especular y un borde de luz
    (fresnel) que la hace parecer vidrio. Reacciona al cursor y respira.

    Si el navegador no puede con WebGL, o el usuario pide menos movimiento,
    no se monta nada y se ve el respaldo que le pase el padre.              */

type Props = { onFallo?: () => void }

export default function Blob3D({ onFallo }: Props) {
  const cont = useRef<HTMLDivElement>(null)
  const [vale, setVale] = useState(true)

  useEffect(() => {
    const nodo = cont.current
    if (!nodo) return

    let vivo = true
    let limpiar = () => {}

    ;(async () => {
      let THREE: typeof import('three')
      try {
        THREE = await import('three')
      } catch {
        setVale(false); onFallo?.(); return
      }
      if (!vivo) return

      const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch {
        setVale(false); onFallo?.(); return
      }

      const escena = new THREE.Scene()
      const camara = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
      camara.position.z = 4.1

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      nodo.appendChild(renderer.domElement)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'

      // ── Ruido simplex 3D, para deformar la superficie ──
      const RUIDO = `
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }`

      const uniforms = {
        uTime: { value: 0 },
        uAmp: { value: 0.36 },
        uRaton: { value: new THREE.Vector2(0, 0) },
        uA: { value: new THREE.Color('#1b1147') },
        uB: { value: new THREE.Color('#9b5cff') },
      }

      // El desplazamiento se calcula en una función para poder sacar la normal
      // real muestreando dos vecinos: sin eso la luz se ve plana y falsa.
      const VERT = `
      uniform float uTime; uniform float uAmp; uniform vec2 uRaton;
      varying vec3 vN; varying vec3 vVista; varying float vRuido;
      ${RUIDO}
      vec3 desplaza(vec3 p){
        float n1 = snoise(p*0.72 + vec3(0.0, uTime*0.17, uTime*0.07));
        float n2 = snoise(p*1.55 - vec3(uTime*0.11, 0.0, uTime*0.04));
        float cerca = smoothstep(1.2, 0.0, distance(normalize(p).xy, uRaton));
        float d = n1*0.80 + n2*0.18 + cerca*0.26;
        return p + normalize(p) * d * uAmp;
      }
      void main(){
        vec3 n = normalize(position);
        vec3 p = desplaza(position);

        // Base tangente ortonormal bien construida. Si el vector de ayuda es
        // casi paralelo a la normal el producto vectorial se va a cero y las
        // normales salen basura: por eso se elige segun la componente mayor.
        vec3 ayuda = abs(n.y) < 0.95 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0);
        vec3 t = normalize(cross(ayuda, n));
        vec3 b = cross(n, t);          // (t,b,n) queda a derechas
        float e = 0.06;
        vec3 pa = desplaza(position + t*e);
        vec3 pb = desplaza(position + b*e);
        vec3 nObj = normalize(cross(pa - p, pb - p));
        if (dot(nObj, n) < 0.0) nObj = -nObj;   // por si acaso, siempre hacia fuera

        vN = normalize(normalMatrix * nObj);
        vRuido = length(p) - 1.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vVista = mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`

      const FRAG = `
      uniform vec3 uA; uniform vec3 uB; uniform float uTime;
      varying vec3 vN; varying vec3 vVista; varying float vRuido;
      void main(){
        vec3 N = normalize(vN);
        vec3 V = normalize(-vVista);
        float fres = pow(1.0 - clamp(dot(N,V),0.0,1.0), 2.3);
        vec3 base = mix(uA, uB, smoothstep(-0.30, 0.40, vRuido));
        vec3 L1 = normalize(vec3(0.35, 0.80, 0.55));
        vec3 L2 = normalize(vec3(-0.75, -0.20, 0.35));
        float dif = max(dot(N,L1),0.0)*0.55 + max(dot(N,L2),0.0)*0.22;
        float esp = pow(max(dot(reflect(-L1,N),V),0.0), 48.0);
        // El borde se enciende, el centro se queda hondo: eso da volumen de vidrio
        vec3 col = base*(0.22 + dif*1.15)
                 + fres*vec3(0.45,0.26,0.95)*0.85
                 + pow(fres,5.0)*vec3(0.95,0.80,1.0)*0.75
                 + esp*vec3(1.0,0.96,1.0)*0.5;
        gl_FragColor = vec4(col, 1.0);
      }`

      const malla = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 72),
        new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }),
      )
      escena.add(malla)

      // Halo aditivo: una esfera un poco mayor vista por dentro, solo borde de luz
      const halo = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.28, 32),
        new THREE.ShaderMaterial({
          transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
          uniforms: { uCol: { value: new THREE.Color('#8b5bff') } },
          vertexShader: `varying vec3 vN; varying vec3 vV;
            void main(){ vN=normalize(normalMatrix*(-normal)); vec4 mv=modelViewMatrix*vec4(position,1.0);
            vV=mv.xyz; gl_Position=projectionMatrix*mv; }`,
          fragmentShader: `uniform vec3 uCol; varying vec3 vN; varying vec3 vV;
            void main(){ float d=clamp(dot(normalize(vN),normalize(-vV)),0.0,1.0);
            float f=pow(1.0-d,2.6)*smoothstep(0.0,0.30,d);
            gl_FragColor=vec4(uCol, f*0.7); }`,
        }),
      )
      escena.add(halo)

      const medir = () => {
        const r = nodo.getBoundingClientRect()
        const w = Math.max(1, r.width), h = Math.max(1, r.height)
        renderer.setSize(w, h, false)
        camara.aspect = w / h
        camara.updateProjectionMatrix()
      }
      medir()
      window.addEventListener('resize', medir)

      const objetivo = { x: 0, y: 0 }
      const actual = { x: 0, y: 0 }
      const mover = (e: MouseEvent) => {
        objetivo.x = (e.clientX / window.innerWidth) * 2 - 1
        objetivo.y = -((e.clientY / window.innerHeight) * 2 - 1)
      }
      window.addEventListener('mousemove', mover, { passive: true })

      // Solo gasta GPU cuando se ve
      let visible = true
      const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
      obs.observe(nodo)

      const reloj = new THREE.Clock()
      let raf = 0
      const pinta = () => {
        raf = requestAnimationFrame(pinta)
        if (!visible || document.hidden) return
        const t = reloj.getElapsedTime()
        uniforms.uTime.value = quieto ? 0 : t
        actual.x += (objetivo.x - actual.x) * 0.045
        actual.y += (objetivo.y - actual.y) * 0.045
        uniforms.uRaton.value.set(actual.x * 0.85, actual.y * 0.85)
        malla.rotation.y = actual.x * 0.42 + (quieto ? 0 : t * 0.055)
        malla.rotation.x = -actual.y * 0.32
        halo.rotation.copy(malla.rotation)
        renderer.render(escena, camara)
      }
      pinta()

      limpiar = () => {
        cancelAnimationFrame(raf)
        obs.disconnect()
        window.removeEventListener('resize', medir)
        window.removeEventListener('mousemove', mover)
        malla.geometry.dispose(); (malla.material as import('three').Material).dispose()
        halo.geometry.dispose(); (halo.material as import('three').Material).dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === nodo) nodo.removeChild(renderer.domElement)
      }
    })()

    return () => { vivo = false; limpiar() }
  }, [onFallo])

  if (!vale) return null
  return <div ref={cont} className="hn-lienzo" aria-hidden />
}
