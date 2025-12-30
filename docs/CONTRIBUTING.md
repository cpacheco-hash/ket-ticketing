# Guía de Contribución - KET

¡Gracias por tu interés en contribuir a KET! Este documento te guiará en el proceso.

## Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Empezar](#cómo-empezar)
3. [Proceso de Desarrollo](#proceso-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)

---

## Código de Conducta

Este proyecto se adhiere a un código de conducta profesional. Al participar, te comprometes a:

- Ser respetuoso y constructivo
- Aceptar críticas constructivas
- Enfocarte en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

---

## Cómo Empezar

### Requisitos Previos

- Node.js 20+ y npm/pnpm
- PostgreSQL 14+
- Git
- Cuenta de GitHub

### Setup Local

1. **Fork y clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/ket.git
cd ket
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Setup base de datos**
```bash
# Crear base de datos
createdb ket_dev

# Correr migraciones
npx prisma migrate dev

# (Opcional) Seed con datos de prueba
npx prisma db seed
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La app estará en `http://localhost:3000`

---

## Proceso de Desarrollo

### 1. Crear una Issue

Antes de trabajar en algo, crea una issue o comenta en una existente para:
- Discutir la propuesta
- Evitar trabajo duplicado
- Obtener feedback temprano

### 2. Crear un Branch

```bash
git checkout -b tipo/descripcion-corta

# Ejemplos:
git checkout -b feature/spotify-integration
git checkout -b fix/qr-validation-bug
git checkout -b docs/update-readme
```

**Tipos de branches:**
- `feature/` - Nueva funcionalidad
- `fix/` - Bug fix
- `docs/` - Documentación
- `refactor/` - Refactoring
- `test/` - Tests
- `chore/` - Tareas de mantenimiento

### 3. Desarrollar

- Escribe código limpio y mantenible
- Sigue los estándares del proyecto
- Agrega tests para nueva funcionalidad
- Actualiza documentación si es necesario

### 4. Commit

```bash
git add .
git commit -m "tipo: descripción concisa"
```

Ver [Commit Guidelines](#commit-guidelines) para detalles

### 5. Push y Pull Request

```bash
git push origin tu-branch
```

Luego crea un Pull Request en GitHub

---

## Estándares de Código

### TypeScript

- Usar TypeScript en todo el código
- Definir tipos explícitos (evitar `any`)
- Usar interfaces para objetos complejos

```typescript
// ❌ Malo
function createUser(data: any) {
  // ...
}

// ✅ Bueno
interface CreateUserInput {
  email: string
  firstName: string
  lastName: string
}

function createUser(data: CreateUserInput) {
  // ...
}
```

### React/Next.js

- Usar componentes funcionales con hooks
- Preferir Server Components cuando sea posible
- Usar Client Components solo cuando sea necesario

```typescript
// Server Component (default en App Router)
export default async function EventsPage() {
  const events = await getEvents()
  return <EventsList events={events} />
}

// Client Component (cuando se necesita interactividad)
'use client'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  // ...
}
```

### Naming Conventions

- **Componentes**: PascalCase (`EventCard.tsx`)
- **Funciones**: camelCase (`getUserById()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_TICKETS_PER_ORDER`)
- **Archivos**: kebab-case para utils (`format-currency.ts`)

### Estructura de Archivos

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Route groups
│   ├── api/          # API routes
│   └── ...
├── components/       # Componentes React
│   ├── ui/           # Componentes UI base
│   ├── events/       # Componentes de eventos
│   └── ...
├── lib/              # Utilidades y configuración
│   ├── db.ts         # Prisma client
│   ├── auth.ts       # NextAuth config
│   └── ...
├── hooks/            # Custom hooks
├── types/            # Type definitions
├── utils/            # Helper functions
└── styles/           # CSS/Tailwind
```

### Formatting

Usamos Prettier para formateo automático:

```bash
npm run format
```

Configuración en `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Linting

Usamos ESLint para calidad de código:

```bash
npm run lint
```

---

## Commit Guidelines

Seguimos [Conventional Commits](https://www.conventionalcommits.org/)

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formatting, espacios, etc.
- `refactor`: Refactoring de código
- `perf`: Mejoras de performance
- `test`: Tests
- `chore`: Mantenimiento, dependencias

### Ejemplos

```bash
feat(auth): add Spotify OAuth integration

fix(qr): resolve validation error for expired tickets

docs(readme): update installation instructions

refactor(checkout): simplify payment flow logic

test(events): add unit tests for event creation
```

### Reglas

- Usar imperativo ("add" no "added")
- No capitalizar primera letra
- No punto final
- Máximo 72 caracteres en la descripción
- Incluir issue number si aplica: `fix(qr): #123`

---

## Pull Request Process

### Antes de Crear el PR

✅ Checklist:
- [ ] Código formateado (`npm run format`)
- [ ] Linting sin errores (`npm run lint`)
- [ ] Tests pasando (`npm run test`)
- [ ] Build exitoso (`npm run build`)
- [ ] Documentación actualizada
- [ ] Branch actualizado con `main`

### Template del PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado self-review
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He agregado tests
- [ ] Todos los tests pasan

## Screenshots (si aplica)
```

### Proceso de Review

1. Al menos 1 aprobación requerida
2. CI debe pasar (linting, tests, build)
3. Resolver todos los comentarios
4. Squash and merge (historia limpia)

---

## Testing

### Unit Tests

Usamos Jest + React Testing Library

```typescript
// components/__tests__/EventCard.test.tsx
import { render, screen } from '@testing-library/react'
import EventCard from '../EventCard'

describe('EventCard', () => {
  it('renders event title', () => {
    const event = { id: '1', title: 'Concierto Test' }
    render(<EventCard event={event} />)
    expect(screen.getByText('Concierto Test')).toBeInTheDocument()
  })
})
```

### Integration Tests

```typescript
// app/api/events/__tests__/route.test.ts
import { GET } from '../route'

describe('GET /api/events', () => {
  it('returns list of events', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data).toHaveProperty('events')
  })
})
```

### E2E Tests

Usamos Playwright

```typescript
// e2e/checkout.spec.ts
test('complete checkout flow', async ({ page }) => {
  await page.goto('/events/123')
  await page.click('text=Comprar entradas')
  await page.fill('[name="quantity"]', '2')
  await page.click('text=Proceder al pago')
  // ...
})
```

### Ejecutar Tests

```bash
# Unit + Integration
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E
npm run test:e2e
```

---

## Preguntas

Si tienes preguntas, puedes:
- Abrir una issue
- Comentar en discusiones existentes
- Contactar al equipo: team@ket.cl

---

¡Gracias por contribuir a KET! 🎉

---

**Última actualización**: Diciembre 2024

Generado con [Claude Code](https://claude.com/claude-code)
