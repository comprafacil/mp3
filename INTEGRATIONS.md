# Integraciones de mp3-musica.com

## 🌐 Cloudflare Resources (Requieren creación manual)

### D1 Database
1. Ve a: https://dash.cloudflare.com -> Workers & Pages -> D1
2. Crea una nueva base de datos llamada `mp3-musica`
3. Copia el `database_id`
4. Ejecuta el schema:
   ```bash
   wrangler d1 execute mp3-musica --remote --file=./d1/schema.sql
   ```

### KV Namespaces
1. Workers & Pages -> KV
2. Crea `mp3-cache` (para cache de artículos)
3. Crea `mp3-sessions` (para sesiones de usuario)

### R2 Bucket
1. Workers & Pages -> R2
2. Crea `mp3-assets` (para imágenes y archivos)

### Bindings en Pages
En tu proyecto Pages -> Settings -> Functions:
- **DB**: D1 database `mp3-musica`
- **KV**: KV namespace `mp3-cache`
- **SESSION**: KV namespace `mp3-sessions`
- **R2**: R2 bucket `mp3-assets`

---

## 🔐 Variables de Entorno (Secrets)

Agregar en Pages -> Settings -> Environment Variables:

| Variable | Valor | Notas |
|----------|-------|-------|
| `TURNSTILE_SECRET_KEY` | (de Cloudflare Turnstile) | Para newsletter |
| `TELEGRAM_BOT_TOKEN` | (de @BotFather) | Para notificaciones |
| `TELEGRAM_CHAT_ID` | (ID del canal) | Para notificaciones |
| `RESEND_API_KEY` | (de resend.com) | Para emails |
| `STRIPE_SECRET_KEY` | (de stripe.com) | Para pagos |
| `STRIPE_WEBHOOK_SECRET` | (de stripe) | Para webhooks |
| `GOOGLE_SITE_VERIFICATION` | (de GSC) | Para indexing |

---

## 🤖 Telegram Bot Setup

1. Abre @BotFather en Telegram
2. Envía `/newbot`
3. Dale un nombre (ej: `mp3-musica Bot`)
4. Dale un username (ej: `mp3musica_bot`)
5. Copia el token
6. Para obtener chat_id:
   - Crea un canal privado
   - Agrega el bot como administrador
   - Envía `/getid` a @userinfobot

---

## 📧 Resend (Newsletter)

1. Ve a https://resend.com
2. Crea una cuenta y genera API key
3. Verifica tu dominio para enviar emails
4. Agrega API key como secret

---

## 💳 Stripe (Pagos)

1. Ve a https://stripe.com
2. Crea cuenta y obtén API keys
3. Crea productos en Stripe Dashboard:
   - **Monthly**: $9.99/mes
   - **Yearly**: $79.99/año
4. Copia los `price_id` de cada producto

---

## 🔍 Google Search Console

1. Ve a https://search.google.com/search-console
2. Agrega propiedad: `https://www.mp3-musica.com`
3. Verifica con HTML tag (ya configurado en `app.html`)
4. Envía sitemap: `https://www.mp3-musica.com/es/sitemap.xml`

---

## 🤖 Cloudflare AI

1. Ve a: https://dash.cloudflare.com -> Workers AI
2. El módulo `$lib/ai/content.ts` ya está configurado
3. Solo necesitas agregar el binding en Pages Functions

---

## 📊 Analytics

El schema incluye:
- `article_analytics` - Vistas, clicks, conversiones
- `fraud_events` - Detección de fraude
- `affiliate_clicks` - Tracking de afiliados

---

## 🚀 Deploy Hooks

Para triggers automáticos desde servicios externos:

1. Ve a: Pages -> Settings -> Deploy Hooks
2. Crea un hook:
   - **Name**: "Content Update"
   - **Branch**: main
3. Copia la URL del hook
4. Usa en tu CMS o sistema de gestión

---

## 📝 Checklist de Configuración

- [ ] Crear D1 database y ejecutar schema
- [ ] Crear KV namespaces
- [ ] Crear R2 bucket
- [ ] Agregar bindings en Pages Settings
- [ ] Configurar Turnstile
- [ ] Configurar Telegram Bot
- [ ] Configurar Resend
- [ ] Configurar Stripe
- [ ] Verificar en Google Search Console
- [ ] Probar AI content generation

---

## 🎯 Revenue Goal: $1M/año

| Stream | Meta Mensual | Target |
|--------|-------------|--------|
| Ads | $50,000 | 2M+ pageviews/mes |
| Afiliados | $15,000 | 500+ clicks/mes |
| Memberships | $15,000 | 1,500 members |
