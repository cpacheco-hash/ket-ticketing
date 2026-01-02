import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  eventId: string
  eventTitle: string
  eventDate: Date
  venue: string
  quantity: number
  unitPrice: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (eventId: string) => void
  updateQuantity: (eventId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.eventId === item.eventId)

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.eventId === item.eventId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }

          return {
            items: [...state.items, item]
          }
        })
      },

      removeItem: (eventId) => {
        set((state) => ({
          items: state.items.filter((item) => item.eventId !== eventId)
        }))
      },

      updateQuantity: (eventId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(eventId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.eventId === eventId ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
      }
    }),
    {
      name: 'ket-cart-storage'
    }
  )
)
