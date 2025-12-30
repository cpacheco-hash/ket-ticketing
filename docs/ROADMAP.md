# Roadmap - KET

## Fase 0: Descubrimiento y Diseño (2-4 sprints)

### Investigación y Planeación
- [x] Definir principios del producto (fan-first, mobile-first)
- [x] Investigar competidores (DICE, Evently, Ticketmaster)
- [x] Definir stack tecnológico
- [x] Crear especificaciones técnicas
- [ ] Investigar integraciones (Spotify, Apple Music, Fintoc)

### Diseño UX/UI
- [ ] Wireframes de flujos principales
  - [ ] Onboarding y registro
  - [ ] Descubrimiento de eventos
  - [ ] Detalle de evento
  - [ ] Checkout
  - [ ] Billetera de tickets
  - [ ] Transferencia de tickets
- [ ] Diseño UI en Figma
  - [ ] Design system
  - [ ] Componentes
  - [ ] Pantallas móviles
  - [ ] Pantallas desktop
- [ ] Prototipo interactivo

### Compliance y Legal
- [ ] Definir datos mínimos (PII)
- [ ] Diseñar consent flows
- [ ] Términos y condiciones
- [ ] Política de privacidad (Ley 21.719)
- [ ] Política de devoluciones

### Setup Técnico
- [x] Inicializar repositorio Git
- [x] Crear documentación inicial
- [ ] Setup proyecto Next.js
- [ ] Configurar Prisma + PostgreSQL
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Configurar ambientes (dev, staging, prod)

---

## Fase 1: MVP - Beta Privada (8-12 sprints)

**Objetivo**: Lanzar beta privada con 1-2 productores medianos

### Sprint 1-2: Autenticación y Perfil
- [ ] Sistema de registro (email + celular)
- [ ] Login con email/password
- [ ] Social login (Google, Apple)
- [ ] Verificación de email
- [ ] Verificación de celular (SMS)
- [ ] Gestión de perfil
- [ ] NextAuth.js setup

### Sprint 3-4: Integraciones Musicales
- [ ] OAuth 2.0 Spotify (PKCE)
  - [ ] Autorización y callback
  - [ ] Obtener top artistas
  - [ ] Obtener géneros favoritos
- [ ] OAuth Apple Music
  - [ ] Autorización y callback
  - [ ] Obtener biblioteca
- [ ] Algoritmo de recomendaciones básico
- [ ] Sincronización periódica de datos

### Sprint 5-6: Descubrimiento de Eventos
- [ ] CRUD de eventos (admin)
- [ ] Feed personalizado
- [ ] Búsqueda y filtros
  - [ ] Por fecha
  - [ ] Por ubicación
  - [ ] Por género
  - [ ] Por artista
- [ ] Detalle de evento
- [ ] Seguir venues/artistas
- [ ] Ver eventos de amigos
- [ ] Compartir eventos

### Sprint 7-8: Checkout y Pagos
- [ ] Carrito de compras
- [ ] Integración Fintoc
  - [ ] Iniciación de pago A2A
  - [ ] Webhooks
  - [ ] Conciliación
- [ ] Integración Stripe (fallback)
- [ ] Proceso de checkout
- [ ] Confirmación de compra
- [ ] Email de confirmación

### Sprint 9-10: Sistema de Tickets y QR
- [ ] Generación de tickets
- [ ] QR dinámico
  - [ ] Generación con firma
  - [ ] Activación temporal
  - [ ] Rotación periódica
- [ ] App de validación (escaneo)
  - [ ] Modo online
  - [ ] Modo offline
  - [ ] Listas de revocación
- [ ] Billetera de tickets
- [ ] Historial de compras

### Sprint 11: Transferencias
- [ ] Sistema de transferencias
- [ ] Seleccionar ticket a transferir
- [ ] Enviar a email/teléfono
- [ ] Aceptar/rechazar transferencia
- [ ] Trail auditable
- [ ] Revocación de QR antiguo

### Sprint 12: Waitlist
- [ ] Sistema de waitlist (FIFO)
- [ ] Unirse a waitlist
- [ ] Devolver ticket
- [ ] Notificaciones de disponibilidad
- [ ] Ventana de compra (15 min)
- [ ] Precio face value

### Testing y QA
- [ ] Testing funcional completo
- [ ] Testing de integraciones
- [ ] Testing de seguridad
- [ ] Testing en dispositivos móviles
- [ ] Fix de bugs críticos

### Lanzamiento Beta
- [ ] Seleccionar 1-2 eventos piloto
- [ ] Onboarding de productores
- [ ] Crear eventos de prueba
- [ ] Invitar usuarios beta (50-100)
- [ ] Monitoreo en vivo
- [ ] Recolectar feedback

