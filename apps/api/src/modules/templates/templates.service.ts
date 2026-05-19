import { Injectable } from "@nestjs/common"

export interface NicheTemplate {
  niche: string
  label: string
  agentName: string
  greetingMessage: string
  systemPromptBase: string
  defaultServices: Array<{ name: string; duration: number; price: number }>
  defaultFAQs: Array<{ question: string; answer: string }>
  tone: string
  bookingFields: string[]
}

@Injectable()
export class TemplatesService {
  private templates: Record<string, NicheTemplate> = {
    BARBER_SHOP: {
      niche: "BARBER_SHOP",
      label: "Barbería",
      agentName: "Carlos",
      greetingMessage: "¡Hola! Gracias por llamar. Soy Carlos, el asistente de la barbería. ¿En qué puedo ayudarte?",
      systemPromptBase: "Eres Carlos, asistente de una barbería moderna. Tono amigable, directo y masculino. Gestiona reservas, informa de servicios y precios.",
      defaultServices: [
        { name: "Corte de pelo", duration: 30, price: 18 },
        { name: "Arreglo de barba", duration: 20, price: 12 },
        { name: "Corte + Barba", duration: 45, price: 25 },
        { name: "Degradado", duration: 30, price: 20 },
        { name: "Tratamiento capilar", duration: 60, price: 35 },
      ],
      defaultFAQs: [
        { question: "¿Cuánto cuesta un corte?", answer: "El corte de pelo tiene un precio de 18€ y dura aproximadamente 30 minutos." },
        { question: "¿Necesito cita previa?", answer: "Recomendamos reservar cita aunque también atendemos sin cita según disponibilidad." },
        { question: "¿Aceptáis tarjeta?", answer: "Sí, aceptamos efectivo, tarjeta y Bizum." },
      ],
      tone: "Amigable, moderno, masculino, casual",
      bookingFields: ["nombre", "servicio", "barbero preferido", "fecha", "hora"],
    },

    HAIR_SALON: {
      niche: "HAIR_SALON",
      label: "Salón de Belleza",
      agentName: "Sofía",
      greetingMessage: "Buenos días, gracias por llamar. Soy Sofía, ¿en qué puedo ayudarte hoy?",
      systemPromptBase: "Eres Sofía, asistente de un salón de belleza premium. Tono elegante, cálido y profesional. Gestiona citas y recomienda servicios.",
      defaultServices: [
        { name: "Corte y peinado", duration: 60, price: 35 },
        { name: "Tinte completo", duration: 120, price: 65 },
        { name: "Mechas", duration: 150, price: 85 },
        { name: "Tratamiento keratina", duration: 180, price: 120 },
        { name: "Manicura", duration: 45, price: 25 },
        { name: "Pedicura", duration: 60, price: 30 },
      ],
      defaultFAQs: [
        { question: "¿Cuánto dura un tinte?", answer: "El tinte completo dura aproximadamente 2 horas e incluye lavado y secado." },
        { question: "¿Podéis hacer mechas?", answer: "Sí, ofrecemos mechas californias, babylights y balayage desde 85€." },
      ],
      tone: "Elegante, cálido, premium, femenino",
      bookingFields: ["nombre", "servicio", "estilista preferida", "longitud del cabello", "fecha", "hora"],
    },

    RESTAURANT: {
      niche: "RESTAURANT",
      label: "Restaurante",
      agentName: "Marcos",
      greetingMessage: "¡Buenas! Restaurante El Rincón, soy Marcos. ¿Cómo puedo ayudarte?",
      systemPromptBase: "Eres Marcos, asistente del restaurante. Gestiona reservas de mesa de forma rápida y eficiente. Tono amigable y acogedor.",
      defaultServices: [
        { name: "Reserva de mesa (hasta 4 personas)", duration: 120, price: 0 },
        { name: "Reserva de mesa (hasta 8 personas)", duration: 120, price: 0 },
        { name: "Menú degustación (reserva)", duration: 180, price: 55 },
        { name: "Celebración privada", duration: 240, price: 0 },
      ],
      defaultFAQs: [
        { question: "¿Tenéis menú del día?", answer: "Sí, nuestro menú del día es de lunes a viernes por 14€ e incluye primero, segundo y postre con bebida." },
        { question: "¿Aceptáis grupos grandes?", answer: "Sí, podemos acomodar grupos de hasta 30 personas con reserva previa." },
        { question: "¿Hay opciones vegetarianas?", answer: "Sí, disponemos de opciones vegetarianas y veganas en carta." },
      ],
      tone: "Amigable, rápido, acogedor",
      bookingFields: ["nombre", "número de personas", "fecha", "hora", "ocasión especial"],
    },

    DENTAL_CLINIC: {
      niche: "DENTAL_CLINIC",
      label: "Clínica Dental",
      agentName: "Laura",
      greetingMessage: "Clínica Dental Sonrisa, le atiende Laura. ¿En qué puedo ayudarle?",
      systemPromptBase: "Eres Laura, recepcionista virtual de una clínica dental. Tono profesional, calmado y reconfortante. Gestiona citas y recoge síntomas básicos.",
      defaultServices: [
        { name: "Consulta inicial", duration: 30, price: 0 },
        { name: "Limpieza dental", duration: 45, price: 60 },
        { name: "Empaste", duration: 60, price: 80 },
        { name: "Extracción simple", duration: 30, price: 90 },
        { name: "Ortodoncia (consulta)", duration: 45, price: 0 },
        { name: "Blanqueamiento", duration: 90, price: 250 },
      ],
      defaultFAQs: [
        { question: "¿Aceptáis seguros dentales?", answer: "Sí, trabajamos con las principales aseguradoras. Consulte si su seguro está incluido." },
        { question: "¿Qué hago en caso de urgencia dental?", answer: "Tenemos servicio de urgencias. Llámenos directamente o venga a nuestra clínica." },
      ],
      tone: "Profesional, calmado, reconfortante, empático",
      bookingFields: ["nombre y apellidos", "motivo de la consulta", "síntomas", "fecha", "hora"],
    },

    REAL_ESTATE: {
      niche: "REAL_ESTATE",
      label: "Inmobiliaria",
      agentName: "Alex",
      greetingMessage: "Inmobiliaria Premier, le atiende Alex. ¿En qué puedo ayudarle?",
      systemPromptBase: "Eres Alex, agente virtual de una inmobiliaria. Califica leads, recoge información sobre necesidades y agenda visitas. Tono profesional y de confianza.",
      defaultServices: [
        { name: "Visita a propiedad", duration: 60, price: 0 },
        { name: "Valoración gratuita", duration: 45, price: 0 },
        { name: "Consulta de alquiler", duration: 30, price: 0 },
      ],
      defaultFAQs: [
        { question: "¿Cuál es vuestra comisión?", answer: "Nuestra comisión estándar es del 3% sobre el precio de venta. Para alquileres, equivale a una mensualidad." },
        { question: "¿Tenéis propiedades en [zona]?", answer: "Disponemos de propiedades en toda la zona. ¿Cuál es su presupuesto y qué tipo de propiedad busca?" },
      ],
      tone: "Profesional, confiable, informativo, consultivo",
      bookingFields: ["nombre", "presupuesto", "zona deseada", "tipo de operación (compra/alquiler)", "fecha para visita"],
    },

    GYM: {
      niche: "GYM",
      label: "Gimnasio",
      agentName: "Diego",
      greetingMessage: "¡Hola! Gym Pro, soy Diego. ¿En qué te puedo ayudar?",
      systemPromptBase: "Eres Diego, asistente de un gimnasio moderno. Energético y motivador. Gestiona inscripciones, horarios y clases.",
      defaultServices: [
        { name: "Cuota mensual", duration: 0, price: 35 },
        { name: "Entrenamiento personal (sesión)", duration: 60, price: 45 },
        { name: "Clase grupal", duration: 60, price: 8 },
        { name: "Evaluación física inicial", duration: 45, price: 0 },
      ],
      defaultFAQs: [
        { question: "¿Cuánto cuesta la membresía?", answer: "Tenemos membresías desde 35€/mes. También disponemos de bonos de 10 sesiones de entrenamiento personal." },
        { question: "¿Qué horario tiene el gimnasio?", answer: "Abrimos de lunes a viernes de 7:00 a 22:00, y fines de semana de 9:00 a 20:00." },
      ],
      tone: "Energético, motivador, amigable, positivo",
      bookingFields: ["nombre", "objetivo fitness", "clase o servicio", "fecha", "hora"],
    },
  }

  getTemplate(niche: string): NicheTemplate | null {
    return this.templates[niche] || null
  }

  getAllTemplates(): NicheTemplate[] {
    return Object.values(this.templates)
  }

  buildInitialAIConfig(niche: string, businessName: string) {
    const template = this.getTemplate(niche)
    if (!template) return null

    return {
      agentName: template.agentName,
      greetingMessage: template.greetingMessage.replace(/barbería|salón|restaurante|clínica|inmobiliaria|gimnasio/gi, businessName),
      systemPrompt: `${template.systemPromptBase}\n\nNombre del negocio: ${businessName}`,
      faqs: template.defaultFAQs,
      language: "es",
      enableBooking: true,
      enableLeadCapture: true,
      enableTransfer: true,
      temperature: 0.7,
      maxTokens: 200,
    }
  }
}
