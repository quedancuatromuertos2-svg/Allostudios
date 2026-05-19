# VoiceFlow AI — Guía de Setup

## Requisitos previos

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- Docker Desktop
- Cuenta en Clerk (auth)
- Cuenta en Stripe (pagos)
- Cuenta en Twilio (llamadas)
- Cuenta en OpenAI (IA)
- Cuenta en ElevenLabs (voces)

---

## 1. Instalación

```bash
# Clonar / entrar al directorio
cd voiceflow-ai

# Instalar dependencias de todo el monorepo
pnpm install

# Copiar variables de entorno
cp .env.example .env
# Rellenar los valores en .env
```

---

## 2. Base de datos (PostgreSQL + Redis con Docker)

```bash
docker-compose up -d
```

Esto levanta PostgreSQL en `localhost:5432` y Redis en `localhost:6379`.

---

## 3. Variables de entorno importantes

Editar `.env` y completar:

```env
# 1. Clerk — https://dashboard.clerk.com
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# 2. Twilio — https://console.twilio.com
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+34xxx

# 3. OpenAI — https://platform.openai.com
OPENAI_API_KEY=sk-...

# 4. ElevenLabs — https://elevenlabs.io
ELEVENLABS_API_KEY=...

# 5. Stripe — https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 4. Migraciones de base de datos

```bash
# Generar cliente Prisma
pnpm db:generate

# Aplicar schema a la base de datos
pnpm db:push

# (En producción usar migraciones)
pnpm db:migrate
```

---

## 5. Desarrollo local

```bash
# Levantar todo (frontend + backend en paralelo)
pnpm dev

# O por separado:
cd apps/api && pnpm dev    # Backend en :3001
cd apps/web && pnpm dev    # Frontend en :3000
```

---

## 6. Configurar Twilio Webhook

Una vez el backend esté accesible (usa ngrok en local):

```bash
ngrok http 3001
```

Luego en Twilio Console → Phone Numbers → tu número:
- Voice URL: `https://TU_NGROK.ngrok.io/api/voice/webhook/inbound`
- Status Callback: `https://TU_NGROK.ngrok.io/api/voice/webhook/status/BUSINESS_ID`

---

## 7. Stripe Webhook

```bash
stripe listen --forward-to localhost:3001/api/billing/webhook
```

---

## 8. Deploy Producción

### Frontend (Vercel)
```bash
cd apps/web
vercel deploy --prod
```

Variables de entorno en Vercel Dashboard.

### Backend (Railway)
1. Conectar repo a Railway
2. Seleccionar `apps/api` como root
3. Agregar variables de entorno
4. Railway auto-detecta NestJS

### Base de datos (Railway PostgreSQL)
- Crear servicio PostgreSQL en Railway
- Copiar `DATABASE_URL` a variables del API

---

## 9. Estructura del proyecto

```
voiceflow-ai/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   │   └── src/
│   │       ├── app/      # App Router (landing + dashboard)
│   │       └── components/
│   └── api/              # NestJS backend
│       └── src/
│           └── modules/  # voice, appointments, billing...
└── packages/
    └── database/         # Prisma schema
```

---

## 10. Flujo de una llamada

1. Cliente llama al número Twilio del negocio
2. Twilio hace POST a `/api/voice/webhook/inbound`
3. VoiceService busca el negocio por número de teléfono
4. Crea registro de llamada en DB
5. Devuelve TwiML que conecta con Media Stream (WebSocket)
6. OpenAI Realtime API procesa audio en tiempo real
7. PromptEngine genera respuesta contextual del negocio
8. ElevenLabs convierte texto a voz premium
9. Al finalizar: transcripción + resumen IA + analytics
10. Automations envía WhatsApp de confirmación si hubo cita

---

## Preguntas frecuentes de desarrollo

**¿Dónde configuro el prompt del agente?**
En el dashboard → "Config. IA" → System Prompt

**¿Cómo añado un nuevo sector (niche)?**
1. Añadir enum en `schema.prisma`
2. Añadir template en `templates.service.ts`
3. Añadir icono y ejemplo en `niches.tsx`

**¿Cómo funciona el aislamiento multi-tenant?**
Cada negocio tiene su `businessId`. El `TenantGuard` verifica que el usuario tenga acceso al negocio antes de cada operación.
