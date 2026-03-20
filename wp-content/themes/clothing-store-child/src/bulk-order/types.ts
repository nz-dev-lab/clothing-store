export interface StoreProduct {
  id: number
  name: string
  prices: {
    price: string
    regular_price: string
    currency_code: string
    currency_minor_unit: number
  }
  images: { src: string; alt: string }[]
  permalink: string
}

export interface CartItem {
  productId: number
  quantity: number
}
