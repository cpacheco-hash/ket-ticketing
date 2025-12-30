# 🚀 Despliegue Rápido a Vercel

## Pasos para que tus socios vean el proyecto

### 1. Subir a GitHub (5 minutos)

```bash
# Desde la carpeta del proyecto
cd "C:\Users\cpach\OneDrive\Escritorio\Claude\KET"

# Crear repositorio en GitHub primero:
# https://github.com/new
# Nombre: ket-ticketing
# Private: ✓
# NO inicializar con README

# Luego ejecutar:
git remote add origin https://github.com/TU-USUARIO/ket-ticketing.git
git branch -M main
git push -u origin main
```

### 2. Desplegar en Vercel (5 minutos)

1. **Ir a Vercel**: https://vercel.com/new
2. **Import Repository**: Conecta GitHub y selecciona `ket-ticketing`
3. **Configure Project**:
   - Framework: Next.js (auto)
   - Build Command: `prisma generate && next build`
   - Environment Variables (agregar estas):

```env
DATABASE_URL=postgresql://...  (te lo da Vercel Postgres)
NEXTAUTH_SECRET=corre_esto_en_terminal: openssl rand -base64 32
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NODE_ENV=production
```

4. **Deploy** → Espera 2-3 minutos

### 3. Configurar Base de Datos

1. En Vercel Dashboard → Storage → Create Database → Postgres
2. Nombre: `ket-production`
3. Copiar `POSTGRES_PRISMA_URL` y pegarla como `DATABASE_URL`
4. Conectarla al proyecto

Desde terminal local:
```bash
# Aplicar schema a la base de datos de producción
npx prisma db push
```

### 4. ¡Compartir! 🎉

Tu sitio estará en: `https://tu-proyecto.vercel.app`

**Para protegerlo con password:**
- Vercel → Project Settings → Security → Password Protection
- Activar y configurar password
- Compartir URL + password con tus socios

---

## Alternativa: Usar GitHub Desktop

1. Abre GitHub Desktop
2. File → Add Local Repository → Selecciona carpeta KET
3. Publish repository (marca como Private)
4. Ve a vercel.com/new y continúa desde el paso 2

---

## ¿Necesitas ayuda?

Ver documentación completa en: `docs/DEPLOYMENT.md`
