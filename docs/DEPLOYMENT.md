# Guía de Deployment - KET en Vercel

Esta guía te ayudará a desplegar el proyecto KET en Vercel para que tus socios puedan verlo.

## Prerrequisitos

- Cuenta de GitHub
- Cuenta de Vercel (puede ser con GitHub)
- Git instalado localmente

---

## Paso 1: Crear Repositorio en GitHub

### Opción A: Desde la línea de comandos

1. **Crear un nuevo repositorio en GitHub**
   - Ve a https://github.com/new
   - Nombre: `ket-ticketing` (o el que prefieras)
   - Descripción: "Fan-first ticketing platform for live events"
   - Visibilidad: **Private** (para que solo tus socios lo vean)
   - NO inicializar con README (ya tenemos archivos)

2. **Conectar tu repositorio local con GitHub**

```bash
cd "C:\Users\cpach\OneDrive\Escritorio\Claude\KET"

# Agregar remote de GitHub
git remote add origin https://github.com/TU-USUARIO/ket-ticketing.git

# Verificar
git remote -v

# Push inicial
git branch -M main
git push -u origin main
```

### Opción B: Usando GitHub Desktop

1. Abre GitHub Desktop
2. File → Add Local Repository
3. Selecciona la carpeta KET
4. Publish repository
5. Marca como "Private"
6. Publish

---

## Paso 2: Configurar Base de Datos (Vercel Postgres)

Vercel ofrece PostgreSQL gratuito integrado. Vamos a usarlo:

1. **Ir a Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Crear Storage**
   - Storage → Create Database
   - Seleccionar **Postgres**
   - Nombre: `ket-production`
   - Region: Selecciona la más cercana
   - Create

3. **Obtener DATABASE_URL**
   - En el dashboard de tu base de datos
   - Tab "Settings" → "General"
   - Copiar `POSTGRES_PRISMA_URL` (esta es la que usa Prisma)

---

## Paso 3: Desplegar en Vercel

### Opción A: Desde Vercel Dashboard (Recomendado)

1. **Ir a Vercel**
   - https://vercel.com/new

2. **Import Git Repository**
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Selecciona el repositorio `ket-ticketing`
   - Click en "Import"

3. **Configurar Proyecto**
   - **Framework Preset**: Next.js (auto-detectado)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next` (auto)
   - **Install Command**: `npm install`

4. **Environment Variables** (Importante ⚠️)

Agregar las siguientes variables de entorno:

```env
# Database (usa la URL de Vercel Postgres)
DATABASE_URL=postgresql://user:pass@host/database?sslmode=require

# NextAuth
NEXTAUTH_SECRET=tu-secret-super-seguro-generado-aleatoriamente
NEXTAUTH_URL=https://tu-proyecto.vercel.app

# Spotify (opcional por ahora)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Apple Music (opcional por ahora)
NEXT_PUBLIC_APPLE_MUSIC_KEY_ID=

# Fintoc (opcional por ahora)
NEXT_PUBLIC_FINTOC_PUBLIC_KEY=
FINTOC_SECRET_KEY=

# Node environment
NODE_ENV=production
```

**Para generar NEXTAUTH_SECRET:**
```bash
# En terminal
openssl rand -base64 32
```

5. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

### Opción B: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde la carpeta del proyecto
cd "C:\Users\cpach\OneDrive\Escritorio\Claude\KET"

# Login
vercel login

# Deploy
vercel

# Seguir los prompts:
# - Set up and deploy? Yes
# - Scope: Tu cuenta
# - Link to existing project? No
# - Project name: ket-ticketing
# - Directory: ./
# - Override settings? No

# Para producción
vercel --prod
```

---

## Paso 4: Configurar Base de Datos en Vercel

Una vez desplegado, necesitas aplicar el schema de Prisma:

1. **Ir al Dashboard de Vercel**
   - Tu proyecto → Settings → Environment Variables

2. **Conectar a la base de datos**
   - Storage → Connect → Selecciona tu database

3. **Aplicar Migrations**

Opción A: Desde local
```bash
# En .env.local, usar la DATABASE_URL de Vercel
DATABASE_URL="postgresql://..."

# Aplicar schema
npx prisma db push
```

Opción B: Desde Vercel CLI
```bash
# Conectar a producción
vercel env pull .env.production

# Aplicar schema
npx prisma db push --schema=./prisma/schema.prisma
```

---

## Paso 5: Verificar Deployment

1. **Abrir tu sitio**
   - URL: `https://tu-proyecto.vercel.app`
   - Deberías ver la página de inicio de KET

2. **Verificar logs**
   - Vercel Dashboard → Deployments → Latest
   - Click en "View Function Logs"

3. **Verificar base de datos**
   ```bash
   npx prisma studio
   ```

---

## Compartir con tus Socios

### Opción 1: URL Pública
- Comparte directamente: `https://tu-proyecto.vercel.app`
- Cualquiera con el link puede ver

### Opción 2: Vercel Password Protection (Recomendado)

1. **Ir a Project Settings**
   - Vercel Dashboard → Tu Proyecto → Settings
   - Security → Deployment Protection

2. **Activar Password Protection**
   - Enable "Vercel Authentication"
   - O usar "Password Protection"
   - Configurar password

3. **Compartir credenciales**
   - URL + Password con tus socios

### Opción 3: GitHub Collaborators

1. **Agregar colaboradores al repo**
   - GitHub → Settings → Collaborators
   - Invite → Email de tus socios

2. **Darles acceso a Vercel**
   - Vercel → Project Settings → Team
   - Add Member

---

## Dominios Personalizados (Opcional)

Si tienes un dominio como `ket.cl`:

1. **Ir a Project Settings**
   - Domains → Add Domain

2. **Agregar dominio**
   - `ket.cl` o `app.ket.cl`
   - Seguir instrucciones de DNS

---

## Actualizaciones Continuas

Cada vez que hagas `git push` a `main`:
- Vercel automáticamente desplegará la nueva versión
- Preview deployments para branches

```bash
# Workflow típico
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# Vercel despliega automáticamente ✨
```

---

## Troubleshooting

### Error: Prisma Client not found

**Solución:**
```bash
# Agregar postinstall script en package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Error: Database connection failed

**Verificar:**
- DATABASE_URL en environment variables
- SSL mode: `?sslmode=require` al final de la URL
- IP allowlist en la base de datos (Vercel IPs permitidas)

### Build fails

**Verificar:**
- `next build` funciona localmente
- Todas las dependencias en `package.json`
- TypeScript sin errores: `npm run type-check`

---

## Monitoreo

### Analytics (incluido gratis en Vercel)
- Vercel Dashboard → Analytics
- Pageviews, visitors, performance

### Error Tracking
Agregar Sentry (recomendado):
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Costos

**Vercel Free Tier incluye:**
- ✅ Deployments ilimitados
- ✅ Bandwidth: 100 GB/mes
- ✅ Serverless Functions: 100 GB-Hours
- ✅ 1 PostgreSQL database (gratis)

**Perfecto para MVP y demos!**

---

## Siguiente Paso

Una vez desplegado, comparte con tus socios:

```
🎉 KET MVP está live!

URL: https://ket-ticketing.vercel.app
Usuario: (si configuraste password)
Password: (si configuraste password)

Feedback bienvenido!
```

---

**Última actualización**: Diciembre 2024

Generado con [Claude Code](https://claude.com/claude-code)
