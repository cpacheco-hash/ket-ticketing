import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const faqData = [
  // TICKETS
  {
    category: 'TICKETS',
    question: '¿Cómo compro una entrada?',
    answer: `
      <p>Comprar entradas en KET es muy fácil:</p>
      <ol>
        <li>Busca el evento que quieres asistir</li>
        <li>Selecciona la cantidad de entradas</li>
        <li>Completa tus datos de pago</li>
        <li>Recibe tu entrada con código QR por email</li>
      </ol>
      <p>Tus entradas también estarán disponibles en la sección "Mis Entradas" de tu perfil.</p>
    `,
    order: 1,
  },
  {
    category: 'TICKETS',
    question: '¿Puedo cancelar mi compra?',
    answer: `
      <p>Las entradas pueden ser canceladas hasta <strong>48 horas antes</strong> del evento.</p>
      <p>El reembolso se procesará en un plazo de 5-7 días hábiles al método de pago original.</p>
      <p>Para cancelar, ve a "Mis Entradas" y selecciona "Solicitar reembolso".</p>
    `,
    order: 2,
  },
  {
    category: 'TICKETS',
    question: '¿Recibiré mi entrada por email?',
    answer: `
      <p>Sí, recibirás un email de confirmación con:</p>
      <ul>
        <li>Código de orden</li>
        <li>Detalles del evento</li>
        <li>Link para acceder a tus entradas digitales</li>
      </ul>
      <p>También puedes acceder a tus entradas desde tu cuenta en cualquier momento.</p>
    `,
    order: 3,
  },

  // PAYMENT
  {
    category: 'PAYMENT',
    question: '¿Qué métodos de pago aceptan?',
    answer: `
      <p>Aceptamos los siguientes métodos de pago:</p>
      <ul>
        <li><strong>Transferencia bancaria</strong> (Fintoc) - Sin cargos extra</li>
        <li><strong>Tarjetas de crédito/débito</strong> (Visa, Mastercard, Amex)</li>
        <li><strong>Billetera KET</strong> - Carga saldo y obtén descuentos</li>
      </ul>
    `,
    order: 1,
  },
  {
    category: 'PAYMENT',
    question: '¿Cuáles son los costos de servicio?',
    answer: `
      <p>KET cobra una tarifa de servicio del <strong>5% + $500 CLP</strong> por transacción.</p>
      <p>Este cargo se muestra claramente antes de confirmar tu compra.</p>
      <p><strong>Ejemplo:</strong> Si tu entrada cuesta $10.000:</p>
      <ul>
        <li>Entrada: $10.000</li>
        <li>Tarifa de servicio (5%): $500</li>
        <li>Cargo fijo: $500</li>
        <li><strong>Total: $11.000</strong></li>
      </ul>
    `,
    order: 2,
  },
  {
    category: 'PAYMENT',
    question: '¿Es seguro pagar en KET?',
    answer: `
      <p>Sí, tu información está completamente segura. Usamos:</p>
      <ul>
        <li>Encriptación SSL/TLS para todas las transacciones</li>
        <li>Procesadores de pago certificados (Fintoc, Stripe)</li>
        <li>No almacenamos información de tarjetas</li>
        <li>Autenticación de dos factores disponible</li>
      </ul>
    `,
    order: 3,
  },

  // ACCESS
  {
    category: 'ACCESS',
    question: '¿Cómo accedo al evento con mi entrada?',
    answer: `
      <p>Tu entrada incluye un <strong>código QR dinámico</strong> que se actualiza cada 15 minutos por seguridad.</p>
      <ol>
        <li>Abre la app de KET o tu email de confirmación</li>
        <li>Ve a "Mis Entradas"</li>
        <li>Muestra el código QR en la entrada del evento</li>
        <li>El personal escaneará tu código</li>
      </ol>
      <p><strong>Importante:</strong> No compartas capturas de pantalla de tu QR - no funcionarán debido al sistema dinámico.</p>
    `,
    order: 1,
  },
  {
    category: 'ACCESS',
    question: '¿Necesito imprimir mi entrada?',
    answer: `
      <p>No, todas nuestras entradas son <strong>100% digitales</strong>.</p>
      <p>Solo necesitas tu smartphone con la app de KET o el email de confirmación.</p>
      <p>Si prefieres tener un respaldo, puedes guardar el email como PDF.</p>
    `,
    order: 2,
  },
  {
    category: 'ACCESS',
    question: '¿Qué pasa si mi teléfono se queda sin batería?',
    answer: `
      <p>Recomendamos:</p>
      <ul>
        <li>Llegar con batería suficiente (al menos 20%)</li>
        <li>Llevar un cargador portátil</li>
        <li>Tomar una captura del email de confirmación (como respaldo)</li>
      </ul>
      <p>En caso de emergencia, el personal del evento puede verificar tu identidad y buscar tu entrada en el sistema.</p>
    `,
    order: 3,
  },

  // TRANSFERS
  {
    category: 'TRANSFERS',
    question: '¿Puedo transferir mi entrada a otra persona?',
    answer: `
      <p>Sí, puedes transferir tu entrada de forma segura:</p>
      <ol>
        <li>Ve a "Mis Entradas"</li>
        <li>Selecciona la entrada que quieres transferir</li>
        <li>Ingresa el email del destinatario</li>
        <li>Confirma la transferencia</li>
      </ol>
      <p>El destinatario recibirá un email y podrá aceptar la transferencia. Una vez aceptada, la entrada se transferirá automáticamente a su cuenta.</p>
      <p><strong>Nota:</strong> Las transferencias son gratuitas y se pueden hacer hasta 24 horas antes del evento.</p>
    `,
    order: 1,
  },
  {
    category: 'TRANSFERS',
    question: '¿Puedo cancelar una transferencia?',
    answer: `
      <p>Sí, puedes cancelar una transferencia pendiente en cualquier momento antes de que el destinatario la acepte.</p>
      <p>Una vez aceptada, la transferencia no se puede revertir.</p>
    `,
    order: 2,
  },

  // CHANGES
  {
    category: 'CHANGES',
    question: '¿Qué pasa si el evento se cancela o reprograma?',
    answer: `
      <p><strong>Si un evento es cancelado:</strong></p>
      <ul>
        <li>Te notificaremos inmediatamente por email y notificación push</li>
        <li>Recibirás un reembolso completo (incluye tarifa de servicio)</li>
        <li>El reembolso se procesa en 5-7 días hábiles</li>
      </ul>
      <p><strong>Si un evento es reprogramado:</strong></p>
      <ul>
        <li>Tu entrada será válida para la nueva fecha automáticamente</li>
        <li>Si no puedes asistir a la nueva fecha, puedes solicitar reembolso</li>
        <li>Tienes 14 días para solicitar el reembolso desde el anuncio</li>
      </ul>
    `,
    order: 1,
  },
  {
    category: 'CHANGES',
    question: '¿Puedo cambiar mi entrada por otro evento?',
    answer: `
      <p>No, las entradas no son transferibles entre eventos diferentes.</p>
      <p>Si no puedes asistir a un evento, puedes:</p>
      <ul>
        <li>Transferir tu entrada a otra persona</li>
        <li>Solicitar reembolso (si aplica según la política del evento)</li>
      </ul>
    `,
    order: 2,
  },

  // GENERAL
  {
    category: 'GENERAL',
    question: '¿Qué es KET?',
    answer: `
      <p>KET es una plataforma de ticketing diseñada para fans.</p>
      <p>Nos diferenciamos por:</p>
      <ul>
        <li><strong>Transparencia:</strong> Precios claros sin cargos ocultos</li>
        <li><strong>Seguridad:</strong> QR dinámicos anti-fraude y lista de espera anti-reventa</li>
        <li><strong>Personalización:</strong> Conecta Spotify y descubre eventos de tus artistas favoritos</li>
        <li><strong>Tecnología:</strong> Todo digital, sin PDFs ni impresiones</li>
      </ul>
    `,
    order: 1,
  },
  {
    category: 'GENERAL',
    question: '¿Cómo creo una cuenta en KET?',
    answer: `
      <p>Puedes crear una cuenta de tres formas:</p>
      <ol>
        <li><strong>Email y contraseña:</strong> Registro tradicional</li>
        <li><strong>Google:</strong> Inicio de sesión rápido con tu cuenta Google</li>
        <li><strong>Spotify:</strong> Conecta Spotify para recomendaciones personalizadas</li>
      </ol>
      <p>Recomendamos usar Spotify para obtener la mejor experiencia con recomendaciones basadas en tus gustos musicales.</p>
    `,
    order: 2,
  },
  {
    category: 'GENERAL',
    question: '¿Puedo organizar mi propio evento en KET?',
    answer: `
      <p>Sí, KET está abierto a organizadores. Para crear eventos necesitas:</p>
      <ol>
        <li>Crear una cuenta de organizador</li>
        <li>Completar el proceso de verificación</li>
        <li>Configurar tu método de pago para recibir fondos</li>
      </ol>
      <p>Contacta a nuestro equipo en <strong>organizadores@ket.cl</strong> para más información sobre comisiones y proceso de alta.</p>
    `,
    order: 3,
  },
]

async function main() {
  console.log('Seeding FAQs...')

  for (const faq of faqData) {
    await prisma.fAQ.create({
      data: faq as any,
    })
  }

  console.log('✓ FAQs seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
