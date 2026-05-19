import Link from "next/link"
import { Phone } from "lucide-react"

const links = {
  Producto: ["Características", "Precios", "Changelog", "Roadmap"],
  Sectores: ["Barbería", "Salón de belleza", "Restaurante", "Clínica dental", "Inmobiliaria"],
  Empresa: ["Sobre nosotros", "Blog", "Contacto", "Afiliados"],
  Legal: ["Privacidad", "Términos", "RGPD", "Cookies"],
}

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">VoiceFlow AI</span>
            </Link>
            <p className="text-sm leading-relaxed">
              La plataforma de recepcionista virtual con IA para negocios locales.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2025 VoiceFlow AI. Todos los derechos reservados.
          </p>
          <p className="text-sm">Hecho con ❤️ en España</p>
        </div>
      </div>
    </footer>
  )
}
