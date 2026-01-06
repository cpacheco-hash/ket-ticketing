'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Link as LinkIcon, Check } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/lib/format'

interface ShareWidgetProps {
  event: {
    id: string
    title: string
    date: Date | string
    price: number
    venue: {
      name: string
      city: string
    }
    artist: {
      name: string
    }
  }
}

export function ShareWidget({ event }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ket.cl'}/events/${event.id}`
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date

  const shareToWhatsApp = () => {
    const message = generateWhatsAppMessage(event, shareUrl, eventDate)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const shareToTwitter = () => {
    const text = `🎵 ${event.title} - ${event.artist.name}\n📍 ${event.venue.name}\n📅 ${format(eventDate, 'dd MMM yyyy', { locale: es })}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Native share API (mobile)
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `${event.title} - ${event.artist.name}`,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled share
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5" />
        <h3 className="font-bold text-lg">Compartir evento</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* WhatsApp */}
        <Button
          onClick={shareToWhatsApp}
          variant="outline"
          className="border-white/20 hover:bg-green-600/20 hover:border-green-600"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </Button>

        {/* Twitter/X */}
        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="border-white/20 hover:bg-blue-500/20 hover:border-blue-500"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </Button>

        {/* Facebook */}
        <Button
          onClick={shareToFacebook}
          variant="outline"
          className="border-white/20 hover:bg-blue-600/20 hover:border-blue-600"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </Button>

        {/* Copy Link */}
        <Button
          onClick={copyLink}
          variant="outline"
          className="border-white/20"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-5 w-5 text-green-500" />
              Copiado
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-5 w-5" />
              Copiar link
            </>
          )}
        </Button>
      </div>

      {/* Native Share (Mobile) */}
      {typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined' && (
        <Button
          onClick={shareNative}
          variant="outline"
          className="w-full mt-2 border-white/20"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartir...
        </Button>
      )}
    </div>
  )
}

function generateWhatsAppMessage(
  event: ShareWidgetProps['event'],
  url: string,
  eventDate: Date
): string {
  return `
🎵 *${event.title}*

Artista: ${event.artist.name}
📍 ${event.venue.name}, ${event.venue.city}
📅 ${format(eventDate, "EEEE, dd 'de' MMMM 'a las' HH:mm", { locale: es })}
💰 Desde ${formatCurrency(event.price)}

¡Compra tu entrada!
${url}
  `.trim()
}