---

## Fase 2: Escala y Features Pro (12+ sprints)

### Panel de Productores B2B
- [ ] Dashboard de analytics
  - [ ] Ventas en tiempo real
  - [ ] Conversión
  - [ ] Demografía de compradores
- [ ] Gestión de eventos
  - [ ] Crear/editar eventos
  - [ ] Seating avanzado
  - [ ] Zonas y precios
  - [ ] Preventas
- [ ] Lista de invitados
- [ ] Códigos promocionales
- [ ] Reportes financieros
- [ ] Conciliación automática (Fintoc)

### White-Label
- [ ] Dominio personalizado
- [ ] Branding personalizado
- [ ] Emails personalizados
- [ ] Landing pages custom

### Marketing Tools
- [ ] Segmentación de audiencias
- [ ] Campañas de email
- [ ] Notificaciones push
- [ ] Ads sync (Facebook, Instagram)
- [ ] Retargeting

### Cashless y NFC
- [ ] Billetera interna
  - [ ] Recarga con Fintoc
  - [ ] Saldo y créditos
  - [ ] Retiro a cuenta bancaria
- [ ] NFC para festivales
  - [ ] Pulseras NFC
  - [ ] Validación en puerta
  - [ ] Pagos onsite

### Anti-Fraude Avanzado
- [ ] Machine Learning para detectar scalpers
  - [ ] Feature engineering
  - [ ] Modelo de clasificación
  - [ ] Alertas automáticas
- [ ] Device fingerprinting
- [ ] Límites dinámicos por usuario
- [ ] KYC para compras altas
- [ ] Análisis de patrones

### Optimizaciones
- [ ] Performance optimization
- [ ] Caching strategy (Redis)
- [ ] CDN para imágenes
- [ ] Code splitting
- [ ] Lazy loading
- [ ] PWA improvements

---

## Fase 3: Reventa Regulada + Compliance (6+ sprints)

### Reventa On-Platform
- [ ] Marketplace de reventa
- [ ] Precio máximo = face value
- [ ] Comisión de plataforma
- [ ] KYC opcional
- [ ] Verificación de identidad

### Blockchain/NFT (Exploración)
- [ ] Tickets como NFTs
- [ ] Smart contracts para transferencias
- [ ] Reglas de reventa programables
- [ ] Proof of attendance (POAP)

### Compliance Ley 21.719
- [ ] Implementar DPO (Data Protection Officer)
- [ ] DPIA (Data Protection Impact Assessment)
- [ ] Sistema de gestión de consentimientos
- [ ] Portal de derechos del usuario
  - [ ] Descargar datos
  - [ ] Eliminar cuenta
  - [ ] Rectificación
  - [ ] Portabilidad
- [ ] Notificación de brechas
- [ ] Auditorías de seguridad

### Features Avanzados
- [ ] Social features
  - [ ] Crear grupos
  - [ ] Invitaciones grupales
  - [ ] Chat entre asistentes
- [ ] Gamificación
  - [ ] Badges
  - [ ] Leaderboards
  - [ ] Rewards por asistencia
- [ ] Recomendaciones ML
  - [ ] Collaborative filtering
  - [ ] Content-based filtering
  - [ ] Hybrid approach

---

## Fase 4: Expansión (Futuro)

### Apps Nativas
- [ ] App iOS nativa (Swift/SwiftUI)
- [ ] App Android nativa (Kotlin/Jetpack Compose)
- [ ] Wallet integration (Apple Wallet, Google Pay)

### Nuevos Mercados
- [ ] Expansión a otros países LATAM
- [ ] Localización (i18n)
- [ ] Multi-moneda
- [ ] Integraciones de pago locales

### Nuevos Verticales
- [ ] Deportes
- [ ] Teatro
- [ ] Cine
- [ ] Experiencias

---

## Métricas de Éxito

### Fase 1 (MVP)
- ✅ 2 eventos piloto exitosos
- ✅ >100 usuarios registrados
- ✅ >80% tasa de conversión checkout
- ✅ <5% tasa de fraude
- ✅ >90% satisfacción de fans (NPS)
- ✅ >90% satisfacción de productores

### Fase 2 (Escala)
- ✅ 50+ eventos en plataforma
- ✅ 10,000+ usuarios activos
- ✅ 10+ productores/venues usando B2B
- ✅ $50M+ CLP en GMV mensual

### Fase 3 (Madurez)
- ✅ 500+ eventos mensuales
- ✅ 100,000+ usuarios activos
- ✅ Liderazgo en segmento indie/electrónica
- ✅ Break-even o rentabilidad

---

**Última actualización**: Diciembre 2024

Generado con [Claude Code](https://claude.com/claude-code)
