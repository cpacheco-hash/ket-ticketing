import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Movistar Arena',
        slug: 'movistar-arena',
        address: 'Av. Beauchef 1204, Santiago',
        city: 'Santiago',
        capacity: 15000,
        lat: -33.4722,
        lng: -70.6528,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
      }
    }),
    prisma.venue.create({
      data: {
        name: 'Teatro Caupolicán',
        slug: 'teatro-caupolican',
        address: 'San Diego 850, Santiago',
        city: 'Santiago',
        capacity: 5000,
        lat: -33.4475,
        lng: -70.6593,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
      }
    }),
    prisma.venue.create({
      data: {
        name: 'Club Chocolate',
        slug: 'club-chocolate',
        address: 'San Diego 773, Santiago',
        city: 'Santiago',
        capacity: 800,
        lat: -33.4463,
        lng: -70.6598,
        image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec'
      }
    })
  ])

  console.log('✅ Created', venues.length, 'venues')

  // Create Artists
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'Daft Punk',
        slug: 'daft-punk',
        genres: ['Electronic', 'House', 'Dance'],
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89',
        bio: 'Dúo francés de música electrónica icónico'
      }
    }),
    prisma.artist.create({
      data: {
        name: 'The Weeknd',
        slug: 'the-weeknd',
        genres: ['R&B', 'Pop', 'Electronic'],
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
        bio: 'Cantante canadiense de R&B y pop'
      }
    }),
    prisma.artist.create({
      data: {
        name: 'Tame Impala',
        slug: 'tame-impala',
        genres: ['Psychedelic', 'Rock', 'Electronic'],
        image: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06',
        bio: 'Proyecto psicodélico australiano'
      }
    })
  ])

  console.log('✅ Created', artists.length, 'artists')

  // Create Events
  const now = new Date()
  const futureDate1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // +30 days
  const futureDate2 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) // +60 days
  const futureDate3 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // +90 days

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Daft Punk Alive Tour 2025',
        description: 'El icónico dúo francés regresa con su legendario show Alive. Una experiencia única de música electrónica en vivo con producción visual espectacular.',
        slug: 'daft-punk-alive-2025',
        venueId: venues[0].id,
        artistId: artists[0].id,
        date: futureDate1,
        doors: new Date(futureDate1.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
        price: 85000 * 100, // in cents
        currency: 'CLP',
        totalTickets: 10000,
        availableTickets: 10000,
        images: [
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
          'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec'
        ],
        genres: ['Electronic', 'House', 'Dance'],
        status: 'ON_SALE'
      }
    }),
    prisma.event.create({
      data: {
        title: 'The Weeknd - After Hours Tour',
        description: 'The Weeknd trae su aclamado tour "After Hours" a Chile. Una noche inolvidable con los mayores éxitos del artista canadiense.',
        slug: 'the-weeknd-after-hours',
        venueId: venues[0].id,
        artistId: artists[1].id,
        date: futureDate2,
        doors: new Date(futureDate2.getTime() - 2 * 60 * 60 * 1000),
        price: 95000 * 100,
        currency: 'CLP',
        totalTickets: 12000,
        availableTickets: 12000,
        images: [
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
          'https://images.unsplash.com/photo-1524650359799-842906ca1c06'
        ],
        genres: ['R&B', 'Pop'],
        status: 'ON_SALE'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Tame Impala en Club Chocolate',
        description: 'Show íntimo de Tame Impala en un venue reducido. Experiencia única de rock psicodélico.',
        slug: 'tame-impala-chocolate',
        venueId: venues[2].id,
        artistId: artists[2].id,
        date: futureDate3,
        doors: new Date(futureDate3.getTime() - 1 * 60 * 60 * 1000),
        price: 35000 * 100,
        currency: 'CLP',
        totalTickets: 500,
        availableTickets: 500,
        images: [
          'https://images.unsplash.com/photo-1524650359799-842906ca1c06'
        ],
        genres: ['Psychedelic', 'Rock'],
        status: 'ON_SALE'
      }
    })
  ])

  console.log('✅ Created', events.length, 'events')

  // Create Test User
  const testUser = await prisma.user.create({
    data: {
      email: 'test@ket.cl',
      firstName: 'Usuario',
      lastName: 'Prueba',
      emailVerified: new Date(),
      phone: '+56912345678',
      phoneVerified: new Date()
    }
  })

  console.log('✅ Created test user:', testUser.email)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
