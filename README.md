# KET - Plataforma de Ticketera Fan-First

![KET Logo](./diseño/Gemini_Generated_Image_rzojanrzojanrzoj.png)

## Descripción

KET es una plataforma de venta de entradas (ticketera) inspirada en DICE, diseñada específicamente para el mercado chileno. Nuestra misión es ofrecer una experiencia **fan-first** y **mobile-first**, con descubrimiento personalizado de eventos, pagos transparentes y medidas anti-fraude robustas.

## Características Principales

### Para Fans (Usuario Final)
- **Descubrimiento Personalizado**: Conecta tu Spotify/Apple Music para recibir recomendaciones de eventos basadas en tus gustos musicales
- **Compra en 3 Pasos**: Ver evento → Seleccionar entradas → Pagar (sin sorpresas)
- **QR Dinámico**: Activación el día del evento para prevenir fraudes y screenshots
- **Transferencias Seguras**: Transfiere tickets a amigos sin PDFs, con trail auditable
- **Waitlist Face Value**: Sistema de reventa controlada al precio original
- **Pagos con Fintoc**: Account-to-Account (A2A) con comisiones bajas y transparentes
- **Sin PDFs**: Todo en la app, experiencia 100% digital

### Para Productores/Venues (B2B)
- **Panel de Control**: Analytics en tiempo real y reportes de ventas
- **White-Label**: Dominio propio y branding personalizado
- **Conciliación Automática**: Integración con Fintoc para reportes financieros
- **Herramientas de Marketing**: Segmentación de audiencias y campañas dirigidas
- **Control de Acceso**: Validación de QR con modo offline

## Stack Tecnológico (MVP)

### Frontend
- **Web App Responsive**: Next.js + React + TailwindCSS
- **Mobile-First**: Optimizado para experiencia móvil
- **PWA**: Progressive Web App para funcionalidad offline

### Backend (Planificado)
- **Arquitectura**: Microservicios
- **Servicios**: Auth, Usuarios, Eventos, Ordenes/Pagos, Billetera, QR/Acceso, Recomendaciones

### Integraciones
- **Música**: Spotify OAuth 2.0 + PKCE, Apple Music OAuth
- **Pagos**: Fintoc (A2A + débitos) + Stripe/Mercado Pago (fallback)
- **QR**: Tokens efímeros con validación offline y listas de revocación

## Seguridad y Anti-Fraude

- **QR Dinámico**: Activación temporal para impedir duplicación
- **Validación Offline**: Funcionamiento en puerta sin conexión
- **Rate Limiting**: Protección contra bots y compras automatizadas
- **Device Fingerprint**: Detección de patrones sospechosos
- **ML Anti-Scalping**: Análisis de comportamiento para detectar revendedores

## Cumplimiento Legal (Chile)

- **Ley 21.719**: Preparado para entrada en vigor (1/12/2026)
- **Privacy-by-Design**: Minimización de datos y controles de acceso
- **Consent Flows**: Consentimiento claro para integraciones
- **DPO & DPIA**: Implementación de Data Protection Officer cuando aplique

## Roadmap

### Fase 0 - Descubrimiento y Diseño (Actual)
- [x] Definir principios del producto
- [x] Especificar arquitectura técnica
- [x] Diseñar flujos UX principales
- [ ] Mockups y wireframes
- [ ] Integraciones OAuth (Spotify/Apple Music)
- [ ] Integración Fintoc

### Fase 1 - MVP (Beta Privada)
- [ ] App web responsive
- [ ] Feed de descubrimiento de eventos
- [ ] Checkout con Fintoc
- [ ] Generación de QR dinámico
- [ ] Sistema de transferencias
- [ ] Waitlist para sold-out
- [ ] Panel básico para productores

### Fase 2 - Escala y Features Pro
- [ ] Cashless/NFC para festivales
- [ ] Seating avanzado
- [ ] Marketing ads sync
- [ ] ML antifraude
- [ ] Auditorías de seguridad

### Fase 3 - Reventa Regulada
- [ ] Reventa on-platform con topes
- [ ] KYC opcional
- [ ] Exploración NFT/Tokens
- [ ] Compliance full Ley 21.719

## Documentación

- [Especificaciones del MVP](./MVP/Desarrollo%20MVP.docx.pdf) - Documento técnico completo
- [Especificaciones Técnicas](./docs/ESPECIFICACIONES_TECNICAS.md) - Arquitectura y endpoints (Próximamente)
- [Guía de Contribución](./docs/CONTRIBUTING.md) - Cómo contribuir al proyecto (Próximamente)

## Instalación y Desarrollo Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd KET

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Variables de Entorno

```env
# Spotify OAuth
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Apple Music OAuth
NEXT_PUBLIC_APPLE_MUSIC_KEY_ID=
APPLE_MUSIC_PRIVATE_KEY=

# Fintoc
NEXT_PUBLIC_FINTOC_PUBLIC_KEY=
FINTOC_SECRET_KEY=

# Base de Datos
DATABASE_URL=

# Otros
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Competidores y Referencias

- **DICE**: Modelo fan-first, discovery con Spotify/Apple Music, waitlist face value
- **Evently (Chile)**: White-label, checkout rápido, analytics
- **Ticketmaster/PuntoTicket**: Jugadores dominantes en Chile (96-99% ventas digitales)

## Ventajas Competitivas

1. **Precios Transparentes + Comisión Baja**: A2A con Fintoc
2. **Discovery Inteligente**: Integración nativa con plataformas de música
3. **Anti-Scalping Robusto**: Waitlist, ML, límites por identidad
4. **Mobile-First**: Experiencia optimizada para smartphones
5. **Cumplimiento Legal**: Preparado para Ley 21.719 desde el MVP

## Contribuir

Este proyecto está en fase de desarrollo inicial. Las contribuciones serán bienvenidas una vez que el MVP esté en beta privada.

## Licencia

Propiedad de KET - Todos los derechos reservados

## Contacto

- **Website**: [Próximamente]
- **Email**: team@ket.cl
- **Documentación**: Ver carpeta `/docs`

---

**Generado con [Claude Code](https://claude.com/claude-code)**

*Última actualización: Diciembre 2024*
